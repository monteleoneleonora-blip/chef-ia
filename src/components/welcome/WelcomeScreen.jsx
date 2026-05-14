import { useState } from 'react'
import { useWizardStore }       from '@/store/useWizardStore'
import { useSubscriptionStore } from '@/store/useSubscriptionStore'
import RobotChef                from '@/components/mascot/RobotChef'
import { cn } from '@/lib/utils'
import { ChevronRight, Check, Sparkles, ArrowLeft } from 'lucide-react'

const STEPS = [
  {
    id: 'people',
    question: 'Pour combien de personnes ?',
    type: 'chips',
    options: [1, 2, 3, 4, 5, 6].map(n => ({ id: n, label: String(n), sublabel: 'pers.' })),
    defaultKey: 'totalPeople',
  },
  {
    id: 'mealType',
    question: 'Quel type de repas vous tente ?',
    type: 'chips',
    options: [
      { id: 'petit-dejeuner', label: '🥐', sublabel: 'Petit-dej' },
      { id: 'dejeuner',       label: '🥗', sublabel: 'Dejeuner' },
      { id: 'diner',          label: '🍝', sublabel: 'Diner' },
    ],
    defaultKey: 'mealType',
  },
  {
    id: 'diets',
    question: 'Preferences alimentaires ?',
    type: 'multi',
    options: ['Vegetarien','Vegan','Sans gluten','Sans lactose','Keto','Mediterraneen'].map(d => ({ id: d, label: d })),
    defaultKey: 'diets',
    skipLabel: 'Aucune restriction',
  },
]

export default function WelcomeScreen({ onDone }) {
  const [step, setStep]       = useState(-1)
  const [answers, setAnswers] = useState({ totalPeople: 4, mealType: 'diner', diets: [] })
  const setWizardAnswers      = useWizardStore(s => s.setAnswers)
  const activate              = useSubscriptionStore(s => s.activate)

  const handleNext = () => {
    if (step >= STEPS.length - 1) {
      const sub = useSubscriptionStore.getState()
      if (sub.plan === 'visitor') activate('free')
      setWizardAnswers(answers)
      onDone?.('chips')
    } else {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > -1) setStep(step - 1)
  }

  const handleSelect = (stepDef, value) => {
    if (stepDef.type === 'chips') {
      setAnswers(prev => ({ ...prev, [stepDef.defaultKey]: value }))
      setTimeout(() => handleNext(), 250)
    } else {
      setAnswers(prev => {
        const arr = prev[stepDef.defaultKey] ?? []
        const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
        return { ...prev, [stepDef.defaultKey]: next }
      })
    }
  }

  const skip = () => onDone?.('skip')

  return (
    <div className="fixed inset-0 z-[100] bg-dolce-mediterranean overflow-y-auto">
      <button
        type="button"
        onClick={skip}
        className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-full text-xs font-semibold text-dolce-blue-deep/70 hover:text-dolce-blue-deep bg-white/70 backdrop-blur border border-dolce-blue-deep/10 hover:bg-white shadow-sm transition-colors"
      >
        Passer
      </button>

      {step >= 0 && (
        <button
          type="button"
          onClick={handleBack}
          aria-label="Retour"
          className="fixed top-4 left-4 z-50 h-9 w-9 rounded-full bg-white/70 backdrop-blur border border-dolce-blue-deep/10 flex items-center justify-center text-dolce-blue-deep hover:bg-white shadow-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}

      {step >= 0 && (
        <div className="fixed top-6 left-16 right-20 z-40 flex gap-1.5 pointer-events-none">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all duration-500',
                i < step  && 'bg-dolce-blue-deep',
                i === step && 'bg-dolce-blue-deep shadow-md',
                i > step  && 'bg-white/50',
              )}
            />
          ))}
        </div>
      )}

      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center px-6 py-20">

        {step === -1 && (
          <div className="text-center space-y-6 animate-in slide-up max-w-md w-full mx-auto flex flex-col items-center">
            <div className="animate-bob flex justify-center">
              <RobotChef expression="excited" size="xl" />
            </div>
            <div className="space-y-3">
              <p className="font-script text-6xl text-dolce-blue-deep leading-none">Buongiorno !</p>
              <h1 className="font-display text-3xl sm:text-4xl text-foreground tracking-tight">
                Bienvenue chez<br/>
                <span className="font-script text-5xl text-dolce-terracotta">Chef Privé</span>
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed pt-2 max-w-sm mx-auto">
                Je suis votre chef personnel. Quelques questions et je vous prepare des recettes sur-mesure.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="mt-6 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-dolce-blue-deep text-dolce-yellow font-display text-lg shadow-dolce-deep hover:scale-105 active:scale-95 transition-transform"
            >
              <Sparkles className="h-5 w-5" />
              Iniziamo !
              <ChevronRight className="h-5 w-5" />
            </button>
            <p className="text-[11px] text-muted-foreground/60 italic pt-1">3 questions, 30 secondes</p>
          </div>
        )}

        {step >= 0 && (() => {
          const def = STEPS[step]
          const value = answers[def.defaultKey]
          return (
            <div className="text-center space-y-8 animate-in slide-up max-w-md w-full">
              <div>
                <p className="font-script text-2xl text-dolce-blue-deep mb-1">capitolo {step + 1}</p>
                <h2 className="font-display text-2xl sm:text-3xl text-foreground tracking-tight">{def.question}</h2>
              </div>

              {def.type === 'chips' && (
                <div className={cn(
                  'gap-3',
                  def.options.length <= 3 ? 'flex justify-center flex-wrap' : 'grid grid-cols-3'
                )}>
                  {def.options.map(opt => {
                    const active = value === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelect(def, opt.id)}
                        className={cn(
                          'flex flex-col items-center justify-center gap-1 rounded-3xl border-2 transition-all duration-200',
                          def.options.length <= 3 ? 'h-28 w-28' : 'aspect-square',
                          active
                            ? 'bg-gradient-to-br from-dolce-yellow to-dolce-yellow-deep border-dolce-blue-deep shadow-dolce-warm scale-105'
                            : 'bg-white/80 border-border hover:border-dolce-blue/40 hover:bg-white'
                        )}
                      >
                        <span className={cn('leading-none', def.options.length <= 3 ? 'text-4xl' : 'text-2xl')}>
                          {opt.label}
                        </span>
                        <span className={cn('text-xs font-bold', active ? 'text-dolce-blue-deep' : 'text-muted-foreground')}>
                          {opt.sublabel}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {def.type === 'multi' && (
                <>
                  <div className="grid grid-cols-2 gap-2.5">
                    {def.options.map(opt => {
                      const active = (value ?? []).includes(opt.id)
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelect(def, opt.id)}
                          className={cn(
                            'px-4 py-3.5 rounded-2xl border-2 text-sm font-semibold transition-all flex items-center justify-center gap-2',
                            active
                              ? 'bg-gradient-to-r from-dolce-basil to-dolce-basil-deep border-transparent text-white shadow-dolce-warm'
                              : 'bg-white/80 border-border text-foreground hover:border-dolce-basil/40 hover:bg-white'
                          )}
                        >
                          {active && <Check className="h-4 w-4" />}
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 py-3 rounded-2xl bg-white/70 border border-border text-muted-foreground font-semibold text-sm hover:bg-white transition-colors"
                    >
                      {def.skipLabel ?? 'Aucune'}
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 py-3 rounded-2xl bg-dolce-blue-deep text-dolce-yellow font-display text-base shadow-dolce-warm hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                      C'est parti !
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })()}
      </div>
    </div>
  )
}
