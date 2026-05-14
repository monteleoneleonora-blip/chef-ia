import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { n: 1, label: 'Configurer' },
  { n: 2, label: 'Choisir les recettes' },
  { n: 3, label: 'Liste de courses' },
]

export default function FlowStepper({ currentStep }) {
  return (
    <div className="bg-white/50 backdrop-blur-sm border-b border-white/60 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 py-3">
        <div className="flex items-center">
          {STEPS.map((step, i) => {
            const done   = step.n < currentStep
            const active = step.n === currentStep
            return (
              <div key={step.n} className="flex items-center flex-1 min-w-0 last:flex-none">
                <div className="flex items-center gap-2 shrink-0">
                  <div className={cn(
                    'h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-extrabold border-2 transition-all shadow-sm',
                    done   && 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-200',
                    active && 'bg-white border-emerald-500 text-emerald-600 shadow-emerald-100',
                    !done && !active && 'bg-white/60 border-border/30 text-muted-foreground/30',
                  )}>
                    {done ? <Check className="h-3 w-3" /> : step.n}
                  </div>
                  <span className={cn(
                    'text-xs font-bold whitespace-nowrap hidden sm:block transition-colors',
                    done   && 'text-emerald-600',
                    active && 'text-emerald-800',
                    !done && !active && 'text-muted-foreground/30',
                  )}>
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn(
                    'flex-1 h-0.5 mx-3 rounded-full transition-colors',
                    done ? 'bg-emerald-300' : 'bg-border/30',
                  )} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
