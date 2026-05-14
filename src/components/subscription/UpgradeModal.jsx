import { useEffect } from 'react'
import { Crown, X, MessageCircle, Sparkles } from 'lucide-react'
import { PLANS, useSubscriptionStore } from '@/store/useSubscriptionStore'
import { cn } from '@/lib/utils'

export default function UpgradeModal({ reason = 'generation', onClose }) {
  const activate = useSubscriptionStore(s => s.activate)

  const isGen  = reason === 'generation'
  const isChat = reason === 'chat'
  const icon   = isChat
    ? <MessageCircle className="h-6 w-6 text-sky-500" />
    : <Sparkles className="h-6 w-6 text-amber-500" />
  const title  = isChat
    ? 'Limite de messages atteinte'
    : 'Débloquez la génération IA'
  const desc   = isChat
    ? 'Vous avez atteint la limite de messages avec le chef ce mois-ci. Passez à Premium pour un chat illimité.'
    : 'Avec Premium, le chef IA crée des recettes 100% personnalisées selon vos goûts, régimes et ingrédients — sans limite.'

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  function handleActivate(planId) {
    activate(planId)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-5 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 h-7 w-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-white/20 flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">{title}</h2>
              <p className="text-white/80 text-sm mt-0.5">{desc}</p>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="p-5 grid gap-3">
          {[PLANS.premium, PLANS.family].map(plan => (
            <PlanCard key={plan.id} plan={plan} onActivate={() => handleActivate(plan.id)} />
          ))}

          <button
            type="button"
            onClick={onClose}
            className="mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
          >
            Continuer sans mise à niveau
          </button>
        </div>
      </div>
    </div>
  )
}

function PlanCard({ plan, onActivate }) {
  const colors = {
    emerald: {
      bg:     'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
      badge:  'bg-emerald-600 text-white',
      btn:    'bg-emerald-600 hover:bg-emerald-700 text-white',
      dot:    'text-emerald-500',
    },
    violet: {
      bg:     'bg-violet-50 border-violet-200 hover:border-violet-400',
      badge:  'bg-violet-600 text-white',
      btn:    'bg-violet-600 hover:bg-violet-700 text-white',
      dot:    'text-violet-500',
    },
  }
  const c = colors[plan.color]

  return (
    <div className={cn('border rounded-xl p-4 transition-all cursor-pointer', c.bg)} onClick={onActivate}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-amber-500" />
          <span className="font-bold text-sm">{plan.name}</span>
          {plan.id === 'family' && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700">
              Populaire
            </span>
          )}
        </div>
        <span className="font-bold text-sm">{plan.priceLabel}</span>
      </div>

      <ul className="space-y-1 mb-3">
        {plan.perks.map((p, i) => (
          <li key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn('text-base leading-none', c.dot)}>●</span>
            {p}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={e => { e.stopPropagation(); onActivate() }}
        className={cn('w-full py-2 rounded-lg text-sm font-semibold transition-colors', c.btn)}
      >
        Activer {plan.name}
      </button>
    </div>
  )
}
