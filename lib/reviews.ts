// lib/reviews.ts — читає схвалені відгуки з БД і локалізує їх.
import { createClient } from '@/lib/supabase/server'
import type { Locale } from '@/lib/content'
import type { Review } from '@/types/database'

// Накладає переклад потрібної мови (відкат на ru, якщо порожньо).
export function localizeReview(review: Review, locale: Locale): Review {
  if (locale === 'ru') return review
  const t = review.translations?.[locale]
  if (!t) return review
  return {
    ...review,
    text: t.text || review.text,
    author_city: t.author_city || review.author_city,
  }
}

// Схвалені відгуки для головної: за sort_order, локалізовані.
export async function getReviews(locale: Locale): Promise<Review[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_approved', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  return (data ?? []).map((row) => localizeReview(row as Review, locale))
}
