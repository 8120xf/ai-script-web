import { Layout, Menu, Typography, Space } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

const { Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  {
    key: '/scripts',
    icon: <FileTextOutlined />,
    label: <Link to="/scripts">剧本管理</Link>,
  },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const selectedKey = '/' + location.pathname.split('/')[1];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Space direction="vertical" size={2}>
            <Text strong style={{ fontSize: 15, color: '#1a1a1a' }}>
              剧本资产平台
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Script Asset System
            </Text>
          </Space>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ border: 'none', marginTop: 8 }}
          items={menuItems}
        />
      </Sider>

      <Layout style={{ marginLeft: 220 }}>
        <Content
          style={{
            padding: '24px',
            minHeight: '100vh',
            background: '#f8f9fa',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
