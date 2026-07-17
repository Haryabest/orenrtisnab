import { m } from 'framer-motion'
import { useContent } from '../../context/ContentContext'
import { HeroVisual } from './HeroVisual'
import { fadeUp, fadeRight, heroStagger, staggerContainer } from '../motion/variants'

export function HeroSection() {
  const { content } = useContent()
  const { hero } = content

  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-heading">
      <img
        src={hero.backgroundImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
        loading="eager"
        fetchPriority="high"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(255,255,255,.97)_0%,rgba(255,255,255,.92)_45%,rgba(255,255,255,.55)_100%)]" />

      <div className="relative z-10 mx-auto grid max-w-[1220px] gap-10 px-5 py-14 md:py-20 lg:grid-cols-[.98fr_1.02fr] lg:px-8 lg:py-24">
        <m.div
          className="relative flex flex-col justify-center"
          variants={heroStagger}
          initial="hidden"
          animate="visible"
        >
          <m.div
            className="mb-5 flex items-center gap-2 font-mono text-[10px] font-medium tracking-[.16em] text-[#0875e1]"
            variants={fadeUp}
          >
            <span className="h-px w-8 bg-[#0875e1]" />
            {hero.eyebrow}
          </m.div>

          <m.h1
            id="hero-heading"
            className="max-w-[590px] text-[42px] font-extrabold leading-[.98] tracking-[-.065em] text-[#102d50] md:text-[62px]"
            variants={fadeUp}
          >
            {hero.heading}
          </m.h1>

          <m.p
            className="mt-5 max-w-[580px] text-[18px] font-semibold leading-relaxed tracking-[-.025em] text-slate-700 md:text-[22px]"
            variants={fadeUp}
          >
            {hero.subtitle}
          </m.p>

          <m.p className="mt-4 max-w-[520px] text-[14px] leading-relaxed text-slate-500" variants={fadeUp}>
            {hero.description}
          </m.p>

          <m.div className="mt-8 flex flex-col gap-3 sm:flex-row" variants={fadeUp}>
            <m.a
              href={hero.ctaHref}
              className="group inline-flex min-h-[54px] items-center justify-center gap-3 rounded-lg bg-[#0875e1] px-7 text-[14px] font-extrabold text-white shadow-[0_12px_25px_rgba(8,117,225,.25)] transition hover:bg-[#0768c9]"
            >
              {hero.ctaText}
            </m.a>
          </m.div>

          <m.div
            className="mt-10 grid max-w-[620px] grid-cols-3 gap-3 border-t border-slate-300/70 pt-6"
            variants={staggerContainer}
          >
            {hero.stats.map((stat, index) => (
              <m.div
                key={stat.value}
                className={index === 1 ? 'border-x border-slate-300/70 px-4' : index === 2 ? 'pl-1' : ''}
                variants={fadeUp}
              >
                <p className="text-[17px] font-extrabold tracking-[-.04em] text-[#102d50]">{stat.value}</p>
                <p className="mt-1 text-[10px] font-bold leading-snug text-slate-500">
                  {stat.line1}
                  <br />
                  {stat.line2}
                </p>
              </m.div>
            ))}
          </m.div>
        </m.div>

        <m.div initial="hidden" animate="visible" variants={fadeRight}>
          <HeroVisual />
        </m.div>
      </div>
    </section>
  )
}
