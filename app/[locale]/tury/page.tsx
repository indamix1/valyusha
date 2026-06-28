import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getTours } from '@/lib/tours'
import type { Locale } from '@/lib/content'
import TourGrid from '@/components/TourGrid'
import BackLink from '@/components/BackLink'
import { canonicalUrl, languageAlternates } from '@/lib/site'

type Params = Promise<{ locale: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'toursPage' })
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: { canonical: canonicalUrl(locale, '/tury'), languages: languageAlternates('/tury') },
  }
}

export default async function ToursPage({ params }: { params: Params }) {
  const { locale } = await params
  const tours = await getTours(locale as Locale)
  const t = await getTranslations('toursPage')
  const rt = await getTranslations('routes')
  const nav = await getTranslations('nav')

  return (
    <>
      <BackLink href="/#formats" label={nav('backToFormats')} />
      <section className="page-head">
        <div className="wrap">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1>{t('title')}</h1>
          <p className="page-lead">{t('subtitle')}</p>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <TourGrid
            tours={tours}
            labels={{
              from: rt('from'),
              more: rt('more'),
              all: rt('all'),
              empty: rt('empty'),
              seasons: {
                all: rt('seasonAll'),
                spring: rt('seasonSpring'),
                summer: rt('seasonSummer'),
                autumn: rt('seasonAutumn'),
                winter: rt('seasonWinter'),
              },
            }}
          />
        </div>
      </section>
    </>
  )
}
