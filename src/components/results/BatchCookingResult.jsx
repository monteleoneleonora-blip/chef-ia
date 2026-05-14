import { useState } from 'react'
import {
  Clock, ChefHat, UtensilsCrossed, ShoppingCart, Refrigerator,
  CheckCircle2, Circle, ChevronDown, ChevronUp, Timer, Users,
  Zap, Layers, Sparkles, ArrowRight,
} from 'lucide-react'
import RobotChef   from '@/components/mascot/RobotChef'
import RecipeCard  from '@/components/results/RecipeCard'
import { cn }      from '@/lib/utils'

/* ─── Helpers ──────────────────────────────────────────────────── */

function SectionTitle({ icon: Icon, title, sub, color = 'text-dolce-blue-deep' }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-10 w-10 rounded-2xl bg-dolce-blue-deep flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-dolce-yellow" />
      </div>
      <div>
        <h2 className={cn('font-display text-xl tracking-tight', color)}>{title}</h2>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

/* ─── Hero ─────────────────────────────────────────────────────── */

function BatchHero({ plan }) {
  return (
    <div className="rounded-3xl bg-dolce-blue-deep p-6 text-white shadow-dolce-deep">
      <div className="flex items-start gap-4">
        <RobotChef expression="excited" size="md" className="shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-script text-dolce-yellow text-2xl leading-tight">Batch Cooking</p>
          <h1 className="font-display text-2xl sm:text-3xl text-white leading-tight mt-0.5">
            {plan.sessionTitre ?? 'Votre session de la semaine'}
          </h1>
          <p className="text-white/70 text-sm mt-1">{plan.niveauDifficulte ?? 'Moyen'}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <StatChip icon={Clock}    label="Durée totale"   value={plan.dureeTotal ?? '–'} />
        <StatChip icon={Layers}   label="Recettes"       value={`${plan.nbRecettes ?? 0}`} />
        <StatChip icon={Users}    label="Portions"       value={`${plan.nbPortions ?? 0}`} />
      </div>
    </div>
  )
}

function StatChip({ icon: Icon, label, value }) {
  return (
    <div className="bg-white/10 rounded-2xl p-3 text-center">
      <Icon className="h-4 w-4 text-dolce-yellow mx-auto mb-1" />
      <p className="font-display text-lg text-white leading-none">{value}</p>
      <p className="text-[10px] text-white/60 mt-0.5 font-semibold uppercase tracking-wider">{label}</p>
    </div>
  )
}

/* ─── Outils ────────────────────────────────────────────────────── */

function ToolsSection({ outils }) {
  if (!outils?.length) return null
  return (
    <div>
      <SectionTitle icon={UtensilsCrossed} title="Outils nécessaires" sub="Préparez tout ça avant de commencer" />
      <div className="grid grid-cols-2 gap-2">
        {outils.map((outil, i) => (
          <div key={i} className="flex items-center gap-2.5 bg-white rounded-2xl px-4 py-3 border-2 border-dolce-blue-deep/10 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-dolce-yellow-deep shrink-0" />
            <span className="text-sm font-semibold text-foreground">{outil}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Planning étape par étape ──────────────────────────────────── */

function PlanningSection({ planning }) {
  const [checkedSteps, setCheckedSteps] = useState(new Set())
  const [expanded, setExpanded]         = useState(new Set([0]))

  if (!planning?.length) return null

  const toggle       = (i) => setCheckedSteps(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n })
  const toggleExpand = (i) => setExpanded(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n })

  const doneCount = checkedSteps.size

  return (
    <div>
      <SectionTitle
        icon={Timer}
        title="Planning de session"
        sub={`${doneCount}/${planning.length} étapes complétées`}
      />

      {/* Barre de progression */}
      <div className="mb-4 h-2 bg-dolce-blue-deep/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-dolce-blue-deep rounded-full transition-all duration-500"
          style={{ width: `${(doneCount / planning.length) * 100}%` }}
        />
      </div>

      <div className="space-y-3">
        {planning.map((step, i) => {
          const isChecked  = checkedSteps.has(i)
          const isExpanded = expanded.has(i)

          return (
            <div
              key={i}
              className={cn(
                'rounded-3xl border-2 overflow-hidden transition-all duration-200',
                isChecked
                  ? 'bg-dolce-yellow-soft/60 border-dolce-blue-deep/20 opacity-70'
                  : step.enParallele
                    ? 'bg-white border-dolce-yellow-deep/60 shadow-sm'
                    : 'bg-white border-dolce-blue-deep/15 shadow-sm'
              )}
            >
              {/* Header étape */}
              <div className="flex items-center gap-3 p-4">
                {/* Numéro + checkbox */}
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="shrink-0 group"
                  aria-label={isChecked ? 'Marquer comme non fait' : 'Marquer comme fait'}
                >
                  {isChecked
                    ? <CheckCircle2 className="h-7 w-7 text-dolce-blue-deep" />
                    : <div className="h-7 w-7 rounded-full border-2 border-dolce-blue-deep/30 flex items-center justify-center group-hover:border-dolce-blue-deep transition-colors">
                        <span className="font-display text-sm text-dolce-blue-deep">{step.etape}</span>
                      </div>
                  }
                </button>

                {/* Titre + durée */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={cn('font-display text-base leading-tight', isChecked && 'line-through text-muted-foreground')}>
                      {step.titre}
                    </p>
                    {step.enParallele && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-dolce-yellow text-dolce-blue-deep border border-dolce-yellow-deep/40">
                        <Zap className="h-2.5 w-2.5" />
                        Parallèle
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{step.duree}</span>
                  </div>
                </div>

                {/* Expand toggle */}
                <button
                  type="button"
                  onClick={() => toggleExpand(i)}
                  className="shrink-0 h-8 w-8 rounded-xl bg-dolce-blue-deep/5 flex items-center justify-center text-dolce-blue-deep/50 hover:text-dolce-blue-deep hover:bg-dolce-blue-deep/10 transition-colors"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>

              {/* Corps dépliable */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-dolce-blue-deep/8 pt-3">
                  <p className="text-sm text-foreground leading-relaxed">{step.description}</p>

                  {step.noteParallele && (
                    <div className="flex items-start gap-2 bg-dolce-yellow-soft rounded-xl px-3 py-2">
                      <ArrowRight className="h-3.5 w-3.5 text-dolce-blue-deep shrink-0 mt-0.5" />
                      <p className="text-xs font-semibold text-dolce-blue-deep">{step.noteParallele}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {(step.outilsUtilises ?? []).map((outil, j) => (
                      <span key={j} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-dolce-blue-deep/8 text-dolce-blue-deep border border-dolce-blue-deep/15">
                        🔧 {outil}
                      </span>
                    ))}
                  </div>

                  {(step.recettesAssociees ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {step.recettesAssociees.map((r, j) => (
                        <span key={j} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-dolce-yellow/60 text-dolce-blue-deep border border-dolce-yellow-deep/30">
                          🍽 {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Liste de courses ──────────────────────────────────────────── */

function ShoppingSection({ liste }) {
  if (!liste) return null

  const categories = Object.entries(liste).filter(([, items]) => items?.length > 0)
  if (!categories.length) return null

  const categoryEmoji = {
    'Légumes & Fruits': '🥦',
    'Viandes & Poissons': '🥩',
    'Féculents': '🌾',
    'Produits laitiers': '🧀',
    'Épicerie': '🫙',
  }

  return (
    <div>
      <SectionTitle icon={ShoppingCart} title="Liste de courses" sub="Tout ce dont vous aurez besoin" />
      <div className="space-y-3">
        {categories.map(([cat, items]) => (
          <div key={cat} className="bg-white rounded-3xl border-2 border-dolce-blue-deep/10 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-dolce-yellow-soft/60 border-b border-dolce-blue-deep/8">
              <span className="text-lg">{categoryEmoji[cat] ?? '🛒'}</span>
              <span className="font-display text-base text-dolce-blue-deep">{cat}</span>
              <span className="ml-auto text-xs font-bold text-muted-foreground">{items.length} article{items.length > 1 ? 's' : ''}</span>
            </div>
            <div className="p-3 space-y-1">
              {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-dolce-blue-deep/6 last:border-0">
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                  <span className="text-sm font-bold text-dolce-blue-deep">
                    {item.quantity} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Conservation ──────────────────────────────────────────────── */

function ConservationSection({ conseils, astuce }) {
  if (!conseils?.length && !astuce) return null

  return (
    <div>
      <SectionTitle icon={Refrigerator} title="Conservation & Astuces" sub="Pour que tout reste délicieux toute la semaine" />
      <div className="space-y-3">
        {(conseils ?? []).map((conseil, i) => (
          <div key={i} className="flex items-start gap-3 bg-white rounded-2xl px-4 py-3 border-2 border-dolce-blue-deep/10">
            <div className="h-5 w-5 rounded-full bg-dolce-blue-deep flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px] font-black text-dolce-yellow">{i + 1}</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{conseil}</p>
          </div>
        ))}

        {astuce && (
          <div className="flex items-start gap-3 bg-dolce-blue-deep rounded-2xl px-4 py-4">
            <ChefHat className="h-5 w-5 text-dolce-yellow shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-dolce-yellow uppercase tracking-wider mb-1">Astuce du Chef</p>
              <p className="text-sm text-white leading-relaxed">{astuce}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Recettes ──────────────────────────────────────────────────── */

function RecettesSection({ recettes }) {
  const [open, setOpen] = useState(false)
  if (!recettes?.length) return null

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(s => !s)}
        className="w-full flex items-center justify-between px-5 py-4 rounded-3xl bg-white border-2 border-dolce-blue-deep/15 shadow-sm hover:border-dolce-blue-deep/40 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-dolce-blue-deep flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-dolce-yellow" />
          </div>
          <div className="text-left">
            <p className="font-display text-base text-dolce-blue-deep">Voir les recettes détaillées</p>
            <p className="text-xs text-muted-foreground">{recettes.length} recette{recettes.length > 1 ? 's' : ''} avec ingrédients & étapes</p>
          </div>
        </div>
        {open ? <ChevronUp className="h-5 w-5 text-dolce-blue-deep/50" /> : <ChevronDown className="h-5 w-5 text-dolce-blue-deep/50" />}
      </button>

      {open && (
        <div className="mt-4 space-y-4 animate-in slide-up-soft">
          {recettes.map((recipe, i) => (
            // BUG-008 : passer mealType (recipe.type ou 'déjeuner' par défaut)
            // et utiliser une clé stable plutôt que l'index seul.
            <RecipeCard key={recipe.name ?? i} recipe={recipe} mealType={recipe.type ?? 'déjeuner'} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Skeleton chargement ───────────────────────────────────────── */

function BatchSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Hero */}
      <div className="rounded-3xl bg-dolce-blue-deep/80 p-6 h-44" />
      {/* Étapes */}
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="rounded-3xl bg-white border-2 border-dolce-blue-deep/10 p-4 h-20" />
      ))}
    </div>
  )
}

/* ─── Composant principal ───────────────────────────────────────── */

export default function BatchCookingResult({ plan, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-end gap-4 px-4 py-4 rounded-3xl bg-dolce-yellow-soft border-2 border-dolce-blue-deep/15 shadow-dolce-soft">
          <RobotChef expression="cooking" size="md" className="shrink-0" />
          <div className="pb-2">
            <p className="font-display text-base text-dolce-blue-deep">
              Je prépare votre plan batch cooking...
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Je génère les recettes, le planning et la liste de courses ✨
            </p>
          </div>
        </div>
        <BatchSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-700">
        <div className="shrink-0 text-lg">⚠️</div>
        <div>
          <p className="font-bold text-sm">Une erreur est survenue</p>
          <p className="text-xs mt-0.5">{error}</p>
        </div>
      </div>
    )
  }

  if (!plan) return null

  return (
    <div className="space-y-6 pb-10">
      <BatchHero plan={plan} />
      <ToolsSection outils={plan.outilsNecessaires} />
      <PlanningSection planning={plan.planningSession} />
      <ShoppingSection liste={plan.listeCoursesGroupee} />
      <ConservationSection conseils={plan.conseilsConservation} astuce={plan.astucesChef} />
      <RecettesSection recettes={plan.recettes} />
    </div>
  )
}
