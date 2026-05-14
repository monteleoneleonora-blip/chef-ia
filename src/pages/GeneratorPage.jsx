import { useEffect, useState } from 'react'
import StoryFeed, { StoryCard } from '@/components/story/StoryFeed'
import ResultsPanel        from '@/components/results/ResultsPanel'
import BatchCookingResult  from '@/components/results/BatchCookingResult'
import UpgradeModal        from '@/components/subscription/UpgradeModal'
import RobotChef           from '@/components/mascot/RobotChef'
import AdvancedPanel          from '@/components/form/AdvancedPanel'
import ChildrenConfig         from '@/components/form/ChildrenConfig'
import IngredientsSection     from '@/components/form/IngredientsSection'
import CompatibilitySection   from '@/components/form/CompatibilitySection'
import FamilyDietsSection     from '@/components/form/FamilyDietsSection'
import MedicalPlanSection     from '@/components/form/MedicalPlanSection'
import { useRecipeForm }       from '@/hooks/useRecipeForm'
import { useRecipeGeneration } from '@/hooks/useRecipeGeneration'
import { useBatchStore }       from '@/store/useBatchStore'
import { useWizardStore }      from '@/store/useWizardStore'
import { useSubscriptionStore } from '@/store/useSubscriptionStore'
import { useNavStore }         from '@/store/useNavStore'
import { useFamilyStore }      from '@/store/useFamilyStore'
import { CUISINE_TYPES } from '@/constants/cuisines'
import { Lock, ChevronDown, ChevronUp, Users, Minus, Plus, Settings2, Crown, ArrowDown, ArrowLeft, ChefHat, UtensilsCrossed, BookmarkPlus, CheckCircle2 } from 'lucide-react'
import { EQUIPMENT_LIST } from '@/constants/equipment'
import { cn } from '@/lib/utils'

const MEAL_TYPE_TO_COUNTS = {
  'petit-dejeuner': { breakfast: 3, lunch: 0, dinner: 0 },
  'dejeuner':       { breakfast: 0, lunch: 3, dinner: 0 },
  'diner':          { breakfast: 0, lunch: 0, dinner: 3 },
}

const MEAL_CARDS = [
  { key: 'breakfast', emoji: '🥐', label: 'Petit-dej', sub: 'matin' },
  { key: 'lunch',     emoji: '🥗', label: 'Dejeuner',  sub: 'midi'  },
  { key: 'dinner',    emoji: '🍝', label: 'Diner',     sub: 'soir'  },
]

const DIETS = [
  { key: 'Vegetarien',   emoji: '🥦' },
  { key: 'Vegan',        emoji: '🌱' },
  { key: 'Sans gluten',  emoji: '🌾' },
  { key: 'Sans lactose', emoji: '🥛' },
  { key: 'Keto',         emoji: '🥑' },
  { key: 'Mediterraneen',emoji: '🫒' },
]

export default function GeneratorPage({ initialView = 'story' }) {
  const formHandlers = useRecipeForm()
  const {
    recipes, batchPlan, isBatch, isLoading, error,
    generateRecipes, generateBatchCooking,
    showUpgrade, setShowUpgrade,
  } = useRecipeGeneration()
  const { pending, answers, consume } = useWizardStore()
  const plan          = useSubscriptionStore(s => s.plan)
  const isPremium     = plan !== 'free' && plan !== 'visitor'
  const isRegistered  = useSubscriptionStore(s => s.isRegistered())
  const remainingQuota = useSubscriptionStore(s => s.remainingPersonalized())
  /** True si l'utilisateur peut personnaliser maintenant (Premium ou quota > 0). */
  const canPersonalizeNow = isPremium || (isRegistered && remainingQuota > 0)

  const goToPage      = useNavStore(s => s.goToPage)
  const familyMembers = useFamilyStore(s => s.profile.members ?? [])

  const [view, setView] = useState(initialView)

  useEffect(() => { setView(initialView) }, [initialView])

  useEffect(() => {
    if (!pending || !answers) return
    consume()
    const mealCounts = MEAL_TYPE_TO_COUNTS[answers.mealType] ?? MEAL_TYPE_TO_COUNTS['diner']
    const formData = { ...formHandlers.formData, totalPeople: answers.totalPeople ?? 4, mealCounts }
    setView('results')
    setTimeout(() => generateRecipes(formData), 200)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (recipes !== null || batchPlan !== null || error !== null || isLoading) setView('results')
  }, [recipes, batchPlan, error, isLoading])

  const handleGenerate = () => {
    if (!canPersonalizeNow) { setShowUpgrade(true); return }
    generateRecipes(formHandlers.formData)
  }

  const handleBatchCooking = () => {
    if (!canPersonalizeNow) { setShowUpgrade(true); return }
    generateBatchCooking(formHandlers.formData)
  }

  if (view === 'results') {
    return (
      <div className="pb-24">
        <BackToStoryBanner
          onBack={() => setView('story')}
          isBatch={isBatch}
          batchPlan={batchPlan}
        />
        <div className="max-w-3xl mx-auto px-4 py-6 animate-in fade-in">
          {isBatch
            ? <BatchCookingResult plan={batchPlan} isLoading={isLoading} error={error} />
            : <ResultsPanel recipes={recipes} isLoading={isLoading} error={error} />
          }
        </div>
      </div>
    )
  }

  return (
    <>
      <StoryFeed>
        <StoryCard gradient="bg-dolce-stripes-soft">
          <StoryIntro onSeeBank={() => goToPage('bank')} />
        </StoryCard>

        <StoryCard gradient="bg-dolce-stripes-soft">
          <StoryMeals
            mealCounts={formHandlers.formData.mealCounts}
            mealPresence={formHandlers.formData.mealPresence}
            setMealTypeCount={formHandlers.setMealTypeCount}
            toggleMealPresence={formHandlers.toggleMealPresence}
            familyMembers={familyMembers}
          />
        </StoryCard>

        {familyMembers.length === 0 && (
          <StoryCard gradient="bg-dolce-stripes-soft">
            <StoryPeople
              totalPeople={formHandlers.formData.totalPeople}
              setTotalPeople={formHandlers.setTotalPeople}
            />
          </StoryCard>
        )}

        <StoryCard gradient="bg-dolce-stripes-soft">
          <StoryCuisines
            cuisines={formHandlers.formData.cuisines}
            toggleCuisine={formHandlers.toggleCuisine}
            step={familyMembers.length > 0 ? 2 : 3}
          />
        </StoryCard>

        {familyMembers.length === 0 && (
          <StoryCard gradient="bg-dolce-stripes-soft">
            <StoryDiets
              firstMember={formHandlers.formData.familyMembers?.[0]}
              toggleMemberDiet={formHandlers.toggleMemberDiet}
              step={4}
            />
          </StoryCard>
        )}

        {familyMembers.length === 0 && (
          <StoryCard gradient="bg-dolce-stripes-soft">
            <StoryEquipment
              equipment={formHandlers.formData.equipment ?? []}
              toggleEquipment={formHandlers.toggleEquipment}
              step={5}
            />
          </StoryCard>
        )}

        {familyMembers.length === 0 && (
          <StoryCard gradient="bg-dolce-stripes-soft" align="start">
            <StoryIngredients
              formData={formHandlers.formData}
              toggleIngredient={formHandlers.toggleIngredient}
              setCustomIngredients={formHandlers.setCustomIngredients}
              addTag={formHandlers.addTag}
              removeTag={formHandlers.removeTag}
              step={6}
            />
          </StoryCard>
        )}

        {familyMembers.length === 0 && (
          <StoryCard gradient="bg-dolce-stripes-soft" align="start">
            <StoryChildren
              children={formHandlers.formData.children ?? []}
              addChild={formHandlers.addChild}
              removeChild={formHandlers.removeChild}
              updateChildAge={formHandlers.updateChildAge}
              step={7}
            />
          </StoryCard>
        )}

        {familyMembers.length === 0 && (
          <StoryCard gradient="bg-dolce-stripes-soft" align="start">
            <StoryAssociations
              formData={formHandlers.formData}
              addTag={formHandlers.addTag}
              removeTag={formHandlers.removeTag}
              step={8}
            />
          </StoryCard>
        )}

        {familyMembers.length === 0 && (
          <StoryCard gradient="bg-dolce-stripes-soft" align="start">
            <StoryFamilyDiets
              formData={formHandlers.formData}
              handlers={formHandlers}
              step={9}
            />
          </StoryCard>
        )}

        {familyMembers.length === 0 && (
          <StoryCard gradient="bg-dolce-stripes-soft" align="start">
            <StoryMedicalPlan
              plan={formHandlers.formData.medicalNutritionPlan}
              onUpdate={formHandlers.updateMedicalNutritionPlan}
              step={10}
            />
          </StoryCard>
        )}

        {familyMembers.length > 0 && (
          <StoryCard gradient="bg-dolce-stripes-soft">
            <StoryEquipment
              equipment={formHandlers.formData.equipment ?? []}
              toggleEquipment={formHandlers.toggleEquipment}
              step={3}
            />
          </StoryCard>
        )}

        <StoryCard gradient="bg-dolce-stripes-soft">
          <StoryFinal
            formData={formHandlers.formData}
            isPremium={isPremium}
            canPersonalize={canPersonalizeNow}
            remainingQuota={remainingQuota}
            onGenerate={handleGenerate}
            onBatchCooking={handleBatchCooking}
            isLoading={isLoading}
            onSeeBank={() => goToPage('bank')}
            advancedProps={formHandlers}
          />
        </StoryCard>
      </StoryFeed>

      {showUpgrade && (
        <UpgradeModal reason="generation" onClose={() => setShowUpgrade(false)} />
      )}
    </>
  )
}

function StoryIntro({ onSeeBank }) {
  return (
    <div className="text-center space-y-6 animate-in slide-up w-full">
      <div className="flex justify-center pt-10">
        <div className="animate-bob">
          <RobotChef expression="excited" size="xl" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="font-script text-5xl text-dolce-blue-deep leading-none">Allons cuisiner !</p>
        <h1 className="font-display text-3xl sm:text-4xl text-foreground tracking-tight">
          Que cuisinons-nous<br/>aujourd'hui ?
        </h1>
      </div>
      <div className="pt-4 text-dolce-blue-deep/40 animate-bounce">
        <ArrowDown className="h-5 w-5 mx-auto" />
        <p className="text-[10px] font-semibold uppercase tracking-wider mt-1">Faites defiler</p>
      </div>
    </div>
  )
}

/* Chips membres pour une instance donnée */
function MemberChips({ mealKey, instanceIdx, instancePresence, familyMembers, toggleMealPresence }) {
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {familyMembers.map(member => {
          const selected = instancePresence.includes(member.id)
          const initiale = (member.name || '?').charAt(0).toUpperCase()
          return (
            <button
              key={member.id}
              type="button"
              onClick={() => toggleMealPresence(mealKey, instanceIdx, member.id)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border',
                selected
                  ? 'bg-dolce-yellow text-dolce-blue-deep border-dolce-yellow shadow-sm'
                  : 'bg-white/15 text-white/70 border-white/20 hover:bg-white/25 hover:text-white'
              )}
            >
              <span className={cn(
                'h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-black shrink-0',
                selected ? 'bg-dolce-blue-deep text-dolce-yellow' : 'bg-white/20 text-white'
              )}>
                {initiale}
              </span>
              {member.name || 'Sans nom'}
            </button>
          )
        })}
      </div>
      {instancePresence.length === 0 && (
        <p className="text-[10px] text-white/40 mt-1 italic">Aucun sélectionné = tout le monde</p>
      )}
    </div>
  )
}

/* Card repas avec gestion accordéon par instance */
function MealCard({ card, count, mealPresence, setMealTypeCount, toggleMealPresence, familyMembers }) {
  const active     = count > 0
  const hasMembers = familyMembers.length > 0
  // Mode individuel : affiché seulement si l'utilisateur l'active ET count > 1
  const [perInstance, setPerInstance] = useState(false)
  // Index de l'instance ouverte dans l'accordéon (-1 = aucune)
  const [openIdx, setOpenIdx]         = useState(0)

  // Résume les présences de toutes les instances pour l'affichage compact
  const allSameConfig = () => {
    const instances = mealPresence?.[card.key] ?? []
    if (instances.length === 0) return true
    const ref = JSON.stringify(instances[0] ?? [])
    return instances.every(inst => JSON.stringify(inst ?? []) === ref)
  }

  // Quand on passe en mode "même pour tous", on applique l'instance 0 à toutes
  const applyToAll = () => {
    const src = mealPresence?.[card.key]?.[0] ?? []
    for (let i = 1; i < count; i++) {
      // On remet chaque instance à vide puis on recopie
      const current = mealPresence?.[card.key]?.[i] ?? []
      // Enlève les membres non présents dans src
      current.filter(id => !src.includes(id)).forEach(id => toggleMealPresence(card.key, i, id))
      // Ajoute les membres présents dans src mais pas dans current
      src.filter(id => !current.includes(id)).forEach(id => toggleMealPresence(card.key, i, id))
    }
  }

  return (
    <div className={cn(
      'rounded-3xl p-4 transition-all duration-300 border-2',
      active
        ? 'bg-dolce-blue-deep border-dolce-blue-deep shadow-dolce-deep'
        : 'bg-white/80 border-dolce-blue-deep/15 hover:border-dolce-blue-deep/40'
    )}>
      {/* Ligne principale : emoji + label + stepper */}
      <div className="flex items-center gap-3">
        <div className={cn('text-4xl transition-transform shrink-0', active && 'scale-110 animate-bob')}>
          {card.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('font-display text-lg leading-tight', active ? 'text-dolce-yellow' : 'text-foreground')}>
            {card.label}
          </p>
          <p className={cn('text-xs', active ? 'text-dolce-yellow/80' : 'text-muted-foreground')}>
            {count === 0 ? card.sub : `${count} recette${count > 1 ? 's' : ''}`}
          </p>
        </div>
        <div className={cn(
          'flex items-center gap-1 rounded-2xl p-1 shrink-0',
          active ? 'bg-white/15' : 'bg-dolce-blue-deep/5'
        )}>
          <button type="button" onClick={() => setMealTypeCount(card.key, Math.max(0, count - 1))}
            disabled={count <= 0}
            className={cn('h-8 w-8 rounded-xl flex items-center justify-center disabled:opacity-30 transition-colors',
              active ? 'text-white hover:bg-white/15' : 'text-dolce-blue-deep hover:bg-dolce-blue-deep/10')}
            aria-label="Moins"><Minus className="h-4 w-4" /></button>
          <span className={cn('font-bold text-lg w-7 text-center tabular-nums', active ? 'text-white' : 'text-dolce-blue-deep')}>{count}</span>
          <button type="button" onClick={() => setMealTypeCount(card.key, Math.min(10, count + 1))}
            disabled={count >= 10}
            className={cn('h-8 w-8 rounded-xl flex items-center justify-center disabled:opacity-30 transition-colors',
              active ? 'text-white hover:bg-white/15' : 'text-dolce-blue-deep hover:bg-dolce-blue-deep/10')}
            aria-label="Plus"><Plus className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Présences — section membres */}
      {active && hasMembers && (
        <div className="mt-3 pt-3 border-t border-white/15">

          {/* count = 1 : affichage simple */}
          {count === 1 && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60 mb-2">Qui sera présent ?</p>
              <MemberChips
                mealKey={card.key} instanceIdx={0}
                instancePresence={mealPresence?.[card.key]?.[0] ?? []}
                familyMembers={familyMembers} toggleMealPresence={toggleMealPresence}
              />
            </>
          )}

          {/* count > 1 : mode global ou accordéon */}
          {count > 1 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Qui sera présent ?</p>
                <button
                  type="button"
                  onClick={() => { setPerInstance(s => !s); setOpenIdx(0) }}
                  className="text-[10px] font-bold text-dolce-yellow/80 hover:text-dolce-yellow underline underline-offset-2 transition-colors"
                >
                  {perInstance ? 'Même config pour tous' : 'Personnaliser par repas'}
                </button>
              </div>

              {/* Mode global : une seule ligne de chips */}
              {!perInstance && (
                <MemberChips
                  mealKey={card.key} instanceIdx={0}
                  instancePresence={mealPresence?.[card.key]?.[0] ?? []}
                  familyMembers={familyMembers}
                  toggleMealPresence={(key, idx, id) => {
                    // Applique le toggle à TOUTES les instances
                    for (let i = 0; i < count; i++) toggleMealPresence(key, i, id)
                  }}
                />
              )}

              {/* Mode accordéon : un item par repas, un seul ouvert à la fois */}
              {perInstance && Array.from({ length: count }).map((_, idx) => {
                const instancePresence = mealPresence?.[card.key]?.[idx] ?? []
                const isOpen = openIdx === idx
                const summary = instancePresence.length === 0
                  ? 'Tout le monde'
                  : instancePresence
                      .map(id => familyMembers.find(m => m.id === id)?.name || '?')
                      .join(', ')
                return (
                  <div key={idx} className="rounded-2xl overflow-hidden border border-white/15">
                    <button
                      type="button"
                      onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-white/10 hover:bg-white/15 transition-colors"
                    >
                      <span className="text-xs font-bold text-dolce-yellow">{card.label} {idx + 1}</span>
                      <span className="flex items-center gap-2">
                        <span className="text-[10px] text-white/60 truncate max-w-[120px]">{summary}</span>
                        {isOpen
                          ? <ChevronUp className="h-3.5 w-3.5 text-white/50 shrink-0" />
                          : <ChevronDown className="h-3.5 w-3.5 text-white/50 shrink-0" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-3 pb-3 pt-2 bg-white/5">
                        <MemberChips
                          mealKey={card.key} instanceIdx={idx}
                          instancePresence={instancePresence}
                          familyMembers={familyMembers} toggleMealPresence={toggleMealPresence}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function StoryMeals({ mealCounts, mealPresence, setMealTypeCount, toggleMealPresence, familyMembers }) {
  const total      = Object.values(mealCounts).reduce((s, n) => s + n, 0)

  return (
    <div className="space-y-5 animate-in slide-up w-full">
      <div className="text-center">
        <p className="font-script text-3xl text-dolce-blue-deep mb-1">Étape 1</p>
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight">Quels repas ?</h2>
        <p className="text-sm text-muted-foreground mt-1">Choisissez par type, ajustez les quantites</p>
      </div>

      <div className="space-y-3">
        {MEAL_CARDS.map(card => (
          <MealCard
            key={card.key}
            card={card}
            count={mealCounts[card.key] ?? 0}
            mealPresence={mealPresence}
            setMealTypeCount={setMealTypeCount}
            toggleMealPresence={toggleMealPresence}
            familyMembers={familyMembers}
          />
        ))}
      </div>

      <div className="text-center">
        <span className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all',
          total > 0
            ? 'bg-dolce-blue-deep text-dolce-yellow shadow-dolce-warm animate-ciao'
            : 'bg-white/60 text-muted-foreground border border-dolce-blue-deep/15'
        )}>
          {total > 0 ? `${total} recette${total > 1 ? 's' : ''} au menu` : 'Selectionnez vos repas'}
        </span>
      </div>
    </div>
  )
}

function StoryPeople({ totalPeople, setTotalPeople }) {
  return (
    <div className="space-y-7 animate-in slide-up text-center w-full">
      <div>
        <p className="font-script text-3xl text-dolce-blue-deep mb-1">Étape 2</p>
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight">Pour combien<br/>de personnes ?</h2>
      </div>

      <div className="flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => setTotalPeople(Math.max(1, totalPeople - 1))}
          disabled={totalPeople <= 1}
          className="h-14 w-14 rounded-3xl bg-white shadow-dolce-soft border-2 border-dolce-blue-deep/15 flex items-center justify-center text-dolce-blue-deep hover:shadow-dolce-warm hover:border-dolce-blue-deep/40 transition-all disabled:opacity-30"
          aria-label="Moins"
        >
          <Minus className="h-6 w-6" />
        </button>
        <div className="flex flex-col items-center">
          <div className="font-display text-7xl sm:text-8xl text-dolce-blue-deep tabular-nums leading-none">
            {totalPeople}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">{totalPeople > 1 ? 'personnes' : 'personne'}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setTotalPeople(Math.min(20, totalPeople + 1))}
          disabled={totalPeople >= 20}
          className="h-14 w-14 rounded-3xl bg-white shadow-dolce-soft border-2 border-dolce-blue-deep/15 flex items-center justify-center text-dolce-blue-deep hover:shadow-dolce-warm hover:border-dolce-blue-deep/40 transition-all disabled:opacity-30"
          aria-label="Plus"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <div className="flex justify-center gap-2 flex-wrap">
        {[2, 4, 6, 8].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => setTotalPeople(n)}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-bold transition-all',
              totalPeople === n
                ? 'bg-dolce-blue-deep text-dolce-yellow shadow-md'
                : 'bg-white/70 text-muted-foreground hover:text-foreground border border-dolce-blue-deep/15'
            )}
          >
            {n} pers.
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground/70 italic">Les quantites s'adaptent automatiquement</p>
    </div>
  )
}

function StoryCuisines({ cuisines, toggleCuisine, step = 3 }) {
  const selected = cuisines ?? []

  return (
    <div className="space-y-5 animate-in slide-up w-full">
      <div className="text-center">
        <p className="font-script text-3xl text-dolce-blue-deep mb-1">Étape {step}</p>
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight">Inspirations<br/>culinaires</h2>
        <p className="text-sm text-muted-foreground mt-2">Optionnel — laissez vide pour tout explorer</p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {CUISINE_TYPES.map(({ key, label, emoji }) => {
          const active = selected.includes(key)
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleCuisine(key)}
              className={cn(
                'flex flex-col items-center gap-1 py-3 px-2 rounded-3xl border-2 transition-all duration-200',
                active
                  ? 'bg-gradient-to-br from-dolce-yellow to-dolce-yellow-deep border-dolce-blue-deep text-dolce-blue-deep shadow-dolce-warm scale-105'
                  : 'bg-white/80 border-dolce-blue-deep/15 text-muted-foreground hover:border-dolce-blue-deep/40 hover:bg-white'
              )}
            >
              <span className="text-2xl leading-none">{emoji}</span>
              <span className="text-[11px] font-bold leading-tight text-center">{label}</span>
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <div className="flex justify-center pt-2">
          <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-dolce-blue-deep text-dolce-yellow font-bold animate-ciao">
            {selected.length} cuisine{selected.length > 1 ? 's' : ''} selectionnee{selected.length > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}

function StoryDiets({ firstMember, toggleMemberDiet, step = 4 }) {
  const activeDiets   = firstMember?.selectedDiets ?? []
  const familyMembers = useFamilyStore(s => s.profile.members ?? [])
  const hasFamily     = familyMembers.length > 0

  return (
    <div className="space-y-5 animate-in slide-up w-full">
      <div className="text-center">
        <p className="font-script text-3xl text-dolce-blue-deep mb-1">Étape {step}</p>
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight">Regimes<br/>alimentaires</h2>
        <p className="text-sm text-muted-foreground mt-2">Optionnel — toutes les recettes seront compatibles</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {DIETS.map(({ key, emoji }) => {
          const active = activeDiets.includes(key)
          return (
            <button
              key={key}
              type="button"
              onClick={() => firstMember && toggleMemberDiet(firstMember.id, key)}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5 rounded-3xl border-2 text-left transition-all',
                active
                  ? 'bg-gradient-to-r from-dolce-basil to-dolce-basil-deep border-transparent text-white shadow-dolce-warm'
                  : 'bg-white/80 border-dolce-blue-deep/15 text-foreground hover:border-dolce-basil/50 hover:bg-white'
              )}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="font-bold text-sm">{key}</span>
            </button>
          )
        })}
      </div>

      {!hasFamily && (
        <p className="text-xs text-muted-foreground/70 italic text-center">
          Plusieurs profils ? Configurez-les sur l'ecran final.
        </p>
      )}
    </div>
  )
}

function StoryEquipment({ equipment, toggleEquipment, step = 3 }) {
  const selected = equipment ?? []

  return (
    <div className="space-y-5 animate-in slide-up w-full">
      <div className="text-center">
        <p className="font-script text-3xl text-dolce-blue-deep mb-1">Étape {step}</p>
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight">Outils de<br/>cuisine</h2>
        <p className="text-sm text-muted-foreground mt-2">Optionnel — les recettes s'adapteront à vos équipements</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {EQUIPMENT_LIST.map(({ key, label, emoji }) => {
          const active = selected.includes(key)
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleEquipment(key)}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5 rounded-3xl border-2 text-left transition-all',
                active
                  ? 'bg-gradient-to-r from-dolce-blue-deep to-dolce-blue-deep/80 border-transparent text-white shadow-dolce-deep'
                  : 'bg-white/80 border-dolce-blue-deep/15 text-foreground hover:border-dolce-blue-deep/40 hover:bg-white'
              )}
            >
              <span className="text-2xl shrink-0">{emoji}</span>
              <span className="font-bold text-sm leading-tight">{label}</span>
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-dolce-blue-deep text-dolce-yellow font-bold animate-ciao">
            <ChefHat className="h-3 w-3" />
            {selected.length} outil{selected.length > 1 ? 's' : ''} sélectionné{selected.length > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}

function StoryIngredients({ formData, toggleIngredient, setCustomIngredients, addTag, removeTag, step = 6 }) {
  const filledCount =
    (formData.checkedIngredients?.length ?? 0) +
    (formData.forbiddenIngredients?.length ?? 0)

  return (
    <div className="space-y-5 animate-in slide-up w-full">
      <div className="text-center">
        <p className="font-script text-3xl text-dolce-blue-deep mb-1">Étape {step}</p>
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight">Ingrédients<br/>détaillés</h2>
        <p className="text-sm text-muted-foreground mt-2">Optionnel — ingrédients à favoriser ou interdire</p>
      </div>
      <div className="bg-white/80 rounded-3xl p-4 border-2 border-dolce-blue-deep/10">
        <IngredientsSection
          checkedIngredients={formData.checkedIngredients}
          customIngredients={formData.customIngredients}
          forbiddenIngredients={formData.forbiddenIngredients}
          onToggleIngredient={toggleIngredient}
          onCustomIngredientsChange={setCustomIngredients}
          onAddTag={addTag}
          onRemoveTag={removeTag}
        />
      </div>
      {filledCount > 0 && (
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-dolce-blue-deep text-dolce-yellow font-bold animate-ciao">
            {filledCount} ingrédient{filledCount > 1 ? 's' : ''} configuré{filledCount > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}

function StoryChildren({ children, addChild, removeChild, updateChildAge, step = 7 }) {
  const count = children?.length ?? 0

  return (
    <div className="space-y-5 animate-in slide-up w-full">
      <div className="text-center">
        <p className="font-script text-3xl text-dolce-blue-deep mb-1">Étape {step}</p>
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight">Enfants</h2>
        <p className="text-sm text-muted-foreground mt-2">Optionnel — les recettes s'adapteront à leur âge</p>
      </div>
      <div className="bg-white/80 rounded-3xl p-4 border-2 border-dolce-blue-deep/10">
        <ChildrenConfig
          children={children ?? []}
          onAdd={addChild}
          onRemove={removeChild}
          onUpdateAge={updateChildAge}
        />
      </div>
      {count > 0 && (
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-dolce-blue-deep text-dolce-yellow font-bold animate-ciao">
            {count} enfant{count > 1 ? 's' : ''} configuré{count > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}

function StoryAssociations({ formData, addTag, removeTag, step = 8 }) {
  const total =
    (formData.compatibleCombinations?.length ?? 0) +
    (formData.incompatibleCombinations?.length ?? 0)

  return (
    <div className="space-y-5 animate-in slide-up w-full">
      <div className="text-center">
        <p className="font-script text-3xl text-dolce-blue-deep mb-1">Étape {step}</p>
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight">Associations<br/>d'ingrédients</h2>
        <p className="text-sm text-muted-foreground mt-2">Optionnel — combinaisons à favoriser ou éviter</p>
      </div>
      <div className="bg-white/80 rounded-3xl p-4 border-2 border-dolce-blue-deep/10">
        <CompatibilitySection
          compatibleCombinations={formData.compatibleCombinations}
          incompatibleCombinations={formData.incompatibleCombinations}
          onAdd={addTag}
          onRemove={removeTag}
        />
      </div>
      {total > 0 && (
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-dolce-blue-deep text-dolce-yellow font-bold animate-ciao">
            {total} association{total > 1 ? 's' : ''} configurée{total > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}

function StoryFamilyDiets({ formData, handlers, step = 9 }) {
  const filled = (formData.familyMembers ?? []).filter(
    m => m.selectedDiets?.length > 0 || m.customDiet?.trim()
  ).length

  return (
    <div className="space-y-5 animate-in slide-up w-full">
      <div className="text-center">
        <p className="font-script text-3xl text-dolce-blue-deep mb-1">Étape {step}</p>
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight">Profils<br/>diététiques</h2>
        <p className="text-sm text-muted-foreground mt-2">Optionnel — régimes par membre de la famille</p>
      </div>
      <div className="bg-white/80 rounded-3xl p-4 border-2 border-dolce-blue-deep/10">
        <FamilyDietsSection
          familyMembers={formData.familyMembers}
          onAdd={handlers.addFamilyMember}
          onRemove={handlers.removeFamilyMember}
          onUpdateName={handlers.updateMemberName}
          onToggleDiet={handlers.toggleMemberDiet}
          onUpdateCustomDiet={handlers.updateMemberCustomDiet}
          onUpdateNutritionPlan={handlers.updateMemberNutritionPlan}
          onUpdateNutritionTarget={handlers.updateMemberNutritionTarget}
          onLoadMembers={handlers.loadFamilyMembers}
          hideSave
        />
      </div>
      {filled > 0 && (
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-dolce-blue-deep text-dolce-yellow font-bold animate-ciao">
            {filled} profil{filled > 1 ? 's' : ''} configuré{filled > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}

function StoryMedicalPlan({ plan, onUpdate, step = 10 }) {
  const isDone = plan?.status === 'done'

  return (
    <div className="space-y-5 animate-in slide-up w-full">
      <div className="text-center">
        <p className="font-script text-3xl text-dolce-blue-deep mb-1">Étape {step}</p>
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight">Plan médical<br/>nutritionnel</h2>
        <p className="text-sm text-muted-foreground mt-2">Optionnel — importez votre ordonnance diététique</p>
      </div>
      <div className="bg-white/80 rounded-3xl p-4 border-2 border-dolce-blue-deep/10">
        <MedicalPlanSection plan={plan} onUpdate={onUpdate} />
      </div>
      {isDone && (
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-dolce-blue-deep text-dolce-yellow font-bold animate-ciao">
            ✓ Plan analysé
          </span>
        </div>
      )}
    </div>
  )
}

function StoryFinal({ formData, isPremium, canPersonalize, remainingQuota, onGenerate, onBatchCooking, isLoading, onSeeBank, advancedProps }) {
  const totalMeals    = Object.values(formData.mealCounts ?? {}).reduce((s, n) => s + n, 0)
  const canGenerate   = totalMeals > 0 && !isLoading
  const [showAdvanced, setShowAdvanced] = useState(false)
  const showQuotaCta  = !isPremium && canPersonalize && Number.isFinite(remainingQuota)
  const familyMembers = useFamilyStore(s => s.profile.members ?? [])
  const hasFamily     = familyMembers.length > 0

  const cuisinesCount = formData.cuisines?.length ?? 0
  const dietsCount    = formData.familyMembers?.[0]?.selectedDiets?.length ?? 0

  return (
    <div className="space-y-5 animate-in slide-up w-full">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <RobotChef expression="excited" size="lg" accessory="pasta" />
        </div>
        <p className="font-script text-3xl text-dolce-blue-deep mb-1">Et voilà !</p>
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight">A table !</h2>
      </div>

      <div className="glass rounded-3xl p-5 space-y-3 shadow-dolce-soft">
        <RecapRow label="Repas"      value={`${totalMeals} recette${totalMeals > 1 ? 's' : ''}`} icon="🍽️" />
        <RecapRow label="Convives"   value={`${formData.totalPeople ?? 4} pers.`} icon="👥" />
        {cuisinesCount > 0 && <RecapRow label="Cuisines" value={`${cuisinesCount}`} icon="🌍" />}
        {dietsCount > 0    && <RecapRow label="Regimes"  value={`${dietsCount}`}   icon="🌱" />}
      </div>

      {(isPremium || canPersonalize) ? (
        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate}
          className={cn(
            'w-full py-4 rounded-2xl font-display text-lg transition-all duration-300',
            canGenerate
              ? 'bg-dolce-blue-deep text-dolce-yellow shadow-dolce-deep hover:scale-[1.01] active:scale-[0.99]'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          {isLoading
            ? 'Le Chef cuisine...'
            : totalMeals > 0
              ? showQuotaCta
                ? `Recevoir ma recette offerte (${remainingQuota} restante${remainingQuota > 1 ? 's' : ''})`
                : `Generer ${totalMeals} recette${totalMeals > 1 ? 's' : ''}`
              : 'Choisissez des repas'}
        </button>
      ) : (
        <button
          type="button"
          onClick={onGenerate}
          className="w-full py-4 rounded-2xl font-display text-lg bg-dolce-blue-deep text-dolce-yellow shadow-dolce-deep hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <Lock className="h-5 w-5" />
          Debloquer la generation IA
          <Crown className="h-5 w-5" />
        </button>
      )}

      {/* Batch cooking */}
      <button
        type="button"
        onClick={onBatchCooking}
        disabled={!canGenerate}
        className={cn(
          'w-full py-3.5 rounded-2xl font-display text-base transition-all duration-300 flex items-center justify-center gap-2.5 border-2',
          canGenerate
            ? 'bg-white border-dolce-blue-deep text-dolce-blue-deep hover:bg-dolce-yellow-soft hover:scale-[1.01] active:scale-[0.99] shadow-sm'
            : 'bg-white/50 border-dolce-blue-deep/20 text-dolce-blue-deep/40 cursor-not-allowed'
        )}
      >
        <UtensilsCrossed className="h-4 w-4 shrink-0" />
        Générer le batch cooking
      </button>

      {!hasFamily && (
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(s => !s)}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings2 className="h-3.5 w-3.5" />
            {showAdvanced ? 'Masquer' : 'Configuration avancee'}
            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showAdvanced && 'rotate-180')} />
          </button>
          {showAdvanced && (
            <div className="mt-3 animate-in slide-up-soft">
              <AdvancedPanel {...advancedProps} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RecapRow({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-semibold text-foreground">{label}</span>
      </div>
      <span className="text-sm font-bold text-dolce-blue-deep">{value}</span>
    </div>
  )
}

function BackToStoryBanner({ onBack, isBatch, batchPlan }) {
  const savePlan   = useBatchStore(s => s.savePlan)
  const plans      = useBatchStore(s => s.plans)
  const goToPage   = useNavStore(s => s.goToPage)
  const [saved, setSaved] = useState(false)

  // Vérifie si ce plan est déjà sauvegardé (même titre + même durée)
  const alreadySaved = batchPlan && plans.some(
    p => p.sessionTitre === batchPlan.sessionTitre && p.dureeTotal === batchPlan.dureeTotal
  )

  const handleSave = () => {
    if (!batchPlan || alreadySaved) return
    savePlan(batchPlan)
    setSaved(true)
  }

  return (
    <div className="sticky top-[60px] z-20 bg-white/90 backdrop-blur-md border-b border-dolce-blue-deep/10">
      <div className="max-w-3xl mx-auto px-4 py-2 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-dolce-blue-deep/70 hover:text-dolce-blue-deep transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>

        {isBatch && batchPlan && (
          <div className="ml-auto flex items-center gap-2">
            {/* Bouton sauvegarder */}
            {(alreadySaved || saved) ? (
              <button
                type="button"
                onClick={() => goToPage('batch')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 transition-colors"
              >
                <CheckCircle2 className="h-3 w-3" />
                Sauvegardé — Voir mes sessions
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-dolce-yellow text-dolce-blue-deep border border-dolce-yellow-deep/40 hover:scale-105 transition-all"
              >
                <BookmarkPlus className="h-3 w-3" />
                Sauvegarder cette session
              </button>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold bg-dolce-blue-deep text-dolce-yellow">
              <UtensilsCrossed className="h-3 w-3" />
              Batch Cooking
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
