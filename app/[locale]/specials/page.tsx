import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getSiteContent, type Locale } from '@/lib/content'
import { getSpecials } from '@/lib/specials'
import { Link } from '@/i18n/navigation'

type Params = Promise<{ locale: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'specials' })
  return { title: `${t('title')} · Valentina Japan Guide`, description: t('intro') }
}

export default async function SpecialsPage({ params }: { params: Params }) {
  const { locale } = await params
  const c = await getSiteContent(locale as Locale)
  const t = await getTranslations('specials')
  const cc = await getTranslations('category')
  const specials = await getSpecials(locale as Locale)
  const waLink = c.contact_whatsapp || 'https://wa.me/818033605724'

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1>{t('title')}</h1>
          <p className="page-lead">{t('intro')}</p>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          {specials.length > 0 && (
            <div className="spec-cards">
              {specials.map((s, i) => (
                <Link href={`/specials/${s.slug}`} className="spec-card" key={s.id}>
                  <div
                    className={s.cover_url ? 'spec-card-img' : `spec-card-img r${(i % 6) + 1}`}
                    style={s.cover_url ? { backgroundImage: `url(${s.cover_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                  />
                  <div className="spec-card-body">
                    <h3>{s.title}</h3>
                    {s.description && <p>{s.description}</p>}
                    <span className="route-link">{t('more')}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="page-cta" style={{ textAlign: 'center', marginTop: 44 }}>
            <h3>{cc('ctaTitle')}</h3>
            <a href={waLink} className="btn btn-rose" target="_blank" rel="noopener noreferrer">
              <svg className="ico" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2z" /></svg>
              {cc('ctaButton')}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
