// lib/site.ts — базовый адрес сайта и SEO-хелперы.
// Домен задаётся через NEXT_PUBLIC_SITE_URL (в Vercel → Environment Variables).
// Пока домена нет — используется vercel-адрес.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://valyusha-5hrg.vercel.app'
).replace(/\/+$/, '')

export const SITE_NAME = 'Valentina Japan Guide'
export const LOCALES = ['ru', 'uk', 'en'] as const

function clean(path: string) {
  if (!path) return ''
  return path.startsWith('/') ? path : `/${path}`
}

// canonical-ссылка для текущей мовы і шляху (без локалі).
export function canonicalUrl(locale: string, path = '') {
  return `${SITE_URL}/${locale}${clean(path)}`
}

// hreflang-альтернативы (ru/uk/en + x-default).
export function languageAlternates(path = '') {
  const languages: Record<string, string> = {}
  for (const l of LOCALES) languages[l] = `${SITE_URL}/${l}${clean(path)}`
  languages['x-default'] = `${SITE_URL}/ru${clean(path)}`
  return languages
}
