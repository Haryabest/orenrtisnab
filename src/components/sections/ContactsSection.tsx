import { m } from 'framer-motion'
import { Icon } from '../Icon/Icon'
import { useContent } from '../../context/ContentContext'
import { trackMessengerClick, trackPhoneClick } from '../../utils/analytics'
import { fadeUp, scaleIn, staggerContainer, viewport } from '../motion/variants'

export function ContactsSection() {
  const { content } = useContent()
  const { contacts } = content

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
          <p className="font-mono text-[10px] tracking-[.16em] text-[#0875e1]">{contacts.eyebrow}</p>
          <h2 className="mt-3 text-[31px] font-extrabold tracking-[-.055em] text-[#102d50] md:text-[40px]">
            {contacts.heading}
          </h2>
        </m.div>
        <m.p className="text-[13px] text-slate-500" variants={fadeUp}>
          {contacts.schedulePrefix} {contacts.schedule}
        </m.p>
      </m.div>

      <m.div
        className="mt-10 grid gap-4 md:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerContainer}
      >
        <m.div className="rounded-2xl bg-[#102d50] p-6 text-white" variants={scaleIn} whileHover={{ y: -4 }}>
          <Icon name="phone" />
          <p className="mt-8 font-mono text-[10px] tracking-[.15em] text-[#83c6ff]">{contacts.phoneCardLabel}</p>
          {contacts.phones.map((phone) => (
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
            href={contacts.phones[0]?.href ?? '#'}
            onClick={trackPhoneClick}
            className="mt-7 inline-flex items-center gap-2 text-[12px] font-bold text-[#83c6ff]"
          >
            {contacts.phoneCta}
            <Icon name="arrow" size={16} />
          </a>
        </m.div>

        <m.div className="rounded-2xl border border-slate-200 p-6" variants={scaleIn} whileHover={{ y: -4 }}>
          <Icon name="telegram" />
          <p className="mt-8 font-mono text-[10px] tracking-[.15em] text-[#0875e1]">{contacts.messengersCardLabel}</p>
          <a
            href={contacts.telegram.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackMessengerClick}
            className="mt-3 block text-[12px] font-extrabold text-[#102d50]"
          >
            {contacts.telegram.label} <span className="text-[#0875e1]">→</span>
          </a>
          <a
            href={contacts.max.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackMessengerClick}
            className="mt-3 block text-[12px] font-extrabold text-[#102d50]"
          >
            {contacts.max.label} <span className="text-[#0875e1]">→</span>
          </a>
        </m.div>

        <m.div className="rounded-2xl border border-slate-200 p-6" variants={scaleIn} whileHover={{ y: -4 }}>
          <Icon name="mail" />
          <p className="mt-8 font-mono text-[10px] tracking-[.15em] text-[#0875e1]">{contacts.emailCardLabel}</p>
          <a
            href={contacts.email.href}
            className="mt-3 block break-all text-[16px] font-extrabold text-[#102d50]"
          >
            {contacts.email.display}
          </a>
          <p className="mt-5 text-[12px] leading-relaxed text-slate-500">{contacts.emailDescription}</p>
        </m.div>
      </m.div>
    </section>
  )
}
