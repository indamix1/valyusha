// lib/site.ts — базовый адрес сайта и SEO-хелперы.
// Домен задаётся через NEXT_PUBLIC_SITE_URL (в Vercel → Environment Variables).
// По умолчанию — основной домен сайта.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.valentinajapanguide.com'
).replace(/\/+$/, '')

export const SITE_NAME = 'Valentina Japan Guide'
export const LOCALES = ['ru', 'uk', 'en'] as const
export type SiteLocale = (typeof LOCALES)[number]

// Картинка для превью в мессенджерах/соцсетях (1200x630, public/og.jpg).
export const OG_IMAGE = { url: '/og.jpg', width: 1200, height: 630 }

// Локаль сайта -> формат для og:locale.
export const OG_LOCALE: Record<string, string> = {
  ru: 'ru_RU',
  uk: 'uk_UA',
  en: 'en_US',
}

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

// Общий набор OpenGraph-полей для страницы (url, локали, картинка по умолчанию).
export function ogBase(locale: string, path = '', image?: string | null) {
  return {
    url: canonicalUrl(locale, path),
    siteName: SITE_NAME,
    locale: OG_LOCALE[locale] ?? 'ru_RU',
    alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
    images: image ? [{ url: image }] : [OG_IMAGE],
  }
}

// Обрезает текст до длины, удобной для meta description (~160 символов).
export function metaDescription(text: string | null | undefined, max = 160) {
  if (!text) return undefined
  const s = text.replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  const cut = s.slice(0, max)
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 80))}…`
}
