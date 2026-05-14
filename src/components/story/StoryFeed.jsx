import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { ChevronUp, ChevronDown } from 'lucide-react'

/**
 * StoryFeed — cartes plein ecran type Stories.
 * Hauteur: calc(100dvh - HEADER - NAV) pour eviter le chevauchement.
 */
const HEADER_PX = 60
const NAV_PX    = 64

export default function StoryFeed({ children, onChange, showProgress = true, showHints = true, className }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : [children].filter(Boolean)
  const [index, setIndex] = useState(0)
  const containerRef = useRef(null)
  const itemRefs = useRef([])

  useEffect(() => { onChange?.(index) }, [index, onChange])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) {
          const idx = Number(visible.target.dataset.storyIndex)
          if (!Number.isNaN(idx)) setIndex(idx)
        }
      },
      { root: container, threshold: [0.5, 0.75, 1] }
    )
    itemRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [items.length])

  const goTo = useCallback((i) => {
    const target = itemRefs.current[i]
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const goNext = useCallback(() => {
    if (index < items.length - 1) goTo(index + 1)
  }, [index, items.length, goTo])

  const goPrev = useCallback(() => {
    if (index > 0) goTo(index - 1)
  }, [index, goTo])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target?.matches('input, textarea, [contenteditable="true"]')) return
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        goPrev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  const containerStyle = {
    height: `calc(100dvh - ${HEADER_PX + NAV_PX}px)`,
    minHeight: '420px',
  }

  return (
    <div className={cn('relative w-full overflow-hidden', className)} style={containerStyle}>
      {showProgress && items.length > 1 && (
        <div className="absolute top-3 left-3 right-3 z-30 flex gap-1 pointer-events-none">
          {items.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-all duration-500',
                i < index   && 'bg-dolce-blue-deep/80',
                i === index && 'bg-dolce-blue-deep shadow-[0_0_8px_rgba(20,40,140,0.45)]',
                i > index   && 'bg-white/60',
              )}
            />
          ))}
        </div>
      )}

      <div ref={containerRef} className="story-snap-y h-full">
        {items.map((child, i) => (
          <div
            key={i}
            ref={(el) => { itemRefs.current[i] = el }}
            data-story-index={i}
            className="story-snap-item relative"
            style={{ height: containerStyle.height, minHeight: containerStyle.minHeight }}
          >
            {child}
          </div>
        ))}
      </div>

      {showHints && items.length > 1 && (
        <>
          {index > 0 && (
            <button
              type="button"
              onClick={goPrev}
              aria-label="Story precedent"
              className="absolute top-8 left-1/2 -translate-x-1/2 z-20 h-9 w-9 rounded-full glass border border-dolce-blue-deep/15 flex items-center justify-center text-dolce-blue-deep/70 hover:text-dolce-blue-deep transition-all hover:scale-110 animate-bob shadow-dolce-soft"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
          )}
          {index < items.length - 1 && (
            <button
              type="button"
              onClick={goNext}
              aria-label="Story suivant"
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 h-9 w-9 rounded-full glass border border-dolce-blue-deep/15 flex items-center justify-center text-dolce-blue-deep/70 hover:text-dolce-blue-deep transition-all hover:scale-110 animate-bob shadow-dolce-soft"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          )}
        </>
      )}
    </div>
  )
}

export function StoryCard({ children, gradient, className, align = 'center' }) {
  return (
    <div
      className={cn(
        'h-full w-full flex flex-col items-center px-6 py-10 overflow-y-auto overscroll-contain',
        align === 'center' ? 'justify-center' : 'justify-start',
        gradient ?? 'bg-dolce-mediterranean',
        className,
      )}
    >
      <div className="max-w-xl w-full mx-auto">
        {children}
      </div>
    </div>
  )
}
