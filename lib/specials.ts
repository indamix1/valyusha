// lib/specials.ts — спеціальні маршрути з БД, локалізовані.
import { createClient } from '@/lib/supabase/server'
import type { Locale } from '@/lib/content'
import type { SpecialRoute } from '@/types/database'

export function localizeSpecial(s: SpecialRoute, locale: Locale): SpecialRoute {
  const base: SpecialRoute = { ...s, gallery: s.gallery ?? [] }
  if (locale === 'ru') return base
  const t = s.translations?.[locale]
  if (!t) return base
  return {
    ...base,
    title: t.title || base.title,
    description: t.description || base.description,
  }
}

export async function getSpecials(locale: Locale): Promise<SpecialRoute[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('special_routes')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  return (data ?? []).map((r) => localizeSpecial(r as SpecialRoute, locale))
}

export async function getSpecial(slug: string, locale: Locale): Promise<SpecialRoute | null> {
  let normalized = slug
  try { normalized = decodeURIComponent(slug) } catch {}
  const supabase = await createClient()
  const { data } = await supabase
    .from('special_routes')
    .select('*')
    .eq('slug', normalized)
    .eq('is_active', true)
    .maybeSingle()
  return data ? localizeSpecial(data as SpecialRoute, locale) : null
}
