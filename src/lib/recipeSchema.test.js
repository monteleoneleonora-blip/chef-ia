import { describe, it, expect } from 'vitest'
import { normalizeRecipe, normalizeRecipes } from './recipeSchema'

describe('normalizeRecipe', () => {
  it('garde `name` quand il est présent', () => {
    const r = normalizeRecipe({ name: 'Tarte tatin', type: 'dessert', ingredients: [], steps: [] })
    expect(r.name).toBe('Tarte tatin')
  })

  it('aliase `nom` → `name` (compat premiumAI/promo)', () => {
    const r = normalizeRecipe({ nom: 'Pâtes carbo', ingredients: [], steps: [] })
    expect(r.name).toBe('Pâtes carbo')
    expect(r.nom).toBe('Pâtes carbo') // conservé pour rétro-compat
  })

  it('préfère `name` quand les deux existent', () => {
    const r = normalizeRecipe({ name: 'A', nom: 'B', ingredients: [], steps: [] })
    expect(r.name).toBe('A')
  })

  it('applique un type par défaut "déjeuner"', () => {
    const r = normalizeRecipe({ name: 'X' })
    expect(r.type).toBe('déjeuner')
  })

  it('respecte un overrides.type fourni', () => {
    const r = normalizeRecipe({ name: 'X' }, { type: 'dîner' })
    expect(r.type).toBe('dîner')
  })

  it('garantit ingredients comme tableau d\'objets normalisés', () => {
    const r = normalizeRecipe({ name: 'X', ingredients: [{ name: 'sel' }] })
    expect(r.ingredients[0]).toMatchObject({ quantity: '', unit: '', name: 'sel' })
  })

  it('garantit steps comme tableau de strings', () => {
    const r = normalizeRecipe({ name: 'X' })
    expect(r.steps).toEqual([])
  })

  it('conserve les champs additionnels (cuisine, kcal, available, enPromo, ...)', () => {
    const r = normalizeRecipe({
      name:        'X',
      cuisine:     'Italienne',
      kcalPerPerson: 420,
      ingredients: [{ name: 'pâtes', enPromo: true, prixEstime: 1.2 }],
    })
    expect(r.cuisine).toBe('Italienne')
    expect(r.kcalPerPerson).toBe(420)
    expect(r.ingredients[0].enPromo).toBe(true)
    expect(r.ingredients[0].prixEstime).toBe(1.2)
  })

  it('lève une erreur sur input invalide', () => {
    expect(() => normalizeRecipe(null)).toThrow()
    expect(() => normalizeRecipe('string')).toThrow()
  })
})

describe('normalizeRecipes', () => {
  it('applique normalize à chaque élément', () => {
    const arr = normalizeRecipes([{ name: 'A' }, { nom: 'B' }])
    expect(arr).toHaveLength(2)
    expect(arr[0].name).toBe('A')
    expect(arr[1].name).toBe('B')
  })

  it('retourne [] sur input non-array', () => {
    expect(normalizeRecipes(null)).toEqual([])
    expect(normalizeRecipes('foo')).toEqual([])
  })
})
