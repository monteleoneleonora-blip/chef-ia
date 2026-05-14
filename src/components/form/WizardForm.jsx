import { useState, useRef } from 'react'
import { ChevronRight, ChevronLeft, Users, Minus, Plus, X, Check, Sparkles, Settings2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CUISINE_TYPES } from '@/constants/cuisines'
import AdvancedPanel from './AdvancedPanel'

// ── Données ──────────────────────────────────────────────────────────
const MEAL_CARDS = [
  {
    key: 'breakfast',
    emoji: '🥐',
    label: 'Petit-déjeuner',
    sub: 'Matin',
    gradient: 'from-amber-400 to-orange-300',
    ring: 'ring-amber-400',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    activeBg: 'bg-gradient-to-br from-amber-400 to-orange-400',
    dot: 'bg-amber-400',
  },
  {
    key: 'lunch',
    emoji: '🥗',
    label: 'Déjeuner',
    sub: 'Midi',
    gradient: 'from-emerald-400 to-teal-300',
    ring: 'ring-emerald-400',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    activeBg: 'bg-gradient-to-br from-emerald-400 to-teal-400',
    dot: 'bg-emerald-400',
  },
  {
    key: 'dinner',
    emoji: '🍝',
    label: 'Dîner',
    sub: 'Soir',
    gradient: 'from-violet-400 to-indigo-300',
    ring: 'ring-violet-400',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    activeBg: 'bg-gradient-to-br from-violet-400 to-indigo-400',
    dot: 'bg-violet-400',
  },
]

const GLOBAL_DIETS = [
  { key: 'Végétarien',   emoji: '🥦' },
  { key: 'Vegan',        emoji: '🌱' },
  { key: 'Sans gluten',  emoji: '🌾' },
  { key: 'Sans lactose', emoji: '🥛' },
  { key: 'Keto',         emoji: '🥑' },
  { key: 'Protéiné',     emoji: '💪' },
  { key: 'Méditerranéen',emoji: '🫒' },
  { key: 'Paléo',        emoji: '🦴' },
]

// ── Sous-composants ───────────────────────────────────────────────────

function StepDots({ current, total, onGo }) {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {Array.from({ length: total }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          type="button"
          onClick={() => n < current && onGo(n)}
          className={cn(
            'rounded-full transition-all duration-300',
            n === current
              ? 'h-2 w-8 bg-emerald-500'
              : n < current
              ? 'h-2 w-2 bg-emerald-300 cursor-pointer'
              : 'h-2 w-2 bg-border/50 cursor-default'
          )}
        />
      ))}
    </div>
  )
}

function NumericStepper({ value, min = 0, max = 20, onChange, size = 'md' }) {
  const sm = size === 'sm'
  return (
    <div className={cn(
      'flex items-center rounded-2xl bg-black/10',
      sm ? 'gap-0' : 'gap-0'
    )}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(
          'rounded-l-2xl flex items-center justify-center text-white font-bold transition-all active:scale-95',
          sm ? 'h-7 w-7 text-sm' : 'h-9 w-9 text-base',
          value <= min ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/10'
        )}
      >
        <Minus className={sm ? 'h-3 w-3' : 'h-4 w-4'} />
      </button>
      <span className={cn(
        'font-extrabold text-white select-none text-center',
        sm ? 'w-7 text-sm' : 'w-10 text-xl'
      )}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(
          'rounded-r-2xl flex items-center justify-center text-white font-bold transition-all active:scale-95',
          sm ? 'h-7 w-7 text-sm' : 'h-9 w-9 text-base',
          value >= max ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/10'
        )}
      >
        <Plus className={sm ? 'h-3 w-3' : 'h-4 w-4'} />
      </button>
    </div>
  )
}

// ── Étape 1 : Repas & personnes ──────────────────────────────────────
function Step1({ formData, setMealTypeCount, setTotalPeople }) {
  const { mealCounts, totalPeople } = formData
  const totalMeals = Object.values(mealCounts).reduce((s, n) => s + n, 0)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-extrabold text-foreground">Que voulez-vous préparer ?</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Choisissez le nombre de repas par type pour la semaine.
        </p>
      </div>

      {/* Meal cards */}
      <div className="flex flex-col gap-3">
        {MEAL_CARDS.map(card => {
          const count = mealCounts[card.key] ?? 0
          const active = count > 0
          return (
            <div
              key={card.key}
              className={cn(
                'relative flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300',
                active
                  ? `${card.activeBg} border-transparent shadow-lg`
                  : `${card.bg} ${card.border} hover:shadow-md`
              )}
            >
              {/* Emoji */}
              <div className={cn(
                'text-4xl leading-none select-none transition-transform duration-200',
                active && 'scale-110'
              )}>
                {card.emoji}
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'font-bold text-sm leading-tight',
                  active ? 'text-white' : 'text-foreground'
                )}>
                  {card.label}
                </p>
                <p className={cn(
                  'text-[11px]',
                  active ? 'text-white/70' : 'text-muted-foreground'
                )}>
                  {count === 0 ? 'Non sélectionné' : `${count} recette${count > 1 ? 's' : ''}`}
                </p>
              </div>

              {/* Stepper */}
              <NumericStepper
                value={count}
                min={0}
                max={10}
                onChange={v => setMealTypeCount(card.key, v)}
              />

              {/* Dot indicator */}
              {active && (
                <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-white/60" />
              )}
            </div>
          )
        })}
      </div>

      {/* Total */}
      {totalMeals > 0 && (
        <div className="flex items-center justify-center gap-1.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700">
            {totalMeals} recette{totalMeals > 1 ? 's' : ''} configurée{totalMeals > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* People */}
      <div className="rounded-2xl border border-border/60 bg-white px-4 py-3.5 flex items-center gap-4 shadow-sm">
        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
          <Users className="h-5 w-5 text-slate-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">Pour combien de personnes ?</p>
          <p className="text-[11px] text-muted-foreground">Les quantités s'adaptent automatiquement</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setTotalPeople(Math.max(1, totalPeople - 1))}
            disabled={totalPeople <= 1}
            className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="text-xl font-extrabold w-8 text-center">{totalPeople}</span>
          <button
            type="button"
            onClick={() => setTotalPeople(Math.min(20, totalPeople + 1))}
            disabled={totalPeople >= 20}
            className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Étape 2 : Cuisines & exclusions ──────────────────────────────────
function Step2({ formData, toggleCuisine, addTag, removeTag }) {
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  function handleAddForbidden(e) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      addTag('forbiddenIngredients', input.trim().replace(/,$/, ''))
      setInput('')
    }
  }

  function handleInputBlur() {
    if (input.trim()) {
      addTag('forbiddenIngredients', input.trim())
      setInput('')
    }
  }

  const selected = formData.cuisines ?? []
  const forbidden = formData.forbiddenIngredients ?? []

  return (
    <div className="flex flex-col gap-5">
      {/* Cuisines */}
      <div>
        <h2 className="text-lg font-extrabold text-foreground">Inspiration culinaire</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Laissez vide pour tout explorer, ou sélectionnez vos préférences.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {CUISINE_TYPES.map(({ key, label, emoji }) => {
          const active = selected.includes(key)
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleCuisine(key)}
              className={cn(
                'flex flex-col items-center gap-1 py-3 rounded-2xl border text-center transition-all duration-200',
                active
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200 scale-[1.03]'
                  : 'bg-white border-border text-muted-foreground hover:border-emerald-300 hover:text-foreground hover:bg-emerald-50'
              )}
            >
              <span className="text-2xl leading-none">{emoji}</span>
              <span className="text-[11px] font-semibold leading-tight">{label}</span>
              {active && <Check className="h-3 w-3 text-white/80 -mt-0.5" />}
            </button>
          )
        })}
      </div>

      {/* Exclusions */}
      <div>
        <p className="text-sm font-bold mb-1.5">Ingrédients à éviter</p>
        <p className="text-[11px] text-muted-foreground mb-2.5">
          Allergies, intolérances… Tapez et appuyez sur Entrée.
        </p>

        {/* Tags existants */}
        {forbidden.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {forbidden.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold"
              >
                🚫 {tag}
                <button
                  type="button"
                  onClick={() => removeTag('forbiddenIngredients', i)}
                  className="ml-0.5 text-red-400 hover:text-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-200 transition-all">
          <span className="text-base">🚫</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleAddForbidden}
            onBlur={handleInputBlur}
            placeholder="gluten, noix, lactose…"
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground/50"
          />
        </div>
      </div>
    </div>
  )
}

// ── Étape 3 : Régimes alimentaires ───────────────────────────────────
function Step3({ formData, toggleMemberDiet }) {
  const firstMember = formData.familyMembers?.[0]
  const activeDiets = firstMember?.selectedDiets ?? []

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-extrabold text-foreground">Régimes alimentaires</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Optionnel — les recettes s'adapteront à vos contraintes.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {GLOBAL_DIETS.map(({ key, emoji }) => {
          const active = activeDiets.includes(key)
          return (
            <button
              key={key}
              type="button"
              onClick={() => firstMember && toggleMemberDiet(firstMember.id, key)}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all duration-200',
                active
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200'
                  : 'bg-white border-border text-foreground hover:border-emerald-300 hover:bg-emerald-50'
              )}
            >
              <span className="text-xl leading-none">{emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={cn('text-xs font-bold leading-tight', active ? 'text-white' : 'text-foreground')}>
                  {key}
                </p>
              </div>
              {active && (
                <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {activeDiets.length > 0 && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-emerald-800">Profil personnalisé actif</p>
            <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">
              {activeDiets.join(' · ')} — toutes les recettes seront compatibles.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-sky-50 border border-sky-200 px-4 py-3">
        <p className="text-xs text-sky-800 leading-relaxed">
          <span className="font-bold">Plusieurs profils ?</span>{' '}
          Les régimes par membre (Végétarien pour un enfant, Keto pour un adulte…) sont disponibles dans la configuration avancée.
        </p>
      </div>
    </div>
  )
}

// ── Composant principal ───────────────────────────────────────────────
const TOTAL_STEPS = 3

export default function WizardForm(props) {
  const [step, setStep] = useState(1)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const totalMeals = Object.values(props.formData.mealCounts ?? {}).reduce((s, n) => s + n, 0)

  function goNext() { setStep(s => Math.min(TOTAL_STEPS, s + 1)) }
  function goBack() { setStep(s => Math.max(1, s - 1)) }

  const STEP_LABELS = ['Repas', 'Préférences', 'Régimes']

  return (
    <>
    <div className="flex flex-col gap-0 rounded-3xl border border-border/30 bg-white shadow-xl shadow-black/5 overflow-hidden">

      {/* ── En-tête de progression ── */}
      <div className="px-5 pt-5 pb-4 border-b border-border/30 bg-gradient-to-r from-emerald-50/60 via-white to-teal-50/40">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
              Étape {step} sur {TOTAL_STEPS}
            </p>
            <p className="text-sm font-bold text-foreground">{STEP_LABELS[step - 1]}</p>
          </div>
          {totalMeals > 0 && (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              {totalMeals} repas
            </span>
          )}
        </div>

        {/* Barre de progression */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(n => (
            <div key={n} className="flex-1 flex items-center gap-1">
              <button
                type="button"
                onClick={() => n <= step && setStep(n)}
                className={cn(
                  'flex-1 h-1.5 rounded-full transition-all duration-400',
                  n < step  ? 'bg-emerald-500 cursor-pointer' :
                  n === step ? 'bg-emerald-400' :
                  'bg-border/40 cursor-default'
                )}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {STEP_LABELS.map((label, i) => (
            <span key={label} className={cn(
              'text-[9px] font-semibold transition-colors',
              i + 1 === step ? 'text-emerald-600' : i + 1 < step ? 'text-emerald-400' : 'text-muted-foreground/30'
            )}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Contenu de l'étape ── */}
      <div className="px-5 py-5">
        {step === 1 && (
          <Step1
            formData={props.formData}
            setMealTypeCount={props.setMealTypeCount}
            setTotalPeople={props.setTotalPeople}
          />
        )}
        {step === 2 && (
          <Step2
            formData={props.formData}
            toggleCuisine={props.toggleCuisine}
            addTag={props.addTag}
            removeTag={props.removeTag}
          />
        )}
        {step === 3 && (
          <Step3
            formData={props.formData}
            toggleMemberDiet={props.toggleMemberDiet}
          />
        )}
      </div>

      {/* ── Navigation ── */}
      <div className="px-5 pb-5 flex items-center gap-3">
        {step > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-muted/30 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour
          </button>
        ) : (
          <div className="flex-1" />
        )}

        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={goNext}
            className="flex-1 flex items-center justify-center gap-2 h-11 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.01]"
          >
            Suivant
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-2 h-11 px-5 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50 border border-border text-muted-foreground text-sm font-semibold">
            <Check className="h-4 w-4 text-emerald-500" />
            Configuration terminée !
          </div>
        )}
      </div>

      {/* Toggle Avancé */}
      <div className="px-5 pb-5 -mt-2">
        <button
          type="button"
          onClick={() => setShowAdvanced(s => !s)}
          aria-expanded={showAdvanced}
          className={cn(
            'w-full flex items-center justify-center gap-2 h-9 px-4 rounded-xl border text-xs font-bold transition-all',
            showAdvanced
              ? 'bg-primary/5 border-primary/30 text-primary'
              : 'border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground hover:bg-muted/30'
          )}
        >
          <Settings2 className="h-3.5 w-3.5" />
          {showAdvanced ? 'Masquer la configuration avancée' : 'Configuration avancée'}
          <ChevronRight className={cn(
            'h-3.5 w-3.5 transition-transform',
            showAdvanced && 'rotate-90'
          )} />
        </button>
      </div>
    </div>

    {/* Panneau avancé */}
    {showAdvanced && <AdvancedPanel {...props} />}
    </>
  )
}
