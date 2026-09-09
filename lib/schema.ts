// lib/schema.ts — генераторы schema.org (JSON-LD) для страниц сайта.
import { SITE_URL, SITE_NAME, canonicalUrl } from '@/lib/site'
import type { Tour, Post } from '@/types/database'

// Хлебные крошки: [{ name, path }] (path без локали; '' = главная).
export function breadcrumbs(locale: string, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: canonicalUrl(locale, it.path),
    })),
  }
}

// Тур как туристический продукт с ценой «от».
export function tourSchema(locale: string, tour: Tour) {
  const url = canonicalUrl(locale, `/tury/${tour.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.summary ?? tour.description ?? undefined,
    url,
    image: tour.cover_url ?? `${SITE_URL}/og.jpg`,
    touristType: tour.format === 'group' ? 'group' : 'individual',
    ...(tour.city ? { itinerary: { '@type': 'Place', name: tour.city } } : {}),
    provider: { '@type': 'TravelAgency', name: SITE_NAME, url: SITE_URL },
    ...(tour.price != null
      ? {
          offers: {
            '@type': 'Offer',
            url,
            price: tour.price,
            priceCurrency: tour.currency || 'USD',
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  }
}

// Статья блога.
export function postSchema(locale: string, post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_url ?? `${SITE_URL}/og.jpg`,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.published_at ?? post.created_at,
    inLanguage: locale,
    mainEntityOfPage: canonicalUrl(locale, `/blog/${post.slug}`),
    author: { '@type': 'Person', name: 'Валентина Ямазаки' },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
  }
}
