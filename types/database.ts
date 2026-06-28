// types/database.ts
// Типи під таблиці БД. Зручно для автокомпліту в компонентах.

export type TourFormat = 'group' | 'individual' | 'both'

// Точка маршрута тура (для разворота экскурсии: фото + текст).
export interface TourStop {
  title: string
  text: string
  image_url?: string
  image_query?: string
}

// Переклади туру: базові поля = ru, тут лежать uk/en.
// Напр. { uk: { title, summary, description }, en: {...} }
export interface TourTranslation {
  title?: string
  summary?: string
  description?: string
  org_details?: string
  price_details?: string
  participants?: string
  includes?: string[]
  excludes?: string[]
}

export interface Tour {
  id: string
  slug: string
  title: string
  city: string | null
  summary: string | null
  description: string | null
  org_details: string | null
  price: number | null
  currency: string
  price_note: string | null
  price_details: string | null
  duration: string | null
  participants: string | null
  format: TourFormat
  category: string | null
  seasons: string[]
  stops: TourStop[]
  includes: string[]
  excludes: string[]
  cover_url: string | null
  gallery: string[]
  sort_order: number
  is_active: boolean
  translations: Record<string, TourTranslation>
  created_at: string
}

// Переклади статті: базові поля = ru, тут лежать uk/en.
export interface PostTranslation {
  title?: string
  excerpt?: string
  content?: string
}

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string | null
  cover_url: string | null
  published: boolean
  published_at: string | null
  translations: Record<string, PostTranslation>
  created_at: string
}

// Переклади відгуку: базові поля = ru, тут лежать uk/en.
export interface ReviewTranslation {
  text?: string
  author_city?: string
}

export interface Review {
  id: string
  author_name: string
  author_city: string | null
  avatar_url: string | null
  rating: number
  text: string
  tour_id: string | null
  is_approved: boolean
  sort_order: number
  translations: Record<string, ReviewTranslation>
  created_at: string
}

// Переклади готелю: базові поля = ru, тут лежать uk/en.
export interface HotelTranslation {
  name?: string
  area?: string
  description?: string
  price_note?: string
}

export interface Hotel {
  id: string
  name: string
  area: string | null
  stars: number
  description: string | null
  url: string | null
  price_note: string | null
  image_url: string | null
  sort_order: number
  is_active: boolean
  translations: Record<string, HotelTranslation>
  created_at: string
}

// Спеціальний маршрут: базові поля = ru, переклади uk/en у translations.
export interface SpecialRouteTranslation {
  title?: string
  description?: string
}

export interface SpecialRoute {
  id: string
  slug: string
  title: string
  description: string | null
  cover_url: string | null
  gallery: string[]
  sort_order: number
  is_active: boolean
  translations: Record<string, SpecialRouteTranslation>
  created_at: string
}

export interface SiteContent {
  key: string
  value: string | null
  updated_at: string
}
