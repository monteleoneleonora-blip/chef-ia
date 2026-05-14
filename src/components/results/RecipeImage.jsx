import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { resolvePhotoUrl } from '@/api/images'

const MEAL_GRADIENT = {
  'petit-déjeuner': { emoji: '🥐', gradient: 'from-amber-400 via-orange-300 to-yellow-200' },
  'déjeuner':       { emoji: '🥗', gradient: 'from-emerald-400 via-teal-300 to-green-200'  },
  'dîner':          { emoji: '🍝', gradient: 'from-violet-400 via-indigo-300 to-purple-200' },
}

export default function RecipeImage({ imageQuery, recipeName, mealType }) {
  const [photoUrl,  setPhotoUrl]  = useState(null)
  const [imgStatus, setImgStatus] = useState('loading')

  const meta = MEAL_GRADIENT[mealType] ?? MEAL_GRADIENT['déjeuner']

  useEffect(() => {
    let cancelled = false
    setImgStatus('loading')
    setPhotoUrl(null)

    resolvePhotoUrl(recipeName, imageQuery)
      .then(url => {
        if (cancelled) return
        if (url) {
          setPhotoUrl(url)
        } else {
          setImgStatus('error')
        }
      })
      .catch(() => {
        if (!cancelled) setImgStatus('error')
      })

    return () => { cancelled = true }
  }, [recipeName, imageQuery, mealType])

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-100">

      {/* Skeleton shimmer */}
      {imgStatus === 'loading' && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
      )}

      {/* Gradient fallback */}
      {imgStatus === 'error' && (
        <div
          role="img"
          aria-label={recipeName}
          className={cn(
            'absolute inset-0 bg-gradient-to-br flex flex-col items-center justify-center gap-2',
            meta.gradient
          )}
        >
          <span className="text-6xl drop-shadow-md" aria-hidden="true">{meta.emoji}</span>
          <span className="text-white/90 text-xs font-semibold drop-shadow px-4 text-center line-clamp-2">
            {recipeName}
          </span>
        </div>
      )}

      {/* Photo réelle — absolute pour couvrir proprement fallback et shimmer */}
      {photoUrl && (
        <img
          src={photoUrl}
          alt={recipeName}
          loading="lazy"
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-700',
            imgStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImgStatus('loaded')}
          onError={() => setImgStatus('error')}
        />
      )}

      {/* Overlays gradient */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/65 via-black/25 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0   h-16 bg-gradient-to-b from-black/35 to-transparent pointer-events-none" />
    </div>
  )
}
