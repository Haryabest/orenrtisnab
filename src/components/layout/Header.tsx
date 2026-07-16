import { useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { Icon } from '../Icon/Icon'
import { NAV_ITEMS, CONTACTS } from '../../data/content'
import { trackPhoneClick } from '../../utils/analytics'
import { fadeUp, headerSlide, staggerContainer } from '../motion/variants'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <m.header
      className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl"
      initial="hidden"
      animate="visible"
      variants={headerSlide}
    >
      <div className="mx-auto flex h-[76px] max-w-[1220px] items-center justify-between px-5 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center bg-[#102d50] text-[15px] font-extrabold text-white">
            ОС
          </span>
          <span className="text-[15px] font-extrabold tracking-[-.035em]">
            ОРЕНРТИСНАБ
            <span className="block text-[9px] font-medium tracking-[.15em] text-slate-500">
              Уплотнительные соединения, РТИ
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-[13px] font-semibold text-slate-600 lg:flex">
          {NAV_ITEMS.map((item, index) => (
            <m.a
              key={item.href}
              href={item.href}
              className="transition hover:text-[#0875e1]"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
              whileHover={{ y: -1 }}
            >
              {item.label}
            </m.a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 sm:flex">
          <a
            href={CONTACTS.phones[0].href}
            onClick={trackPhoneClick}
            className="text-right text-[13px] font-extrabold leading-tight"
          >
            {CONTACTS.phones[0].display}
            <span className="block text-[10px] font-medium text-slate-500">{CONTACTS.schedule}</span>
          </a>
          <a
            href="#request"
            className="rounded-lg bg-[#0875e1] px-4 py-3 text-[12px] font-extrabold text-white shadow-[0_8px_20px_rgba(8,117,225,.2)] transition hover:bg-[#0768c9]"
          >
            Оставить заявку
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="grid h-10 w-10 place-items-center text-[#102d50] sm:hidden"
          aria-label="Меню"
          aria-expanded={menuOpen}
        >
          <Icon name="menu" />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            className="border-t border-slate-100 bg-white px-5 py-4 sm:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <m.div variants={staggerContainer} initial="hidden" animate="visible">
              {NAV_ITEMS.map((item) => (
                <m.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-sm font-bold"
                  variants={fadeUp}
                >
                  {item.label}
                </m.a>
              ))}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  )
}
