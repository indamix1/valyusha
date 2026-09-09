// app/layout.tsx — кореневий макет. Тільки <html>, <body> і стилі.
// Шапка/футер тепер у app/[locale]/layout.tsx (щоб працювали мови).
import './globals.css'
import type { Metadata, Viewport } from 'next'
import { getLocale } from 'next-intl/server'
import { SITE_URL, SITE_NAME, OG_IMAGE } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Гид в Японии — авторские экскурсии и индивидуальные туры · Valentina Japan Guide',
    template: '%s · Valentina Japan Guide',
  },
  description:
    'Лицензированный русскоязычный гид в Японии. Авторские экскурсии и индивидуальные туры: Токио, Киото, Фудзи, Хаконе, Камакура, Никко. Туры для круизных туристов и трансферы.',
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [OG_IMAGE],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  icons: { icon: '/logo.png', apple: '/logo.png' },
  // Подтверждение сайта в Google Search Console (Vercel → Environment Variables).
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FBF6F1',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Язык документа = язык страницы (/ru, /uk, /en); для админки — ru.
  const locale = await getLocale()
  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}
