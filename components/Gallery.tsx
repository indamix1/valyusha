'use client'
// components/Gallery.tsx — сетка фото + лайтбокс с листанием (клик, стрелки, свайп).
import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function Gallery({
  images,
  start = 0,
  alt,
}: {
  images: string[]
  start?: number
  alt: string
}) {
  const thumbs = images.slice(start)
  const [idx, setIdx] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const touchX = useRef<number | null>(null)

  useEffect(() => setMounted(true), [])

  const close = useCallback(() => setIdx(null), [])
  const prev = useCallback(
    () => setIdx((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  )
  const next = useCallback(
    () => setIdx((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  )

  useEffect(() => {
    if (idx === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [idx, close, prev, next])

  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (dx > 50) prev()
    else if (dx < -50) next()
    touchX.current = null
  }

  return (
    <>
      <div className="gallery">
        {thumbs.map((src, i) => (
          <button
            type="button"
            className="gallery-thumb"
            key={i}
            onClick={() => setIdx(start + i)}
            aria-label={`${alt} — фото ${start + i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${alt} — фото ${start + i + 1}`} />
          </button>
        ))}
      </div>

      {mounted && idx !== null && createPortal(
        <div className="lightbox" onClick={close} role="dialog" aria-modal="true">
          <button type="button" className="lb-close" onClick={close} aria-label="Закрыть">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          <button
            type="button"
            className="lb-nav lb-prev"
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Предыдущее фото"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div
            className="lb-stage"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[idx]} alt={`${alt} — фото ${idx + 1}`} />
            <span className="lb-counter">{idx + 1} / {images.length}</span>
          </div>
          <button
            type="button"
            className="lb-nav lb-next"
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Следующее фото"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>,
        document.body
      )}
    </>
  )
}
