import { CONTACTS, PRODUCTS } from './content'

export const SITE = {
  name: 'ОРЕНРТИСНАБ',
  legalName: 'ОРЕНРТИСНАБ',
  url: 'https://orenrtisnab.ru',
  locale: 'ru_RU',
  language: 'ru',
  region: 'RU',
  city: 'Оренбург',
  description:
    'ОРЕНРТИСНАБ — поставка сальников, манжет по ГОСТ, уплотнительных колец O-Ring, X-Ring, V-Ring, грязесъёмников и РТИ. Более 500 размеров в наличии. Отгрузка в день заказа. Доставка по России.',
  keywords: [
    'сальники купить',
    'манжеты по ГОСТ',
    'уплотнительные кольца',
    'O-Ring',
    'X-Ring',
    'V-Ring',
    'грязесъёмники',
    'РТИ',
    'резинотехнические изделия',
    'уплотнения промышленные',
    'Оренбург',
    'ОРЕНРТИСНАБ',
    'поставка уплотнений',
    'B2B уплотнения',
  ],
  title: 'ОРЕНРТИСНАБ — сальники, манжеты, уплотнения | 500+ размеров в наличии',
  ogImage: '/images/og.svg',
  ogImageAlt: 'ОРЕНРТИСНАБ — промышленные уплотнения и РТИ',
  themeColor: '#102d50',
} as const

export const FAQ_ITEMS = [
  {
    question: 'Какие уплотнения вы поставляете?',
    answer:
      'Сальники (армированные манжеты), манжеты по ГОСТ, уплотнительные кольца O-Ring, X-Ring, V-Ring, грязесъёмники, техпластины, шнуры и другие РТИ.',
  },
  {
    question: 'Есть ли товар в наличии?',
    answer: 'Да, на складе более 500 ходовых размеров. Отгрузка возможна в день заказа.',
  },
  {
    question: 'Работаете ли вы с юридическими лицами?',
    answer: 'Да, работаем с B2B-клиентами: выставляем счёт, предоставляем закрывающие документы и заключаем договор.',
  },
  {
    question: 'Как оформить заказ?',
    answer:
      'Оставьте заявку на сайте, позвоните по телефону или напишите в Telegram или MAX. Менеджер подтвердит наличие, цену и согласует доставку.',
  },
  {
    question: 'Куда доставляете?',
    answer: 'Самовывоз, курьер, транспортные компании — по всей России и странам ЕАЭС.',
  },
] as const

export function buildStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        inLanguage: SITE.language,
        publisher: { '@id': `${SITE.url}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE.url}/#organization`,
        name: SITE.name,
        legalName: SITE.legalName,
        url: SITE.url,
        logo: `${SITE.url}/favicon.svg`,
        email: CONTACTS.email.display,
        telephone: CONTACTS.phones.map((p) => p.href.replace('tel:', '')),
        areaServed: ['RU', 'KZ', 'BY', 'AM', 'KG'],
        sameAs: [CONTACTS.telegram.href, CONTACTS.max.href],
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${SITE.url}/#localbusiness`,
        name: SITE.name,
        description: SITE.description,
        url: SITE.url,
        telephone: CONTACTS.phones[0].href.replace('tel:', ''),
        email: CONTACTS.email.display,
        address: {
          '@type': 'PostalAddress',
          addressLocality: SITE.city,
          addressRegion: 'Оренбургская область',
          addressCountry: 'RU',
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
        priceRange: '₽₽',
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE.url}/#webpage`,
        url: SITE.url,
        name: SITE.title,
        description: SITE.description,
        isPartOf: { '@id': `${SITE.url}/#website` },
        about: { '@id': `${SITE.url}/#organization` },
        inLanguage: SITE.language,
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE.url}/#catalog`,
        name: 'Каталог уплотнений ОРЕНРТИСНАБ',
        itemListElement: PRODUCTS.map(([name, description], index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name,
            description,
            brand: { '@type': 'Brand', name: SITE.name },
            offers: {
              '@type': 'Offer',
              availability: 'https://schema.org/InStock',
              seller: { '@id': `${SITE.url}/#organization` },
            },
          },
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE.url}/#faq`,
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE.url}/#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Главная',
            item: SITE.url,
          },
        ],
      },
    ],
  }
}
