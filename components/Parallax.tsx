'use client'

import { useEffect } from 'react'

export default function Parallax() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('.hero')
    if (!hero) return

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        hero.style.backgroundPositionY = `calc(20% + ${y * 0.35}px)`
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return null
}
