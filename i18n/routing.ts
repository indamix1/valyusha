// i18n/routing.ts — центральна конфігурація мов.
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // мови сайту
  locales: ['ru', 'uk', 'en'],
  // мова за замовчуванням (коли заходять без префікса)
  defaultLocale: 'ru',
  // не визначати мову за заголовком браузера: голий домен завжди -> /ru
  // (важливо для прев'ю при шарингу — мессенджери інакше потрапляють на /en)
  localeDetection: false,
})
