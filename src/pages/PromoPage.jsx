import { useEffect, useCallback } from 'react'
import { usePromoStore }        from '@/store/usePromoStore'
import { getPromos, MAGASINS }  from '@/api/promoService'
import { generatePromoRecipe }  from '@/api/promoRecipeAI'
import StoreSelector            from '@/components/promo/StoreSelector'
import PromoGrid                from '@/components/promo/PromoGrid'
import PromoRecipeCard          from '@/components/promo/PromoRecipeCard'
import TutorialOverlay          from '@/components/tutorial/TutorialOverlay'
import { HelpCircle, RotateCcw, Tag } from 'lucide-react'
import { cn }                   from '@/lib/utils'

const STEP_LABELS = ['Configuration', 'Sélection des promos', 'Votre recette']

export default function PromoPage({ embedded = false }) {
  const {
    step, setStep,
    magasin, budget, nbPersonnes, mealType, diet,
    promos, setPromos,
    selected,
    setRecipe, setLoading, setError, setStreamText,
    loading, error,
    tutorialDone, startTutorial,
    tutorialStep,
    showHelp, setShowHelp,
    reset,
  } = usePromoStore()

  // Lancer le tutoriel automatiquement à la première visite
  useEffect(() => {
    if (!tutorialDone && tutorialStep === 0) {
      startTutorial()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Charger les promos quand on passe à l'étape 2
  const handleGoToPromos = useCallback(async () => {
    setStep(2)
    if (promos.length > 0) return  // déjà chargées
    setLoading(true)
    setError(null)
    try {
      const data = await getPromos(magasin)
      setPromos(data)
    } catch (e) {
      setError('Impossible de charger les promotions. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }, [magasin, promos.length, setStep, setPromos, setLoading, setError])

  // Générer la recette
  const handleGenerateRecipe = useCallback(async () => {
    setStep(3)
    setLoading(true)
    setError(null)
    setStreamText('')
    setRecipe(null)

    const selectedProducts = promos.filter(p => selected.includes(p.id))
    const magasinLabel = MAGASINS.find(m => m.id === magasin)?.label ?? magasin

    try {
      const recipe = await generatePromoRecipe(
        selectedProducts,
        { magasinLabel, budget, nbPersonnes, mealType, diet },
        { onProgress: text => setStreamText(text) }
      )
      setRecipe(recipe)
    } catch (e) {
      setError(e.message ?? 'Erreur lors de la génération.')
    } finally {
      setLoading(false)
      setStreamText('')
    }
  }, [promos, selected, magasin, budget, nbPersonnes, mealType, diet, setStep, setRecipe, setLoading, setError, setStreamText])

  // Regénérer (garder même sélection)
  const handleRegenerate = useCallback(() => {
    handleGenerateRecipe()
  }, [handleGenerateRecipe])

  // Revenir à étape 1 (reset promos pour recharger si magasin change)
  const handleBackToConfig = useCallback(() => {
    setStep(1)
    setPromos([])
  }, [setStep, setPromos])

  return (
    <div className={embedded ? 'bg-gray-50' : 'min-h-screen bg-gray-50'}>

      {/* Tutorial overlay */}
      <TutorialOverlay />

      {/* En-tête page */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Tag className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-base leading-tight">Chef Privé Promos</h1>
                <p className="text-white/80 text-xs">Cuisinez malin avec les promos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => startTutorial()}
                title="Aide / Tutoriel"
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <HelpCircle className="h-4.5 w-4.5" />
              </button>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => { reset(); setStep(1); setPromos([]) }}
                  title="Recommencer"
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  <RotateCcw className="h-4.5 w-4.5" />
                </button>
              )}
            </div>
          </div>

          {/* Indicateur d'étapes */}
          <div className="flex items-center gap-1.5 mt-4">
            {STEP_LABELS.map((label, i) => {
              const stepNum = i + 1
              const active  = step === stepNum
              const done    = step > stepNum
              return (
                <div key={i} className="flex items-center gap-1.5 flex-1 min-w-0">
                  <div className={cn(
                    'h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all',
                    done   ? 'bg-white text-amber-600'
                    : active ? 'bg-white text-amber-600 ring-2 ring-white/50'
                    : 'bg-white/20 text-white/60'
                  )}>
                    {done ? '✓' : stepNum}
                  </div>
                  <span className={cn(
                    'text-xs font-medium truncate hidden sm:block transition-colors',
                    active ? 'text-white' : 'text-white/60'
                  )}>
                    {label}
                  </span>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={cn(
                      'h-px flex-1 transition-colors',
                      done ? 'bg-white/60' : 'bg-white/20'
                    )} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Erreur globale */}
      {error && (
        <div className="max-w-3xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        </div>
      )}

      {/* Contenu des étapes */}
      {step === 1 && (
        <StoreSelector onNext={handleGoToPromos} />
      )}

      {step === 2 && (
        <PromoGrid
          onNext={handleGenerateRecipe}
          onBack={handleBackToConfig}
        />
      )}

      {step === 3 && (
        <PromoRecipeCard
          onRegenerate={handleRegenerate}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  )
}
