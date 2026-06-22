'use client'
// app/admin/tours/page.tsx — список турів в адмінці.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Tour } from '@/types/database'

export default function AdminTours() {
  const supabase = createClient()
  const router = useRouter()
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('tours')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    setTours((data as Tour[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function remove(id: string, title: string) {
    if (!confirm(`Видалити тур «${title}»?`)) return
    await supabase.from('tours').delete().eq('id', id)
    load()
  }

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: 40, fontFamily: 'system-ui, sans-serif', color: '#312D29' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Link href="/admin" style={{ fontSize: 14, color: '#8A7F75' }}>← Адмінка</Link>
          <h1 style={{ fontSize: 26, marginTop: 4 }}>Тури</h1>
        </div>
        <Link href="/admin/tours/new"
          style={{ padding: '11px 20px', borderRadius: 30, background: '#BE6273', color: '#fff', fontWeight: 700, fontSize: 15 }}>
          + Додати тур
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#8A7F75' }}>Завантаження…</p>
      ) : tours.length === 0 ? (
        <p style={{ color: '#8A7F75' }}>Турів ще немає. Натисніть «Додати тур».</p>
      ) : (
        <div style={{ border: '1px solid rgba(49,45,41,.12)', borderRadius: 12, overflow: 'hidden' }}>
          {tours.map((t, i) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderTop: i ? '1px solid rgba(49,45,41,.1)' : 'none', background: '#fff' }}>
              <div style={{ width: 64, height: 44, borderRadius: 6, background: t.cover_url ? `center/cover url(${t.cover_url})` : '#F3E8DD', flex: 'none' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{t.title}</div>
                <div style={{ fontSize: 13, color: '#8A7F75' }}>
                  {t.city || '—'} · {t.price ? `від $${t.price}` : 'ціна не вказана'} {t.is_active ? '' : '· прихований'}
                </div>
              </div>
              <button onClick={() => router.push(`/admin/tours/${t.id}`)}
                style={{ border: '1px solid rgba(49,45,41,.2)', background: 'transparent', padding: '7px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 14 }}>
                Редагувати
              </button>
              <button onClick={() => remove(t.id, t.title)}
                style={{ border: 'none', background: 'transparent', color: '#BE6273', padding: '7px 10px', borderRadius: 20, cursor: 'pointer', fontSize: 14 }}>
                Видалити
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
