// lib/content.ts — дістає тексти головної з БД відповідною мовою.
import { createPublicClient } from '@/lib/supabase/public'

export type Locale = 'ru' | 'uk' | 'en'

// Повертає мапу ключ -> текст потрібною мовою (з відкатом на російську).
export async function getSiteContent(
  locale: Locale
): Promise<Record<string, string>> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('site_content')
    .select('key, value, value_uk, value_en')

  const map: Record<string, string> = {}
  for (const row of data ?? []) {
    const localized =
      locale === 'uk'
        ? row.value_uk || row.value
        : locale === 'en'
        ? row.value_en || row.value
        : row.value
    map[row.key] = localized ?? ''
  }
  return map
}
