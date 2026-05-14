import { useState, useCallback } from 'react'
import { transformRecipe }       from '@/api/premiumAI'
import { useCarnetStore }        from '@/store/useCarnetStore'
import AIRecipeResult            from '@/components/premium/AIRecipeResult'
import { cn }                    from '@/lib/utils'
import { Shuffle, ChevronDown }  from 'lucide-react'

const TRANSFORMATIONS = [
  { id: 'version plus rapide',           label: 'Plus rapide',          emoji: '⏱️' },
  { id: 'version plus légère et saine',  label: 'Plus légère',          emoji: '🥗' },
  { id: 'version plus gourmande',        label: 'Plus gourmande',       emoji: '😋' },
  { id: 'version enfant-friendly',       label: 'Enfant-friendly',      emoji: '👶' },
  { id: 'version petit budget',          label: 'Petit budget',         emoji: '💰' },
  { id: 'version végétarienne',          label: 'Végétarienne',         emoji: '🌱' },
  { id: 'version sans lactose',          label: 'Sans lactose',         emoji: '🥛' },
  { id: 'version sans gluten',           label: 'Sans gluten',          emoji: '🌾' },
  { id: 'version batch cooking',         label: 'Batch cooking',        emoji: '🍱' },
  { id: 'version plus raffinée et festive', label: 'Version invités',   emoji: '🥂' },
  { id: 'version repas du soir léger',   label: 'Soir léger',          emoji: '🌙' },
  { id: 'version avec les ingrédients disponibles dans un frigo standard', label: 'Frigo vide', emoji: '🧊' },
]

export default function TransformPage({ onBack, initialRecipe = null }) {
  const { entries } = useCarnetStore()
  const [recipeName,  setRecipeName]  = useState(initialRecipe?.nom ?? initialRecipe?.name ?? '')
  const [recipeDesc,  setRecipeDesc]  = useState(initialRecipe?.description ?? '')
  const [transformation, setTransformation] = useState('')
  const [recipe,      setRecipe]      = useState(null)
  const [loading,     setLoading]     = useState(false)
  const [streamText,  setStreamText]  = useState('')
  const [error,       setError]       = useState(null)
  const [showCarnet,  setShowCarnet]  = useState(false)

  const canGenerate = recipeName.trim() && transformation

  const generate = useCallback(async () => {
    if (!canGenerate) return
    setLoading(true)
    setError(null)
    setStreamText('')
    setRecipe(null)
    try {
      const result = await transformRecipe(
        recipeName.trim(),
        recipeDesc.trim(),
        transformation,
        { onProgress: t => setStreamText(t) }
      )
      setRecipe(result)
    } catch (e) {
      setError(e.message ?? 'Erreur lors de la transformation.')
    } finally {
      setLoading(false)
      setStreamText('')
    }
  }, [recipeName, recipeDesc, transformation, canGenerate])

  if (recipe || loading) {
    return (
      <AIRecipeResult
        recipe={recipe}
        loading={loading}
        streamText={streamText}
        source="transform"
        onRegenerate={generate}
        onBack={() => setRecipe(null)}
      />
    )
  }

  return (
    <div className="max-w-xl mx-auto py-6 px-4 space-y-6">

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-purple-100 flex items-center justify-center">
          <Shuffle className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h2 className="font-bold text-gray-800">Transformer une recette</h2>
          <p className="text-xs text-gray-500">Créez une variante adaptée à vos besoins</p>
        </div>
      </div>

      {/* Source recette */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <p className="text-sm font-medium text-gray-700">Recette à transformer</p>

        <div>
          <input
            type="text"
            placeholder="Nom de la recette (ex: Pâtes au saumon)"
            value={recipeName}
            onChange={e => setRecipeName(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <textarea
            rows={3}
            placeholder="Description optionnelle de la recette..."
            value={recipeDesc}
            onChange={e => setRecipeDesc(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          />
        </div>

        {/* Choisir depuis le carnet */}
        {entries.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowCarnet(s => !s)}
              className="flex items-center gap-2 text-xs text-purple-600 hover:text-purple-700 font-medium"
            >
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showCarnet && 'rotate-180')} />
              Choisir depuis mon carnet ({entries.length})
            </button>
            {showCarnet && (
              <div className="mt-2 border border-purple-100 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                {entries.map(e => {
                  const nom = e.recipe.nom ?? e.recipe.name ?? 'Sans titre'
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => {
                        setRecipeName(nom)
                        setRecipeDesc(e.recipe.description ?? '')
                        setShowCarnet(false)
                      }}
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-purple-50 border-b border-gray-50 last:border-0 text-gray-700 transition-colors"
                    >
                      {nom}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Type de transformation */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-medium text-gray-700 mb-3">Type de transformation</p>
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
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
          ⚠️ {error}
        </p>
      )}

      <button
        type="button"
        onClick={generate}
        disabled={!canGenerate}
        className={cn(
          'w-full py-4 rounded-2xl font-bold text-base transition-all duration-200',
          canGenerate
            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-200 hover:shadow-lg active:scale-[0.98]'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        )}
      >
        {!recipeName.trim()
          ? 'Nommez la recette à transformer'
          : !transformation
          ? 'Choisissez une transformation'
          : `Transformer en "${TRANSFORMATIONS.find(t => t.id === transformation)?.label}" →`
        }
      </button>
    </div>
  )
}
