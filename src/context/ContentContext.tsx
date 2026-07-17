import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { DEFAULT_SITE_CONTENT, applyCatalogDefaultImages, type SiteContent } from '../../shared/site-content'

type ContentContextValue = {
  content: SiteContent
  loading: boolean
}

const ContentContext = createContext<ContentContextValue>({
  content: DEFAULT_SITE_CONTENT,
  loading: true,
})

function applySiteMeta(content: SiteContent) {
  document.title = content.site.title

  const setMeta = (name: string, value: string, property = false) => {
    const attr = property ? 'property' : 'name'
    let el = document.querySelector(`meta[${attr}="${name}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attr, name)
      document.head.appendChild(el)
    }
    el.setAttribute('content', value)
  }

  setMeta('description', content.site.description)
  setMeta('keywords', content.site.keywords.join(', '))
  setMeta('theme-color', content.site.themeColor)
  setMeta('og:title', content.site.title, true)
  setMeta('og:description', content.site.description, true)
  setMeta('og:image', `${content.site.url}${content.site.ogImage}`, true)
  setMeta('og:image:alt', content.site.ogImageAlt, true)
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch('/api/content')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: SiteContent) => {
        if (!cancelled) {
          const merged = applyCatalogDefaultImages(data)
          setContent(merged)
          applySiteMeta(merged)
        }
      })
      .catch(() => {
        if (!cancelled) {
          const merged = applyCatalogDefaultImages(DEFAULT_SITE_CONTENT)
          setContent(merged)
          applySiteMeta(merged)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return <ContentContext.Provider value={{ content, loading }}>{children}</ContentContext.Provider>
}

export function useContent() {
  return useContext(ContentContext)
}
