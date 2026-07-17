import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'
import { config } from '../config.ts'
import { isSecureRequest } from '../utils/is-secure-request.ts'

const BCRYPT_ROUNDS = 12

export type AuthTokenPayload = {
  sub: string
  role: 'admin'
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  if (username !== config.adminUsername) {
    await bcrypt.hash(password, BCRYPT_ROUNDS)
    return false
  }

  if (!config.adminPassword) {
    if (!config.isProd) {
      return password === 'admin12345'
    }
    return false
  }

  if (config.adminPassword.startsWith('$2')) {
    return bcrypt.compare(password, config.adminPassword)
  }

  return password === config.adminPassword
}

export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, config.jwtSecret || 'dev-only-insecure-secret-change-me', {
    expiresIn: config.jwtExpiresIn,
    issuer: 'orenrtisnab-admin',
    audience: 'orenrtisnab-admin-panel',
  })
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const secret = config.jwtSecret || 'dev-only-insecure-secret-change-me'
    return jwt.verify(token, secret, {
      issuer: 'orenrtisnab-admin',
      audience: 'orenrtisnab-admin-panel',
    }) as AuthTokenPayload
  } catch {
    return null
  }
}

export function setAuthCookie(req: Request, res: Response, token: string) {
  res.cookie(config.cookieName, token, {
    httpOnly: true,
    secure: isSecureRequest(req),
    sameSite: 'strict',
    maxAge: 8 * 60 * 60 * 1000,
    path: '/',
  })
}

export function clearAuthCookie(req: Request, res: Response) {
  res.clearCookie(config.cookieName, {
    httpOnly: true,
    secure: isSecureRequest(req),
    sameSite: 'strict',
    path: '/',
  })
}
