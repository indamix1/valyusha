import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// Підключає next-intl (читає налаштування з i18n/request.ts)
const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  // тут за потреби будуть інші налаштування Next.js
}

export default withNextIntl(nextConfig)
