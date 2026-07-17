import { m } from 'framer-motion'
import { useContent } from '../../context/ContentContext'
import { fadeUp, scaleIn, staggerContainer, viewport } from '../motion/variants'

export function ProcessSection() {
  const { content } = useContent()
  const { process } = content

  return (
    <section className="mx-auto max-w-[1220px] px-5 py-20 lg:px-8">
      <m.div
        className="text-center"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerContainer}
      >
        <m.p className="font-mono text-[10px] tracking-[.16em] text-[#0875e1]" variants={fadeUp}>
          {process.eyebrow}
        </m.p>
        <m.h2
          className="mt-3 text-[31px] font-extrabold tracking-[-.055em] text-[#102d50] md:text-[40px]"
          variants={fadeUp}
        >
          {process.heading}
        </m.h2>
      </m.div>

      <m.div
        className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-0"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerContainer}
      >
        <div className="absolute left-[12.5%] right-[12.5%] top-6 hidden h-px bg-slate-200 md:block" />

        {process.steps.map((step, index) => (
          <m.div key={step.title} className="relative z-10 text-center" variants={scaleIn}>
            <m.div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-blue-200 bg-white font-mono text-[12px] font-bold text-[#0875e1] shadow-sm">
              0{index + 1}
            </m.div>
            <h3 className="mx-auto mt-5 max-w-[180px] text-[14px] font-extrabold leading-snug text-[#102d50]">
              {step.title}
            </h3>
            <p className="mx-auto mt-2 max-w-[190px] text-[12px] leading-relaxed text-slate-500">{step.description}</p>
          </m.div>
        ))}
      </m.div>
    </section>
  )
}
