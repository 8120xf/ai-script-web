import { Layout, Menu, Space, Switch } from 'antd';
import { FileTextOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

const { Sider, Content } = Layout;

const menuItems = [
  {
    key: '/scripts',
    icon: <FileTextOutlined />,
    label: <Link to="/scripts">剧本管理</Link>,
  },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { isAdmin, setIsAdmin } = useAuth();
  const selectedKey = '/' + location.pathname.split('/')[1];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        className="app-sider"
        style={{
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          overflow: 'auto',
        }}
      >
        <div className="app-sider-brand">
          <div className="app-sider-brand-title">剧本资产平台</div>
          <div className="app-sider-brand-sub">Script Asset System</div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ border: 'none', marginTop: 8, background: 'transparent' }}
          items={menuItems}
        />
        <div
          className="app-sider-footer"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 20px',
          }}
        >
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Space size={6}>
              <UserOutlined style={{ color: 'var(--color-ink-muted)' }} />
              <span style={{ fontSize: 12, color: 'var(--color-ink-secondary)' }}>演示角色</span>
            </Space>
            <Space size={8}>
              <Switch size="small" checked={isAdmin} onChange={setIsAdmin} />
              <span style={{ fontSize: 12, color: 'var(--color-ink-secondary)' }}>
                {isAdmin ? '管理员' : '普通用户'}
              </span>
            </Space>
            {!isAdmin && (
              <span className="editorial-pill" style={{ fontSize: 11 }}>浏览模式</span>
            )}
          </Space>
        </div>
      </Sider>

      <Layout style={{ marginLeft: 220 }}>
        <Content className="app-content" style={{ padding: '28px 32px' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
