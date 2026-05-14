/**
 * Agrège les ingrédients de plusieurs recettes en une liste de courses.
 * Fusionne les quantités quand les unités sont identiques.
 */
export function buildShoppingList(recipes) {
  /** @type {Map<string, {name:string, quantity:string, unit:string, recipes:string[], note?:string}>} */
  const map = new Map()

  recipes.forEach((recipe) => {
    recipe.ingredients?.forEach((ing) => {
      const key = ing.name.toLowerCase().trim()
      const qty = parseFloat(ing.quantity)

      if (map.has(key)) {
        const existing = map.get(key)
        if (existing.unit === ing.unit && !isNaN(qty) && !isNaN(parseFloat(existing.quantity))) {
          map.set(key, {
            ...existing,
            quantity: String(parseFloat(existing.quantity) + qty),
            recipes: [...existing.recipes, recipe.name],
          })
        } else {
          map.set(key, {
            ...existing,
            note: `${existing.quantity}${existing.unit ? ' ' + existing.unit : ''} + ${ing.quantity}${ing.unit ? ' ' + ing.unit : ''}`,
            recipes: [...existing.recipes, recipe.name],
          })
        }
      } else {
        map.set(key, {
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit ?? '',
          recipes: [recipe.name],
        })
      }
    })
  })

  return Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name, 'fr')
  )
}

/** Formate la quantité + unité d'un item de la liste de courses */
export function formatQty(item) {
  if (item.note) return item.note
  return [item.quantity, item.unit].filter(Boolean).join('\u00a0')
}
