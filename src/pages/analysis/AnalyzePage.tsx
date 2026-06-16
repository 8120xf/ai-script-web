import { useState } from 'react';
import {
  Card, Checkbox, Button, Timeline, Tag, Typography, Space, Divider,
  Alert, Spin, message,
} from 'antd';
import {
  PlayCircleOutlined, ArrowLeftOutlined, CheckCircleFilled,
  ClockCircleFilled, ExclamationCircleFilled, LoadingOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { TaskStatusBadge } from '../../components/common/StatusBadge';
import { MOCK_SCRIPTS, MOCK_TASKS } from '../../utils/mock';
import type { AnalysisTask } from '../../types';

const { Title, Text } = Typography;

const MODULE_INFO = {
  module1: {
    label: '模块1：单本剧本观察',
    desc: '提取每集核心事件、人物变化、冲突点、转折点和钩子',
    scope: '全集',
    deps: [] as string[],
  },
  module2: {
    label: '模块2：情绪曲线识别',
    desc: '识别每集主导情绪类型与强度，生成情绪变化曲线',
    scope: '全集',
    deps: [] as string[],
  },
  module5: {
    label: 'Cycle Sheet：情节结构提取',
    desc: '基于模块1/2 生成分层情节结构：Core Cycle / Sub Cycle / Paywall / Key Frame',
    scope: '全集（超出前10集的部分需人工复核）',
    deps: ['module1', 'module2'],
  },
};

function taskIcon(status: string) {
  if (status === 'success') return <CheckCircleFilled style={{ color: '#52c41a' }} />;
  if (status === 'in_progress') return <LoadingOutlined style={{ color: '#1677ff' }} />;
  if (status === 'fail') return <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />;
  if (status === 'awaiting_review') return <ClockCircleFilled style={{ color: '#faad14' }} />;
  return <ClockCircleFilled style={{ color: '#d9d9d9' }} />;
}

export default function AnalyzePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const script = MOCK_SCRIPTS.find((s) => s.id === Number(id));

  const [selected, setSelected] = useState<('module1' | 'module2' | 'module5')[]>([]);
  const [tasks] = useState<AnalysisTask[]>(MOCK_TASKS);
  const [running, setRunning] = useState(false);

  if (!script) return <div>剧本不存在</div>;

  const toggle = (mod: 'module1' | 'module2' | 'module5') => {
    setSelected((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const handleRun = async () => {
    if (selected.length === 0) {
      message.warning('请至少选择一个模块');
      return;
    }
    if (selected.includes('module5') && !selected.includes('module1') && !selected.includes('module2')) {
      const m1Done = tasks.find((t) => t.module === 'module1')?.status === 'success';
      const m2Done = tasks.find((t) => t.module === 'module2')?.status === 'success';
      if (!m1Done || !m2Done) {
        message.warning('Cycle Sheet 需要模块1和模块2已完成或一同选中');
        return;
      }
    }
    setRunning(true);
    await new Promise((r) => setTimeout(r, 1500));
    setRunning(false);
    message.success('分析任务已提交（Mock）');
  };

  const timelineItems = tasks.map((t) => ({
    dot: taskIcon(t.status),
    children: (
      <Space size={8}>
        <Text>{MODULE_INFO[t.module]?.label}</Text>
        <TaskStatusBadge status={t.status} />
        {t.finished_at && (
          <Text type="secondary" style={{ fontSize: 12 }}>{t.finished_at}</Text>
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
      </Space>
    ),
  }));

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Space style={{ marginBottom: 20 }}>
        <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate('/scripts')} />
        <Title level={4} style={{ margin: 0 }}>
          《{script.title}》分析任务
        </Title>
        <Tag color={script.tier === 'S' ? 'gold' : 'blue'}>{script.tier} 级</Tag>
      </Space>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
                    border: `1px solid ${isChecked ? '#1677ff' : '#e8e8e8'}`,
                    borderRadius: 6,
                    cursor: 'pointer',
                    background: isChecked ? '#e6f4ff' : '#fff',
                    transition: 'all 0.2s',
                  }}
                >
                  <Space>
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

          {selected.includes('module5') && selected.length === 1 && (
            <Alert
              type="warning"
              message="Cycle Sheet 需要模块1和模块2已完成"
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
            <Text type="secondary">暂无任务记录</Text>
          ) : (
            <Timeline items={timelineItems} style={{ marginTop: 8 }} />
          )}
        </Card>
      </div>
    </div>
  );
}
