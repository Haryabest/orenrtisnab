import { m } from 'framer-motion'
import { fadeUp, staggerContainer, viewport } from '../motion/variants'

export function Footer() {
  return (
    <m.footer
      className="border-t border-slate-200 bg-[#f5f7f9]"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={staggerContainer}
    >
      <div className="mx-auto flex max-w-[1220px] flex-col gap-5 px-5 py-8 text-[11px] text-slate-500 md:flex-row md:items-center md:justify-between lg:px-8">
        <m.div variants={fadeUp}>
          <p className="font-extrabold text-[#102d50]">ОРЕНРТИСНАБ</p>
          <p className="mt-1">Промышленные уплотнения и РТИ</p>
        </m.div>
        <m.div className="flex flex-wrap gap-x-5 gap-y-2" variants={fadeUp}>
          <a href="/privacy.html" className="hover:text-[#0875e1]">
            Политика конфиденциальности
          </a>
          <a href="/consent.html" className="hover:text-[#0875e1]">
            Согласие на обработку персональных данных
          </a>
        </m.div>
        <m.p variants={fadeUp}>© 2026 ОРЕНРТИСНАБ</m.p>
      </div>
    </m.footer>
  )
}
