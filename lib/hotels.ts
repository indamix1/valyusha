// lib/hotels.ts — читає активні готелі з БД і локалізує під поточну мову.
import { createClient } from '@/lib/supabase/server'
import type { Locale } from '@/lib/content'
import type { Hotel } from '@/types/database'

export function localizeHotel(hotel: Hotel, locale: Locale): Hotel {
  if (locale === 'ru') return hotel
  const t = hotel.translations?.[locale]
  if (!t) return hotel
  return {
    ...hotel,
    name: t.name || hotel.name,
    area: t.area || hotel.area,
    description: t.description || hotel.description,
    price_note: t.price_note || hotel.price_note,
  }
}

export async function getHotels(locale: Locale): Promise<Hotel[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('hotels')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  return (data ?? []).map((row) => localizeHotel(row as Hotel, locale))
}
