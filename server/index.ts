import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import apiRouter from './routes/api.ts'
import { initDb, isDbReady } from './db/pool.ts'
import { bootstrapAnalytics } from './services/analytics.ts'
import { assertProductionConfig, config, isAdminHost, isAllowedOrigin, isAllowedSiteHost, isMainSiteHost } from './config.ts'
import { issueCsrfToken, verifyCsrf } from './middleware/csrf.ts'
import { sendNotFound } from './notFound.ts'

assertProductionConfig()

const app = express()

app.set('trust proxy', 1)

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://mc.yandex.ru'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://mc.yandex.ru', 'https://yandex.ru'],
        connectSrc: ["'self'", 'https://mc.yandex.ru', 'https://yandex.ru', 'wss://mc.yandex.ru'],
        fontSrc: ["'self'", 'https://static.figma.com'],
        frameSrc: ["'self'", 'https://mc.yandex.ru'],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: config.isProd ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
  }),
)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true)
        return
      }
      callback(new Error('CORS not allowed'))
    },
    credentials: true,
  }),
)

app.use(cookieParser())
app.use(express.json({ limit: '1mb' }))
app.use(issueCsrfToken)
app.use(verifyCsrf)

app.use('/api', apiRouter)

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API route not found' })
})

app.use('/images', express.static(config.uploadsDir, { maxAge: config.isProd ? '7d' : 0 }))
app.use(express.static(config.publicDir, { maxAge: config.isProd ? '1d' : 0 }))

app.use((req, res, next) => {
  if (!isAllowedSiteHost(req.hostname)) {
    sendNotFound(res)
    return
  }

  const admin = isAdminHost(req.hostname)
  const staticDir = admin ? config.adminDistDir : config.distDir
  const indexFile = join(staticDir, 'index.html')

  if (!existsSync(indexFile)) {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ error: 'API route not found' })
      return
    }
    res.status(503).send(admin ? 'Admin panel not built. Run: pnpm build:admin' : 'Site not built. Run: pnpm build')
    return
  }

  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'API route not found' })
    return
  }

  const filePath = join(staticDir, req.path === '/' ? 'index.html' : req.path)
  if (existsSync(filePath) && !filePath.endsWith('index.html')) {
    res.sendFile(filePath)
    return
  }

  if (admin) {
    res.sendFile(indexFile)
    return
  }

  if (isMainSiteHost(req.hostname) && req.path === '/') {
    res.sendFile(indexFile)
    return
  }

  sendNotFound(res)
})

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

async function main() {
  await initDb()
  if (isDbReady()) {
    await bootstrapAnalytics()
  }

  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`)
    console.log(isDbReady() ? 'PostgreSQL connected' : 'Storage: JSON files (no PostgreSQL)')
    console.log(`Main site: ${config.mainDomain}`)
    console.log(`Admin panel: ${config.adminSubdomain}`)
  })
}

main().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
