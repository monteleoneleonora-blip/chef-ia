import { describe, it, expect, beforeEach } from 'vitest'
import { matchRecipesFromBank } from './recipeMatcher'
import { useRecipeBankStore }   from '@/store/useRecipeBankStore'
import { useRedListStore }      from '@/store/useRedListStore'

const RECIPES = [
  { id: 'a', name: 'Salade niçoise', type: 'déjeuner', cuisine: 'Française', servings: 4,
    ingredients: [{ quantity: '200', unit: 'g', name: 'thon' }], diets: [] },
  { id: 'b', name: 'Pad thaï',       type: 'déjeuner', cuisine: 'Thaïlandaise', servings: 4,
    ingredients: [{ quantity: '300', unit: 'g', name: 'nouilles' }], diets: [] },
  { id: 'c', name: 'Risotto champignon', type: 'dîner',   cuisine: 'Italienne', servings: 4,
    ingredients: [{ quantity: '300', unit: 'g', name: 'riz' }], diets: ['Végétarien'] },
]

beforeEach(() => {
  useRecipeBankStore.setState({ recipes: RECIPES, seedVersion: 999 })
  useRedListStore.setState({ redList: [] })
})

describe('matchRecipesFromBank', () => {
  it('retourne le bon nombre par type', () => {
    const { results, missing } = matchRecipesFromBank({
      mealCounts: { lunch: 2, dinner: 1 },
      totalPeople: 4,
      familyMembers: [{ selectedDiets: [] }],
    })
    const lunches = results.filter(r => r.type === 'déjeuner')
    const dinners = results.filter(r => r.type === 'dîner')
    expect(lunches).toHaveLength(2)
    expect(dinners).toHaveLength(1)
    expect(missing).toHaveLength(0)
  })

  it('exclut les recettes en redList', () => {
    useRedListStore.setState({ redList: [{ name: 'Pad thaï' }] })
    const { results } = matchRecipesFromBank({
      mealCounts: { lunch: 2 },
      totalPeople: 4,
      familyMembers: [{ selectedDiets: [] }],
    })
    expect(results.find(r => r.name === 'Pad thaï')).toBeUndefined()
    // Une seule recette déjeuner restante (Salade niçoise) → results = 1, missing = 1
    expect(results).toHaveLength(1)
  })

  it('filtre par ingrédient interdit', () => {
    const { results } = matchRecipesFromBank({
      mealCounts: { lunch: 2 },
      totalPeople: 4,
      forbiddenIngredients: ['thon'],
      familyMembers: [{ selectedDiets: [] }],
    })
    expect(results.find(r => r.name === 'Salade niçoise')).toBeUndefined()
  })

  it('filtre par régime alimentaire', () => {
    const { results } = matchRecipesFromBank({
      mealCounts: { dinner: 1 },
      totalPeople: 4,
      familyMembers: [{ selectedDiets: ['Végétarien'] }],
    })
    expect(results).toHaveLength(1)
    expect(results[0].name).toBe('Risotto champignon')
  })

  it('met à l\'échelle les ingrédients', () => {
    const { results } = matchRecipesFromBank({
      mealCounts: { lunch: 1 },
      totalPeople: 8, // recipe.servings = 4 → ratio 2
      cuisines: ['Française'],
      familyMembers: [{ selectedDiets: [] }],
    })
    const salade = results.find(r => r.name === 'Salade niçoise')
    expect(salade.servings).toBe(8)
    // 200 g × 2 = 400
    expect(salade.ingredients[0].quantity).toBe('400')
  })

  it('signale missing quand pas assez de candidats', () => {
    const { missing } = matchRecipesFromBank({
      mealCounts: { lunch: 5 },
      totalPeople: 4,
      familyMembers: [{ selectedDiets: [] }],
    })
    expect(missing).toHaveLength(1)
    expect(missing[0]).toMatchObject({ type: 'déjeuner', asked: 5, found: 2 })
  })
})
