// lib/pexels.ts — авто-подбор фото со стока Pexels по текстовому запросу.
// Используется только когда у точки маршрута нет загруженного image_url.
// Нет ключа PEXELS_API_KEY -> функция тихо возвращает null (используется заглушка).

export async function getPexelsImage(query: string): Promise<string | null> {
  const key = process.env.PEXELS_API_KEY
  if (!key || !query?.trim()) return null
  try {
    const url =
      'https://api.pexels.com/v1/search?per_page=1&orientation=landscape&query=' +
      encodeURIComponent(query.trim())
    const res = await fetch(url, {
      headers: { Authorization: key },
      // кэшируем на неделю, чтобы не дёргать API на каждый рендер
      next: { revalidate: 60 * 60 * 24 * 7 },
    })
    if (!res.ok) return null
    const data = (await res.json()) as {
      photos?: { src?: { large?: string; medium?: string } }[]
    }
    const photo = data.photos?.[0]
    return photo?.src?.large || photo?.src?.medium || null
  } catch {
    return null
  }
}
