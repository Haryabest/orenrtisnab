import { m } from 'framer-motion'
import { floatUp } from '../motion/variants'

export function FloatingCta() {
  return (
    <m.a
      href="#request"
      className="fixed bottom-4 left-4 right-4 z-40 flex h-[52px] items-center justify-center rounded-xl bg-[#0875e1] text-[13px] font-extrabold text-white shadow-[0_12px_30px_rgba(8,117,225,.35)] sm:hidden"
      initial="hidden"
      animate="visible"
      variants={floatUp}
    >
      Оставить заявку
    </m.a>
  )
}
