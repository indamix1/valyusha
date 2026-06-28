// app/[locale]/layout.tsx — макет для мовних сторінок.
// Підключає переклади (провайдер) і спільні шапку/футер.
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import Parallax from '@/components/Parallax'
import { SITE_URL, SITE_NAME } from '@/lib/site'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/logo.png`,
  description:
    'Лицензированный русскоязычный гид в Японии: авторские экскурсии, индивидуальные туры, туры для круизных туристов и трансферы.',
  areaServed: 'Japan',
  telephone: '+81 80 3360 5724',
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
  )
}
