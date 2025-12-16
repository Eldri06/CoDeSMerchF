import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type CurrencyCode = 'PHP' | 'USD'

export function getGeneralSettings() {
  try {
    const raw = localStorage.getItem('settings.general')
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        currency: (parsed.currency?.includes('USD') ? 'USD' : 'PHP') as CurrencyCode,
        timezone: String(parsed.timezone || 'Asia/Manila'),
      }
    }
  } catch { void 0 }
  return { currency: 'PHP' as CurrencyCode, timezone: 'Asia/Manila' }
}

export function formatCurrency(amount: number) {
  const { currency } = getGeneralSettings()
  const locale = currency === 'USD' ? 'en-US' : 'en-PH'
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Number(amount || 0))
}

export function formatDateTime(ts?: string | number | Date) {
  const { timezone } = getGeneralSettings()
  const d = ts ? new Date(ts) : new Date()
  return new Intl.DateTimeFormat('en-US', { timeZone: timezone, year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(d)
}
