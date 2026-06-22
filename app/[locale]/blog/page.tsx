import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getPosts } from '@/lib/posts'
import type { Locale } from '@/lib/content'

const DATE_LOCALE: Record<string, string> = { ru: 'ru-RU', uk: 'uk-UA', en: 'en-US' }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  return { title: `${t('title')} · Valyusha` }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const posts = await getPosts(locale as Locale)
  const t = await getTranslations('blog')
  const dl = DATE_LOCALE[locale] ?? 'ru-RU'
  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString(dl, { day: 'numeric', month: 'long', year: 'numeric' }) : ''

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1>{t('title')}</h1>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          {posts.length === 0 ? (
            <p className="routes-empty">{t('empty')}</p>
          ) : (
            <div className="blog-grid">
              {posts.map((p) => (
                <article className="blog-card" key={p.id}>
                  <Link href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer">
                    <div
                      className={p.cover_url ? 'blog-cover' : 'blog-cover blog-cover-fallback'}
                      style={p.cover_url ? { backgroundImage: `url(${p.cover_url})` } : undefined}
                    />
                    <div className="blog-card-body">
                      {p.published_at && <span className="blog-date">{fmt(p.published_at)}</span>}
                      <h3>{p.title}</h3>
                      {p.excerpt && <p>{p.excerpt}</p>}
                      <span className="route-link">{t('readMore')}</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
