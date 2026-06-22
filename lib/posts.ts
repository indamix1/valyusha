// lib/posts.ts — читає опубліковані статті блогу і локалізує їх.
import { createClient } from '@/lib/supabase/server'
import type { Locale } from '@/lib/content'
import type { Post } from '@/types/database'

// Накладає переклад потрібної мови (відкат на ru, якщо порожньо).
export function localizePost(post: Post, locale: Locale): Post {
  if (locale === 'ru') return post
  const t = post.translations?.[locale]
  if (!t) return post
  return {
    ...post,
    title: t.title || post.title,
    excerpt: t.excerpt || post.excerpt,
    content: t.content || post.content,
  }
}

// Опубліковані статті: новіші зверху, локалізовані.
export async function getPosts(locale: Locale): Promise<Post[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  return (data ?? []).map((row) => localizePost(row as Post, locale))
}

// Одна опублікована стаття за slug. null — якщо не знайдено/чернетка.
export async function getPost(
  slug: string,
  locale: Locale
): Promise<Post | null> {
  let normalized = slug
  try {
    normalized = decodeURIComponent(slug)
  } catch {
    // лишаємо як є
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', normalized)
    .eq('published', true)
    .maybeSingle()

  return data ? localizePost(data as Post, locale) : null
}
