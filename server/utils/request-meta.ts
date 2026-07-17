import type { DeviceType } from '../../shared/analytics-types.ts'

export function parseUserAgent(ua: string): { browser: string; os: string; device: DeviceType } {
  const agent = ua || 'Unknown'

  let device: DeviceType = 'desktop'
  if (/tablet|ipad|playbook|silk/i.test(agent)) {
    device = 'tablet'
  } else if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(agent)) {
    device = 'mobile'
  } else if (!/windows|macintosh|linux|cros/i.test(agent)) {
    device = 'unknown'
  }

  let browser = 'Unknown'
  if (/edg\//i.test(agent)) browser = 'Edge'
  else if (/chrome\//i.test(agent) && !/edg\//i.test(agent)) browser = 'Chrome'
  else if (/firefox\//i.test(agent)) browser = 'Firefox'
  else if (/safari\//i.test(agent) && !/chrome\//i.test(agent)) browser = 'Safari'
  else if (/opr\//i.test(agent) || /opera/i.test(agent)) browser = 'Opera'
  else if (/yabrowser/i.test(agent)) browser = 'Yandex'
  else if (/msie|trident/i.test(agent)) browser = 'IE'

  let os = 'Unknown'
  if (/windows nt/i.test(agent)) os = 'Windows'
  else if (/mac os x/i.test(agent) && !/iphone|ipad/i.test(agent)) os = 'macOS'
  else if (/android/i.test(agent)) os = 'Android'
  else if (/iphone|ipad|ipod/i.test(agent)) os = 'iOS'
  else if (/linux/i.test(agent)) os = 'Linux'
  else if (/cros/i.test(agent)) os = 'Chrome OS'

  return { browser, os, device }
}

export function parseReferrerHost(referrer: string): string {
  if (!referrer) return 'Прямой заход'
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '')
    return host || 'Прямой заход'
  } catch {
    return 'Прямой заход'
  }
}

export function getClientIp(req: { ip?: string; headers: Record<string, string | string[] | undefined> }): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0]?.trim() || req.ip || 'unknown'
  }
  return req.ip || 'unknown'
}
