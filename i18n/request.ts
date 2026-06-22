// i18n/request.ts — підвантажує переклади для поточної мови.
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // якщо мова невідома — беремо за замовчуванням
  if (!locale || !routing.locales.includes(locale as 'ru' | 'uk' | 'en')) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
