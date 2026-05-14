import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Fiche famille — utilisée pour personnaliser les recettes.
 *
 * Version invitée gratuite : fiche simplifiée (juste assez pour personnaliser
 * 3 recettes offertes).
 * Version Premium : la fiche est utilisée pour toutes les générations IA.
 *
 * Structure :
 * {
 *   householdName: string,
 *   adults:        number,                 // legacy — compteur simple
 *   children:      Array<{ id, age }>,     // legacy
 *   members:       Array<Member>,          // NOUVEAU — liste typée par personne
 *   diets:         string[],
 *   allergies:     string[],
 *   dislikedIngredients: string[],
 *   budgetLevel:   'low' | 'medium' | 'premium' | null,
 *   availableTime: string | null,
 *   mainGoal:      string | null,
 *   updatedAt:     string ISO,
 * }
 *
 * Member :
 * {
 *   id:            string,
 *   kind:          'adult' | 'child',
 *   name:          string,
 *   age:           number | null,             // requis pour les enfants
 *   particularity: null | {
 *     diet:           string,                 // texte libre ou preset
 *     allergies:      string[],
 *     intolerances:   string[],
 *     kcal:           number | null,
 *     protein:        number | null,          // grammes
 *     carbs:          number | null,          // grammes (féculents)
 *     nutritionPlan:  null | {
 *       fileName:   string,
 *       status:     'analyzing' | 'done' | 'error',
 *       kcal:       number | null,
 *       protein:    number | null,
 *       carbs:      number | null,
 *       note:       string,
 *       error:      string | null,
 *       analyzedAt: string ISO,
 *     },
 *   }
 * }
 *
 * Le store est persistant (localStorage) afin que la fiche survive aux reloads.
 */

export const FAMILY_GOALS = [
  { id: 'time',     label: 'Gagner du temps',           emoji: '⏱️' },
  { id: 'healthy',  label: 'Manger plus équilibré',     emoji: '🌿' },
  { id: 'kids',     label: 'Faire plaisir aux enfants', emoji: '🧒' },
  { id: 'budget',   label: 'Dépenser moins',            emoji: '💶' },
  { id: 'variety',  label: 'Varier les repas',          emoji: '🌍' },
  { id: 'antiwaste',label: 'Cuisiner avec ce qu\'il reste', emoji: '🥦' },
]

export const FAMILY_DIETS = [
  'Végétarien',
  'Vegan',
  'Sans gluten',
  'Sans lactose',
  'Keto',
  'Méditerranéen',
]

export const BUDGET_LEVELS = [
  { id: 'low',     label: 'Économique',  hint: '< 2 €/personne' },
  { id: 'medium',  label: 'Équilibré',   hint: '2 à 5 €/personne' },
  { id: 'premium', label: 'Plaisir',     hint: '> 5 €/personne' },
]

export const TIME_RANGES = [
  { id: '15-30', label: '15 à 30 min' },
  { id: '30-45', label: '30 à 45 min' },
  { id: '45+',   label: 'Plus de 45 min' },
]

const EMPTY_PROFILE = {
  householdName:        '',
  adults:               2,
  children:             [],
  members:              [],
  diets:                [],
  allergies:            [],
  dislikedIngredients:  [],
  budgetLevel:          null,
  availableTime:        null,
  mainGoal:             null,
  updatedAt:            null,
}

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/** Crée une particularité vierge pour un membre. */
export function createEmptyParticularity() {
  return {
    diet:          '',
    allergies:     [],
    intolerances:  [],
    kcal:          null,
    protein:       null,
    carbs:         null,
    nutritionPlan: null,
  }
}

/** Crée un membre par défaut. */
export function createMember({ kind = 'adult', name = '', age = null } = {}) {
  return {
    id:            genId(),
    kind,
    name,
    age:           kind === 'child' ? (age ?? 6) : age,
    particularity: null,
  }
}

export const useFamilyStore = create(persist(
  (set, get) => ({
    profile: { ...EMPTY_PROFILE },

    /** Indique si une fiche famille a été remplie (au moins le nom du foyer ou des membres). */
    hasProfile() {
      const p = get().profile
      return Boolean(
        p?.householdName?.trim() ||
        (p?.members?.length ?? 0) > 0 ||
        (p?.children?.length ?? 0) > 0 ||
        (p?.diets?.length ?? 0) > 0
      )
    },

    /** Remplace l'intégralité du profil. */
    setProfile(partial) {
      set({
        profile: {
          ...EMPTY_PROFILE,
          ...get().profile,
          ...partial,
          updatedAt: new Date().toISOString(),
        },
      })
    },

    /* ─────────── Membres typés (adultes + enfants) ─────────── */

    /** Initialise la liste des membres à partir d'un compteur d'adultes et d'une liste d'enfants. */
    seedMembers(adults = 2, children = []) {
      const list = []
      for (let i = 0; i < adults; i++) {
        list.push(createMember({ kind: 'adult', name: i === 0 ? 'Adulte 1' : `Adulte ${i + 1}` }))
      }
      for (const c of children) {
        list.push(createMember({ kind: 'child', name: c.name ?? '', age: c.age ?? 6 }))
      }
      get().update({ members: list })
    },

    /** Ajoute un membre. */
    addMember(kind = 'adult') {
      const members = get().profile.members ?? []
      const same = members.filter(m => m.kind === kind).length
      const baseName = kind === 'child' ? 'Enfant' : 'Adulte'
      const member = createMember({
        kind,
        name: `${baseName} ${same + 1}`,
        age:  kind === 'child' ? 6 : null,
      })
      get().update({ members: [...members, member] })
      return member
    },

    /** Met à jour un membre par id (patch léger). */
    updateMember(id, patch) {
      const members = (get().profile.members ?? []).map(m =>
        m.id === id ? { ...m, ...patch } : m
      )
      get().update({ members })
    },

    /** Retire un membre. */
    removeMember(id) {
      const members = (get().profile.members ?? []).filter(m => m.id !== id)
      get().update({ members })
    },

    /** Active ou retire la particularité d'un membre. */
    toggleMemberParticularity(id, on) {
      const members = (get().profile.members ?? []).map(m => {
        if (m.id !== id) return m
        if (on === false || (on === undefined && m.particularity)) {
          return { ...m, particularity: null }
        }
        return { ...m, particularity: m.particularity ?? createEmptyParticularity() }
      })
      get().update({ members })
    },

    /** Patch sur la particularité d'un membre. */
    updateMemberParticularity(id, patch) {
      const members = (get().profile.members ?? []).map(m => {
        if (m.id !== id) return m
        const part = m.particularity ?? createEmptyParticularity()
        return { ...m, particularity: { ...part, ...patch } }
      })
      get().update({ members })
    },

    /** Patch léger sur le profil. */
    update(patch) {
      set({
        profile: {
          ...get().profile,
          ...patch,
          updatedAt: new Date().toISOString(),
        },
      })
    },

    /** Ajoute un enfant (âge requis). */
    addChild(age, preferences = []) {
      const children = [...get().profile.children, { id: genId(), age, preferences }]
      get().update({ children })
    },

    /** Met à jour un enfant. */
    updateChild(id, patch) {
      const children = get().profile.children.map(c =>
        c.id === id ? { ...c, ...patch } : c
      )
      get().update({ children })
    },

    /** Retire un enfant. */
    removeChild(id) {
      const children = get().profile.children.filter(c => c.id !== id)
      get().update({ children })
    },

    /** Toggle d'un régime. */
    toggleDiet(diet) {
      const diets = get().profile.diets.includes(diet)
        ? get().profile.diets.filter(d => d !== diet)
        : [...get().profile.diets, diet]
      get().update({ diets })
    },

    /** Réinitialise la fiche. */
    reset() {
      set({ profile: { ...EMPTY_PROFILE } })
    },
  }),
  { name: 'chef-ia-family' }
))
