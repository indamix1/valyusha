'use client'
// app/admin/blog/page.tsx — список статей блогу в адмінці.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Post } from '@/types/database'

export default function AdminBlog() {
  const supabase = createClient()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
    setPosts((data as Post[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function remove(id: string, title: string) {
    if (!confirm(`Видалити статтю «${title}»?`)) return
    await supabase.from('posts').delete().eq('id', id)
    load()
  }

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: 40, fontFamily: 'system-ui, sans-serif', color: '#312D29' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Link href="/admin" style={{ fontSize: 14, color: '#8A7F75' }}>← Адмінка</Link>
          <h1 style={{ fontSize: 26, marginTop: 4 }}>Блог</h1>
        </div>
        <Link href="/admin/blog/new"
          style={{ padding: '11px 20px', borderRadius: 30, background: '#BE6273', color: '#fff', fontWeight: 700, fontSize: 15 }}>
          + Додати статтю
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#8A7F75' }}>Завантаження…</p>
      ) : posts.length === 0 ? (
        <p style={{ color: '#8A7F75' }}>Статей ще немає. Натисніть «Додати статтю».</p>
      ) : (
        <div style={{ border: '1px solid rgba(49,45,41,.12)', borderRadius: 12, overflow: 'hidden' }}>
          {posts.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderTop: i ? '1px solid rgba(49,45,41,.1)' : 'none', background: '#fff' }}>
              <div style={{ width: 64, height: 44, borderRadius: 6, background: p.cover_url ? `center/cover url(${p.cover_url})` : '#F3E8DD', flex: 'none' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: '#8A7F75' }}>
                  /{p.slug} {p.published ? '' : '· чернетка'}
                </div>
              </div>
              <button onClick={() => router.push(`/admin/blog/${p.id}`)}
                style={{ border: '1px solid rgba(49,45,41,.2)', background: 'transparent', padding: '7px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 14 }}>
                Редагувати
              </button>
              <button onClick={() => remove(p.id, p.title)}
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
