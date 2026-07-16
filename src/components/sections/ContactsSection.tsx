import { m } from 'framer-motion'
import { Icon } from '../Icon/Icon'
import { CONTACTS } from '../../data/content'
import { trackMessengerClick, trackPhoneClick } from '../../utils/analytics'
import { fadeUp, scaleIn, staggerContainer, viewport } from '../motion/variants'

export function ContactsSection() {
  return (
    <section id="contacts" className="mx-auto max-w-[1220px] px-5 py-20 lg:px-8">
      <m.div
        className="flex flex-col justify-between gap-4 md:flex-row md:items-end"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerContainer}
      >
        <m.div variants={fadeUp}>
          <p className="font-mono text-[10px] tracking-[.16em] text-[#0875e1]">КОНТАКТЫ</p>
          <h2 className="mt-3 text-[31px] font-extrabold tracking-[-.055em] text-[#102d50] md:text-[40px]">
            Свяжитесь удобным способом
          </h2>
        </m.div>
        <m.p className="text-[13px] text-slate-500" variants={fadeUp}>
          Отвечаем в рабочее время: {CONTACTS.schedule}
        </m.p>
      </m.div>

      <m.div
        className="mt-10 grid gap-4 md:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerContainer}
      >
        <m.div
          className="rounded-2xl bg-[#102d50] p-6 text-white"
          variants={scaleIn}
          whileHover={{ y: -4 }}
        >
          <Icon name="phone" />
          <p className="mt-8 font-mono text-[10px] tracking-[.15em] text-[#83c6ff]">ТЕЛЕФОН</p>
          {CONTACTS.phones.map((phone) => (
            <a
              key={phone.href}
              href={phone.href}
              onClick={trackPhoneClick}
              className="mt-3 block text-[17px] font-extrabold first:mt-3"
            >
              {phone.display}
            </a>
          ))}
          <a
            href={CONTACTS.phones[0].href}
            onClick={trackPhoneClick}
            className="mt-7 inline-flex items-center gap-2 text-[12px] font-bold text-[#83c6ff]"
          >
            Позвонить
            <Icon name="arrow" size={16} />
          </a>
        </m.div>

        <m.div
          className="rounded-2xl border border-slate-200 p-6"
          variants={scaleIn}
          whileHover={{ y: -4 }}
        >
          <Icon name="telegram" />
          <p className="mt-8 font-mono text-[10px] tracking-[.15em] text-[#0875e1]">МЕССЕНДЖЕРЫ</p>
          <a
            href={CONTACTS.telegram.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackMessengerClick}
            className="mt-3 block text-[12px] font-extrabold text-[#102d50]"
          >
            {CONTACTS.telegram.label} <span className="text-[#0875e1]">→</span>
          </a>
          <a
            href={CONTACTS.max.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackMessengerClick}
            className="mt-3 block text-[12px] font-extrabold text-[#102d50]"
          >
            {CONTACTS.max.label} <span className="text-[#0875e1]">→</span>
          </a>
        </m.div>

        <m.div
          className="rounded-2xl border border-slate-200 p-6"
          variants={scaleIn}
          whileHover={{ y: -4 }}
        >
          <Icon name="mail" />
          <p className="mt-8 font-mono text-[10px] tracking-[.15em] text-[#0875e1]">ЭЛЕКТРОННАЯ ПОЧТА</p>
          <a
            href={CONTACTS.email.href}
            className="mt-3 block break-all text-[16px] font-extrabold text-[#102d50]"
          >
            {CONTACTS.email.display}
          </a>
          <p className="mt-5 text-[12px] leading-relaxed text-slate-500">
            Для запросов, счетов и технической документации.
          </p>
        </m.div>
      </m.div>
    </section>
  )
}
