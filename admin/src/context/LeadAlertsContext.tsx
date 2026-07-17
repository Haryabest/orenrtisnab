import { notification } from 'antd'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { DashboardData, LeadRecord } from '../../../shared/analytics-types'
import { api } from '../api'

const POLL_MS = 5_000

type LeadAlertsContextValue = {
  data: DashboardData | null
  loading: boolean
  error: string
  newLeadsCount: number
  refresh: () => Promise<void>
  markLeadRead: (lead: LeadRecord) => Promise<void>
}

const LeadAlertsContext = createContext<LeadAlertsContextValue | null>(null)

function notifyNewLead(lead: LeadRecord, onOpen?: () => void) {
  notification.open({
    message: 'Новая заявка',
    description: `${lead.name} · ${lead.phone}${lead.email ? ` · ${lead.email}` : ''}`,
    placement: 'topRight',
    duration: 12,
    onClick: onOpen,
    style: { cursor: onOpen ? 'pointer' : undefined },
  })

  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification('Новая заявка — ОРЕНРТИСНАБ', {
      body: `${lead.name}\n${lead.phone}`,
      tag: `lead-${lead.id}`,
    })
  }
}

export function LeadAlertsProvider({
  enabled,
  onLeadClick,
  children,
}: {
  enabled: boolean
  onLeadClick?: () => void
  children: ReactNode
}) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const knownLeadIds = useRef<Set<string> | null>(null)

  const refresh = useCallback(async () => {
    if (!enabled) return

    try {
      const dashboard = await api.getDashboard()
      setError('')

      if (knownLeadIds.current) {
        const freshLeads = dashboard.recentLeads.filter(
          (lead) => lead.status === 'new' && !knownLeadIds.current!.has(lead.id),
        )
        for (const lead of freshLeads.reverse()) {
          notifyNewLead(lead, onLeadClick)
        }
      }

      knownLeadIds.current = new Set(dashboard.recentLeads.map((lead) => lead.id))
      setData(dashboard)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [enabled, onLeadClick])

  useEffect(() => {
    if (!enabled) {
      knownLeadIds.current = null
      setData(null)
      setLoading(false)
      return
    }

    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      void Notification.requestPermission()
    }

    void refresh()
    const interval = setInterval(() => {
      void refresh()
    }, POLL_MS)

    return () => clearInterval(interval)
  }, [enabled, refresh])

  const markLeadRead = useCallback(async (lead: LeadRecord) => {
    if (lead.status === 'read') return

    await api.updateLeadStatus(lead.id, 'read')
    setData((current) => {
      if (!current) return current
      return {
        ...current,
        stats: { ...current.stats, leadsNew: Math.max(0, current.stats.leadsNew - 1) },
        recentLeads: current.recentLeads.map((item) =>
          item.id === lead.id ? { ...item, status: 'read' as const } : item,
        ),
      }
    })
  }, [])

  const newLeadsCount = data?.stats.leadsNew ?? 0

  return (
    <LeadAlertsContext.Provider
      value={{ data, loading, error, newLeadsCount, refresh, markLeadRead }}
    >
      {children}
    </LeadAlertsContext.Provider>
  )
}

export function useLeadAlerts() {
  const context = useContext(LeadAlertsContext)
  if (!context) {
    throw new Error('useLeadAlerts must be used within LeadAlertsProvider')
  }
  return context
}
