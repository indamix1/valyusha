import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getPost } from '@/lib/posts'
import type { Locale } from '@/lib/content'

const DATE_LOCALE: Record<string, string> = { ru: 'ru-RU', uk: 'uk-UA', en: 'en-US' }

type Params = Promise<{ locale: string; slug: string }>

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPost(slug, locale as Locale)
  if (!post) return { title: 'Стаття не знайдена' }
  return {
    title: `${post.title} · Valyusha`,
    description: post.excerpt ?? undefined,
  }
}

export default async function PostPage({ params }: { params: Params }) {
  const { locale, slug } = await params
  const post = await getPost(slug, locale as Locale)
  if (!post) notFound()

  const t = await getTranslations('blog')
  const dl = DATE_LOCALE[locale] ?? 'ru-RU'
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString(dl, { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <article className="post-page">
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
    </article>
  )
}
