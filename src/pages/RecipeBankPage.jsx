import { useState, useMemo, useEffect } from 'react'
import { useRecipeBankStore } from '@/store/useRecipeBankStore'
import { useBudgetStore }     from '@/store/useBudgetStore'
import { useSubscriptionStore, PLANS } from '@/store/useSubscriptionStore'
import { useNavStore }        from '@/store/useNavStore'
import { useShoppingStore }   from '@/store/useShoppingStore'
import { getBudget }          from '@/data/budgetMap'
import RecipeCard    from '@/components/results/RecipeCard'
import RobotBubble   from '@/components/mascot/RobotBubble'
import AddRecipeModal from '@/components/recipes/AddRecipeModal'
import BudgetPanel   from '@/components/budget/BudgetPanel'
import { Input }   from '@/components/ui/input'
import { Button }  from '@/components/ui/button'
import { Search, Trash2, X, SlidersHorizontal, PenLine, Euro, Wallet, Tag, Lock, MapPin, ArrowLeft, ShoppingCart, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import PromoPage from '@/pages/PromoPage'
import UpgradeModal from '@/components/subscription/UpgradeModal'

const MEAL_FILTERS = [
  { key: 'all',            label: 'Tous',      emoji: '🍴' },
  { key: 'petit-déjeuner', label: 'Petit-déj', emoji: '🥐' },
  { key: 'déjeuner',       label: 'Déjeuner',  emoji: '🥗' },
  { key: 'dîner',          label: 'Dîner',     emoji: '🍝' },
]

const BUDGET_FILTERS = [
  { key: 'all',         label: 'Tous budgets', dot: 'bg-muted-foreground' },
  { key: 'économique',  label: '< 2 €/pers.',  dot: 'bg-green-500'  },
  { key: 'moyen',       label: '2–5 €/pers.',  dot: 'bg-blue-500'   },
  { key: 'premium',     label: '> 5 €/pers.',  dot: 'bg-purple-500' },
]

const SORT_OPTIONS = [
  { key: 'recent',          label: 'Plus récentes' },
  { key: 'name',            label: 'Nom (A→Z)' },
  { key: 'difficulty',      label: 'Difficulté' },
  { key: 'budget_asc',      label: 'Budget ↑ (moins cher)' },
  { key: 'budget_desc',     label: 'Budget ↓ (plus cher)' },
]

const DIFF_ORDER = { Facile: 0, Moyen: 1, Difficile: 2 }

// Les 3 recettes gourmandes mises en avant pour les visiteurs — photos haut de gamme vérifiées
const VISITOR_FEATURED = [
  "Magret de canard miel balsamique",          // 🦆 viande dorée, photo élégante
  "Saint-Jacques poêlées beurre blanc agrumes", // 🍽️ fruits de mer premium
  "Crème brûlée vanille Bourbon",              // 🍮 dessert iconique
]

export default function RecipeBankPage({ embedded = false }) {
  const { recipes, remove, clear } = useRecipeBankStore()
  const { filtreNiveau, setFiltreNiveau, filtreMaxParPersonne } = useBudgetStore()
  const plan        = useSubscriptionStore(s => s.plan)
  const activatePlan = useSubscriptionStore(s => s.activate)
  const isVisitor   = plan === 'visitor'
  const isPremium   = plan !== 'free' && plan !== 'visitor'
  const bankFilter        = useNavStore(s => s.bankFilter)
  const consumeBankFilter = useNavStore(s => s.consumeBankFilter)
  const cartCount   = useShoppingStore(s => s.selectedRecipes.length)
  const VISITOR_LIMIT = PLANS.visitor.bankLimit

  const [search,        setSearch]        = useState('')
  const [mealType,      setMealType]      = useState('all')
  const [sort,          setSort]          = useState('recent')
  const [showSort,      setShowSort]      = useState(false)
  const [confirmClear,  setConfirmClear]  = useState(false)
  const [showAddModal,  setShowAddModal]  = useState(false)
  const [showBudgetPanel, setShowBudgetPanel] = useState(false)
  const [showPromo,       setShowPromo]       = useState(false)
  const [promoLocation,   setPromoLocation]   = useState('')
  const [showPaywall,     setShowPaywall]     = useState(false)

  // Recettes épinglées pour le mode visiteur (ordre garanti, photo vérifiée)
  const featuredRecipes = useMemo(() => {
    if (!isVisitor) return null
    const found = VISITOR_FEATURED
      .map(name => recipes.find(r => r.name === name))
      .filter(Boolean)
    // Si certaines sont absentes (banque vide), compléter avec les premières dispo
    if (found.length < VISITOR_LIMIT) {
      const extra = recipes.filter(r => !VISITOR_FEATURED.includes(r.name))
      return [...found, ...extra].slice(0, VISITOR_LIMIT)
    }
    return found
  }, [isVisitor, recipes])

  // Application des filtres venant du navStore (chips d'acces rapides)
  useEffect(() => {
    if (!bankFilter) return
    if (bankFilter.mealType) setMealType(bankFilter.mealType)
    if (bankFilter.search)   setSearch(bankFilter.search)
    consumeBankFilter()
  }, [bankFilter, consumeBankFilter])

  const cuisines = useMemo(() => {
    const s = new Set(recipes.map(r => r.cuisine).filter(Boolean))
    return Array.from(s).sort()
  }, [recipes])
  const [cuisine, setCuisine] = useState('all')

  const filtered = useMemo(() => {
    let list = [...recipes]
    if (mealType !== 'all') list = list.filter(r => r.type === mealType)
    if (cuisine  !== 'all') list = list.filter(r => r.cuisine === cuisine)
    if (filtreNiveau !== 'all') {
      list = list.filter(r => {
        const b = getBudget(r)
        return b?.niveauBudget === filtreNiveau
      })
    }
    if (filtreMaxParPersonne) {
      const max = parseFloat(filtreMaxParPersonne)
      if (!isNaN(max)) {
        list = list.filter(r => {
          const b = getBudget(r)
          return b != null && b.coutParPersonne <= max
        })
      }
    }
    if (search.trim())
      list = list.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.cuisine?.toLowerCase().includes(search.toLowerCase())
      )
    switch (sort) {
      case 'name':        list.sort((a, b) => a.name.localeCompare(b.name, 'fr')); break
      case 'difficulty':  list.sort((a, b) => (DIFF_ORDER[a.difficulty] ?? 1) - (DIFF_ORDER[b.difficulty] ?? 1)); break
      case 'budget_asc':  list.sort((a, b) => (getBudget(a)?.coutParPersonne ?? 999) - (getBudget(b)?.coutParPersonne ?? 999)); break
      case 'budget_desc': list.sort((a, b) => (getBudget(b)?.coutParPersonne ?? 0)   - (getBudget(a)?.coutParPersonne ?? 0)); break
      default:            list.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
    }
    return list
  }, [recipes, mealType, cuisine, search, sort, filtreNiveau, filtreMaxParPersonne])

  if (recipes.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-6 text-center px-6', embedded ? 'min-h-[30vh]' : 'min-h-[70vh]')}>
        <RobotBubble
          expression="thinking"
          size="lg"
          animate
          message={
            <div className="space-y-1">
              <p className="font-bold text-sm">Votre banque est vide !</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Chaque recette générée est sauvegardée ici. Vous pouvez aussi ajouter vos propres recettes !
              </p>
            </div>
          }
          variant="info"
        />
        <Button onClick={() => setShowAddModal(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
          <PenLine className="h-4 w-4" />
          Ajouter une recette personnelle
        </Button>
        <AddRecipeModal open={showAddModal} onClose={() => setShowAddModal(false)} />
      </div>
    )
  }

  return (
    <div className={cn(embedded ? 'px-4 pb-8 space-y-5' : 'w-full')}>

      {/* ══════════════════════════════════════════════════════════
          Mode embedded — layout compact avec recettes
         ══════════════════════════════════════════════════════════ */}
      {embedded && (
        <>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour à la configuration
          </button>

          {/* Titre */}
          <div>
            <h2 className="font-display text-2xl text-dolce-blue-deep tracking-tight">Banque de recettes</h2>
            <p className="text-[11px] text-dolce-blue-deep/55 mt-1">
              {recipes.length} recette{recipes.length > 1 ? 's' : ''} · {filtered.length} affichée{filtered.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-dolce-blue-deep/50" />
            <Input
              placeholder="Rechercher…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 rounded-2xl h-11 text-sm border-dolce-blue-deep/15 bg-white shadow-sm focus:shadow-md focus:border-dolce-blue-deep/30 transition-shadow"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filtres repas */}
          <div className="flex items-center gap-1.5 overflow-x-auto -mx-4 px-4 pb-1 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {MEAL_FILTERS.map(({ key, label, emoji }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMealType(key)}
                className={cn(
                  'snap-start shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold border transition-all',
                  mealType === key
                    ? 'bg-dolce-blue-deep text-dolce-yellow border-dolce-blue-deep'
                    : 'border-dolce-blue-deep/15 text-dolce-blue-deep bg-white/90 hover:bg-dolce-yellow-soft hover:border-dolce-blue-deep/30'
                )}
              >
                <span className="text-sm leading-none">{emoji}</span>{label}
              </button>
            ))}
          </div>

          {/* Grille de recettes */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <RobotBubble
                expression="thinking"
                size="sm"
                message="Aucune recette ne correspond à ces filtres. Essayez en ajustant la recherche !"
                variant="info"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(isVisitor ? (featuredRecipes ?? filtered.slice(0, VISITOR_LIMIT)) : filtered).map(recipe => (
                <div key={recipe.id} className="relative group">
                  {recipe.isManual && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="flex items-center gap-1 text-[10px] font-semibold bg-dolce-blue-deep text-dolce-yellow px-2 py-0.5 rounded-full shadow-sm">
                        <PenLine className="h-2.5 w-2.5" /> Perso
                      </span>
                    </div>
                  )}
                  <RecipeCard recipe={recipe} mealType={recipe.type} />
                </div>
              ))}
            </div>
          )}

          {/* Teaser visiteur embedded */}
          {isVisitor && filtered.length > VISITOR_LIMIT && (
            <div className="rounded-3xl border border-dolce-blue-deep/15 bg-gradient-to-br from-dolce-yellow-soft/60 via-white to-white p-5 text-center shadow-dolce-soft">
              <p className="font-script text-2xl text-dolce-blue-deep mb-1">la banque entière</p>
              <p className="text-sm font-bold text-dolce-blue-deep mb-1">{filtered.length - VISITOR_LIMIT} recettes de plus</p>
              <p className="text-xs text-muted-foreground mb-4 leading-snug">Créez votre compte gratuit pour accéder à toute la banque.</p>
              <button
                type="button"
                onClick={() => activatePlan('free')}
                className="h-10 px-6 rounded-xl bg-dolce-blue-deep text-dolce-yellow text-sm font-bold hover:shadow-[0_8px_18px_-10px_rgba(36,40,140,0.5)] transition-shadow"
              >
                Créer mon compte gratuit
              </button>
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════════
          Mode normal — deux panneaux sur desktop, colonne sur mobile
         ══════════════════════════════════════════════════════════ */}
      {!embedded && (
        <div className="lg:flex lg:h-[calc(100dvh-60px-64px)]">

          {/* ── SIDEBAR (desktop gauche / mobile dessus) ───────── */}
          <aside className={cn(
            // Mobile : centré, largeur max, padding classique
            'max-w-[640px] mx-auto w-full px-4 py-5 space-y-4',
            // Desktop : panneau gauche fixe, scroll indépendant
            'lg:max-w-none lg:mx-0 lg:w-[280px] lg:shrink-0',
            'lg:h-full lg:overflow-y-auto lg:border-r lg:border-dolce-blue-deep/10',
            'lg:px-5 lg:py-6',
          )}>

            {/* Titre */}
            <div>
              <h1 className="font-display text-[26px] sm:text-[28px] text-dolce-blue-deep tracking-tight leading-tight">
                Recettes
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Parcourez la banque selon vos envies.
              </p>
              <p className="text-[11px] text-dolce-blue-deep/55 mt-1.5">
                {recipes.length} recette{recipes.length > 1 ? 's' : ''} · {filtered.length} affichée{filtered.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Recherche — sticky sur mobile, normale dans sidebar desktop */}
            <div className={cn(
              'sticky top-[60px] z-20 -mx-4 px-4 py-2',
              'bg-background/85 backdrop-blur-md border-b border-dolce-blue-deep/10',
              'lg:static lg:top-auto lg:mx-0 lg:px-0 lg:py-0',
              'lg:bg-transparent lg:backdrop-blur-none lg:border-0',
            )}>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-dolce-blue-deep/50" />
                <Input
                  placeholder="Rechercher…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 rounded-2xl h-11 text-sm border-dolce-blue-deep/15 bg-white shadow-sm focus:shadow-md focus:border-dolce-blue-deep/30 transition-shadow"
                />
                {search && (
                  <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 flex-wrap lg:flex-col lg:items-stretch">
              <div className="flex items-center gap-2 lg:flex-col lg:items-stretch">
                <Button onClick={() => setShowAddModal(true)} size="sm" className="gap-1.5 rounded-xl bg-dolce-blue-deep text-dolce-yellow hover:opacity-90 lg:justify-start">
                  <PenLine className="h-3.5 w-3.5" />
                  Ma recette
                </Button>
                <Button
                  variant="outline" size="sm"
                  className={cn('gap-1.5 rounded-xl border-dolce-blue-deep/20 text-dolce-blue-deep hover:bg-dolce-yellow-soft lg:justify-start', showBudgetPanel && 'bg-dolce-yellow-soft')}
                  onClick={() => setShowBudgetPanel(s => !s)}
                >
                  <Wallet className="h-3.5 w-3.5" />
                  Budget
                </Button>
              </div>

              <div className="flex items-center gap-2 lg:flex-col lg:items-stretch">
                <div className="relative">
                  <Button variant="outline" size="sm" className="gap-1.5 rounded-xl border-dolce-blue-deep/20 text-dolce-blue-deep hover:bg-dolce-yellow-soft lg:w-full lg:justify-start" onClick={() => setShowSort(s => !s)}>
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    {SORT_OPTIONS.find(o => o.key === sort)?.label}
                  </Button>
                  {showSort && (
                    <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-dolce-blue-deep/15 rounded-xl shadow-dolce-soft overflow-hidden w-48">
                      {SORT_OPTIONS.map(o => (
                        <button
                          key={o.key}
                          type="button"
                          onClick={() => { setSort(o.key); setShowSort(false) }}
                          className={cn('w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-dolce-yellow-soft', sort === o.key && 'font-bold text-dolce-blue-deep bg-dolce-yellow-soft/60')}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {!confirmClear ? (
                  <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 lg:justify-start" onClick={() => setConfirmClear(true)}>
                    <Trash2 className="h-3.5 w-3.5" />
                    Vider
                  </Button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Confirmer&nbsp;?</span>
                    <Button size="sm" variant="destructive" className="rounded-xl h-8 text-xs" onClick={() => { clear(); setConfirmClear(false) }}>Oui</Button>
                    <Button size="sm" variant="outline"     className="rounded-xl h-8 text-xs" onClick={() => setConfirmClear(false)}>Non</Button>
                  </div>
                )}
              </div>
            </div>

            {/* Filtres repas */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto -mx-4 px-4 pb-1 snap-x snap-mandatory lg:flex-wrap lg:overflow-x-visible lg:mx-0 lg:px-0" style={{ scrollbarWidth: 'none' }}>
                {MEAL_FILTERS.map(({ key, label, emoji }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMealType(key)}
                    className={cn(
                      'snap-start shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold border transition-all',
                      mealType === key
                        ? 'bg-dolce-blue-deep text-dolce-yellow border-dolce-blue-deep'
                        : 'border-dolce-blue-deep/15 text-dolce-blue-deep bg-white/90 hover:bg-dolce-yellow-soft hover:border-dolce-blue-deep/30'
                    )}
                  >
                    <span className="text-sm leading-none">{emoji}</span>{label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setShowPromo(s => !s)}
                  className={cn(
                    'snap-start shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold border transition-all',
                    showPromo
                      ? 'bg-dolce-orange text-white border-dolce-orange'
                      : 'border-dolce-orange/40 text-dolce-orange-deep hover:bg-dolce-orange/10 bg-white/90'
                  )}
                >
                  <Tag className="h-3 w-3" />
                  En promo
                  {showPromo && <X className="h-3 w-3" />}
                </button>

                {cuisines.slice(0, 8).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCuisine(cuisine === c ? 'all' : c)}
                    className={cn(
                      'snap-start shrink-0 inline-flex items-center h-8 px-3 rounded-full text-xs font-semibold border transition-all',
                      cuisine === c
                        ? 'bg-dolce-blue text-white border-dolce-blue'
                        : 'border-dolce-blue-deep/15 text-dolce-blue-deep/80 bg-white/90 hover:bg-dolce-yellow-soft hover:border-dolce-blue-deep/30'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Filtres budget */}
              <div className="flex items-center gap-1.5 overflow-x-auto -mx-4 px-4 pb-1 snap-x snap-mandatory lg:flex-wrap lg:overflow-x-visible lg:mx-0 lg:px-0" style={{ scrollbarWidth: 'none' }}>
                <span className="snap-start shrink-0 inline-flex items-center gap-1 text-[10px] text-dolce-blue-deep/60 font-bold uppercase tracking-wider pr-1">
                  <Euro className="h-3 w-3" /> Budget
                </span>
                {BUDGET_FILTERS.map(({ key, label, dot }) => {
                  const isLocked = !isPremium && key !== 'all'
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => isLocked ? setShowPaywall(true) : setFiltreNiveau(key)}
                      title={isLocked ? 'Filtre budget — fonctionnalité Premium' : undefined}
                      className={cn(
                        'snap-start shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold border transition-all',
                        isLocked
                          ? 'border-dolce-blue-deep/15 text-dolce-blue-deep/40 bg-white/70 hover:bg-dolce-yellow-soft hover:text-dolce-blue-deep/70'
                          : filtreNiveau === key
                            ? 'bg-dolce-basil-deep text-white border-dolce-basil-deep'
                            : 'border-dolce-blue-deep/15 text-dolce-blue-deep bg-white/90 hover:bg-dolce-yellow-soft'
                      )}
                    >
                      {isLocked
                        ? <Lock className="h-2.5 w-2.5 shrink-0" />
                        : <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dot)} />
                      }
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Panneau budget avancé */}
            {showBudgetPanel && (
              <BudgetPanel recipes={recipes} onClose={() => setShowBudgetPanel(false)} />
            )}
          </aside>

          {/* ── CONTENU PRINCIPAL (desktop droite / mobile dessous) ─ */}
          <section className={cn(
            // Mobile : centré, padding classique
            'max-w-[640px] mx-auto w-full px-4 pb-8 space-y-5',
            // Desktop : panneau droit, scroll indépendant
            'lg:max-w-none lg:mx-0 lg:flex-1',
            'lg:h-full lg:overflow-y-auto',
            'lg:px-6 lg:py-6',
          )}>

            {/* Mode Promo inline */}
            {showPromo && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 max-w-sm">
                  <MapPin className="h-4 w-4 text-orange-500 shrink-0" />
                  <input
                    type="text"
                    value={promoLocation}
                    onChange={e => setPromoLocation(e.target.value)}
                    placeholder="Ville ou code postal (ex : Paris, 75001)…"
                    className="flex-1 h-9 rounded-xl border border-orange-200 bg-white px-3 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200 placeholder:text-muted-foreground/50"
                  />
                  {promoLocation && (
                    <button type="button" onClick={() => setPromoLocation('')} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="rounded-2xl overflow-hidden border border-orange-200 shadow-md">
                  <PromoPage embedded />
                </div>
              </div>
            )}

            {/* Résultats vides */}
            {!showPromo && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <RobotBubble
                  expression="thinking"
                  size="sm"
                  message="Aucune recette ne correspond à ces filtres. Essayez en ajustant la recherche !"
                  variant="info"
                />
                {!isPremium && (
                  <PremiumNoResultTeaser onClick={() => setShowPaywall(true)} />
                )}
              </div>
            )}

            {/* Grille de recettes */}
            {!showPromo && filtered.length > 0 && (
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {(isVisitor ? (featuredRecipes ?? filtered.slice(0, VISITOR_LIMIT)) : filtered).map(recipe => (
                    <div key={recipe.id} className="relative group">
                      {recipe.isManual && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="flex items-center gap-1 text-[10px] font-semibold bg-dolce-blue-deep text-dolce-yellow px-2 py-0.5 rounded-full shadow-sm">
                            <PenLine className="h-2.5 w-2.5" /> Perso
                          </span>
                        </div>
                      )}
                      <RecipeCard recipe={recipe} mealType={recipe.type} />
                      {!isVisitor && (
                        <button
                          type="button"
                          onClick={() => remove(recipe.id)}
                          title="Retirer de la banque"
                          className="absolute bottom-3 right-3 h-7 w-7 rounded-full bg-white border border-border shadow-sm flex items-center justify-center text-muted-foreground/40 hover:text-destructive hover:border-destructive/30 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Teaser visiteur */}
                {isVisitor && filtered.length > VISITOR_LIMIT && (
                  <div className="relative mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pointer-events-none select-none blur-sm opacity-60">
                      {filtered.slice(VISITOR_LIMIT, VISITOR_LIMIT + 4).map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} mealType={recipe.type} />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-background via-background/85 to-transparent rounded-2xl">
                      <div className="bg-white rounded-3xl shadow-dolce-soft border border-dolce-blue-deep/15 px-6 py-5 text-center max-w-xs">
                        <p className="font-script text-3xl text-dolce-blue-deep mb-1">la banque entière</p>
                        <p className="text-sm font-bold text-dolce-blue-deep mb-1">
                          {filtered.length - VISITOR_LIMIT} recettes de plus
                        </p>
                        <p className="text-xs text-muted-foreground mb-4 leading-snug">
                          Créez votre compte gratuit pour accéder à toute la banque.
                        </p>
                        <button
                          type="button"
                          onClick={() => activatePlan('free')}
                          className="w-full h-10 rounded-xl bg-dolce-blue-deep text-dolce-yellow text-sm font-bold hover:shadow-[0_8px_18px_-10px_rgba(36,40,140,0.5)] transition-shadow"
                        >
                          Créer mon compte gratuit
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Teaser Premium fin de liste */}
                {!isPremium && !isVisitor && filtered.length >= 6 && (
                  <div className="mt-6">
                    <PremiumEndOfListTeaser onClick={() => setShowPaywall(true)} />
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ── Modals (hors layout) ── */}
      <AddRecipeModal open={showAddModal} onClose={() => setShowAddModal(false)} />
      {showPaywall && (
        <UpgradeModal reason="generation" onClose={() => setShowPaywall(false)} />
      )}

      {/* ── Barre courses sticky ── */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
          <div className={cn(
            'pointer-events-auto mx-4 mb-4 w-full max-w-lg',
            'flex items-center gap-3 px-4 py-3 rounded-2xl',
            'bg-white border border-emerald-200 shadow-xl shadow-emerald-900/10',
          )}>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="h-8 w-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <ShoppingCart className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground leading-tight">
                  {cartCount} recette{cartCount > 1 ? 's' : ''} sélectionnée{cartCount > 1 ? 's' : ''}
                </p>
                <p className="text-[10px] text-muted-foreground">Prêtes pour votre liste de courses</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => useNavStore.getState().goToPage('shopping')}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Valider ma sélection ({cartCount})
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Teaser Premium affiche en l'absence de resultat — propose un benefice concret
 * (recette sur-mesure) plutot qu'un simple bouton publicitaire.
 */
function PremiumNoResultTeaser({ onClick }) {
  return (
    <div className="w-full max-w-md mx-auto rounded-3xl border border-dolce-blue-deep/15 bg-gradient-to-br from-dolce-yellow-soft/60 via-white to-white p-4 sm:p-5 shadow-dolce-soft">
      <div className="flex items-start gap-3">
        <span className="shrink-0 h-10 w-10 rounded-xl bg-white border border-dolce-blue-deep/15 flex items-center justify-center text-xl">
          ✨
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-dolce-blue-deep leading-tight">
            Aucune recette ne colle exactement&nbsp;?
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-snug">
            Premium peut créer une recette sur-mesure à partir de votre envie.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="mt-3 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-dolce-blue-deep text-dolce-yellow text-xs font-bold hover:shadow-[0_8px_18px_-10px_rgba(36,40,140,0.5)] transition-shadow"
      >
        Découvrir Premium
      </button>
    </div>
  )
}

/**
 * Teaser Premium affiche en fin de liste (Free non visiteur) — propose des
 * adaptations contextuelles (rapide, leger, sans gluten) plutot qu'un mur
 * publicitaire.
 */
function PremiumEndOfListTeaser({ onClick }) {
  return (
    <div className="rounded-3xl border border-dolce-blue-deep/15 bg-gradient-to-br from-dolce-yellow-soft/60 via-white to-white p-4 sm:p-5 shadow-dolce-soft">
      <p className="font-script text-2xl text-dolce-blue-deep mb-1">e per finire…</p>
      <p className="text-sm font-bold text-dolce-blue-deep leading-snug">
        Vous voulez une recette encore plus adaptée à votre frigo, votre temps ou votre budget&nbsp;?
      </p>
      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
        Avec Premium, Chef IA cuisine pour <em>vous</em>&nbsp;: variantes rapides, légères, sans gluten, sur-mesure.
      </p>
      <button
        type="button"
        onClick={onClick}
        className="mt-3 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-dolce-blue-deep text-dolce-yellow text-xs font-bold hover:shadow-[0_8px_18px_-10px_rgba(36,40,140,0.5)] transition-shadow"
      >
        Découvrir Premium
      </button>
    </div>
  )
}
