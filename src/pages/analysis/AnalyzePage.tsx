import { useState } from 'react';
import {
  Card, Checkbox, Button, Timeline, Typography, Space, Divider,
  Alert, Spin, message,
} from 'antd';
import {
  PlayCircleOutlined, CheckCircleFilled,
  ClockCircleFilled, ExclamationCircleFilled, LoadingOutlined,
} from '@ant-design/icons';
import ScriptWorkspace from '../../components/layout/ScriptWorkspace';
import { useNavigate, useParams } from 'react-router-dom';
import { TaskStatusBadge } from '../../components/common/StatusBadge';
import { useScripts } from '../../context/ScriptContext';
import { MOCK_TASKS } from '../../utils/mock';
import type { AnalysisTask } from '../../types';

const { Text } = Typography;

const MODULE_INFO = {
  module1: {
    label: '前 10 集观察报告',
    desc: '提取每集核心事件、开头方式、冲突对象、关系变化等观察字段',
    scope: '前 10 集',
    deps: [] as string[],
  },
  module2: {
    label: '情绪曲线',
    desc: '识别每集主导情绪类型与强度，生成情绪变化曲线',
    scope: '前 10 集',
    deps: [] as string[],
  },
  module5: {
    label: '情节结构（Cycle Sheet）',
    desc: '生成分层情节结构：Core Cycle / Sub Cycle / Paywall / Key Frame；可单独生成初稿',
    scope: '全剧（单独生成时全剧未经模块 1/2 校验）',
    deps: [] as string[],
  },
};

function taskIcon(status: string) {
  if (status === 'success') return <CheckCircleFilled style={{ color: '#2d5a4a' }} />;
  if (status === 'in_progress') return <LoadingOutlined style={{ color: '#2d5a4a' }} />;
  if (status === 'fail') return <ExclamationCircleFilled style={{ color: '#9b3d3d' }} />;
  if (status === 'awaiting_review') return <ClockCircleFilled style={{ color: '#a67c52' }} />;
  return <ClockCircleFilled style={{ color: '#c4bdb4' }} />;
}

function AnalyzePageContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scriptId = Number(id);
  const { getScript } = useScripts();
  const script = getScript(scriptId);

  const [selected, setSelected] = useState<('module1' | 'module2' | 'module5')[]>([]);
  const [tasks] = useState<AnalysisTask[]>(
    () => MOCK_TASKS.filter((t) => t.script_id === scriptId),
  );
  const [running, setRunning] = useState(false);

  if (!script) return <div>剧本不存在</div>;

  const toggle = (mod: 'module1' | 'module2' | 'module5') => {
    setSelected((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod],
    );
  };

  const handleRun = async () => {
    if (selected.length === 0) {
      message.warning('请至少选择一个模块');
      return;
    }
    setRunning(true);
    await new Promise((r) => setTimeout(r, 1500));
    setRunning(false);
    message.success('分析任务已提交（Mock）');
  };

  const timelineItems = tasks.length === 0 ? [] : tasks.map((t) => ({
    dot: taskIcon(t.status),
    children: (
      <Space size={8} wrap>
        <Text>{MODULE_INFO[t.module]?.label}</Text>
        <TaskStatusBadge status={t.status} />
        {t.finished_at && (
          <Text type="secondary" style={{ fontSize: 12 }}>{t.finished_at}</Text>
        )}
        {t.error_msg && (
          <Text type="danger" style={{ fontSize: 12 }}>{t.error_msg}</Text>
        )}
        {t.status === 'success' && t.module === 'module1' && (
          <a onClick={() => navigate(`/scripts/${id}/module1`)}>查看结果</a>
        )}
        {t.status === 'success' && t.module === 'module2' && (
          <a onClick={() => navigate(`/scripts/${id}/module2`)}>查看结果</a>
        )}
        {(t.status === 'success' || t.status === 'awaiting_review') && t.module === 'module5' && (
          <a onClick={() => navigate(`/scripts/${id}/cyclesheet`)}>查看 Cycle Sheet</a>
        )}
        {t.status === 'fail' && (
          <a onClick={handleRun}>重新生成</a>
        )}
      </Space>
    ),
  }));

  return (
    <ScriptWorkspace pageTitle="分析任务" pageSub="选择模块并查看任务历史">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 900 }}>
        <Card title="选择分析模块" size="small">
          <Space direction="vertical" style={{ width: '100%' }} size={12}>
            {(Object.keys(MODULE_INFO) as Array<keyof typeof MODULE_INFO>).map((mod) => {
              const info = MODULE_INFO[mod];
              const isChecked = selected.includes(mod);
              return (
                <div
                  key={mod}
                  onClick={() => toggle(mod)}
                  style={{
                    padding: '10px 12px',
                    border: `1px solid ${isChecked ? '#2d5a4a' : 'var(--color-border)'}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: isChecked ? 'var(--color-accent-soft)' : 'var(--color-paper)',
                    transition: 'all 0.2s',
                  }}
                >
                  <Space align="start">
                    <Checkbox checked={isChecked} />
                    <div>
                      <Text strong style={{ fontSize: 13 }}>{info.label}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>{info.desc}</Text>
                      <br />
                      <Text style={{ fontSize: 11, color: '#8c8c8c' }}>
                        范围：{info.scope}
                        {info.deps.length > 0 && ` · 依赖：${info.deps.join(', ')}`}
                      </Text>
                    </div>
                  </Space>
                </div>
              );
            })}
          </Space>

          <Divider style={{ margin: '12px 0' }} />

          {selected.includes('module5') && !selected.includes('module1') && !selected.includes('module2') && (
            <Alert
              type="info"
              message="单独生成情节结构将以初稿模式输出，全剧未经前 10 集观察报告与情绪曲线校验"
              style={{ marginBottom: 12, fontSize: 12 }}
              showIcon
            />
          )}

          <Button
            type="primary"
            icon={running ? <Spin size="small" /> : <PlayCircleOutlined />}
            block
            onClick={handleRun}
            loading={running}
            disabled={selected.length === 0}
          >
            开始分析
          </Button>
        </Card>

        <Card title="任务历史" size="small">
          {tasks.length === 0 ? (
            <Text type="secondary">暂无任务记录，请选择模块并开始分析</Text>
          ) : (
            <Timeline items={timelineItems} style={{ marginTop: 8 }} />
          )}
        </Card>
      </div>
    </ScriptWorkspace>
  );
}

export default function AnalyzePage() {
  return <AnalyzePageContent />;
}
