import { useMemo, useState } from 'react';
import { Button, Space, Tooltip, message, Modal } from 'antd';
import { InfoCircleOutlined, EyeOutlined, CheckOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import EditableField from '../../components/common/EditableField';
import { FieldRevisionBadge } from '../../components/common/StatusBadge';
import ScriptWorkspace from '../../components/layout/ScriptWorkspace';
import { useScripts } from '../../context/ScriptContext';
import { useCanEdit } from '../../context/AuthContext';
import { MOCK_MODULE2 } from '../../utils/mock';
import { patchField } from '../../utils/fieldRevision';
import type { Module2Episode, EmotionType, FieldRevisionStatus } from '../../types';

const EMOTION_CONFIG: Record<EmotionType, { label: string; color: string }> = {
  shame: { label: '羞辱感', color: '#8b5a5a' },
  betrayal: { label: '背叛感', color: '#6b4f8a' },
  misunderstanding: { label: '误会感', color: '#7a6294' },
  oppression: { label: '压迫感', color: '#5c534a' },
  heartache: { label: '心疼感', color: '#9b5a7a' },
  rage: { label: '愤怒感', color: '#a65a3a' },
  ambiguity: { label: '暧昧感', color: '#9b6a82' },
  satisfaction: { label: '爽感', color: '#2d5a4a' },
  suspense: { label: '悬念感', color: '#4a6b7a' },
  regret: { label: '后悔感', color: '#5c6b8a' },
  crisis: { label: '危机感', color: '#8b3d3d' },
  sweetness: { label: '甜感', color: '#a67c52' },
  other: { label: '其他', color: '#9c948c' },
};

const FIELD_LABELS: {
  key: keyof Omit<Module2Episode, 'episode_number' | 'primary_emotion'>;
  label: string;
  tip: string;
  multiline?: boolean;
}[] = [
  { key: 'secondary_emotions', label: '副情绪', tip: '本集辅助情绪类型' },
  { key: 'emotion_direction', label: '情绪方向', tip: '正向 / 负向 / 中性 / 转折' },
  { key: 'emotion_intensity', label: '情绪强度', tip: '0–5 分' },
  { key: 'peak_event', label: '情绪峰值事件', tip: '本集最强情绪触发事件', multiline: true },
  { key: 'emotion_change', label: '情绪变化', tip: '本集情绪如何变化', multiline: true },
  { key: 'ending_emotion', label: '结尾情绪', tip: '本集结尾时观众感受' },
  { key: 'hook_intensity', label: '卡点强度', tip: '结尾钩子强度 0–5' },
  { key: 'traffic_value', label: '投流价值', tip: '是否适合投流切片', multiline: true },
  { key: 'evidence', label: '判断依据', tip: '对应集数 / 场次引用' },
];

export default function Module2Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scriptId = Number(id);
  const { getScript } = useScripts();
  const canEdit = useCanEdit();
  const script = getScript(scriptId);
  const [episodes, setEpisodes] = useState<Module2Episode[]>(MOCK_MODULE2);
  const [selectedEp, setSelectedEp] = useState(1);

  const aiPendingCount = useMemo(
    () =>
      episodes.reduce(
        (acc, ep) =>
          acc + FIELD_LABELS.filter((f) => ep[f.key].status === 'ai_generated').length,
        0,
      ),
    [episodes],
  );

  const currentEpisode = episodes.find((ep) => ep.episode_number === selectedEp);

  const reviewedCount = episodes.reduce(
    (acc, ep) =>
      acc
      + FIELD_LABELS.filter((f) => {
        const s = ep[f.key].status;
        return s === 'confirmed' || s === 'modified' || s === 'pending_review';
      }).length,
    0,
  );
  const total = episodes.length * FIELD_LABELS.length;

  if (!script) return <div>剧本不存在</div>;

  if (script.module2_status !== 'success') {
    return (
      <ScriptWorkspace pageTitle="情绪曲线">
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-ink-secondary)' }}>
          情绪曲线尚未生成，请先前往分析任务页触发分析
          <br />
          <Button type="link" onClick={() => navigate(`/scripts/${id}/analyze`)}>
            前往分析任务
          </Button>
        </div>
      </ScriptWorkspace>
    );
  }

  const handleConfirm = async (
    episodeNumber: number,
    field: keyof Omit<Module2Episode, 'episode_number' | 'primary_emotion'>,
    value: string,
  ) => {
    if (!canEdit) {
      message.error('无编辑权限');
      return;
    }
    await new Promise((r) => setTimeout(r, 200));
    setEpisodes((prev) =>
      prev.map((ep) => {
        if (ep.episode_number !== episodeNumber) return ep;
        const prevField = ep[field];
        const unchanged = value.trim() === prevField.value.trim();
        const status: FieldRevisionStatus = unchanged ? 'confirmed' : 'modified';
        return { ...ep, [field]: patchField(prevField, value, status) };
      }),
    );
  };

  const handleConfirmAll = () => {
    if (aiPendingCount === 0) return;
    Modal.confirm({
      title: '一键确认全部 AI 字段',
      content: (
        <span>
          将把 <strong>{aiPendingCount}</strong> 个「AI 生成」字段标记为「已确认」。
        </span>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setEpisodes((prev) =>
          prev.map((ep) => {
            const next = { ...ep };
            for (const { key } of FIELD_LABELS) {
              if (next[key].status === 'ai_generated') {
                next[key] = patchField(next[key], next[key].value, 'confirmed');
              }
            }
            return next;
          }),
        );
        message.success(`已确认 ${aiPendingCount} 个字段`);
      },
    });
  };

  const chartData = episodes.map((ep) => ({
    name: `第${ep.episode_number}集`,
    intensity: Number(ep.emotion_intensity.value) || 0,
    emotion: EMOTION_CONFIG[ep.primary_emotion]?.label,
  }));

  return (
    <ScriptWorkspace
      pageTitle="情绪曲线"
      pageSub={`前 ${episodes.length} 集 · 强度走势与逐集复核`}
      actions={
        <Space wrap>
          {!canEdit && (
            <span className="editorial-pill">
              <EyeOutlined /> 浏览模式
            </span>
          )}
          <span className="editorial-pill">
            已处理 {reviewedCount}/{total}
          </span>
          {canEdit && (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              disabled={aiPendingCount === 0}
              onClick={handleConfirmAll}
            >
              一键确认{aiPendingCount > 0 ? `（${aiPendingCount}）` : ''}
            </Button>
          )}
        </Space>
      }
    >
      {!canEdit && (
        <div className="editorial-hint">
          当前为浏览模式，字段编辑仅管理员可用。
        </div>
      )}

      <div className="editorial-chart-card">
        <h3 className="editorial-chart-title">情绪强度曲线</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d4" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b6560' }} />
            <YAxis
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
              tick={{ fontSize: 11, fill: '#6b6560' }}
            />
            <ReTooltip
              contentStyle={{
                background: '#fffcf7',
                border: '1px solid #e8e0d4',
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value, _name, props) => [
                `${value}/5（${(props as { payload?: { emotion?: string } }).payload?.emotion}）`,
                '情绪强度',
              ]}
            />
            <ReferenceLine
              y={4}
              stroke="#a67c52"
              strokeDasharray="4 4"
              label={{ value: '高强度线', fill: '#a67c52', fontSize: 11 }}
            />
            <Area
              type="monotone"
              dataKey="intensity"
              stroke="#2d5a4a"
              fill="#e8f0ec"
              strokeWidth={2}
              dot={{ fill: '#2d5a4a', r: 4 }}
              activeDot={{ r: 5, fill: '#8b2942' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="editorial-report">
        <nav className="editorial-report-nav" aria-label="集数导航">
          {episodes.map((ep) => {
            const emotion = EMOTION_CONFIG[ep.primary_emotion];
            return (
              <button
                key={ep.episode_number}
                type="button"
                className={`editorial-report-nav-btn${
                  selectedEp === ep.episode_number ? ' active' : ''
                }`}
                onClick={() => setSelectedEp(ep.episode_number)}
              >
                第 {ep.episode_number} 集
                <span
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontFamily: 'var(--font-body)',
                    color: 'var(--color-ink-muted)',
                    marginTop: 2,
                  }}
                >
                  {emotion.label}
                </span>
              </button>
            );
          })}
        </nav>

        {currentEpisode && (
          <article className="editorial-report-body">
            <h3 className="editorial-report-ep-heading">
              第 {currentEpisode.episode_number} 集
            </h3>

            <section className="editorial-report-field" style={{ marginBottom: 24 }}>
              <header className="editorial-report-field-header">
                <span className="editorial-report-field-label">主情绪</span>
              </header>
              <span className="editorial-emotion-pill">
                <span
                  className="editorial-emotion-pill-dot"
                  style={{
                    background: EMOTION_CONFIG[currentEpisode.primary_emotion].color,
                  }}
                />
                {EMOTION_CONFIG[currentEpisode.primary_emotion].label}
              </span>
            </section>

            {FIELD_LABELS.map(({ key, label, tip, multiline }) => (
              <section key={key} className="editorial-report-field">
                <header className="editorial-report-field-header">
                  <span className="editorial-report-field-label">{label}</span>
                  <Tooltip title={tip}>
                    <InfoCircleOutlined className="editorial-report-field-tip" />
                  </Tooltip>
                  <FieldRevisionBadge
                    status={currentEpisode[key].status}
                    variant="editorial"
                  />
                </header>
                <div className="editorial-report-field-content">
                  <EditableField
                    field={currentEpisode[key]}
                    multiline={multiline}
                    placeholder={`填写${label}`}
                    readOnly={!canEdit}
                    confirmMode="icon"
                    closeOnClickOutside
                    onConfirm={
                      canEdit
                        ? (value) =>
                            handleConfirm(currentEpisode.episode_number, key, value)
                        : undefined
                    }
                  />
                </div>
              </section>
            ))}
          </article>
        )}
      </div>

      <div className="editorial-report-progress">
        共 {episodes.length} 集 · 主情绪 + {FIELD_LABELS.length} 个维度
      </div>
    </ScriptWorkspace>
  );
}
