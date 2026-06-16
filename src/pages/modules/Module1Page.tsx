import { useMemo, useState } from 'react';
import { Button, Space, Tooltip, message, Modal } from 'antd';
import { InfoCircleOutlined, EyeOutlined, CheckOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import EditableField from '../../components/common/EditableField';
import { FieldRevisionBadge } from '../../components/common/StatusBadge';
import ScriptWorkspace from '../../components/layout/ScriptWorkspace';
import { useScripts } from '../../context/ScriptContext';
import { useCanEdit } from '../../context/AuthContext';
import { MOCK_MODULE1 } from '../../utils/mock';
import { patchField } from '../../utils/fieldRevision';
import type { Module1Episode, FieldRevisionStatus } from '../../types';

const FIELD_LABELS: { key: keyof Omit<Module1Episode, 'episode_number'>; label: string; tip: string }[] = [
  { key: 'core_event', label: '本集核心事件', tip: '本集推动主线的最重要事件' },
  { key: 'opening_style', label: '开头方式', tip: '本集如何开场、建立情境' },
  { key: 'main_conflict_target', label: '主要冲突对象', tip: '本集主要矛盾或对抗方' },
  { key: 'relationship_change', label: '人物关系变化', tip: '主要人物关系在本集的变化' },
  { key: 'info_increment', label: '信息增量', tip: '本集新增的关键信息' },
  { key: 'ending_style', label: '结尾方式', tip: '本集如何收束、是否留钩' },
  { key: 'streaming_clip', label: '投流片段', tip: '适合投流切片的高光片段' },
];

export default function Module1Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scriptId = Number(id);
  const { getScript } = useScripts();
  const canEdit = useCanEdit();
  const script = getScript(scriptId);
  const [episodes, setEpisodes] = useState<Module1Episode[]>(MOCK_MODULE1);
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

  const reviewedCount = episodes.reduce((acc, ep) => {
    return acc + FIELD_LABELS.filter((f) => {
      const s = ep[f.key].status;
      return s === 'confirmed' || s === 'modified' || s === 'pending_review';
    }).length;
  }, 0);
  const total = episodes.length * FIELD_LABELS.length;

  if (!script) return <div>剧本不存在</div>;

  if (script.module1_status !== 'success') {
    return (
      <ScriptWorkspace pageTitle="前 10 集观察报告">
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-ink-secondary)' }}>
          模块 1 尚未生成，请先前往分析任务页触发分析
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
    field: keyof Omit<Module1Episode, 'episode_number'>,
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
          已修改、存疑的字段不受影响。
        </span>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await new Promise((r) => setTimeout(r, 300));
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

  return (
    <ScriptWorkspace
      pageTitle="前 10 集观察报告"
      pageSub={`前 ${episodes.length} 集 · 逐集阅读与复核`}
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
      {canEdit ? (
        <div className="editorial-hint">
          点击字段进入编辑，点右侧绿色对号确认；点击其它区域取消编辑。大部分字段可用右上角「一键确认」批量通过。
        </div>
      ) : (
        <div className="editorial-hint">
          当前为浏览模式，字段编辑仅管理员可用。您可查看全部 AI 生成结果与复核状态。
        </div>
      )}

      <div className="editorial-report">
        <nav className="editorial-report-nav" aria-label="集数导航">
          {episodes.map((ep) => (
            <button
              key={ep.episode_number}
              type="button"
              className={`editorial-report-nav-btn${
                selectedEp === ep.episode_number ? ' active' : ''
              }`}
              onClick={() => setSelectedEp(ep.episode_number)}
            >
              第 {ep.episode_number} 集
            </button>
          ))}
        </nav>

        {currentEpisode && (
          <article className="editorial-report-body">
            <h3 className="editorial-report-ep-heading">
              第 {currentEpisode.episode_number} 集
            </h3>

            {FIELD_LABELS.map(({ key, label, tip }) => (
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
                    multiline
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
        共 {episodes.length} 集 · {FIELD_LABELS.length} 个观察维度
      </div>
    </ScriptWorkspace>
  );
}
