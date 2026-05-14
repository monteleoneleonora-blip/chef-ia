import { usePromoStore } from '@/store/usePromoStore'
import { cn }            from '@/lib/utils'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const STEPS = [
  {
    title: '🏪 Bienvenue dans le module Promos !',
    body:  'Chef Privé analyse les promotions de votre magasin et génère une recette sur-mesure pour maximiser vos économies. Voici comment ça marche en 3 étapes simples.',
    highlight: null,
  },
  {
    title: '⚙️ Étape 1 — Configurez vos préférences',
    body:  'Choisissez votre magasin, indiquez votre budget par personne, le nombre de convives, le type de repas et un éventuel régime alimentaire.',
    highlight: 'step-1',
  },
  {
    title: '🛒 Étape 2 — Sélectionnez les promos',
    body:  'Parcourez les produits en promotion disponibles et cochez ceux qui vous intéressent. Plus vous en sélectionnez, plus la recette sera créative !',
    highlight: 'step-2',
  },
  {
    title: '🍽️ Étape 3 — Votre recette sur-mesure',
    body:  'Chef Privé génère instantanément une recette savoureuse qui utilise au maximum vos produits en promo, en respectant votre budget. Les ingrédients en promo sont mis en évidence.',
    highlight: 'step-3',
  },
  {
    title: '✅ C\'est parti !',
    body:  'Vous pouvez relancer le tutoriel à tout moment via le bouton "?" en haut de la page. Bonne cuisine et bonnes économies !',
    highlight: null,
  },
]

export default function TutorialOverlay() {
  const tutorialStep    = usePromoStore(s => s.tutorialStep)
  const nextTutorialStep= usePromoStore(s => s.nextTutorialStep)
  const prevTutorialStep= usePromoStore(s => s.prevTutorialStep)
  const closeTutorial   = usePromoStore(s => s.closeTutorial)

  if (tutorialStep === 0) return null

  const current = STEPS[tutorialStep - 1]
  const isLast  = tutorialStep === STEPS.length

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeTutorial}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500"
            style={{ width: `${(tutorialStep / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="p-6">
          {/* Close */}
          <button
            type="button"
            onClick={closeTutorial}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Indicateurs */}
          <div className="flex gap-1.5 mb-5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i < tutorialStep ? 'bg-emerald-500' : 'bg-gray-200',
                  i === tutorialStep - 1 ? 'w-6' : 'w-3'
                )}
              />
            ))}
          </div>

          {/* Contenu */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
            {current.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            {current.body}
          </p>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {tutorialStep > 1 && (
              <button
                type="button"
                onClick={prevTutorialStep}
                className="flex items-center gap-1 px-4 py-2.5 rounded-2xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </button>
            )}
            <button
              type="button"
              onClick={() => nextTutorialStep(STEPS.length)}
              className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold shadow-md shadow-emerald-200 hover:shadow-lg transition-all active:scale-[0.98]"
            >
              {isLast ? 'Commencer !' : (<>Suivant <ChevronRight className="h-4 w-4" /></>)}
            </button>
          </div>

          <button
            type="button"
            onClick={closeTutorial}
            className="w-full mt-3 text-xs text-gray-400 hover:text-gray-500 transition-colors"
          >
            Passer le tutoriel
          </button>
        </div>
      </div>
    </div>
  )
}
