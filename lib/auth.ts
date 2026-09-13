'use client'

const PIN_STORAGE_KEY = 'workout_user_pin'

export function generatePIN(): string {
  // Generate random 4-digit PIN (0000-9999)
  const pin = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return pin
}

export function savePIN(pin: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PIN_STORAGE_KEY, pin)
  }
}

export function getPIN(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(PIN_STORAGE_KEY)
  }
  return null
}

export function clearPIN(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PIN_STORAGE_KEY)
  }
}

export function isValidPIN(pin: string): boolean {
  return /^\d{4}$/.test(pin)
}
