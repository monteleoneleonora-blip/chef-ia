import { useState, useEffect }    from 'react'
import { useNavStore }           from '@/store/useNavStore'
import { usePermissions }        from '@/hooks/usePermissions'
import { useSubscriptionStore }  from '@/store/useSubscriptionStore'
import PremiumGate               from '@/components/premium/PremiumGate'
import SubscriptionPage          from './SubscriptionPage'
import CarnetPage                from './premium/CarnetPage'
import FrigoPage                 from './premium/FrigoPage'
import ExpressPage               from './premium/ExpressPage'
import BudgetAIPage              from './premium/BudgetAIPage'
import TransformPage             from './premium/TransformPage'
import { useCarnetStore }        from '@/store/useCarnetStore'
import {
  Crown, ChevronRight, ArrowLeft,
  Refrigerator, Zap, Wallet, Shuffle, NotebookPen, BarChart2, Check,
} from 'lucide-react'
import { cn }                    from '@/lib/utils'

const SCENARIOS = [
  {
    id:        'frigo',
    quote:     "J'ai déjà ce qu'il faut à la maison",
    feature:   'Mode Frigo',
    desc:      'Listez vos ingrédients, Chef Privé propose la recette la plus adaptée.',
    icon:      Refrigerator,
  },
  {
    id:        'express',
    quote:     'Je dois faire vite ce soir',
    feature:   'Repas Express',
    desc:      'Une idée réaliste, minutée, prête en moins de 30 minutes.',
    icon:      Zap,
  },
  {
    id:        'budget',
    quote:     'Je veux rester dans mon budget',
    feature:   'Budget IA',
    desc:      'Recettes calibrées au coût par personne, sans rogner sur le plaisir.',
    icon:      Wallet,
  },
  {
    id:        'transform',
    quote:     "J'aime une recette mais je veux l'adapter",
    feature:   'Transform',
    desc:      'Variantes plus rapides, plus légères, sans gluten, à votre image.',
    icon:      Shuffle,
  },
  {
    id:        'wellbeing',
    quote:     'Je veux mieux comprendre ce qui me réussit',
    feature:   'Bien-être',
    desc:      'Un tableau de bord nutritionnel doux et lisible, pour repérer vos habitudes.',
    icon:      BarChart2,
  },
]

const FREE_FEATURES = [
  'Banque de recettes',
  'Recherche & filtres',
  'Favoris',
  'Liste de courses',
]

const PREMIUM_FEATURES_LIST = [
  'Recettes 100% IA',
  'Mode Frigo, Express, Budget',
  'Transform & variantes',
  'Bien-être & carnet',
  'Promos intelligentes',
  'Chat illimité',
]

export default function PremiumPage() {
  const { isPremiumUser, plan } = usePermissions()
  const activate = useSubscriptionStore(s => s.activate)
  const [subPage, setSubPage] = useState(null)
  const [showSub, setShowSub] = useState(false)
  const carnetCount = useCarnetStore(s => s.entries.length)
  const { premiumTarget, consumePremiumTarget } = useNavStore()

  useEffect(() => {
    if (premiumTarget) {
      setSubPage(premiumTarget)
      consumePremiumTarget()
    }
  }, [premiumTarget, consumePremiumTarget])

  if (subPage) {
    const SubPage = {
      frigo:     FrigoPage,
      express:   ExpressPage,
      budget:    BudgetAIPage,
      transform: TransformPage,
      carnet:    CarnetPage,
    }[subPage]

    const featureTitle = SCENARIOS.find(s => s.id === subPage)?.feature
      ?? (subPage === 'carnet' ? 'Mon Carnet' : '')

    return (
      <div className="min-h-[calc(100dvh-128px)] bg-background">
        <div className="sticky top-[60px] z-20 bg-white/85 backdrop-blur-md border-b border-dolce-blue-deep/10 px-4 py-2.5">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSubPage(null)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl',
                'bg-white border border-dolce-blue-deep/15 text-dolce-blue-deep',
                'text-xs font-bold hover:bg-dolce-yellow-soft transition-colors',
              )}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Espace Premium
            </button>
            <h1 className="text-sm font-bold text-dolce-blue-deep truncate">
              {featureTitle}
            </h1>
          </div>
        </div>
        <PremiumGate feature={subPage}>
          <SubPage onBack={() => setSubPage(null)} />
        </PremiumGate>
      </div>
    )
  }

  return (
    <div className="mx-auto px-4 pt-4 pb-6 space-y-7 max-w-[560px]">

      {/* Hero */}
      <section aria-labelledby="premium-hero">
        <div className="flex items-center gap-1.5">
          <Crown className="h-3.5 w-3.5 text-dolce-yellow-deep" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-dolce-blue-deep/60">
            Premium
          </span>
        </div>
        <h1
          id="premium-hero"
          className="font-display text-[24px] sm:text-[26px] text-dolce-blue-deep tracking-tight leading-tight mt-2"
        >
          Passez du livre de recettes à votre chef personnel.
        </h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Chef Privé adapte vos repas à votre frigo, votre temps, votre budget et vos contraintes.
        </p>
        {isPremiumUser && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dolce-blue-deep text-dolce-yellow text-[10px] font-extrabold uppercase tracking-wider">
            <Crown className="h-3 w-3" />
            {plan === 'family' ? 'Famille' : 'Premium'} actif
          </div>
        )}
      </section>

      {/* Cas d'usage */}
      <section aria-labelledby="premium-scenarios">
        <h2
          id="premium-scenarios"
          className="text-[10px] font-bold uppercase tracking-wider text-dolce-blue-deep/55 mb-3"
        >
          Cas d'usage
        </h2>
        <div className="space-y-2.5">
          {SCENARIOS.map(scenario => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onClick={() => setSubPage(scenario.id)}
            />
          ))}
        </div>
      </section>

      {/* Mon Carnet */}
      <section>
        <button
          type="button"
          onClick={() => setSubPage('carnet')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left',
            'bg-white/85 border border-dolce-blue-deep/10',
            'hover:bg-white hover:border-dolce-blue-deep/25 transition-colors',
          )}
        >
          <span className="shrink-0 h-9 w-9 rounded-xl bg-dolce-yellow-soft text-dolce-blue-deep flex items-center justify-center">
            <NotebookPen className="h-4 w-4" strokeWidth={2.1} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-foreground leading-tight">
              Mon Carnet
              {carnetCount > 0 && (
                <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-dolce-blue-deep text-dolce-yellow">
                  {carnetCount}
                </span>
              )}
            </p>
            <p className="text-[11px] text-muted-foreground">Gardez vos meilleures créations.</p>
          </div>
          <ChevronRight className="h-4 w-4 text-dolce-blue-deep/30" />
        </button>
      </section>

      {/* Comparatif */}
      <section aria-labelledby="premium-compare">
        <h2
          id="premium-compare"
          className="text-[10px] font-bold uppercase tracking-wider text-dolce-blue-deep/55 mb-3"
        >
          Free vs Premium
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          <PlanColumn title="Free"    features={FREE_FEATURES}         tone="muted"    />
          <PlanColumn title="Premium" features={PREMIUM_FEATURES_LIST} tone="primary"  />
        </div>
      </section>

      {/* CTA final */}
      {!isPremiumUser && (
        <section className="pt-1">
          <div className="rounded-3xl border border-dolce-blue-deep/15 bg-gradient-to-br from-dolce-yellow-soft/60 via-white to-white p-5 text-center shadow-dolce-soft">
            <p className="font-script text-3xl text-dolce-blue-deep mb-1">Votre chef, enfin</p>
            <p className="text-sm font-bold text-dolce-blue-deep leading-snug">
              Tout cela à 4,99 €/mois — résiliable à tout moment.
            </p>
            <button
              type="button"
              onClick={() => setShowSub(true)}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-dolce-blue-deep text-dolce-yellow text-sm font-bold hover:opacity-90 transition-opacity shadow-dolce-deep"
            >
              <Crown className="h-4 w-4" />
              Débloquer Premium
            </button>
          </div>
        </section>
      )}

      {showSub && (
        <SubscriptionPage onBack={() => setShowSub(false)} />
      )}

    </div>
  )
}

function ScenarioCard({ scenario, onClick }) {
  const Icon = scenario.icon
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-3 p-4 rounded-2xl text-left transition-all',
        'bg-white border border-dolce-blue-deep/10',
        'hover:border-dolce-blue-deep/30 hover:shadow-dolce-soft',
      )}
    >
      <span className="shrink-0 h-10 w-10 rounded-xl bg-dolce-yellow-soft text-dolce-blue-deep flex items-center justify-center">
        <Icon className="h-4 w-4" strokeWidth={2.1} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-dolce-blue-deep/50 mb-0.5">
          {scenario.feature}
        </p>
        <p className="text-sm font-semibold text-foreground leading-snug italic">
          « {scenario.quote} »
        </p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {scenario.desc}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 text-dolce-blue-deep/30 shrink-0 mt-1" />
    </button>
  )
}

function PlanColumn({ title, features, tone }) {
  const isPrimary = tone === 'primary'
  return (
    <div className={cn(
      'rounded-2xl p-4 space-y-2.5',
      isPrimary
        ? 'bg-dolce-blue-deep text-dolce-yellow'
        : 'bg-white border border-dolce-blue-deep/10 text-foreground',
    )}>
      <p className={cn(
        'text-[11px] font-bold uppercase tracking-wider mb-3',
        isPrimary ? 'text-dolce-yellow/70' : 'text-muted-foreground',
      )}>
        {title}
      </p>
      {features.map(f => (
        <div key={f} className="flex items-start gap-2">
          <Check
            className={cn('h-3.5 w-3.5 shrink-0 mt-0.5', isPrimary ? 'text-dolce-yellow' : 'text-dolce-blue-deep/40')}
            strokeWidth={2.5}
          />
          <span className={cn('text-xs leading-snug', isPrimary ? 'text-dolce-yellow' : 'text-foreground/80')}>
            {f}
          </span>
        </div>
      ))}
    </div>
  )
}
