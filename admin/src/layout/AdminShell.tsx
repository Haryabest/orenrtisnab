import {
  BarChartOutlined,
  GlobalOutlined,
  LayoutOutlined,
  PictureOutlined,
  DesktopOutlined,
  StarOutlined,
  AppstoreOutlined,
  SettingOutlined,
  CarOutlined,
  MailOutlined,
  EnvironmentOutlined,
  QuestionCircleOutlined,
  ColumnHeightOutlined,
  PhoneOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { Button, Layout, Menu, Typography } from 'antd'
import type { MenuProps } from 'antd'
import type { ReactNode } from 'react'
import type { ContentSection } from '../../../shared/site-content'
import { CONTENT_SECTIONS } from '../../../shared/site-content'
import { getSectionLabel, SECTION_ORDER } from '../sectionLabels'

const { Header, Sider, Content } = Layout

const SECTION_ICONS: Partial<Record<ContentSection, React.ReactNode>> = {
  site: <GlobalOutlined />,
  header: <LayoutOutlined />,
  hero: <PictureOutlined />,
  heroVisual: <DesktopOutlined />,
  benefits: <StarOutlined />,
  catalog: <AppstoreOutlined />,
  process: <SettingOutlined />,
  delivery: <CarOutlined />,
  requestForm: <MailOutlined />,
  contacts: <EnvironmentOutlined />,
  faq: <QuestionCircleOutlined />,
  footer: <ColumnHeightOutlined />,
  floatingCta: <PhoneOutlined />,
}

type AdminShellProps = {
  view: 'dashboard' | ContentSection
  onNavigate: (view: 'dashboard' | ContentSection) => void
  onLogout: () => void
  onSave?: () => void
  saving?: boolean
  title: string
  children: ReactNode
}

export function AdminShell({
  view,
  onNavigate,
  onLogout,
  onSave,
  saving,
  title,
  children,
}: AdminShellProps) {
  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <BarChartOutlined />,
      label: 'Дашборд',
    },
    ...SECTION_ORDER.filter((key) => CONTENT_SECTIONS.includes(key as ContentSection)).map((key) => ({
      key,
      icon: SECTION_ICONS[key as ContentSection] ?? <SettingOutlined />,
      label: getSectionLabel(key),
    })),
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth={0}
        width={272}
        theme="dark"
        className="admin-sider"
      >
        <div className="admin-sider-inner">
          <div className="admin-brand">
            <Typography.Text strong style={{ color: '#fff', fontSize: 14 }}>
              ОРЕНРТИСНАБ
            </Typography.Text>
            <br />
            <Typography.Text style={{ color: 'rgba(147, 197, 253, 0.9)', fontSize: 12 }}>
              Админ-панель
            </Typography.Text>
          </div>

          <Menu
            className="admin-sider-menu"
            theme="dark"
            mode="inline"
            selectedKeys={[view]}
            items={menuItems}
            onClick={({ key }) => onNavigate(key as 'dashboard' | ContentSection)}
          />

          <div className="admin-logout">
            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={onLogout}
              block
              style={{ textAlign: 'left', height: 42, borderRadius: 10 }}
            >
              Выйти
            </Button>
          </div>
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
          }}
        >
          <Typography.Title level={4} style={{ margin: 0, color: '#102d50' }}>
            {title}
          </Typography.Title>
          {onSave && (
            <Button type="primary" onClick={onSave} loading={saving}>
              Сохранить
            </Button>
          )}
        </Header>

        <Content style={{ padding: 24 }}>
          <div style={{ maxWidth: view === 'dashboard' ? 1200 : 960, margin: '0 auto' }}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  )
}
