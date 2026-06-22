// i18n/routing.ts — центральна конфігурація мов.
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // мови сайту
  locales: ['ru', 'uk', 'en'],
  // мова за замовчуванням (коли заходять без префікса)
  defaultLocale: 'ru',
})
