'use client'
// app/admin/login/page.tsx — сторінка входу в адмінку (email + пароль).
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('Невірний email або пароль')
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#FAF5EF', fontFamily: 'system-ui, sans-serif' }}>
      <form onSubmit={handleLogin} style={{ width: 340, background: '#fff', padding: 32, borderRadius: 16, border: '1px solid rgba(49,45,41,.12)' }}>
        <h1 style={{ fontSize: 22, marginBottom: 6, color: '#312D29' }}>Вхід в адмінку</h1>
        <p style={{ fontSize: 14, color: '#8A7F75', marginBottom: 22 }}>Valyusha · Гід в Японії</p>

        <label style={{ fontSize: 13, fontWeight: 700, color: '#5C544C' }}>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          style={inputStyle} />

        <label style={{ fontSize: 13, fontWeight: 700, color: '#5C544C' }}>Пароль</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
          style={inputStyle} />

        {error && <p style={{ color: '#BE6273', fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '13px', borderRadius: 40, border: 'none', background: '#312D29', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Входимо…' : 'Увійти'}
        </button>
      </form>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 13px', marginTop: 6, marginBottom: 16,
  borderRadius: 10, border: '1px solid rgba(49,45,41,.2)', fontSize: 15, outline: 'none',
}
