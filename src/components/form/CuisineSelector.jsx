import { cn } from '@/lib/utils'
import { CUISINE_TYPES } from '@/constants/cuisines'

/**
 * Sélection des cuisines du monde souhaitées.
 */
export default function CuisineSelector({ selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CUISINE_TYPES.map(({ key, label, emoji }) => {
        const active = selected.includes(key)
        return (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            aria-pressed={active}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all duration-150',
              active
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
            )}
          >
            <span>{emoji}</span>
            {label}
          </button>
        )
      })}
    </div>
  )
}
