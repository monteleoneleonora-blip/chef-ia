import { cn } from '@/lib/utils'
import { EQUIPMENT_LIST } from '@/constants/equipment'

/**
 * Sélection des équipements de cuisine disponibles.
 */
export default function EquipmentSelector({ selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {EQUIPMENT_LIST.map(({ key, label, emoji }) => {
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
