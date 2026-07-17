import { m } from 'framer-motion'
import { useContent } from '../../context/ContentContext'
import { fadeUp, staggerContainer, viewport } from '../motion/variants'

export function Footer() {
  const { content } = useContent()
  const { footer } = content

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
          <p className="font-extrabold text-[#102d50]">{footer.name}</p>
          <p className="mt-1">{footer.tagline}</p>
        </m.div>
        <m.div className="flex flex-wrap gap-x-5 gap-y-2" variants={fadeUp}>
          {footer.links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-[#0875e1]">
              {link.text}
            </a>
          ))}
        </m.div>
        <m.p variants={fadeUp}>{footer.copyright}</m.p>
      </div>
    </m.footer>
  )
}
