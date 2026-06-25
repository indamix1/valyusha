'use client'
// app/admin/reviews/page.tsx — список + створення/редагування/видалення відгуків.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Review, ReviewTranslation } from '@/types/database'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 11px', marginTop: 4, marginBottom: 12, borderRadius: 8,
  border: '1px solid rgba(49,45,41,.2)', fontSize: 14, outline: 'none', fontFamily: 'inherit',
}
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 700, color: '#5C544C' }

interface FormState {
  author_name: string
  author_city: string
  rating: number
  text: string
  sort_order: string
  is_approved: boolean
  uk_text: string
  uk_city: string
  en_text: string
  en_city: string
}

const EMPTY: FormState = {
  author_name: '', author_city: '', rating: 5, text: '', sort_order: '0', is_approved: true,
  uk_text: '', uk_city: '', en_text: '', en_city: '',
}

export default function AdminReviews() {
  const supabase = createClient()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    setReviews((data as Review[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function startNew() {
    setEditingId(null)
    setForm(EMPTY)
    setError(null)
  }

  function startEdit(r: Review) {
    setEditingId(r.id)
    setError(null)
    setForm({
      author_name: r.author_name,
      author_city: r.author_city ?? '',
      rating: r.rating,
      text: r.text,
      sort_order: r.sort_order?.toString() ?? '0',
      is_approved: r.is_approved,
      uk_text: r.translations?.uk?.text ?? '',
      uk_city: r.translations?.uk?.author_city ?? '',
      en_text: r.translations?.en?.text ?? '',
      en_city: r.translations?.en?.author_city ?? '',
    })
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const translations: Record<string, ReviewTranslation> = {}
      const uk: ReviewTranslation = {}
      if (form.uk_text.trim()) uk.text = form.uk_text.trim()
      if (form.uk_city.trim()) uk.author_city = form.uk_city.trim()
      if (Object.keys(uk).length) translations.uk = uk
      const en: ReviewTranslation = {}
      if (form.en_text.trim()) en.text = form.en_text.trim()
      if (form.en_city.trim()) en.author_city = form.en_city.trim()
      if (Object.keys(en).length) translations.en = en

      const payload = {
        author_name: form.author_name,
        author_city: form.author_city || null,
        rating: form.rating,
        text: form.text,
        is_approved: form.is_approved,
        sort_order: Number(form.sort_order) || 0,
        translations,
      }

      const res = editingId
        ? await supabase.from('reviews').update(payload).eq('id', editingId)
        : await supabase.from('reviews').insert(payload)
      if (res.error) throw res.error

      startNew()
      await load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Помилка збереження')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Видалити відгук «${name}»?`)) return
    await supabase.from('reviews').delete().eq('id', id)
    if (editingId === id) startNew()
    load()
  }

  async function approve(id: string) {
    await supabase.from('reviews').update({ is_approved: true }).eq('id', id)
    load()
  }

  const pending = reviews.filter((r) => !r.is_approved)

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: 40, fontFamily: 'system-ui, sans-serif', color: '#312D29' }}>
      <Link href="/admin" style={{ fontSize: 14, color: '#8A7F75' }}>← Адмінка</Link>
      <h1 style={{ fontSize: 26, marginTop: 4, marginBottom: 20 }}>Відгуки</h1>

      {pending.length > 0 && (
        <div style={{ background: '#FBEDF0', border: '1px solid rgba(190,98,115,.3)', borderRadius: 12, padding: 18, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, color: '#BE6273' }}>
            На модерації · {pending.length}
          </h3>
          {pending.map((r, i) => (
            <div key={r.id} style={{ padding: '12px 0', borderTop: i ? '1px solid rgba(190,98,115,.2)' : 'none' }}>
              <div style={{ fontWeight: 700 }}>
                {r.author_name} {r.author_city ? <span style={{ color: '#8A7F75', fontWeight: 400 }}>· {r.author_city}</span> : null}
                <span style={{ color: '#C7A24E', marginLeft: 8 }}>{'★'.repeat(r.rating)}</span>
              </div>
              <div style={{ fontSize: 14, color: '#5C544C', margin: '6px 0 10px' }}>{r.text}</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => approve(r.id)}
                  style={{ border: 'none', background: '#312D29', color: '#fff', padding: '8px 18px', borderRadius: 20, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                  ✓ Підтвердити
                </button>
                <button onClick={() => remove(r.id, r.author_name)}
                  style={{ border: '1px solid rgba(190,98,115,.5)', background: 'transparent', color: '#BE6273', padding: '8px 18px', borderRadius: 20, cursor: 'pointer', fontSize: 14 }}>
                  ✕ Відхилити
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={save} style={{ background: '#fff', border: '1px solid rgba(49,45,41,.12)', borderRadius: 12, padding: 20, marginBottom: 28 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>
          {editingId ? 'Редагувати відгук' : 'Новий відгук'}
        </h3>

        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Ім&apos;я *</label>
            <input style={inputStyle} value={form.author_name} onChange={(e) => set('author_name', e.target.value)} required />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Місто</label>
            <input style={inputStyle} value={form.author_city} onChange={(e) => set('author_city', e.target.value)} placeholder="Київ" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Оцінка</label>
            <select style={inputStyle} value={form.rating} onChange={(e) => set('rating', Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Порядок (менше = вище)</label>
            <input style={inputStyle} type="number" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} />
          </div>
        </div>

        <label style={labelStyle}>Текст відгуку *</label>
        <textarea style={{ ...inputStyle, minHeight: 100 }} value={form.text} onChange={(e) => set('text', e.target.value)} required />

        <details style={{ marginBottom: 12, border: '1px solid rgba(49,45,41,.15)', borderRadius: 8, padding: '10px 12px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: 14, color: '#5C544C' }}>Переклади UK / EN (необов&apos;язково)</summary>
          <div style={{ marginTop: 12 }}>
            <label style={labelStyle}>UK · текст</label>
            <textarea style={{ ...inputStyle, minHeight: 70 }} value={form.uk_text} onChange={(e) => set('uk_text', e.target.value)} />
            <label style={labelStyle}>UK · місто</label>
            <input style={inputStyle} value={form.uk_city} onChange={(e) => set('uk_city', e.target.value)} />
            <label style={labelStyle}>EN · текст</label>
            <textarea style={{ ...inputStyle, minHeight: 70 }} value={form.en_text} onChange={(e) => set('en_text', e.target.value)} />
            <label style={labelStyle}>EN · місто</label>
            <input style={inputStyle} value={form.en_city} onChange={(e) => set('en_city', e.target.value)} />
          </div>
        </details>

        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <input type="checkbox" checked={form.is_approved} onChange={(e) => set('is_approved', e.target.checked)} />
          Показувати на сайті
        </label>

        {error && <p style={{ color: '#BE6273', fontSize: 14, marginBottom: 10 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" disabled={saving}
            style={{ padding: '11px 22px', borderRadius: 30, border: 'none', background: '#312D29', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Зберігаємо…' : editingId ? 'Зберегти зміни' : 'Додати відгук'}
          </button>
          {editingId && (
            <button type="button" onClick={startNew}
              style={{ padding: '11px 22px', borderRadius: 30, border: '1px solid rgba(49,45,41,.2)', background: 'transparent', fontSize: 15, cursor: 'pointer' }}>
              Скасувати
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p style={{ color: '#8A7F75' }}>Завантаження…</p>
      ) : reviews.length === 0 ? (
        <p style={{ color: '#8A7F75' }}>Відгуків ще немає. Додайте перший через форму вище.</p>
      ) : (
        <div style={{ border: '1px solid rgba(49,45,41,.12)', borderRadius: 12, overflow: 'hidden' }}>
          {reviews.map((r, i) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 14, borderTop: i ? '1px solid rgba(49,45,41,.1)' : 'none', background: '#fff' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>
                  {r.author_name} {r.author_city ? <span style={{ color: '#8A7F75', fontWeight: 400 }}>· {r.author_city}</span> : null}
                  <span style={{ color: '#C7A24E', marginLeft: 8 }}>{'★'.repeat(r.rating)}</span>
                  {!r.is_approved && <span style={{ color: '#BE6273', fontSize: 12, marginLeft: 8 }}>· прихований</span>}
                </div>
                <div style={{ fontSize: 13, color: '#8A7F75', marginTop: 4 }}>{r.text.slice(0, 120)}{r.text.length > 120 ? '…' : ''}</div>
              </div>
              <button onClick={() => startEdit(r)}
                style={{ border: '1px solid rgba(49,45,41,.2)', background: 'transparent', padding: '7px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 14, flex: 'none' }}>
                Редагувати
              </button>
              <button onClick={() => remove(r.id, r.author_name)}
                style={{ border: 'none', background: 'transparent', color: '#BE6273', padding: '7px 10px', borderRadius: 20, cursor: 'pointer', fontSize: 14, flex: 'none' }}>
                Видалити
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
