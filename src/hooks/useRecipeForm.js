import { useState, useCallback } from 'react'

// ─────────────────────────────────────────────────────────────────
// Types (JSDoc)
// ─────────────────────────────────────────────────────────────────

/**
 * @typedef {null | {
 *   status     : 'analyzing' | 'done' | 'error'
 *   fileName   : string
 *   kcal       : number | null
 *   protein    : number | null
 *   carbs      : number | null
 *   lipids     : number | null
 *   fiber      : number | null
 *   note       : string
 *   error      : string | null
 *   analyzedAt : string
 * }} NutritionPlan
 */

/**
 * @typedef {{ id: string, name: string, selectedDiets: string[], customDiet: string, nutritionPlan: NutritionPlan, nutritionTargets: { kcal: string, protein: string, carbs: string } }} FamilyMember
 */

// ─────────────────────────────────────────────────────────────────
// État initial
// ─────────────────────────────────────────────────────────────────

const INITIAL_MEMBER = { id: '1', name: '', selectedDiets: [], customDiet: '', nutritionPlan: null, nutritionTargets: { kcal: '', protein: '', carbs: '' } }

const INITIAL_STATE = {
  mealCounts:              { breakfast: 0, lunch: 0, dinner: 7 },
  /**
   * Présences par instance de repas.
   * Structure : { [type]: Array<string[]> }
   * Chaque élément est la liste des IDs membres présents pour CE repas précis.
   * Tableau vide = tout le monde.
   * Ex : { dinner: [[], ['m1','m2'], []] } → dîner 1 = tout le monde,
   *       dîner 2 = m1 + m2, dîner 3 = tout le monde.
   */
  mealPresence:            { breakfast: [], lunch: [], dinner: Array(7).fill(null).map(() => []) },
  totalPeople:             4,
  children:                [],
  checkedIngredients:      [],
  customIngredients:       '',
  forbiddenIngredients:    [],
  compatibleCombinations:  [],
  incompatibleCombinations:[],
  nutritionTargets:        { kcal: '', protein: '', carbs: '' },
  equipment:               [],
  cuisines:                [],
  /** @type {FamilyMember[]} */
  familyMembers:           [INITIAL_MEMBER],
  /** @type {NutritionPlan} Plan médical global (ordonnance médecin) */
  medicalNutritionPlan:    null,
}

// ─────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────

export function useRecipeForm() {
  const [formData, setFormData] = useState(INITIAL_STATE)

  // ── Utilitaire générique ──────────────────────────────────────
  const updateField = useCallback((field, value) =>
    setFormData(prev => ({ ...prev, [field]: value })), [])

  // ── Repas & foyer ─────────────────────────────────────────────
  const setMealTypeCount = useCallback((type, count) =>
    setFormData(prev => {
      const newCount    = Math.max(0, Math.min(10, count))
      const existing    = prev.mealPresence[type] ?? []
      // Agrandit ou réduit le tableau d'instances en préservant les configs existantes
      let newInstances
      if (newCount > existing.length) {
        newInstances = [...existing, ...Array(newCount - existing.length).fill(null).map(() => [])]
      } else {
        newInstances = existing.slice(0, newCount)
      }
      return {
        ...prev,
        mealCounts:   { ...prev.mealCounts, [type]: newCount },
        mealPresence: { ...prev.mealPresence, [type]: newInstances },
      }
    }), [])

  /**
   * Bascule un membre pour une instance de repas précise.
   * @param {string}   mealType      - 'breakfast' | 'lunch' | 'dinner'
   * @param {number}   instanceIndex - index du repas (0 = premier déjeuner, etc.)
   * @param {string}   memberId
   */
  const toggleMealPresence = useCallback((mealType, instanceIndex, memberId) =>
    setFormData(prev => {
      const instances    = [...(prev.mealPresence[mealType] ?? [])]
      const current      = instances[instanceIndex] ?? []
      instances[instanceIndex] = current.includes(memberId)
        ? current.filter(id => id !== memberId)
        : [...current, memberId]
      return { ...prev, mealPresence: { ...prev.mealPresence, [mealType]: instances } }
    }), [])

  const setTotalPeople = useCallback((n) =>
    updateField('totalPeople', Math.max(1, Math.min(20, n))), [updateField])

  // ── Enfants ───────────────────────────────────────────────────
  const addChild = useCallback(() =>
    setFormData(prev => ({ ...prev, children: [...prev.children, { age: '' }] })), [])

  const removeChild = useCallback((i) =>
    setFormData(prev => ({ ...prev, children: prev.children.filter((_, idx) => idx !== i) })), [])

  const updateChildAge = useCallback((i, age) =>
    setFormData(prev => {
      const updated = [...prev.children]
      updated[i] = { ...updated[i], age }
      return { ...prev, children: updated }
    }), [])

  // ── Ingrédients ───────────────────────────────────────────────
  const toggleIngredient = useCallback((ingredient) =>
    setFormData(prev => ({
      ...prev,
      checkedIngredients: prev.checkedIngredients.includes(ingredient)
        ? prev.checkedIngredients.filter(i => i !== ingredient)
        : [...prev.checkedIngredients, ingredient],
    })), [])

  const setCustomIngredients = useCallback((text) =>
    updateField('customIngredients', text), [updateField])

  // ── Tags (ingrédients interdits, associations) ────────────────
  const addTag = useCallback((listName, value) => {
    const normalized = value.trim()
    if (!normalized) return
    setFormData(prev => {
      if (prev[listName].includes(normalized)) return prev
      return { ...prev, [listName]: [...prev[listName], normalized] }
    })
  }, [])

  const removeTag = useCallback((listName, index) =>
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index),
    })), [])

  // ── Nutrition ─────────────────────────────────────────────────
  const setNutritionTarget = useCallback((key, value) =>
    setFormData(prev => ({
      ...prev,
      nutritionTargets: { ...prev.nutritionTargets, [key]: value },
    })), [])

  const updateMedicalNutritionPlan = useCallback((plan) =>
    updateField('medicalNutritionPlan', plan), [updateField])

  // ── Équipements & cuisines ────────────────────────────────────
  const toggleEquipment = useCallback((key) =>
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(key)
        ? prev.equipment.filter(e => e !== key)
        : [...prev.equipment, key],
    })), [])

  const toggleCuisine = useCallback((key) =>
    setFormData(prev => ({
      ...prev,
      cuisines: prev.cuisines.includes(key)
        ? prev.cuisines.filter(c => c !== key)
        : [...prev.cuisines, key],
    })), [])

  // ── Membres de la famille ─────────────────────────────────────
  const addFamilyMember = useCallback(() =>
    setFormData(prev => ({
      ...prev,
      familyMembers: [
        ...prev.familyMembers,
        { id: Date.now().toString(), name: '', selectedDiets: [], customDiet: '', nutritionPlan: null, nutritionTargets: { kcal: '', protein: '', carbs: '' } },
      ],
    })), [])

  const removeFamilyMember = useCallback((id) =>
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter(m => m.id !== id),
    })), [])

  const updateMemberName = useCallback((id, name) =>
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map(m => m.id === id ? { ...m, name } : m),
    })), [])

  const toggleMemberDiet = useCallback((id, diet) =>
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map(m =>
        m.id !== id ? m : {
          ...m,
          selectedDiets: m.selectedDiets.includes(diet)
            ? m.selectedDiets.filter(d => d !== diet)
            : [...m.selectedDiets, diet],
        }
      ),
    })), [])

  const updateMemberCustomDiet = useCallback((id, customDiet) =>
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map(m => m.id === id ? { ...m, customDiet } : m),
    })), [])

  const updateMemberNutritionPlan = useCallback((id, plan) =>
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map(m => m.id === id ? { ...m, nutritionPlan: plan } : m),
    })), [])

  const loadFamilyMembers = useCallback((members) =>
    setFormData(prev => ({ ...prev, familyMembers: members })), [])

  const updateMemberNutritionTarget = useCallback((id, key, value) =>
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map(m =>
        m.id === id ? { ...m, nutritionTargets: { ...(m.nutritionTargets ?? {}), [key]: value } } : m
      ),
    })), [])

  // ── Reset ─────────────────────────────────────────────────────
  const resetForm = useCallback(() => setFormData(INITIAL_STATE), [])

  return {
    formData,
    // Repas & foyer
    setMealTypeCount, toggleMealPresence, setTotalPeople,
    // Enfants
    addChild, removeChild, updateChildAge,
    // Ingrédients
    toggleIngredient, setCustomIngredients,
    addTag, removeTag,
    // Nutrition
    setNutritionTarget, updateMedicalNutritionPlan,
    // Équipements & cuisines
    toggleEquipment, toggleCuisine,
    // Membres
    addFamilyMember, removeFamilyMember,
    updateMemberName, toggleMemberDiet, updateMemberCustomDiet,
    updateMemberNutritionPlan, updateMemberNutritionTarget,
    loadFamilyMembers,
    // Reset
    resetForm,
  }
}
