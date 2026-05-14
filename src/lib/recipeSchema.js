/**
 * Normalise une recette quel que soit le client qui l'a produite.
 *
 * Les différents endpoints utilisent des shapes légèrement différentes :
 *   - claude.js (génération principale) : { name, type, cuisine, imageQuery, ... }
 *   - premiumAI.js (frigo/express/budget/transform) : { nom, description, cuisine, ... }
 *   - promoRecipeAI.js : { nom, description, type, cuisine, ... }
 *   - chat.js (extraction inline) : { name, type, cuisine, ... }
 *
 * Cette fonction garantit qu'une recette en aval de l'app a toujours :
 *   - `name` (string) — alias canonique, jamais `nom`
 *   - `type` (string)  — petit-déjeuner | déjeuner | dîner (défaut : 'déjeuner')
 *   - `ingredients` (Array<{quantity, unit, name}>)
 *   - `steps` (Array<string>)
 *   - les autres champs sont copiés tels quels
 *
 * @param {object} raw - recette brute issue d'un endpoint
 * @param {object} [overrides] - champs à forcer (ex: type pour Frigo qui ne le retourne pas)
 * @returns {object} recette normalisée
 */
export function normalizeRecipe(raw, overrides = {}) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('normalizeRecipe: argument invalide')
  }

  // Alias name <-> nom : préfère `name` quand les deux existent
  const name = raw.name ?? raw.nom ?? 'Recette sans titre'

  // Type par défaut, normalisé en minuscules
  const type = (raw.type ?? overrides.type ?? 'déjeuner').toLowerCase()

  // Ingrédients : garantit le tableau et la shape minimale
  const ingredients = Array.isArray(raw.ingredients)
    ? raw.ingredients.map(ing => ({
        quantity: String(ing.quantity ?? ''),
        unit:     ing.unit ?? '',
        name:     ing.name ?? '',
        ...ing,  // conserve `available`, `enPromo`, `prixEstime` etc.
      }))
    : []

  // Étapes : garantit le tableau de strings
  const steps = Array.isArray(raw.steps) ? raw.steps.map(String) : []

  return {
    ...raw,
    name,
    type,
    ingredients,
    steps,
    ...overrides,
  }
}

/**
 * Normalise un tableau de recettes.
 * @param {object[]} arr
 * @param {object} [overrides]
 * @returns {object[]}
 */
export function normalizeRecipes(arr, overrides = {}) {
  if (!Array.isArray(arr)) return []
  return arr.map(r => normalizeRecipe(r, overrides))
}
