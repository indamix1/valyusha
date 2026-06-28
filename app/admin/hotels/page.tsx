'use client'
// app/admin/hotels/page.tsx — список + создание/редактирование/удаление отелей.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Hotel, HotelTranslation } from '@/types/database'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 11px', marginTop: 4, marginBottom: 12, borderRadius: 8,
  border: '1px solid rgba(49,45,41,.2)', fontSize: 14, outline: 'none', fontFamily: 'inherit',
}
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 700, color: '#5C544C' }

interface FormState {
  name: string; area: string; stars: number; description: string; url: string
  price_note: string; sort_order: string; is_active: boolean
  uk_name: string; uk_area: string; uk_description: string; uk_price_note: string
  en_name: string; en_area: string; en_description: string; en_price_note: string
}
const EMPTY: FormState = {
  name: '', area: '', stars: 5, description: '', url: '', price_note: '', sort_order: '0', is_active: true,
  uk_name: '', uk_area: '', uk_description: '', uk_price_note: '',
  en_name: '', en_area: '', en_description: '', en_price_note: '',
}

export default function AdminHotels() {
  const supabase = createClient()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [imageUrl, setImageUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const { data } = await supabase.from('hotels').select('*')
      .order('sort_order', { ascending: true }).order('created_at', { ascending: true })
    setHotels((data as Hotel[]) ?? [])
    setLoading(false)
  }
  useEffect(() => { load() /* eslint-disable-next-line */ }, [])

  function set<K extends keyof FormState>(f: K, v: FormState[K]) { setForm((p) => ({ ...p, [f]: v })) }

  function startNew() { setEditingId(null); setForm(EMPTY); setImageUrl(''); setFile(null); setError(null) }
  function startEdit(h: Hotel) {
    setEditingId(h.id); setError(null); setImageUrl(h.image_url ?? ''); setFile(null)
    setForm({
      name: h.name, area: h.area ?? '', stars: h.stars, description: h.description ?? '',
      url: h.url ?? '', price_note: h.price_note ?? '', sort_order: h.sort_order?.toString() ?? '0', is_active: h.is_active,
      uk_name: h.translations?.uk?.name ?? '', uk_area: h.translations?.uk?.area ?? '',
      uk_description: h.translations?.uk?.description ?? '', uk_price_note: h.translations?.uk?.price_note ?? '',
      en_name: h.translations?.en?.name ?? '', en_area: h.translations?.en?.area ?? '',
      en_description: h.translations?.en?.description ?? '', en_price_note: h.translations?.en?.price_note ?? '',
    })
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(null)
    try {
      let cover = imageUrl || null
      if (file) {
        const safe = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
        const path = `hotels/${Date.now()}-${safe}`
        const { error: upErr } = await supabase.storage.from('media').upload(path, file)
        if (upErr) throw upErr
        cover = supabase.storage.from('media').getPublicUrl(path).data.publicUrl
      }
      const translations: Record<string, HotelTranslation> = {}
      const mk = (loc: 'uk' | 'en') => {
        const o: HotelTranslation = {}
        if (form[`${loc}_name`].trim()) o.name = form[`${loc}_name`].trim()
        if (form[`${loc}_area`].trim()) o.area = form[`${loc}_area`].trim()
        if (form[`${loc}_description`].trim()) o.description = form[`${loc}_description`].trim()
        if (form[`${loc}_price_note`].trim()) o.price_note = form[`${loc}_price_note`].trim()
        if (Object.keys(o).length) translations[loc] = o
      }
      mk('uk'); mk('en')
      const payload = {
        name: form.name, area: form.area || null, stars: form.stars,
        description: form.description || null, url: form.url || null,
        price_note: form.price_note || null, image_url: cover,
        sort_order: Number(form.sort_order) || 0, is_active: form.is_active, translations,
      }
      const res = editingId
        ? await supabase.from('hotels').update(payload).eq('id', editingId)
        : await supabase.from('hotels').insert(payload)
      if (res.error) throw res.error
      startNew(); await load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Помилка збереження')
    } finally { setSaving(false) }
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Видалити готель «${name}»?`)) return
    await supabase.from('hotels').delete().eq('id', id)
    if (editingId === id) startNew()
    load()
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: 40, fontFamily: 'system-ui, sans-serif', color: '#312D29' }}>
      <Link href="/admin" style={{ fontSize: 14, color: '#8A7F75' }}>← Адмінка</Link>
      <h1 style={{ fontSize: 26, marginTop: 4, marginBottom: 20 }}>Готелі</h1>

      <form onSubmit={save} style={{ background: '#fff', border: '1px solid rgba(49,45,41,.12)', borderRadius: 12, padding: 20, marginBottom: 28 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>{editingId ? 'Редагувати готель' : 'Новий готель'}</h3>

        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Назва *</label>
            <input style={inputStyle} value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Місто / район</label>
            <input style={inputStyle} value={form.area} onChange={(e) => set('area', e.target.value)} placeholder="Токіо, Сіндзюку" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Зірки</label>
            <select style={inputStyle} value={form.stars} onChange={(e) => set('stars', Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Ціна (підпис)</label>
            <input style={inputStyle} value={form.price_note} onChange={(e) => set('price_note', e.target.value)} placeholder="від $120 / ніч" />
          </div>
        </div>

        <label style={labelStyle}>Посилання на бронювання</label>
        <input style={inputStyle} value={form.url} onChange={(e) => set('url', e.target.value)} placeholder="https://booking.com/..." />

        <label style={labelStyle}>Опис</label>
        <textarea style={{ ...inputStyle, minHeight: 90 }} value={form.description} onChange={(e) => set('description', e.target.value)} />

        <label style={labelStyle}>Фото</label>
        {imageUrl && !file && (
          // eslint-disable-next-line @next/next/no-img-element
          <div style={{ marginTop: 6, marginBottom: 8 }}><img src={imageUrl} alt="" style={{ width: 160, borderRadius: 8 }} /></div>
        )}
        <input style={{ ...inputStyle, padding: 8 }} type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

        <details style={{ marginBottom: 12, border: '1px solid rgba(49,45,41,.15)', borderRadius: 8, padding: '10px 12px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: 14, color: '#5C544C' }}>Переклади UK / EN (необов&apos;язково)</summary>
          <div style={{ marginTop: 12 }}>
            {(['uk', 'en'] as const).map((loc) => (
              <div key={loc} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{loc.toUpperCase()}</div>
                <input style={inputStyle} placeholder="Назва" value={form[`${loc}_name`]} onChange={(e) => set(`${loc}_name`, e.target.value)} />
                <input style={inputStyle} placeholder="Місто / район" value={form[`${loc}_area`]} onChange={(e) => set(`${loc}_area`, e.target.value)} />
                <input style={inputStyle} placeholder="Ціна (підпис)" value={form[`${loc}_price_note`]} onChange={(e) => set(`${loc}_price_note`, e.target.value)} />
                <textarea style={{ ...inputStyle, minHeight: 60 }} placeholder="Опис" value={form[`${loc}_description`]} onChange={(e) => set(`${loc}_description`, e.target.value)} />
              </div>
            ))}
          </div>
        </details>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Порядок (менше = вище)</label>
            <input style={inputStyle} type="number" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} />
          </div>
          <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 8, marginTop: 18 }}>
            <input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} /> Показувати на сайті
          </label>
        </div>

        {error && <p style={{ color: '#BE6273', fontSize: 14, marginBottom: 10 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" disabled={saving} style={{ padding: '11px 22px', borderRadius: 30, border: 'none', background: '#312D29', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Зберігаємо…' : editingId ? 'Зберегти зміни' : 'Додати готель'}
          </button>
          {editingId && (
            <button type="button" onClick={startNew} style={{ padding: '11px 22px', borderRadius: 30, border: '1px solid rgba(49,45,41,.2)', background: 'transparent', fontSize: 15, cursor: 'pointer' }}>Скасувати</button>
          )}
        </div>
      </form>

      {loading ? (
        <p style={{ color: '#8A7F75' }}>Завантаження…</p>
      ) : hotels.length === 0 ? (
        <p style={{ color: '#8A7F75' }}>Готелів ще немає. Додайте перший через форму вище.</p>
      ) : (
        <div style={{ border: '1px solid rgba(49,45,41,.12)', borderRadius: 12, overflow: 'hidden' }}>
          {hotels.map((h, i) => (
            <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderTop: i ? '1px solid rgba(49,45,41,.1)' : 'none', background: '#fff' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>
                  {h.name} <span style={{ color: '#C7A24E' }}>{'★'.repeat(h.stars)}</span>
                  {h.area ? <span style={{ color: '#8A7F75', fontWeight: 400 }}> · {h.area}</span> : null}
                  {!h.is_active && <span style={{ color: '#BE6273', fontSize: 12, marginLeft: 8 }}>· прихований</span>}
                </div>
                {h.price_note && <div style={{ fontSize: 13, color: '#8A7F75', marginTop: 4 }}>{h.price_note}</div>}
              </div>
              <button onClick={() => startEdit(h)} style={{ border: '1px solid rgba(49,45,41,.2)', background: 'transparent', padding: '7px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 14, flex: 'none' }}>Редагувати</button>
              <button onClick={() => remove(h.id, h.name)} style={{ border: 'none', background: 'transparent', color: '#BE6273', padding: '7px 10px', borderRadius: 20, cursor: 'pointer', fontSize: 14, flex: 'none' }}>Видалити</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
