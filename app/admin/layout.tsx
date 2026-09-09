import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

// Адмінка не має потрапляти в пошук.
export const metadata: Metadata = {
  title: 'Адмінка',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
