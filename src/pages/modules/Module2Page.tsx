import { useState } from 'react';
import {
  Table, Typography, Space, Button, Tag, Card,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { MOCK_SCRIPTS, MOCK_MODULE2 } from '../../utils/mock';
import type { Module2Episode, EmotionType } from '../../types';

const { Title, Text } = Typography;

const EMOTION_CONFIG: Record<EmotionType, { label: string; color: string }> = {
  shame: { label: '羞耻', color: '#ff4d4f' },
  betrayal: { label: '背叛', color: '#722ed1' },
  suspense: { label: '悬念', color: '#1677ff' },
  desire: { label: '渴望', color: '#eb2f96' },
  rage: { label: '愤怒', color: '#fa541c' },
  grief: { label: '悲伤', color: '#096dd9' },
  relief: { label: '释然', color: '#52c41a' },
  anticipation: { label: '期待', color: '#faad14' },
  other: { label: '其他', color: '#8c8c8c' },
};

export default function Module2Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const script = MOCK_SCRIPTS.find((s) => s.id === Number(id));
  const [episodes] = useState<Module2Episode[]>(MOCK_MODULE2);

  if (!script) return <div>剧本不存在</div>;

  const chartData = episodes.map((ep) => ({
    name: `第${ep.episode_number}集`,
    intensity: ep.peak_intensity,
    emotion: EMOTION_CONFIG[ep.dominant_emotion]?.label,
  }));

  const columns = [
    {
      title: '集数',
      dataIndex: 'episode_number',
      width: 70,
      render: (v: number) => <Text strong style={{ color: '#1677ff' }}>第 {v} 集</Text>,
    },
    {
      title: '主导情绪',
      dataIndex: 'dominant_emotion',
      render: (e: EmotionType) => {
        const cfg = EMOTION_CONFIG[e];
        return <Tag color={cfg.color} style={{ fontSize: 12 }}>{cfg.label}</Tag>;
      },
    },
    {
      title: '峰值强度',
      dataIndex: 'peak_intensity',
      render: (v: number) => (
        <Space size={4}>
          <div
            style={{
              width: 80,
              height: 8,
              background: '#f0f0f0',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${(v / 5) * 100}%`,
                height: '100%',
                background: v >= 4 ? '#ff4d4f' : v >= 3 ? '#faad14' : '#52c41a',
                borderRadius: 4,
              }}
            />
          </div>
          <Text style={{ fontSize: 13 }}>{v}/5</Text>
        </Space>
      ),
    },
    {
      title: '情绪点数',
      render: (_: unknown, record: Module2Episode) => (
        <Text type="secondary">{record.emotion_points.length} 个</Text>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate(`/scripts/${id}/analyze`)} />
          <div>
            <Title level={4} style={{ margin: 0 }}>模块2：情绪曲线</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>《{script.title}》· 全 {episodes.length} 集</Text>
          </div>
        </Space>
        <Button size="small">导出 Word</Button>
      </div>

      <Card title="情绪强度曲线" size="small" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(EMOTION_CONFIG).map(([k, v]) => (
            <Tag key={k} color={v.color} style={{ fontSize: 11 }}>{v.label}</Tag>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
            <ReTooltip
              formatter={(value, _name, props) => [
                `${value}/5（${(props as { payload?: { emotion?: string } }).payload?.emotion}）`,
                '峰值强度',
              ]}
            />
            <ReferenceLine y={4} stroke="#ff4d4f" strokeDasharray="4 4" label={{ value: '高强度线', fill: '#ff4d4f', fontSize: 11 }} />
            <Area
              type="monotone"
              dataKey="intensity"
              stroke="#1677ff"
              fill="#e6f4ff"
              strokeWidth={2}
              dot={{ fill: '#1677ff', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Table
        dataSource={episodes}
        columns={columns}
        rowKey="episode_number"
        size="middle"
        pagination={false}
        style={{ background: '#fff', borderRadius: 8 }}
      />
    </div>
  );
}
