// app/(admin)/layout.tsx — кореневий макет адмінки (окремий від сайту,
// щоб публічні сторінки могли кешуватися, а адмінка лишалася динамічною).
import '../globals.css'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

// Адмінка не має потрапляти в пошук.
export const metadata: Metadata = {
  title: 'Адмінка',
  robots: { index: false, follow: false },
  icons: { icon: '/logo.png' },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  )
}
