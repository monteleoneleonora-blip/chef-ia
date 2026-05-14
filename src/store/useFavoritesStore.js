import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],

      add: (recipe) =>
        set((state) => ({
          favorites: [
            ...state.favorites,
            { ...recipe, savedAt: new Date().toISOString() },
          ],
        })),

      remove: (recipeName) =>
        set((state) => ({
          favorites: state.favorites.filter((r) => r.name !== recipeName),
        })),

      isFavorite: (recipeName) =>
        get().favorites.some((r) => r.name === recipeName),

      toggle: (recipe) => {
        const { isFavorite, add, remove } = get()
        isFavorite(recipe.name) ? remove(recipe.name) : add(recipe)
      },
    }),
    { name: 'chef-ia-favorites' }
  )
)
