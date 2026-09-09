import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// Підключає next-intl (читає налаштування з i18n/request.ts)
const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  // Дозволяємо next/image оптимізувати фото зі Supabase Storage.
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' }],
  },
}

export default withNextIntl(nextConfig)
