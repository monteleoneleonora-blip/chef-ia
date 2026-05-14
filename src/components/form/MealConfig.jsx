import { cn } from '@/lib/utils'
import NumberStepper from './NumberStepper'

const MEAL_TYPES = [
  {
    key:   'breakfast',
    label: 'Petit-déj',
    emoji: '🥐',
    hint:  'Matin',
    active: 'border-amber-400 bg-gradient-to-b from-amber-50 to-orange-50 shadow-md shadow-amber-100',
    count:  'text-amber-600 bg-amber-100',
    dot:    'bg-amber-400',
  },
  {
    key:   'lunch',
    label: 'Déjeuner',
    emoji: '🥗',
    hint:  'Midi',
    active: 'border-emerald-400 bg-gradient-to-b from-emerald-50 to-teal-50 shadow-md shadow-emerald-100',
    count:  'text-emerald-600 bg-emerald-100',
    dot:    'bg-emerald-400',
  },
  {
    key:   'dinner',
    label: 'Dîner',
    emoji: '🍝',
    hint:  'Soir',
    active: 'border-violet-400 bg-gradient-to-b from-violet-50 to-indigo-50 shadow-md shadow-violet-100',
    count:  'text-violet-600 bg-violet-100',
    dot:    'bg-violet-400',
  },
]

export default function MealConfig({ mealCounts, totalPeople, onMealTypeCountChange, onTotalPeopleChange }) {
  const totalMeals = Object.values(mealCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-4">
      {/* Cartes repas */}
      <div className="grid grid-cols-3 gap-2.5">
        {MEAL_TYPES.map(({ key, label, emoji, hint, active, count, dot }) => {
          const n      = mealCounts[key]
          const isOn   = n > 0

          return (
            <div
              key={key}
              className={cn(
                'flex flex-col items-center gap-2.5 py-4 px-2 rounded-2xl border-2 transition-all duration-200',
                isOn ? active : 'border-border/50 bg-card hover:border-muted-foreground/20'
              )}
            >
              <span className="text-3xl leading-none select-none">{emoji}</span>
              <div className="text-center leading-tight">
                <p className="text-xs font-bold">{label}</p>
                <p className="text-[10px] text-muted-foreground">{hint}</p>
              </div>
              {isOn ? (
                <span className={cn('text-sm font-extrabold tabular-nums px-2.5 py-0.5 rounded-full', count)}>
                  {n}
                </span>
              ) : (
                <span className="h-6 w-6 rounded-full border-2 border-dashed border-border/60" />
              )}
              <NumberStepper
                value={n}
                min={0}
                max={10}
                onChange={(v) => onMealTypeCountChange(key, v)}
              />
            </div>
          )
        })}
      </div>

      {/* Total badge */}
      {totalMeals > 0 && (
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-primary/8 px-3 py-1.5 rounded-full border border-primary/20">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {totalMeals} recette{totalMeals > 1 ? 's' : ''} au total
          </span>
        </div>
      )}

      {/* Nombre de personnes */}
      <div className="flex items-center justify-between py-3 px-4 rounded-2xl bg-muted/50 border border-border/40">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👨‍👩‍👧‍👦</span>
          <div>
            <p className="text-sm font-semibold">Personnes</p>
            <p className="text-xs text-muted-foreground">Adultes + enfants</p>
          </div>
        </div>
        <NumberStepper value={totalPeople} min={1} max={20} onChange={onTotalPeopleChange} />
      </div>
    </div>
  )
}
