declare global {
  interface Window {
    ym?: (counterId: number, method: string, ...args: unknown[]) => void
  }
}

let counterId: string | null = import.meta.env.VITE_YANDEX_METRIKA_ID || null

export function setMetrikaCounterId(id: string) {
  counterId = id.replace(/\D/g, '') || null
}

export function getMetrikaCounterId(): string | null {
  return counterId
}

export function reachGoal(goal: string) {
  if (!counterId || !window.ym) return
  window.ym(Number(counterId), 'reachGoal', goal)
}

export function trackPhoneClick() {
  reachGoal('phone_click')
}

export function trackMessengerClick() {
  reachGoal('messenger_click')
}

export function trackFormSubmit() {
  reachGoal('form_submit')
}

export function resolveMetrikaId(contentId: string, envId?: string): string | null {
  const fromContent = contentId.replace(/\D/g, '')
  const fromEnv = (envId || '').replace(/\D/g, '')
  return fromContent || fromEnv || null
}
