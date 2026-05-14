import { create } from 'zustand'

/**
 * Wizard d'accueil — stocke les réponses du parcours voix pour que
 * GeneratorPage puisse les consommer et lancer la génération.
 */
export const useWizardStore = create(set => ({
  pending: false,
  answers: null,
  setAnswers: (answers) => set({ pending: true, answers }),
  consume:    ()        => set({ pending: false, answers: null }),
}))
