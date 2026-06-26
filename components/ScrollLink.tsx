'use client'
// components/ScrollLink.tsx — якорная ссылка с гарантированно плавным скроллом
// (через JS, поэтому работает даже при системном «уменьшении движения»).
export default function ScrollLink({
  targetId,
  className,
  children,
}: {
  targetId: string
  className?: string
  children: React.ReactNode
}) {
  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = document.getElementById(targetId)
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', `#${targetId}`)
  }
  return (
    <a href={`#${targetId}`} className={className} onClick={onClick}>
      {children}
    </a>
  )
}
