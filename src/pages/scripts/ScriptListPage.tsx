import { useState } from 'react';
import {
  Button, Space, Input, Dropdown, Modal, message,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EllipsisOutlined,
  FileTextOutlined, BarChartOutlined, DeleteOutlined, EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import EditorialPhaseDot from '../../components/common/EditorialPhaseDot';
import { useScripts, getScriptFlowPath } from '../../context/ScriptContext';
import { getAssetStatusRows } from '../../utils/assetStatus';
import { GENRE_LABEL } from '../../utils/mock';
import type { Script } from '../../types';

function ScriptCard({ script }: { script: Script }) {
  const navigate = useNavigate();
  const assetRows = getAssetStatusRows(script);

  return (
    <article className="script-card">
      <h3
        className="script-card-title"
        onClick={() => navigate(getScriptFlowPath(script))}
      >
        {script.title}
      </h3>

      <div className="script-card-meta">
        <span>{GENRE_LABEL[script.genre] || script.genre}</span>
        {script.tier && (
          <span className="script-card-tier">{script.tier} 级</span>
        )}
        <span className="script-card-meta-dot">·</span>
        <span>{script.total_episodes} 集</span>
      </div>

      <div className="script-card-assets">
        {assetRows.map(({ label, phase }) => (
          <div key={label} className="script-card-asset-row">
            <span className="script-card-asset-label">{label}</span>
            <EditorialPhaseDot phase={phase} />
          </div>
        ))}
      </div>

      <div className="script-card-footer">
        <span className="script-card-date">{script.created_at}</span>
        <Space size={4}>
          <Button
            size="small"
            type="primary"
            ghost
            icon={<BarChartOutlined />}
            onClick={() => navigate(`/scripts/${script.id}/analyze`)}
          >
            分析
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'info',
                  icon: <EyeOutlined />,
                  label: '基础信息',
                  onClick: () => navigate(`/scripts/${script.id}/info`),
                },
                {
                  key: 'm1',
                  icon: <FileTextOutlined />,
                  label: '前 10 集观察报告',
                  onClick: () => navigate(`/scripts/${script.id}/module1`),
                  disabled: script.module1_status !== 'success',
                },
                {
                  key: 'm2',
                  icon: <BarChartOutlined />,
                  label: '情绪曲线',
                  onClick: () => navigate(`/scripts/${script.id}/module2`),
                  disabled: script.module2_status !== 'success',
                },
                {
                  key: 'm5',
                  icon: <FileTextOutlined />,
                  label: '情节结构',
                  onClick: () => navigate(`/scripts/${script.id}/cyclesheet`),
                  disabled: script.module5_status === 'not_started',
                },
                { type: 'divider' },
                {
                  key: 'delete',
                  icon: <DeleteOutlined />,
                  label: '删除剧本',
                  danger: true,
                  onClick: () =>
                    Modal.confirm({
                      title: '确认删除',
                      content: `删除《${script.title}》及其全部分析数据？`,
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
      </div>
    </article>
  );
}

export default function ScriptListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { scripts } = useScripts();

  const filtered = scripts.filter((s) =>
    s.title.includes(search) || GENRE_LABEL[s.genre]?.includes(search),
  );

  return (
    <div>
      <header className="list-page-header">
        <div>
          <h1 className="list-page-title">剧本管理</h1>
          <p className="list-page-sub">
            {scripts.length} 部剧本 · 上传、分析与资产复核
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate('/scripts/upload')}
        >
          上传剧本
        </Button>
      </header>

      <div style={{ marginBottom: 24 }}>
        <Input
          prefix={<SearchOutlined style={{ color: 'var(--color-ink-muted)' }} />}
          placeholder="搜索剧本名称或类型"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 320, maxWidth: '100%' }}
          allowClear
        />
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 64,
            color: 'var(--color-ink-secondary)',
            background: 'var(--color-paper)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
          }}
        >
          {search
            ? '没有匹配的剧本，请清除搜索条件'
            : '暂无剧本，点击右上角上传'}
        </div>
      ) : (
        <div className="script-card-grid">
          {filtered.map((script) => (
            <ScriptCard key={script.id} script={script} />
          ))}
        </div>
      )}
    </div>
  );
}
