import { useState } from 'react';
import {
  Table, Button, Space, Typography, Input, Tag, Progress, Tooltip,
  Dropdown, Modal, message,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EllipsisOutlined,
  FileTextOutlined, BarChartOutlined, DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ScriptStatusBadge } from '../../components/common/StatusBadge';
import { MOCK_SCRIPTS } from '../../utils/mock';
import type { Script, TaskStatus } from '../../types';

const { Title, Text } = Typography;

const GENRE_LABEL: Record<string, string> = {
  romance: '都市言情',
  family: '家庭伦理',
  urban: '都市逆袭',
  fantasy: '玄幻',
  suspense: '悬疑',
  comedy: '喜剧',
  historical: '古装',
  other: '其他',
};

function ModuleProgress({ m1, m2, m5 }: { m1: TaskStatus; m2: TaskStatus; m5: TaskStatus }) {
  const done = [m1, m2, m5].filter((s) => s === 'success').length;
  const pct = Math.round((done / 3) * 100);
  return (
    <Space size={4} direction="vertical" style={{ width: 100 }}>
      <Progress percent={pct} size="small" />
      <Space size={4} wrap>
        <Tooltip title="模块1：单本观察"><Tag style={{ fontSize: 10 }} color={m1 === 'success' ? 'green' : m1 === 'in_progress' ? 'processing' : 'default'}>M1</Tag></Tooltip>
        <Tooltip title="模块2：情绪曲线"><Tag style={{ fontSize: 10 }} color={m2 === 'success' ? 'green' : m2 === 'in_progress' ? 'processing' : 'default'}>M2</Tag></Tooltip>
        <Tooltip title="模块5：Cycle Sheet"><Tag style={{ fontSize: 10 }} color={m5 === 'success' || m5 === 'awaiting_review' ? 'orange' : m5 === 'in_progress' ? 'processing' : 'default'}>CS</Tag></Tooltip>
      </Space>
    </Space>
  );
}

export default function ScriptListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [scripts] = useState<Script[]>(MOCK_SCRIPTS);

  const filtered = scripts.filter((s) =>
    s.title.includes(search) || GENRE_LABEL[s.genre]?.includes(search)
  );

  const columns = [
    {
      title: '剧本名称',
      dataIndex: 'title',
      render: (title: string, record: Script) => (
        <Space direction="vertical" size={2}>
          <a onClick={() => navigate(`/scripts/${record.id}`)} style={{ fontWeight: 500 }}>
            {title}
          </a>
          <Space size={4}>
            <Tag>{GENRE_LABEL[record.genre] || record.genre}</Tag>
            <Tag color={record.tier === 'S' ? 'gold' : record.tier === 'A' ? 'blue' : 'default'}>
              {record.tier} 级
            </Tag>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.total_episodes} 集</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: Script['status']) => <ScriptStatusBadge status={status} />,
    },
    {
      title: '模块进度',
      width: 130,
      render: (_: unknown, record: Script) => (
        <ModuleProgress
          m1={record.module1_status}
          m2={record.module2_status}
          m5={record.module5_status}
        />
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      width: 110,
      render: (v: string) => <Text type="secondary" style={{ fontSize: 13 }}>{v}</Text>,
    },
    {
      title: '操作',
      width: 160,
      render: (_: unknown, record: Script) => (
        <Space size={4}>
          <Button
            size="small"
            icon={<BarChartOutlined />}
            onClick={() => navigate(`/scripts/${record.id}/analyze`)}
          >
            分析
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'm1',
                  icon: <FileTextOutlined />,
                  label: '模块1 观察',
                  onClick: () => navigate(`/scripts/${record.id}/module1`),
                  disabled: record.module1_status !== 'success',
                },
                {
                  key: 'm2',
                  icon: <BarChartOutlined />,
                  label: '模块2 情绪曲线',
                  onClick: () => navigate(`/scripts/${record.id}/module2`),
                  disabled: record.module2_status !== 'success',
                },
                {
                  key: 'm5',
                  icon: <FileTextOutlined />,
                  label: 'Cycle Sheet',
                  onClick: () => navigate(`/scripts/${record.id}/cyclesheet`),
                  disabled: record.module5_status === 'not_started',
                },
                { type: 'divider' },
                {
                  key: 'delete',
                  icon: <DeleteOutlined />,
                  label: '删除剧本',
                  danger: true,
                  onClick: () => Modal.confirm({
                    title: '确认删除',
                    content: `删除《${record.title}》及其全部分析数据？`,
                    okType: 'danger',
                    onOk: () => message.success('已删除（Mock）'),
                  }),
                },
              ],
            }}
          >
            <Button size="small" icon={<EllipsisOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>剧本管理</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/scripts/upload')}
        >
          上传剧本
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="搜索剧本名称或类型"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        size="middle"
        style={{ background: '#fff', borderRadius: 8 }}
        pagination={{ pageSize: 20, showTotal: (t) => `共 ${t} 部剧本` }}
      />
    </div>
  );
}
