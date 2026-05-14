import { useState } from 'react'
import { useBatchStore }      from '@/store/useBatchStore'
import BatchCookingResult     from '@/components/results/BatchCookingResult'
import RobotBubble            from '@/components/mascot/RobotBubble'
import { useNavStore }        from '@/store/useNavStore'
import {
  UtensilsCrossed, Clock, Layers, ChevronRight,
  Trash2, ArrowLeft, CalendarDays, ChefHat,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Carte résumé d'un plan ───────────────────────────────────── */
function BatchCard({ plan, onOpen, onDelete }) {
  const date = new Date(plan.savedAt)
  const dateLabel = date.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
  const timeLabel = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="bg-white rounded-3xl border-2 border-dolce-blue-deep/10 shadow-dolce-soft overflow-hidden">
      {/* Header coloré */}
      <div className="bg-dolce-blue-deep px-5 py-4 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-script text-dolce-yellow text-lg leading-tight">Batch Cooking</p>
          <h3 className="font-display text-white text-base leading-tight mt-0.5 truncate">
            {plan.sessionTitre ?? 'Session de la semaine'}
          </h3>
          <p className="text-white/50 text-[11px] mt-1 flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {dateLabel} à {timeLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(plan.id) }}
          className="shrink-0 h-8 w-8 rounded-xl bg-white/10 hover:bg-red-500/80 flex items-center justify-center text-white/50 hover:text-white transition-all"
          aria-label="Supprimer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Stats */}
      <div className="px-5 py-4 grid grid-cols-3 gap-3 border-b border-dolce-blue-deep/8">
        <Stat icon={Clock}    label="Durée"    value={plan.dureeTotal ?? '–'} />
        <Stat icon={Layers}   label="Recettes" value={`${plan.nbRecettes ?? 0}`} />
        <Stat icon={ChefHat}  label="Niveau"   value={plan.niveauDifficulte ?? '–'} />
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => onOpen(plan)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-dolce-blue-deep hover:bg-dolce-yellow-soft/50 transition-colors"
      >
        <span className="text-sm font-bold">Consulter le plan complet</span>
        <ChevronRight className="h-4 w-4 text-dolce-blue-deep/50" />
      </button>
    </div>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="text-center">
      <Icon className="h-4 w-4 text-dolce-blue-deep/40 mx-auto mb-1" />
      <p className="font-display text-base text-dolce-blue-deep leading-none">{value}</p>
      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  )
}

/* ─── Page principale ───────────────────────────────────────────── */
export default function BatchCookingPage() {
  const { plans, removePlan } = useBatchStore()
  const goToPage = useNavStore(s => s.goToPage)
  const [selected, setSelected] = useState(null)   // plan ouvert en détail

  /* ── Vue détail ── */
  if (selected) {
    return (
      <div className="pb-24">
        {/* Bannière retour */}
        <div className="sticky top-[60px] z-20 bg-white/90 backdrop-blur-md border-b border-dolce-blue-deep/10">
          <div className="max-w-3xl mx-auto px-4 py-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="flex items-center gap-1.5 text-xs font-semibold text-dolce-blue-deep/70 hover:text-dolce-blue-deep transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à mes sessions
            </button>
            <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-dolce-blue-deep text-dolce-yellow">
              <UtensilsCrossed className="h-3 w-3" />
              Batch Cooking
            </span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6 animate-in fade-in">
          <BatchCookingResult plan={selected} />
        </div>
      </div>
    )
  }

  /* ── Vue liste ── */
  return (
    <div className="pb-24">
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* En-tête */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-dolce-blue-deep flex items-center justify-center shrink-0">
            <UtensilsCrossed className="h-6 w-6 text-dolce-yellow" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-dolce-blue-deep tracking-tight">Mes Batch Cooking</h1>
            <p className="text-sm text-muted-foreground">
              {plans.length === 0
                ? 'Aucune session sauvegardée'
                : `${plans.length} session${plans.length > 1 ? 's' : ''} sauvegardée${plans.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* État vide */}
        {plans.length === 0 && (
          <div className="flex flex-col items-center text-center gap-6 py-16">
            <RobotBubble
              expression="idle"
              size="lg"
              animate
              message="Vous n'avez pas encore de session batch cooking. Générez-en une depuis l'écran Cuisine !"
            />
            <button
              type="button"
              onClick={() => goToPage('generator')}
              className="px-6 py-3 rounded-2xl bg-dolce-blue-deep text-dolce-yellow font-display text-base shadow-dolce-deep hover:scale-[1.02] transition-transform"
            >
              Aller au générateur
            </button>
          </div>
        )}

        {/* Liste des plans */}
        {plans.length > 0 && (
          <div className="space-y-4 animate-in fade-in">
            {plans.map(plan => (
              <BatchCard
                key={plan.id}
                plan={plan}
                onOpen={setSelected}
                onDelete={(id) => {
                  if (selected?.id === id) setSelected(null)
                  removePlan(id)
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
