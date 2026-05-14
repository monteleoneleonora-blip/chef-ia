import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const CARNET_TAGS = [
  'À refaire',
  'Validée par les enfants',
  'Rapide semaine',
  'Repas invités',
  'Trop long',
  'Très économique',
  'Gourmand',
  'Léger',
  'Batch cooking',
  'Anti-gaspi',
]

export const SOURCE_LABEL = {
  frigo:     { label: 'Frigo',    emoji: '🥦', color: 'bg-green-100 text-green-700'   },
  express:   { label: 'Express',  emoji: '⚡', color: 'bg-yellow-100 text-yellow-700' },
  budget:    { label: 'Budget',   emoji: '💰', color: 'bg-blue-100 text-blue-700'     },
  transform: { label: 'Variante', emoji: '🔄', color: 'bg-purple-100 text-purple-700' },
  ai:        { label: 'Chef Privé',  emoji: '✨', color: 'bg-emerald-100 text-emerald-700'},
  promo:     { label: 'Promos',   emoji: '🏷️', color: 'bg-orange-100 text-orange-700' },
}

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export const useCarnetStore = create(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (recipe, source = 'ai') => {
        const nom = recipe.nom ?? recipe.name ?? 'Recette sans titre'
        // Éviter les doublons par nom
        if (get().entries.some(e => (e.recipe.nom ?? e.recipe.name) === nom)) return
        set(s => ({
          entries: [
            { id: genId(), recipe, source, tags: [], note: '', createdAt: new Date().toISOString() },
            ...s.entries,
          ],
        }))
      },

      removeEntry: (id) =>
        set(s => ({ entries: s.entries.filter(e => e.id !== id) })),

      toggleTag: (id, tag) =>
        set(s => ({
          entries: s.entries.map(e =>
            e.id !== id ? e : {
              ...e,
              tags: e.tags.includes(tag) ? e.tags.filter(t => t !== tag) : [...e.tags, tag],
            }
          ),
        })),

      updateNote: (id, note) =>
        set(s => ({
          entries: s.entries.map(e => e.id !== id ? e : { ...e, note }),
        })),

      hasEntry: (nom) => {
        if (!nom) return false
        return get().entries.some(e => (e.recipe.nom ?? e.recipe.name) === nom)
      },
    }),
    { name: 'chef-ia-carnet' }
  )
)
