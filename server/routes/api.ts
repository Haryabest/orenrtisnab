import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import multer from 'multer'
import { randomUUID } from 'node:crypto'
import { extname, join } from 'node:path'
import { writeFile, mkdir } from 'node:fs/promises'
import { loginSchema, siteContentSchema } from '../../shared/content-schema.ts'
import { CONTENT_SECTIONS, type ContentSection } from '../../shared/site-content.ts'
import { config } from '../config.ts'
import { requireAuth, requireAdminApi, type AuthedRequest } from '../middleware/auth.ts'
import { CSRF_HEADER } from '../middleware/csrf.ts'
import {
  clearAuthCookie,
  setAuthCookie,
  signToken,
  verifyCredentials,
  verifyToken,
} from '../services/auth.ts'
import { readContent, updateSection, writeContent } from '../services/content.ts'
import { getDashboard, getLeadsPage, getVisitsPage, recordLead, recordVisit, updateLeadStatus } from '../services/analytics.ts'
import { getClientIp } from '../utils/request-meta.ts'

const router = Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts' },
})

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
})

const trackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
})

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxUploadBytes, files: 1 },
})

router.get('/health', (_req, res) => {
  res.json({ ok: true })
})

router.get('/content', apiLimiter, async (_req, res) => {
  try {
    const content = await readContent()
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    res.json(content)
  } catch {
    res.status(500).json({ error: 'Failed to load content' })
  }
})

router.post('/auth/login', requireAdminApi, authLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid credentials format' })
    return
  }

  const valid = await verifyCredentials(parsed.data.username, parsed.data.password)
  if (!valid) {
    res.status(401).json({ error: 'Invalid username or password' })
    return
  }

  const token = signToken({ sub: parsed.data.username, role: 'admin' })
  setAuthCookie(res, token)
  res.json({ ok: true, csrfHeader: CSRF_HEADER })
})

router.post('/auth/logout', requireAdminApi, requireAuth, (_req, res) => {
  clearAuthCookie(res)
  res.json({ ok: true })
})

router.get('/auth/me', requireAdminApi, (req: AuthedRequest, res) => {
  const token = req.cookies?.[config.cookieName]
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  const payload = verifyToken(token)
  if (!payload) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  res.json({ username: payload.sub, role: payload.role })
})

router.put('/content', requireAdminApi, requireAuth, apiLimiter, async (req, res) => {
  const parsed = siteContentSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() })
    return
  }
  const content = await writeContent(parsed.data)
  res.json(content)
})

router.patch('/content/:section', requireAdminApi, requireAuth, apiLimiter, async (req, res) => {
  const section = req.params.section as ContentSection
  if (!CONTENT_SECTIONS.includes(section)) {
    res.status(400).json({ error: 'Unknown section' })
    return
  }

  const current = await readContent()
  const sectionSchema = siteContentSchema.shape[section]
  const parsed = sectionSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() })
    return
  }

  const content = await updateSection(section, parsed.data as (typeof current)[typeof section])
  res.json(content)
})

router.post('/analytics/visit', trackLimiter, async (req, res) => {
  const { path, referrer, screenWidth } = req.body ?? {}

  if (typeof path !== 'string') {
    res.status(400).json({ error: 'Invalid path' })
    return
  }

  try {
    const visit = await recordVisit({
      ip: getClientIp(req),
      userAgent: req.get('user-agent') || '',
      language: req.get('accept-language')?.split(',')[0] || '',
      path,
      referrer: typeof referrer === 'string' ? referrer : '',
      screenWidth: typeof screenWidth === 'number' ? screenWidth : undefined,
    })
    res.json({ ok: true, id: visit.id })
  } catch {
    res.status(500).json({ error: 'Failed to record visit' })
  }
})

router.get('/analytics/dashboard', requireAdminApi, requireAuth, apiLimiter, async (_req, res) => {
  try {
    const data = await getDashboard()
    res.json(data)
  } catch {
    res.status(500).json({ error: 'Failed to load dashboard' })
  }
})

router.get('/analytics/visits', requireAdminApi, requireAuth, apiLimiter, async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50))
  res.json(await getVisitsPage(page, limit))
})

router.get('/analytics/leads', requireAdminApi, requireAuth, apiLimiter, async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50))
  res.json(await getLeadsPage(page, limit))
})

router.patch('/analytics/leads/:id', requireAdminApi, requireAuth, apiLimiter, async (req, res) => {
  const status = req.body?.status
  if (status !== 'new' && status !== 'read') {
    res.status(400).json({ error: 'Invalid status' })
    return
  }
  const lead = await updateLeadStatus(String(req.params.id), status)
  if (!lead) {
    res.status(404).json({ error: 'Lead not found' })
    return
  }
  res.json(lead)
})

router.post('/upload', requireAdminApi, requireAuth, apiLimiter, upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' })
    return
  }

  if (!config.allowedImageTypes.includes(req.file.mimetype as (typeof config.allowedImageTypes)[number])) {
    res.status(400).json({ error: 'Invalid file type' })
    return
  }

  const extMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
  }
  const ext = extMap[req.file.mimetype] || extname(req.file.originalname).toLowerCase()
  const filename = `${randomUUID()}${ext}`

  await mkdir(config.uploadsDir, { recursive: true })
  await writeFile(join(config.uploadsDir, filename), req.file.buffer)

  res.json({ url: `/images/${filename}` })
})

router.post('/form/submit', apiLimiter, async (req, res) => {
  const { name, phone, email, honeypot, source } = req.body ?? {}

  if (honeypot) {
    res.json({ ok: true })
    return
  }

  if (!name || !phone || typeof name !== 'string' || typeof phone !== 'string') {
    res.status(400).json({ error: 'Invalid form data' })
    return
  }

  const cleanName = String(name).trim().slice(0, 200)
  const cleanPhone = String(phone).trim().slice(0, 50)
  const cleanEmail = email ? String(email).trim().slice(0, 200) : ''
  const cleanSource = source ? String(source).slice(0, 100) : 'orenrtisnab.ru'

  const meta = {
    ip: getClientIp(req),
    userAgent: req.get('user-agent') || '',
    referrer: req.get('referer') || '',
  }

  let forwarded = false
  const content = await readContent()
  const endpoint = content.site.formEndpoint

  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail || undefined,
          source: cleanSource,
        }),
      })
      forwarded = response.ok
    } catch {
      forwarded = false
    }
  }

  try {
    await recordLead({
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      source: cleanSource,
      ...meta,
      forwarded,
    })
    res.json({ ok: true, forwarded })
  } catch {
    res.status(500).json({ error: 'Failed to save lead' })
  }
})

export default router
