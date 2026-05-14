import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useShoppingStore = create(
  persist(
    (set, get) => ({
      selectedRecipes: [],
      checkedItemNames: [], // ingredient names checked while shopping

      toggle: (recipe) => {
        const { selectedRecipes } = get()
        const exists = selectedRecipes.some((r) => r.name === recipe.name)
        set({
          selectedRecipes: exists
            ? selectedRecipes.filter((r) => r.name !== recipe.name)
            : [...selectedRecipes, recipe],
        })
      },

      isSelected: (recipeName) =>
        get().selectedRecipes.some((r) => r.name === recipeName),

      remove: (recipeName) =>
        set((state) => ({
          selectedRecipes: state.selectedRecipes.filter((r) => r.name !== recipeName),
        })),

      clear: () => set({ selectedRecipes: [], checkedItemNames: [] }),

      toggleChecked: (itemName) =>
        set((state) => ({
          checkedItemNames: state.checkedItemNames.includes(itemName)
            ? state.checkedItemNames.filter((n) => n !== itemName)
            : [...state.checkedItemNames, itemName],
        })),

      clearChecked: () => set({ checkedItemNames: [] }),
    }),
    { name: 'chef-ia-shopping' }
  )
)
