export type IconName =
  | 'check'
  | 'arrow'
  | 'box'
  | 'bolt'
  | 'measure'
  | 'document'
  | 'handshake'
  | 'phone'
  | 'telegram'
  | 'truck'
  | 'pin'
  | 'package'
  | 'headset'
  | 'mail'
  | 'menu'
  | 'chevron'

export type NavItem = { label: string; href: string }
export type ProductItem = { title: string; description: string; number: string }
export type BenefitItem = { icon: IconName; title: string; description: string }
export type ProcessStep = { title: string; description: string }
export type DeliveryOption = { title: string; icon: IconName }
export type MapPoint = { x: number; y: number }
export type FaqItem = { question: string; answer: string }
export type PhoneContact = { display: string; href: string }
export type HeroStat = { value: string; line1: string; line2: string }

export type SiteContent = {
  site: {
    name: string
    legalName: string
    url: string
    locale: string
    language: string
    region: string
    city: string
    addressRegion: string
    description: string
    keywords: string[]
    title: string
    ogImage: string
    ogImageAlt: string
    themeColor: string
    yandexMetrikaId: string
    formEndpoint: string
    openingHours: { opens: string; closes: string }
    areaServed: string[]
    priceRange: string
  }
  header: {
    monogram: string
    name: string
    tagline: string
    logoHref: string
    ctaText: string
    ctaHref: string
    menuAriaLabel: string
    nav: NavItem[]
  }
  hero: {
    backgroundImage: string
    eyebrow: string
    heading: string
    subtitle: string
    description: string
    ctaText: string
    ctaHref: string
    stats: HeroStat[]
  }
  heroVisual: {
    eyebrow: string
    text: string
  }
  benefits: {
    eyebrow: string
    headingLine1: string
    headingLine2: string
    sidebar: string
    items: BenefitItem[]
  }
  catalog: {
    eyebrow: string
    headingLine1: string
    headingLine2: string
    ctaText: string
    ctaHref: string
    categoryLabel: string
    items: ProductItem[]
  }
  process: {
    eyebrow: string
    heading: string
    steps: ProcessStep[]
  }
  delivery: {
    eyebrow: string
    headingLine1: string
    headingLine2: string
    description: string
    hubLabel: string
    mapEyebrow: string
    mapText: string
    options: DeliveryOption[]
    mapPoints: MapPoint[]
  }
  requestForm: {
    eyebrow: string
    heading: string
    description: string
    trustBadge: string
    fields: {
      name: { label: string; placeholder: string }
      phone: { label: string; placeholder: string; mask: string }
      email: { label: string; placeholder: string }
    }
    consentText: string
    consentLinkText: string
    consentLinkHref: string
    submitText: string
    submitLoadingText: string
    errorPhone: string
    errorSubmit: string
    successTitle: string
    successMessage: string
  }
  contacts: {
    eyebrow: string
    heading: string
    schedulePrefix: string
    phoneCardLabel: string
    phoneCta: string
    messengersCardLabel: string
    emailCardLabel: string
    emailDescription: string
    phones: PhoneContact[]
    telegram: { label: string; href: string }
    max: { label: string; href: string }
    email: { display: string; href: string }
    schedule: string
  }
  faq: {
    eyebrow: string
    heading: string
    items: FaqItem[]
  }
  footer: {
    name: string
    tagline: string
    copyright: string
    links: { text: string; href: string }[]
  }
  floatingCta: {
    text: string
    href: string
  }
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  site: {
    name: 'ОРЕНРТИСНАБ',
    legalName: 'ОРЕНРТИСНАБ',
    url: 'https://orenrtisnab.ru',
    locale: 'ru_RU',
    language: 'ru',
    region: 'RU',
    city: 'Оренбург',
    addressRegion: 'Оренбургская область',
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
    yandexMetrikaId: '110818589',
    formEndpoint: '',
    openingHours: { opens: '09:00', closes: '18:00' },
    areaServed: ['RU', 'KZ', 'BY', 'AM', 'KG'],
    priceRange: '₽₽',
  },
  header: {
    monogram: 'ОС',
    name: 'ОРЕНРТИСНАБ',
    tagline: 'Уплотнительные соединения, РТИ',
    logoHref: '#top',
    ctaText: 'Оставить заявку',
    ctaHref: '#request',
    menuAriaLabel: 'Меню',
    nav: [
      { label: 'Преимущества', href: '#benefits' },
      { label: 'Каталог', href: '#catalog' },
      { label: 'Доставка', href: '#delivery' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Контакты', href: '#contacts' },
    ],
  },
  hero: {
    backgroundImage: '/images/photo.png',
    eyebrow: 'ПОСТАВКИ ПО ВСЕЙ РОССИИ',
    heading: 'ОРЕНРТИСНАБ',
    subtitle: 'Уплотнительные решения для бесперебойной работы вашего оборудования.',
    description:
      'Более 500 ходовых размеров в наличии. Отгрузка в день заказа. Доставка по России, ДНР и ЛНР.',
    ctaText: 'Оставить заявку',
    ctaHref: '#request',
    stats: [
      { value: '500+', line1: 'позиций', line2: 'в наличии' },
      { value: 'Быстрая', line1: 'отгрузка', line2: 'со склада' },
      { value: 'Работа', line1: 'с физлицами', line2: 'и юрлицами' },
    ],
  },
  heroVisual: {
    eyebrow: 'НАДЁЖНОСТЬ В КАЖДОЙ ДЕТАЛИ',
    text: 'Поставка уплотнительных соединений для техники, станков и промышленного оборудования.',
  },
  benefits: {
    eyebrow: 'ПОЧЕМУ НАМ ДОВЕРЯЮТ',
    headingLine1: 'Закрываем вопрос',
    headingLine2: 'с уплотнениями под ключ',
    sidebar: 'Помогаем быстро найти нужную позицию — от заявки до отгрузки.',
    items: [
      { icon: 'box', title: 'Ходовые размеры на складе', description: 'Более 500 позиций в постоянном наличии' },
      { icon: 'bolt', title: 'Отгрузка в день заказа', description: 'Оперативно соберём и передадим в доставку' },
      { icon: 'measure', title: 'Подбор по размерам и аналогам', description: 'Поможем найти точную замену детали' },
      { icon: 'document', title: 'Для юридических лиц', description: 'Счёт, закрывающие документы, договор' },
      { icon: 'handshake', title: 'Условия для постоянных клиентов', description: 'Гибкая система цен и резервирование' },
    ],
  },
  catalog: {
    eyebrow: 'КАТАЛОГ ПРОДУКЦИИ',
    headingLine1: 'Подберём изделие',
    headingLine2: 'под вашу задачу',
    ctaText: 'Не нашли нужное? Подберём аналог',
    ctaHref: '#request',
    categoryLabel: 'КАТЕГОРИЯ',
    items: [
      { title: 'Сальники', description: '', number: '01' },
      { title: 'Манжеты по ГОСТ', description: '', number: '02' },
      { title: 'Уплотнительные кольца', description: '', number: '03' },
      { title: 'X-Ring', description: '', number: '04' },
      { title: 'V-Ring', description: '', number: '05' },
      { title: 'Грязесъёмники', description: '', number: '06' },
      { title: 'РТИ', description: 'Техпластины, шнуры и другое', number: '07' },
    ],
  },
  process: {
    eyebrow: 'ПРОСТОЙ ПРОЦЕСС',
    heading: 'От заявки до отгрузки — 4 шага',
    steps: [
      { title: 'Вы оставляете заявку', description: 'Удобным способом: сайт, телефон или мессенджер.' },
      { title: 'Подтверждаем наличие и цену', description: 'Проверяем склад и оперативно называем стоимость.' },
      { title: 'Согласовываем доставку', description: 'Выбираем удобный способ и сроки получения.' },
      { title: 'Отгружаем товар', description: 'Передаём товар вам или в транспортную компанию.' },
    ],
  },
  delivery: {
    eyebrow: 'ЛОГИСТИКА БЕЗ ЗАДЕРЖЕК',
    headingLine1: 'Доставим туда,',
    headingLine2: 'где работает ваше оборудование',
    description: 'Самовывоз, курьер, транспортные компании — доставляем по всей России и регионам.',
    hubLabel: 'ОРЕНБУРГ',
    mapEyebrow: 'ГЕОГРАФИЯ ПОСТАВОК',
    mapText: 'Россия и страны ЕАЭС',
    options: [
      { title: 'Самовывоз', icon: 'pin' },
      { title: 'Курьерская доставка', icon: 'truck' },
      { title: 'Транспортные компании', icon: 'package' },
      { title: 'По всей России', icon: 'arrow' },
    ],
    mapPoints: [
      { x: 57, y: 26 },
      { x: 71, y: 54 },
      { x: 48, y: 70 },
      { x: 80, y: 78 },
      { x: 33, y: 48 },
      { x: 64, y: 87 },
    ],
  },
  requestForm: {
    eyebrow: 'ОТВЕТИМ В РАБОЧЕЕ ВРЕМЯ',
    heading: 'Оставьте заявку — менеджер свяжется с вами',
    description: 'Подберём позицию по размеру, артикулу или фото детали. Уточним цену и срок отгрузки.',
    trustBadge: 'Без навязчивых звонков',
    fields: {
      name: { label: 'Имя', placeholder: 'Как к вам обращаться' },
      phone: { label: 'Телефон', placeholder: '+7 (___) ___-__-__', mask: '+7 (___) ___-__-__' },
      email: { label: 'Email', placeholder: 'mail@company.ru' },
    },
    consentText: 'Я согласен на обработку персональных данных и с',
    consentLinkText: 'политикой конфиденциальности',
    consentLinkHref: '/privacy.html',
    submitText: 'Получить консультацию',
    submitLoadingText: 'Отправка…',
    errorPhone: 'Укажите корректный номер телефона',
    errorSubmit: 'Не удалось отправить заявку. Попробуйте позвонить или написать в мессенджер.',
    successTitle: 'Заявка отправлена',
    successMessage: 'Менеджер свяжется с вами в ближайшее рабочее время.',
  },
  contacts: {
    eyebrow: 'КОНТАКТЫ',
    heading: 'Свяжитесь удобным способом',
    schedulePrefix: 'Отвечаем в рабочее время:',
    phoneCardLabel: 'ТЕЛЕФОН',
    phoneCta: 'Позвонить',
    messengersCardLabel: 'МЕССЕНДЖЕРЫ',
    emailCardLabel: 'ЭЛЕКТРОННАЯ ПОЧТА',
    emailDescription: 'Для запросов, счетов и технической документации.',
    phones: [
      { display: '+7 (922) 623-21-19', href: 'tel:+79226232119' },
      { display: '+7 (912) 342-74-54', href: 'tel:+79123427454' },
    ],
    telegram: { label: 'Написать в Telegram @ORENRTISNAB', href: 'https://t.me/ORENRTISNAB' },
    max: {
      label: 'Написать в MAX',
      href: 'https://max.ru/u/f9LHodD0cOKkMLOvEZe2ek9JFkVOf50hI4uzox0kGmllIuZmD9PiPVMR0PA',
    },
    email: { display: 'orenrtisnab@mail.ru', href: 'mailto:orenrtisnab@mail.ru' },
    schedule: 'Пн–Пт, 9:00–18:00',
  },
  faq: {
    eyebrow: 'ЧАСТЫЕ ВОПРОСЫ',
    heading: 'Ответы на популярные вопросы',
    items: [
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
    ],
  },
  footer: {
    name: 'ОРЕНРТИСНАБ',
    tagline: 'Промышленные уплотнения и РТИ',
    copyright: '© 2026 ОРЕНРТИСНАБ',
    links: [
      { text: 'Политика конфиденциальности', href: '/privacy.html' },
      { text: 'Согласие на обработку персональных данных', href: '/consent.html' },
    ],
  },
  floatingCta: {
    text: 'Оставить заявку',
    href: '#request',
  },
}

export const CONTENT_SECTIONS = [
  'site',
  'header',
  'hero',
  'heroVisual',
  'benefits',
  'catalog',
  'process',
  'delivery',
  'requestForm',
  'contacts',
  'faq',
  'footer',
  'floatingCta',
] as const

export type ContentSection = (typeof CONTENT_SECTIONS)[number]
