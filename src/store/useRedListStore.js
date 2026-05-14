import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useRedListStore = create(
  persist(
    (set, get) => ({
      /** Liste complète des recettes rejetées (objet complet + métadonnées) */
      redList: [],

      add: (recipe) =>
        set((state) => ({
          redList: [
            { ...recipe, addedAt: new Date().toISOString() },
            ...state.redList,
          ],
        })),

      remove: (recipeName) =>
        set((state) => ({
          redList: state.redList.filter((r) => r.name !== recipeName),
        })),

      isInRedList: (recipeName) =>
        get().redList.some((r) => r.name === recipeName),

      toggle: (recipe) => {
        const { isInRedList, add, remove } = get()
        isInRedList(recipe.name) ? remove(recipe.name) : add(recipe)
      },

      clear: () => set({ redList: [] }),
    }),
    { name: 'chef-ia-redlist' }
  )
)
