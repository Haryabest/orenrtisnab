import { Typography } from 'antd'
import type { ContentSection, IconName, SiteContent } from '../../../shared/site-content'
import { Field, FormSection, IconSelect, ImageField, SubBlock } from './FormFields'

const ICON_OPTIONS: IconName[] = [
  'check',
  'arrow',
  'box',
  'bolt',
  'measure',
  'document',
  'handshake',
  'phone',
  'telegram',
  'truck',
  'pin',
  'package',
  'headset',
  'mail',
  'menu',
  'chevron',
]

export function SectionEditor({
  section,
  data,
  onChange,
  onUpload,
}: {
  section: ContentSection
  data: SiteContent[ContentSection]
  onChange: (data: SiteContent[ContentSection]) => void
  onUpload: (file: File) => Promise<string>
}) {
  const upload = async (file: File, setter: (url: string) => void) => {
    const url = await onUpload(file)
    setter(url)
  }

  switch (section) {
    case 'site': {
      const d = data as SiteContent['site']
      const set = (patch: Partial<typeof d>) => onChange({ ...d, ...patch })
      return (
        <>
          <FormSection title="Основное">
            <Field label="Название" value={d.name} onChange={(v) => set({ name: v })} />
            <Field label="Юр. название" value={d.legalName} onChange={(v) => set({ legalName: v })} />
            <Field label="URL сайта" value={d.url} onChange={(v) => set({ url: v })} />
            <Field label="Город" value={d.city} onChange={(v) => set({ city: v })} />
            <Field label="Регион" value={d.addressRegion} onChange={(v) => set({ addressRegion: v })} />
            <Field label="Title (SEO)" value={d.title} onChange={(v) => set({ title: v })} />
            <Field label="Описание (SEO)" value={d.description} onChange={(v) => set({ description: v })} multiline />
            <Field
              label="Ключевые слова (через запятую)"
              value={d.keywords.join(', ')}
              onChange={(v) => set({ keywords: v.split(',').map((s) => s.trim()).filter(Boolean) })}
            />
            <Field label="Цвет темы" value={d.themeColor} onChange={(v) => set({ themeColor: v })} />
            <ImageField
              label="OG-изображение"
              value={d.ogImage}
              onChange={(v) => set({ ogImage: v })}
              onUpload={(f) => upload(f, (url) => set({ ogImage: url }))}
            />
            <Field label="Alt OG-изображения" value={d.ogImageAlt} onChange={(v) => set({ ogImageAlt: v })} />
          </FormSection>
          <FormSection title="Интеграции">
            <Field label="Яндекс Метрика ID" value={d.yandexMetrikaId} onChange={(v) => set({ yandexMetrikaId: v })} />
            <Field label="URL отправки заявок" value={d.formEndpoint} onChange={(v) => set({ formEndpoint: v })} />
            <Field label="Часы открытия" value={d.openingHours.opens} onChange={(v) => set({ openingHours: { ...d.openingHours, opens: v } })} />
            <Field label="Часы закрытия" value={d.openingHours.closes} onChange={(v) => set({ openingHours: { ...d.openingHours, closes: v } })} />
          </FormSection>
        </>
      )
    }

    case 'header': {
      const d = data as SiteContent['header']
      const set = (patch: Partial<typeof d>) => onChange({ ...d, ...patch })
      return (
        <FormSection title="Шапка">
          <ImageField
            label="Логотип"
            value={d.logoImage}
            onChange={(v) => set({ logoImage: v })}
            onUpload={(f) => upload(f, (url) => set({ logoImage: url }))}
          />
          <Field label="Монограмма (если нет логотипа)" value={d.monogram} onChange={(v) => set({ monogram: v })} />
          <Field label="Название" value={d.name} onChange={(v) => set({ name: v })} />
          <Field label="Подзаголовок" value={d.tagline} onChange={(v) => set({ tagline: v })} />
          <Field label="Ссылка логотипа" value={d.logoHref} onChange={(v) => set({ logoHref: v })} />
          <Field label="Текст кнопки" value={d.ctaText} onChange={(v) => set({ ctaText: v })} />
          <Field label="Ссылка кнопки" value={d.ctaHref} onChange={(v) => set({ ctaHref: v })} />
          {(d.nav ?? []).map((item, i) => (
            <SubBlock key={i} title={`Пункт меню ${i + 1}`}>
              <Field label="Текст" value={item.label} onChange={(v) => {
                const nav = [...d.nav]
                nav[i] = { ...nav[i], label: v }
                set({ nav })
              }} />
              <Field label="Ссылка" value={item.href} onChange={(v) => {
                const nav = [...d.nav]
                nav[i] = { ...nav[i], href: v }
                set({ nav })
              }} />
            </SubBlock>
          ))}
        </FormSection>
      )
    }

    case 'hero': {
      const d = data as SiteContent['hero']
      const set = (patch: Partial<typeof d>) => onChange({ ...d, ...patch })
      return (
        <>
          <FormSection title="Hero">
            <ImageField
              label="Фоновое фото"
              value={d.backgroundImage}
              onChange={(v) => set({ backgroundImage: v })}
              onUpload={(f) => upload(f, (url) => set({ backgroundImage: url }))}
            />
            <Field label="Надзаголовок" value={d.eyebrow} onChange={(v) => set({ eyebrow: v })} />
            <Field label="Заголовок" value={d.heading} onChange={(v) => set({ heading: v })} />
            <Field label="Подзаголовок" value={d.subtitle} onChange={(v) => set({ subtitle: v })} />
            <Field label="Описание" value={d.description} onChange={(v) => set({ description: v })} multiline />
            <Field label="Кнопка" value={d.ctaText} onChange={(v) => set({ ctaText: v })} />
            <Field label="Ссылка кнопки" value={d.ctaHref} onChange={(v) => set({ ctaHref: v })} />
          </FormSection>
          {d.stats.map((stat, i) => (
            <FormSection key={i} title={`Статистика ${i + 1}`}>
              <Field label="Значение" value={stat.value} onChange={(v) => {
                const stats = [...d.stats]
                stats[i] = { ...stats[i], value: v }
                set({ stats })
              }} />
              <Field label="Строка 1" value={stat.line1} onChange={(v) => {
                const stats = [...d.stats]
                stats[i] = { ...stats[i], line1: v }
                set({ stats })
              }} />
              <Field label="Строка 2" value={stat.line2} onChange={(v) => {
                const stats = [...d.stats]
                stats[i] = { ...stats[i], line2: v }
                set({ stats })
              }} />
            </FormSection>
          ))}
        </>
      )
    }

    case 'heroVisual': {
      const d = data as SiteContent['heroVisual']
      const set = (patch: Partial<typeof d>) => onChange({ ...d, ...patch })
      return (
        <FormSection title="Hero — карточка">
          <Field label="Надзаголовок" value={d.eyebrow} onChange={(v) => set({ eyebrow: v })} />
          <Field label="Текст" value={d.text} onChange={(v) => set({ text: v })} multiline />
        </FormSection>
      )
    }

    case 'benefits': {
      const d = data as SiteContent['benefits']
      const set = (patch: Partial<typeof d>) => onChange({ ...d, ...patch })
      return (
        <>
          <FormSection title="Заголовки">
            <Field label="Надзаголовок" value={d.eyebrow} onChange={(v) => set({ eyebrow: v })} />
            <Field label="Заголовок 1" value={d.headingLine1} onChange={(v) => set({ headingLine1: v })} />
            <Field label="Заголовок 2" value={d.headingLine2} onChange={(v) => set({ headingLine2: v })} />
            <Field label="Боковой текст" value={d.sidebar} onChange={(v) => set({ sidebar: v })} multiline />
          </FormSection>
          {d.items.map((item, i) => (
            <FormSection key={i} title={`Преимущество ${i + 1}`}>
              <IconSelect
                label="Иконка"
                value={item.icon}
                options={ICON_OPTIONS}
                onChange={(v) => {
                  const items = [...d.items]
                  items[i] = { ...items[i], icon: v as IconName }
                  set({ items })
                }}
              />
              <Field label="Заголовок" value={item.title} onChange={(v) => {
                const items = [...d.items]
                items[i] = { ...items[i], title: v }
                set({ items })
              }} />
              <Field label="Описание" value={item.description} onChange={(v) => {
                const items = [...d.items]
                items[i] = { ...items[i], description: v }
                set({ items })
              }} multiline />
            </FormSection>
          ))}
        </>
      )
    }

    case 'catalog': {
      const d = data as SiteContent['catalog']
      const set = (patch: Partial<typeof d>) => onChange({ ...d, ...patch })
      return (
        <>
          <FormSection title="Заголовки">
            <Field label="Надзаголовок" value={d.eyebrow} onChange={(v) => set({ eyebrow: v })} />
            <Field label="Заголовок 1" value={d.headingLine1} onChange={(v) => set({ headingLine1: v })} />
            <Field label="Заголовок 2" value={d.headingLine2} onChange={(v) => set({ headingLine2: v })} />
            <Field label="CTA текст" value={d.ctaText} onChange={(v) => set({ ctaText: v })} />
            <Field label="Метка категории" value={d.categoryLabel} onChange={(v) => set({ categoryLabel: v })} />
          </FormSection>
          {d.items.map((item, i) => (
            <FormSection key={i} title={`Категория ${item.number}`}>
              <Field label="Название" value={item.title} onChange={(v) => {
                const items = [...d.items]
                items[i] = { ...items[i], title: v }
                set({ items })
              }} />
              <Field label="Описание" value={item.description} onChange={(v) => {
                const items = [...d.items]
                items[i] = { ...items[i], description: v }
                set({ items })
              }} />
              <Field label="Номер" value={item.number} onChange={(v) => {
                const items = [...d.items]
                items[i] = { ...items[i], number: v }
                set({ items })
              }} />
              <ImageField
                label="Фото"
                hint="JPEG или PNG до 12 МБ. При загрузке сжимается в WebP без заметной потери качества."
                value={item.image}
                onChange={(v) => {
                  const items = [...d.items]
                  items[i] = { ...items[i], image: v }
                  set({ items })
                }}
                onUpload={(f) =>
                  upload(f, (url) => {
                    const items = [...d.items]
                    items[i] = { ...items[i], image: url }
                    set({ items })
                  })
                }
              />
            </FormSection>
          ))}
        </>
      )
    }

    case 'process': {
      const d = data as SiteContent['process']
      const set = (patch: Partial<typeof d>) => onChange({ ...d, ...patch })
      return (
        <>
          <FormSection title="Заголовки">
            <Field label="Надзаголовок" value={d.eyebrow} onChange={(v) => set({ eyebrow: v })} />
            <Field label="Заголовок" value={d.heading} onChange={(v) => set({ heading: v })} />
          </FormSection>
          {d.steps.map((step, i) => (
            <FormSection key={i} title={`Шаг ${i + 1}`}>
              <Field label="Заголовок" value={step.title} onChange={(v) => {
                const steps = [...d.steps]
                steps[i] = { ...steps[i], title: v }
                set({ steps })
              }} />
              <Field label="Описание" value={step.description} onChange={(v) => {
                const steps = [...d.steps]
                steps[i] = { ...steps[i], description: v }
                set({ steps })
              }} multiline />
            </FormSection>
          ))}
        </>
      )
    }

    case 'delivery': {
      const d = data as SiteContent['delivery']
      const set = (patch: Partial<typeof d>) => onChange({ ...d, ...patch })
      return (
        <>
          <FormSection title="Тексты">
            <Field label="Надзаголовок" value={d.eyebrow} onChange={(v) => set({ eyebrow: v })} />
            <Field label="Заголовок 1" value={d.headingLine1} onChange={(v) => set({ headingLine1: v })} />
            <Field label="Заголовок 2" value={d.headingLine2} onChange={(v) => set({ headingLine2: v })} />
            <Field label="Описание" value={d.description} onChange={(v) => set({ description: v })} multiline />
            <Field label="Хаб на карте" value={d.hubLabel} onChange={(v) => set({ hubLabel: v })} />
            <Field label="Карточка — надзаголовок" value={d.mapEyebrow} onChange={(v) => set({ mapEyebrow: v })} />
            <Field label="Карточка — текст" value={d.mapText} onChange={(v) => set({ mapText: v })} />
          </FormSection>
          {d.options.map((opt, i) => (
            <FormSection key={i} title={`Способ ${i + 1}`}>
              <Field label="Название" value={opt.title} onChange={(v) => {
                const options = [...d.options]
                options[i] = { ...options[i], title: v }
                set({ options })
              }} />
            </FormSection>
          ))}
        </>
      )
    }

    case 'requestForm': {
      const d = data as SiteContent['requestForm']
      const set = (patch: Partial<typeof d>) => onChange({ ...d, ...patch })
      return (
        <FormSection title="Форма заявки">
          <Field label="Надзаголовок" value={d.eyebrow} onChange={(v) => set({ eyebrow: v })} />
          <Field label="Заголовок" value={d.heading} onChange={(v) => set({ heading: v })} />
          <Field label="Описание" value={d.description} onChange={(v) => set({ description: v })} multiline />
          <Field label="Бейдж доверия" value={d.trustBadge} onChange={(v) => set({ trustBadge: v })} />
          <Field label="Имя — label" value={d.fields.name.label} onChange={(v) => set({ fields: { ...d.fields, name: { ...d.fields.name, label: v } } })} />
          <Field label="Имя — placeholder" value={d.fields.name.placeholder} onChange={(v) => set({ fields: { ...d.fields, name: { ...d.fields.name, placeholder: v } } })} />
          <Field label="Телефон — label" value={d.fields.phone.label} onChange={(v) => set({ fields: { ...d.fields, phone: { ...d.fields.phone, label: v } } })} />
          <Field label="Телефон — placeholder" value={d.fields.phone.placeholder} onChange={(v) => set({ fields: { ...d.fields, phone: { ...d.fields.phone, placeholder: v } } })} />
          <Field label="Email — label" value={d.fields.email.label} onChange={(v) => set({ fields: { ...d.fields, email: { ...d.fields.email, label: v } } })} />
          <Field label="Email — placeholder" value={d.fields.email.placeholder} onChange={(v) => set({ fields: { ...d.fields, email: { ...d.fields.email, placeholder: v } } })} />
          <Field label="Текст согласия" value={d.consentText} onChange={(v) => set({ consentText: v })} />
          <Field label="Ссылка согласия" value={d.consentLinkText} onChange={(v) => set({ consentLinkText: v })} />
          <Field label="Кнопка отправки" value={d.submitText} onChange={(v) => set({ submitText: v })} />
          <Field label="Текст успеха" value={d.successTitle} onChange={(v) => set({ successTitle: v })} />
          <Field label="Сообщение успеха" value={d.successMessage} onChange={(v) => set({ successMessage: v })} multiline />
          <Field label="Ошибка телефона" value={d.errorPhone} onChange={(v) => set({ errorPhone: v })} />
          <Field label="Ошибка отправки" value={d.errorSubmit} onChange={(v) => set({ errorSubmit: v })} multiline />
        </FormSection>
      )
    }

    case 'contacts': {
      const d = data as SiteContent['contacts']
      const set = (patch: Partial<typeof d>) => onChange({ ...d, ...patch })
      return (
        <>
          <FormSection title="Заголовки">
            <Field label="Надзаголовок" value={d.eyebrow} onChange={(v) => set({ eyebrow: v })} />
            <Field label="Заголовок" value={d.heading} onChange={(v) => set({ heading: v })} />
            <Field label="Расписание" value={d.schedule} onChange={(v) => set({ schedule: v })} />
          </FormSection>
          {d.phones.map((phone, i) => (
            <FormSection key={i} title={`Телефон ${i + 1}`}>
              <Field label="Отображение" value={phone.display} onChange={(v) => {
                const phones = [...d.phones]
                phones[i] = { ...phones[i], display: v }
                set({ phones })
              }} />
              <Field label="Ссылка tel:" value={phone.href} onChange={(v) => {
                const phones = [...d.phones]
                phones[i] = { ...phones[i], href: v }
                set({ phones })
              }} />
            </FormSection>
          ))}
          <FormSection title="Мессенджеры">
            <Field label="Telegram" value={d.telegram.label} onChange={(v) => set({ telegram: { ...d.telegram, label: v } })} />
            <Field label="Telegram URL" value={d.telegram.href} onChange={(v) => set({ telegram: { ...d.telegram, href: v } })} />
            <Field label="MAX" value={d.max.label} onChange={(v) => set({ max: { ...d.max, label: v } })} />
            <Field label="MAX URL" value={d.max.href} onChange={(v) => set({ max: { ...d.max, href: v } })} />
          </FormSection>
          <FormSection title="Email">
            <Field label="Email" value={d.email.display} onChange={(v) => set({ email: { ...d.email, display: v } })} />
            <Field label="mailto:" value={d.email.href} onChange={(v) => set({ email: { ...d.email, href: v } })} />
          </FormSection>
        </>
      )
    }

    case 'faq': {
      const d = data as SiteContent['faq']
      const set = (patch: Partial<typeof d>) => onChange({ ...d, ...patch })
      return (
        <>
          <FormSection title="Заголовки">
            <Field label="Надзаголовок" value={d.eyebrow} onChange={(v) => set({ eyebrow: v })} />
            <Field label="Заголовок" value={d.heading} onChange={(v) => set({ heading: v })} />
          </FormSection>
          {d.items.map((item, i) => (
            <FormSection key={i} title={`Вопрос ${i + 1}`}>
              <Field label="Вопрос" value={item.question} onChange={(v) => {
                const items = [...d.items]
                items[i] = { ...items[i], question: v }
                set({ items })
              }} />
              <Field label="Ответ" value={item.answer} onChange={(v) => {
                const items = [...d.items]
                items[i] = { ...items[i], answer: v }
                set({ items })
              }} multiline />
            </FormSection>
          ))}
        </>
      )
    }

    case 'footer': {
      const d = data as SiteContent['footer']
      const set = (patch: Partial<typeof d>) => onChange({ ...d, ...patch })
      return (
        <FormSection title="Подвал">
          <Field label="Название" value={d.name} onChange={(v) => set({ name: v })} />
          <Field label="Подзаголовок" value={d.tagline} onChange={(v) => set({ tagline: v })} />
          <Field label="Копирайт" value={d.copyright} onChange={(v) => set({ copyright: v })} />
          {d.links.map((link, i) => (
            <SubBlock key={i} title={`Ссылка ${i + 1}`}>
              <Field label="Текст" value={link.text} onChange={(v) => {
                const links = [...d.links]
                links[i] = { ...links[i], text: v }
                set({ links })
              }} />
              <Field label="URL" value={link.href} onChange={(v) => {
                const links = [...d.links]
                links[i] = { ...links[i], href: v }
                set({ links })
              }} />
            </SubBlock>
          ))}
        </FormSection>
      )
    }

    case 'floatingCta': {
      const d = data as SiteContent['floatingCta']
      const set = (patch: Partial<typeof d>) => onChange({ ...d, ...patch })
      return (
        <FormSection title="Плавающая кнопка">
          <Field label="Текст" value={d.text} onChange={(v) => set({ text: v })} />
          <Field label="Ссылка" value={d.href} onChange={(v) => set({ href: v })} />
        </FormSection>
      )
    }

    default:
      return <Typography.Text type="secondary">Редактор для этой секции не настроен.</Typography.Text>
  }
}
