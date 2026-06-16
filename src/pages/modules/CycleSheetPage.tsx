import { useState } from 'react';
import {
  Typography, Space, Button, Card, Collapse, Tag, Descriptions,
  Divider, Empty, message, Badge, Alert, Tooltip,
} from 'antd';
import {
  ArrowLeftOutlined, CheckCircleOutlined, ExportOutlined,
  PlusOutlined, InfoCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import EditableField from '../../components/common/EditableField';
import { MOCK_SCRIPTS, MOCK_CYCLE_SHEET } from '../../utils/mock';
import type { CycleSheet, CoreCycle, SubCycle } from '../../types';

const { Title, Text } = Typography;

function OverviewSection({ overview, onSave }: {
  overview: CycleSheet['overview'];
  onSave: (field: string, value: string) => Promise<void>;
}) {
  const items: { key: keyof CycleSheet['overview']; label: string }[] = [
    { key: 'drama_title', label: '剧名' },
    { key: 'genre', label: '类型' },
    { key: 'tier', label: '等级' },
    { key: 'total_episodes', label: '总集数' },
    { key: 'total_core_cycles', label: 'Core Cycle 数' },
    { key: 'core_conflict', label: '核心冲突' },
    { key: 'protagonist_desire', label: '主角欲望' },
    { key: 'antagonist_obstacle', label: '对立阻碍' },
    { key: 'resolution_type', label: '结局类型' },
  ];

  return (
    <Card title="剧本概览 (Overview)" size="small" style={{ marginBottom: 16 }}>
      <Descriptions column={2} size="small" bordered>
        {items.map(({ key, label }) => (
          <Descriptions.Item key={key} label={label} span={['core_conflict', 'protagonist_desire', 'antagonist_obstacle', 'resolution_type'].includes(key) ? 2 : 1}>
            <EditableField
              field={overview[key]}
              multiline={['core_conflict', 'protagonist_desire', 'antagonist_obstacle'].includes(key)}
              onSave={(v) => onSave(`overview.${key}`, v)}
            />
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Card>
  );
}

function PaywallTag({ type, intensity }: { type: string; intensity: number }) {
  return (
    <Space size={4}>
      <Tag color={type === 'hard' ? 'red' : 'orange'}>
        {type === 'hard' ? '硬付费' : '软付费'}
      </Tag>
      <Tag>强度 {intensity}/5</Tag>
    </Space>
  );
}

function SubCycleCard({ sub, onSave }: {
  sub: SubCycle;
  onSave: (path: string, value: string) => Promise<void>;
}) {
  return (
    <Card
      size="small"
      style={{ marginBottom: 8, borderLeft: '3px solid #1677ff' }}
      title={
        <Space>
          <Text style={{ fontSize: 13 }} strong>
            Sub Cycle
          </Text>
          <Tag color="blue" style={{ fontSize: 11 }}>
            第 {sub.start_episode}–{sub.end_episode} 集
          </Tag>
          <EditableField
            field={sub.sub_cycle_type}
            placeholder="套路类型"
            onSave={(v) => onSave(`sub_cycle_type`, v)}
          />
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size={8}>
        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>功能</Text>
          <EditableField field={sub.function} multiline onSave={(v) => onSave('function', v)} />
        </div>
        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>情绪峰值</Text>
          <EditableField field={sub.emotion_peak} onSave={(v) => onSave('emotion_peak', v)} />
        </div>

        {sub.paywalls.length > 0 && (
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Paywall（付费设计）</Text>
            <div style={{ marginTop: 4 }}>
              {sub.paywalls.map((pw, i) => (
                <div key={i} style={{ padding: '6px 8px', background: '#fff1f0', borderRadius: 4, marginBottom: 4 }}>
                  <Space>
                    <Text style={{ fontSize: 12 }}>第 {pw.episode} 集</Text>
                    <PaywallTag type={pw.paywall_type} intensity={pw.intensity} />
                  </Space>
                  <div style={{ marginTop: 4 }}>
                    <EditableField
                      field={pw.description}
                      multiline
                      onSave={(v) => onSave(`paywall_${i}_description`, v)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {sub.key_frames.length > 0 && (
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Key Frame（关键帧）</Text>
            <div style={{ marginTop: 4 }}>
              {sub.key_frames.map((kf, i) => (
                <div key={i} style={{ padding: '6px 8px', background: '#f6ffed', borderRadius: 4, marginBottom: 4 }}>
                  <Space>
                    <Text style={{ fontSize: 12 }}>第 {kf.episode} 集</Text>
                    <Tag style={{ fontSize: 11 }}>{kf.visual_type}</Tag>
                  </Space>
                  <div style={{ marginTop: 4 }}>
                    <EditableField
                      field={kf.description}
                      multiline
                      onSave={(v) => onSave(`keyframe_${i}_description`, v)}
                    />
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 11 }}>商业价值：</Text>
                    <EditableField
                      field={kf.commercial_value}
                      onSave={(v) => onSave(`keyframe_${i}_commercial_value`, v)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Space>
    </Card>
  );
}

function CoreCyclePanel({ cycle, onSave }: {
  cycle: CoreCycle;
  onSave: (path: string, value: string) => Promise<void>;
}) {
  return (
    <div style={{ padding: '8px 0' }}>
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="主题">
            <EditableField field={cycle.theme} onSave={(v) => onSave('theme', v)} />
          </Descriptions.Item>
          <Descriptions.Item label="叙事阶段">
            <EditableField field={cycle.narrative_phase} onSave={(v) => onSave('narrative_phase', v)} />
          </Descriptions.Item>
          <Descriptions.Item label="衔接设计" span={2}>
            <EditableField field={cycle.interlink} multiline onSave={(v) => onSave('interlink', v)} />
          </Descriptions.Item>
        </Descriptions>

        <Divider style={{ margin: '4px 0' }} />

        <div>
          <Space style={{ marginBottom: 8 }}>
            <Text strong style={{ fontSize: 13 }}>Sub Cycles</Text>
            <Tag>{cycle.sub_cycles.length} 个</Tag>
          </Space>
          {cycle.sub_cycles.length === 0 ? (
            <Empty description="暂无 Sub Cycle" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            cycle.sub_cycles.map((sub) => (
              <SubCycleCard key={sub.id} sub={sub} onSave={onSave} />
            ))
          )}
        </div>
      </Space>
    </div>
  );
}

export default function CycleSheetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const script = MOCK_SCRIPTS.find((s) => s.id === Number(id));
  const [sheet, setSheet] = useState<CycleSheet>(MOCK_CYCLE_SHEET);

  if (!script) return <div>剧本不存在</div>;

  const handleSave = async (_path: string, _value: string) => {
    await new Promise((r) => setTimeout(r, 300));
    message.success('已保存（Mock）');
  };

  const handleConfirm = async () => {
    await new Promise((r) => setTimeout(r, 500));
    setSheet((prev) => ({
      ...prev,
      confirmed_by: '张编剧',
      confirmed_at: new Date().toISOString(),
    }));
    message.success('Cycle Sheet 已确认');
  };

  const isConfirmed = !!sheet.confirmed_by;

  const collapseItems = sheet.core_cycles.map((cycle) => ({
    key: cycle.id,
    label: (
      <Space>
        <Text strong>Core Cycle {cycle.cycle_number}</Text>
        <Tag>第 {cycle.start_episode}–{cycle.end_episode} 集</Tag>
        <Tag color="purple">{cycle.sub_cycles.length} 个 Sub Cycle</Tag>
        {cycle.theme.value && (
          <Text type="secondary" style={{ fontSize: 12 }}>「{cycle.theme.value}」</Text>
        )}
      </Space>
    ),
    children: (
      <CoreCyclePanel
        cycle={cycle}
        onSave={(path, value) => handleSave(`cycles.${cycle.id}.${path}`, value)}
      />
    ),
  }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate(`/scripts/${id}/analyze`)} />
          <div>
            <Space>
              <Title level={4} style={{ margin: 0 }}>Cycle Sheet</Title>
              {isConfirmed ? (
                <Badge status="success" text={`已确认 by ${sheet.confirmed_by}`} />
              ) : (
                <Badge status="warning" text="待编剧确认" />
              )}
            </Space>
            <br />
            <Text type="secondary" style={{ fontSize: 13 }}>《{script.title}》· v{sheet.version}</Text>
          </div>
        </Space>
        <Space>
          {!isConfirmed && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleConfirm}
            >
              确认 Cycle Sheet
            </Button>
          )}
          <Button icon={<ExportOutlined />}>导出 Word</Button>
          <Button icon={<ExportOutlined />}>导出 JSON</Button>
        </Space>
      </div>

      {script.module1_status !== 'success' || script.module2_status !== 'success' ? (
        <Alert
          type="warning"
          showIcon
          message="部分集数的 Cycle Sheet 未经模块1/2支撑，超出前10集的内容请人工复核"
          style={{ marginBottom: 16 }}
        />
      ) : null}

      <OverviewSection overview={sheet.overview} onSave={handleSave} />

      <Card
        title={
          <Space>
            <Text strong>Core Cycles</Text>
            <Tag>{sheet.core_cycles.length} 个阶段</Tag>
            <Tooltip title="每个 Core Cycle 约 3-5 集，代表一个完整的情节弧线">
              <InfoCircleOutlined style={{ color: '#bbb' }} />
            </Tooltip>
          </Space>
        }
        size="small"
        extra={<Button size="small" icon={<PlusOutlined />}>添加 Core Cycle</Button>}
      >
        <Collapse items={collapseItems} defaultActiveKey={[sheet.core_cycles[0]?.id]} />
      </Card>
    </div>
  );
}
