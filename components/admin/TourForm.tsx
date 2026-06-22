'use client'
// components/admin/TourForm.tsx — форма створення/редагування туру.
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Tour, TourTranslation } from '@/types/database'

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
  const [orgDetails, setOrgDetails] = useState(tour?.org_details ?? '')
  const [includes, setIncludes] = useState((tour?.includes ?? []).join('\n'))
  const [excludes, setExcludes] = useState((tour?.excludes ?? []).join('\n'))
  const [price, setPrice] = useState(tour?.price?.toString() ?? '')
  const [priceDetails, setPriceDetails] = useState(tour?.price_details ?? '')
  const [duration, setDuration] = useState(tour?.duration ?? '')
  const [participants, setParticipants] = useState(tour?.participants ?? '')
  const [format, setFormat] = useState(tour?.format ?? 'both')
  const [seasons, setSeasons] = useState<string[]>(tour?.seasons ?? [])
  const [isActive, setIsActive] = useState(tour?.is_active ?? true)
  const [sortOrder, setSortOrder] = useState(tour?.sort_order?.toString() ?? '0')
  const [coverUrl, setCoverUrl] = useState(tour?.cover_url ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [gallery, setGallery] = useState<string[]>(tour?.gallery ?? [])
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // рядок -> масив рядків (по одному пункту на рядок)
  const toLines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean)

  // Переклади UK/EN (базові поля = RU). Порожні поля -> відкат на RU на сайті.
  // includes/excludes тут зберігаємо як текст (по пункту на рядок).
  const initTrans = (loc: 'uk' | 'en') => ({
    title: tour?.translations?.[loc]?.title ?? '',
    summary: tour?.translations?.[loc]?.summary ?? '',
    description: tour?.translations?.[loc]?.description ?? '',
    org_details: tour?.translations?.[loc]?.org_details ?? '',
    price_details: tour?.translations?.[loc]?.price_details ?? '',
    participants: tour?.translations?.[loc]?.participants ?? '',
    includes: (tour?.translations?.[loc]?.includes ?? []).join('\n'),
    excludes: (tour?.translations?.[loc]?.excludes ?? []).join('\n'),
  })
  const [trans, setTrans] = useState({ uk: initTrans('uk'), en: initTrans('en') })
  function setT(loc: 'uk' | 'en', field: keyof ReturnType<typeof initTrans>, value: string) {
    setTrans((prev) => ({ ...prev, [loc]: { ...prev[loc], [field]: value } }))
  }

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

      // завантаження головного фото у Storage (bucket "media")
      if (file) {
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
        const path = `tours/${Date.now()}-${safeName}`
        const { error: upErr } = await supabase.storage.from('media').upload(path, file)
        if (upErr) throw upErr
        cover = supabase.storage.from('media').getPublicUrl(path).data.publicUrl
      }

      // завантаження фото галереї (можна кілька); додаємо до вже наявних
      const galleryUrls = [...gallery]
      for (let i = 0; i < galleryFiles.length; i++) {
        const f = galleryFiles[i]
        const safeName = f.name.replace(/[^a-zA-Z0-9.]/g, '_')
        const path = `tours/gallery/${Date.now()}-${i}-${safeName}`
        const { error: upErr } = await supabase.storage.from('media').upload(path, f)
        if (upErr) throw upErr
        galleryUrls.push(supabase.storage.from('media').getPublicUrl(path).data.publicUrl)
      }

      // Збираємо переклади: лише непорожні поля; порожня мова не потрапляє в jsonb.
      const translations: Record<string, TourTranslation> = {}
      for (const loc of ['uk', 'en'] as const) {
        const src = trans[loc]
        const obj: TourTranslation = {}
        if (src.title.trim()) obj.title = src.title.trim()
        if (src.summary.trim()) obj.summary = src.summary.trim()
        if (src.description.trim()) obj.description = src.description.trim()
        if (src.org_details.trim()) obj.org_details = src.org_details.trim()
        if (src.price_details.trim()) obj.price_details = src.price_details.trim()
        if (src.participants.trim()) obj.participants = src.participants.trim()
        const inc = toLines(src.includes)
        if (inc.length) obj.includes = inc
        const exc = toLines(src.excludes)
        if (exc.length) obj.excludes = exc
        if (Object.keys(obj).length) translations[loc] = obj
      }

      const payload = {
        title, slug: slug || slugify(title), city: city || null,
        summary: summary || null, description: description || null,
        org_details: orgDetails || null,
        price: price === '' ? null : Number(price),
        currency: 'USD',
        price_details: priceDetails || null,
        duration: duration || null,
        participants: participants || null,
        format,
        seasons,
        includes: toLines(includes),
        excludes: toLines(excludes),
        cover_url: cover,
        gallery: galleryUrls,
        is_active: isActive,
        sort_order: Number(sortOrder) || 0,
        translations,
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

      <label style={labelStyle}>Організаційні деталі</label>
      <textarea style={{ ...inputStyle, minHeight: 90 }} value={orgDetails} onChange={(e) => setOrgDetails(e.target.value)}
        placeholder="Початок з Токіо, Хаконе або Одавари; маршрут коригується під погоду…" />

      <label style={labelStyle}>Що включено (по одному пункту на рядок)</label>
      <textarea style={{ ...inputStyle, minHeight: 90 }} value={includes} onChange={(e) => setIncludes(e.target.value)}
        placeholder={'Ліцензований гід\nТранспорт\nВхідні квитки'} />

      <label style={labelStyle}>Що оплачується окремо (по одному пункту на рядок)</label>
      <textarea style={{ ...inputStyle, minHeight: 90 }} value={excludes} onChange={(e) => setExcludes(e.target.value)}
        placeholder={'Харчування\nОсобисті витрати'} />

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

      <label style={labelStyle}>Кількість учасників</label>
      <input style={inputStyle} value={participants} onChange={(e) => setParticipants(e.target.value)} placeholder="до 7 осіб" />

      <label style={labelStyle}>Деталі ціни (тарифи по групах)</label>
      <textarea style={{ ...inputStyle, minHeight: 80 }} value={priceDetails} onChange={(e) => setPriceDetails(e.target.value)}
        placeholder="1–6 осіб — $480; 7–12 — $X; від 13 — індивідуально" />

      <label style={labelStyle}>Формат</label>
      <select style={inputStyle} value={format} onChange={(e) => setFormat(e.target.value as Tour['format'])}>
        <option value="both">Груповий та індивідуальний</option>
        <option value="group">Тільки груповий</option>
        <option value="individual">Тільки індивідуальний</option>
      </select>

      <label style={labelStyle}>Сезони</label>
      <div style={{ display: 'flex', gap: 16, marginTop: 6, marginBottom: 16 }}>
        {(['spring', 'summer', 'autumn', 'winter'] as const).map((s) => (
          <label key={s} style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 400 }}>
            <input type="checkbox" checked={seasons.includes(s)}
              onChange={(e) => setSeasons(e.target.checked ? [...seasons, s] : seasons.filter((x) => x !== s))} />
            {{ spring: 'Весна 🌸', summer: 'Літо ☀️', autumn: 'Осінь 🍁', winter: 'Зима ❄️' }[s]}
          </label>
        ))}
      </div>

      <label style={labelStyle}>Головне фото</label>
      {coverUrl && !file && (
        <div style={{ marginTop: 6, marginBottom: 8 }}>
          {/* поточне фото */}
          <img src={coverUrl} alt="" style={{ width: 160, borderRadius: 8 }} />
        </div>
      )}
      <input style={{ ...inputStyle, padding: 8 }} type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

      <label style={labelStyle}>Галерея (можна кілька фото)</label>
      {gallery.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6, marginBottom: 8 }}>
          {gallery.map((url, i) => (
            <div key={i} style={{ position: 'relative' }}>
              {/* фото в галереї */}
              <img src={url} alt="" style={{ width: 110, height: 80, objectFit: 'cover', borderRadius: 8, display: 'block' }} />
              <button type="button" title="Прибрати" onClick={() => setGallery(gallery.filter((_, j) => j !== i))}
                style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,.6)', color: '#fff', cursor: 'pointer', fontSize: 15, lineHeight: '20px', padding: 0 }}>
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      {galleryFiles.length > 0 && (
        <p style={{ fontSize: 13, color: '#3C7A4E', marginTop: 4, marginBottom: 4 }}>
          Нових файлів буде завантажено: {galleryFiles.length}
        </p>
      )}
      <input style={{ ...inputStyle, padding: 8 }} type="file" accept="image/*" multiple onChange={(e) => setGalleryFiles(Array.from(e.target.files ?? []))} />

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

      <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(49,45,41,.15)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#312D29', marginBottom: 4 }}>Переклади (необов&apos;язково)</h3>
        <p style={{ fontSize: 13, color: '#8A7F75', marginBottom: 16 }}>
          Базові поля вище — російською. Тут — українська та англійська версії.
          Порожнє поле = на сайті покаже російський варіант.
        </p>

        {([['uk', 'Українська 🇺🇦'], ['en', 'English 🇬🇧']] as const).map(([loc, title]) => (
          <details key={loc} style={{ marginBottom: 14, border: '1px solid rgba(49,45,41,.15)', borderRadius: 8, padding: '12px 14px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: 14, color: '#5C544C' }}>{title}</summary>
            <div style={{ marginTop: 12 }}>
              <label style={labelStyle}>Назва туру</label>
              <input style={inputStyle} value={trans[loc].title} onChange={(e) => setT(loc, 'title', e.target.value)} />

              <label style={labelStyle}>Короткий опис (для картки)</label>
              <input style={inputStyle} value={trans[loc].summary} onChange={(e) => setT(loc, 'summary', e.target.value)} />

              <label style={labelStyle}>Повний опис (для сторінки туру)</label>
              <textarea style={{ ...inputStyle, minHeight: 120 }} value={trans[loc].description} onChange={(e) => setT(loc, 'description', e.target.value)} />

              <label style={labelStyle}>Організаційні деталі</label>
              <textarea style={{ ...inputStyle, minHeight: 80 }} value={trans[loc].org_details} onChange={(e) => setT(loc, 'org_details', e.target.value)} />

              <label style={labelStyle}>Що включено (по пункту на рядок)</label>
              <textarea style={{ ...inputStyle, minHeight: 80 }} value={trans[loc].includes} onChange={(e) => setT(loc, 'includes', e.target.value)} />

              <label style={labelStyle}>Що оплачується окремо (по пункту на рядок)</label>
              <textarea style={{ ...inputStyle, minHeight: 80 }} value={trans[loc].excludes} onChange={(e) => setT(loc, 'excludes', e.target.value)} />

              <label style={labelStyle}>Кількість учасників</label>
              <input style={inputStyle} value={trans[loc].participants} onChange={(e) => setT(loc, 'participants', e.target.value)} />

              <label style={labelStyle}>Деталі ціни</label>
              <textarea style={{ ...inputStyle, minHeight: 70 }} value={trans[loc].price_details} onChange={(e) => setT(loc, 'price_details', e.target.value)} />
            </div>
          </details>
        ))}
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
