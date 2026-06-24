// components/BackLink.tsx — липкий бар со стрелкой возврата (единый формат для всех страниц).
import { Link } from '@/i18n/navigation'

export default function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="back-bar">
      <div className="wrap">
        <Link href={href} className="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>{label}</span>
        </Link>
      </div>
    </div>
  )
}
