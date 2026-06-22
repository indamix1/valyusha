'use client'
// app/admin/tours/[id]/page.tsx — редагування туру.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import TourForm from '@/components/admin/TourForm'
import type { Tour } from '@/types/database'

export default function EditTour() {
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('tours').select('*').eq('id', id).single()
      setTour(data as Tour)
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: 40, fontFamily: 'system-ui, sans-serif', color: '#312D29' }}>
      <Link href="/admin/tours" style={{ fontSize: 14, color: '#8A7F75' }}>← До списку турів</Link>
      <h1 style={{ fontSize: 26, margin: '4px 0 24px' }}>Редагування туру</h1>
      {loading ? (
        <p style={{ color: '#8A7F75' }}>Завантаження…</p>
      ) : tour ? (
        <TourForm tour={tour} />
      ) : (
        <p style={{ color: '#BE6273' }}>Тур не знайдено.</p>
      )}
    </div>
  )
}
