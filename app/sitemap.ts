// app/sitemap.ts — карта сайта (генерирует /sitemap.xml).
// Каждый URL включает hreflang-альтернативы (ru/uk/en), чтобы Google
// понимал, что это одна страница на трёх языках, а не дубли.
import type { MetadataRoute } from 'next'
import { SITE_URL, LOCALES, languageAlternates } from '@/lib/site'
import { createPublicClient } from '@/lib/supabase/public'

// Кеш сторінки: перегенерація не частіше ніж раз на 5 хв (плюс скидання з адмінки).
export const revalidate = 300


const STATIC: { path: string; priority: number; freq: 'weekly' | 'monthly' }[] = [
  { path: '', priority: 1, freq: 'weekly' },
  { path: '/tury', priority: 0.9, freq: 'weekly' },
  { path: '/specials', priority: 0.8, freq: 'monthly' },
  { path: '/blog', priority: 0.7, freq: 'weekly' },
  { path: '/pro-mene', priority: 0.7, freq: 'monthly' },
  { path: '/ekskursii', priority: 0.7, freq: 'monthly' },
  { path: '/individualni', priority: 0.7, freq: 'monthly' },
  { path: '/kruizni', priority: 0.7, freq: 'monthly' },
  { path: '/transferi', priority: 0.6, freq: 'monthly' },
  { path: '/kontakty', priority: 0.6, freq: 'monthly' },
]

type Entry = { path: string; priority: number; freq: 'weekly' | 'monthly'; lastModified?: Date }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: Entry[] = [...STATIC]
  try {
    const supabase = createPublicClient()
    const [{ data: tours }, { data: specials }, { data: posts }] = await Promise.all([
      supabase.from('tours').select('slug, created_at').eq('is_active', true),
      supabase.from('special_routes').select('slug, created_at').eq('is_active', true),
      supabase.from('posts').select('slug, published_at, created_at').eq('published', true),
    ])
    for (const t of tours ?? [])
      entries.push({ path: `/tury/${t.slug}`, priority: 0.8, freq: 'monthly', lastModified: new Date(t.created_at) })
    for (const s of specials ?? [])
      entries.push({ path: `/specials/${s.slug}`, priority: 0.7, freq: 'monthly', lastModified: new Date(s.created_at) })
    for (const p of posts ?? [])
      entries.push({
        path: `/blog/${p.slug}`,
        priority: 0.6,
        freq: 'monthly',
        lastModified: new Date(p.published_at ?? p.created_at),
      })
  } catch {
    // таблиці можуть бути відсутні до міграцій — пропускаємо
  }

  const urls: MetadataRoute.Sitemap = []
  for (const e of entries) {
    const languages = languageAlternates(e.path)
    for (const l of LOCALES) {
      urls.push({
        url: `${SITE_URL}/${l}${e.path}`,
        changeFrequency: e.freq,
        priority: e.priority,
        lastModified: e.lastModified,
        alternates: { languages },
      })
    }
  }
  return urls
}
