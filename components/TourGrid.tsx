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
  hideSeasons?: boolean
  limit?: number
}

export default function TourGrid({ tours, labels, hideSeasons, limit }: Props) {
  const [season, setSeason] = useState<string>('all')

  const hasSeasonal = tours.some((t) => t.seasons?.length > 0)

  const filtered = (
    season === 'all'
      ? tours
      : tours.filter((t) => t.seasons?.includes(season))
  ).slice(0, limit ?? undefined)

  return (
    <>
      {hasSeasonal && !hideSeasons && (
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
              <Link href={`/tury/${tour.slug}`} className="route-link-wrap" key={tour.id}>
                <article className="route">
                  <div className="route-visual">
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
                    <div className="route-hover">
                      {price && <div className="route-hover-price">{labels.from} {price}</div>}
                      {tour.summary && <p className="route-hover-summary">{tour.summary}</p>}
                      {tour.includes.length > 0 && (
                        <ul className="route-hover-list">
                          {tour.includes.slice(0, 3).map((item, j) => (
                            <li key={j}>✓ {item}</li>
                          ))}
                          {tour.includes.length > 3 && (
                            <li className="route-hover-more">+{tour.includes.length - 3} ещё</li>
                          )}
                        </ul>
                      )}
                      {(tour.duration || tour.participants) && (
                        <div className="route-hover-meta">
                          {tour.duration && <span>⏱ {tour.duration}</span>}
                          {tour.participants && <span>👥 {tour.participants}</span>}
                        </div>
                      )}
                      <span className="route-hover-cta">{labels.more}</span>
                    </div>
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
                    <span className="route-link">{labels.more}</span>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
