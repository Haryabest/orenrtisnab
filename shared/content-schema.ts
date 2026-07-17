import { z } from 'zod'

const iconName = z.enum([
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
])

const safeText = z.string().max(5000)
const safeShort = z.string().max(500)
const safeUrl = z.string().max(2000)
const safeHref = z.string().max(500)

export const siteContentSchema = z.object({
  site: z.object({
    name: safeShort,
    legalName: safeShort,
    url: safeUrl,
    locale: safeShort,
    language: safeShort,
    region: safeShort,
    city: safeShort,
    addressRegion: safeShort,
    description: safeText,
    keywords: z.array(safeShort).max(50),
    title: safeShort,
    ogImage: safeHref,
    ogImageAlt: safeShort,
    themeColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    yandexMetrikaId: z.string().max(20),
    formEndpoint: z.string().max(2000),
    openingHours: z.object({ opens: safeShort, closes: safeShort }),
    areaServed: z.array(safeShort).max(20),
    priceRange: safeShort,
  }),
  header: z.object({
    monogram: safeShort,
    name: safeShort,
    tagline: safeShort,
    logoHref: safeHref,
    ctaText: safeShort,
    ctaHref: safeHref,
    menuAriaLabel: safeShort,
    nav: z.array(z.object({ label: safeShort, href: safeHref })).max(20),
  }),
  hero: z.object({
    backgroundImage: safeHref,
    eyebrow: safeShort,
    heading: safeShort,
    subtitle: safeText,
    description: safeText,
    ctaText: safeShort,
    ctaHref: safeHref,
    stats: z.array(z.object({ value: safeShort, line1: safeShort, line2: safeShort })).max(6),
  }),
  heroVisual: z.object({
    eyebrow: safeShort,
    text: safeText,
  }),
  benefits: z.object({
    eyebrow: safeShort,
    headingLine1: safeShort,
    headingLine2: safeShort,
    sidebar: safeText,
    items: z
      .array(z.object({ icon: iconName, title: safeShort, description: safeText }))
      .max(12),
  }),
  catalog: z.object({
    eyebrow: safeShort,
    headingLine1: safeShort,
    headingLine2: safeShort,
    ctaText: safeShort,
    ctaHref: safeHref,
    categoryLabel: safeShort,
    items: z
      .array(
        z.object({
          title: safeShort,
          description: safeText,
          number: safeShort,
          image: z.preprocess((val) => (typeof val === 'string' ? val : ''), safeHref),
        }),
      )
      .max(20),
  }),
  process: z.object({
    eyebrow: safeShort,
    heading: safeShort,
    steps: z.array(z.object({ title: safeShort, description: safeText })).max(10),
  }),
  delivery: z.object({
    eyebrow: safeShort,
    headingLine1: safeShort,
    headingLine2: safeShort,
    description: safeText,
    hubLabel: safeShort,
    mapEyebrow: safeShort,
    mapText: safeShort,
    options: z.array(z.object({ title: safeShort, icon: iconName })).max(10),
    mapPoints: z.array(z.object({ x: z.number().min(0).max(100), y: z.number().min(0).max(100) })).max(20),
  }),
  requestForm: z.object({
    eyebrow: safeShort,
    heading: safeShort,
    description: safeText,
    trustBadge: safeShort,
    fields: z.object({
      name: z.object({ label: safeShort, placeholder: safeShort }),
      phone: z.object({ label: safeShort, placeholder: safeShort, mask: safeShort }),
      email: z.object({ label: safeShort, placeholder: safeShort }),
    }),
    consentText: safeText,
    consentLinkText: safeShort,
    consentLinkHref: safeHref,
    submitText: safeShort,
    submitLoadingText: safeShort,
    errorPhone: safeShort,
    errorSubmit: safeText,
    successTitle: safeShort,
    successMessage: safeText,
  }),
  contacts: z.object({
    eyebrow: safeShort,
    heading: safeShort,
    schedulePrefix: safeShort,
    phoneCardLabel: safeShort,
    phoneCta: safeShort,
    messengersCardLabel: safeShort,
    emailCardLabel: safeShort,
    emailDescription: safeText,
    phones: z.array(z.object({ display: safeShort, href: safeHref })).max(5),
    telegram: z.object({ label: safeShort, href: safeUrl }),
    max: z.object({ label: safeShort, href: safeUrl }),
    email: z.object({ display: safeShort, href: safeHref }),
    schedule: safeShort,
  }),
  faq: z.object({
    eyebrow: safeShort,
    heading: safeShort,
    items: z.array(z.object({ question: safeShort, answer: safeText })).max(30),
  }),
  footer: z.object({
    name: safeShort,
    tagline: safeShort,
    copyright: safeShort,
    links: z.array(z.object({ text: safeShort, href: safeHref })).max(10),
  }),
  floatingCta: z.object({
    text: safeShort,
    href: safeHref,
  }),
})

export const loginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(8).max(200),
})
