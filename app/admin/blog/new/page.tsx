'use client'
// app/admin/blog/new/page.tsx — створення нової статті.
import Link from 'next/link'
import PostForm from '@/components/admin/PostForm'

export default function NewPost() {
  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: 40, fontFamily: 'system-ui, sans-serif', color: '#312D29' }}>
      <Link href="/admin/blog" style={{ fontSize: 14, color: '#8A7F75' }}>← До списку статей</Link>
      <h1 style={{ fontSize: 26, margin: '4px 0 24px' }}>Нова стаття</h1>
      <PostForm />
    </div>
  )
}
