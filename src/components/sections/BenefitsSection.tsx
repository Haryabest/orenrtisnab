import { m } from 'framer-motion'
import { Icon } from '../Icon/Icon'
import { useContent } from '../../context/ContentContext'
import { fadeUp, staggerContainer, viewport } from '../motion/variants'

export function BenefitsSection() {
  const { content } = useContent()
  const { benefits } = content

  return (
    <section id="benefits" className="mx-auto max-w-[1220px] px-5 py-20 lg:px-8">
      <m.div
        className="flex flex-col justify-between gap-4 md:flex-row md:items-end"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerContainer}
      >
        <m.div variants={fadeUp}>
          <p className="font-mono text-[10px] tracking-[.16em] text-[#0875e1]">{benefits.eyebrow}</p>
          <h2 className="mt-3 text-[31px] font-extrabold leading-tight tracking-[-.055em] text-[#102d50] md:text-[40px]">
            {benefits.headingLine1}
            <br />
            {benefits.headingLine2}
          </h2>
        </m.div>
        <m.p className="max-w-[310px] text-[13px] leading-relaxed text-slate-500" variants={fadeUp}>
          {benefits.sidebar}
        </m.p>
      </m.div>

      <m.div
        className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerContainer}
      >
        {benefits.items.map((item, index) => (
          <m.article
            key={item.title}
            className="group min-h-[220px] rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:border-blue-200 hover:shadow-[0_16px_35px_rgba(25,70,115,.1)]"
            variants={fadeUp}
            whileHover={{ y: -4 }}
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#eaf4ff] text-[#0875e1]">
              <Icon name={item.icon} />
            </div>
            <p className="mt-7 text-[14px] font-extrabold leading-snug text-[#102d50]">{item.title}</p>
            <p className="mt-3 text-[12px] leading-relaxed text-slate-500">{item.description}</p>
            <p className="mt-5 font-mono text-[10px] text-slate-300">0{index + 1}</p>
          </m.article>
        ))}
      </m.div>
    </section>
  )
}
