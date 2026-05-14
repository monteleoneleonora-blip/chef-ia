import { Clock, Flame } from 'lucide-react'
import RecipeImage from '@/components/results/RecipeImage'
import { getBudget } from '@/data/budgetMap'
import { cn } from '@/lib/utils'

const DIFFICULTY = {
  'Facile':    { label: 'Facile',  dot: 'bg-emerald-400' },
  'Moyen':     { label: 'Interméd.', dot: 'bg-amber-400' },
  'Difficile': { label: 'Expert',  dot: 'bg-rose-400'    },
}

/**
 * InspirationCarousel — carrousel horizontal mobile-first de recettes.
 *
 * - Photo en haut, chip difficulté en surimpression
 * - Titre, temps, badge budget
 * - Action "Voir" très discrète (chevron + label)
 * - Cartes 72-78% de la largeur écran sur mobile, ~280px sur tablette
 *
 * Aucun style dashboard : ce sont des cartes éditoriales avec coins arrondis,
 * ombres très douces et fond blanc chaud.
 */
export default function InspirationCarousel({ recipes = [], onSelect }) {
  if (!recipes.length) return null

  return (
    <div
      role="list"
      aria-label="Recettes inspirantes"
      className={cn(
        'flex items-stretch gap-3 overflow-x-auto -mx-4 px-4 pb-2',
        'snap-x snap-mandatory scroll-smooth',
      )}
      style={{ scrollbarWidth: 'none' }}
    >
      {recipes.map((recipe) => (
        <InspirationCard
          key={recipe.id ?? recipe.name}
          recipe={recipe}
          onClick={() => onSelect?.(recipe)}
        />
      ))}
    </div>
  )
}

function InspirationCard({ recipe, onClick }) {
  const diff   = DIFFICULTY[recipe.difficulty] ?? DIFFICULTY['Facile']
  const budget = getBudget(recipe)
  const time   = formatTime(recipe)

  return (
    <button
      type="button"
      role="listitem"
      onClick={onClick}
      className={cn(
        'snap-start shrink-0 w-[78%] sm:w-[300px]',
        'rounded-3xl overflow-hidden text-left',
        'bg-white border border-dolce-blue-deep/10',
        'shadow-[0_8px_24px_-14px_rgba(36,40,140,0.20)]',
        'hover:shadow-[0_12px_28px_-12px_rgba(36,40,140,0.28)]',
        'hover:-translate-y-0.5 transition-all duration-300',
      )}
      aria-label={`Voir ${recipe.name}`}
    >
      <div className="relative h-40 sm:h-44 overflow-hidden">
        <RecipeImage
          imageQuery={recipe.imageQuery}
          recipeName={recipe.name}
          mealType={recipe.type}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent pointer-events-none" />

        {/* Chip difficulté discret en haut à gauche */}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur text-dolce-blue-deep border border-white/40">
          <span className={cn('h-1.5 w-1.5 rounded-full', diff.dot)} />
          {diff.label}
        </span>

        {/* Badge budget discret en haut à droite */}
        {budget && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-dolce-blue-deep/85 backdrop-blur text-dolce-yellow border border-white/20">
            {budget.coutParPersonne.toFixed(2).replace('.', ',')} €/pers.
          </span>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-display text-[17px] tracking-tight text-dolce-blue-deep leading-tight line-clamp-2">
          {recipe.name}
        </h3>

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-semibold">
          {time && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {time}
            </span>
          )}
          {recipe.kcalPerPerson && (
            <span className="inline-flex items-center gap-1">
              <Flame className="h-3 w-3" />
              {recipe.kcalPerPerson} kcal
            </span>
          )}
        </div>

        <div className="pt-1">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-dolce-blue-deep">
            Voir la recette
            <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </button>
  )
}

function formatTime(recipe) {
  const p = recipe.prepTime
  const c = recipe.cookTime
  if (p && c) return `${p} + ${c}`
  return p || c || null
}
