import { getTranslations } from 'next-intl/server'
import { getSiteContent, type Locale } from '@/lib/content'
import { getTours, formatPrice } from '@/lib/tours'
import { Link } from '@/i18n/navigation'

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const c = await getSiteContent(locale as Locale)
  const tours = await getTours(locale as Locale)
  const t = await getTranslations()
  return (
    <>
<section className="hero">
  <div className="wrap">
    <div className="hero-grid">
      <div className="hero-content">
        <span className="eyebrow">{c.hero_eyebrow}</span>
        <h1 style={{ marginTop: '14px' }}>{c.hero_title}</h1>
        <p className="lead">{c.hero_subtitle}</p>
        <div className="hero-cta">
          <a href="#routes" className="btn btn-dark">{t('hero.ctaPrimary')}</a>
          <a href="https://wa.me/818033605724" className="btn btn-ghost"><svg className="ico" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2z"/></svg>{t('hero.ctaSecondary')}</a>
        </div>
      </div>
      <div className="hero-figure" role="img" aria-label="Валентина Ямазакі — гід в Японії"></div>
    </div>
  </div>
  <div className="trust">
    <div className="wrap">
      <div className="trust-grid">
        <div className="trust-item">
          <span className="ti-ico"><svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 5 5.6.5-4.3 3.7 1.3 5.4L12 19l-5 2.6 1.3-5.4L4 12.5l5.6-.5z"/></svg></span>
          <div><h4>{t('trust.licensed_t')}</h4><p>{t('trust.licensed_d')}</p></div>
        </div>
        <div className="trust-item">
          <span className="ti-ico"><svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></span>
          <div><h4>{t('trust.individual_t')}</h4><p>{t('trust.individual_d')}</p></div>
        </div>
        <div className="trust-item">
          <span className="ti-ico"><svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l8 4v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6z"/></svg></span>
          <div><h4>{t('trust.comfort_t')}</h4><p>{t('trust.comfort_d')}</p></div>
        </div>
        <div className="trust-item">
          <span className="ti-ico"><svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20M4 6h16M4 18h16"/></svg></span>
          <div><h4>{t('trust.lang_t')}</h4><p>{t('trust.lang_d')}</p></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="sec" id="cats">
  <div className="wrap">
    <div className="sec-title">
      <span className="eyebrow">{t('cats.eyebrow')}</span>
      <h2>{t('cats.title')}</h2>
    </div>
    <div className="cats">
      <div className="cat">
        <span className="c-ico"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6"/></svg></span>
        <h3>{t('cats.excursions_t')}</h3><p>{t('cats.excursions_d')}</p>
      </div>
      <div className="cat">
        <span className="c-ico"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg></span>
        <h3>{t('cats.individual_t')}</h3><p>{t('cats.individual_d')}</p>
      </div>
      <div className="cat">
        <span className="c-ico"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 16l2-5h16l2 5M4 16c2 2 4 2 6 0s4-2 6 0 4 2 4 0M12 3v8M9 6h6"/></svg></span>
        <h3>{t('cats.cruise_t')}</h3><p>{t('cats.cruise_d')}</p>
      </div>
      <div className="cat">
        <span className="c-ico"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 17a2 2 0 1 0 0-.1M17 17a2 2 0 1 0 0-.1M3 17V8l2-4h10l3 4h2a1 1 0 0 1 1 1v8h-2M7 17h8"/></svg></span>
        <h3>{t('cats.transfers_t')}</h3><p>{t('cats.transfers_d')}</p>
      </div>
    </div>
  </div>
</section>

<section className="sec routes-sec" id="routes">
  <div className="wrap">
    <div className="sec-title">
      <span className="eyebrow">{t('routes.eyebrow')}</span>
      <h2>{t('routes.title')}</h2>
    </div>
    {tours.length === 0 ? (
      <p className="routes-empty">{t('routes.empty')}</p>
    ) : (
      <div className="routes">
        {tours.map((tour, i) => {
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
                {price && <span className="price">{t('routes.from')} {price}</span>}
              </div>
              <div className="route-body">
                <h3>{tour.title}</h3>
                {tour.summary && <p>{tour.summary}</p>}
                <Link href={`/tury/${tour.slug}`} className="route-link">
                  {t('routes.more')}
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    )}
    {tours.length > 0 && (
      <div className="routes-foot"><a href="#" className="btn btn-rose">{t('routes.all')}</a></div>
    )}
  </div>
</section>

<section className="sec" id="about">
  <div className="wrap">
    <div className="about-grid about">
      <div className="about-photo"></div>
      <div>
        <span className="eyebrow">{t('about.eyebrow')}</span>
        <h2 style={{ marginTop: '12px' }}>{c.about_title}</h2>
        <ul className="checklist">
          <li><span className="ck"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 6"/></svg></span>{t('about.point1')}</li>
          <li><span className="ck"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 6"/></svg></span>{t('about.point2')}</li>
          <li><span className="ck"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 6"/></svg></span>{t('about.point3')}</li>
          <li><span className="ck"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 6"/></svg></span>{t('about.point4')}</li>
        </ul>
        <a href="#foot" className="btn btn-dark">{t('about.cta')}</a>

        <div className="map-card">
          <h4>{t('about.mapTitle')}</h4>
          <svg className="jp-map" viewBox="0 0 420 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Карта Японії з маршрутами">
            <path d="M70 175 C60 150 78 140 92 150 C100 120 130 118 138 138 C150 120 178 128 182 148 C210 130 240 150 250 130 C268 95 300 80 322 92 C348 106 352 70 332 55 C352 48 372 62 366 84 C360 108 338 128 312 138 C300 165 270 172 252 162 C236 188 200 190 184 172 C168 196 128 198 108 182 C96 196 76 192 70 175 Z"
              fill="#F6DDE2" stroke="#D98494" strokeWidth="2"/>
            <g fontFamily="Nunito Sans, sans-serif" fontSize="11" fontWeight="700">
              <circle cx="262" cy="150" r="4.5" fill="#BE6273"/><text x="214" y="166" fill="#5C544C">Шимідзу</text>
              <circle cx="300" cy="120" r="4.5" fill="#BE6273"/><text x="308" y="124" fill="#5C544C">Токіо</text>
              <circle cx="296" cy="134" r="4" fill="#C97F5D"/><text x="270" y="150" fill="#8A7F75" fontSize="10">Камакура</text>
              <circle cx="280" cy="128" r="4" fill="#C97F5D"/><text x="246" y="120" fill="#8A7F75" fontSize="10">Хаконе</text>
              <circle cx="268" cy="134" r="4.5" fill="#BE6273"/><text x="214" y="138" fill="#5C544C">Фудзі</text>
              <circle cx="196" cy="150" r="4.5" fill="#BE6273"/><text x="150" y="154" fill="#5C544C">Кіото</text>
            </g>
            <path d="M196 150 L262 150 L268 134 L280 128 L296 134 L300 120" fill="none" stroke="#BE6273" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.7"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="sec reviews-sec">
  <div className="wrap">
    <div className="sec-title">
      <span className="eyebrow">{t('reviews.eyebrow')}</span>
      <h2>{t('reviews.title')}</h2>
    </div>
    <div className="reviews">
      <div className="review">
        <div className="review-head"><span className="avatar"></span><div><b>{t('reviews.r1_name')}</b><span>{t('reviews.r1_city')}</span></div></div>
        <div className="stars">★★★★★</div>
        <p>{t('reviews.r1_text')}</p>
      </div>
      <div className="review">
        <div className="review-head"><span className="avatar"></span><div><b>{t('reviews.r2_name')}</b><span>{t('reviews.r2_city')}</span></div></div>
        <div className="stars">★★★★★</div>
        <p>{t('reviews.r2_text')}</p>
      </div>
      <div className="review">
        <div className="review-head"><span className="avatar"></span><div><b>{t('reviews.r3_name')}</b><span>{t('reviews.r3_city')}</span></div></div>
        <div className="stars">★★★★★</div>
        <p>{t('reviews.r3_text')}</p>
      </div>
    </div>
    <div className="reviews-foot"><a href="#" className="btn btn-ghost">{t('reviews.more')}</a></div>
  </div>
</section>
    </>
  )
}
