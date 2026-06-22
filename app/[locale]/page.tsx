import { getTranslations } from 'next-intl/server'
import { getSiteContent, type Locale } from '@/lib/content'
import { getTours } from '@/lib/tours'
import { getReviews } from '@/lib/reviews'
import { Link } from '@/i18n/navigation'
import TourGrid from '@/components/TourGrid'
import SakuraPetals from '@/components/SakuraPetals'

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
  <SakuraPetals />
  <div className="hero-eyebrow-bar">
    <span className="eyebrow">{c.hero_eyebrow}</span>
  </div>
  <div className="wrap">
    <div className="hero-grid">
      <div className="hero-content">
        <h1>{c.hero_title}</h1>
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

<section className="sec reveal" id="cats">
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

<section className="sec routes-sec reveal" id="routes">
  <div className="wrap">
    <div className="sec-title">
      <span className="eyebrow">{t('routes.eyebrow')}</span>
      <h2>{t('routes.title')}</h2>
    </div>
    <TourGrid
      tours={tours.slice(0, 4)}
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
      hideSeasons
    />
    {tours.length > 0 && (
      <div className="routes-foot"><Link href="/tury" className="btn btn-rose">{t('routes.all')}</Link></div>
    )}
  </div>
</section>

<section className="sec custom-sec reveal" id="custom">
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

<section className="sec reveal" id="bonuses">
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

<section className="sec reveal" id="about">
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
          <div className="map-wrap">
            <svg className="jp-map" viewBox="100 10 420 440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Карта Японії з маршрутами">
              <defs>
                <filter id="paper-tex">
                  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise"/>
                  <feDiffuseLighting in="noise" lightingColor="#F5E6D8" surfaceScale="1.2" result="light"><feDistantLight azimuth="45" elevation="55"/></feDiffuseLighting>
                  <feComposite in="SourceGraphic" in2="light" operator="arithmetic" k1="0.8" k2="0.3" k3="0" k4="0"/>
                </filter>
                <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <radialGradient id="land-g" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#F2DDD2"/><stop offset="100%" stopColor="#E8CCBF"/></radialGradient>
              </defs>

              {/* Тёплый фон */}
              <rect width="580" height="680" fill="#FAF3ED" rx="14"/>

              {/* Хоккайдо */}
              <path d="M385 62 C370 42 395 18 420 28 C445 38 465 55 458 78 C452 98 435 115 415 118 C395 120 378 108 370 92 C365 80 372 68 385 62Z" fill="url(#land-g)" stroke="#C9A08A" strokeWidth="1.2" filter="url(#paper-tex)" className="map-island"/>
              {/* Хонсю — более детальный контур */}
              <path d="M190 365 C178 345 170 318 178 298 C186 278 200 282 210 268 C218 255 215 238 222 222 C230 206 248 198 260 185 C270 174 268 158 282 148 C296 138 315 142 330 135 C345 128 355 112 372 108 C388 104 405 115 418 125 C428 132 435 148 430 165 C425 180 410 188 398 200 C388 212 392 228 385 245 C378 262 358 268 348 282 C338 296 345 318 335 335 C325 348 308 345 295 358 C282 370 275 392 262 398 C248 405 235 388 225 375 C215 362 200 378 190 365Z" fill="url(#land-g)" stroke="#C9A08A" strokeWidth="1.2" filter="url(#paper-tex)" className="map-island"/>
              {/* Сикоку */}
              <path d="M200 380 C215 365 242 360 258 372 C270 382 265 400 252 410 C238 418 215 415 202 402 C192 392 192 385 200 380Z" fill="url(#land-g)" stroke="#C9A08A" strokeWidth="1.2" filter="url(#paper-tex)" className="map-island"/>
              {/* Кюсю */}
              <path d="M148 375 C162 358 188 355 200 370 C210 382 205 402 192 412 C180 422 160 425 148 415 C136 405 138 388 148 375Z" fill="url(#land-g)" stroke="#C9A08A" strokeWidth="1.2" filter="url(#paper-tex)" className="map-island"/>

              {/* Декор: иероглифы 日本 */}
              <text x="485" y="580" fill="#D4B5A0" opacity="0.25" fontSize="72" fontFamily="serif" fontWeight="700">日本</text>

              {/* Декор: сакура — лепестки */}
              <g opacity="0.3" fill="#E8A0B0">
                <circle cx="120" cy="80" r="5"/><circle cx="115" cy="72" r="4"/><circle cx="127" cy="74" r="4"/>
                <circle cx="460" cy="450" r="5"/><circle cx="455" cy="442" r="4"/><circle cx="467" cy="444" r="4"/>
                <circle cx="80" cy="520" r="4"/><circle cx="76" cy="513" r="3.5"/><circle cx="86" cy="515" r="3.5"/>
                <circle cx="500" cy="180" r="4"/><circle cx="496" cy="173" r="3.5"/><circle cx="506" cy="175" r="3.5"/>
              </g>

              {/* Маршрутная линия */}
              <path d="M235 298 L295 250 L330 232 L360 218 L385 195 L400 168" fill="none" stroke="#BE6273" strokeWidth="2" strokeDasharray="6 5" opacity="0.45" className="map-route"/>

              {/* Города */}
              <g fontFamily="var(--sans)" fontSize="12.5" fontWeight="600">
                {/* Токио */}
                <circle cx="400" cy="168" r="7" fill="#BE6273" className="map-dot map-dot-1" filter="url(#glow)"/>
                <circle cx="400" cy="168" r="7" fill="transparent" stroke="#BE6273" strokeWidth="2" opacity="0.4" className="map-pulse map-pulse-1"/>
                <text x="412" y="165" fill="#5C544C" fontSize="14" fontWeight="700">{locale === 'en' ? 'Tokyo' : locale === 'uk' ? 'Токіо' : 'Токио'}</text>

                {/* Никко */}
                <circle cx="408" cy="138" r="5.5" fill="#BE6273" className="map-dot map-dot-7"/>
                <text x="420" y="136" fill="#6B5E55" fontSize="11">{locale === 'en' ? 'Nikko' : locale === 'uk' ? 'Нікко' : 'Никко'}</text>

                {/* Камакура */}
                <circle cx="395" cy="192" r="5" fill="#C97F5D" className="map-dot map-dot-2"/>
                <text x="405" y="196" fill="#8A7F75" fontSize="11">{locale === 'en' ? 'Kamakura' : 'Камакура'}</text>

                {/* Хаконе */}
                <circle cx="372" cy="205" r="5" fill="#C97F5D" className="map-dot map-dot-3"/>
                <text x="382" y="215" fill="#8A7F75" fontSize="11">{locale === 'en' ? 'Hakone' : locale === 'uk' ? 'Хаконе' : 'Хаконе'}</text>

                {/* Одавара */}
                <circle cx="378" cy="225" r="5" fill="#C97F5D" className="map-dot map-dot-5"/>
                <text x="388" y="232" fill="#8A7F75" fontSize="11">{locale === 'en' ? 'Odawara' : locale === 'uk' ? 'Одавара' : 'Одавара'}</text>

                {/* Фудзи */}
                <circle cx="355" cy="218" r="6" fill="#BE6273" className="map-dot map-dot-4"/>
                <text x="302" y="222" fill="#6B5E55" fontSize="12">{locale === 'en' ? 'Mt. Fuji' : locale === 'uk' ? 'Фудзі' : 'Фудзи'} ▲</text>

                {/* Идзу */}
                <circle cx="348" cy="278" r="5" fill="#C97F5D" className="map-dot map-dot-6"/>
                <text x="358" y="282" fill="#8A7F75" fontSize="11">{locale === 'en' ? 'Izu' : locale === 'uk' ? 'Ідзу' : 'Идзу'}</text>

                {/* Киото */}
                <circle cx="255" cy="282" r="6" fill="#BE6273" className="map-dot map-dot-8"/>
                <text x="215" y="278" fill="#6B5E55" fontSize="12">{locale === 'en' ? 'Kyoto' : locale === 'uk' ? 'Кіото' : 'Киото'}</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="sec reviews-sec reveal">
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
