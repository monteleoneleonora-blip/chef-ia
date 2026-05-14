import { useState, useCallback } from 'react'
import { generateExpressRecipe } from '@/api/premiumAI'
import AIRecipeResult            from '@/components/premium/AIRecipeResult'
import { cn }                    from '@/lib/utils'
import { Zap, Users }            from 'lucide-react'

const CONTEXTS = [
  { id: 'J\'ai 15 minutes.',               emoji: '⏱️', label: '15 minutes' },
  { id: 'J\'ai 30 minutes.',               emoji: '🕐', label: '30 minutes' },
  { id: 'Les enfants ont faim.',            emoji: '👶', label: 'Enfants affamés' },
  { id: 'Je veux un repas avec une seule poêle.', emoji: '🍳', label: 'Une poêle' },
  { id: 'Je rentre tard, quelque chose de rapide.', emoji: '🌙', label: 'Rentre tard' },
  { id: 'Je veux un repas sans prise de tête.',    emoji: '😌', label: 'Sans stress' },
  { id: 'Je veux un repas très économique.',        emoji: '💰', label: 'Petit budget' },
  { id: 'Il faut vider le frigo.',                 emoji: '♻️', label: 'Anti-gaspi' },
]

const TEMPS_OPTIONS = ['15 min', '30 min', '45 min', 'pas de limite']

export default function ExpressPage({ onBack }) {
  const [selected,   setSelected]   = useState([])
  const [freeText,   setFreeText]   = useState('')
  const [nbPersonnes, setNbPersonnes] = useState(4)
  const [tempsMax,   setTempsMax]   = useState('30 min')
  const [recipe,     setRecipe]     = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [streamText, setStreamText] = useState('')
  const [error,      setError]      = useState(null)

  const toggleContext = (id) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  const buildSituation = () => {
    const parts = [...selected]
    if (freeText.trim()) parts.push(freeText.trim())
    return parts.join(' ') || 'Je veux un repas rapide et simple.'
  }

  const generate = useCallback(async () => {
    setLoading(true)
    setError(null)
    setStreamText('')
    setRecipe(null)
    try {
      const result = await generateExpressRecipe(
        buildSituation(),
        { nbPersonnes, tempsMax: tempsMax === 'pas de limite' ? null : tempsMax },
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
  }, [selected, freeText, nbPersonnes, tempsMax])

  if (recipe || loading) {
    return (
      <AIRecipeResult
        recipe={recipe}
        loading={loading}
        streamText={streamText}
        source="express"
        onRegenerate={generate}
        onBack={() => setRecipe(null)}
      />
    )
  }

  return (
    <div className="max-w-xl mx-auto py-6 px-4 space-y-6">

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-yellow-100 flex items-center justify-center">
          <Zap className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <h2 className="font-bold text-gray-800">Repas Express</h2>
          <p className="text-xs text-gray-500">Décrivez votre situation, le chef s'adapte</p>
        </div>
      </div>

      {/* Chips de contexte */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">Votre situation :</p>
        <div className="flex flex-wrap gap-2">
          {CONTEXTS.map(ctx => (
            <button
              key={ctx.id}
              type="button"
              onClick={() => toggleContext(ctx.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-sm font-medium transition-all',
                selected.includes(ctx.id)
                  ? 'bg-yellow-400 text-yellow-900 border-yellow-400 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-yellow-300'
              )}
            >
              <span>{ctx.emoji}</span> {ctx.label}
            </button>
          ))}
        </div>
      </div>

      {/* Texte libre */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">Ou précisez :</p>
        <input
          type="text"
          placeholder="Ex : un repas du mercredi soir avec du riz..."
          value={freeText}
          onChange={e => setFreeText(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Config */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
            <Users className="h-4 w-4 text-yellow-500" /> Personnes
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
                    ? 'bg-yellow-400 text-yellow-900 border-yellow-400'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-yellow-300'
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Temps maximum</p>
          <div className="flex flex-wrap gap-2">
            {TEMPS_OPTIONS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTempsMax(t)}
                className={cn(
                  'px-3 py-1.5 rounded-xl border text-sm font-medium transition-all',
                  tempsMax === t
                    ? 'bg-yellow-400 text-yellow-900 border-yellow-400'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-yellow-300'
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
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900 font-bold text-base shadow-md shadow-yellow-200 hover:shadow-lg active:scale-[0.98] transition-all"
      >
        Trouver mon repas express →
      </button>
    </div>
  )
}
