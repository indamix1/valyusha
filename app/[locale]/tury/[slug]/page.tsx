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
              <span>{formatLabel[tour.format] ?? formatLabel.both}</span>
            </div>
          </div>
        </div>
      </div>

      <section className="sec">
        <div className="wrap tour-grid">
          <div className="tour-main">
            {tour.summary && <p className="tour-lead">{tour.summary}</p>}

            {tour.description && (
              <div className="tour-desc">
                {tour.description
                  .split('\n')
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
              </div>
            )}

            {tour.includes.length > 0 && (
              <div className="tour-block">
                <h3>{t('includes')}</h3>
                <ul className="checklist">
                  {tour.includes.map((item, i) => (
                    <li key={i}>
                      <span className="ck">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path d="M5 12l5 5L20 6" />
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
            </div>
          </aside>
        </div>
      </section>

      {tour.gallery.length > 0 && (
        <section className="sec gallery-sec">
          <div className="wrap">
            <div className="sec-title">
              <span className="eyebrow">{t('galleryEyebrow')}</span>
              <h2>{t('galleryTitle')}</h2>
            </div>
            <div className="gallery">
              {tour.gallery.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={`${tour.title} — фото ${i + 1}`} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
