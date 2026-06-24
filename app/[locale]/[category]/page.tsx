import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getSiteContent, type Locale } from '@/lib/content'
import BackLink from '@/components/BackLink'

// Білий список категорій = пунктам меню (поза цим списком -> 404).
const CATEGORIES = [
  'pro-mene',
  'ekskursii',
  'individualni',
  'kruizni',
  'transferi',
  'kontakty',
] as const
type Category = (typeof CATEGORIES)[number]

function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value)
}

type Params = Promise<{ locale: string; category: string }>

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { category } = await params
  if (!isCategory(category)) return {}
  const t = await getTranslations('categories')
  return { title: `${t(`${category}.title`)} · Valyusha` }
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { locale, category } = await params
  if (!isCategory(category)) notFound()

  const t = await getTranslations('categories')
  const cc = await getTranslations('category')
  const b = await getTranslations('brand')
  const nav = await getTranslations('nav')
  const body = t.raw(`${category}.body`) as string[]

  const c = await getSiteContent(locale as Locale)
  const phone = c.contact_phone || '+81 80 3360 5724'
  const email = c.contact_email || 'valentynaodawara@gmail.com'
  const waLink = c.contact_whatsapp || 'https://wa.me/818033605724'
  const phoneTel = `tel:${phone.replace(/[^\d+]/g, '')}`

  return (
    <>
      {(['ekskursii', 'individualni', 'kruizni', 'transferi'] as string[]).includes(category) && (
        <BackLink href="/#formats" label={nav('backToFormats')} />
      )}
      <section className="page-head">
        <div className="wrap">
          <span className="eyebrow">{b('sub')}</span>
          <h1>{t(`${category}.title`)}</h1>
        </div>
      </section>

      <section className="sec">
        <div className="wrap page-prose">
          {body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          {category === 'kontakty' && (
            <div className="contacts-card">
              <a href={phoneTel}>
                <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9V20a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.7 3a2 2 0 0 1-.5 1.9L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 1.9-.5l3 .7a2 2 0 0 1 1.8 2z" /></svg>
                {phone}
              </a>
              <a href={`mailto:${email}`}>
                <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4zM4 4l8 7 8-7" /></svg>
                {email}
              </a>
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <svg className="ico" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2z" /></svg>
                WhatsApp · Telegram · Viber
              </a>
              <a href="https://instagram.com/valentyna.japan.guide" target="_blank" rel="noopener noreferrer">
                <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg>
                @valentyna.japan.guide
              </a>
            </div>
          )}

          <div className="page-cta">
            {category !== 'kontakty' && <h3>{cc('ctaTitle')}</h3>}
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
