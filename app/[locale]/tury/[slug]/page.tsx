import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getTour, formatPrice } from '@/lib/tours'
import { getSiteContent, type Locale } from '@/lib/content'
import type { TourFormat } from '@/types/database'

type Params = Promise<{ locale: string; slug: string }>

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { locale, slug } = await params
  const tour = await getTour(slug, locale as Locale)
  if (!tour) return { title: 'Тур не знайдено' }
  return {
    title: `${tour.title} · Valyusha`,
    description: tour.summary ?? undefined,
  }
}

export default async function TourPage({ params }: { params: Params }) {
  const { locale, slug } = await params
  const tour = await getTour(slug, locale as Locale)
  if (!tour) notFound()

  const c = await getSiteContent(locale as Locale)
  const t = await getTranslations('tour')
  const waLink = c.contact_whatsapp || 'https://wa.me/818033605724'
  const price = formatPrice(tour.price, tour.currency)
  const formatLabel: Record<TourFormat, string> = {
    group: t('format_group'),
    individual: t('format_individual'),
    both: t('format_both'),
  }

  return (
    <article className="tour-page">
      <div
        className={tour.cover_url ? 'tour-hero' : 'tour-hero tour-hero-fallback'}
        style={
          tour.cover_url
            ? { backgroundImage: `url(${tour.cover_url})` }
            : undefined
        }
      >
        <div className="wrap">
          <Link href="/#routes" className="tour-back">
            ← {t('back')}
          </Link>
          <div className="tour-hero-inner">
            {tour.city && <span className="eyebrow">{tour.city}</span>}
            <h1>{tour.title}</h1>
            <div className="tour-meta">
              {tour.duration && <span>{tour.duration}</span>}
              {tour.participants && <span>{tour.participants}</span>}
              <span>{formatLabel[tour.format] ?? formatLabel.both}</span>
            </div>
          </div>
        </div>
      </div>

      <section className="sec">
        <div className="wrap tour-grid">
          <div className="tour-main">
            {tour.summary && <p className="tour-lead">{tour.summary}</p>}

            {tour.description && (() => {
              const blocks = tour.description.split('---').map(b => b.trim()).filter(Boolean)
              if (blocks.length > 1 && tour.gallery.length > 0) {
                return (
                  <div className="tour-stops">
                    {blocks.map((block, i) => (
                      <div key={i} className={`tour-stop ${i % 2 === 1 ? 'tour-stop-rev' : ''}`}>
                        {tour.gallery[i] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={tour.gallery[i]} alt={`${tour.title} — ${i + 1}`} className="tour-stop-img" />
                        )}
                        <div className="tour-stop-text">
                          {block.split('\n').map(p => p.trim()).filter(Boolean).map((p, j) => (
                            <p key={j}>{p}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              }
              return (
                <div className="tour-desc">
                  {blocks[0].split('\n').map(p => p.trim()).filter(Boolean).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )
            })()}

            {tour.org_details && (
              <div className="tour-block">
                <h3>{t('orgDetails')}</h3>
                <div className="tour-desc">
                  {tour.org_details
                    .split('\n')
                    .map((p) => p.trim())
                    .filter(Boolean)
                    .map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                </div>
              </div>
            )}

            {tour.includes.length > 0 && (
              <div className="tour-block">
                <h3>{t('includes')}</h3>
                <ul className="checklist">
                  {tour.includes.map((item, i) => (
                    <li key={i}>
                      <span className="ck">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 12l5 5L20 6" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tour.excludes.length > 0 && (
              <div className="tour-block">
                <h3>{t('excludes')}</h3>
                <ul className="checklist checklist-minus">
                  {tour.excludes.map((item, i) => (
                    <li key={i}>
                      <span className="ck">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 12h14" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="tour-aside">
            <div className="price-card">
              {price ? (
                <>
                  <div className="price-big">{t('from')} {price}</div>
                  {tour.price_note && (
                    <div className="price-note">{tour.price_note}</div>
                  )}
                </>
              ) : (
                <div className="price-note">{t('priceOnRequest')}</div>
              )}

              {tour.price_details && (
                <div className="price-details">{tour.price_details}</div>
              )}

              <a href={waLink} className="btn btn-rose">
                <svg className="ico" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2z" />
                </svg>
                {t('contact')}
              </a>
              <p className="price-hint">{t('contactHint')}</p>

              <div className="pay-divider" />

              <a
                href="https://paypal.me/PLACEHOLDER"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-paypal"
              >
                <svg className="ico" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.02 21.5 8 16h2.2c4.82 0 7.72-3.28 8.38-7.5.18-1.17.08-2.2-.42-3A3.45 3.45 0 0 0 16.5 4H9.02a1 1 0 0 0-1 .85L5.5 20.65a.6.6 0 0 0 .6.7h.92zm2.55-8.5L10.8 6h5.2c.76 0 1.26.38 1.4 1.1-.56 3.32-2.84 5.9-6.83 5.9z" />
                </svg>
                {t('payOnline')}
              </a>
              <p className="price-hint">{t('payHint')}</p>
            </div>
          </aside>
        </div>
      </section>

      {(() => {
        const stopCount = tour.description?.includes('---')
          ? tour.description.split('---').filter(b => b.trim()).length
          : 0
        const remaining = tour.gallery.slice(stopCount)
        if (remaining.length === 0) return null
        return (
          <section className="sec gallery-sec">
            <div className="wrap">
              <div className="sec-title">
                <span className="eyebrow">{t('galleryEyebrow')}</span>
                <h2>{t('galleryTitle')}</h2>
              </div>
              <div className="gallery">
                {remaining.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={src} alt={`${tour.title} — фото ${stopCount + i + 1}`} />
                ))}
              </div>
            </div>
          </section>
        )
      })()}
    </article>
  )
}
