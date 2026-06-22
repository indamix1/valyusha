import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// Підключає next-intl (читає налаштування з i18n/request.ts)
const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
}

export default withNextIntl(nextConfig)
