import { useState, type FormEvent } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { Icon } from '../Icon/Icon'
import { trackFormSubmit } from '../../utils/analytics'
import { submitRequestForm, validatePhone } from '../../utils/formSubmit'
import { fadeUp, scaleIn, staggerContainer, viewport } from '../motion/variants'

export function RequestFormSection() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') ?? '')
    const phone = String(formData.get('phone') ?? '')
    const email = String(formData.get('email') ?? '')
    const honeypot = String(formData.get('website') ?? '')

    if (!validatePhone(phone)) {
      setError('Укажите корректный номер телефона')
      return
    }

    setLoading(true)

    try {
      await submitRequestForm({ name, phone, email, honeypot })
      trackFormSubmit()
      setSubmitted(true)
      form.reset()
    } catch {
      setError('Не удалось отправить заявку. Попробуйте позвонить или написать в мессенджер.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="request" className="bg-[#f5f7f9] px-5 py-20 lg:px-8">
      <m.div
        className="relative mx-auto max-w-[1040px] overflow-hidden rounded-[28px] bg-[#0875e1] px-6 py-10 text-white shadow-[0_24px_60px_rgba(8,117,225,.22)] md:px-12 md:py-14"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={scaleIn}
      >
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border-[52px] border-white/10" />

        <div className="relative grid gap-10 md:grid-cols-[.82fr_1.18fr]">
          <m.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport}>
            <m.p className="font-mono text-[10px] tracking-[.16em] text-blue-100" variants={fadeUp}>
              ОТВЕТИМ В РАБОЧЕЕ ВРЕМЯ
            </m.p>
            <m.h2
              className="mt-4 text-[30px] font-extrabold leading-tight tracking-[-.055em] md:text-[38px]"
              variants={fadeUp}
            >
              Оставьте заявку — менеджер свяжется с вами
            </m.h2>
            <m.p className="mt-5 text-[13px] leading-relaxed text-blue-100" variants={fadeUp}>
              Подберём позицию по размеру, артикулу или фото детали. Уточним цену и срок отгрузки.
            </m.p>
            <m.div className="mt-7 flex items-center gap-3 text-[12px] font-semibold text-blue-100" variants={fadeUp}>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
                <Icon name="headset" size={18} />
              </span>
              Без навязчивых звонков
            </m.div>
          </m.div>

          <m.form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-5 text-[#142033] shadow-xl md:p-6"
            noValidate
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewport}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <m.div
                  key="success"
                  className="flex min-h-[285px] flex-col items-center justify-center text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35 }}
                >
                  <m.span
                    className="grid h-14 w-14 place-items-center rounded-full bg-[#eaf4ff] text-[#0875e1]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                  >
                    <Icon name="check" size={28} />
                  </m.span>
                  <h3 className="mt-5 text-xl font-extrabold text-[#102d50]">Заявка отправлена</h3>
                  <p className="mt-2 max-w-[250px] text-sm leading-relaxed text-slate-500">
                    Менеджер свяжется с вами в ближайшее рабочее время.
                  </p>
                </m.div>
              ) : (
                <m.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <label className="block text-[11px] font-bold text-slate-600">
                    Имя
                    <input
                      name="name"
                      required
                      placeholder="Как к вам обращаться"
                      className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none transition placeholder:text-slate-400 focus:border-[#0875e1] focus:ring-2 focus:ring-blue-100"
                    />
                  </label>

                  <label className="mt-3 block text-[11px] font-bold text-slate-600">
                    Телефон
                    <input
                      name="phone"
                      required
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none transition placeholder:text-slate-400 focus:border-[#0875e1] focus:ring-2 focus:ring-blue-100"
                    />
                  </label>

                  <label className="mt-3 block text-[11px] font-bold text-slate-600">
                    Email
                    <input
                      required
                      name="email"
                      type="email"
                      placeholder="mail@company.ru"
                      className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none transition placeholder:text-slate-400 focus:border-[#0875e1] focus:ring-2 focus:ring-blue-100"
                    />
                  </label>

                  <input
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />

                  <label className="mt-4 flex items-start gap-2 text-[10px] leading-snug text-slate-500">
                    <input required type="checkbox" className="mt-0.5 accent-[#0875e1]" />
                    Я согласен на обработку персональных данных и с{' '}
                    <a href="/privacy.html" className="text-[#0875e1] underline">
                      политикой конфиденциальности
                    </a>
                  </label>

                  {error && (
                    <m.p
                      className="mt-3 text-[12px] font-semibold text-red-600"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </m.p>
                  )}

                  <m.button
                    type="submit"
                    disabled={loading}
                    className="mt-5 h-12 w-full rounded-lg bg-[#0875e1] text-[13px] font-extrabold text-white transition hover:bg-[#0768c9] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? 'Отправка…' : 'Получить консультацию'}
                  </m.button>
                </m.div>
              )}
            </AnimatePresence>
          </m.form>
        </div>
      </m.div>
    </section>
  )
}
