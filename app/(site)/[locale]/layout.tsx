// app/[locale]/layout.tsx — макет для мовних сторінок.
// Підключає переклади (провайдер) і спільні шапку/футер.
import '../../globals.css'
import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import Parallax from '@/components/Parallax'
import { SITE_URL, SITE_NAME, OG_IMAGE } from '@/lib/site'

// Кореневий макет сайту: <html lang> = мова сторінки, глобальні meta за замовчуванням.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Гид в Японии — авторские экскурсии и индивидуальные туры · Valentina Japan Guide',
    template: '%s · Valentina Japan Guide',
  },
  description:
    'Лицензированный русскоязычный гид в Японии. Авторские экскурсии и индивидуальные туры: Токио, Киото, Фудзи, Хаконе, Камакура, Никко. Туры для круизных туристов и трансферы.',
  applicationName: SITE_NAME,
  openGraph: { type: 'website', siteName: SITE_NAME, url: SITE_URL, images: [OG_IMAGE] },
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: SITE_NAME,
  alternateName: [
    'Валентина — гид в Японии',
    'Валентина Ямазаки',
    'Гид Валентина в Японии',
  ],
  url: SITE_URL,
  image: `${SITE_URL}/logo.png`,
  description:
    'Валентина — лицензированный русскоязычный гид в Японии: авторские экскурсии, индивидуальные туры, туры для круизных туристов и трансферы.',
  areaServed: 'Japan',
  telephone: '+81 80 3360 5724',
  founder: {
    '@type': 'Person',
    name: 'Валентина Ямазаки',
    alternateName: ['Valentina Yamazaki', 'Валентина гид в Японии'],
    jobTitle: 'Лицензированный гид в Японии',
  },
  sameAs: [
    'https://www.instagram.com/valentyna.japan.guide',
    'https://www.facebook.com/profile.php?id=61572204435760',
  ],
}

// Дозволяє згенерувати сторінки для всіх мов наперед
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Невідома мова -> 404
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>
        <NextIntlClientProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <ScrollReveal />
          <Parallax />
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
