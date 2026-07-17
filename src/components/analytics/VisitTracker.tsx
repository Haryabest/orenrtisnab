import { useEffect } from 'react'

const SESSION_KEY = 'oren_visit_tracked'

export function VisitTracker() {
  useEffect(() => {
    if (window.location.hostname.startsWith('admin.')) return
    if (sessionStorage.getItem(SESSION_KEY)) return

    const payload = {
      path: window.location.pathname + window.location.search,
      referrer: document.referrer || '',
      screenWidth: window.screen.width,
    }

    fetch('/api/analytics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`visit track failed: ${response.status}`)
        sessionStorage.setItem(SESSION_KEY, '1')
      })
      .catch(() => {})
  }, [])

  return null
}
