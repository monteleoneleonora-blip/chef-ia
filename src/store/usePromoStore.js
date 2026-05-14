import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePromoStore = create(
  persist(
    (set) => ({
      // Préférences persistées
      magasin:    'carrefour',
      budget:     10,
      nbPersonnes: 4,
      mealType:   'déjeuner',
      diet:       '',

      // État session (non persisté — réinitialisé à chaque visite)
      step:           1,     // 1 | 2 | 3
      promos:         [],    // liste complète des promos du magasin
      selected:       [],    // ids des promos cochées
      recipe:         null,  // recette générée
      loading:        false,
      error:          null,
      streamText:     '',    // texte en cours de génération

      // Tutoriel
      tutorialDone:     false,  // ne jamais réinitialiser
      tutorialStep:     0,      // 0 = pas actif
      showHelp:         false,

      // Setters préférences
      setMagasin:      (v) => set({ magasin: v }),
      setBudget:       (v) => set({ budget: v }),
      setNbPersonnes:  (v) => set({ nbPersonnes: v }),
      setMealType:     (v) => set({ mealType: v }),
      setDiet:         (v) => set({ diet: v }),

      // Setters session
      setStep:         (v) => set({ step: v }),
      setPromos:       (v) => set({ promos: v }),
      setSelected:     (v) => set({ selected: v }),
      toggleSelected:  (id) => set(s => ({
        selected: s.selected.includes(id)
          ? s.selected.filter(x => x !== id)
          : [...s.selected, id]
      })),
      selectAll:       () => set(s => ({ selected: s.promos.map(p => p.id) })),
      deselectAll:     () => set({ selected: [] }),
      setRecipe:       (v) => set({ recipe: v }),
      setLoading:      (v) => set({ loading: v }),
      setError:        (v) => set({ error: v }),
      setStreamText:   (v) => set({ streamText: v }),

      // Tutoriel
      startTutorial:   () => set({ tutorialStep: 1 }),
      nextTutorialStep:(total) => set(s => s.tutorialStep >= total ? { tutorialStep: 0, tutorialDone: true } : { tutorialStep: s.tutorialStep + 1 }),
      prevTutorialStep:() => set(s => ({ tutorialStep: Math.max(1, s.tutorialStep - 1) })),
      closeTutorial:   () => set({ tutorialStep: 0, tutorialDone: true }),
      restartTutorial: () => set({ tutorialStep: 1, tutorialDone: false }),
      setShowHelp:     (v) => set({ showHelp: v }),

      reset: () => set({ step: 1, promos: [], selected: [], recipe: null, loading: false, error: null, streamText: '' }),
    }),
    {
      name: 'chef-ia-promo',
      // On ne persiste que les préférences, pas l'état session
      partialize: s => ({
        magasin: s.magasin, budget: s.budget, nbPersonnes: s.nbPersonnes,
        mealType: s.mealType, diet: s.diet, tutorialDone: s.tutorialDone,
      }),
    }
  )
)
