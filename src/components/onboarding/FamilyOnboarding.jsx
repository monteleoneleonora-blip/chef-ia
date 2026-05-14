import { useState } from 'react'
import {
  ArrowLeft, ArrowRight, Check, X, Mail, Sparkles, Plus, Minus,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import RobotChef from '@/components/mascot/RobotChef'
import { useSubscriptionStore } from '@/store/useSubscriptionStore'
import {
  useFamilyStore, FAMILY_DIETS, FAMILY_GOALS, BUDGET_LEVELS, TIME_RANGES,
} from '@/store/useFamilyStore'

/**
 * FamilyOnboarding — wizard 3 etapes pour creer la fiche famille gratuite.
 *
 * Etape 1 : Adresse email (validation simple, pas de mot de passe)
 * Etape 2 : Fiche famille simplifiee (foyer, regimes, budget, objectif)
 * Etape 3 : Confirmation + CTA "Recevoir ma premiere recette"
 *
 * A la completion :
 * - useSubscriptionStore.registerEmail(email)  -> plan free + 3 recettes
 * - useFamilyStore.setProfile(...)             -> fiche famille
 * - onComplete() callback
 */
export default function FamilyOnboarding({ onClose, onComplete }) {
  const [step, setStep] = useState(0)
  const [email, setEmail]       = useState('')
  const [emailError, setEmailError] = useState('')

  const registerEmail = useSubscriptionStore(s => s.registerEmail)
  const familyStore   = useFamilyStore()

  // Etat local de la fiche famille (s'applique au store qu'a la fin)
  const [householdName, setHouseholdName] = useState(familyStore.profile.householdName ?? '')
  const [adults,        setAdults]        = useState(familyStore.profile.adults ?? 2)
  const [children,      setChildren]      = useState(familyStore.profile.children ?? [])
  const [diets,         setDiets]         = useState(familyStore.profile.diets ?? [])
  const [allergies,     setAllergies]     = useState(familyStore.profile.allergies ?? [])
  const [budgetLevel,   setBudgetLevel]   = useState(familyStore.profile.budgetLevel ?? null)
  const [availableTime, setAvailableTime] = useState(familyStore.profile.availableTime ?? null)
  const [mainGoal,      setMainGoal]      = useState(familyStore.profile.mainGoal ?? null)

  const next = () => setStep(s => Math.min(2, s + 1))
  const back = () => setStep(s => Math.max(0, s - 1))

  // ── Etape 1 ──────────────────────────────────────────────────────
  const validateEmail = (raw) => {
    const value = (raw ?? '').trim()
    if (!value) return 'Une adresse email est requise.'
    // RFC 5322 simplifie
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Adresse email invalide.'
    return ''
  }

  const handleEmailContinue = () => {
    const err = validateEmail(email)
    if (err) { setEmailError(err); return }
    setEmailError('')
    next()
  }

  // ── Etape 2 ──────────────────────────────────────────────────────
  const addChild = () => {
    setChildren(prev => [...prev, { id: `c-${Date.now()}-${Math.random().toString(36).slice(2,5)}`, age: 6 }])
  }
  const removeChild = (id) => setChildren(prev => prev.filter(c => c.id !== id))
  const setChildAge = (id, age) =>
    setChildren(prev => prev.map(c => c.id === id ? { ...c, age } : c))

  const toggleDiet = (d) =>
    setDiets(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])

  const addAllergy = (text) => {
    const v = text.trim()
    if (!v) return
    if (allergies.includes(v)) return
    setAllergies(prev => [...prev, v])
  }
  const removeAllergy = (item) => setAllergies(prev => prev.filter(a => a !== item))

  // ── Finalisation ─────────────────────────────────────────────────
  const handleComplete = () => {
    registerEmail(email)
    familyStore.setProfile({
      householdName: householdName.trim(),
      adults,
      children,
      diets,
      allergies,
      dislikedIngredients: [],
      budgetLevel,
      availableTime,
      mainGoal,
    })
    onComplete?.()
  }

  return (
    <div
      className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      {/* Header overlay */}
      <header className="sticky top-0 z-10 bg-background/85 backdrop-blur-md border-b border-dolce-blue-deep/10">
        <div className="max-w-[560px] mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={back}
              aria-label="Revenir à l'étape précédente"
              className="inline-flex items-center gap-1 h-8 px-2.5 rounded-xl text-xs font-semibold text-dolce-blue-deep hover:bg-dolce-yellow-soft transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour
            </button>
          ) : (
            <span className="text-[11px] font-bold uppercase tracking-wider text-dolce-blue-deep/60">
              Étape {step + 1} / 3
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le formulaire"
            className="h-8 w-8 rounded-full bg-white border border-dolce-blue-deep/15 flex items-center justify-center text-dolce-blue-deep hover:bg-dolce-yellow-soft transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-w-[560px] mx-auto px-4 pb-3 flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-all',
                i <= step ? 'bg-dolce-blue-deep' : 'bg-dolce-blue-deep/10'
              )}
            />
          ))}
        </div>
      </header>

      {/* Body */}
      <div className="max-w-[560px] mx-auto px-4 pt-6 pb-10">
        {step === 0 && (
          <StepEmail
            email={email}
            setEmail={setEmail}
            error={emailError}
            onContinue={handleEmailContinue}
          />
        )}
        {step === 1 && (
          <StepFamily
            householdName={householdName} setHouseholdName={setHouseholdName}
            adults={adults} setAdults={setAdults}
            children={children} addChild={addChild} removeChild={removeChild} setChildAge={setChildAge}
            diets={diets} toggleDiet={toggleDiet}
            allergies={allergies} addAllergy={addAllergy} removeAllergy={removeAllergy}
            budgetLevel={budgetLevel} setBudgetLevel={setBudgetLevel}
            availableTime={availableTime} setAvailableTime={setAvailableTime}
            mainGoal={mainGoal} setMainGoal={setMainGoal}
            onContinue={next}
          />
        )}
        {step === 2 && (
          <StepConfirm
            householdName={householdName}
            adults={adults}
            children={children}
            mainGoal={mainGoal}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  )
}

/* ─────────────────────── Etape 1 — Email ─────────────────────── */

function StepEmail({ email, setEmail, error, onContinue }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="shrink-0 h-12 w-12 rounded-2xl bg-dolce-yellow-soft border border-dolce-blue-deep/10 flex items-center justify-center text-dolce-blue-deep">
          <Mail className="h-5 w-5" strokeWidth={2.1} />
        </div>
        <div>
          <p className="font-script text-[24px] text-dolce-blue-deep leading-none">Iniziamo</p>
          <h1 className="font-display text-[22px] text-dolce-blue-deep tracking-tight leading-tight mt-0.5">
            Votre adresse email
          </h1>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Une adresse mail suffit pour sauvegarder votre fiche famille et vos
        <span className="font-semibold text-dolce-blue-deep"> 3 recettes offertes</span>.
      </p>

      <label className="block">
        <span className="sr-only">Adresse email</span>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onContinue() }}
          placeholder="vous@exemple.fr"
          className={cn(
            'w-full h-12 px-4 rounded-2xl text-sm bg-white',
            'border border-dolce-blue-deep/15 focus:border-dolce-blue-deep/40',
            'shadow-sm focus:shadow-md transition-shadow outline-none',
          )}
        />
      </label>
      {error && (
        <p className="text-xs text-destructive font-semibold" role="alert">{error}</p>
      )}

      <button
        type="button"
        onClick={onContinue}
        className={cn(
          'inline-flex items-center justify-center gap-2 w-full h-12 rounded-2xl px-4',
          'bg-dolce-blue-deep text-dolce-yellow text-sm font-bold tracking-wide',
          'shadow-[0_8px_22px_-12px_rgba(36,40,140,0.55)]',
          'hover:shadow-[0_12px_26px_-12px_rgba(36,40,140,0.65)] hover:-translate-y-px transition-all',
        )}
      >
        Continuer
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
        Aucun mot de passe requis pour démarrer. Vous pourrez en créer un plus tard si vous le souhaitez.
      </p>
    </div>
  )
}

/* ─────────────────────── Etape 2 — Fiche famille ─────────────────────── */

function StepFamily(props) {
  const {
    householdName, setHouseholdName,
    adults, setAdults,
    children, addChild, removeChild, setChildAge,
    diets, toggleDiet,
    allergies, addAllergy, removeAllergy,
    budgetLevel, setBudgetLevel,
    availableTime, setAvailableTime,
    mainGoal, setMainGoal,
    onContinue,
  } = props

  const [allergyInput, setAllergyInput] = useState('')

  return (
    <div className="space-y-7">
      <div>
        <p className="font-script text-[24px] text-dolce-blue-deep leading-none">la famiglia</p>
        <h1 className="font-display text-[22px] text-dolce-blue-deep tracking-tight leading-tight mt-1">
          Présentez votre foyer
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
          Plus Chef IA connaît votre famille, mieux il vous propose quoi cuisiner.
        </p>
      </div>

      {/* Nom du foyer */}
      <FieldGroup label="Nom du foyer (optionnel)">
        <input
          type="text"
          value={householdName}
          onChange={e => setHouseholdName(e.target.value)}
          placeholder="Ex. La famille Rossi"
          className="w-full h-11 px-4 rounded-2xl text-sm bg-white border border-dolce-blue-deep/15 focus:border-dolce-blue-deep/40 shadow-sm focus:shadow-md outline-none transition-shadow"
        />
      </FieldGroup>

      {/* Adultes */}
      <FieldGroup label="Adultes">
        <Counter value={adults} onChange={setAdults} min={1} max={10} suffix={adults > 1 ? 'adultes' : 'adulte'} />
      </FieldGroup>

      {/* Enfants */}
      <FieldGroup
        label="Enfants"
        action={
          <button
            type="button"
            onClick={addChild}
            className="inline-flex items-center gap-1 text-xs font-semibold text-dolce-blue-deep hover:text-dolce-blue transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Ajouter un enfant
          </button>
        }
      >
        {children.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">Pas d'enfants au foyer.</p>
        ) : (
          <div className="space-y-2">
            {children.map(child => (
              <div key={child.id} className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-dolce-blue-deep/10">
                <span className="text-[11px] font-semibold text-dolce-blue-deep/70 mr-1">Âge</span>
                <Counter
                  value={child.age}
                  onChange={(v) => setChildAge(child.id, v)}
                  min={0}
                  max={17}
                  suffix={`an${child.age > 1 ? 's' : ''}`}
                  compact
                />
                <button
                  type="button"
                  onClick={() => removeChild(child.id)}
                  aria-label="Retirer cet enfant"
                  className="ml-auto h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </FieldGroup>

      {/* Régimes */}
      <FieldGroup label="Régimes alimentaires (optionnel)">
        <div className="flex flex-wrap gap-1.5">
          {FAMILY_DIETS.map(d => {
            const active = diets.includes(d)
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDiet(d)}
                className={cn(
                  'inline-flex items-center h-8 px-3 rounded-full text-xs font-semibold border transition-all',
                  active
                    ? 'bg-dolce-blue-deep text-dolce-yellow border-dolce-blue-deep'
                    : 'border-dolce-blue-deep/15 text-dolce-blue-deep bg-white hover:bg-dolce-yellow-soft',
                )}
              >
                {active && <Check className="h-3 w-3 mr-1" />}
                {d}
              </button>
            )
          })}
        </div>
      </FieldGroup>

      {/* Allergies / ingrédients à éviter */}
      <FieldGroup label="Allergies ou ingrédients à éviter (optionnel)">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={allergyInput}
            onChange={e => setAllergyInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addAllergy(allergyInput)
                setAllergyInput('')
              }
            }}
            placeholder="Ex. arachides, fruits de mer…"
            className="flex-1 h-10 px-3 rounded-xl text-sm bg-white border border-dolce-blue-deep/15 focus:border-dolce-blue-deep/40 outline-none"
          />
          <button
            type="button"
            onClick={() => { addAllergy(allergyInput); setAllergyInput('') }}
            className="h-10 px-3 rounded-xl bg-white border border-dolce-blue-deep/20 text-dolce-blue-deep text-xs font-semibold hover:bg-dolce-yellow-soft transition-colors"
          >
            Ajouter
          </button>
        </div>
        {allergies.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {allergies.map(a => (
              <span
                key={a}
                className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-xs font-semibold bg-dolce-yellow-soft text-dolce-blue-deep border border-dolce-blue-deep/15"
              >
                {a}
                <button
                  type="button"
                  onClick={() => removeAllergy(a)}
                  aria-label={`Retirer ${a}`}
                  className="text-dolce-blue-deep/60 hover:text-dolce-blue-deep"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </FieldGroup>

      {/* Budget */}
      <FieldGroup label="Budget moyen par repas (optionnel)">
        <div className="flex flex-wrap gap-1.5">
          {BUDGET_LEVELS.map(b => {
            const active = budgetLevel === b.id
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setBudgetLevel(active ? null : b.id)}
                className={cn(
                  'flex flex-col items-start gap-0.5 px-3 py-2 rounded-2xl border text-left transition-all',
                  active
                    ? 'bg-dolce-blue-deep text-dolce-yellow border-dolce-blue-deep'
                    : 'bg-white border-dolce-blue-deep/15 text-dolce-blue-deep hover:bg-dolce-yellow-soft',
                )}
              >
                <span className="text-xs font-bold">{b.label}</span>
                <span className={cn('text-[10px]', active ? 'text-dolce-yellow/80' : 'text-muted-foreground')}>
                  {b.hint}
                </span>
              </button>
            )
          })}
        </div>
      </FieldGroup>

      {/* Temps disponible */}
      <FieldGroup label="Temps moyen pour cuisiner (optionnel)">
        <div className="flex flex-wrap gap-1.5">
          {TIME_RANGES.map(t => {
            const active = availableTime === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setAvailableTime(active ? null : t.id)}
                className={cn(
                  'inline-flex items-center h-8 px-3 rounded-full text-xs font-semibold border transition-all',
                  active
                    ? 'bg-dolce-blue-deep text-dolce-yellow border-dolce-blue-deep'
                    : 'border-dolce-blue-deep/15 text-dolce-blue-deep bg-white hover:bg-dolce-yellow-soft',
                )}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </FieldGroup>

      {/* Objectif principal */}
      <FieldGroup label="Votre objectif principal">
        <div className="grid grid-cols-2 gap-2">
          {FAMILY_GOALS.map(g => {
            const active = mainGoal === g.id
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setMainGoal(active ? null : g.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-2xl text-left border transition-all',
                  active
                    ? 'bg-dolce-blue-deep text-dolce-yellow border-dolce-blue-deep'
                    : 'bg-white border-dolce-blue-deep/15 text-dolce-blue-deep hover:bg-dolce-yellow-soft',
                )}
              >
                <span className="text-base shrink-0">{g.emoji}</span>
                <span className="text-[12px] font-semibold leading-tight">{g.label}</span>
              </button>
            )
          })}
        </div>
      </FieldGroup>

      <button
        type="button"
        onClick={onContinue}
        className={cn(
          'mt-2 inline-flex items-center justify-center gap-2 w-full h-12 rounded-2xl px-4',
          'bg-dolce-blue-deep text-dolce-yellow text-sm font-bold tracking-wide',
          'shadow-[0_8px_22px_-12px_rgba(36,40,140,0.55)]',
          'hover:shadow-[0_12px_26px_-12px_rgba(36,40,140,0.65)] hover:-translate-y-px transition-all',
        )}
      >
        Valider ma fiche
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}

/* ─────────────────────── Etape 3 — Confirmation ─────────────────────── */

function StepConfirm({ householdName, adults, children, mainGoal, onComplete }) {
  const goal = FAMILY_GOALS.find(g => g.id === mainGoal)
  const totalPeople = adults + children.length

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <RobotChef expression="idle" size="md" />
      </div>

      <div>
        <p className="font-script text-[28px] text-dolce-blue-deep leading-none">benissimo</p>
        <h1 className="font-display text-[22px] text-dolce-blue-deep tracking-tight leading-tight mt-1">
          Votre fiche famille est prête.
        </h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Vous avez <span className="font-semibold text-dolce-blue-deep">3 recettes personnalisées offertes</span>.
        </p>
      </div>

      <div className="rounded-3xl border border-dolce-blue-deep/15 bg-gradient-to-br from-dolce-yellow-soft/50 via-white to-white p-4 text-left space-y-2 shadow-dolce-soft">
        <p className="text-[10px] font-bold uppercase tracking-wider text-dolce-blue-deep/55">
          Récapitulatif
        </p>
        {householdName && (
          <Row label="Foyer" value={householdName} />
        )}
        <Row label="Personnes" value={`${totalPeople} (${adults} adulte${adults > 1 ? 's' : ''}${children.length > 0 ? `, ${children.length} enfant${children.length > 1 ? 's' : ''}` : ''})`} />
        {goal && <Row label="Objectif" value={`${goal.emoji} ${goal.label}`} />}
      </div>

      <button
        type="button"
        onClick={onComplete}
        className={cn(
          'inline-flex items-center justify-center gap-2 w-full h-12 rounded-2xl px-4',
          'bg-dolce-blue-deep text-dolce-yellow text-sm font-bold tracking-wide',
          'shadow-[0_8px_22px_-12px_rgba(36,40,140,0.55)]',
          'hover:shadow-[0_12px_26px_-12px_rgba(36,40,140,0.65)] hover:-translate-y-px transition-all',
        )}
      >
        <Sparkles className="h-4 w-4" />
        Recevoir ma première recette
      </button>

      <p className="text-[11px] text-muted-foreground/80">
        Vous pourrez modifier votre fiche famille à tout moment.
      </p>
    </div>
  )
}

/* ─────────────────────── Sous-composants ─────────────────────── */

function FieldGroup({ label, action, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-dolce-blue-deep/60">
          {label}
        </p>
        {action}
      </div>
      {children}
    </div>
  )
}

function Counter({ value, onChange, min = 0, max = 99, suffix, compact }) {
  return (
    <div className={cn(
      'inline-flex items-center gap-1 rounded-full bg-white border border-dolce-blue-deep/15 p-1',
      compact ? '' : 'px-1',
    )}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Diminuer"
        className="h-7 w-7 rounded-full flex items-center justify-center text-dolce-blue-deep hover:bg-dolce-yellow-soft disabled:opacity-30 transition-colors"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="text-sm font-bold tabular-nums text-dolce-blue-deep min-w-[2rem] text-center">
        {value}
      </span>
      {suffix && (
        <span className="text-[11px] text-muted-foreground pr-1.5">{suffix}</span>
      )}
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Augmenter"
        className="h-7 w-7 rounded-full flex items-center justify-center text-dolce-blue-deep hover:bg-dolce-yellow-soft disabled:opacity-30 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-dolce-blue-deep">{value}</span>
    </div>
  )
}
