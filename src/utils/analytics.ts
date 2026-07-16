declare global {
  interface Window {
    ym?: (counterId: number, method: string, ...args: unknown[]) => void
  }
}

const METRIKA_ID = import.meta.env.VITE_YANDEX_METRIKA_ID

export function reachGoal(goal: string) {
  if (METRIKA_ID && window.ym) {
    window.ym(Number(METRIKA_ID), 'reachGoal', goal)
  }
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
