import { m } from 'framer-motion'
import { Icon } from '../Icon/Icon'
import { BENEFITS } from '../../data/content'
import { fadeUp, staggerContainer, viewport } from '../motion/variants'

export function BenefitsSection() {
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
          <p className="font-mono text-[10px] tracking-[.16em] text-[#0875e1]">ПОЧЕМУ НАМ ДОВЕРЯЮТ</p>
          <h2 className="mt-3 text-[31px] font-extrabold leading-tight tracking-[-.055em] text-[#102d50] md:text-[40px]">
            Закрываем вопрос
            <br />
            с уплотнениями под ключ
          </h2>
        </m.div>
        <m.p className="max-w-[310px] text-[13px] leading-relaxed text-slate-500" variants={fadeUp}>
          Помогаем быстро найти нужную позицию — от заявки до отгрузки.
        </m.p>
      </m.div>

      <m.div
        className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerContainer}
      >
        {BENEFITS.map(([icon, title, desc], index) => (
          <m.article
            key={title}
            className="group min-h-[220px] rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:border-blue-200 hover:shadow-[0_16px_35px_rgba(25,70,115,.1)]"
            variants={fadeUp}
            whileHover={{ y: -4 }}
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#eaf4ff] text-[#0875e1]">
              <Icon name={icon} />
            </div>
            <p className="mt-7 text-[14px] font-extrabold leading-snug text-[#102d50]">{title}</p>
            <p className="mt-3 text-[12px] leading-relaxed text-slate-500">{desc}</p>
            <p className="mt-5 font-mono text-[10px] text-slate-300">0{index + 1}</p>
          </m.article>
        ))}
      </m.div>
    </section>
  )
}
