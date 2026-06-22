'use client'
// components/admin/TourForm.tsx — форма створення/редагування туру.
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Tour } from '@/types/database'

// проста транслітерація для slug (кирилиця -> латиниця)
const translitMap: Record<string, string> = {
  а:'a',б:'b',в:'v',г:'g',ґ:'g',д:'d',е:'e',є:'ye',ж:'zh',з:'z',и:'i',і:'i',ї:'yi',
  й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',
  ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
}
function slugify(text: string): string {
  return text.toLowerCase().split('').map((ch) => translitMap[ch] ?? ch).join('')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', marginTop: 5, marginBottom: 16,
  borderRadius: 8, border: '1px solid rgba(49,45,41,.2)', fontSize: 15, outline: 'none',
  fontFamily: 'inherit',
}
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 700, color: '#5C544C' }

export default function TourForm({ tour }: { tour?: Tour }) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(tour?.title ?? '')
  const [slug, setSlug] = useState(tour?.slug ?? '')
  const [city, setCity] = useState(tour?.city ?? '')
  const [summary, setSummary] = useState(tour?.summary ?? '')
  const [description, setDescription] = useState(tour?.description ?? '')
  const [price, setPrice] = useState(tour?.price?.toString() ?? '')
  const [priceDetails, setPriceDetails] = useState(tour?.price_details ?? '')
  const [duration, setDuration] = useState(tour?.duration ?? '')
  const [format, setFormat] = useState(tour?.format ?? 'both')
  const [isActive, setIsActive] = useState(tour?.is_active ?? true)
  const [sortOrder, setSortOrder] = useState(tour?.sort_order?.toString() ?? '0')
  const [coverUrl, setCoverUrl] = useState(tour?.cover_url ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // автозаповнення slug, поки користувач не редагував його вручну
  function onTitleChange(v: string) {
    setTitle(v)
    if (!tour && (slug === '' || slug === slugify(title))) setSlug(slugify(v))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      let cover = coverUrl || null

      // завантаження фото у Storage (bucket "media")
      if (file) {
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
        const path = `tours/${Date.now()}-${safeName}`
        const { error: upErr } = await supabase.storage.from('media').upload(path, file)
        if (upErr) throw upErr
        cover = supabase.storage.from('media').getPublicUrl(path).data.publicUrl
      }

      const payload = {
        title, slug: slug || slugify(title), city: city || null,
        summary: summary || null, description: description || null,
        price: price === '' ? null : Number(price),
        currency: 'USD',
        price_details: priceDetails || null,
        duration: duration || null,
        format,
        cover_url: cover,
        is_active: isActive,
        sort_order: Number(sortOrder) || 0,
      }

      const res = tour
        ? await supabase.from('tours').update(payload).eq('id', tour.id)
        : await supabase.from('tours').insert(payload)

      if (res.error) throw res.error
      router.push('/admin/tours')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Помилка збереження')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
      <label style={labelStyle}>Назва туру *</label>
      <input style={inputStyle} value={title} onChange={(e) => onTitleChange(e.target.value)} required />

      <label style={labelStyle}>Slug (адреса, латиницею) *</label>
      <input style={inputStyle} value={slug} onChange={(e) => setSlug(e.target.value)} required />

      <label style={labelStyle}>Місто / регіон</label>
      <input style={inputStyle} value={city} onChange={(e) => setCity(e.target.value)} placeholder="Токіо" />

      <label style={labelStyle}>Короткий опис (для картки)</label>
      <input style={inputStyle} value={summary} onChange={(e) => setSummary(e.target.value)} />

      <label style={labelStyle}>Повний опис (для сторінки туру)</label>
      <textarea style={{ ...inputStyle, minHeight: 140 }} value={description} onChange={(e) => setDescription(e.target.value)} />

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Ціна від, $ (для картки)</label>
          <input style={inputStyle} type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="480" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Тривалість</label>
          <input style={inputStyle} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="6–8 годин" />
        </div>
      </div>

      <label style={labelStyle}>Деталі ціни (тарифи по групах)</label>
      <textarea style={{ ...inputStyle, minHeight: 80 }} value={priceDetails} onChange={(e) => setPriceDetails(e.target.value)}
        placeholder="1–6 осіб — $480; 7–12 — $X; від 13 — індивідуально" />

      <label style={labelStyle}>Формат</label>
      <select style={inputStyle} value={format} onChange={(e) => setFormat(e.target.value as Tour['format'])}>
        <option value="both">Груповий та індивідуальний</option>
        <option value="group">Тільки груповий</option>
        <option value="individual">Тільки індивідуальний</option>
      </select>

      <label style={labelStyle}>Головне фото</label>
      {coverUrl && !file && (
        <div style={{ marginTop: 6, marginBottom: 8 }}>
          {/* поточне фото */}
          <img src={coverUrl} alt="" style={{ width: 160, borderRadius: 8 }} />
        </div>
      )}
      <input style={{ ...inputStyle, padding: 8 }} type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Порядок (менше = вище)</label>
          <input style={inputStyle} type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
        </div>
        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 8, marginTop: 18 }}>
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Показувати на сайті
        </label>
      </div>

      {error && <p style={{ color: '#BE6273', fontSize: 14, marginTop: 8 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button type="submit" disabled={saving}
          style={{ padding: '12px 24px', borderRadius: 30, border: 'none', background: '#312D29', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Зберігаємо…' : 'Зберегти'}
        </button>
        <button type="button" onClick={() => router.push('/admin/tours')}
          style={{ padding: '12px 24px', borderRadius: 30, border: '1px solid rgba(49,45,41,.2)', background: 'transparent', fontSize: 15, cursor: 'pointer' }}>
          Скасувати
        </button>
      </div>
    </form>
  )
}
