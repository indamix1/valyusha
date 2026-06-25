'use client'
// components/ReviewCard.tsx — карточка отзыва со сворачиванием длинного текста.
import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function ReviewCard({
  name,
  city,
  rating,
  text,
}: {
  name: string
  city: string | null
  rating: number
  text: string
}) {
  const t = useTranslations('reviews')
  const [open, setOpen] = useState(false)
  const long = text.length > 240
  const stars = '★'.repeat(Math.max(1, Math.min(5, rating)))

  return (
    <div className="review">
      <div className="review-head">
        <span className="avatar"></span>
        <div>
          <b>{name}</b>
          {city && <span>{city}</span>}
        </div>
      </div>
      <div className="stars">{stars}</div>
      <p className={long && !open ? 'review-text clamped' : 'review-text'}>{text}</p>
      {long && (
        <button type="button" className="review-more" onClick={() => setOpen((v) => !v)}>
          {open ? t('collapse') : t('readFull')}
        </button>
      )}
    </div>
  )
}
