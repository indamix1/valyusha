// app/layout.tsx — кореневий макет. Тільки <html>, <body> і стилі.
// Шапка/футер тепер у app/[locale]/layout.tsx (щоб працювали мови).
import './globals.css'
import type { Metadata, Viewport } from 'next'
import { SITE_URL, SITE_NAME } from '@/lib/site'

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
    images: [{ url: '/hero2.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  icons: { icon: '/logo.png', apple: '/logo.png' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}
