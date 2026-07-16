import { m } from 'framer-motion'
import { Icon } from '../Icon/Icon'
import { PRODUCTS } from '../../data/content'
import { fadeUp, scaleIn, staggerContainer, viewport } from '../motion/variants'

export function CatalogSection() {
  return (
    <section id="catalog" className="bg-[#f5f7f9]">
      <div className="mx-auto max-w-[1220px] px-5 py-20 lg:px-8">
        <m.div
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerContainer}
        >
          <m.div variants={fadeUp}>
            <p className="font-mono text-[10px] tracking-[.16em] text-[#0875e1]">КАТАЛОГ ПРОДУКЦИИ</p>
            <h2 className="mt-3 text-[31px] font-extrabold tracking-[-.055em] text-[#102d50] md:text-[40px]">
              Подберём изделие
              <br />
              порд вашу задачу
            </h2>
          </m.div>
          <m.a
            href="#request"
            className="inline-flex items-center gap-2 text-[13px] font-extrabold text-[#0875e1]"
            variants={fadeUp}
            whileHover={{ x: 4 }}
          >
            Не нашли нужное? Подберём аналог
            <Icon name="arrow" size={17} />
          </m.a>
        </m.div>

        <m.div
          className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerContainer}
        >
          {PRODUCTS.map(([title, desc, num], index) => (
            <m.a
              href="#request"
              key={title}
              className={`group relative overflow-hidden rounded-2xl bg-white p-5 ${
                index === 0 ? 'sm:col-span-2 sm:min-h-[240px]' : 'min-h-[185px]'
              }`}
              variants={scaleIn}
              whileHover={{ y: -4 }}
            >
              <div className="relative z-10">
                <p className="font-mono text-[10px] text-[#0875e1]">{num} / КАТЕГОРИЯ</p>
                <h3 className="mt-7 text-[17px] font-extrabold tracking-[-.04em] text-[#102d50]">{title}</h3>
                <p className="mt-2 max-w-[210px] text-[12px] leading-relaxed text-slate-500">{desc}</p>
                <span className="mt-5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#eef4f9] text-[#102d50] transition group-hover:bg-[#0875e1] group-hover:text-white">
                  <Icon name="arrow" size={15} />
                </span>
              </div>
              <div
                className={`absolute ${
                  index === 0 ? '-right-6 -bottom-14 h-52 w-52 border-[20px]' : '-right-7 -bottom-10 h-32 w-32 border-[14px]'
                } rounded-full border-[#d6e1e9] transition duration-500 group-hover:scale-110 group-hover:border-[#79bafa]`}
              />
              <div
                className={`absolute ${
                  index === 0 ? 'right-18 bottom-8 h-16 w-16 border-[12px]' : 'right-12 bottom-7 h-9 w-9 border-[8px]'
                } rounded-full border-[#102d50]/90`}
              />
            </m.a>
          ))}
        </m.div>
      </div>
    </section>
  )
}
