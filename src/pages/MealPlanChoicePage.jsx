import { useState } from 'react'
import {
  Sparkles, CalendarDays, ChefHat, Minus, Plus,
  Coffee, Sun, Moon, ArrowRight, Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFamilyStore } from '@/store/useFamilyStore'
import RobotChef from '@/components/mascot/RobotChef'

/**
 * MealPlanChoicePage — étape intermédiaire entre la création du profil famille
 * et l'accueil de l'application.
 *
 * L'utilisateur choisit :
 * 1. Le mode : semaine de batch cooking ou des recettes libres
 * 2. Pour chaque repas (petit-déj, déjeuner, dîner) :
 *    - Activer / désactiver ce repas
 *    - Nombre de recettes à générer
 *    - Quels membres de la famille mangent à ce repas
 *
 * Props :
 * - onComplete({ mode, meals }) : appelé quand l'utilisateur valide
 *   mode  : 'batchcooking' | 'recipes'
 *   meals : { breakfast, lunch, dinner } chacun { enabled, count, memberIds[] }
 */
export default function MealPlanChoicePage({ onComplete }) {
  const members = useFamilyStore(s => s.profile.members ?? [])

  const [mode, setMode] = useState(null) // 'batchcooking' | 'recipes'

  const allIds = members.map(m => m.id)

  const [meals, setMeals] = useState({
    breakfast: { enabled: false, count: 5, memberIds: allIds },
    lunch:     { enabled: true,  count: 5, memberIds: allIds },
    dinner:    { enabled: true,  count: 7, memberIds: allIds },
  })

  const updateMeal = (key, patch) =>
    setMeals(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }))

  const toggleMember = (mealKey, memberId) => {
    const ids = meals[mealKey].memberIds
    const next = ids.includes(memberId)
      ? ids.filter(id => id !== memberId)
      : [...ids, memberId]
    // Toujours au moins 1 membre
    if (next.length === 0) return
    updateMeal(mealKey, { memberIds: next })
  }

  const anyEnabled = Object.values(meals).some(m => m.enabled)
  const canSubmit  = mode !== null && anyEnabled

  const handleSubmit = () => {
    if (!canSubmit) return
    onComplete({ mode, meals })
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background overflow-y-auto">
      <div className="mx-auto max-w-[560px] px-4 pt-8 pb-16 space-y-8">

        {/* ── En-tête ─────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center gap-2">
          <RobotChef expression="happy" size="md" />
          <h1 className="font-display text-[24px] text-dolce-blue-deep tracking-tight leading-tight mt-1">
            Que souhaitez-vous créer&nbsp;?
          </h1>
          <p className="text-sm text-muted-foreground max-w-[320px] leading-relaxed">
            Choisissez un mode, puis configurez vos repas.
          </p>
        </div>

        {/* ── Choix du mode ───────────────────────────────────────── */}
        <section aria-labelledby="mode-title">
          <p id="mode-title" className="text-[10px] font-bold uppercase tracking-wider text-dolce-blue-deep/50 mb-3">
            Mode de génération
          </p>
          <div className="grid grid-cols-2 gap-3">
            <ModeCard
              selected={mode === 'batchcooking'}
              onSelect={() => setMode('batchcooking')}
              icon={<CalendarDays className="h-6 w-6" />}
              title="Semaine de batch cooking"
              description="7 jours de repas préparés en une fois, optimisés pour gagner du temps."
            />
            <ModeCard
              selected={mode === 'recipes'}
              onSelect={() => setMode('recipes')}
              icon={<ChefHat className="h-6 w-6" />}
              title="Créer des recettes"
              description="Générez les recettes de votre choix, au fil de vos envies."
            />
          </div>
        </section>

        {/* ── Configuration des repas ──────────────────────────────── */}
        <section aria-labelledby="meals-title">
          <p id="meals-title" className="text-[10px] font-bold uppercase tracking-wider text-dolce-blue-deep/50 mb-3">
            Configuration des repas
          </p>
          <div className="space-y-3">
            <MealRow
              mealKey="breakfast"
              icon={<Coffee className="h-4 w-4" />}
              label="Petit-déjeuner"
              meal={meals.breakfast}
              members={members}
              onToggle={() => updateMeal('breakfast', { enabled: !meals.breakfast.enabled })}
              onCountChange={(count) => updateMeal('breakfast', { count })}
              onToggleMember={(id) => toggleMember('breakfast', id)}
            />
            <MealRow
              mealKey="lunch"
              icon={<Sun className="h-4 w-4" />}
              label="Déjeuner"
              meal={meals.lunch}
              members={members}
              onToggle={() => updateMeal('lunch', { enabled: !meals.lunch.enabled })}
              onCountChange={(count) => updateMeal('lunch', { count })}
              onToggleMember={(id) => toggleMember('lunch', id)}
            />
            <MealRow
              mealKey="dinner"
              icon={<Moon className="h-4 w-4" />}
              label="Dîner"
              meal={meals.dinner}
              members={members}
              onToggle={() => updateMeal('dinner', { enabled: !meals.dinner.enabled })}
              onCountChange={(count) => updateMeal('dinner', { count })}
              onToggleMember={(id) => toggleMember('dinner', id)}
            />
          </div>
        </section>

        {/* ── Validation ──────────────────────────────────────────── */}
        <div className="space-y-3">
          {!mode && (
            <p className="text-center text-xs text-muted-foreground">
              Choisissez un mode pour continuer
            </p>
          )}
          {mode && !anyEnabled && (
            <p className="text-center text-xs text-muted-foreground">
              Activez au moins un type de repas
            </p>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              'w-full inline-flex items-center justify-center gap-2 h-13 rounded-2xl px-6',
              'text-sm font-bold tracking-wide transition-all',
              canSubmit
                ? [
                    'bg-dolce-blue-deep text-dolce-yellow',
                    'shadow-[0_8px_22px_-12px_rgba(36,40,140,0.55)]',
                    'hover:shadow-[0_12px_26px_-12px_rgba(36,40,140,0.65)] hover:-translate-y-px',
                    'active:translate-y-0',
                  ]
                : 'bg-dolce-blue-deep/30 text-dolce-yellow/50 cursor-not-allowed',
            )}
          >
            <Sparkles className="h-4 w-4" />
            Générer mes recettes
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  )
}

/* ── Carte de mode ─────────────────────────────────────────────────── */
function ModeCard({ selected, onSelect, icon, title, description }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative text-left rounded-3xl border p-4 transition-all flex flex-col gap-3',
        selected
          ? 'bg-dolce-blue-deep text-white border-dolce-blue-deep shadow-[0_8px_22px_-12px_rgba(36,40,140,0.45)]'
          : 'bg-white text-dolce-blue-deep border-dolce-blue-deep/15 hover:border-dolce-blue-deep/35 hover:bg-dolce-yellow-soft/40',
      )}
    >
      {/* Checkmark sélection */}
      {selected && (
        <span className="absolute top-3 right-3 h-5 w-5 rounded-full bg-dolce-yellow flex items-center justify-center shrink-0">
          <Check className="h-3 w-3 text-dolce-blue-deep" strokeWidth={3} />
        </span>
      )}

      {/* Icône */}
      <span className={cn(
        'h-10 w-10 rounded-2xl flex items-center justify-center',
        selected ? 'bg-white/15' : 'bg-dolce-yellow-soft border border-dolce-blue-deep/10',
      )}>
        <span className={selected ? 'text-dolce-yellow' : 'text-dolce-blue-deep'}>
          {icon}
        </span>
      </span>

      <div>
        <p className={cn(
          'font-display text-[14px] leading-snug tracking-tight',
          selected ? 'text-dolce-yellow' : 'text-dolce-blue-deep',
        )}>
          {title}
        </p>
        <p className={cn(
          'text-[11px] mt-1 leading-relaxed',
          selected ? 'text-white/75' : 'text-muted-foreground',
        )}>
          {description}
        </p>
      </div>
    </button>
  )
}

/* ── Ligne de repas ────────────────────────────────────────────────── */
function MealRow({ icon, label, meal, members, onToggle, onCountChange, onToggleMember }) {
  return (
    <div className={cn(
      'rounded-2xl border transition-all overflow-hidden',
      meal.enabled
        ? 'bg-white border-dolce-blue-deep/20 shadow-[0_2px_12px_-6px_rgba(36,40,140,0.12)]'
        : 'bg-white/50 border-dolce-blue-deep/8',
    )}>
      {/* ── En-tête du repas ── */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Toggle on/off */}
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={meal.enabled}
          className={cn(
            'relative h-6 w-11 rounded-full border-2 transition-all shrink-0',
            meal.enabled
              ? 'bg-dolce-blue-deep border-dolce-blue-deep'
              : 'bg-white border-dolce-blue-deep/20',
          )}
        >
          <span className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all',
            meal.enabled ? 'left-[calc(100%-18px)]' : 'left-0.5',
          )} />
        </button>

        {/* Icône + label */}
        <span className={cn(
          'flex items-center gap-1.5 flex-1 font-semibold text-sm transition-colors',
          meal.enabled ? 'text-dolce-blue-deep' : 'text-dolce-blue-deep/35',
        )}>
          <span className={meal.enabled ? 'text-dolce-blue-deep' : 'text-dolce-blue-deep/30'}>
            {icon}
          </span>
          {label}
        </span>

        {/* Compteur de recettes */}
        {meal.enabled && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onCountChange(Math.max(1, meal.count - 1))}
              className="h-7 w-7 rounded-xl border border-dolce-blue-deep/15 bg-white flex items-center justify-center text-dolce-blue-deep hover:bg-dolce-yellow-soft transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-sm font-bold text-dolce-blue-deep tabular-nums">
              {meal.count}
            </span>
            <button
              type="button"
              onClick={() => onCountChange(Math.min(21, meal.count + 1))}
              className="h-7 w-7 rounded-xl border border-dolce-blue-deep/15 bg-white flex items-center justify-center text-dolce-blue-deep hover:bg-dolce-yellow-soft transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
            <span className="text-[10px] text-muted-foreground font-medium">
              {meal.count > 1 ? 'recettes' : 'recette'}
            </span>
          </div>
        )}
      </div>

      {/* ── Membres présents à ce repas ── */}
      {meal.enabled && members.length > 0 && (
        <div className="px-4 pb-3 border-t border-dolce-blue-deep/6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-dolce-blue-deep/45 mt-2.5 mb-2">
            Qui mange à ce repas ?
          </p>
          <div className="flex flex-wrap gap-1.5">
            {members.map(member => {
              const active = meal.memberIds.includes(member.id)
              const name   = member.name?.trim() ||
                             (member.kind === 'child' ? 'Enfant' : 'Adulte')
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => onToggleMember(member.id)}
                  className={cn(
                    'inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-[12px] font-semibold border transition-all',
                    active
                      ? 'bg-dolce-blue-deep text-dolce-yellow border-dolce-blue-deep'
                      : 'bg-white text-dolce-blue-deep/50 border-dolce-blue-deep/15 hover:border-dolce-blue-deep/30',
                  )}
                >
                  {active && <Check className="h-3 w-3" strokeWidth={3} />}
                  {name}
                  {member.kind === 'child' && member.age != null && (
                    <span className={cn('text-[10px]', active ? 'text-dolce-yellow/70' : 'text-muted-foreground')}>
                      {member.age} ans
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
