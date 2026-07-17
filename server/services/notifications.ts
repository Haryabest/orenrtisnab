import { config } from '../config.ts'

export type LeadNotificationInput = {
  name: string
  phone: string
  email: string
  source: string
  referrer?: string
  at?: string
}

export type LeadNotificationResult = {
  telegram: boolean
  max: boolean
  webhook: boolean
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function formatLeadMessage(input: LeadNotificationInput): string {
  const at = input.at ?? new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
  const lines = [
    '<b>Новая заявка с сайта</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(input.name)}`,
    `<b>Телефон:</b> ${escapeHtml(input.phone)}`,
  ]

  if (input.email) {
    lines.push(`<b>Email:</b> ${escapeHtml(input.email)}`)
  }

  lines.push(
    `<b>Источник:</b> ${escapeHtml(input.source)}`,
    `<b>Время:</b> ${escapeHtml(at)}`,
  )

  if (input.referrer) {
    lines.push(`<b>Откуда:</b> ${escapeHtml(input.referrer)}`)
  }

  return lines.join('\n')
}

async function sendTelegram(text: string): Promise<boolean> {
  const { telegramBotToken, telegramChatId } = config
  if (!telegramBotToken || !telegramChatId) return false

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      },
    )
    return response.ok
  } catch (err) {
    console.error('Telegram notification failed:', err)
    return false
  }
}

async function sendMax(text: string): Promise<boolean> {
  const { maxBotToken, maxUserId, maxChatId } = config
  if (!maxBotToken || (!maxUserId && !maxChatId)) return false

  const params = new URLSearchParams()
  if (maxUserId) params.set('user_id', maxUserId)
  else if (maxChatId) params.set('chat_id', maxChatId)

  try {
    const response = await fetch(`https://platform-api2.max.ru/messages?${params}`, {
      method: 'POST',
      headers: {
        Authorization: maxBotToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        format: 'html',
        notify: true,
      }),
    })
    return response.ok
  } catch (err) {
    console.error('MAX notification failed:', err)
    return false
  }
}

async function sendWebhook(url: string, input: LeadNotificationInput): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: input.name,
        phone: input.phone,
        email: input.email || undefined,
        source: input.source,
        referrer: input.referrer || undefined,
        at: input.at,
      }),
    })
    return response.ok
  } catch (err) {
    console.error('Webhook notification failed:', err)
    return false
  }
}

export async function notifyNewLead(
  input: LeadNotificationInput,
  webhookUrl?: string,
): Promise<LeadNotificationResult> {
  const text = formatLeadMessage(input)

  const [telegram, max, webhook] = await Promise.all([
    sendTelegram(text),
    sendMax(text),
    webhookUrl ? sendWebhook(webhookUrl, input) : Promise.resolve(false),
  ])

  return { telegram, max, webhook }
}
