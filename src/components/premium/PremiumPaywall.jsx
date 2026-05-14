import { useState }                      from 'react'
import { Crown, Lock, Sparkles, Check }  from 'lucide-react'
import { PLANS, useSubscriptionStore }   from '@/store/useSubscriptionStore'
import { cn }                            from '@/lib/utils'

/**
 * PremiumPaywall — paywall contextuel, raffine et rassurant.
 *
 * Style Dolce Vita : ivoire / bleu Klein / accents jaune Sicile.
 * Aucune surface massive ni couleur criarde : la conversion passe par
 * le benefice concret + un CTA premium discret.
 */
const FEATURE_INFO = {
  frigo: {
    icon:    '🥦',
    title:   'Mode Frigo',
    pitch:   'Débloquez le mode Frigo pour cuisiner avec ce que vous avez déjà.',
    perks: [
      'Photographiez ou listez vos ingrédients',
      'Le chef IA propose des recettes adaptées',
      'Zéro gaspillage, zéro course inutile',
    ],
  },
  express: {
    icon:    '⚡',
    title:   'Repas Express',
    pitch:   'Un dîner prêt en moins de 30 minutes, sans réfléchir.',
    perks: [
      'Idée de repas réaliste en 10 secondes',
      'Recettes minutées et calibrées',
      'Idéal pour les soirs pressés',
    ],
  },
  budget: {
    icon:    '💰',
    title:   'Budget IA',
    pitch:   'Respectez votre budget par personne sans compromis sur le plaisir.',
    perks: [
      'Recettes ajustées à votre enveloppe',
      'Coût par portion calculé',
      'Conseils anti-gaspi automatiques',
    ],
  },
  transform: {
    icon:    '🔄',
    title:   'Transformer une recette',
    pitch:   'Passez Premium pour transformer cette recette en version plus rapide, plus légère ou sans gluten.',
    perks: [
      'Adaptez n\'importe quelle recette',
      'Variantes santé, rapides, économiques',
      'Vos préférences sont mémorisées',
    ],
  },
  carnet: {
    icon:    '📖',
    title:   'Mon Carnet',
    pitch:   'Gardez vos meilleures créations à portée de main.',
    perks: [
      'Tags personnels et notes privées',
      'Filtre par occasion ou ingrédient',
      'Synchronisé entre vos appareils',
    ],
  },
  wellbeing: {
    icon:    '✨',
    title:   'Bien-être',
    pitch:   'Comprenez ce qui vous réussit vraiment au fil du temps.',
    perks: [
      'Tableau de bord nutritionnel',
      'Tendances et habitudes mises en évidence',
      'Conseils personnalisés du chef',
    ],
  },
  generation: {
    icon:    '🍝',
    title:   'Génération IA',
    pitch:   'Premium transforme Chef Privé en assistant culinaire personnel.',
    perks: [
      'Recettes 100% personnalisées',
      'Goûts, régimes, contraintes pris en compte',
      'Sans limite mensuelle',
    ],
  },
  default: {
    icon:    '✨',
    title:   'Fonctionnalité Premium',
    pitch:   'Cette fonctionnalité est réservée aux abonnés Premium.',
    perks: [
      'Accès complet à toutes les fonctions IA',
      'Sans limite, sans publicité',
      'Résiliable à tout moment',
    ],
  },
}

export default function PremiumPaywall({ feature = 'default', compact = false }) {
  const [showPlans, setShowPlans] = useState(false)
  const activate = useSubscriptionStore(s => s.activate)
  const info = FEATURE_INFO[feature] ?? FEATURE_INFO.default

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-dolce-yellow-soft/60 via-white to-white border border-dolce-blue-deep/15 shadow-dolce-soft">
        <div className="h-10 w-10 rounded-xl bg-white border border-dolce-blue-deep/15 flex items-center justify-center text-xl shrink-0">
          {info.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-dolce-blue-deep leading-tight">{info.title}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{info.pitch}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowPlans(true)}
          className={cn(
            'shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl',
            'bg-dolce-blue-deep text-dolce-yellow text-xs font-bold',
            'hover:shadow-[0_8px_18px_-10px_rgba(36,40,140,0.5)] transition-shadow',
          )}
        >
          <Crown className="h-3 w-3" /> Premium
        </button>
        {showPlans && (
          <PlanModal onClose={() => setShowPlans(false)}
                     onActivate={id => { activate(id); setShowPlans(false) }} />
        )}
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-10 sm:py-14">
      {/* Carte centrale, rassurante */}
      <div className="rounded-3xl border border-dolce-blue-deep/15 bg-white shadow-dolce-soft p-6 sm:p-8 text-center">
        <div className="relative inline-flex mb-5">
          <div className="h-16 w-16 rounded-2xl bg-dolce-yellow-soft border border-dolce-blue-deep/10 flex items-center justify-center text-3xl">
            {info.icon}
          </div>
          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-dolce-blue-deep text-dolce-yellow flex items-center justify-center shadow-sm">
            <Lock className="h-3 w-3" />
          </div>
        </div>

        <h2 className="font-display text-xl text-dolce-blue-deep tracking-tight mb-2">
          {info.title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-5">
          {info.pitch}
        </p>

        <ul className="text-left max-w-sm mx-auto space-y-2 mb-6">
          {info.perks.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-0.5 inline-flex h-4 w-4 rounded-full bg-dolce-yellow-soft border border-dolce-blue-deep/15 items-center justify-center shrink-0">
                <Check className="h-2.5 w-2.5 text-dolce-blue-deep" strokeWidth={3} />
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setShowPlans(true)}
          className={cn(
            'inline-flex items-center justify-center gap-2 h-11 px-5 rounded-2xl',
            'bg-dolce-blue-deep text-dolce-yellow text-sm font-bold tracking-wide',
            'shadow-[0_8px_22px_-12px_rgba(36,40,140,0.55)]',
            'hover:shadow-[0_12px_26px_-12px_rgba(36,40,140,0.65)] hover:-translate-y-px',
            'active:translate-y-0 transition-all',
          )}
        >
          <Crown className="h-4 w-4" />
          Découvrir Premium
        </button>
        <p className="text-[11px] text-muted-foreground mt-3">
          4,99 €/mois · résiliable à tout moment
        </p>
      </div>

      {showPlans && (
        <PlanModal onClose={() => setShowPlans(false)}
                   onActivate={id => { activate(id); setShowPlans(false) }} />
      )}
    </div>
  )
}

/* ─────────────── Modal de sélection de plan ─────────────── */

function PlanModal({ onClose, onActivate }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white border border-dolce-blue-deep/15 shadow-dolce-deep p-6 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <Crown className="h-6 w-6 text-dolce-yellow-deep mx-auto mb-1" />
          <h3 className="font-display text-lg text-dolce-blue-deep">Choisissez votre plan</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Résiliable à tout moment</p>
        </div>

        <div className="space-y-2.5">
          {Object.values(PLANS).map(plan => (
            <button
              key={plan.id}
              type="button"
              onClick={() => onActivate(plan.id)}
              className={cn(
                'w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all',
                'bg-dolce-yellow-soft/40 border-dolce-blue-deep/15',
                'hover:bg-dolce-yellow-soft hover:border-dolce-blue-deep/30',
              )}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-dolce-blue-deep leading-tight">{plan.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-dolce-blue-deep">{plan.price}</p>
                <p className="text-[10px] text-muted-foreground">/mois</p>
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}
