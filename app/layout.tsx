// app/layout.tsx — кореневий макет. Тільки <html>, <body> і стилі.
// Шапка/футер тепер у app/[locale]/layout.tsx (щоб працювали мови).
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Valyusha · Гід в Японії — авторські тури',
  description:
    'Авторські екскурсії та індивідуальні тури Японією з ліцензованим гідом. Понад 20 років у Японії.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
