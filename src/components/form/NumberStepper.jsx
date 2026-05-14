import { cn } from '@/lib/utils'
import { Minus, Plus } from 'lucide-react'

export default function NumberStepper({ value, min, max, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Diminuer"
        className={cn(
          'h-7 w-7 rounded-full flex items-center justify-center border transition-all duration-150 font-bold',
          value <= min
            ? 'border-border/30 text-muted-foreground/30 cursor-not-allowed'
            : 'border-border text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 active:scale-95'
        )}
      >
        <Minus className="h-3 w-3" />
      </button>

      <span className="w-6 text-center text-sm font-bold tabular-nums">{value}</span>

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Augmenter"
        className={cn(
          'h-7 w-7 rounded-full flex items-center justify-center border transition-all duration-150 font-bold',
          value >= max
            ? 'border-border/30 text-muted-foreground/30 cursor-not-allowed'
            : 'border-border text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 active:scale-95'
        )}
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  )
}
