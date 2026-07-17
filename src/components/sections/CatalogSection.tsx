import { resolveCatalogImage } from '../../../shared/site-content'
import { m } from 'framer-motion'
import { Icon } from '../Icon/Icon'
import { useContent } from '../../context/ContentContext'
import { fadeUp, scaleIn, staggerContainer, viewport } from '../motion/variants'

const CATALOG_CARD_GRADIENT =
  'linear-gradient(105deg, rgba(255,255,255,.97) 0%, rgba(255,255,255,.92) 45%, rgba(255,255,255,.55) 100%)'

function CatalogCardVisual({ image }: { image: string }) {
  if (image) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0" style={{ background: CATALOG_CARD_GRADIENT }} />
      </div>
    )
  }

  return (
    <>
      <div className="absolute -right-7 -bottom-10 h-32 w-32 rounded-full border-[14px] border-[#d6e1e9] transition duration-500 group-hover:scale-110 group-hover:border-[#79bafa]" />
      <div className="absolute right-12 bottom-7 h-9 w-9 rounded-full border-[8px] border-[#102d50]/90" />
    </>
  )
}

export function CatalogSection() {
  const { content } = useContent()
  const { catalog } = content

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
            <p className="font-mono text-[10px] tracking-[.16em] text-[#0875e1]">{catalog.eyebrow}</p>
            <h2 className="mt-3 text-[31px] font-extrabold tracking-[-.055em] text-[#102d50] md:text-[40px]">
              {catalog.headingLine1}
              <br />
              {catalog.headingLine2}
            </h2>
          </m.div>
          <m.a
            href={catalog.ctaHref}
            className="inline-flex items-center gap-2 text-[13px] font-extrabold text-[#0875e1]"
            variants={fadeUp}
            whileHover={{ x: 4 }}
          >
            {catalog.ctaText}
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
          {catalog.items.map((item, index) => {
            const image = resolveCatalogImage(item.title, item.image)

            return (
            <m.a
              href={catalog.ctaHref}
              key={item.title}
              className={`group relative overflow-hidden rounded-2xl p-5 ${
                image ? 'bg-transparent' : 'bg-white'
              } ${index === 0 ? 'sm:col-span-2 sm:min-h-[240px]' : 'min-h-[185px]'}`}
              variants={scaleIn}
              whileHover={{ y: -4 }}
            >
              <div className="relative z-10 max-w-[58%]">
                <p className="font-mono text-[10px] text-[#0875e1]">
                  {item.number} / {catalog.categoryLabel}
                </p>
                <h3 className="mt-7 text-[17px] font-extrabold tracking-[-.04em] text-[#102d50]">{item.title}</h3>
                {item.description && (
                  <p className="mt-2 max-w-[210px] text-[12px] leading-relaxed text-slate-500">{item.description}</p>
                )}
                <span className="mt-5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#eef4f9] text-[#102d50] transition group-hover:bg-[#0875e1] group-hover:text-white">
                  <Icon name="arrow" size={15} />
                </span>
              </div>
              <CatalogCardVisual image={image} />
            </m.a>
            )
          })}
        </m.div>
      </div>
    </section>
  )
}
