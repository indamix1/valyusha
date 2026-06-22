// lib/tours.ts — читає активні тури з БД і локалізує їх під поточну мову.
import { createClient } from '@/lib/supabase/server'
import type { Locale } from '@/lib/content'
import type { Tour } from '@/types/database'

const CURRENCY_SYMBOL: Record<string, string> = {
  USD: '$',
  EUR: '€',
  JPY: '¥',
}

// Форматує ціну для бейджа картки: "$480", "€150". Порожньо, якщо ціни немає.
export function formatPrice(
  price: number | string | null,
  currency: string
): string {
  if (price === null || price === '') return ''
  const amount = Number(price)
  if (!Number.isFinite(amount)) return ''
  const symbol = CURRENCY_SYMBOL[currency] ?? `${currency} `
  // прибираємо зайві .00 у цілих сумах
  const rounded = Number.isInteger(amount) ? amount : Math.round(amount)
  return `${symbol}${rounded}`
}

// Накладає переклад потрібної мови поверх базових ru-полів (відкат на ru, якщо порожньо).
export function localizeTour(tour: Tour, locale: Locale): Tour {
  if (locale === 'ru') return tour
  const t = tour.translations?.[locale]
  if (!t) return tour
  return {
    ...tour,
    title: t.title || tour.title,
    summary: t.summary || tour.summary,
    description: t.description || tour.description,
    price_details: t.price_details || tour.price_details,
  }
}

// Активні тури для сітки головної: відсортовані за sort_order, локалізовані.
export async function getTours(locale: Locale): Promise<Tour[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('tours')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  return (data ?? []).map((row) => localizeTour(row as Tour, locale))
}
