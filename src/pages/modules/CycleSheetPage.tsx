import { useState } from 'react';
import {
  Button, Collapse, Descriptions, Divider, Empty, message, Tooltip,
} from 'antd';
import {
  CheckCircleOutlined, PlusOutlined, InfoCircleOutlined, EyeOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import EditableField from '../../components/common/EditableField';
import EvidenceTag from '../../components/common/EvidenceTag';
import ScriptWorkspace from '../../components/layout/ScriptWorkspace';
import { useScripts } from '../../context/ScriptContext';
import { useCanEdit } from '../../context/AuthContext';
import { MOCK_CYCLE_SHEET } from '../../utils/mock';
import {
  updateOverviewField,
  updateCoreCycleField,
  updateSubCycleField,
  updatePaywallField,
  updateKeyFrameField,
  updateInterlinkField,
  SHEET_STATUS_LABEL,
} from '../../utils/cycleSheetState';
import type { CycleSheet, CoreCycle, SubCycle, FieldRevision } from '../../types';

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="editorial-field-row">
      <div className="editorial-field-row-label">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function OverviewSection({ sheet, onSave, readOnly }: {
  sheet: CycleSheet;
  onSave: (key: keyof CycleSheet['overview'], value: string) => Promise<void>;
  readOnly: boolean;
}) {
  const { overview } = sheet;
  const items: { key: keyof CycleSheet['overview']; label: string; multiline?: boolean; readOnlyField?: boolean }[] = [
    { key: 'drama_title', label: '剧名' },
    { key: 'genre', label: '剧本类型' },
    { key: 'analysis_scope', label: '分析范围', readOnlyField: true },
    { key: 'selling_point', label: 'Selling Point', multiline: true },
    { key: 'core_conflict', label: 'Core Conflict', multiline: true },
    { key: 'core_expectation', label: 'Core Expectation', multiline: true },
  ];

  return (
    <div className="editorial-sheet-card">
      <div className="editorial-sheet-card-header">
        <h3 className="editorial-sheet-card-title">剧本概览</h3>
        <span className="editorial-pill">{SHEET_STATUS_LABEL[sheet.sheet_status]}</span>
      </div>
      <div className="editorial-sheet-card-body">
        <Descriptions column={2} size="small" bordered>
          {items.map(({ key, label, multiline, readOnlyField }) => (
            <Descriptions.Item key={key} label={label} span={multiline ? 2 : 1}>
              <EditableField
                field={overview[key]}
                multiline={multiline}
                readOnly={readOnly || readOnlyField}
                onSave={readOnly || readOnlyField ? undefined : (v) => onSave(key, v)}
              />
            </Descriptions.Item>
          ))}
          <Descriptions.Item label="AI 生成时间">{sheet.ai_generated_at}</Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
}

function PaywallBlock({ sub, readOnly, onSavePaywall }: {
  sub: SubCycle;
  readOnly: boolean;
  onSavePaywall: (subId: string, pwId: string, key: string, value: string) => Promise<void>;
}) {
  if (sub.paywalls.length === 0) return null;
  return (
    <div>
      <div className="editorial-field-row-label" style={{ marginBottom: 8 }}>付费卡点明细</div>
      {sub.paywalls.map((pw) => (
        <div key={pw.id} className="editorial-detail-block paywall">
          <div className="editorial-detail-meta">
            <span>第 {pw.episode} 集 · {pw.scene_id}</span>
            <span className="editorial-pill">
              {pw.paywall_type === 'hard' ? '硬付费' : '软付费'}
            </span>
            <span className="editorial-pill">强度 {pw.intensity}/5</span>
            <EvidenceTag support={pw.evidence_support} startEpisode={pw.episode} />
          </div>
          <FieldRow label="Paywall 描述">
            <EditableField field={pw.description} multiline readOnly={readOnly} onSave={readOnly ? undefined : (v) => onSavePaywall(sub.id, pw.id, 'description', v)} />
          </FieldRow>
          <FieldRow label="触发情绪">
            <EditableField field={pw.trigger_emotions} readOnly={readOnly} onSave={readOnly ? undefined : (v) => onSavePaywall(sub.id, pw.id, 'trigger_emotions', v)} />
          </FieldRow>
          <FieldRow label="未释放内容">
            <EditableField field={pw.unreleased_content} multiline readOnly={readOnly} onSave={readOnly ? undefined : (v) => onSavePaywall(sub.id, pw.id, 'unreleased_content', v)} />
          </FieldRow>
          <FieldRow label="付费诱因">
            <EditableField field={pw.payment_incentive} multiline readOnly={readOnly} onSave={readOnly ? undefined : (v) => onSavePaywall(sub.id, pw.id, 'payment_incentive', v)} />
          </FieldRow>
          <FieldRow label="判断依据">
            <EditableField field={pw.evidence} readOnly={readOnly} onSave={readOnly ? undefined : (v) => onSavePaywall(sub.id, pw.id, 'evidence', v)} />
          </FieldRow>
        </div>
      ))}
    </div>
  );
}

function KeyFrameBlock({ sub, readOnly, onSaveKf }: {
  sub: SubCycle;
  readOnly: boolean;
  onSaveKf: (subId: string, kfId: string, key: string, value: string) => Promise<void>;
}) {
  if (sub.key_frames.length === 0) return null;
  return (
    <div style={{ marginTop: 12 }}>
      <div className="editorial-field-row-label" style={{ marginBottom: 8 }}>关键画面明细</div>
      {sub.key_frames.map((kf) => (
        <div key={kf.id} className="editorial-detail-block keyframe">
          <div className="editorial-detail-meta">
            <span>第 {kf.episode} 集 · {kf.scene_id}</span>
            <EvidenceTag support={kf.evidence_support} startEpisode={kf.episode} />
          </div>
          <FieldRow label="画面描述">
            <EditableField field={kf.description} multiline readOnly={readOnly} onSave={readOnly ? undefined : (v) => onSaveKf(sub.id, kf.id, 'description', v)} />
          </FieldRow>
          <FieldRow label="表达情绪">
            <EditableField field={kf.expressed_emotions} readOnly={readOnly} onSave={readOnly ? undefined : (v) => onSaveKf(sub.id, kf.id, 'expressed_emotions', v)} />
          </FieldRow>
          <FieldRow label="投流价值">
            <EditableField field={kf.traffic_value} readOnly={readOnly} onSave={readOnly ? undefined : (v) => onSaveKf(sub.id, kf.id, 'traffic_value', v)} />
          </FieldRow>
          <FieldRow label="一句话投流包装">
            <EditableField field={kf.traffic_tagline} readOnly={readOnly} onSave={readOnly ? undefined : (v) => onSaveKf(sub.id, kf.id, 'traffic_tagline', v)} />
          </FieldRow>
          <FieldRow label="判断依据">
            <EditableField field={kf.evidence} readOnly={readOnly} onSave={readOnly ? undefined : (v) => onSaveKf(sub.id, kf.id, 'evidence', v)} />
          </FieldRow>
        </div>
      ))}
    </div>
  );
}

function SubCycleCard({ sub, index, readOnly, onSaveSub, onSavePaywall, onSaveKf }: {
  sub: SubCycle;
  index: number;
  readOnly: boolean;
  onSaveSub: (subId: string, key: string, value: string) => Promise<void>;
  onSavePaywall: (subId: string, pwId: string, key: string, value: string) => Promise<void>;
  onSaveKf: (subId: string, kfId: string, key: string, value: string) => Promise<void>;
}) {
  const subFields: { key: keyof SubCycle; label: string; multiline?: boolean }[] = [
    { key: 'coverage', label: '覆盖集数 / 场次' },
    { key: 'sub_cycle_type', label: 'Sub Cycle 类型' },
    { key: 'flow', label: 'Flow', multiline: true },
    { key: 'twist', label: 'Twist', multiline: true },
    { key: 'paywall_summary', label: 'Paywall（摘要）', multiline: true },
    { key: 'key_frame_summary', label: 'Key Frame（摘要）', multiline: true },
    { key: 'primary_emotion', label: '主情绪' },
    { key: 'secondary_emotions', label: '副情绪' },
    { key: 'plot_function', label: '剧情功能' },
    { key: 'commercial_value', label: '商业价值判断', multiline: true },
    { key: 'evidence', label: '判断依据' },
  ];

  const isWarn = sub.evidence_support === 'unsupported' || sub.start_episode > 10;

  return (
    <div className={`editorial-sub-cycle${isWarn ? ' warn' : ''}`}>
      <div className="editorial-sub-cycle-header">
        <span className="editorial-sub-cycle-title">子循环 {index + 1}</span>
        <span className="editorial-pill">第 {sub.start_episode}–{sub.end_episode} 集</span>
        <EvidenceTag support={sub.evidence_support} startEpisode={sub.start_episode} />
      </div>
      {subFields.map(({ key, label, multiline }) => (
        <FieldRow key={key} label={label}>
          <EditableField
            field={sub[key] as FieldRevision}
            multiline={multiline}
            readOnly={readOnly}
            onSave={readOnly ? undefined : (v) => onSaveSub(sub.id, key, v)}
          />
        </FieldRow>
      ))}
      <PaywallBlock sub={sub} readOnly={readOnly} onSavePaywall={onSavePaywall} />
      <KeyFrameBlock sub={sub} readOnly={readOnly} onSaveKf={onSaveKf} />
    </div>
  );
}

function CoreCyclePanel({ cycle, readOnly, handlers }: {
  cycle: CoreCycle;
  readOnly: boolean;
  handlers: {
    onCore: (key: string, value: string) => Promise<void>;
    onSub: (subId: string, key: string, value: string) => Promise<void>;
    onPaywall: (subId: string, pwId: string, key: string, value: string) => Promise<void>;
    onKf: (subId: string, kfId: string, key: string, value: string) => Promise<void>;
    onInterlink: (ilId: string, key: string, value: string) => Promise<void>;
  };
}) {
  const coreFields: { key: keyof CoreCycle; label: string; multiline?: boolean }[] = [
    { key: 'stage_title', label: '阶段标题' },
    { key: 'stage_goal', label: '阶段目标', multiline: true },
    { key: 'protagonist_goal', label: '主角欲望 / 目标', multiline: true },
    { key: 'main_obstacle', label: '主要阻碍 / 冲突', multiline: true },
    { key: 'emotion_escalation', label: '情绪升级路径', multiline: true },
    { key: 'relationship_change', label: '人物关系变化', multiline: true },
    { key: 'stage_release', label: '阶段释放点', multiline: true },
    { key: 'new_hook', label: '新问题 / 新钩子', multiline: true },
    { key: 'commercial_value', label: '商业价值判断', multiline: true },
  ];

  return (
    <div style={{ width: '100%' }}>
      <Descriptions column={1} size="small" bordered>
        {coreFields.map(({ key, label, multiline }) => (
          <Descriptions.Item key={key} label={label}>
            <EditableField
              field={cycle[key] as FieldRevision}
              multiline={multiline}
              readOnly={readOnly}
              onSave={readOnly ? undefined : (v) => handlers.onCore(key, v)}
            />
          </Descriptions.Item>
        ))}
      </Descriptions>

      {cycle.interlinks.length > 0 && (
        <>
          <Divider style={{ margin: '16px 0' }} />
          <div className="editorial-field-row-label" style={{ marginBottom: 12 }}>剧情衔接</div>
          {cycle.interlinks.map((il) => (
            <div key={il.id} className="editorial-detail-block" style={{ marginBottom: 8 }}>
              <FieldRow label="位置">
                <EditableField field={il.position} readOnly={readOnly} onSave={readOnly ? undefined : (v) => handlers.onInterlink(il.id, 'position', v)} />
              </FieldRow>
              <FieldRow label="衔接内容">
                <EditableField field={il.content} multiline readOnly={readOnly} onSave={readOnly ? undefined : (v) => handlers.onInterlink(il.id, 'content', v)} />
              </FieldRow>
              <FieldRow label="动机补足">
                <EditableField field={il.motivation} multiline readOnly={readOnly} onSave={readOnly ? undefined : (v) => handlers.onInterlink(il.id, 'motivation', v)} />
              </FieldRow>
              <FieldRow label="情绪过渡作用">
                <EditableField field={il.emotion_transition} multiline readOnly={readOnly} onSave={readOnly ? undefined : (v) => handlers.onInterlink(il.id, 'emotion_transition', v)} />
              </FieldRow>
            </div>
          ))}
        </>
      )}

      <Divider style={{ margin: '16px 0' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span className="editorial-sub-cycle-title">子循环</span>
        <span className="editorial-pill">{cycle.sub_cycles.length} 个</span>
      </div>
      {cycle.sub_cycles.length === 0 ? (
        <Empty description="暂无 Sub Cycle" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        cycle.sub_cycles.map((sub, index) => (
          <SubCycleCard
            key={sub.id}
            sub={sub}
            index={index}
            readOnly={readOnly}
            onSaveSub={(subId, key, v) => handlers.onSub(subId, key, v)}
            onSavePaywall={(subId, pwId, key, v) => handlers.onPaywall(subId, pwId, key, v)}
            onSaveKf={(subId, kfId, key, v) => handlers.onKf(subId, kfId, key, v)}
          />
        ))
      )}
    </div>
  );
}

export default function CycleSheetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scriptId = Number(id);
  const { getScript, confirmCycleSheet } = useScripts();
  const canEdit = useCanEdit();
  const script = getScript(scriptId);
  const [sheet, setSheet] = useState<CycleSheet>(MOCK_CYCLE_SHEET);

  if (!script) return <div>剧本不存在</div>;

  if (script.module5_status === 'not_started') {
    return (
      <ScriptWorkspace pageTitle="情节结构">
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-ink-secondary)' }}>
          情节结构尚未生成，请先前往分析任务页触发分析
          <br />
          <Button type="link" onClick={() => navigate(`/scripts/${id}/analyze`)}>
            前往分析任务
          </Button>
        </div>
      </ScriptWorkspace>
    );
  }

  const guardEdit = () => {
    if (!canEdit) {
      message.error('无编辑权限');
      throw new Error('forbidden');
    }
  };

  const handleOverviewSave = async (key: keyof CycleSheet['overview'], value: string) => {
    guardEdit();
    await new Promise((r) => setTimeout(r, 200));
    setSheet((prev) => updateOverviewField(prev, key, value));
  };

  const makeCycleHandlers = (cycleId: string) => ({
    onCore: async (key: string, value: string) => {
      guardEdit();
      await new Promise((r) => setTimeout(r, 150));
      setSheet((prev) => updateCoreCycleField(prev, cycleId, key as Parameters<typeof updateCoreCycleField>[2], value));
    },
    onSub: async (subId: string, key: string, value: string) => {
      guardEdit();
      await new Promise((r) => setTimeout(r, 150));
      setSheet((prev) => updateSubCycleField(prev, cycleId, subId, key as Parameters<typeof updateSubCycleField>[3], value));
    },
    onPaywall: async (subId: string, pwId: string, key: string, value: string) => {
      guardEdit();
      await new Promise((r) => setTimeout(r, 150));
      setSheet((prev) => updatePaywallField(prev, cycleId, subId, pwId, key as Parameters<typeof updatePaywallField>[4], value));
    },
    onKf: async (subId: string, kfId: string, key: string, value: string) => {
      guardEdit();
      await new Promise((r) => setTimeout(r, 150));
      setSheet((prev) => updateKeyFrameField(prev, cycleId, subId, kfId, key as Parameters<typeof updateKeyFrameField>[4], value));
    },
    onInterlink: async (ilId: string, key: string, value: string) => {
      guardEdit();
      await new Promise((r) => setTimeout(r, 150));
      setSheet((prev) => updateInterlinkField(prev, cycleId, ilId, key as Parameters<typeof updateInterlinkField>[3], value));
    },
  });

  const handleConfirm = async () => {
    await new Promise((r) => setTimeout(r, 500));
    const confirmedBy = canEdit ? '张编剧' : '当前用户';
    setSheet((prev) => ({
      ...prev,
      sheet_status: 'confirmed',
      confirmed_by: confirmedBy,
      confirmed_at: new Date().toISOString(),
    }));
    confirmCycleSheet(scriptId, confirmedBy);
    message.success('Cycle Sheet 已确认');
  };

  const isConfirmed = script.cycle_sheet_confirmed || sheet.sheet_status === 'confirmed' || !!sheet.confirmed_by;
  const showDraftBanner = script.module5_draft_only
    || script.module1_status !== 'success'
    || script.module2_status !== 'success';

  const collapseItems = sheet.core_cycles.map((cycle) => {
    const isWarn = cycle.evidence_support === 'unsupported' || cycle.start_episode > 10;
    return {
      key: cycle.id,
      className: isWarn ? 'warn' : undefined,
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span>阶段循环 {cycle.cycle_number}</span>
          <span className="editorial-pill">第 {cycle.start_episode}–{cycle.end_episode} 集</span>
          <EvidenceTag support={cycle.evidence_support} startEpisode={cycle.start_episode} />
          {cycle.stage_title.value && (
            <span style={{ fontSize: 12, color: 'var(--color-ink-muted)' }}>
              「{cycle.stage_title.value}」
            </span>
          )}
        </span>
      ),
      children: (
        <CoreCyclePanel cycle={cycle} readOnly={!canEdit} handlers={makeCycleHandlers(cycle.id)} />
      ),
    };
  });

  return (
    <ScriptWorkspace
      pageTitle="情节结构"
      pageSub={`v${sheet.version} · ${SHEET_STATUS_LABEL[sheet.sheet_status]}`}
      actions={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {isConfirmed ? (
            <span className="editorial-status-badge confirmed">
              已确认 · {sheet.confirmed_by}
            </span>
          ) : (
            <span className="editorial-status-badge pending">待编剧确认</span>
          )}
          {!canEdit && (
            <span className="editorial-pill">
              <EyeOutlined /> 浏览模式
            </span>
          )}
          {!isConfirmed && (
            <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleConfirm}>
              确认 Cycle Sheet
            </Button>
          )}
        </div>
      }
    >
      {showDraftBanner && (
        <div className="editorial-hint" style={{ borderColor: '#e8d4c4', background: '#faf6ee' }}>
          当前 Cycle Sheet 为初稿，全剧均未经过模块 1/2 校验。
        </div>
      )}

      {!canEdit && (
        <div className="editorial-hint">
          当前为浏览模式，字段编辑仅管理员可用。所有用户均可执行 Cycle Sheet 确认。
        </div>
      )}

      <OverviewSection sheet={sheet} onSave={handleOverviewSave} readOnly={!canEdit} />

      <div className="editorial-sheet-card">
        <div className="editorial-sheet-card-header">
          <h3 className="editorial-sheet-card-title">
            阶段循环
            <Tooltip title="每个阶段约 3–5 集，代表一段完整的情节弧线">
              <InfoCircleOutlined style={{ marginLeft: 8, color: 'var(--color-ink-muted)', fontSize: 14 }} />
            </Tooltip>
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="editorial-pill">{sheet.core_cycles.length} 个阶段</span>
            {canEdit && (
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => message.info('增删 Core Cycle 二期完善')}
              >
                添加阶段
              </Button>
            )}
          </div>
        </div>
        <div className="editorial-sheet-card-body" style={{ padding: '12px 16px' }}>
          <Collapse
            className="editorial-collapse-panel"
            items={collapseItems}
            defaultActiveKey={[sheet.core_cycles[0]?.id]}
          />
        </div>
      </div>
    </ScriptWorkspace>
  );
}
