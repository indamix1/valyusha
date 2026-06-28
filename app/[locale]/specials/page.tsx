import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getSiteContent, type Locale } from '@/lib/content'

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
  const ct = await getTranslations('custom')
  const waLink = c.contact_whatsapp || 'https://wa.me/818033605724'

  const items = (c.specials || ct('specials'))
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

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
          <div className="specials-tags">
            {items.map((item) => (
              <span className="specials-tag" key={item}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 5 5.6.5-4.3 3.7 1.3 5.4L12 19l-5 2.6 1.3-5.4L4 12.5l5.6-.5z" /></svg>
                {item}
              </span>
            ))}
          </div>

          <div className="page-cta" style={{ textAlign: 'center', marginTop: 40 }}>
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
