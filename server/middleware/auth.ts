import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../services/auth.ts'
import { config } from '../config.ts'

export type AuthedRequest = Request & { user?: { sub: string; role: 'admin' } }

export function requireAdminHost(req: Request, res: Response, next: NextFunction) {
  const host = req.hostname
  if (!host.startsWith('admin.') && host !== config.adminSubdomain.split(':')[0]) {
    if (config.isProd) {
      res.status(404).json({ error: 'Not found' })
      return
    }
  }
  next()
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.[config.cookieName]
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  req.user = { sub: payload.sub, role: payload.role }
  next()
}

export function requireAdminApi(req: Request, res: Response, next: NextFunction) {
  const host = req.hostname
  const isLocal = host === 'localhost' || host === '127.0.0.1'
  if (config.isProd && !req.hostname.startsWith('admin.') && !isLocal) {
    res.status(403).json({ error: 'Forbidden' })
    return
  }
  next()
}
