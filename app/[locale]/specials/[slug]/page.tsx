import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getSiteContent, type Locale } from '@/lib/content'
import { getSpecial } from '@/lib/specials'
import BackLink from '@/components/BackLink'
import Gallery from '@/components/Gallery'
import { canonicalUrl, languageAlternates } from '@/lib/site'

type Params = Promise<{ locale: string; slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params
  const s = await getSpecial(slug, locale as Locale)
  if (!s) return { title: 'Маршрут не найден' }
  const path = `/specials/${slug}`
  return {
    title: s.title,
    description: s.description ?? undefined,
    alternates: { canonical: canonicalUrl(locale, path), languages: languageAlternates(path) },
    openGraph: { title: s.title, description: s.description ?? undefined, url: canonicalUrl(locale, path), images: s.cover_url ? [s.cover_url] : undefined },
  }
}

export default async function SpecialPage({ params }: { params: Params }) {
  const { locale, slug } = await params
  const s = await getSpecial(slug, locale as Locale)
  if (!s) notFound()

  const c = await getSiteContent(locale as Locale)
  const t = await getTranslations('specials')
  const cc = await getTranslations('category')
  const tour = await getTranslations('tour')
  const waLink = c.contact_whatsapp || 'https://wa.me/818033605724'

  return (
    <article className="tour-page">
      <BackLink href="/specials" label={t('title')} />

      <section className="page-head">
        <div className="wrap">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1>{s.title}</h1>
        </div>
      </section>

      <section className="sec">
        <div className="wrap page-prose">
          {s.description
            ? s.description.split('\n').map((p) => p.trim()).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)
            : null}

          <div className="page-cta" style={{ marginTop: 32 }}>
            <h3>{cc('ctaTitle')}</h3>
            <a href={waLink} className="btn btn-rose" target="_blank" rel="noopener noreferrer">
              <svg className="ico" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2z" /></svg>
              {cc('ctaButton')}
            </a>
          </div>
        </div>
      </section>

      {s.gallery.length > 0 && (
        <section className="sec gallery-sec">
          <div className="wrap">
            <div className="sec-title">
              <span className="eyebrow">{tour('galleryEyebrow')}</span>
              <h2>{tour('galleryTitle')}</h2>
            </div>
            <Gallery images={s.gallery} start={0} alt={s.title} />
          </div>
        </section>
      )}
    </article>
  )
}
