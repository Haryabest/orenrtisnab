import { useEffect } from 'react'
import { useContent } from '../../context/ContentContext'
import { resolveMetrikaId, setMetrikaCounterId } from '../../utils/analytics'

function loadMetrika(id: string) {
  if (document.querySelector('script[data-metrika]')) return

  setMetrikaCounterId(id)

  const script = document.createElement('script')
  script.dataset.metrika = 'true'
  script.innerHTML = `
    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    ym(${id}, "init", {
      clickmap:true,
      trackLinks:true,
      accurateTrackBounce:true,
      webvisor:true,
      trackHash:true
    });
  `
  document.head.appendChild(script)
}

function ensureNoscriptPixel(id: string) {
  if (document.querySelector('noscript[data-metrika]')) return

  const noscript = document.createElement('noscript')
  noscript.dataset.metrika = 'true'
  noscript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute;left:-9999px;" alt="" /></div>`
  document.body.appendChild(noscript)
}

export function YandexMetrika() {
  const { content } = useContent()
  const metrikaId = resolveMetrikaId(
    content.site.yandexMetrikaId,
    import.meta.env.VITE_YANDEX_METRIKA_ID,
  )

  useEffect(() => {
    if (!metrikaId) return

    let cancelled = false

    const run = () => {
      if (!cancelled) {
        loadMetrika(metrikaId)
        ensureNoscriptPixel(metrikaId)
      }
    }

    if ('requestIdleCallback' in globalThis) {
      const id = globalThis.requestIdleCallback(run, { timeout: 3000 })
      return () => {
        cancelled = true
        globalThis.cancelIdleCallback(id)
      }
    }

    const timer = globalThis.setTimeout(run, 1500)
    return () => {
      cancelled = true
      globalThis.clearTimeout(timer)
    }
  }, [metrikaId])

  return null
}
