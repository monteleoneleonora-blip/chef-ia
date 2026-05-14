import { useState } from 'react'
import { Sparkles, Loader2, Users, UtensilsCrossed, Ban, Globe, Cpu, CheckCircle2, Clock, FileText, ChevronRight, Volume2, Square, Crown, BookOpen, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import RobotBubble from '@/components/mascot/RobotBubble'
import UpgradeModal from '@/components/subscription/UpgradeModal'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'
import { useSubscriptionStore } from '@/store/useSubscriptionStore'

const MEAL_EMOJI = { breakfast: '🥐', lunch: '🥗', dinner: '🍝' }
const MEAL_LABEL = { breakfast: 'petit-déj', lunch: 'déjeuner', dinner: 'dîner' }

function Chip({ children, color = 'default', className }) {
  const colors = {
    default: 'bg-muted text-muted-foreground border-border/50',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    red:     'bg-red-50 text-red-700 border-red-200',
    amber:   'bg-amber-50 text-amber-700 border-amber-200',
    sky:     'bg-sky-50 text-sky-700 border-sky-200',
    violet:  'bg-violet-50 text-violet-700 border-violet-200',
  }
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border',
      colors[color] ?? colors.default,
      className
    )}>
      {children}
    </span>
  )
}

function SummarySection({ icon: Icon, title, children, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground/70" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{title}</span>
      </div>
      {children}
    </div>
  )
}

function MemberPlanBadge({ plan }) {
  if (!plan) return (
    <span className="text-[10px] text-muted-foreground/50">Aucun plan</span>
  )
  if (plan.status === 'analyzing') return (
    <span className="flex items-center gap-1 text-[10px] text-amber-600">
      <Loader2 className="h-3 w-3 animate-spin" /> Analyse…
    </span>
  )
  if (plan.status === 'done') return (
    <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
      <CheckCircle2 className="h-3 w-3" />
      {plan.kcal ? `${plan.kcal} kcal` : 'Plan importé'}
    </span>
  )
  if (plan.status === 'error') return (
    <span className="text-[10px] text-red-500">Erreur analyse</span>
  )
  return null
}

function getRobotMessage(totalMeals, formData) {
  const hasNutrition = formData.familyMembers?.some(m => m.nutritionTargets?.kcal || m.nutritionTargets?.protein)
  const hasDiets = formData.familyMembers?.some(m => m.selectedDiets?.length > 0 || m.customDiet?.trim())
  const hasForbidden = formData.forbiddenIngredients?.length > 0
  const hasCuisines = formData.cuisines?.length > 0
  const hasPlans = formData.familyMembers?.some(m => m.nutritionPlan?.status === 'done')
  const membersCount = formData.totalPeople ?? 1

  if (totalMeals === 0) {
    return {
      expression: 'idle',
      message: 'Choisissez vos repas dans le formulaire, je m\'occupe du reste !',
      variant: 'default',
    }
  }

  const score = [hasNutrition, hasDiets, hasForbidden, hasCuisines, hasPlans].filter(Boolean).length

  if (score === 0) {
    return {
      expression: 'happy',
      message: `${totalMeals} recette${totalMeals > 1 ? 's' : ''} pour ${membersCount} pers. — ajoutez des contraintes pour personnaliser !`,
      variant: 'tip',
    }
  }
  if (score >= 3 || hasPlans) {
    return {
      expression: 'excited',
      message: 'Profil ultra-personnalisé — je vais créer des recettes sur-mesure pour votre foyer !',
      variant: 'success',
    }
  }
  return {
    expression: 'happy',
    message: 'Bon début ! Affinez encore avec des objectifs nutritionnels ou des cuisines.',
    variant: 'tip',
  }
}

export default function SmartSummary({ formData, onGenerate, isLoading }) {
  const mealEntries  = Object.entries(formData.mealCounts ?? {}).filter(([, n]) => n > 0)
  const totalMeals   = mealEntries.reduce((s, [, n]) => s + n, 0)
  const sub          = useSubscriptionStore()
  const isAIPlan     = sub.canUseAI()
  const canGenerate  = totalMeals > 0 && !isLoading
  const [showUpgrade, setShowUpgrade] = useState(false)

  const { forbiddenIngredients, cuisines, equipment, familyMembers, totalPeople, children } = formData

  const hasForbidden  = forbiddenIngredients?.length > 0
  const hasCuisines   = cuisines?.length > 0
  const hasEquipment  = equipment?.length > 0
  const membersWithPlans = (familyMembers ?? []).filter(m => m.nutritionPlan?.status === 'done')

  const robot = getRobotMessage(totalMeals, formData)
  const { speak, stop, isSpeaking, isSupported: ttsSupported } = useSpeechSynthesis()

  return (
    <div className="flex flex-col gap-5">

      {/* ── Message robot ── */}
      <div className="flex justify-center">
        <div className="relative">
          <RobotBubble
            expression={isLoading ? 'cooking' : isSpeaking ? 'excited' : robot.expression}
            size="sm"
            animate={!isLoading && !isSpeaking}
            variant={isLoading ? 'info' : robot.variant}
            message={
              isLoading
                ? <span className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    Je cuisine vos recettes, un instant…
                  </span>
                : <span className="text-sm leading-relaxed">{robot.message}</span>
            }
            side="right"
          />
          {/* Bouton vocal sur la bulle du robot */}
          {ttsSupported && !isLoading && (
            <button
              type="button"
              onClick={() => isSpeaking ? stop() : speak(typeof robot.message === 'string' ? robot.message : '')}
              title={isSpeaking ? 'Arrêter' : 'Écouter le robot'}
              className={cn(
                'absolute -bottom-2 -right-2 h-6 w-6 rounded-full border shadow-sm flex items-center justify-center transition-all',
                isSpeaking
                  ? 'bg-sky-500 text-white border-sky-400'
                  : 'bg-white text-muted-foreground border-border hover:text-sky-600 hover:border-sky-300'
              )}
            >
              {isSpeaking
                ? <Square className="h-2.5 w-2.5 fill-current" />
                : <Volume2 className="h-2.5 w-2.5" />
              }
            </button>
          )}
        </div>
      </div>

      {/* ── Card principale ── */}
      <div className="rounded-2xl border border-border/30 bg-white shadow-xl shadow-black/5 overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-border/30 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white">
          <h2 className="text-base font-bold text-foreground">Résumé de votre demande</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalMeals === 0
              ? 'Configurez vos repas dans le formulaire'
              : `${totalMeals} recette${totalMeals > 1 ? 's' : ''} · ${totalPeople ?? 1} personne${(totalPeople ?? 1) > 1 ? 's' : ''}`
            }
          </p>
          {/* Status chips */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <Chip color="sky">
              <BookOpen className="h-2.5 w-2.5 mr-1" />
              Banque · 100+ recettes
            </Chip>
            {isAIPlan ? (
              <Chip color="emerald">
                <Sparkles className="h-2.5 w-2.5 mr-1" />
                IA Premium active
              </Chip>
            ) : (
              <Chip color="amber">
                <Lock className="h-2.5 w-2.5 mr-1" />
                IA verrouillée
              </Chip>
            )}
          </div>
        </div>

        <div className="p-5 space-y-5">

          {/* Répartition repas */}
          {totalMeals > 0 && (
            <SummarySection icon={UtensilsCrossed} title="Repas">
              <div className="flex flex-wrap gap-2">
                {mealEntries.map(([type, count]) => (
                  <div key={type} className="flex items-center gap-1.5 bg-muted/40 rounded-xl px-3 py-1.5">
                    <span className="text-base leading-none">{MEAL_EMOJI[type]}</span>
                    <span className="text-sm font-semibold">{count}</span>
                    <span className="text-xs text-muted-foreground">{MEAL_LABEL[type]}</span>
                  </div>
                ))}
                {children?.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5">
                    <span className="text-base leading-none">👶</span>
                    <span className="text-xs text-amber-700">{children.length} enfant{children.length > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </SummarySection>
          )}

          {/* Membres de la famille */}
          {familyMembers?.length > 0 && (
            <SummarySection icon={Users} title="Membres du foyer">
              <div className="space-y-1.5">
                {familyMembers.map((m, i) => {
                  const name = m.name.trim() || `Membre ${i + 1}`
                  const diets = [...(m.selectedDiets ?? []), m.customDiet?.trim() ?? ''].filter(Boolean)
                  const nt = m.nutritionTargets ?? {}
                  const ntParts = [nt.kcal && `${nt.kcal} kcal`, nt.protein && `${nt.protein}g prot.`, nt.carbs && `${nt.carbs}g gl.`].filter(Boolean)
                  return (
                    <div key={m.id} className="flex items-start justify-between gap-2 py-1">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{name}</p>
                        {diets.length > 0 && (
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                            {diets.join(' · ')}
                          </p>
                        )}
                        {ntParts.length > 0 && (
                          <p className="text-[10px] text-amber-600 mt-0.5">{ntParts.join(' · ')}</p>
                        )}
                      </div>
                      <MemberPlanBadge plan={m.nutritionPlan} />
                    </div>
                  )
                })}
              </div>
            </SummarySection>
          )}

          {/* Ingrédients interdits */}
          {hasForbidden && (
            <SummarySection icon={Ban} title="Exclusions">
              <div className="flex flex-wrap gap-1">
                {forbiddenIngredients.map(ing => (
                  <Chip key={ing} color="red">{ing}</Chip>
                ))}
              </div>
            </SummarySection>
          )}

          {/* Cuisines */}
          {hasCuisines && (
            <SummarySection icon={Globe} title="Cuisines">
              <div className="flex flex-wrap gap-1">
                {cuisines.map(c => (
                  <Chip key={c} color="sky">{c}</Chip>
                ))}
              </div>
            </SummarySection>
          )}

          {/* Équipements */}
          {hasEquipment && (
            <SummarySection icon={Cpu} title="Équipements">
              <div className="flex flex-wrap gap-1">
                {equipment.map(e => (
                  <Chip key={e} color="violet">{e}</Chip>
                ))}
              </div>
            </SummarySection>
          )}

          {/* Plans nutritionnels importés */}
          {membersWithPlans.length > 0 && (
            <SummarySection icon={FileText} title="Plans nutritionnels importés">
              <div className="flex flex-wrap gap-1">
                {membersWithPlans.map(m => (
                  <Chip key={m.id} color="emerald">
                    <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                    {m.name.trim() || 'Membre'}
                  </Chip>
                ))}
              </div>
            </SummarySection>
          )}

          {/* État vide */}
          {totalMeals === 0 && (
            <div className="py-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Commencez par choisir vos repas dans le formulaire à gauche.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
                <Clock className="h-3.5 w-3.5" />
                Génération en 15–45 secondes selon le nombre de recettes
              </div>
            </div>
          )}
        </div>

        {/* ── Double CTA ── */}
        <div className="px-5 pb-5 flex flex-col gap-2.5">
          {/* Bouton 1 — Banque (toujours actif) */}
          <button
            type="button"
            onClick={() => document.getElementById('bank-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-sm transition-all hover:border-sky-300 hover:shadow-sm"
          >
            <BookOpen className="h-4 w-4" />
            Voir la banque de recettes
            <ChevronRight className="h-4 w-4 opacity-60" />
          </button>

          {/* Bouton 2 — Génération IA */}
          {isAIPlan ? (
            <Button
              type="button"
              size="lg"
              className={cn(
                'w-full h-12 text-base font-bold rounded-2xl shadow-lg transition-all duration-200',
                canGenerate
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-[1.01]'
                  : 'bg-muted text-muted-foreground shadow-none cursor-not-allowed'
              )}
              disabled={!canGenerate}
              onClick={onGenerate}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Génération en cours…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {totalMeals > 0
                    ? `Générer ${totalMeals} recette${totalMeals > 1 ? 's' : ''} avec l'IA`
                    : 'Choisissez des repas'
                  }
                  {canGenerate && <ChevronRight className="h-4 w-4 ml-auto" />}
                </span>
              )}
            </Button>
          ) : (
            <button
              type="button"
              onClick={() => setShowUpgrade(true)}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.01] transition-all"
            >
              <Lock className="h-4 w-4" />
              Générer avec l'IA
              <Crown className="h-4 w-4 ml-auto text-amber-200" />
            </button>
          )}

          {totalMeals > 0 && !isLoading && isAIPlan && (
            <p className="text-[10px] text-muted-foreground/50 text-center">
              <Clock className="h-2.5 w-2.5 inline mr-1" />
              ~{Math.max(15, totalMeals * 5)} secondes estimées
            </p>
          )}
        </div>
      </div>

      {showUpgrade && (
        <UpgradeModal reason="generation" onClose={() => setShowUpgrade(false)} />
      )}
    </div>
  )
}