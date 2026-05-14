import { describe, it, expect } from 'vitest'
import { extractRecipeFromChat } from './chat'

describe('extractRecipeFromChat', () => {
  it('retourne null si pas de bloc', () => {
    expect(extractRecipeFromChat('Pas de recette ici.')).toBeNull()
  })

  it('extrait et normalise un bloc valide', () => {
    const text = `Voici la recette !

\`\`\`recipe-json
{"name":"Test","type":"déjeuner","ingredients":[{"quantity":"1","unit":"","name":"œuf"}],"steps":["Casser l'œuf"]}
\`\`\``
    const r = extractRecipeFromChat(text)
    expect(r).not.toBeNull()
    expect(r.name).toBe('Test')
    expect(r.type).toBe('déjeuner')
    expect(r.ingredients).toHaveLength(1)
    expect(r.steps).toEqual(["Casser l'œuf"])
  })

  it('retourne null si JSON invalide', () => {
    const text = '```recipe-json\n{invalid json}\n```'
    expect(extractRecipeFromChat(text)).toBeNull()
  })

  it('retourne null si name/ingredients/steps manquant', () => {
    const text = '```recipe-json\n{"name":"X"}\n```'
    expect(extractRecipeFromChat(text)).toBeNull()
  })
})
