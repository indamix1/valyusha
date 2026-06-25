'use client'
// components/ReviewForm.tsx — публичная форма отзыва. Вставляет запись с is_approved=false
// (на модерацию). Админ подтверждает/отклоняет в /admin/reviews.
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

export default function ReviewForm() {
  const t = useTranslations('reviews')
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [hp, setHp] = useState('') // honeypot
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (hp) return // бот заполнил скрытое поле
    if (!name.trim() || !text.trim()) return
    setState('sending')
    const supabase = createClient()
    const { error } = await supabase.from('reviews').insert({
      author_name: name.trim(),
      author_city: city.trim() || null,
      rating,
      text: text.trim(),
      is_approved: false,
    })
    if (error) {
      setState('error')
      return
    }
    setState('done')
    setName(''); setCity(''); setRating(5); setText('')
  }

  if (state === 'done') {
    return (
      <div className="review-thanks">
        <span className="rt-ico">✓</span>
        <p>{t('formSuccess')}</p>
      </div>
    )
  }

  if (!open) {
    return (
      <div className="reviews-foot">
        <button type="button" className="btn btn-rose" onClick={() => setOpen(true)}>
          {t('leaveBtn')}
        </button>
      </div>
    )
  }

  return (
    <form className="review-form" onSubmit={submit}>
      <h3>{t('formTitle')}</h3>
      <div className="rf-row">
        <label>
          <span>{t('formName')} *</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} />
        </label>
        <label>
          <span>{t('formCity')}</span>
          <input value={city} onChange={(e) => setCity(e.target.value)} maxLength={80} />
        </label>
      </div>
      <label className="rf-rating">
        <span>{t('formRating')}</span>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>
          ))}
        </select>
      </label>
      <label>
        <span>{t('formText')} *</span>
        <textarea value={text} onChange={(e) => setText(e.target.value)} required minLength={10} maxLength={2000} rows={5} />
      </label>
      {/* honeypot — скрыт от людей */}
      <input
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />
      {state === 'error' && <p className="rf-error">{t('formError')}</p>}
      <div className="rf-actions">
        <button type="submit" className="btn btn-rose" disabled={state === 'sending'}>
          {state === 'sending' ? t('formSending') : t('formSubmit')}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
          {t('formCancel')}
        </button>
      </div>
    </form>
  )
}
