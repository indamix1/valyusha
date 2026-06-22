// app/admin/page.tsx — головна адмінки з переходами в розділи.
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminHome() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { count: toursCount } = await supabase.from('tours').select('*', { count: 'exact', head: true })
  const { count: postsCount } = await supabase.from('posts').select('*', { count: 'exact', head: true })
  const { count: reviewsCount } = await supabase.from('reviews').select('*', { count: 'exact', head: true })

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/admin/login')
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: 40, fontFamily: 'system-ui, sans-serif', color: '#312D29' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h1 style={{ fontSize: 26 }}>Адмінка</h1>
        <form action={signOut}>
          <button style={{ border: '1px solid rgba(49,45,41,.2)', background: 'transparent', padding: '8px 16px', borderRadius: 30, cursor: 'pointer' }}>Вийти</button>
        </form>
      </div>
      <p style={{ color: '#8A7F75', marginBottom: 28 }}>Вхід виконано: {user.email}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
        <Card href="/admin/tours" label="Тури" value={toursCount ?? 0} active />
        <Card href="/admin/content" label="Тексти головної" active />
        <Card href="/admin/blog" label="Статті блогу" value={postsCount ?? 0} active />
        <Card href="/admin/reviews" label="Відгуки" value={reviewsCount ?? 0} active />
      </div>

      <p style={{ marginTop: 28, color: '#8A7F75', fontSize: 14 }}>
        «Тури» — маршрути. «Тексти головної» — заголовки й контакти. Блог і відгуки додамо далі.
      </p>
    </div>
  )
}

function Card({ label, value, href, active }: { label: string; value?: number; href?: string; active?: boolean }) {
  const inner = (
    <div style={{
      background: '#fff', border: active ? '1px solid #BE6273' : '1px solid rgba(49,45,41,.12)',
      borderRadius: 14, padding: 22, height: '100%',
    }}>
      {value !== undefined && <div style={{ fontSize: 32, fontWeight: 800, color: '#BE6273' }}>{value}</div>}
      <div style={{ fontSize: 14, color: '#8A7F75', marginTop: 4 }}>{label}</div>
      {active && <div style={{ fontSize: 13, color: '#BE6273', marginTop: 8, fontWeight: 700 }}>Керувати →</div>}
    </div>
  )
  return href ? <Link href={href} style={{ textDecoration: 'none' }}>{inner}</Link> : inner
}
