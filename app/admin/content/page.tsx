'use client'
// app/admin/content/page.tsx — редактор текстів головної (site_content).
// RU — базова мова, UK/EN — переклади (порожнє = відкат на RU на сайті).
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Row {
  key: string
  value: string | null
  value_uk: string | null
  value_en: string | null
}

// Зрозумілі підписи + порядок виводу.
const LABELS: Record<string, string> = {
  hero_eyebrow: 'Головна · напис над заголовком',
  hero_title: 'Головна · головний заголовок',
  hero_subtitle: 'Головна · підзаголовок',
  about_title: 'Блок «Про мене» · заголовок',
  about_text: 'Блок «Про мене» · текст',
  contact_phone: 'Контакти · телефон',
  contact_email: 'Контакти · email',
  contact_whatsapp: 'Контакти · посилання WhatsApp',
}
const ORDER = Object.keys(LABELS)
const MULTILINE = new Set(['hero_title', 'hero_subtitle', 'about_title', 'about_text'])

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 11px', marginTop: 4, borderRadius: 8,
  border: '1px solid rgba(49,45,41,.2)', fontSize: 14, outline: 'none', fontFamily: 'inherit',
}
const colLabel: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: '#8A7F75' }

export default function AdminContent() {
  const supabase = createClient()
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function load() {
    const { data } = await supabase
      .from('site_content')
      .select('key, value, value_uk, value_en')
    const list = (data as Row[]) ?? []
    list.sort((a, b) => {
      const ia = ORDER.indexOf(a.key), ib = ORDER.indexOf(b.key)
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib)
    })
    setRows(list)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function setField(key: string, field: keyof Row, val: string) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, [field]: val } : r)))
  }

  async function save() {
    setSaving(true)
    setMsg(null)
    const payload = rows.map((r) => ({
      key: r.key,
      value: r.value,
      value_uk: r.value_uk,
      value_en: r.value_en,
    }))
    const { error } = await supabase.from('site_content').upsert(payload)
    setSaving(false)
    setMsg(error ? `Помилка: ${error.message}` : 'Збережено ✓')
  }

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: 40, fontFamily: 'system-ui, sans-serif', color: '#312D29' }}>
      <Link href="/admin" style={{ fontSize: 14, color: '#8A7F75' }}>← Адмінка</Link>
      <h1 style={{ fontSize: 26, marginTop: 4, marginBottom: 6 }}>Тексти головної</h1>
      <p style={{ color: '#8A7F75', marginBottom: 24, fontSize: 14 }}>
        RU — основна мова. UK/EN можна лишити порожніми — тоді на сайті покажеться російський текст.
      </p>

      {loading ? (
        <p style={{ color: '#8A7F75' }}>Завантаження…</p>
      ) : (
        <>
          {rows.map((r) => {
            const Field = MULTILINE.has(r.key) ? 'textarea' : 'input'
            const extra = MULTILINE.has(r.key) ? { style: { ...inputStyle, minHeight: 64 } } : { style: inputStyle }
            return (
              <div key={r.key} style={{ background: '#fff', border: '1px solid rgba(49,45,41,.12)', borderRadius: 12, padding: 18, marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{LABELS[r.key] ?? r.key}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <span style={colLabel}>RU (основна)</span>
                    <Field {...extra} value={r.value ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setField(r.key, 'value', e.target.value)} />
                  </div>
                  <div>
                    <span style={colLabel}>UK</span>
                    <Field {...extra} value={r.value_uk ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setField(r.key, 'value_uk', e.target.value)} />
                  </div>
                  <div>
                    <span style={colLabel}>EN</span>
                    <Field {...extra} value={r.value_en ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setField(r.key, 'value_en', e.target.value)} />
                  </div>
                </div>
              </div>
            )
          })}

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20 }}>
            <button onClick={save} disabled={saving}
              style={{ padding: '12px 26px', borderRadius: 30, border: 'none', background: '#312D29', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Зберігаємо…' : 'Зберегти все'}
            </button>
            {msg && <span style={{ fontSize: 14, color: msg.startsWith('Помилка') ? '#BE6273' : '#3C7A4E' }}>{msg}</span>}
          </div>
        </>
      )}
    </div>
  )
}
