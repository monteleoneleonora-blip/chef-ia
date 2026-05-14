/**
 * Moteur de correspondance — lit la base de données MAÎTRESSE (cachée).
 * L'IA n'est appelée qu'en fallback si cette base ne couvre pas la demande.
 */
import { MASTER_RECIPES }  from '@/data/masterRecipeDatabase'
import { useRedListStore }  from '@/store/useRedListStore'

const MEAL_TYPE_MAP = {
  breakfast: 'PDEJ',
  lunch:     'DEJ',
  dinner:    'DIN',
}

const TYPE_FR = {
  PDEJ: 'petit-déjeuner',
  DEJ:  'déjeuner',
  DIN:  'dîner',
}

function scaleQty(raw, ratio) {
  if (!raw || ratio === 1) return raw
  const frac = raw.match(/^(\d+)\/(\d+)$/)
  if (frac) {
    const val = (parseInt(frac[1]) / parseInt(frac[2])) * ratio
    return formatQty(val)
  }
  const num = parseFloat(raw)
  if (!isNaN(num) && String(num) === raw.trim()) {
    return formatQty(num * ratio)
  }
  return raw
}

function formatQty(val) {
  if (val <= 0) return '0'
  const rounded = Math.round(val * 4) / 4
  return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1).replace('.0', '')
}

function scaleIngredients(ingredients, fromServings, toServings) {
  if (!fromServings || fromServings === toServings) return ingredients
  const ratio = toServings / fromServings
  return ingredients.map(ing => ({ ...ing, quantity: scaleQty(ing.quantity, ratio) }))
}

function stripDiacritics(s) {
  return (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function recipeMatchesCriteria(recipe, mealTypeFr, formData) {
  if (stripDiacritics(recipe.type) !== stripDiacritics(mealTypeFr)) return false

  if (formData.forbiddenIngredients?.length > 0) {
    const names = recipe.ingredients?.map(i => i.name.toLowerCase()) ?? []
    const forbidden = formData.forbiddenIngredients.some(f =>
      names.some(n => n.includes(f.toLowerCase()))
    )
    if (forbidden) return false
  }

  const allDiets = [
    ...(formData.familyMembers?.flatMap(m => m.selectedDiets ?? []) ?? []),
  ].filter(Boolean)

  if (allDiets.length > 0) {
    const recipeDiets = (recipe.diets ?? []).map(d => d.toLowerCase())
    const compatible = allDiets.every(d => recipeDiets.includes(d.toLowerCase()))
    if (!compatible) return false
  }

  return true
}

function pickUnique(arr, count) {
  if (arr.length === 0) return []
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

/**
 * Recherche dans la base maîtresse.
 * @param {object} formData
 * @returns {{ results: object[], missing: { type: string, asked: number, found: number }[] }}
 */
export function matchRecipesFromBank(formData) {
  const redListNames = new Set(
    useRedListStore.getState().redList.map(r => r.name.toLowerCase().trim())
  )
  const allRecipes = MASTER_RECIPES.filter(
    r => !redListNames.has(r.name.toLowerCase().trim())
  )

  const totalPeople = formData.totalPeople ?? 4
  const results     = []
  const missing     = []

  for (const [mealKey, count] of Object.entries(formData.mealCounts ?? {})) {
    if (!count || count <= 0) continue
    const tag = MEAL_TYPE_MAP[mealKey]
    if (!tag) continue
    const mealTypeFr = TYPE_FR[tag]

    let candidates = allRecipes.filter(r => recipeMatchesCriteria(r, mealTypeFr, formData))

    if (formData.cuisines?.length > 0 && candidates.length > count) {
      const withCuisine = candidates.filter(r =>
        formData.cuisines.some(c => r.cuisine?.toLowerCase().includes(c.toLowerCase()))
      )
      if (withCuisine.length >= count) candidates = withCuisine
    }

    const picked = pickUnique(candidates, count)

    if (picked.length < count) {
      missing.push({ type: mealTypeFr, asked: count, found: picked.length })
    }

    const adapted = picked.map(recipe => ({
      ...recipe,
      servings:    totalPeople,
      ingredients: scaleIngredients(recipe.ingredients, recipe.servings, totalPeople),
    }))

    results.push(...adapted)
  }

  return { results, missing }
}
