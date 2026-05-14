import { useState, useMemo } from 'react'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import RecipeCard  from '@/components/results/RecipeCard'
import RobotChef   from '@/components/mascot/RobotChef'
import { Input }   from '@/components/ui/input'
import { Heart, Search, X, SlidersHorizontal } from 'lucide-react'
import { Button }  from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { key: 'recent', label: 'Plus récents' },
  { key: 'name',   label: 'Nom (A→Z)' },
]

const MEAL_FILTERS = [
  { key: 'all',            label: 'Tous',       emoji: '🍴' },
  { key: 'petit-déjeuner', label: 'Petit-déj',  emoji: '🥐' },
  { key: 'déjeuner',       label: 'Déjeuner',   emoji: '🥗' },
  { key: 'dîner',          label: 'Dîner',      emoji: '🍝' },
]

export default function FavoritesPage() {
  const favorites = useFavoritesStore(s => s.favorites)
  const remove    = useFavoritesStore(s => s.remove)

  const [search, setSearch]     = useState('')
  const [mealType, setMealType] = useState('all')
  const [sort, setSort]         = useState('recent')
  const [showSort, setShowSort] = useState(false)

  const filtered = useMemo(() => {
    let list = [...favorites]
    if (mealType !== 'all') list = list.filter(r => r.type === mealType)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(r => r.name.toLowerCase().includes(q) || r.cuisine?.toLowerCase().includes(q))
    }
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'fr'))
    else list.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
    return list
  }, [favorites, mealType, search, sort])

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center px-6 animate-in slide-up">
        <div className="animate-bob">
          <RobotChef expression="sad" size="lg" />
        </div>
        <div className="space-y-2 max-w-sm">
          <p className="font-script text-3xl text-dolce-blue">Pas encore de favoris…</p>
          <h2 className="font-display text-2xl font-bold text-foreground">Aucun favori pour l'instant</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Cliquez sur ❤️ sur une recette pour la retrouver ici à tout moment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 animate-in fade-in">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-3xl bg-gradient-to-br from-dolce-rose to-dolce-terracotta flex items-center justify-center shadow-dolce-warm">
            <Heart className="h-5 w-5 text-white" fill="currentColor" />
          </div>
          <div>
            <p className="font-script text-2xl text-dolce-blue leading-none">i miei favoriti</p>
            <h1 className="font-display text-2xl font-bold leading-tight">Mes favoris</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {favorites.length} recette{favorites.length > 1 ? 's' : ''} · {filtered.length} affichée{filtered.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Tri */}
        <div className="relative">
          <Button variant="outline" size="sm" className="gap-1.5 rounded-2xl" onClick={() => setShowSort(s => !s)}>
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {SORT_OPTIONS.find(o => o.key === sort)?.label}
          </Button>
          {showSort && (
            <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-border rounded-2xl shadow-dolce-soft overflow-hidden w-44">
              {SORT_OPTIONS.map(o => (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => { setSort(o.key); setShowSort(false) }}
                  className={cn('w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-dolce-blue-soft/30',
                    sort === o.key && 'font-semibold text-dolce-blue-deep bg-dolce-blue-soft/40')}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            placeholder="Rechercher un favori…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-11 rounded-3xl h-12 border-border/60 bg-white shadow-dolce-soft"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {MEAL_FILTERS.map(({ key, label, emoji }) => (
            <button
              key={key}
              type="button"
              onClick={() => setMealType(key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border-2 transition-all',
                mealType === key
                  ? 'bg-gradient-to-r from-dolce-rose to-dolce-terracotta text-white border-transparent shadow-dolce-warm'
                  : 'border-border/60 text-muted-foreground hover:border-dolce-rose/40 bg-white/80'
              )}
            >
              <span className="text-base">{emoji}</span>{label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <RobotChef expression="thinking" size="md" />
          <p className="text-sm text-muted-foreground">Aucun favori ne correspond à ces filtres.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((recipe, i) => (
            // BUG-004 : utiliser name+index pour éviter les clés dupliquées
            <div key={`${recipe.name}-${i}`} className="relative group animate-in slide-up-soft">
              <RecipeCard recipe={recipe} mealType={recipe.type} />
              <button
                type="button"
                onClick={() => remove(recipe.name)}
                aria-label={`Retirer ${recipe.name}`}
                className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center text-muted-foreground hover:text-dolce-terracotta hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
