export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown'

export type VisitRecord = {
  id: string
  at: string
  ip: string
  path: string
  referrer: string
  referrerHost: string
  userAgent: string
  browser: string
  os: string
  device: DeviceType
  language: string
  screenWidth?: number
}

export type LeadStatus = 'new' | 'read'

export type LeadRecord = {
  id: string
  at: string
  name: string
  phone: string
  email: string
  source: string
  ip: string
  userAgent: string
  browser: string
  os: string
  device: DeviceType
  referrer: string
  status: LeadStatus
  forwarded: boolean
}

export type DashboardStats = {
  visitsToday: number
  visitsWeek: number
  visitsTotal: number
  leadsToday: number
  leadsNew: number
  leadsTotal: number
  devices: Record<DeviceType, number>
  topReferrers: { source: string; count: number }[]
  topBrowsers: { name: string; count: number }[]
}

export type DashboardData = {
  stats: DashboardStats
  recentVisits: VisitRecord[]
  recentLeads: LeadRecord[]
  meta?: {
    dbReady: boolean
    storage: 'postgres' | 'json'
  }
}
