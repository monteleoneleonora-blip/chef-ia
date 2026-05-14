import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useBudgetStore = create(
  persist(
    (set, get) => ({
      // Filtre actif dans la banque
      filtreNiveau: 'all',      // 'all' | 'économique' | 'moyen' | 'premium'
      filtreMaxParPersonne: '', // '' ou un nombre (ex: "2")

      // Préférences utilisateur persistées
      nbPersonnes:   4,         // nombre de convives par défaut
      budgetSemaine: '',        // € / semaine (optionnel)
      budgetMois:    '',        // € / mois (optionnel)

      setFiltreNiveau:         (v) => set({ filtreNiveau: v }),
      setFiltreMaxParPersonne: (v) => set({ filtreMaxParPersonne: v }),
      setNbPersonnes:          (n) => set({ nbPersonnes: n }),
      setBudgetSemaine:        (v) => set({ budgetSemaine: v }),
      setBudgetMois:           (v) => set({ budgetMois: v }),
      resetFiltres: () => set({ filtreNiveau: 'all', filtreMaxParPersonne: '' }),
    }),
    { name: 'chef-ia-budget' }
  )
)
