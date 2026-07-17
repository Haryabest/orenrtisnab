const CSRF_COOKIE = 'csrf_token'
const CSRF_HEADER = 'x-csrf-token'

function getCsrfToken(): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${CSRF_COOKIE}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : ''
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  const csrf = getCsrfToken()
  if (csrf && options.method && options.method !== 'GET') {
    headers.set(CSRF_HEADER, csrf)
  }

  const response = await fetch(path, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || `HTTP ${response.status}`)
  }

  return response.json()
}

export const api = {
  login(username: string, password: string) {
    return request<{ ok: boolean }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  },

  logout() {
    return request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' })
  },

  me() {
    return request<{ username: string; role: string }>('/api/auth/me')
  },

  getContent() {
    return request<import('../../shared/site-content').SiteContent>('/api/content')
  },

  saveSection(section: string, data: unknown) {
    return request<import('../../shared/site-content').SiteContent>(`/api/content/${section}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  getDashboard() {
    return request<import('../../shared/analytics-types').DashboardData>('/api/analytics/dashboard')
  },

  updateLeadStatus(id: string, status: 'new' | 'read') {
    return request<import('../../shared/analytics-types').LeadRecord>(`/api/analytics/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    const headers = new Headers()
    const csrf = getCsrfToken()
    if (csrf) headers.set(CSRF_HEADER, csrf)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers,
    })

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      throw new Error(body.error || 'Upload failed')
    }

    const data = await response.json()
    return data.url as string
  },
}
