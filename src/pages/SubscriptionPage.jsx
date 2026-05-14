import { Crown, Check, Zap, MessageCircle, RefreshCw } from 'lucide-react'
import { PLANS, useSubscriptionStore } from '@/store/useSubscriptionStore'
import { cn } from '@/lib/utils'

export default function SubscriptionPage() {
  const { plan: currentPlanId, activatedAt, expiresAt, usage, activate, cancelSubscription, getUsage, getPlan } = useSubscriptionStore()
  const currentPlan = getPlan()
  const liveUsage   = getUsage()

  function formatDate(iso) {
    if (!iso) return null
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

      {/* ── Titre ── */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full">
          <Crown className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold text-amber-700">Abonnements</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Choisis ton plan</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Gratuit : recettes depuis notre banque. Premium : génération IA illimitée & 100% personnalisée.
        </p>
      </div>

      {/* ── Statut actuel ── */}
      <UsageCard plan={currentPlan} usage={liveUsage} expiresAt={expiresAt} onCancel={cancelSubscription} />

      {/* ── Plans ── */}
      <div className="grid md:grid-cols-3 gap-4">
        {Object.values(PLANS).filter(p => p.id !== 'visitor').map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrent={plan.id === currentPlanId}
            onActivate={() => activate(plan.id)}
          />
        ))}
      </div>

      {/* ── Note de démo ── */}
      <p className="text-center text-xs text-muted-foreground/60">
        Simulation de paiement — aucune carte requise dans cette version démo.
        En production, ceci serait connecté à Stripe.
      </p>

      {/* ── Mode visiteur ── */}
      {currentPlanId !== 'visitor' && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => activate('visitor')}
            className="text-xs text-muted-foreground/50 hover:text-muted-foreground underline underline-offset-2 transition-colors"
          >
            Simuler le mode visiteur (3 recettes)
          </button>
        </div>
      )}
    </div>
  )
}

// ── Carte d'usage ──────────────────────────────────────────────────
function UsageCard({ plan, usage, expiresAt, onCancel }) {
  const genLimit  = plan.generations  === Infinity ? null : plan.generations
  const chatLimit = plan.chatMessages === Infinity ? null : plan.chatMessages

  const genPct  = genLimit  ? Math.min(100, Math.round((usage.generations  / genLimit)  * 100)) : 0
  const chatPct = chatLimit ? Math.min(100, Math.round((usage.chatMessages / chatLimit) * 100)) : 0

  return (
    <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PlanBadge plan={plan} />
          <span className="text-sm text-muted-foreground">
            {expiresAt ? `Renouvellement le ${new Date(expiresAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}` : 'Plan gratuit'}
          </span>
        </div>
        {plan.id !== 'free' && plan.id !== 'visitor' && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Résilier
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {plan.aiGeneration ? (
          <UsageMeter
            icon={<Zap className="h-3.5 w-3.5" />}
            label="Générations IA"
            used={usage.generations}
            limit={genLimit}
            pct={genPct}
            color="emerald"
          />
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <RefreshCw className="h-3.5 w-3.5" />
              Recherches banque
            </div>
            <p className="text-xs font-semibold text-emerald-600">Illimitées</p>
            <p className="text-[10px] text-muted-foreground">Passez à Premium pour la génération IA</p>
          </div>
        )}
        <UsageMeter
          icon={<MessageCircle className="h-3.5 w-3.5" />}
          label="Messages chat"
          used={usage.chatMessages}
          limit={chatLimit}
          pct={chatPct}
          color="sky"
        />
      </div>
    </div>
  )
}

function UsageMeter({ icon, label, used, limit, pct, color }) {
  const isUnlimited = limit === null
  const isNearLimit = !isUnlimited && pct >= 80

  const barColor = {
    emerald: isNearLimit ? 'bg-red-500' : 'bg-emerald-500',
    sky:     isNearLimit ? 'bg-red-500' : 'bg-sky-500',
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-muted-foreground font-medium">
          {icon} {label}
        </span>
        <span className={cn('font-semibold', isNearLimit && 'text-red-500')}>
          {isUnlimited ? <span className="text-emerald-600">Illimité</span> : `${used} / ${limit}`}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', barColor[color])}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  )
}

// ── Carte de plan ──────────────────────────────────────────────────
function PlanCard({ plan, isCurrent, onActivate }) {
  const styles = {
    slate: {
      header: 'from-slate-600 to-slate-500',
      btn:    isCurrent ? 'bg-slate-200 text-slate-500 cursor-default' : 'bg-slate-600 hover:bg-slate-700 text-white',
      check:  'text-slate-500',
    },
    emerald: {
      header: 'from-emerald-600 to-teal-500',
      btn:    isCurrent ? 'bg-emerald-100 text-emerald-600 cursor-default' : 'bg-emerald-600 hover:bg-emerald-700 text-white',
      check:  'text-emerald-600',
    },
    violet: {
      header: 'from-violet-600 to-indigo-500',
      btn:    isCurrent ? 'bg-violet-100 text-violet-600 cursor-default' : 'bg-violet-600 hover:bg-violet-700 text-white',
      check:  'text-violet-600',
    },
  }
  const s = styles[plan.color]

  return (
    <div className={cn(
      'relative bg-white border rounded-2xl overflow-hidden shadow-sm transition-all',
      isCurrent ? 'border-2 border-emerald-500 shadow-emerald-100' : 'border-border hover:shadow-md',
      plan.id === 'family' && !isCurrent && 'ring-2 ring-violet-200',
    )}>
      {plan.id === 'family' && (
        <div className="absolute top-3 right-3 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          Populaire
        </div>
      )}
      {isCurrent && (
        <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          Actif
        </div>
      )}

      {/* Header coloré */}
      <div className={cn('bg-gradient-to-br px-5 pt-8 pb-5 text-white', s.header)}>
        <p className="font-extrabold text-xl">{plan.name}</p>
        <p className="text-white/80 text-sm font-medium mt-0.5">{plan.priceLabel}</p>
      </div>

      {/* Perks */}
      <ul className="px-5 py-4 space-y-2.5">
        {plan.perks.map((p, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check className={cn('h-4 w-4 shrink-0 mt-0.5', s.check)} />
            <span className="text-foreground/80">{p}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="px-5 pb-5">
        <button
          type="button"
          onClick={isCurrent ? undefined : onActivate}
          disabled={isCurrent}
          className={cn('w-full py-2.5 rounded-xl text-sm font-semibold transition-colors', s.btn)}
        >
          {isCurrent ? 'Plan actuel' : plan.id === 'free' ? 'Passer en gratuit' : `Passer à ${plan.name}`}
        </button>
      </div>
    </div>
  )
}

// ── Badge de plan ──────────────────────────────────────────────────
export function PlanBadge({ plan }) {
  const styles = {
    visitor: 'bg-gray-100 text-gray-500 border-gray-200',
    free:    'bg-slate-100 text-slate-600 border-slate-200',
    premium: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    family:  'bg-violet-50 text-violet-700 border-violet-200',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border', styles[plan.id])}>
      <Crown className="h-2.5 w-2.5" />
      {plan.name}
    </span>
  )
}
