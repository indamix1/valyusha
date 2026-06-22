'use client'
// app/admin/blog/[id]/page.tsx — редагування статті.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import PostForm from '@/components/admin/PostForm'
import type { Post } from '@/types/database'

export default function EditPost() {
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('posts').select('*').eq('id', id).single()
      setPost(data as Post)
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: 40, fontFamily: 'system-ui, sans-serif', color: '#312D29' }}>
      <Link href="/admin/blog" style={{ fontSize: 14, color: '#8A7F75' }}>← До списку статей</Link>
      <h1 style={{ fontSize: 26, margin: '4px 0 24px' }}>Редагування статті</h1>
      {loading ? (
        <p style={{ color: '#8A7F75' }}>Завантаження…</p>
      ) : post ? (
        <PostForm post={post} />
      ) : (
        <p style={{ color: '#BE6273' }}>Статтю не знайдено.</p>
      )}
    </div>
  )
}
