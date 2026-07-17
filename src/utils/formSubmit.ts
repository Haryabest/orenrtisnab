export type RequestFormData = {
  name: string
  phone: string
  email: string
  honeypot: string
}

export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 11
}

export async function submitRequestForm(data: RequestFormData): Promise<void> {
  if (data.honeypot) {
    return
  }

  const response = await fetch('/api/form/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim() || undefined,
      honeypot: data.honeypot,
      source: 'orenrtisnab.ru',
    }),
  })

  if (!response.ok) {
    throw new Error('Не удалось отправить заявку')
  }
}
