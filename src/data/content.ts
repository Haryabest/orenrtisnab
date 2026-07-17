import { DEFAULT_SITE_CONTENT } from '../../shared/site-content'

export const NAV_ITEMS = DEFAULT_SITE_CONTENT.header.nav

export const PRODUCTS = DEFAULT_SITE_CONTENT.catalog.items.map(
  (item) => [item.title, item.description, item.number] as [string, string, string],
)

export const BENEFITS = DEFAULT_SITE_CONTENT.benefits.items.map(
  (item) => [item.icon, item.title, item.description] as const,
)

export const PROCESS_STEPS = DEFAULT_SITE_CONTENT.process.steps
export const DELIVERY_OPTIONS = DEFAULT_SITE_CONTENT.delivery.options.map(
  (o) => [o.title, o.icon] as const,
)
export const DELIVERY_MAP_POINTS = DEFAULT_SITE_CONTENT.delivery.mapPoints.map(
  (p) => [p.x, p.y] as [number, number],
)

export const CONTACTS = {
  phones: DEFAULT_SITE_CONTENT.contacts.phones,
  telegram: DEFAULT_SITE_CONTENT.contacts.telegram,
  max: DEFAULT_SITE_CONTENT.contacts.max,
  email: DEFAULT_SITE_CONTENT.contacts.email,
  schedule: DEFAULT_SITE_CONTENT.contacts.schedule,
}
