import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid }  from 'nanoid'
import { SEEDED_RECIPES } from '@/data/recipeBank'
import { BUDGET_MAP }     from '@/data/budgetMap'

/**
 * Banque de recettes — toutes les recettes générées, dédupliquées par nom.
 * Sert de cache pour éviter de régénérer des recettes déjà connues.
 */
export const useRecipeBankStore = create(
  persist(
    (set, get) => ({
      /** @type {Array<Recipe & { id: string, savedAt: string }>} */
      recipes:     [],
      seedVersion: 0,

      /** Ajoute un tableau de recettes (déduplique par nom, insensible à la casse) */
      addRecipes: (newRecipes) =>
        set((state) => {
          const existingNames = new Set(
            state.recipes.map((r) => r.name.toLowerCase().trim())
          )
          const toAdd = newRecipes
            .filter((r) => !existingNames.has(r.name.toLowerCase().trim()))
            .map((r) => ({ ...r, id: nanoid(), savedAt: new Date().toISOString() }))
          return { recipes: [...toAdd, ...state.recipes] }
        }),

      /** Supprime une recette par id */
      remove: (id) =>
        set((state) => ({ recipes: state.recipes.filter((r) => r.id !== id) })),

      /** Ajoute une recette manuelle (sans déduplification, marquée isManual) */
      addManual: (recipe) =>
        set((state) => ({
          recipes: [{ ...recipe, id: nanoid(), savedAt: new Date().toISOString(), isManual: true }, ...state.recipes],
        })),

      /** Synchronise les recettes seeds — rejoue si la version a augmenté */
      seedOnce: () => {
        const CURRENT_VERSION = 4   // ← v4 : champs budget + 20 nouvelles recettes
        if (get().seedVersion >= CURRENT_VERSION) return
        const existingNames = new Set(get().recipes.map(r => r.name.toLowerCase().trim()))
        const toAdd = SEEDED_RECIPES.filter(r => !existingNames.has(r.name.toLowerCase().trim()))
        // Enrichit les recettes existantes avec les données budget si elles en manquent
        const enriched = get().recipes.map(r => {
          if (r.coutParPersonne != null) return r
          const budget = BUDGET_MAP[r.name]
          return budget ? { ...r, ...budget } : r
        })
        set({ recipes: [...enriched, ...toAdd], seedVersion: CURRENT_VERSION })
      },

      /** Vide toute la banque */
      clear: () => set({ recipes: [], seedVersion: 0 }),

      /** Vérifie si une recette existe déjà */
      has: (name) =>
        get().recipes.some((r) => r.name.toLowerCase().trim() === name.toLowerCase().trim()),
    }),
    { name: 'chef-ia-recipe-bank' }
  )
)
