import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

export const config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',

  jwtSecret: process.env.JWT_SECRET || '',
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || '',

  mainDomain: process.env.MAIN_DOMAIN || 'orenrtisnab.ru',
  adminSubdomain: process.env.ADMIN_SUBDOMAIN || 'admin.orenrtisnab.ru',
  serverIp: process.env.SERVER_IP || '',

  cookieName: 'admin_token',
  jwtExpiresIn: '8h' as const,

  databaseUrl:
    process.env.DATABASE_URL || 'postgresql://orenrtisnab:orenrtisnab@localhost:5432/orenrtisnab',

  contentFile: join(rootDir, 'server', 'data', 'content.json'),
  visitsFile: join(rootDir, 'server', 'data', 'visits.json'),
  leadsFile: join(rootDir, 'server', 'data', 'leads.json'),
  uploadsDir: join(rootDir, 'public', 'images'),
  publicDir: join(rootDir, 'public'),
  distDir: join(rootDir, 'dist'),
  adminDistDir: join(rootDir, 'admin', 'dist'),

  maxUploadBytes: 5 * 1024 * 1024,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'] as const,
}

export function assertProductionConfig() {
  if (!config.isProd) return

  if (!config.jwtSecret || config.jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production')
  }
  if (!config.adminPassword || config.adminPassword.length < 12) {
    throw new Error('ADMIN_PASSWORD must be at least 12 characters in production')
  }
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is required in production')
  }
}

export function isAdminHost(host: string): boolean {
  const normalized = normalizeHost(host)
  const adminHost = config.adminSubdomain.split(':')[0].toLowerCase()
  return normalized === adminHost || normalized.startsWith('admin.')
}

export function isMainSiteHost(host: string): boolean {
  const normalized = normalizeHost(host)
  if (!config.isProd && (normalized === 'localhost' || normalized === '127.0.0.1')) {
    return true
  }
  if (config.serverIp && normalized === config.serverIp) {
    return true
  }
  return normalized === config.mainDomain || normalized === `www.${config.mainDomain}`
}

export function isAllowedSiteHost(host: string): boolean {
  return isMainSiteHost(host) || isAdminHost(host)
}

function normalizeHost(host: string): string {
  return host.split(':')[0].toLowerCase()
}

export function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return false
  try {
    const url = new URL(origin)
    const host = url.hostname.toLowerCase()
    return (
      host === config.mainDomain ||
      host === `www.${config.mainDomain}` ||
      host === config.adminSubdomain ||
      host.startsWith('admin.') ||
      (config.serverIp && host === config.serverIp) ||
      (!config.isProd && (host === 'localhost' || host === '127.0.0.1'))
    )
  } catch {
    return false
  }
}
