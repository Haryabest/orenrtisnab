import type { ThemeConfig } from 'antd'

export const adminTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0875e1',
    colorBgLayout: '#f1f5f9',
    colorText: '#102d50',
    borderRadius: 12,
    borderRadiusLG: 16,
    fontFamily: "'Manrope', Arial, sans-serif",
    controlHeight: 40,
  },
  components: {
    Button: {
      borderRadius: 12,
      controlHeight: 40,
      fontWeight: 700,
    },
    Input: {
      borderRadius: 10,
    },
    Select: {
      borderRadius: 10,
    },
    Card: {
      borderRadiusLG: 16,
    },
    Menu: {
      darkItemBg: '#102d50',
      darkSubMenuItemBg: '#102d50',
      darkItemSelectedBg: '#0875e1',
      darkItemHoverBg: 'rgba(8, 117, 225, 0.28)',
      itemBorderRadius: 10,
      itemMarginInline: 8,
      itemHeight: 42,
    },
    Layout: {
      siderBg: '#102d50',
      headerBg: '#ffffff',
      bodyBg: '#f1f5f9',
    },
    Table: {
      borderRadius: 12,
    },
  },
}
