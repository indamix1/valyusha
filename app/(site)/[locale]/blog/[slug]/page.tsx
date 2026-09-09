import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getPost } from '@/lib/posts'
import type { Locale } from '@/lib/content'
import Gallery from '@/components/Gallery'
import { canonicalUrl, languageAlternates, ogBase, metaDescription } from '@/lib/site'
import { postSchema, breadcrumbs } from '@/lib/schema'
import JsonLd from '@/components/JsonLd'

// Кеш сторінки: перегенерація не частіше ніж раз на 5 хв (плюс скидання з адмінки).
export const revalidate = 300


const DATE_LOCALE: Record<string, string> = { ru: 'ru-RU', uk: 'uk-UA', en: 'en-US' }

type Params = Promise<{ locale: string; slug: string }>

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const post = await getPost(slug, locale as Locale)
  if (!post) return { title: 'Статья не найдена', robots: { index: false } }
  const path = `/blog/${slug}`
  const description = metaDescription(post.excerpt ?? post.content)
  return {
    title: post.title,
    description,
    alternates: { canonical: canonicalUrl(locale, path), languages: languageAlternates(path) },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      ...ogBase(locale, path, post.cover_url),
    },
  }
}

export default async function PostPage({ params }: { params: Params }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const post = await getPost(slug, locale as Locale)
  if (!post) notFound()

  const t = await getTranslations('blog')
  const tour = await getTranslations('tour')
  const dl = DATE_LOCALE[locale] ?? 'ru-RU'
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString(dl, { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  const nav = await getTranslations('nav')
  return (
    <article className="post-page">
      <JsonLd
        data={[
          postSchema(locale, post),
          breadcrumbs(locale, [
            { name: nav('home'), path: '' },
            { name: t('title'), path: '/blog' },
            { name: post.title, path: `/blog/${slug}` },
          ]),
        ]}
      />
      <div
        className={post.cover_url ? 'tour-hero' : 'tour-hero tour-hero-fallback'}
        style={post.cover_url ? { backgroundImage: `url(${post.cover_url})` } : undefined}
      >
        <div className="wrap">
          <Link href="/blog" className="tour-back">
            ← {t('back')}
          </Link>
          <div className="tour-hero-inner">
            {date && <span className="eyebrow">{date}</span>}
            <h1>{post.title}</h1>
          </div>
        </div>
      </div>

      <section className="sec">
        <div className="wrap page-prose">
          {post.excerpt && <p className="tour-lead">{post.excerpt}</p>}
          {post.content
            ?.split('\n')
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p, i) => (
              <p key={i}>{p}</p>
            ))}
        </div>
      </section>

      {post.gallery.length > 0 && (
        <section className="sec gallery-sec">
          <div className="wrap">
            <div className="sec-title">
              <span className="eyebrow">{tour('galleryEyebrow')}</span>
              <h2>{tour('galleryTitle')}</h2>
            </div>
            <Gallery images={post.gallery} start={0} alt={post.title} />
          </div>
        </section>
      )}
    </article>
  )
}
