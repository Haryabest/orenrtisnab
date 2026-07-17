import { Flex, Spin, Typography, message } from 'antd'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { ContentSection, SiteContent } from '../../shared/site-content'
import { api } from './api'
import { Dashboard } from './components/Dashboard'
import { SectionEditor } from './components/SectionEditor'
import { LeadAlertsProvider } from './context/LeadAlertsContext'
import { AdminShell } from './layout/AdminShell'
import { LoginPage } from './pages/LoginPage'
import { getSectionLabel } from './sectionLabels'

export default function App() {
  const [messageApi, contextHolder] = message.useMessage()
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [view, setView] = useState<'dashboard' | ContentSection>('dashboard')
  const [content, setContent] = useState<SiteContent | null>(null)
  const [draft, setDraft] = useState<SiteContent[ContentSection] | null>(null)
  const [saving, setSaving] = useState(false)

  function openView(next: 'dashboard' | ContentSection) {
    setView(next)
    if (next === 'dashboard') {
      setDraft(null)
      return
    }
    if (content) {
      setDraft(content[next])
    } else {
      setDraft(null)
    }
  }

  const checkAuth = useCallback(async () => {
    try {
      await api.me()
      setAuthed(true)
    } catch {
      setAuthed(false)
    }
  }, [])

  const loadContent = useCallback(async () => {
    const data = await api.getContent()
    setContent(data)
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (authed) {
      loadContent().catch(() => {
        messageApi.error('Не удалось загрузить контент')
      })
    }
  }, [authed, loadContent, messageApi])

  useEffect(() => {
    if (content && view !== 'dashboard') {
      setDraft(content[view])
    }
  }, [view, content])

  async function handleSave() {
    if (!draft || view === 'dashboard') return
    setSaving(true)
    try {
      const updated = await api.saveSection(view, draft)
      setContent(updated)
      messageApi.success('Изменения сохранены')
    } catch (e) {
      messageApi.error(e instanceof Error ? e.message : 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    await api.logout()
    setAuthed(false)
    setContent(null)
  }

  if (authed === null) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '100vh' }}>
        <Spin size="large" />
      </Flex>
    )
  }

  if (!authed) {
    return <LoginPage onSuccess={() => setAuthed(true)} />
  }

  const title = view === 'dashboard' ? 'Дашборд' : getSectionLabel(view)

  return (
    <LeadAlertsProvider
      enabled={authed}
      onLeadClick={() => openView('dashboard')}
    >
      <AdminApp
        contextHolder={contextHolder}
        view={view}
        title={title}
        draft={draft}
        saving={saving}
        onNavigate={openView}
        onLogout={handleLogout}
        onSave={view !== 'dashboard' ? handleSave : undefined}
        onDraftChange={setDraft}
      />
    </LeadAlertsProvider>
  )
}

function AdminApp({
  contextHolder,
  view,
  title,
  draft,
  saving,
  onNavigate,
  onLogout,
  onSave,
  onDraftChange,
}: {
  contextHolder: ReactNode
  view: 'dashboard' | ContentSection
  title: string
  draft: SiteContent[ContentSection] | null
  saving: boolean
  onNavigate: (view: 'dashboard' | ContentSection) => void
  onLogout: () => void | Promise<void>
  onSave?: () => void | Promise<void>
  onDraftChange: (data: SiteContent[ContentSection]) => void
}) {
  return (
    <>
      {contextHolder}
      <AdminShell
        view={view}
        onNavigate={onNavigate}
        onLogout={onLogout}
        onSave={onSave}
        saving={saving}
        title={title}
      >
        {view === 'dashboard' ? (
          <Dashboard />
        ) : draft ? (
          <Flex vertical gap={16}>
            <SectionEditor
              key={view}
              section={view}
              data={draft}
              onChange={onDraftChange}
              onUpload={(file) => api.uploadImage(file)}
            />
          </Flex>
        ) : (
          <Typography.Text type="secondary">Загрузка секции…</Typography.Text>
        )}
      </AdminShell>
    </>
  )
}
