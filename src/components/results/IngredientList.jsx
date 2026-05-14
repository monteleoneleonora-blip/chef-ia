import { useState } from 'react'
import { cn } from '@/lib/utils'

const INGREDIENT_EMOJI = {
  // Viandes
  'boeuf': '🥩', 'veau': '🥩', 'porc': '🥩', 'poulet': '🍗', 'canard': '🦆',
  'agneau': '🍖', 'dinde': '🍗', 'jambon': '🥓', 'lardons': '🥓',
  // Poissons
  'saumon': '🐟', 'cabillaud': '🐠', 'sole': '🐡', 'dorade': '🐟', 'thon': '🐟',
  'crevettes': '🦐', 'moules': '🦪', 'saint-jacques': '🦪', 'coquille': '🦪',
  'poulpe': '🐙', 'homard': '🦞', 'gambas': '🦐', 'bar': '🐟',
  // Légumes
  'tomate': '🍅', 'oignon': '🧅', 'ail': '🧄', 'carotte': '🥕', 'courgette': '🥒',
  'aubergine': '🍆', 'poivron': '🫑', 'épinard': '🥬', 'salade': '🥗',
  'champignon': '🍄', 'avocat': '🥑', 'brocoli': '🥦',
  'chou': '🥬', 'poireau': '🌿', 'betterave': '🟣', 'fenouil': '🌿',
  // Féculents
  'pâte': '🍝', 'spaghetti': '🍝', 'riz': '🍚', 'quinoa': '🌾',
  'pomme de terre': '🥔', 'patate': '🥔', 'farine': '🌾', 'pain': '🍞', 'brioche': '🥐',
  // Laitiers
  'beurre': '🧈', 'lait': '🥛', 'crème': '🥛', 'fromage': '🧀', 'oeuf': '🥚',
  'oeuf entier': '🥚', 'yaourt': '🥛', 'feta': '🧀', 'parmesan': '🧀', 'mozzarella': '🧀', 'halloumi': '🧀',
  // Épices & condiments
  'sel': '🧂', 'poivre': '🌶️', 'citron': '🍋', 'huile': '🫙', 'vinaigre': '🫙',
  'moutarde': '🫙', 'sauce': '🫙', 'miel': '🍯', 'sucre': '🍬', 'tahini': '🫙',
  // Herbes
  'persil': '🌿', 'basilic': '🌿', 'thym': '🌿', 'romarin': '🌿', 'herbe': '🌿', 'aneth': '🌿',
  // Fruits
  'pomme': '🍎', 'banane': '🍌', 'fraise': '🍓', 'myrtille': '🫐',
  'mangue': '🥭', 'ananas': '🍍', 'orange': '🍊', 'citron vert': '🍋',
  'grenade': '🍎', 'pastèque': '🍉',
  // Divers
  'bouillon': '🍲', 'vin': '🍷', 'bière': '🍺', 'chocolat': '🍫',
  'amande': '🌰', 'noix': '🌰', 'noisette': '🌰', 'cacahuète': '🥜',
}

function getEmoji(ingredientName) {
  const lower = ingredientName.toLowerCase()
  for (const [key, emoji] of Object.entries(INGREDIENT_EMOJI)) {
    if (lower.includes(key)) return emoji
  }
  return '·'
}

export default function IngredientList({ ingredients, checkable = true }) {
  const [checked, setChecked] = useState(new Set())

  const toggle = (idx) =>
    setChecked(prev => {
      const next = new Set(prev)
      next.has(idx) ? next.delete(idx) : next.add(idx)
      return next
    })

  return (
    <ul className="space-y-1.5">
      {ingredients.map((item, index) => {
        const done  = checked.has(index)
        const emoji = getEmoji(item.name)
        return (
          <li key={`${item.name}-${index}`}>
            <button
              type="button"
              onClick={() => checkable && toggle(index)}
              className={cn(
                'w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-all text-left group',
                checkable && 'hover:bg-muted/50 cursor-pointer',
                done && 'opacity-45'
              )}
            >
              {/* Checkbox visuelle */}
              {checkable && (
                <span className={cn(
                  'shrink-0 h-4 w-4 rounded-[4px] border-2 flex items-center justify-center transition-all',
                  done
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-border group-hover:border-emerald-400'
                )}>
                  {done && (
                    <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 10 8">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
              )}

              {/* Emoji */}
              <span className="text-sm shrink-0 w-4 text-center leading-none">
                {emoji !== '·' ? emoji : <span className="text-muted-foreground/40 text-base">·</span>}
              </span>

              {/* Nom */}
              <span className={cn(
                'flex-1 text-xs leading-snug transition-colors',
                done ? 'line-through text-muted-foreground/50' : 'text-foreground'
              )}>
                {item.name}
              </span>

              {/* Quantité */}
              {(item.quantity || item.unit) && (
                <span className={cn(
                  'text-[11px] font-semibold tabular-nums shrink-0 px-1.5 py-0.5 rounded-md transition-colors',
                  done
                    ? 'bg-muted/30 text-muted-foreground/40'
                    : 'bg-muted text-muted-foreground'
                )}>
                  {[item.quantity, item.unit].filter(Boolean).join('\u00a0')}
                </span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
