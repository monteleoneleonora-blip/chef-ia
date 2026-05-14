import { cn } from '@/lib/utils'

const STEP_COLORS = [
  { bg: 'bg-emerald-500', light: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
  { bg: 'bg-teal-500',    light: 'bg-teal-50 border-teal-200 text-teal-900'         },
  { bg: 'bg-sky-500',     light: 'bg-sky-50 border-sky-200 text-sky-900'            },
  { bg: 'bg-violet-500',  light: 'bg-violet-50 border-violet-200 text-violet-900'   },
  { bg: 'bg-amber-500',   light: 'bg-amber-50 border-amber-200 text-amber-900'      },
  { bg: 'bg-rose-500',    light: 'bg-rose-50 border-rose-200 text-rose-900'         },
]

export default function StepsList({ steps, activeIndex = -1 }) {
  return (
    <ol className="relative space-y-3">
      {/* Ligne de progression verticale */}
      {steps.length > 1 && (
        <div className="absolute left-[14px] top-5 bottom-2 w-px bg-gradient-to-b from-border via-border/50 to-transparent" />
      )}

      {steps.map((step, index) => {
        const isActive  = activeIndex === index
        const isDone    = activeIndex > index
        const color     = STEP_COLORS[index % STEP_COLORS.length]

        return (
          <li
            key={index}
            className={cn(
              'relative flex gap-3 items-start transition-all duration-300',
              isActive && 'scale-[1.01]'
            )}
          >
            {/* Numéro */}
            <span className={cn(
              'relative z-10 shrink-0 flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold transition-all duration-300',
              isActive
                ? cn(color.bg, 'text-white shadow-md scale-110 ring-2 ring-offset-2 ring-current/30')
                : isDone
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-muted text-muted-foreground'
            )}>
              {isDone ? (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 10 8">
                  <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                index + 1
              )}
            </span>

            {/* Texte */}
            <div className={cn(
              'flex-1 rounded-xl px-3 py-2 transition-all duration-300 border',
              isActive
                ? cn('shadow-sm', color.light)
                : isDone
                ? 'bg-emerald-50/50 border-emerald-100/50 opacity-60'
                : 'bg-muted/30 border-transparent'
            )}>
              <p className={cn(
                'text-sm leading-relaxed',
                isActive ? 'font-medium' : 'text-foreground/90'
              )}>
                {step}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
