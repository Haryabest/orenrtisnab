import type { Request } from 'express'
import { config } from '../config.ts'

export function isSecureRequest(req: Request): boolean {
  if (!config.enableHttps) return false
  return req.secure || req.get('x-forwarded-proto') === 'https'
}
