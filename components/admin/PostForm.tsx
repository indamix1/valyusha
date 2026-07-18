'use client'
// components/admin/PostForm.tsx — форма створення/редагування статті блогу.
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Post, PostTranslation } from '@/types/database'

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

export default function PostForm({ post }: { post?: Post }) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [published, setPublished] = useState(post?.published ?? false)
  const [coverUrl, setCoverUrl] = useState(post?.cover_url ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [gallery, setGallery] = useState<string[]>(post?.gallery ?? [])
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initTrans = (loc: 'uk' | 'en') => ({
    title: post?.translations?.[loc]?.title ?? '',
    excerpt: post?.translations?.[loc]?.excerpt ?? '',
    content: post?.translations?.[loc]?.content ?? '',
  })
  const [trans, setTrans] = useState({ uk: initTrans('uk'), en: initTrans('en') })
  function setT(loc: 'uk' | 'en', field: keyof PostTranslation, value: string) {
    setTrans((prev) => ({ ...prev, [loc]: { ...prev[loc], [field]: value } }))
  }

  function onTitleChange(v: string) {
    setTitle(v)
    if (!post && (slug === '' || slug === slugify(title))) setSlug(slugify(v))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      let cover = coverUrl || null
      if (file) {
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
        const path = `posts/${Date.now()}-${safeName}`
        const { error: upErr } = await supabase.storage.from('media').upload(path, file)
        if (upErr) throw upErr
        cover = supabase.storage.from('media').getPublicUrl(path).data.publicUrl
      }

      // завантаження фото галереї (можна кілька); додаємо до вже наявних
      const galleryUrls = [...gallery]
      for (let i = 0; i < galleryFiles.length; i++) {
        const f = galleryFiles[i]
        const safeName = f.name.replace(/[^a-zA-Z0-9.]/g, '_')
        const path = `posts/gallery/${Date.now()}-${i}-${safeName}`
        const { error: upErr } = await supabase.storage.from('media').upload(path, f)
        if (upErr) throw upErr
        galleryUrls.push(supabase.storage.from('media').getPublicUrl(path).data.publicUrl)
      }

      const translations: Record<string, PostTranslation> = {}
      for (const loc of ['uk', 'en'] as const) {
        const src = trans[loc]
        const obj: PostTranslation = {}
        if (src.title.trim()) obj.title = src.title.trim()
        if (src.excerpt.trim()) obj.excerpt = src.excerpt.trim()
        if (src.content.trim()) obj.content = src.content.trim()
        if (Object.keys(obj).length) translations[loc] = obj
      }

      // Дата публікації: проставляємо при першій публікації, далі не чіпаємо.
      const published_at = published
        ? post?.published_at ?? new Date().toISOString()
        : post?.published_at ?? null

      const payload = {
        title, slug: slug || slugify(title),
        excerpt: excerpt || null, content: content || null,
        cover_url: cover, gallery: galleryUrls, published, published_at,
        translations,
      }

      const res = post
        ? await supabase.from('posts').update(payload).eq('id', post.id)
        : await supabase.from('posts').insert(payload)
      if (res.error) throw res.error

      router.push('/admin/blog')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Помилка збереження')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
      <label style={labelStyle}>Заголовок *</label>
      <input style={inputStyle} value={title} onChange={(e) => onTitleChange(e.target.value)} required />

      <label style={labelStyle}>Slug (адреса, латиницею) *</label>
      <input style={inputStyle} value={slug} onChange={(e) => setSlug(e.target.value)} required />

      <label style={labelStyle}>Анонс (короткий опис для картки)</label>
      <textarea style={{ ...inputStyle, minHeight: 70 }} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />

      <label style={labelStyle}>Текст статті</label>
      <textarea style={{ ...inputStyle, minHeight: 220 }} value={content} onChange={(e) => setContent(e.target.value)}
        placeholder="Абзаци розділяйте порожнім рядком." />

      <label style={labelStyle}>Обкладинка</label>
      {coverUrl && !file && (
        <div style={{ marginTop: 6, marginBottom: 8 }}>
          {/* поточне фото */}
          <img src={coverUrl} alt="" style={{ width: 200, borderRadius: 8 }} />
        </div>
      )}
      <input style={{ ...inputStyle, padding: 8 }} type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

      <label style={labelStyle}>Галерея фото (можна кілька)</label>
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
        <div style={{ marginTop: 6, marginBottom: 8 }}>
          <p style={{ fontSize: 13, color: '#3C7A4E', marginBottom: 6 }}>
            Нових файлів буде завантажено: {galleryFiles.length}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {galleryFiles.map((f, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F3E8DD', borderRadius: 6, padding: '4px 8px', fontSize: 12, color: '#5C544C' }}>
                {f.name.length > 24 ? f.name.slice(0, 24) + '…' : f.name}
                <button type="button" title="Прибрати" onClick={() => setGalleryFiles(galleryFiles.filter((_, j) => j !== i))}
                  style={{ border: 'none', background: 'transparent', color: '#BE6273', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Додаємо файли до списку (не замінюємо), скидаємо input щоб можна було вибрати той самий файл */}
      <input style={{ ...inputStyle, padding: 8 }} type="file" accept="image/*" multiple
        onChange={(e) => {
          const picked = Array.from(e.target.files ?? [])
          if (picked.length) setGalleryFiles((prev) => [...prev, ...picked])
          e.target.value = ''
        }} />

      <div style={{ marginTop: 12, paddingTop: 16, borderTop: '1px solid rgba(49,45,41,.15)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Переклади (необов&apos;язково)</h3>
        <p style={{ fontSize: 13, color: '#8A7F75', marginBottom: 16 }}>
          Базові поля вище — російською. Порожнє поле = на сайті покаже російський варіант.
        </p>
        {([['uk', 'Українська 🇺🇦'], ['en', 'English 🇬🇧']] as const).map(([loc, name]) => (
          <details key={loc} style={{ marginBottom: 14, border: '1px solid rgba(49,45,41,.15)', borderRadius: 8, padding: '12px 14px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: 14, color: '#5C544C' }}>{name}</summary>
            <div style={{ marginTop: 12 }}>
              <label style={labelStyle}>Заголовок</label>
              <input style={inputStyle} value={trans[loc].title} onChange={(e) => setT(loc, 'title', e.target.value)} />
              <label style={labelStyle}>Анонс</label>
              <textarea style={{ ...inputStyle, minHeight: 60 }} value={trans[loc].excerpt} onChange={(e) => setT(loc, 'excerpt', e.target.value)} />
              <label style={labelStyle}>Текст статті</label>
              <textarea style={{ ...inputStyle, minHeight: 160 }} value={trans[loc].content} onChange={(e) => setT(loc, 'content', e.target.value)} />
            </div>
          </details>
        ))}
      </div>

      <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Опублікувати (показувати на сайті)
      </label>

      {error && <p style={{ color: '#BE6273', fontSize: 14, marginTop: 8 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button type="submit" disabled={saving}
          style={{ padding: '12px 24px', borderRadius: 30, border: 'none', background: '#312D29', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Зберігаємо…' : 'Зберегти'}
        </button>
        <button type="button" onClick={() => router.push('/admin/blog')}
          style={{ padding: '12px 24px', borderRadius: 30, border: '1px solid rgba(49,45,41,.2)', background: 'transparent', fontSize: 15, cursor: 'pointer' }}>
          Скасувати
        </button>
      </div>
    </form>
  )
}
