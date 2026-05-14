import { useState, useCallback } from 'react'
import { generateBudgetRecipe }  from '@/api/premiumAI'
import AIRecipeResult            from '@/components/premium/AIRecipeResult'
import { cn }                    from '@/lib/utils'
import { Wallet, Users, Euro }   from 'lucide-react'

const NIVEAU_OPTIONS = [
  { id: 'économique', label: 'Économique', emoji: '🪙' },
  { id: 'familial',   label: 'Familial',   emoji: '👨‍👩‍👧' },
  { id: 'équilibré',  label: 'Équilibré',  emoji: '🥗' },
  { id: 'gourmand',   label: 'Gourmand',   emoji: '😋' },
]

const TYPE_OPTIONS = ['déjeuner', 'dîner', 'petit-déjeuner']

export default function BudgetAIPage({ onBack }) {
  const [budgetTotal,  setBudgetTotal]  = useState('')
  const [nbPersonnes,  setNbPersonnes]  = useState(4)
  const [niveau,       setNiveau]       = useState('familial')
  const [type,         setType]         = useState('déjeuner')
  const [ingredientsText, setIngredientsText] = useState('')
  const [recipe,       setRecipe]       = useState(null)
  const [loading,      setLoading]      = useState(false)
  const [streamText,   setStreamText]   = useState('')
  const [error,        setError]        = useState(null)

  const ingredientsDisponibles = ingredientsText.split('\n').map(s => s.trim()).filter(Boolean)

  const budgetPP = budgetTotal && nbPersonnes
    ? (Number(budgetTotal) / nbPersonnes).toFixed(2)
    : null

  const generate = useCallback(async () => {
    setLoading(true)
    setError(null)
    setStreamText('')
    setRecipe(null)
    try {
      const result = await generateBudgetRecipe(
        {
          budgetTotal: budgetTotal ? Number(budgetTotal) : null,
          nbPersonnes,
          niveau,
          type,
          ingredientsDisponibles,
        },
        { onProgress: t => setStreamText(t) }
      )
      setRecipe(result)
    } catch (e) {
      setError(e.message ?? 'Erreur lors de la génération.')
    } finally {
      setLoading(false)
      setStreamText('')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgetTotal, nbPersonnes, niveau, type, ingredientsText])

  if (recipe || loading) {
    return (
      <AIRecipeResult
        recipe={recipe}
        loading={loading}
        streamText={streamText}
        source="budget"
        onRegenerate={generate}
        onBack={() => setRecipe(null)}
      />
    )
  }

  return (
    <div className="max-w-xl mx-auto py-6 px-4 space-y-6">

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-blue-100 flex items-center justify-center">
          <Wallet className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="font-bold text-gray-800">Budget IA</h2>
          <p className="text-xs text-gray-500">Manger bien sans dépasser votre enveloppe</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">

        {/* Budget */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
            <Euro className="h-4 w-4 text-blue-500" /> Budget total (€) — optionnel
          </label>
          <div className="relative">
            <input
              type="number"
              min={1}
              step={0.5}
              placeholder="Ex: 15"
              value={budgetTotal}
              onChange={e => setBudgetTotal(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-8"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
          </div>
          {budgetPP && (
            <p className="text-xs text-blue-600 mt-1 font-medium">
              ≈ {budgetPP} €/personne pour {nbPersonnes} pers.
            </p>
          )}
        </div>

        {/* Personnes */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
            <Users className="h-4 w-4 text-blue-500" /> Personnes
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 8].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setNbPersonnes(n)}
                className={cn(
                  'h-9 w-9 rounded-xl border text-sm font-semibold transition-all',
                  nbPersonnes === n
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Niveau */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Niveau souhaité</p>
          <div className="grid grid-cols-2 gap-2">
            {NIVEAU_OPTIONS.map(n => (
              <button
                key={n.id}
                type="button"
                onClick={() => setNiveau(n.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all',
                  niveau === n.id
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                )}
              >
                <span>{n.emoji}</span> {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Type de repas</p>
          <div className="flex gap-2">
            {TYPE_OPTIONS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn(
                  'flex-1 py-2 rounded-xl border text-xs font-medium capitalize transition-all',
                  type === t
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Ingrédients dispo */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">Ingrédients déjà disponibles (optionnel)</p>
          <p className="text-xs text-gray-400 mb-2">Un par ligne — l'IA les réutilisera en priorité</p>
          <textarea
            rows={4}
            placeholder={"riz\nœufs\ntomates"}
            value={ingredientsText}
            onChange={e => setIngredientsText(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white p-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
          ⚠️ {error}
        </p>
      )}

      <div className="space-y-2">
        <button
          type="button"
          onClick={generate}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-base shadow-md shadow-blue-200 hover:shadow-lg active:scale-[0.98] transition-all"
        >
          {budgetTotal ? `Générer un repas pour ${budgetTotal} € →` : 'Générer une recette économique →'}
        </button>
        <p className="text-center text-xs text-gray-400">
          Estimation indicative — les prix varient selon les magasins
        </p>
      </div>
    </div>
  )
}
