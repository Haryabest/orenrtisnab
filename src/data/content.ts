import type { IconName } from '../components/Icon/types'

export const NAV_ITEMS = [
  { label: 'Преимущества', href: '#benefits' },
  { label: 'Каталог', href: '#catalog' },
  { label: 'Доставка', href: '#delivery' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Контакты', href: '#contacts' },
] as const

export const PRODUCTS: [string, string, string][] = [
  ['Сальники', '', '01'],
  ['Манжеты по ГОСТ', '', '02'],
  ['Уплотнительные кольца', '', '03'],
  ['X-Ring', '', '04'],
  ['V-Ring', '', '05'],
  ['Грязесъёмники', '', '06'],
  ['РТИ', 'Техпластины, шнуры и другое', '07'],
]

export const BENEFITS: [IconName, string, string][] = [
  ['box', 'Ходовые размеры на складе', 'Более 500 позиций в постоянном наличии'],
  ['bolt', 'Отгрузка в день заказа', 'Оперативно соберём и передадим в доставку'],
  ['measure', 'Подбор по размерам и аналогам', 'Поможем найти точную замену детали'],
  ['document', 'Для юридических лиц', 'Счёт, закрывающие документы, договор'],
  ['handshake', 'Условия для постоянных клиентов', 'Гибкая система цен и резервирование'],
]

export const PROCESS_STEPS = [
  {
    title: 'Вы оставляете заявку',
    description: 'Удобным способом: сайт, телефон или мессенджер.',
  },
  {
    title: 'Подтверждаем наличие и цену',
    description: 'Проверяем склад и оперативно называем стоимость.',
  },
  {
    title: 'Согласовываем доставку',
    description: 'Выбираем удобный способ и сроки получения.',
  },
  {
    title: 'Отгружаем товар',
    description: 'Передаём товар вам или в транспортную компанию.',
  },
] as const

export const DELIVERY_OPTIONS: [string, IconName][] = [
  ['Самовывоз', 'pin'],
  ['Курьерская доставка', 'truck'],
  ['Транспортные компании', 'package'],
  ['По всей России', 'arrow'],
]

export const DELIVERY_MAP_POINTS: [number, number][] = [
  [57, 26],
  [71, 54],
  [48, 70],
  [80, 78],
  [33, 48],
  [64, 87],
]

export const CONTACTS = {
  phones: [
    { display: '+7 (922) 623-21-19', href: 'tel:+79226232119' },
    { display: '+7 (912) 342-74-54', href: 'tel:+79123427454' },
  ],
  telegram: {
    label: 'Написать в Telegram @ORENRTISNAB',
    href: 'https://t.me/ORENRTISNAB',
  },
  max: {
    label: 'Написать в MAX',
    href: 'https://max.ru/u/f9LHodD0cOKkMLOvEZe2ek9JFkVOf50hI4uzox0kGmllIuZmD9PiPVMR0PA',
  },
  email: {
    display: 'orenrtisnab@mail.ru',
    href: 'mailto:orenrtisnab@mail.ru',
  },
  schedule: 'Пн–Пт, 9:00–18:00',
} as const
