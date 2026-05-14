import { useState, useRef, useEffect, useMemo } from 'react'
import { Clock, Users, Flame, Heart, Ban, ShoppingCart, ChefHat,
         ChevronDown, ChevronUp, Volume2, Square, Loader2,
         Pause, Play, SkipForward, SkipBack, X, Dumbbell, Wheat,
         Minus, Plus, Timer, TimerOff, Euro, Lightbulb, Shuffle } from 'lucide-react'
import IngredientList from './IngredientList'
import StepsList      from './StepsList'
import RecipeImage    from './RecipeImage'
import { useFavoritesStore }      from '@/store/useFavoritesStore'
import { useRedListStore }        from '@/store/useRedListStore'
import { useShoppingStore }       from '@/store/useShoppingStore'
import { useSubscriptionStore }   from '@/store/useSubscriptionStore'
import { useSpeechSynthesis, useStepByStepSpeech, recipeToSpeechText } from '@/hooks/useSpeechSynthesis'
import { getBudget } from '@/data/budgetMap'
import { cn } from '@/lib/utils'
import TransformModal from '@/components/premium/TransformModal'
import UpgradeModal   from '@/components/subscription/UpgradeModal'

const DIFFICULTY = {
  'Facile':    { label: 'Facile',    dot: 'bg-emerald-400', bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50',   border: 'border-emerald-200', width: 'w-1/3'  },
  'Moyen':     { label: 'Interméd.', dot: 'bg-amber-400',   bar: 'bg-amber-500',   text: 'text-amber-700',   bg: 'bg-amber-50',     border: 'border-amber-200',   width: 'w-2/3'  },
  'Difficile': { label: 'Expert',    dot: 'bg-red-400',     bar: 'bg-red-500',     text: 'text-red-700',     bg: 'bg-red-50',       border: 'border-red-200',     width: 'w-full' },
}

const MEAL_THEME = {
  'petit-déjeuner': { gradient: 'from-amber-500 to-orange-500',   glow: 'shadow-amber-500/20',  accent: 'bg-amber-500'  },
  'déjeuner':       { gradient: 'from-emerald-500 to-teal-500',   glow: 'shadow-emerald-500/20',accent: 'bg-emerald-500'},
  'dîner':          { gradient: 'from-violet-500 to-indigo-500',  glow: 'shadow-violet-500/20', accent: 'bg-violet-500' },
  // BUG-009 : 'collation' présent dans la base mais absent de MEAL_THEME.
  'collation':      { gradient: 'from-pink-400 to-rose-400',      glow: 'shadow-pink-400/20',   accent: 'bg-pink-400'   },
}

const DIET_STYLE = {
  'Vegan':        { bg: 'bg-green-100',   text: 'text-green-700',   icon: '🌱' },
  'Végétarien':   { bg: 'bg-lime-100',    text: 'text-lime-700',    icon: '🥦' },
  'Sans gluten':  { bg: 'bg-yellow-100',  text: 'text-yellow-700',  icon: '🌾' },
  'Sans lactose': { bg: 'bg-blue-100',    text: 'text-blue-700',    icon: '🥛' },
  'Keto':         { bg: 'bg-orange-100',  text: 'text-orange-700',  icon: '🥑' },
  'Protéiné':     { bg: 'bg-red-100',     text: 'text-red-700',     icon: '💪' },
  'Méditerranéen':{ bg: 'bg-cyan-100',    text: 'text-cyan-700',    icon: '🫒' },
  'Paléo':        { bg: 'bg-stone-100',   text: 'text-stone-700',   icon: '🦴' },
}

// BUG-020 : la base de données utilise des clés minuscules/tiretées
// (ex: 'sans-gluten', 'végétarien') alors que DIET_STYLE utilise PascalCase.
// Ce dictionnaire normalise les clés entrantes.
const DIET_KEY_NORMALIZE = {
  'vegan':         'Vegan',
  'végétarien':    'Végétarien',
  'vegetarien':    'Végétarien',
  'sans-gluten':   'Sans gluten',
  'sans gluten':   'Sans gluten',
  'sans-lactose':  'Sans lactose',
  'sans lactose':  'Sans lactose',
  'keto':          'Keto',
  'protéiné':      'Protéiné',
  'proteïné':      'Protéiné',
  'méditerranéen': 'Méditerranéen',
  'mediterraneen': 'Méditerranéen',
  'paléo':         'Paléo',
  'paleo':         'Paléo',
}

function normalizeDietKey(diet) {
  if (!diet) return diet
  return DIET_KEY_NORMALIZE[diet.toLowerCase()] ?? diet
}

const BUDGET_STYLE = {
  'économique': { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500',  label: 'Éco',     emoji: '🟢' },
  'moyen':      { bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-500',   label: 'Moyen',   emoji: '🔵' },
  'premium':    { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500', label: 'Premium', emoji: '🟣' },
}

// ── Minuteur de cuisson ───────────────────────────────────────────
// BUG-003 / BUG-015 : useRef pour l'intervalle (pas useState) afin
// d'éviter le stale closure et la fuite mémoire au démontage.
function useCookingTimer() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  // Nettoyage automatique au démontage du composant
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const start = (secs) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setSeconds(secs)
    setRunning(true)
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          setRunning(false)
          return 0
        }
        return s - 1
      })
    }, 1000)
  }

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    setRunning(false)
    setSeconds(0)
  }

  const fmt = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  return { seconds, running, start, stop, fmt }
}

// ── Parsing du temps (ex: "30 min", "1h30") → secondes ───────────
function parseTimeToSeconds(timeStr) {
  if (!timeStr) return 0
  const hourMatch = timeStr.match(/(\d+)\s*h/i)
  const minMatch  = timeStr.match(/(\d+)\s*min/i)
  const hours = hourMatch ? parseInt(hourMatch[1]) : 0
  const mins  = minMatch  ? parseInt(minMatch[1])  : 0
  return (hours * 60 + mins) * 60
}

// ── Scale ingredient quantity ─────────────────────────────────────
function scaleIngredients(ingredients, originalServings, newServings) {
  if (!originalServings || originalServings === newServings) return ingredients
  const ratio = newServings / originalServings
  return ingredients.map(ing => {
    const qty = parseFloat(ing.quantity)
    if (isNaN(qty)) return ing
    const scaled = qty * ratio
    const formatted = scaled % 1 === 0 ? String(scaled) : scaled.toFixed(1).replace(/\.0$/, '')
    return { ...ing, quantity: formatted }
  })
}

export default function RecipeCard({ recipe, mealType }) {
  const [expanded,        setExpanded]        = useState(false)
  const [activeTab,       setActiveTab]       = useState('ingredients')
  const [servings,        setServings]        = useState(recipe.servings ?? 4)
  const [showTimer,       setShowTimer]       = useState(false)
  const [showTransform,   setShowTransform]   = useState(false)
  const [showUpgrade,     setShowUpgrade]     = useState(false)
  const timer = useCookingTimer()
  // BUG-002 : planId !== 'free' incluait aussi 'visitor' comme premium.
  // On vérifie explicitement que l'utilisateur a un vrai abonnement payant.
  const isPremium = useSubscriptionStore(s => s.isPremium())

  const type   = mealType ?? recipe.type
  const diff   = DIFFICULTY[recipe.difficulty] ?? DIFFICULTY['Facile']
  const theme  = MEAL_THEME[type] ?? MEAL_THEME['déjeuner']
  const budget = getBudget(recipe)
  const budgetStyle = budget ? BUDGET_STYLE[budget.niveauBudget] : null
  const coutTotal   = budget ? (budget.coutParPersonne * servings).toFixed(2).replace('.', ',') : null

  const scaledIngredients = useMemo(
    () => scaleIngredients(recipe.ingredients ?? [], recipe.servings ?? 4, servings),
    [recipe.ingredients, recipe.servings, servings]
  )

  const cookTimeSecs = parseTimeToSeconds(recipe.cookTime)

  const { isFavorite, toggle: toggleFav } = useFavoritesStore()
  const { isInRedList, toggle: toggleRed } = useRedListStore()
  const { isSelected, toggle: toggleShop } = useShoppingStore()
  const { speak, stop, isSpeaking: isGlobalSpeaking, isLoading: ttsLoading, isSupported: ttsSupported } = useSpeechSynthesis()
  const stepSpeech = useStepByStepSpeech(recipe.steps)

  const handleSpeakFull = () => {
    if (stepSpeech.isActive) return stepSpeech.cancel()
    if (isGlobalSpeaking) return stop()
    speak(recipeToSpeechText(recipe), recipe.name)
  }

  const isSpeaking = isGlobalSpeaking || stepSpeech.isActive
  const fav    = isFavorite(recipe.name)
  const red    = isInRedList(recipe.name)
  const inCart = isSelected(recipe.name)

  const totalTime = recipe.prepTime && recipe.cookTime
    ? `${recipe.prepTime} + ${recipe.cookTime}`
    : recipe.prepTime || recipe.cookTime || '—'

  return (
    <article className={cn(
      'group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-border/40 shadow-md transition-all duration-300',
      'hover:shadow-2xl hover:-translate-y-1 hover:border-border/20',
      theme.glow,
      red && 'opacity-50 grayscale-[40%] hover:opacity-60'
    )}>

      {/* ── IMAGE + OVERLAY ── */}
      <div className="relative overflow-hidden">
        <div className="h-72">
          <RecipeImage imageQuery={recipe.imageQuery} recipeName={recipe.name} mealType={type} />
        </div>

        {/* Gradient renforcé — bottom heavy for legible title */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

        {/* Boutons d'action flottants */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {ttsSupported && (
            <ActionBtn active={isSpeaking} onClick={handleSpeakFull}
              activeClass="bg-sky-500 text-white" label={isSpeaking ? 'Arrêter' : 'Lire à voix haute'}>
              {ttsLoading
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : isSpeaking
                ? <Square className="h-3 w-3 fill-current" />
                : <Volume2 className="h-3.5 w-3.5" />}
            </ActionBtn>
          )}
          <ActionBtn active={fav} onClick={() => toggleFav(recipe)}
            activeClass="bg-rose-500 text-white" label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
            <Heart className="h-3.5 w-3.5" fill={fav ? 'currentColor' : 'none'} />
          </ActionBtn>
          <ActionBtn active={inCart} onClick={() => toggleShop(recipe)}
            activeClass="bg-emerald-500 text-white" label={inCart ? 'Retirer des courses' : 'Ajouter aux courses'}>
            <ShoppingCart className="h-3.5 w-3.5" />
          </ActionBtn>
          <ActionBtn active={red} onClick={() => toggleRed(recipe)}
            activeClass="bg-red-600 text-white" label={red ? 'Remettre en banque' : 'Rejeter'}>
            <Ban className="h-3.5 w-3.5" />
          </ActionBtn>
          <ActionBtn
            active={false}
            onClick={() => isPremium ? setShowTransform(true) : setShowUpgrade(true)}
            activeClass=""
            label={isPremium ? 'Remplacer par une autre recette' : 'Remplacer — fonctionnalité Premium'}
          >
            <Shuffle className="h-3.5 w-3.5" />
          </ActionBtn>
        </div>

        {/* Difficulté badge — haut gauche */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={cn(
            'flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-sm bg-black/30 text-white border-white/20'
          )}>
            <span className={cn('h-1.5 w-1.5 rounded-full', diff.dot)} />
            {diff.label}
          </span>
          {budgetStyle && (
            <span className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-sm',
              budgetStyle.bg, budgetStyle.text, budgetStyle.border
            )}>
              <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', budgetStyle.dot)} />
              {budget.coutParPersonne.toFixed(2).replace('.', ',')} €/pers.
            </span>
          )}
        </div>

        {/* Nom + cuisine en bas de l'image */}
        <div className="absolute bottom-0 inset-x-0 px-4 pb-5 pt-14">
          <h3 className="text-white font-extrabold text-xl leading-tight drop-shadow-xl line-clamp-2 mb-1 tracking-tight">
            {recipe.name}
          </h3>
          {recipe.cuisine && (
            <span className="inline-flex items-center gap-1.5 text-white/75 text-xs font-semibold">
              <span className={cn('h-2 w-2 rounded-full', theme.accent)} />
              Cuisine {recipe.cuisine}
            </span>
          )}
        </div>
      </div>

      {/* ── BARRE COULEUR ── */}
      <div className={cn('h-1.5 w-full bg-gradient-to-r', theme.gradient)} />

      {/* ── STATS BAR ── */}
      <div className="px-4 pt-3 pb-2.5 flex items-center gap-2 flex-wrap">
        <StatChip icon={Clock} label={totalTime} />

        {/* Ajusteur de portions */}
        <div className="flex items-center gap-1 bg-muted/70 rounded-full px-2 py-1 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setServings(s => Math.max(1, s - 1))}
            aria-label="Réduire les portions"
            className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all"
          >
            <Minus className="h-2.5 w-2.5" />
          </button>
          <Users className="h-3 w-3 mx-0.5" />
          <span>{servings} pers.</span>
          {servings !== recipe.servings && (
            <span className="text-amber-600 ml-0.5">(×{(servings / (recipe.servings ?? 4)).toFixed(1)})</span>
          )}
          <button
            type="button"
            onClick={() => setServings(s => Math.min(20, s + 1))}
            aria-label="Augmenter les portions"
            className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all"
          >
            <Plus className="h-2.5 w-2.5" />
          </button>
        </div>

        {recipe.kcalPerPerson && (
          <StatChip icon={Flame} label={`${recipe.kcalPerPerson} kcal`} highlight="amber" />
        )}
        {recipe.proteinPerPerson && (
          <StatChip icon={Dumbbell} label={`${recipe.proteinPerPerson}g prot.`} highlight="rose" />
        )}
        {recipe.carbsPerPerson && (
          <StatChip icon={Wheat} label={`${recipe.carbsPerPerson}g gl.`} highlight="sky" />
        )}
        {budget && (
          <StatChip icon={Euro} label={`${coutTotal} € (${servings} pers.)`} highlight={
            budget.niveauBudget === 'économique' ? 'green' :
            budget.niveauBudget === 'premium'    ? 'purple' : 'blue'
          } />
        )}

        {/* Minuteur si temps de cuisson disponible */}
        {cookTimeSecs > 0 && (
          <button
            type="button"
            onClick={() => {
              if (timer.running) { timer.stop(); setShowTimer(false) }
              else { timer.start(cookTimeSecs); setShowTimer(true) }
            }}
            title={timer.running ? 'Arrêter le minuteur' : `Démarrer le minuteur (${recipe.cookTime})`}
            className={cn(
              'flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full transition-all',
              timer.running
                ? 'bg-orange-100 text-orange-700 border border-orange-300 animate-pulse'
                : 'bg-muted/70 text-muted-foreground hover:bg-orange-50 hover:text-orange-600'
            )}
          >
            {timer.running ? <TimerOff className="h-3 w-3" /> : <Timer className="h-3 w-3" />}
            {timer.running ? timer.fmt(timer.seconds) : recipe.cookTime}
          </button>
        )}
      </div>

      {/* Alerte minuteur terminé */}
      {showTimer && !timer.running && timer.seconds === 0 && cookTimeSecs > 0 && (
        <div className="mx-4 mb-2 px-3 py-2 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between gap-2 text-xs text-orange-800 font-medium">
          <span>⏰ Temps de cuisson écoulé !</span>
          <button type="button" onClick={() => setShowTimer(false)} className="text-orange-400 hover:text-orange-600">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── RÉGIMES ── */}
      {recipe.diets?.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {recipe.diets.map((diet, i) => {
            const normalized = normalizeDietKey(diet)
            const s = DIET_STYLE[normalized] ?? { bg: 'bg-muted', text: 'text-muted-foreground', icon: '✓' }
            return (
              <span key={`${diet}-${i}`} className={cn(
                'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full',
                s.bg, s.text
              )}>
                <span>{s.icon}</span>{normalized}
              </span>
            )
          })}
        </div>
      )}

      {/* ── ONGLETS Ingrédients / Étapes ── */}
      <div className="px-4 pb-2">
        <div className="flex rounded-xl bg-muted/50 p-0.5">
          {[
            { key: 'ingredients', label: `Ingrédients (${scaledIngredients.length})` },
            { key: 'steps',       label: `Étapes (${recipe.steps?.length ?? 0})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={cn(
                'flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200',
                activeTab === key
                  ? 'bg-white shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENU ONGLET ── */}
      <div className="px-4 pb-3 flex-1">

        {activeTab === 'ingredients' && (
          <div>
            <IngredientList
              ingredients={expanded ? scaledIngredients : scaledIngredients.slice(0, 8)}
              checkable
            />
            {scaledIngredients.length > 8 && !expanded && (
              <button
                type="button"
                onClick={() => { setExpanded(true); setActiveTab('ingredients') }}
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              >
                <ChevronDown className="h-3.5 w-3.5" />
                {scaledIngredients.length - 8} ingrédients de plus
              </button>
            )}
          </div>
        )}

        {activeTab === 'steps' && (
          <div>
            {/* Barre de contrôle TTS étape par étape */}
            {ttsSupported && (
              <div className="mb-3 flex items-center justify-between">
                {stepSpeech.isActive ? (
                  <div className="flex-1 flex items-center gap-2 bg-sky-50 border border-sky-200 rounded-xl px-3 py-2">
                    <button type="button" onClick={stepSpeech.prev} disabled={stepSpeech.stepIndex === 0}
                      className="h-6 w-6 rounded-full flex items-center justify-center text-sky-600 hover:bg-sky-100 disabled:opacity-30">
                      <SkipBack className="h-3 w-3" />
                    </button>
                    <button type="button" onClick={stepSpeech.isPaused ? stepSpeech.resume : stepSpeech.pause}
                      className="h-6 w-6 rounded-full flex items-center justify-center text-sky-600 hover:bg-sky-100">
                      {stepSpeech.isPaused ? <Play className="h-3 w-3 fill-current" /> : <Pause className="h-3 w-3" />}
                    </button>
                    <span className="flex-1 text-center text-[11px] font-semibold text-sky-700">
                      Étape {stepSpeech.stepIndex + 1}/{stepSpeech.totalSteps}
                    </span>
                    <button type="button" onClick={stepSpeech.next} disabled={stepSpeech.stepIndex >= stepSpeech.totalSteps - 1}
                      className="h-6 w-6 rounded-full flex items-center justify-center text-sky-600 hover:bg-sky-100 disabled:opacity-30">
                      <SkipForward className="h-3 w-3" />
                    </button>
                    <button type="button" onClick={stepSpeech.cancel}
                      className="h-6 w-6 rounded-full flex items-center justify-center text-sky-600 hover:bg-red-50 hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={stepSpeech.start}
                    className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 transition-all"
                  >
                    <Volume2 className="h-3 w-3" />
                    Lecture guidée étape par étape
                  </button>
                )}
              </div>
            )}

            <StepsList
              steps={expanded ? recipe.steps ?? [] : (recipe.steps ?? []).slice(0, 3)}
              activeIndex={stepSpeech.isActive ? stepSpeech.stepIndex : -1}
            />

            {(recipe.steps?.length ?? 0) > 3 && (
              <button
                type="button"
                onClick={() => setExpanded(e => !e)}
                className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              >
                {expanded
                  ? <><ChevronUp className="h-3.5 w-3.5" />Réduire</>
                  : <><ChevronDown className="h-3.5 w-3.5" />{recipe.steps.length - 3} étapes de plus</>
                }
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── ASTUCE CHEF ── */}
      {recipe.chefTip && (
        <div className="mx-4 mb-3 flex gap-2.5 p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
          <div className="shrink-0 h-7 w-7 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-300">
            <ChefHat className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide mb-0.5">Astuce du chef</p>
            <p className="text-xs text-emerald-700 leading-relaxed">{recipe.chefTip}</p>
          </div>
        </div>
      )}

      {/* ── CONSEIL ÉCONOMIE ── */}
      {budget?.economieTip && (
        <div className="mx-4 mb-3 flex gap-2.5 p-3 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
          <div className="shrink-0 h-7 w-7 rounded-xl bg-green-500 flex items-center justify-center shadow-sm shadow-green-300">
            <Lightbulb className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-green-800 uppercase tracking-wide mb-0.5">Conseil budget</p>
            <p className="text-xs text-green-700 leading-relaxed">{budget.economieTip}</p>
          </div>
        </div>
      )}

      {/* ── NOTE ENFANT ── */}
      {recipe.childNote && (
        <div className="mx-4 mb-4 flex gap-2.5 p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
          <div className="shrink-0 h-7 w-7 rounded-xl bg-amber-400 flex items-center justify-center text-sm shadow-sm shadow-amber-200">
            👶
          </div>
          <div>
            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wide mb-0.5">Conseil enfant</p>
            <p className="text-xs text-amber-700 leading-relaxed">{recipe.childNote}</p>
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      {showTransform && (
        <TransformModal recipe={recipe} onClose={() => setShowTransform(false)} />
      )}
      {showUpgrade && (
        <UpgradeModal reason="generation" onClose={() => setShowUpgrade(false)} />
      )}
    </article>
  )
}

function ActionBtn({ active, onClick, activeClass, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'h-8 w-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 backdrop-blur-sm',
        active
          ? cn('scale-110 shadow-md', activeClass)
          : 'bg-black/30 text-white border border-white/20 hover:bg-black/50 hover:scale-110'
      )}
    >
      {children}
    </button>
  )
}

function StatChip({ icon: Icon, label, highlight }) {
  const styles = {
    amber:  'bg-amber-50  text-amber-700  border border-amber-200',
    rose:   'bg-rose-50   text-rose-700   border border-rose-200',
    sky:    'bg-sky-50    text-sky-700    border border-sky-200',
    green:  'bg-green-50  text-green-700  border border-green-200',
    blue:   'bg-blue-50   text-blue-700   border border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
  }
  return (
    <span className={cn(
      'flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full',
      highlight ? styles[highlight] : 'bg-muted/70 text-muted-foreground'
    )}>
      <Icon className="h-3 w-3 shrink-0" />
      {label}
    </span>
  )
}
