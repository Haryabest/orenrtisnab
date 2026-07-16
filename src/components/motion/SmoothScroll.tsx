import { useEffect, type ReactNode } from 'react'

const HEADER_OFFSET = 76

type SmoothScrollProps = {
  children: ReactNode
}

function scrollToHash(hash: string) {
  if (!hash || hash === '#') return

  const target = document.querySelector(hash)
  if (!target) return

  const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
  window.scrollTo({ top, behavior: 'smooth' })
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const link = (event.target as Element).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!link) return

      const hash = link.getAttribute('href')
      if (!hash || hash === '#') return

      const target = document.querySelector(hash)
      if (!target) return

      event.preventDefault()
      scrollToHash(hash)
      history.pushState(null, '', hash)
    }

    document.addEventListener('click', handleClick)

    if (window.location.hash) {
      requestAnimationFrame(() => scrollToHash(window.location.hash))
    }

    return () => document.removeEventListener('click', handleClick)
  }, [])

  return children
}
