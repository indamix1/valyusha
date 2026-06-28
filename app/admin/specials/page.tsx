'use client'
// app/admin/specials/page.tsx — список + создание/редактирование/удаление спец-маршрутов.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { SpecialRoute, SpecialRouteTranslation } from '@/types/database'

const translitMap: Record<string, string> = {
  а:'a',б:'b',в:'v',г:'g',ґ:'g',д:'d',е:'e',є:'ye',ж:'zh',з:'z',и:'i',і:'i',ї:'yi',
  й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',
  ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
}
function slugify(s: string) {
  return s.toLowerCase().split('').map((ch) => translitMap[ch] ?? ch).join('')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 11px', marginTop: 4, marginBottom: 12, borderRadius: 8,
  border: '1px solid rgba(49,45,41,.2)', fontSize: 14, outline: 'none', fontFamily: 'inherit',
}
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 700, color: '#5C544C' }

interface FormState {
  title: string; slug: string; description: string; sort_order: string; is_active: boolean
  uk_title: string; uk_description: string; en_title: string; en_description: string
}
const EMPTY: FormState = {
  title: '', slug: '', description: '', sort_order: '0', is_active: true,
  uk_title: '', uk_description: '', en_title: '', en_description: '',
}

export default function AdminSpecials() {
  const supabase = createClient()
  const [items, setItems] = useState<SpecialRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [coverUrl, setCoverUrl] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [gallery, setGallery] = useState<string[]>([])
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const { data } = await supabase.from('special_routes').select('*')
      .order('sort_order', { ascending: true }).order('created_at', { ascending: true })
    setItems((data as SpecialRoute[]) ?? [])
    setLoading(false)
  }
  useEffect(() => { load() /* eslint-disable-next-line */ }, [])

  function set<K extends keyof FormState>(f: K, v: FormState[K]) { setForm((p) => ({ ...p, [f]: v })) }
  function onTitle(v: string) {
    set('title', v)
    if (!editingId && (form.slug === '' || form.slug === slugify(form.title))) set('slug', slugify(v))
  }

  function startNew() {
    setEditingId(null); setForm(EMPTY); setCoverUrl(''); setCoverFile(null); setGallery([]); setGalleryFiles([]); setError(null)
  }
  function startEdit(s: SpecialRoute) {
    setEditingId(s.id); setError(null); setCoverUrl(s.cover_url ?? ''); setCoverFile(null)
    setGallery(s.gallery ?? []); setGalleryFiles([])
    setForm({
      title: s.title, slug: s.slug, description: s.description ?? '',
      sort_order: s.sort_order?.toString() ?? '0', is_active: s.is_active,
      uk_title: s.translations?.uk?.title ?? '', uk_description: s.translations?.uk?.description ?? '',
      en_title: s.translations?.en?.title ?? '', en_description: s.translations?.en?.description ?? '',
    })
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function upload(file: File, sub: string) {
    const safe = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
    const path = `specials/${sub}${Date.now()}-${safe}`
    const { error: e } = await supabase.storage.from('media').upload(path, file)
    if (e) throw e
    return supabase.storage.from('media').getPublicUrl(path).data.publicUrl
  }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(null)
    try {
      let cover = coverUrl || null
      if (coverFile) cover = await upload(coverFile, '')
      const galleryUrls = [...gallery]
      for (let i = 0; i < galleryFiles.length; i++) galleryUrls.push(await upload(galleryFiles[i], `gallery/${i}-`))

      const translations: Record<string, SpecialRouteTranslation> = {}
      const mk = (loc: 'uk' | 'en') => {
        const o: SpecialRouteTranslation = {}
        if (form[`${loc}_title`].trim()) o.title = form[`${loc}_title`].trim()
        if (form[`${loc}_description`].trim()) o.description = form[`${loc}_description`].trim()
        if (Object.keys(o).length) translations[loc] = o
      }
      mk('uk'); mk('en')

      const payload = {
        title: form.title, slug: form.slug || slugify(form.title),
        description: form.description || null, cover_url: cover, gallery: galleryUrls,
        sort_order: Number(form.sort_order) || 0, is_active: form.is_active, translations,
      }
      const res = editingId
        ? await supabase.from('special_routes').update(payload).eq('id', editingId)
        : await supabase.from('special_routes').insert(payload)
      if (res.error) throw res.error
      startNew(); await load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Помилка збереження')
    } finally { setSaving(false) }
  }

  async function remove(id: string, title: string) {
    if (!confirm(`Видалити «${title}»?`)) return
    await supabase.from('special_routes').delete().eq('id', id)
    if (editingId === id) startNew()
    load()
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: 40, fontFamily: 'system-ui, sans-serif', color: '#312D29' }}>
      <Link href="/admin" style={{ fontSize: 14, color: '#8A7F75' }}>← Адмінка</Link>
      <h1 style={{ fontSize: 26, marginTop: 4, marginBottom: 20 }}>Спеціальні маршрути</h1>

      <form onSubmit={save} style={{ background: '#fff', border: '1px solid rgba(49,45,41,.12)', borderRadius: 12, padding: 20, marginBottom: 28 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>{editingId ? 'Редагувати' : 'Новий спецмаршрут'}</h3>

        <label style={labelStyle}>Назва *</label>
        <input style={inputStyle} value={form.title} onChange={(e) => onTitle(e.target.value)} required />

        <label style={labelStyle}>Slug (адреса, латиницею) *</label>
        <input style={inputStyle} value={form.slug} onChange={(e) => set('slug', e.target.value)} required />

        <label style={labelStyle}>Опис</label>
        <textarea style={{ ...inputStyle, minHeight: 110 }} value={form.description} onChange={(e) => set('description', e.target.value)} />

        <label style={labelStyle}>Обкладинка</label>
        {coverUrl && !coverFile && (
          // eslint-disable-next-line @next/next/no-img-element
          <div style={{ marginTop: 6, marginBottom: 8 }}><img src={coverUrl} alt="" style={{ width: 160, borderRadius: 8 }} /></div>
        )}
        <input style={{ ...inputStyle, padding: 8 }} type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />

        <label style={labelStyle}>Галерея (кілька фото)</label>
        {gallery.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6, marginBottom: 8 }}>
            {gallery.map((url, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" style={{ width: 110, height: 80, objectFit: 'cover', borderRadius: 8, display: 'block' }} />
                <button type="button" onClick={() => setGallery(gallery.filter((_, j) => j !== i))}
                  style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,.6)', color: '#fff', cursor: 'pointer', fontSize: 15, lineHeight: '20px', padding: 0 }}>×</button>
              </div>
            ))}
          </div>
        )}
        <input style={{ ...inputStyle, padding: 8 }} type="file" accept="image/*" multiple onChange={(e) => setGalleryFiles(Array.from(e.target.files ?? []))} />

        <details style={{ marginBottom: 12, border: '1px solid rgba(49,45,41,.15)', borderRadius: 8, padding: '10px 12px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: 14, color: '#5C544C' }}>Переклади UK / EN (необов&apos;язково)</summary>
          <div style={{ marginTop: 12 }}>
            {(['uk', 'en'] as const).map((loc) => (
              <div key={loc} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{loc.toUpperCase()}</div>
                <input style={inputStyle} placeholder="Назва" value={form[`${loc}_title`]} onChange={(e) => set(`${loc}_title`, e.target.value)} />
                <textarea style={{ ...inputStyle, minHeight: 80 }} placeholder="Опис" value={form[`${loc}_description`]} onChange={(e) => set(`${loc}_description`, e.target.value)} />
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
            {saving ? 'Зберігаємо…' : editingId ? 'Зберегти зміни' : 'Додати'}
          </button>
          {editingId && (
            <button type="button" onClick={startNew} style={{ padding: '11px 22px', borderRadius: 30, border: '1px solid rgba(49,45,41,.2)', background: 'transparent', fontSize: 15, cursor: 'pointer' }}>Скасувати</button>
          )}
        </div>
      </form>

      {loading ? (
        <p style={{ color: '#8A7F75' }}>Завантаження…</p>
      ) : items.length === 0 ? (
        <p style={{ color: '#8A7F75' }}>Спецмаршрутів ще немає.</p>
      ) : (
        <div style={{ border: '1px solid rgba(49,45,41,.12)', borderRadius: 12, overflow: 'hidden' }}>
          {items.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderTop: i ? '1px solid rgba(49,45,41,.1)' : 'none', background: '#fff' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{s.title}{!s.is_active && <span style={{ color: '#BE6273', fontSize: 12, marginLeft: 8 }}>· прихований</span>}</div>
                <div style={{ fontSize: 13, color: '#8A7F75', marginTop: 4 }}>/specials/{s.slug} · фото: {s.gallery?.length ?? 0}</div>
              </div>
              <button onClick={() => startEdit(s)} style={{ border: '1px solid rgba(49,45,41,.2)', background: 'transparent', padding: '7px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 14, flex: 'none' }}>Редагувати</button>
              <button onClick={() => remove(s.id, s.title)} style={{ border: 'none', background: 'transparent', color: '#BE6273', padding: '7px 10px', borderRadius: 20, cursor: 'pointer', fontSize: 14, flex: 'none' }}>Видалити</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
