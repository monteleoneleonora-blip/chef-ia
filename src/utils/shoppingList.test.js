import { describe, it, expect } from 'vitest'
import { buildShoppingList, formatQty } from './shoppingList'

const r1 = {
  name: 'Pâtes carbo',
  ingredients: [
    { quantity: '200', unit: 'g', name: 'pâtes' },
    { quantity: '100', unit: 'g', name: 'lardons' },
    { quantity: '2',   unit: '',  name: 'œufs' },
  ],
}
const r2 = {
  name: 'Salade',
  ingredients: [
    { quantity: '150', unit: 'g', name: 'pâtes' },           // même unité → fusion
    { quantity: '1',   unit: 'pièce', name: 'tomate' },
    { quantity: '3',   unit: '',  name: 'œufs' },
  ],
}

describe('buildShoppingList', () => {
  it('agrège les ingrédients identiques avec même unité', () => {
    const list = buildShoppingList([r1, r2])
    const pates = list.find(i => i.name.toLowerCase() === 'pâtes')
    expect(pates).toBeDefined()
    expect(pates.quantity).toBe('350')   // 200 + 150
    expect(pates.unit).toBe('g')
    expect(pates.recipes).toEqual(['Pâtes carbo', 'Salade'])
  })

  it('annote les unités différentes au lieu de fusionner', () => {
    const list = buildShoppingList([
      { name: 'A', ingredients: [{ quantity: '500', unit: 'g',  name: 'farine' }] },
      { name: 'B', ingredients: [{ quantity: '1',   unit: 'kg', name: 'farine' }] },
    ])
    const farine = list.find(i => i.name === 'farine')
    expect(farine.note).toBeDefined()
    expect(farine.note).toContain('500')
    expect(farine.note).toContain('1')
  })

  it('trie alphabétiquement (locale fr)', () => {
    const list = buildShoppingList([r1, r2])
    const names = list.map(i => i.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'fr')))
  })

  it('retourne une liste vide pour 0 recettes', () => {
    expect(buildShoppingList([])).toEqual([])
  })
})

describe('formatQty', () => {
  it('renvoie quantité + unité jointes par espace insécable', () => {
    expect(formatQty({ quantity: '200', unit: 'g' })).toBe('200 g')
  })
  it('omet l\'unité vide', () => {
    expect(formatQty({ quantity: '3', unit: '' })).toBe('3')
  })
  it('renvoie la note si présente (cas unités mélangées)', () => {
    expect(formatQty({ quantity: '500', unit: 'g', note: '500 g + 1 kg' })).toBe('500 g + 1 kg')
  })
})
