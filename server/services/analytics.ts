import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import type { DashboardData, DeviceType, LeadRecord, LeadStatus, VisitRecord } from '../../shared/analytics-types.ts'
import { config } from '../config.ts'
import { isDbReady, pool } from '../db/pool.ts'
import { parseReferrerHost, parseUserAgent } from '../utils/request-meta.ts'

const MAX_VISITS = 5000
const MAX_LEADS = 2000

function startOfDay(date = new Date()): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfWeek(date = new Date()): Date {
  const d = startOfDay(date)
  const day = d.getDay()
  const diff = day === 0 ? 6 : day - 1
  d.setDate(d.getDate() - diff)
  return d
}

function rowToVisit(row: Record<string, unknown>): VisitRecord {
  return {
    id: String(row.id),
    at: new Date(String(row.at)).toISOString(),
    ip: String(row.ip),
    path: String(row.path),
    referrer: String(row.referrer),
    referrerHost: String(row.referrer_host),
    userAgent: String(row.user_agent),
    browser: String(row.browser),
    os: String(row.os),
    device: String(row.device) as DeviceType,
    language: String(row.language),
    screenWidth: row.screen_width == null ? undefined : Number(row.screen_width),
  }
}

function rowToLead(row: Record<string, unknown>): LeadRecord {
  return {
    id: String(row.id),
    at: new Date(String(row.at)).toISOString(),
    name: String(row.name),
    phone: String(row.phone),
    email: String(row.email),
    source: String(row.source),
    ip: String(row.ip),
    userAgent: String(row.user_agent),
    browser: String(row.browser),
    os: String(row.os),
    device: String(row.device) as DeviceType,
    referrer: String(row.referrer),
    status: String(row.status) as LeadStatus,
    forwarded: Boolean(row.forwarded),
  }
}

async function importJsonLeadsIfEmpty() {
  const count = await pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM leads')
  if (Number(count.rows[0]?.count) > 0) return

  try {
    const raw = await readFile(config.leadsFile, 'utf-8')
    const items = JSON.parse(raw) as LeadRecord[]
    for (const lead of items.slice(0, MAX_LEADS)) {
      await pool.query(
        `INSERT INTO leads (id, at, name, phone, email, source, ip, user_agent, browser, os, device, referrer, status, forwarded)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         ON CONFLICT (id) DO NOTHING`,
        [
          lead.id,
          lead.at,
          lead.name,
          lead.phone,
          lead.email,
          lead.source,
          lead.ip,
          lead.userAgent,
          lead.browser,
          lead.os,
          lead.device,
          lead.referrer,
          lead.status,
          lead.forwarded,
        ],
      )
    }
  } catch {
    /* no legacy file */
  }
}

async function importJsonVisitsIfEmpty() {
  const count = await pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM visits')
  if (Number(count.rows[0]?.count) > 0) return

  try {
    const raw = await readFile(config.visitsFile, 'utf-8')
    const items = JSON.parse(raw) as VisitRecord[]
    for (const visit of items.slice(0, MAX_VISITS)) {
      await pool.query(
        `INSERT INTO visits (id, at, ip, path, referrer, referrer_host, user_agent, browser, os, device, language, screen_width)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (id) DO NOTHING`,
        [
          visit.id,
          visit.at,
          visit.ip,
          visit.path,
          visit.referrer,
          visit.referrerHost,
          visit.userAgent,
          visit.browser,
          visit.os,
          visit.device,
          visit.language,
          visit.screenWidth ?? null,
        ],
      )
    }
  } catch {
    /* no legacy file */
  }
}

export async function bootstrapAnalytics() {
  if (!isDbReady()) return
  await importJsonVisitsIfEmpty()
  await importJsonLeadsIfEmpty()
}

function emptyDashboard(): DashboardData {
  return {
    stats: {
      visitsToday: 0,
      visitsWeek: 0,
      visitsTotal: 0,
      leadsToday: 0,
      leadsNew: 0,
      leadsTotal: 0,
      devices: { mobile: 0, tablet: 0, desktop: 0, unknown: 0 },
      topReferrers: [],
      topBrowsers: [],
    },
    recentVisits: [],
    recentLeads: [],
  }
}

export async function recordVisit(input: {
  ip: string
  userAgent: string
  language: string
  path: string
  referrer: string
  screenWidth?: number
}): Promise<VisitRecord> {
  const parsed = parseUserAgent(input.userAgent)
  const visit: VisitRecord = {
    id: randomUUID(),
    at: new Date().toISOString(),
    ip: input.ip,
    path: input.path.slice(0, 500),
    referrer: input.referrer.slice(0, 2000),
    referrerHost: parseReferrerHost(input.referrer),
    userAgent: input.userAgent.slice(0, 500),
    browser: parsed.browser,
    os: parsed.os,
    device: parsed.device,
    language: input.language.slice(0, 20),
    screenWidth: input.screenWidth,
  }

  if (!isDbReady()) return visit

  await pool.query(
    `INSERT INTO visits (id, at, ip, path, referrer, referrer_host, user_agent, browser, os, device, language, screen_width)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [
      visit.id,
      visit.at,
      visit.ip,
      visit.path,
      visit.referrer,
      visit.referrerHost,
      visit.userAgent,
      visit.browser,
      visit.os,
      visit.device,
      visit.language,
      visit.screenWidth ?? null,
    ],
  )

  await pool.query(
    `DELETE FROM visits WHERE id NOT IN (
       SELECT id FROM visits ORDER BY at DESC LIMIT $1
     )`,
    [MAX_VISITS],
  )

  return visit
}

export async function recordLead(input: {
  name: string
  phone: string
  email: string
  source: string
  ip: string
  userAgent: string
  referrer: string
  forwarded: boolean
}): Promise<LeadRecord> {
  const parsed = parseUserAgent(input.userAgent)
  const lead: LeadRecord = {
    id: randomUUID(),
    at: new Date().toISOString(),
    name: input.name,
    phone: input.phone,
    email: input.email,
    source: input.source,
    ip: input.ip,
    userAgent: input.userAgent.slice(0, 500),
    browser: parsed.browser,
    os: parsed.os,
    device: parsed.device,
    referrer: input.referrer.slice(0, 2000),
    status: 'new',
    forwarded: input.forwarded,
  }

  if (!isDbReady()) return lead

  await pool.query(
    `INSERT INTO leads (id, at, name, phone, email, source, ip, user_agent, browser, os, device, referrer, status, forwarded)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
    [
      lead.id,
      lead.at,
      lead.name,
      lead.phone,
      lead.email,
      lead.source,
      lead.ip,
      lead.userAgent,
      lead.browser,
      lead.os,
      lead.device,
      lead.referrer,
      lead.status,
      lead.forwarded,
    ],
  )

  await pool.query(
    `DELETE FROM leads WHERE id NOT IN (
       SELECT id FROM leads ORDER BY at DESC LIMIT $1
     )`,
    [MAX_LEADS],
  )

  return lead
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<LeadRecord | null> {
  if (!isDbReady()) return null

  const result = await pool.query(
    `UPDATE leads SET status = $2 WHERE id = $1 RETURNING *`,
    [id, status],
  )
  if (!result.rows[0]) return null
  return rowToLead(result.rows[0])
}

export async function getDashboard(): Promise<DashboardData> {
  if (!isDbReady()) return emptyDashboard()

  const today = startOfDay()
  const week = startOfWeek()

  const [statsRow, devicesRows, referrersRows, browsersRows, visitsRows, leadsRows] = await Promise.all([
    pool.query<{
      visits_today: string
      visits_week: string
      visits_total: string
      leads_today: string
      leads_new: string
      leads_total: string
    }>(
      `SELECT
         (SELECT COUNT(*) FROM visits WHERE at >= $1) AS visits_today,
         (SELECT COUNT(*) FROM visits WHERE at >= $2) AS visits_week,
         (SELECT COUNT(*) FROM visits) AS visits_total,
         (SELECT COUNT(*) FROM leads WHERE at >= $1) AS leads_today,
         (SELECT COUNT(*) FROM leads WHERE status = 'new') AS leads_new,
         (SELECT COUNT(*) FROM leads) AS leads_total`,
      [today, week],
    ),
    pool.query<{ device: string; count: string }>(
      `SELECT device, COUNT(*)::text AS count FROM visits GROUP BY device`,
    ),
    pool.query<{ source: string; count: string }>(
      `SELECT referrer_host AS source, COUNT(*)::text AS count
       FROM visits GROUP BY referrer_host ORDER BY count DESC LIMIT 5`,
    ),
    pool.query<{ name: string; count: string }>(
      `SELECT browser AS name, COUNT(*)::text AS count
       FROM visits GROUP BY browser ORDER BY count DESC LIMIT 5`,
    ),
    pool.query('SELECT * FROM visits ORDER BY at DESC LIMIT 50'),
    pool.query('SELECT * FROM leads ORDER BY at DESC LIMIT 50'),
  ])

  const s = statsRow.rows[0]
  const devices: Record<DeviceType, number> = {
    mobile: 0,
    tablet: 0,
    desktop: 0,
    unknown: 0,
  }
  for (const row of devicesRows.rows) {
    const key = row.device as DeviceType
    if (key in devices) devices[key] = Number(row.count)
  }

  return {
    stats: {
      visitsToday: Number(s?.visits_today ?? 0),
      visitsWeek: Number(s?.visits_week ?? 0),
      visitsTotal: Number(s?.visits_total ?? 0),
      leadsToday: Number(s?.leads_today ?? 0),
      leadsNew: Number(s?.leads_new ?? 0),
      leadsTotal: Number(s?.leads_total ?? 0),
      devices,
      topReferrers: referrersRows.rows.map((r) => ({
        source: r.source,
        count: Number(r.count),
      })),
      topBrowsers: browsersRows.rows.map((r) => ({
        name: r.name,
        count: Number(r.count),
      })),
    },
    recentVisits: visitsRows.rows.map(rowToVisit),
    recentLeads: leadsRows.rows.map(rowToLead),
  }
}

export async function getVisitsPage(page: number, limit: number) {
  if (!isDbReady()) {
    return { items: [], total: 0, page, limit }
  }

  const offset = (page - 1) * limit
  const [items, total] = await Promise.all([
    pool.query('SELECT * FROM visits ORDER BY at DESC LIMIT $1 OFFSET $2', [limit, offset]),
    pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM visits'),
  ])
  return {
    items: items.rows.map(rowToVisit),
    total: Number(total.rows[0]?.count ?? 0),
    page,
    limit,
  }
}

export async function getLeadsPage(page: number, limit: number) {
  if (!isDbReady()) {
    return { items: [], total: 0, page, limit }
  }

  const offset = (page - 1) * limit
  const [items, total] = await Promise.all([
    pool.query('SELECT * FROM leads ORDER BY at DESC LIMIT $1 OFFSET $2', [limit, offset]),
    pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM leads'),
  ])
  return {
    items: items.rows.map(rowToLead),
    total: Number(total.rows[0]?.count ?? 0),
    page,
    limit,
  }
}
