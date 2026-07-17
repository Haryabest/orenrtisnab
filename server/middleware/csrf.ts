import type { NextFunction, Request, Response } from 'express'
import { isAdminHost } from '../config.ts'
import { isSecureRequest } from '../utils/is-secure-request.ts'

const CSRF_HEADER = 'x-csrf-token'
const CSRF_COOKIE = 'csrf_token'

export function issueCsrfToken(req: Request, res: Response, next: NextFunction) {
  if (!req.cookies?.[CSRF_COOKIE]) {
    const token = crypto.randomUUID()
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: false,
      secure: isSecureRequest(req),
      sameSite: 'strict',
      path: '/',
    })
  }
  next()
}

export function verifyCsrf(req: Request, res: Response, next: NextFunction) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    next()
    return
  }

  if (!isAdminHost(req.hostname)) {
    next()
    return
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE]
  const headerToken = req.get(CSRF_HEADER)

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    res.status(403).json({ error: 'Invalid CSRF token' })
    return
  }

  next()
}

export { CSRF_HEADER, CSRF_COOKIE }
