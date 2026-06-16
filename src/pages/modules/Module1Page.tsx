import { useState } from 'react';
import {
  Table, Typography, Space, Button, Tag, Tooltip, message, Card,
} from 'antd';
import { ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import EditableField from '../../components/common/EditableField';
import { MOCK_SCRIPTS, MOCK_MODULE1 } from '../../utils/mock';
import type { Module1Episode, FieldRevision } from '../../types';

const { Title, Text } = Typography;

const FIELD_LABELS: { key: keyof Omit<Module1Episode, 'episode_number'>; label: string; tip: string }[] = [
  { key: 'core_event', label: '核心事件', tip: '本集推动主线的最重要事件' },
  { key: 'character_change', label: '人物变化', tip: '主要人物在本集的心理/行为变化' },
  { key: 'conflict_point', label: '冲突点', tip: '主要矛盾或张力所在' },
  { key: 'turning_point', label: '转折点', tip: '剧情走向发生变化的关键时刻' },
  { key: 'hook', label: '钩子', tip: '促使观众继续观看下集的悬念设计' },
];

export default function Module1Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const script = MOCK_SCRIPTS.find((s) => s.id === Number(id));
  const [episodes, setEpisodes] = useState<Module1Episode[]>(MOCK_MODULE1);

  if (!script) return <div>剧本不存在</div>;

  const handleSave = async (
    episodeNumber: number,
    field: keyof Omit<Module1Episode, 'episode_number'>,
    value: string
  ) => {
    await new Promise((r) => setTimeout(r, 300));
    setEpisodes((prev) =>
      prev.map((ep) =>
        ep.episode_number === episodeNumber
          ? {
              ...ep,
              [field]: {
                ...ep[field],
                value,
                status: 'modified',
                editor: '当前用户',
                edited_at: new Date().toISOString(),
              } as FieldRevision,
            }
          : ep
      )
    );
    message.success(`第 ${episodeNumber} 集已保存`);
  };

  const columns = [
    {
      title: '集数',
      dataIndex: 'episode_number',
      width: 60,
      fixed: 'left' as const,
      render: (v: number) => (
        <Text strong style={{ color: '#1677ff' }}>
          第 {v} 集
        </Text>
      ),
    },
    ...FIELD_LABELS.map(({ key, label, tip }) => ({
      title: (
        <Space size={4}>
          <span>{label}</span>
          <Tooltip title={tip}>
            <InfoCircleOutlined style={{ color: '#bbb', fontSize: 12 }} />
          </Tooltip>
        </Space>
      ),
      key,
      render: (_: unknown, record: Module1Episode) => (
        <EditableField
          field={record[key]}
          multiline
          placeholder={`填写${label}`}
          onSave={(value) => handleSave(record.episode_number, key, value)}
        />
      ),
    })),
  ];

  const confirmedCount = episodes.reduce((acc, ep) => {
    return acc + FIELD_LABELS.filter((f) => ep[f.key].status === 'confirmed' || ep[f.key].status === 'modified').length;
  }, 0);
  const total = episodes.length * FIELD_LABELS.length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate(`/scripts/${id}/analyze`)} />
          <div>
            <Title level={4} style={{ margin: 0 }}>模块1：单本剧本观察</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>《{script.title}》· 全 {episodes.length} 集</Text>
          </div>
        </Space>
        <Space>
          <Tag color="blue">已复核 {confirmedCount}/{total} 字段</Tag>
          <Button size="small">导出 Word</Button>
        </Space>
      </div>

      <Card size="small" style={{ marginBottom: 12, background: '#fffbe6', border: '1px solid #ffe58f' }}>
        <Text style={{ fontSize: 13 }}>
          点击任意字段内容可直接编辑，修改后点击 ✓ 保存。蓝色标签为 AI 生成，绿色为已确认，橙色为人工修改。
        </Text>
      </Card>

      <Table
        dataSource={episodes}
        columns={columns}
        rowKey="episode_number"
        size="middle"
        scroll={{ x: 1200 }}
        pagination={false}
        style={{ background: '#fff', borderRadius: 8 }}
      />
    </div>
  );
}
