import { useEffect } from 'react'

const METRIKA_ID = import.meta.env.VITE_YANDEX_METRIKA_ID

function loadMetrika() {
  if (!METRIKA_ID || document.querySelector('script[data-metrika]')) return

  const script = document.createElement('script')
  script.dataset.metrika = 'true'
  script.innerHTML = `
    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    ym(${METRIKA_ID}, "init", {
      clickmap:true,
      trackLinks:true,
      accurateTrackBounce:true,
      webvisor:true,
      defer:true
    });
  `
  document.head.appendChild(script)
}

export function YandexMetrika() {
  useEffect(() => {
    if (!METRIKA_ID) return

    let cancelled = false

    const run = () => {
      if (!cancelled) loadMetrika()
    }

    if ('requestIdleCallback' in globalThis) {
      const id = globalThis.requestIdleCallback(run, { timeout: 4000 })
      return () => {
        cancelled = true
        globalThis.cancelIdleCallback(id)
      }
    }

    const timer = globalThis.setTimeout(run, 2500)
    return () => {
      cancelled = true
      globalThis.clearTimeout(timer)
    }
  }, [])

  return null
}
