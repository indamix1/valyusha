import { getTranslations } from 'next-intl/server'
import { getSiteContent, type Locale } from '@/lib/content'
import { getTours } from '@/lib/tours'
import { getReviews } from '@/lib/reviews'
import { Link } from '@/i18n/navigation'
import TourGrid from '@/components/TourGrid'

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const c = await getSiteContent(locale as Locale)
  const tours = await getTours(locale as Locale)
  const dbReviews = await getReviews(locale as Locale)
  const t = await getTranslations()

  // Відгуки: з БД, якщо є; інакше демо з перекладів (щоб секція не була порожня).
  const reviews = dbReviews.length
    ? dbReviews.map((r) => ({
        id: r.id,
        author_name: r.author_name,
        author_city: r.author_city,
        rating: r.rating,
        text: r.text,
      }))
    : [1, 2, 3].map((n) => ({
        id: `demo-${n}`,
        author_name: t(`reviews.r${n}_name`),
        author_city: t(`reviews.r${n}_city`),
        rating: 5,
        text: t(`reviews.r${n}_text`),
      }))
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
    <TourGrid
      tours={tours}
      labels={{
        from: t('routes.from'),
        more: t('routes.more'),
        all: t('routes.all'),
        empty: t('routes.empty'),
        seasons: {
          all: t('routes.seasonAll'),
          spring: t('routes.seasonSpring'),
          summer: t('routes.seasonSummer'),
          autumn: t('routes.seasonAutumn'),
          winter: t('routes.seasonWinter'),
        },
      }}
    />
    {tours.length > 0 && (
      <div className="routes-foot"><a href="#" className="btn btn-rose">{t('routes.all')}</a></div>
    )}
  </div>
</section>

<section className="sec custom-sec" id="custom">
  <div className="wrap">
    <div className="sec-title">
      <span className="eyebrow">{t('custom.eyebrow')}</span>
      <h2>{t('custom.title')}</h2>
    </div>
    <div className="custom-grid">
      <div className="custom-text">
        <p>{t('custom.desc1')}</p>
        <p>{t('custom.desc2')}</p>
        <a href="https://wa.me/818033605724" className="btn btn-dark">
          <svg className="ico" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2z"/></svg>
          {t('custom.cta')}
        </a>
      </div>
      <div>
        <h4 style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
          {t('custom.citiesTitle')}
        </h4>
        <div className="city-tags">
          {t('custom.cities').split(', ').map((city) => (
            <span className="city-tag" key={city}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {city}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

<section className="sec" id="bonuses">
  <div className="wrap">
    <div className="sec-title">
      <span className="eyebrow">{t('bonuses.eyebrow')}</span>
      <h2>{t('bonuses.title')}</h2>
    </div>
    <div className="bonuses">
      <div className="bonus">
        <div className="bonus-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8a6 6 0 0 1-6 6M6 8a6 6 0 0 0 6 6M12 14v4M8 18h8M6 8h12"/></svg></div>
        <h3>{t('bonuses.tea_t')}</h3>
        <p>{t('bonuses.tea_d')}</p>
      </div>
      <div className="bonus">
        <div className="bonus-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 20L20 4M4 20l4-2 10-10-2-2L6 16z"/><path d="M14.5 5.5l2 2"/></svg></div>
        <h3>{t('bonuses.calligraphy_t')}</h3>
        <p>{t('bonuses.calligraphy_d')}</p>
      </div>
      <div className="bonus">
        <div className="bonus-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3C7 8 4 12 4 15a8 8 0 0 0 16 0c0-3-3-7-8-12z"/></svg></div>
        <h3>{t('bonuses.cooking_t')}</h3>
        <p>{t('bonuses.cooking_d')}</p>
      </div>
      <div className="bonus">
        <div className="bonus-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2a4 4 0 0 0-4 4v4h8V6a4 4 0 0 0-4-4zM4 14h16l-2 8H6z"/></svg></div>
        <h3>{t('bonuses.kimono_t')}</h3>
        <p>{t('bonuses.kimono_d')}</p>
      </div>
      <div className="bonus">
        <div className="bonus-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
        <h3>{t('bonuses.drift_t')}</h3>
        <p>{t('bonuses.drift_d')}</p>
      </div>
      <div className="bonus">
        <div className="bonus-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 12c2-4 6-8 10-8s8 4 10 8c-2 4-6 8-10 8s-8-4-10-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
        <h3>{t('bonuses.onsen_t')}</h3>
        <p>{t('bonuses.onsen_d')}</p>
      </div>
    </div>
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
      {reviews.map((r) => (
        <div className="review" key={r.id}>
          <div className="review-head"><span className="avatar"></span><div><b>{r.author_name}</b>{r.author_city && <span>{r.author_city}</span>}</div></div>
          <div className="stars">{'★'.repeat(Math.max(1, Math.min(5, r.rating)))}</div>
          <p>{r.text}</p>
        </div>
      ))}
    </div>
  </div>
</section>
    </>
  )
}
