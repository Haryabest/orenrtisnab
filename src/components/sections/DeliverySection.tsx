import { m } from 'framer-motion'
import { Icon } from '../Icon/Icon'
import { DELIVERY_MAP_POINTS, DELIVERY_OPTIONS } from '../../data/content'
import { fadeLeft, fadeRight, fadeUp, scaleIn, staggerContainer, viewport } from '../motion/variants'

export function DeliverySection() {
  return (
    <section id="delivery" className="relative overflow-hidden bg-[#102d50] text-white">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.17)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.17)_1px,transparent_1px)] [background-size:50px_50px]" />

      <div className="mx-auto grid max-w-[1220px] gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8">
        <m.div
          className="relative"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeLeft}
        >
          <p className="font-mono text-[10px] tracking-[.16em] text-[#83c6ff]">ЛОГИСТИКА БЕЗ ЗАДЕРЖЕК</p>
          <h2 className="mt-3 text-[31px] font-extrabold leading-tight tracking-[-.055em] md:text-[40px]">
            Доставим туда,
            <br />
            где работает ваше оборудование
          </h2>
          <p className="mt-5 max-w-[440px] text-[14px] leading-relaxed text-blue-100/75">
            Самовывоз, курьер, транспортные компании — доставляем по всей России и регионам.
          </p>

          <m.div
            className="mt-9 grid grid-cols-2 gap-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {DELIVERY_OPTIONS.map(([title, iconName]) => (
              <m.div
                key={title}
                className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/7 p-4"
                variants={fadeUp}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              >
                <Icon name={iconName} size={19} />
                <span className="text-[12px] font-bold">{title}</span>
              </m.div>
            ))}
          </m.div>
        </m.div>

        <m.div
          className="relative min-h-[330px]"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeRight}
        >
          <div className="absolute inset-0 rounded-[28px] border border-white/15 bg-[#0b2441]/80" />
          <m.div
            className="absolute left-[19%] top-[24%] h-3 w-3 rounded-full bg-[#49a9ff] shadow-[0_0_0_8px_rgba(73,169,255,.13)]"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute left-[21%] top-[27%] font-mono text-[10px] text-[#83c6ff]">ОРЕНБУРГ</div>

          {DELIVERY_MAP_POINTS.map(([x, y], index) => (
            <m.div
              key={`point-${index}`}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewport}
              transition={{ delay: 0.2 + index * 0.08, duration: 0.4 }}
            >
              <div
                className="absolute h-2.5 w-2.5 rounded-full bg-white/80"
                style={{ left: `${x}%`, top: `${y}%` }}
              />
              <div
                className="absolute h-px origin-left bg-gradient-to-r from-[#49a9ff] to-transparent"
                style={{
                  left: '20%',
                  top: '26%',
                  width: `${Math.hypot(x - 20, y - 26)}%`,
                  transform: `rotate(${Math.atan2(y - 26, x - 20) * (180 / Math.PI)}deg)`,
                }}
              />
            </m.div>
          ))}

          <m.div
            className="absolute bottom-6 left-6 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <p className="font-mono text-[10px] tracking-[.12em] text-[#83c6ff]">ГЕОГРАФИЯ ПОСТАВОК</p>
            <p className="mt-1 text-[15px] font-bold">Россия и страны ЕАЭС</p>
          </m.div>
        </m.div>
      </div>
    </section>
  )
}
