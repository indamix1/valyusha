'use client'
// app/admin/tours/new/page.tsx — створення нового туру.
import Link from 'next/link'
import TourForm from '@/components/admin/TourForm'

export default function NewTour() {
  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: 40, fontFamily: 'system-ui, sans-serif', color: '#312D29' }}>
      <Link href="/admin/tours" style={{ fontSize: 14, color: '#8A7F75' }}>← До списку турів</Link>
      <h1 style={{ fontSize: 26, margin: '4px 0 24px' }}>Новий тур</h1>
      <TourForm />
    </div>
  )
}
