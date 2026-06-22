'use client'
// components/Header.tsx — спільна шапка з перемикачем мов.
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'

const navItems = [
  { href: '/', key: 'home' },
  { href: '/pro-mene', key: 'about' },
  { href: '/ekskursii', key: 'excursions' },
  { href: '/individualni', key: 'individual' },
  { href: '/kruizni', key: 'cruise' },
  { href: '/transferi', key: 'transfers' },
  { href: '/kontakty', key: 'contacts' },
] as const

const locales = [
  { code: 'ru', label: 'RU' },
  { code: 'uk', label: 'UA' },
  { code: 'en', label: 'EN' },
] as const

export default function Header() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()
  const activeLocale = useLocale()
  const [open, setOpen] = useState(false)

  function switchLocale(code: string) {
    router.replace(pathname, { locale: code })
    setOpen(false)
  }

  return (
    <header>
      <div className="wrap nav">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="name">Valyusha</span>
          <span className="sub">Гід в Японії</span>
        </Link>

        <nav className={open ? 'nav-links open' : 'nav-links'}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="nav-right">
          <span className="lang">
            {locales.map((l, i) => (
              <span key={l.code}>
                <button
                  type="button"
                  onClick={() => switchLocale(l.code)}
                  className={l.code === activeLocale ? 'lang-btn active' : 'lang-btn'}
                >
                  {l.label}
                </button>
                {i < locales.length - 1 && <span className="lang-sep"> · </span>}
              </span>
            ))}
          </span>
          <a href="https://wa.me/818033605724" className="circle-ico" aria-label="WhatsApp">
            <svg className="ico" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5 0a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2l-.1-.5-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.6 11.6 0 0 0 4.5 3.9c1.6.7 1.9.6 2.3.5a2.5 2.5 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.1-.2-.2-.4-.3z" /></svg>
          </a>
        </div>

        <button className="burger" aria-label="Меню" onClick={() => setOpen(!open)}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>
      </div>

      <style jsx>{`
        .lang-btn {
          background: none;
          border: none;
          cursor: pointer;
          font: inherit;
          font-weight: 700;
          color: var(--muted);
          padding: 2px 3px;
        }
        .lang-btn.active {
          color: var(--ink);
        }
        .lang-sep {
          color: var(--muted);
        }
        @media (max-width: 980px) {
          .nav-links {
            display: none;
          }
          .nav-links.open {
            display: flex;
            position: absolute;
            top: 80px;
            left: 0;
            right: 0;
            flex-direction: column;
            background: var(--paper);
            padding: 22px 32px;
            border-bottom: 1px solid var(--line);
            gap: 18px;
            z-index: 60;
          }
        }
      `}</style>
    </header>
  )
}
