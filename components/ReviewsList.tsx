'use client'
// components/ReviewsList.tsx — сетка отзывов: по умолчанию 3, остальные по кнопке.
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import ReviewCard from '@/components/ReviewCard'

interface Item {
  id: string
  author_name: string
  author_city: string | null
  rating: number
  text: string
}

export default function ReviewsList({ reviews }: { reviews: Item[] }) {
  const t = useTranslations('reviews')
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? reviews : reviews.slice(0, 3)

  return (
    <>
      <div className="reviews">
        {visible.map((r) => (
          <ReviewCard key={r.id} name={r.author_name} city={r.author_city} rating={r.rating} text={r.text} />
        ))}
      </div>
      {reviews.length > 3 && (
        <div className="reviews-foot">
          <button type="button" className="btn btn-ghost" onClick={() => setShowAll((v) => !v)}>
            {showAll ? t('showLess') : `${t('showAll')} (${reviews.length})`}
          </button>
        </div>
      )}
    </>
  )
}
