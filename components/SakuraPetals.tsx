'use client'
import { useEffect, useRef } from 'react'

const PETAL_COUNT = 18

export default function SakuraPetals() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    for (let i = 0; i < PETAL_COUNT; i++) {
      const p = document.createElement('span')
      p.className = 'petal'
      const size = 14 + Math.random() * 18
      const left = Math.random() * 100
      const delay = Math.random() * 4
      const dur = 7 + Math.random() * 5
      p.style.cssText = `
        left:${left}%;
        width:${size}px;height:${size}px;
        animation:petal-fall ${dur}s ${delay}s linear infinite;
        opacity:${0.6 + Math.random() * 0.35};
      `
      el.appendChild(p)
    }
    return () => { el.innerHTML = '' }
  }, [])

  return <div className="sakura-layer" ref={ref} />
}
