import { useState, useMemo } from 'react'
import { Search, Database, ChefHat, Clock, Users, Flame, X, Lock } from 'lucide-react'
import { MASTER_RECIPES, MASTER_RECIPE_COUNT, MASTER_CUISINES } from '@/data/masterRecipeDatabase'
import RecipeImage from '@/components/results/RecipeImage'
import { cn } from '@/lib/utils'

// BUG-014 : PIN lu depuis les variables d'environnement (VITE_ADMIN_PIN).
// Valeur par défaut uniquement en développement local.
const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN ?? '1234'

function PinLock({ onUnlock }) {
  const [pin, setPin]     = useState('')
  const [error, setError] = useState(false)

  const handleKey = (digit) => {
    const next = (pin + digit).slice(0, 4)
    setPin(next)
    setError(false)
    if (next.length === 4) {
      if (next === ADMIN_PIN) {
        onUnlock()
      } else {
        setError(true)
        setTimeout(() => setPin(''), 600)
      }
    }
  }

  const digits = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  return (
    <div className="min-h-screen bg-dolce-blue-deep flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        <div className="h-14 w-14 rounded-2xl bg-dolce-yellow flex items-center justify-center">
          <Lock className="h-7 w-7 text-dolce-blue-deep" />
        </div>
        <div>
          <h1 className="text-white font-display text-2xl uppercase tracking-tight text-center">Admin DB</h1>
          <p className="text-white/40 text-sm text-center mt-1">Entrez votre code PIN</p>
        </div>

        {/* Indicateurs */}
        <div className="flex gap-4">
          {[0,1,2,3].map(i => (
            <div key={i} className={cn(
              'h-3 w-3 rounded-full border-2 transition-all',
              i < pin.length
                ? error ? 'bg-red-400 border-red-400' : 'bg-dolce-yellow border-dolce-yellow'
                : 'border-white/30'
            )} />
          ))}
        </div>

        {error && <p className="text-red-400 text-xs font-semibold">Code incorrect</p>}

        {/* Clavier */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {digits.map((d, i) => (
            <button
              key={i}
              type="button"
              disabled={d === ''}
              onClick={() => {
                if (d === '⌫') { setPin(p => p.slice(0, -1)); setError(false) }
                else if (d !== '') handleKey(d)
              }}
              className={cn(
                'h-14 rounded-2xl text-xl font-bold transition-all',
                d === '' ? 'pointer-events-none' :
                d === '⌫' ? 'bg-white/10 text-white/60 hover:bg-white/20' :
                'bg-white/15 text-white hover:bg-white/25 active:scale-95'
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const TYPE_LABELS = {
  'petit-déjeuner': { label: '🍳 Petit-déjeuner', color: 'bg-amber-100 text-amber-800' },
  'déjeuner':       { label: '🥗 Déjeuner',       color: 'bg-green-100 text-green-800' },
  'dîner':          { label: '🌙 Dîner',           color: 'bg-indigo-100 text-indigo-800' },
}

const DIFFICULTY_COLOR = {
  'Facile':    'text-green-600',
  'Moyen':     'text-amber-600',
  'Difficile': 'text-red-600',
}

const CUISINE_EMOJI = {
  française: '🥖', italienne: '🍝', méditerranéenne: '🫒',
  asiatique: '🥢', japonaise: '🍱', indienne: '🍛',
  orientale: '🧆', mexicaine: '🌮', américaine: '🍔',
  espagnole: '🥘', africaine: '🌍', nordique: '🐟',
}

export default function AdminDatabasePage() {
  const [unlocked,       setUnlocked]       = useState(false)
  const [search,         setSearch]         = useState('')
  const [filterCuisine,  setFilterCuisine]  = useState('all')
  const [filterType,     setFilterType]     = useState('all')
  const [filterDiet,     setFilterDiet]     = useState('all')
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  // ⚠️ Tous les hooks AVANT tout return conditionnel (règle React)
  const allDiets = useMemo(() => {
    const set = new Set()
    MASTER_RECIPES.forEach(r => r.diets?.forEach(d => set.add(d)))
    return [...set].sort()
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return MASTER_RECIPES.filter(r => {
      if (filterCuisine !== 'all' && r.cuisine !== filterCuisine) return false
      if (filterType    !== 'all' && r.type    !== filterType)    return false
      if (filterDiet    !== 'all' && !(r.diets ?? []).includes(filterDiet)) return false
      if (q && !r.name.toLowerCase().includes(q) && !r.cuisine.toLowerCase().includes(q)) return false
      return true
    })
  }, [search, filterCuisine, filterType, filterDiet])

  const stats = useMemo(() => {
    const byCuisine = {}
    const byType    = {}
    MASTER_RECIPES.forEach(r => {
      byCuisine[r.cuisine] = (byCuisine[r.cuisine] ?? 0) + 1
      byType[r.type]       = (byType[r.type]       ?? 0) + 1
    })
    return { byCuisine, byType }
  }, [])

  // Return conditionnel APRÈS tous les hooks
  if (!unlocked) return <PinLock onUnlock={() => setUnlocked(true)} />

  return (
    <div className="min-h-screen bg-gray-50 pb-12">

      {/* ── Header ── */}
      <div className="bg-dolce-blue-deep text-white px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <Database className="h-6 w-6 text-dolce-yellow" />
            <h1 className="text-xl font-display font-bold uppercase tracking-tight">
              Base de Données Maîtresse
            </h1>
          </div>
          <p className="text-white/60 text-sm">
            Accès admin uniquement — {MASTER_RECIPE_COUNT} recettes · {MASTER_CUISINES.length} cuisines
          </p>

          {/* Mini stats */}
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="bg-white/10 rounded-xl px-3 py-1.5 text-sm">
                <span className="font-bold">{count}</span>
                <span className="text-white/70 ml-1">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6 space-y-4">

        {/* ── Recherche ── */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une recette ou une cuisine…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-dolce-blue-deep/20"
          />
        </div>

        {/* ── Filtres ── */}
        <div className="flex flex-wrap gap-2">
          {/* Cuisine */}
          <select
            value={filterCuisine}
            onChange={e => setFilterCuisine(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none"
          >
            <option value="all">Toutes les cuisines</option>
            {MASTER_CUISINES.map(c => (
              <option key={c} value={c}>{CUISINE_EMOJI[c] ?? '🍽'} {c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>

          {/* Type de repas */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none"
          >
            <option value="all">Tous les repas</option>
            <option value="petit-déjeuner">🍳 Petit-déjeuner</option>
            <option value="déjeuner">🥗 Déjeuner</option>
            <option value="dîner">🌙 Dîner</option>
          </select>

          {/* Régime */}
          <select
            value={filterDiet}
            onChange={e => setFilterDiet(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none"
          >
            <option value="all">Tous les régimes</option>
            {allDiets.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {(filterCuisine !== 'all' || filterType !== 'all' || filterDiet !== 'all' || search) && (
            <button
              onClick={() => { setFilterCuisine('all'); setFilterType('all'); setFilterDiet('all'); setSearch('') }}
              className="flex items-center gap-1 text-sm text-red-500 border border-red-200 rounded-xl px-3 py-2 bg-white hover:bg-red-50"
            >
              <X className="h-3.5 w-3.5" /> Réinitialiser
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400">{filtered.length} recette{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}</p>

        {/* ── Grille de recettes ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(recipe => (
            <button
              key={recipe.id}
              type="button"
              onClick={() => setSelectedRecipe(recipe)}
              className="text-left bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-dolce-blue-deep/20 hover:shadow-md transition-all"
            >
              {/* Photo */}
              <div className="relative h-36 overflow-hidden">
                <RecipeImage
                  imageQuery={recipe.imageQuery}
                  recipeName={recipe.name}
                  mealType={recipe.type}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                <span className={cn('absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm', TYPE_LABELS[recipe.type]?.color)}>
                  {recipe.type}
                </span>
                <span className="absolute bottom-2 left-2 text-white font-bold text-xs leading-tight drop-shadow line-clamp-2 max-w-[80%]">
                  {recipe.name}
                </span>
              </div>

              <div className="p-3">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-base">{CUISINE_EMOJI[recipe.cuisine] ?? '🍽'}</span>
              </div>
              <p className="text-[11px] text-gray-400 capitalize mb-2">{recipe.cuisine}</p>
              <div className="flex items-center gap-3 text-[11px] text-gray-400">
                <span className={cn('font-semibold', DIFFICULTY_COLOR[recipe.difficulty])}>
                  {recipe.difficulty}
                </span>
                <span className="flex items-center gap-0.5">
                  <Clock className="h-3 w-3" />
                  {recipe.cookTime}
                </span>
                <span className="flex items-center gap-0.5">
                  <Flame className="h-3 w-3" />
                  {recipe.kcalPerPerson} kcal
                </span>
              </div>
              {recipe.diets?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {recipe.diets.map(d => (
                    <span key={d} className="text-[9px] bg-green-50 text-green-700 border border-green-200 rounded-full px-1.5 py-0.5">
                      {d}
                    </span>
                  ))}
                </div>
              )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Modal détail recette ── */}
      {selectedRecipe && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedRecipe(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6"
            onClick={e => e.stopPropagation()}
          >
            {/* Photo dans la modale */}
            <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-3xl">
              <RecipeImage
                imageQuery={selectedRecipe.imageQuery}
                recipeName={selectedRecipe.name}
                mealType={selectedRecipe.type}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-3 left-4 right-12">
                <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm mr-2', TYPE_LABELS[selectedRecipe.type]?.color)}>
                  {selectedRecipe.type}
                </span>
                <h2 className="text-white font-bold text-lg leading-tight drop-shadow mt-1">{selectedRecipe.name}</h2>
                <p className="text-white/70 text-xs capitalize">{CUISINE_EMOJI[selectedRecipe.cuisine] ?? '🍽'} Cuisine {selectedRecipe.cuisine}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { label: 'Difficulté', value: selectedRecipe.difficulty, color: DIFFICULTY_COLOR[selectedRecipe.difficulty] },
                { label: 'Prép.', value: selectedRecipe.prepTime },
                { label: 'Cuisson', value: selectedRecipe.cookTime },
                { label: 'Portions', value: `${selectedRecipe.servings} pers.` },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-2 text-center">
                  <p className={cn('text-xs font-bold', s.color ?? 'text-dolce-blue-deep')}>{s.value}</p>
                  <p className="text-[10px] text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Nutrition */}
            <div className="flex gap-2 mb-4">
              {[
                { label: 'Kcal', value: selectedRecipe.kcalPerPerson },
                { label: 'Protéines', value: `${selectedRecipe.proteinPerPerson}g` },
                { label: 'Glucides', value: `${selectedRecipe.carbsPerPerson}g` },
              ].map(n => (
                <div key={n.label} className="flex-1 bg-blue-50 rounded-xl p-2 text-center">
                  <p className="text-xs font-bold text-dolce-blue-deep">{n.value}</p>
                  <p className="text-[10px] text-gray-500">{n.label}</p>
                </div>
              ))}
            </div>

            {/* Ingrédients */}
            <h3 className="font-bold text-sm text-dolce-blue-deep mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" /> Ingrédients
            </h3>
            <ul className="space-y-1 mb-4">
              {selectedRecipe.ingredients?.map((ing, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-dolce-yellow-deep shrink-0" />
                  <span className="text-gray-600">
                    {ing.quantity && <span className="font-medium text-dolce-blue-deep">{ing.quantity} {ing.unit} </span>}
                    {ing.name}
                  </span>
                </li>
              ))}
            </ul>

            {/* Étapes */}
            <h3 className="font-bold text-sm text-dolce-blue-deep mb-2 flex items-center gap-2">
              <ChefHat className="h-4 w-4" /> Préparation
            </h3>
            <ol className="space-y-2 mb-4">
              {selectedRecipe.steps?.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600">
                  <span className="shrink-0 h-5 w-5 rounded-full bg-dolce-blue-deep text-white text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            {/* Chef tip */}
            {selectedRecipe.chefTip && (
              <div className="bg-dolce-yellow-soft border border-dolce-yellow-deep/30 rounded-2xl p-3">
                <p className="text-xs font-bold text-dolce-blue-deep mb-1">💡 Conseil du chef</p>
                <p className="text-xs text-dolce-blue-deep/80">{selectedRecipe.chefTip}</p>
              </div>
            )}

            {/* Note enfants */}
            {selectedRecipe.childNote && (
              <div className="mt-2 bg-pink-50 border border-pink-200 rounded-2xl p-3">
                <p className="text-xs font-bold text-pink-700 mb-1">👶 Note pour les enfants</p>
                <p className="text-xs text-pink-600">{selectedRecipe.childNote}</p>
              </div>
            )}

            {/* ID technique */}
            <p className="mt-3 text-[10px] text-gray-300 text-right font-mono">{selectedRecipe.id}</p>
          </div>
        </div>
      )}
    </div>
  )
}
