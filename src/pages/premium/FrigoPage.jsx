import { useState, useCallback } from 'react'
import { generateFrigoRecipe }  from '@/api/premiumAI'
import AIRecipeResult           from '@/components/premium/AIRecipeResult'
import { cn }                   from '@/lib/utils'
import { Refrigerator, Users, Clock, ChefHat } from 'lucide-react'

const TEMPS_OPTIONS = ['15 min', '30 min', '45 min', '1 h', 'Libre']
const DIFF_OPTIONS  = ['Facile', 'Moyen', 'Difficile']
const TYPE_OPTIONS  = ['petit-déjeuner', 'déjeuner', 'dîner']

export default function FrigoPage({ onBack }) {
  const [inputText,  setInputText]  = useState('')
  const [nbPersonnes, setNbPersonnes] = useState(4)
  const [temps,      setTemps]      = useState('30 min')
  const [difficulty, setDifficulty] = useState('Facile')
  const [type,       setType]       = useState('déjeuner')
  const [recipe,     setRecipe]     = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [streamText, setStreamText] = useState('')
  const [error,      setError]      = useState(null)

  const ingredients = inputText.split('\n').map(s => s.trim()).filter(Boolean)

  const generate = useCallback(async () => {
    if (ingredients.length === 0) return
    setLoading(true)
    setError(null)
    setStreamText('')
    setRecipe(null)
    try {
      const result = await generateFrigoRecipe(
        ingredients,
        { nbPersonnes, temps: temps === 'Libre' ? null : temps, difficulty, type },
        { onProgress: t => setStreamText(t) }
      )
      setRecipe(result)
    } catch (e) {
      setError(e.message ?? 'Erreur lors de la génération.')
    } finally {
      setLoading(false)
      setStreamText('')
    }
  }, [ingredients, nbPersonnes, temps, difficulty, type])

  if (recipe || loading) {
    return (
      <AIRecipeResult
        recipe={recipe}
        loading={loading}
        streamText={streamText}
        source="frigo"
        onRegenerate={generate}
        onBack={() => setRecipe(null)}
      />
    )
  }

  return (
    <div className="max-w-xl mx-auto py-6 px-4 space-y-6">

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-green-100 flex items-center justify-center">
          <Refrigerator className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h2 className="font-bold text-gray-800">Mon frigo & mes placards</h2>
          <p className="text-xs text-gray-500">Un ingrédient par ligne</p>
        </div>
      </div>

      {/* Textarea ingrédients */}
      <div>
        <textarea
          rows={8}
          placeholder={"poulet\ncourgettes\ncrème fraîche\nriz\nparmesan\nœufs"}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          {ingredients.length} ingrédient{ingredients.length > 1 ? 's' : ''} saisi{ingredients.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Config */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        {/* Personnes */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
            <Users className="h-4 w-4 text-emerald-500" /> Personnes
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setNbPersonnes(n)}
                className={cn(
                  'h-9 w-9 rounded-xl border text-sm font-semibold transition-all',
                  nbPersonnes === n
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Temps */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
            <Clock className="h-4 w-4 text-emerald-500" /> Temps disponible
          </label>
          <div className="flex flex-wrap gap-2">
            {TEMPS_OPTIONS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTemps(t)}
                className={cn(
                  'px-3 py-1.5 rounded-xl border text-sm font-medium transition-all',
                  temps === t
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulté */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
            <ChefHat className="h-4 w-4 text-emerald-500" /> Difficulté
          </label>
          <div className="flex gap-2">
            {DIFF_OPTIONS.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={cn(
                  'flex-1 py-2 rounded-xl border text-sm font-medium transition-all',
                  difficulty === d
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 block">Type de repas</label>
          <div className="flex gap-2">
            {TYPE_OPTIONS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn(
                  'flex-1 py-2 rounded-xl border text-xs font-medium capitalize transition-all',
                  type === t
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                )}
              >
                {t}
              </button>
            ))}
          </div>
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
        disabled={ingredients.length === 0}
        className={cn(
          'w-full py-4 rounded-2xl font-bold text-base transition-all duration-200',
          ingredients.length > 0
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-200 hover:shadow-lg active:scale-[0.98]'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        )}
      >
        {ingredients.length === 0
          ? 'Saisissez vos ingrédients'
          : `Générer avec ${ingredients.length} ingrédient${ingredients.length > 1 ? 's' : ''} →`
        }
      </button>
    </div>
  )
}
