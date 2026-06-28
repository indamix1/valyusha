// app/sitemap.ts — карта сайта (генерирует /sitemap.xml).
import type { MetadataRoute } from 'next'
import { SITE_URL, LOCALES } from '@/lib/site'
import { createClient } from '@/lib/supabase/server'

const STATIC = ['', '/tury', '/specials', '/blog', '/pro-mene', '/ekskursii', '/individualni', '/kruizni', '/transferi', '/kontakty']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let tourSlugs: string[] = []
  let specialSlugs: string[] = []
  try {
    const supabase = await createClient()
    const { data: tours } = await supabase.from('tours').select('slug').eq('is_active', true)
    tourSlugs = (tours ?? []).map((t) => t.slug as string)
    const { data: sp } = await supabase.from('special_routes').select('slug').eq('is_active', true)
    specialSlugs = (sp ?? []).map((s) => s.slug as string)
  } catch {
    // таблиці можуть бути відсутні до міграцій — пропускаємо
  }

  const urls: MetadataRoute.Sitemap = []
  for (const l of LOCALES) {
    for (const p of STATIC) urls.push({ url: `${SITE_URL}/${l}${p}`, changeFrequency: 'monthly', priority: p === '' ? 1 : 0.7 })
    for (const s of tourSlugs) urls.push({ url: `${SITE_URL}/${l}/tury/${s}`, changeFrequency: 'monthly', priority: 0.6 })
    for (const s of specialSlugs) urls.push({ url: `${SITE_URL}/${l}/specials/${s}`, changeFrequency: 'monthly', priority: 0.6 })
  }
  return urls
}
