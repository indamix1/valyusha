'use client'
import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { formatPrice } from '@/lib/format'
import type { Tour } from '@/types/database'

const SEASONS = ['all', 'spring', 'summer', 'autumn', 'winter'] as const

interface Props {
  tours: Tour[]
  labels: {
    from: string
    more: string
    all: string
    empty: string
    seasons: Record<string, string>
  }
}

export default function TourGrid({ tours, labels }: Props) {
  const [season, setSeason] = useState<string>('all')

  const hasSeasonal = tours.some((t) => t.seasons?.length > 0)

  const filtered =
    season === 'all'
      ? tours
      : tours.filter((t) => t.seasons?.includes(season))

  return (
    <>
      {hasSeasonal && (
        <div className="season-tabs">
          {SEASONS.map((s) => (
            <button
              key={s}
              className={`season-tab${season === s ? ' active' : ''}`}
              onClick={() => setSeason(s)}
            >
              {labels.seasons[s]}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="routes-empty">{labels.empty}</p>
      ) : (
        <div className="routes">
          {filtered.map((tour, i) => {
            const price = formatPrice(tour.price, tour.currency)
            return (
              <article className="route" key={tour.id}>
                <div
                  className={tour.cover_url ? 'route-img' : `route-img r${(i % 6) + 1}`}
                  style={
                    tour.cover_url
                      ? {
                          backgroundImage: `url(${tour.cover_url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : undefined
                  }
                >
                  {price && <span className="price">{labels.from} {price}</span>}
                </div>
                <div className="route-body">
                  <h3>{tour.title}</h3>
                  {(tour.duration || tour.participants) && (
                    <div className="route-meta">
                      {tour.duration && (
                        <span className="route-badge">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {tour.duration}
                        </span>
                      )}
                      {tour.participants && (
                        <span className="route-badge">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                          {tour.participants}
                        </span>
                      )}
                    </div>
                  )}
                  {tour.summary && <p>{tour.summary}</p>}
                  <Link href={`/tury/${tour.slug}`} className="route-link" target="_blank" rel="noopener noreferrer">
                    {labels.more}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </>
  )
}
