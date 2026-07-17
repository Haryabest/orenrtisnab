import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import type { DashboardData, DeviceType, LeadRecord, LeadStatus, VisitRecord } from '../../shared/analytics-types.ts'
import { config } from '../config.ts'
import { isDbReady, pool } from '../db/pool.ts'
import { parseReferrerHost, parseUserAgent } from '../utils/request-meta.ts'

const MAX_VISITS = 5000
const MAX_LEADS = 2000
const MOSCOW_TZ = 'Europe/Moscow'

function startOfDayMoscow(date = new Date()): Date {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: MOSCOW_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const year = parts.find((p) => p.type === 'year')?.value ?? '1970'
  const month = parts.find((p) => p.type === 'month')?.value ?? '01'
  const day = parts.find((p) => p.type === 'day')?.value ?? '01'
  return new Date(`${year}-${month}-${day}T00:00:00+03:00`)
}

function startOfWeekMoscow(date = new Date()): Date {
  const dayStart = startOfDayMoscow(date)
  const weekdayStr = new Intl.DateTimeFormat('en-US', { timeZone: MOSCOW_TZ, weekday: 'short' }).format(date)
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  const weekday = weekdayMap[weekdayStr] ?? 0
  const mondayOffset = weekday === 0 ? 6 : weekday - 1
  dayStart.setDate(dayStart.getDate() - mondayOffset)
  return dayStart
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

async function readVisitsJson(): Promise<VisitRecord[]> {
  try {
    const raw = await readFile(config.visitsFile, 'utf-8')
    const items = JSON.parse(raw) as VisitRecord[]
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

async function writeVisitsJson(visits: VisitRecord[]) {
  await mkdir(dirname(config.visitsFile), { recursive: true })
  await writeFile(config.visitsFile, JSON.stringify(visits.slice(0, MAX_VISITS), null, 2), 'utf-8')
}

async function readLeadsJson(): Promise<LeadRecord[]> {
  try {
    const raw = await readFile(config.leadsFile, 'utf-8')
    const items = JSON.parse(raw) as LeadRecord[]
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

async function writeLeadsJson(leads: LeadRecord[]) {
  await mkdir(dirname(config.leadsFile), { recursive: true })
  await writeFile(config.leadsFile, JSON.stringify(leads.slice(0, MAX_LEADS), null, 2), 'utf-8')
}

async function saveVisitJson(visit: VisitRecord) {
  const visits = await readVisitsJson()
  visits.unshift(visit)
  await writeVisitsJson(visits)
}

async function saveLeadJson(lead: LeadRecord) {
  const leads = await readLeadsJson()
  leads.unshift(lead)
  await writeLeadsJson(leads)
}

async function importJsonLeadsIfEmpty() {
  const count = await pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM leads')
  if (Number(count.rows[0]?.count) > 0) return

  const items = await readLeadsJson()
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
}

async function importJsonVisitsIfEmpty() {
  const count = await pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM visits')
  if (Number(count.rows[0]?.count) > 0) return

  const items = await readVisitsJson()
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
}

export async function bootstrapAnalytics() {
  if (!isDbReady()) return
  await importJsonVisitsIfEmpty()
  await importJsonLeadsIfEmpty()
}

function buildDashboardFromJson(visits: VisitRecord[], leads: LeadRecord[]): DashboardData {
  const today = startOfDayMoscow()
  const week = startOfWeekMoscow()

  const visitsToday = visits.filter((v) => new Date(v.at) >= today).length
  const visitsWeek = visits.filter((v) => new Date(v.at) >= week).length
  const leadsToday = leads.filter((l) => new Date(l.at) >= today).length
  const leadsNew = leads.filter((l) => l.status === 'new').length

  const devices: Record<DeviceType, number> = {
    mobile: 0,
    tablet: 0,
    desktop: 0,
    unknown: 0,
  }
  const referrerCounts = new Map<string, number>()
  const browserCounts = new Map<string, number>()

  for (const visit of visits) {
    if (visit.device in devices) devices[visit.device] += 1
    referrerCounts.set(visit.referrerHost, (referrerCounts.get(visit.referrerHost) ?? 0) + 1)
    browserCounts.set(visit.browser, (browserCounts.get(visit.browser) ?? 0) + 1)
  }

  return {
    stats: {
      visitsToday,
      visitsWeek,
      visitsTotal: visits.length,
      leadsToday,
      leadsNew,
      leadsTotal: leads.length,
      devices,
      topReferrers: [...referrerCounts.entries()]
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      topBrowsers: [...browserCounts.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
    },
    recentVisits: visits.slice(0, 50),
    recentLeads: leads.slice(0, 50),
    meta: { dbReady: isDbReady(), storage: 'json' },
  }
}

async function getDashboardFromPostgres(): Promise<DashboardData> {
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
         (SELECT COUNT(*) FROM visits
           WHERE (at AT TIME ZONE '${MOSCOW_TZ}')::date = (NOW() AT TIME ZONE '${MOSCOW_TZ}')::date) AS visits_today,
         (SELECT COUNT(*) FROM visits
           WHERE at >= date_trunc('week', NOW() AT TIME ZONE '${MOSCOW_TZ}') AT TIME ZONE '${MOSCOW_TZ}') AS visits_week,
         (SELECT COUNT(*) FROM visits) AS visits_total,
         (SELECT COUNT(*) FROM leads
           WHERE (at AT TIME ZONE '${MOSCOW_TZ}')::date = (NOW() AT TIME ZONE '${MOSCOW_TZ}')::date) AS leads_today,
         (SELECT COUNT(*) FROM leads WHERE status = 'new') AS leads_new,
         (SELECT COUNT(*) FROM leads) AS leads_total`,
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
    meta: { dbReady: true, storage: 'postgres' },
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

  if (isDbReady()) {
    try {
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

      try {
        await pool.query(
          `DELETE FROM visits
           WHERE id IN (
             SELECT id FROM visits
             ORDER BY at DESC
             OFFSET $1
           )`,
          [MAX_VISITS],
        )
      } catch (err) {
        console.error('Visit trim failed:', err)
      }

      return visit
    } catch (err) {
      console.error('Visit PostgreSQL insert failed, using JSON fallback:', err)
    }
  }

  await saveVisitJson(visit)
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

  if (isDbReady()) {
    try {
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

      try {
        await pool.query(
          `DELETE FROM leads
           WHERE id IN (
             SELECT id FROM leads
             ORDER BY at DESC
             OFFSET $1
           )`,
          [MAX_LEADS],
        )
      } catch (err) {
        console.error('Lead trim failed:', err)
      }

      return lead
    } catch (err) {
      console.error('Lead PostgreSQL insert failed, using JSON fallback:', err)
    }
  }

  await saveLeadJson(lead)
  return lead
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<LeadRecord | null> {
  if (isDbReady()) {
    try {
      const result = await pool.query(`UPDATE leads SET status = $2 WHERE id = $1 RETURNING *`, [id, status])
      if (result.rows[0]) return rowToLead(result.rows[0])
    } catch (err) {
      console.error('Lead status PostgreSQL update failed, using JSON fallback:', err)
    }
  }

  const leads = await readLeadsJson()
  const index = leads.findIndex((lead) => lead.id === id)
  if (index === -1) return null
  leads[index] = { ...leads[index], status }
  await writeLeadsJson(leads)
  return leads[index]
}

export async function getDashboard(): Promise<DashboardData> {
  if (isDbReady()) {
    try {
      return await getDashboardFromPostgres()
    } catch (err) {
      console.error('Dashboard PostgreSQL query failed, using JSON fallback:', err)
    }
  }

  const [visits, leads] = await Promise.all([readVisitsJson(), readLeadsJson()])
  return buildDashboardFromJson(visits, leads)
}

export async function getVisitsPage(page: number, limit: number) {
  const offset = (page - 1) * limit

  if (isDbReady()) {
    try {
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
    } catch (err) {
      console.error('Visits page PostgreSQL query failed:', err)
    }
  }

  const visits = await readVisitsJson()
  return {
    items: visits.slice(offset, offset + limit),
    total: visits.length,
    page,
    limit,
  }
}

export async function getLeadsPage(page: number, limit: number) {
  const offset = (page - 1) * limit

  if (isDbReady()) {
    try {
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
    } catch (err) {
      console.error('Leads page PostgreSQL query failed:', err)
    }
  }

  const leads = await readLeadsJson()
  return {
    items: leads.slice(offset, offset + limit),
    total: leads.length,
    page,
    limit,
  }
}
