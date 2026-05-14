import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid }  from 'nanoid'

/**
 * Store des plans de batch cooking sauvegardés.
 * Chaque plan est enrichi d'un id unique et d'une date de sauvegarde.
 */
export const useBatchStore = create(
  persist(
    (set, get) => ({
      /** @type {Array<object>} plans batch cooking sauvegardés */
      plans: [],

      /**
       * Sauvegarde un plan batch cooking.
       * Retourne l'id du plan sauvegardé.
       */
      savePlan: (plan) => {
        const id = nanoid()
        set(state => ({
          plans: [
            { ...plan, id, savedAt: new Date().toISOString() },
            ...state.plans,
          ],
        }))
        return id
      },

      /** Supprime un plan par id */
      removePlan: (id) =>
        set(state => ({ plans: state.plans.filter(p => p.id !== id) })),

      /** Vide tous les plans */
      clearAll: () => set({ plans: [] }),
    }),
    { name: 'chef-prive-batch' }
  )
)
