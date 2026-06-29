// lib/tours.ts — читає активні тури з БД і локалізує їх під поточну мову.
import { createClient } from '@/lib/supabase/server'
import type { Locale } from '@/lib/content'
import type { Tour } from '@/types/database'

export { formatPrice } from '@/lib/format'

// Накладає переклад потрібної мови поверх базових ru-полів (відкат на ru, якщо порожньо).
export function localizeTour(tour: Tour, locale: Locale): Tour {
  // гарантуємо масиви (колонки можуть бути відсутні до міграції)
  const base: Tour = {
    ...tour,
    seasons: tour.seasons ?? [],
    includes: tour.includes ?? [],
    excludes: tour.excludes ?? [],
    stops: tour.stops ?? [],
  }
  if (locale === 'ru') return base
  const t = tour.translations?.[locale]
  if (!t) return base
  // Точки маршруту: накладаємо переклад title/text за індексом, image_url лишаємо.
  const stops = base.stops.map((s, i) => {
    const ts = t.stops?.[i]
    return ts ? { ...s, title: ts.title || s.title, text: ts.text || s.text } : s
  })
  return {
    ...base,
    title: t.title || base.title,
    summary: t.summary || base.summary,
    description: t.description || base.description,
    org_details: t.org_details || base.org_details,
    price_details: t.price_details || base.price_details,
    participants: t.participants || base.participants,
    includes: t.includes && t.includes.length ? t.includes : base.includes,
    excludes: t.excludes && t.excludes.length ? t.excludes : base.excludes,
    stops,
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

// Активні тури певної категорії (напр. 'cruise'), відсортовані й локалізовані.
export async function getToursByCategory(
  category: string,
  locale: Locale
): Promise<Tour[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('tours')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  return (data ?? []).map((row) => localizeTour(row as Tour, locale))
}

// Один активний тур за slug, локалізований. null — якщо не знайдено/прихований.
export async function getTour(
  slug: string,
  locale: Locale
): Promise<Tour | null> {
  // У page-компоненті slug може прийти URL-кодованим (напр. кирилиця) —
  // нормалізуємо, щоб точно збігся зі значенням у БД.
  let normalized = slug
  try {
    normalized = decodeURIComponent(slug)
  } catch {
    // лишаємо як є, якщо це не валідний %-escape
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('tours')
    .select('*')
    .eq('slug', normalized)
    .eq('is_active', true)
    .maybeSingle()

  return data ? localizeTour(data as Tour, locale) : null
}
