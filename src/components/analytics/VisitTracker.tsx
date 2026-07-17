import { useEffect } from 'react'

const SESSION_KEY = 'oren_visit_tracked'

export function VisitTracker() {
  useEffect(() => {
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
      .then(() => sessionStorage.setItem(SESSION_KEY, '1'))
      .catch(() => {})
  }, [])

  return null
}
