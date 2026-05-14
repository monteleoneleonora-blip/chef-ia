import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useHouseholdStore = create(
  persist(
    (set) => ({
      /** @type {import('@/hooks/useRecipeForm').FamilyMember[] | null} */
      members:  null,
      savedAt:  null,

      save: (members) =>
        set({
          // BUG-010 : ne pas écraser nutritionPlan — conserver la valeur
          // existante (peut être null ou un objet plan) pour rester
          // cohérent avec la forme useFamilyStore.
          members: members.map(m => ({ ...m })),
          savedAt: new Date().toISOString(),
        }),

      clear: () => set({ members: null, savedAt: null }),
    }),
    { name: 'chef-ia-household' }
  )
)
