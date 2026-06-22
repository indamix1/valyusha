import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { getTour, formatPrice } from '@/lib/tours'
import { getSiteContent, type Locale } from '@/lib/content'

// Підписи формату туру (інтерфейс поки укр.; винесення в i18n — окремий пункт).
const FORMAT_LABEL: Record<string, string> = {
  group: 'Груповий тур',
  individual: 'Індивідуальний тур',
  both: 'Груповий / індивідуальний',
}

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
  const waLink = c.contact_whatsapp || 'https://wa.me/818033605724'
  const price = formatPrice(tour.price, tour.currency)

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
            ← Усі маршрути
          </Link>
          <div className="tour-hero-inner">
            {tour.city && <span className="eyebrow">{tour.city}</span>}
            <h1>{tour.title}</h1>
            <div className="tour-meta">
              {tour.duration && <span>{tour.duration}</span>}
              <span>{FORMAT_LABEL[tour.format] ?? FORMAT_LABEL.both}</span>
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
                <h3>Що включено</h3>
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
                  <div className="price-big">від {price}</div>
                  {tour.price_note && (
                    <div className="price-note">{tour.price_note}</div>
                  )}
                </>
              ) : (
                <div className="price-note">Вартість — за запитом</div>
              )}

              {tour.price_details && (
                <div className="price-details">{tour.price_details}</div>
              )}

              <a href={waLink} className="btn btn-rose">
                <svg className="ico" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2z" />
                </svg>
                Звʼязатися
              </a>
              <p className="price-hint">Відповім у WhatsApp / Telegram</p>
            </div>
          </aside>
        </div>
      </section>

      {tour.gallery.length > 0 && (
        <section className="sec gallery-sec">
          <div className="wrap">
            <div className="sec-title">
              <span className="eyebrow">Фото</span>
              <h2>Галерея</h2>
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
