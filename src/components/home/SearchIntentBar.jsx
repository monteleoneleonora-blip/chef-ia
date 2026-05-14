import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * SearchIntentBar — fausse barre de recherche + chips fines.
 *
 * Conçue comme une "porte d'entrée" éditoriale, pas comme un champ technique :
 * - apparence raffinée (ivoire, bordure subtile, ombre très douce)
 * - clic = navigation vers la banque (focus search réel à l'arrivée)
 * - chips horizontales fines, scrollables sur mobile
 *
 * Pas de gros bouton ni d'aplat agressif : tout reste léger et chaleureux.
 */
export default function SearchIntentBar({
  placeholder = 'Rechercher une recette, une envie, un ingrédient…',
  chips = [],
  onSearch,
  onChipClick,
}) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onSearch}
        aria-label="Ouvrir la recherche de recettes"
        className={cn(
          'group w-full flex items-center gap-3 h-12 px-4 rounded-2xl',
          'bg-white/90 border border-dolce-blue-deep/10',
          'shadow-[0_4px_18px_-12px_rgba(36,40,140,0.18)]',
          'hover:border-dolce-blue-deep/30 hover:bg-white transition-all',
          'text-left',
        )}
      >
        <Search className="h-4 w-4 text-dolce-blue-deep/50 shrink-0" />
        <span className="flex-1 text-sm text-muted-foreground/80 truncate">
          {placeholder}
        </span>
      </button>

      {chips.length > 0 && (
        <div
          role="list"
          aria-label="Filtres rapides"
          className={cn(
            'flex items-center gap-1.5 overflow-x-auto -mx-4 px-4 pb-1',
            'scroll-smooth snap-x snap-mandatory',
          )}
          style={{ scrollbarWidth: 'none' }}
        >
          {chips.map(chip => (
            <button
              key={chip.id}
              type="button"
              role="listitem"
              onClick={() => onChipClick?.(chip)}
              className={cn(
                'snap-start shrink-0 inline-flex items-center gap-1.5',
                'h-8 px-3 rounded-full text-xs font-semibold',
                'bg-white/90 border border-dolce-blue-deep/15 text-dolce-blue-deep',
                'hover:bg-dolce-yellow-soft hover:border-dolce-blue-deep/30',
                'transition-colors',
              )}
            >
              {chip.emoji && <span className="text-sm leading-none">{chip.emoji}</span>}
              {chip.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
