// i18n/navigation.ts — обгортки навігації, що враховують мову.
// Link/useRouter звідси самі додають префікс мови (/ru, /uk, /en).
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
