import { useState, useCallback, useEffect } from 'react'
import { transformRecipe }       from '@/api/premiumAI'
import AIRecipeResult            from './AIRecipeResult'
import { cn }                    from '@/lib/utils'
import { Shuffle, X }            from 'lucide-react'

const TRANSFORMATIONS = [
  { id: 'version plus rapide',               label: 'Plus rapide',          emoji: '⏱️' },
  { id: 'version plus légère et saine',      label: 'Plus légère',          emoji: '🥗' },
  { id: 'version plus gourmande',            label: 'Plus gourmande',       emoji: '😋' },
  { id: 'version enfant-friendly',           label: 'Enfant-friendly',      emoji: '👶' },
  { id: 'version petit budget',              label: 'Petit budget',         emoji: '💰' },
  { id: 'version végétarienne',              label: 'Végétarienne',         emoji: '🌱' },
  { id: 'version sans lactose',              label: 'Sans lactose',         emoji: '🥛' },
  { id: 'version sans gluten',              label: 'Sans gluten',          emoji: '🌾' },
  { id: 'version batch cooking',             label: 'Batch cooking',        emoji: '🍱' },
  { id: 'version plus raffinée et festive',  label: 'Version invités',      emoji: '🥂' },
  { id: 'version repas du soir léger',       label: 'Soir léger',           emoji: '🌙' },
]

export default function TransformModal({ recipe, onClose }) {
  const [transformation, setTransformation] = useState('')
  const [result,    setResult]    = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [streamText, setStreamText] = useState('')
  const [error,     setError]     = useState(null)

  const nom  = recipe.nom ?? recipe.name ?? ''
  const desc = recipe.description ?? ''

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const generate = useCallback(async () => {
    if (!transformation) return
    setLoading(true)
    setError(null)
    setStreamText('')
    setResult(null)
    try {
      const r = await transformRecipe(nom, desc, transformation, { onProgress: t => setStreamText(t) })
      setResult(r)
    } catch (e) {
      setError(e.message ?? 'Erreur lors de la transformation.')
    } finally {
      setLoading(false)
      setStreamText('')
    }
  }, [nom, desc, transformation])

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Shuffle className="h-5 w-5" />
            <div>
              <h3 className="font-bold text-base leading-tight">Transformer la recette</h3>
              <p className="text-white/70 text-xs">{nom}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5">
          {result || loading ? (
            <AIRecipeResult
              recipe={result}
              loading={loading}
              streamText={streamText}
              source="transform"
              onRegenerate={generate}
              onBack={() => setResult(null)}
            />
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700">Choisissez une transformation :</p>
              <div className="grid grid-cols-2 gap-2">
                {TRANSFORMATIONS.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTransformation(t.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left',
                      transformation === t.id
                        ? 'bg-purple-500 text-white border-purple-500'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                    )}
                  >
                    <span>{t.emoji}</span> {t.label}
                  </button>
                ))}
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                  ⚠️ {error}
                </p>
              )}

              <button
                type="button"
                onClick={generate}
                disabled={!transformation}
                className={cn(
                  'w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200',
                  transformation
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-200 hover:shadow-lg active:scale-[0.98]'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                {transformation
                  ? `Transformer → ${TRANSFORMATIONS.find(t => t.id === transformation)?.label}`
                  : 'Sélectionnez une transformation'
                }
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
