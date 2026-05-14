import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'

/**
 * @typedef {Object} FeedbackEntry
 * @property {string}   id
 * @property {string}   date             - ISO date string
 * @property {string}   recipeName
 * @property {string}   mealType         - 'petit-déjeuner' | 'déjeuner' | 'dîner'
 * @property {string}   cuisine          - ex: 'Française', 'Italienne'…
 * @property {number}   energy           - 1 à 5
 * @property {number}   digestion        - 1 à 5
 * @property {number}   satiety          - 1 à 5
 * @property {number}   lightness        - 1 à 5
 * @property {number}   mood             - 1 à 5
 * @property {number}   satisfaction     - 1 à 5
 * @property {string[]} foodGroups       - groupes alimentaires présents dans le repas
 * @property {string[]} symptoms         - symptômes ressentis après le repas
 */

export const useFeedbackStore = create(
  persist(
    (set) => ({
      /** @type {FeedbackEntry[]} */
      entries: [],

      addEntry: (entry) =>
        set((state) => ({
          entries: [
            {
              foodGroups: [],
              symptoms:   [],
              ...entry,
              id:   nanoid(),
              date: entry.date ?? new Date().toISOString(),
            },
            ...state.entries,
          ],
        })),

      removeEntry: (id) =>
        set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),

      clear: () => set({ entries: [] }),
    }),
    { name: 'chef-ia-feedback' }
  )
)
