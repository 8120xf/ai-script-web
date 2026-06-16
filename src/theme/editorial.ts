import type { ThemeConfig } from 'antd';

/** Direction A — 编辑室 / Editorial */
export const editorialTheme: ThemeConfig = {
  token: {
    colorPrimary: '#2d5a4a',
    colorLink: '#8b2942',
    colorSuccess: '#2d5a4a',
    colorWarning: '#a67c52',
    colorError: '#9b3d3d',
    colorInfo: '#5c6b7a',
    borderRadius: 8,
    fontFamily: 'var(--font-body)',
    colorBgContainer: '#fffcf7',
    colorBgLayout: '#f3efe8',
    colorBgElevated: '#fffcf7',
    colorText: '#1c1917',
    colorTextSecondary: '#6b6560',
    colorTextTertiary: '#9c948c',
    colorBorder: '#e8e0d4',
    colorBorderSecondary: '#f0e9df',
    controlOutline: 'rgba(45, 90, 74, 0.12)',
  },
  components: {
    Menu: {
      itemSelectedColor: '#2d5a4a',
      itemSelectedBg: '#e8f0ec',
      itemHoverBg: '#f5f0e8',
    },
    Table: {
      headerBg: '#f7f3eb',
      headerColor: '#5c534a',
      rowHoverBg: '#faf6ef',
      borderColor: '#e8e0d4',
    },
    Card: {
      colorBgContainer: '#fffcf7',
    },
    Button: {
      primaryShadow: '0 1px 2px rgba(45, 90, 74, 0.15)',
    },
    Input: {
      colorBgContainer: '#fffcf7',
    },
    Tag: {
      defaultBg: '#f5f0e8',
      defaultColor: '#5c534a',
    },
  },
};
