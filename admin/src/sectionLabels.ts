const SECTION_LABELS: Record<string, string> = {
  site: 'Сайт и SEO',
  header: 'Шапка (Header)',
  hero: 'Главный экран (Hero)',
  heroVisual: 'Hero — карточка справа',
  benefits: 'Преимущества',
  catalog: 'Каталог',
  process: 'Процесс работы',
  delivery: 'Доставка',
  requestForm: 'Форма заявки',
  contacts: 'Контакты',
  faq: 'FAQ',
  footer: 'Подвал (Footer)',
  floatingCta: 'Плавающая кнопка',
}

export function getSectionLabel(key: string) {
  return SECTION_LABELS[key] ?? key
}

export const SECTION_ORDER = Object.keys(SECTION_LABELS)
