import { describe, it, expect, beforeEach } from 'vitest'
import { useFavoritesStore } from './useFavoritesStore'

beforeEach(() => {
  useFavoritesStore.setState({ favorites: [] })
})

describe('useFavoritesStore', () => {
  const recipe = { name: 'Tarte tatin', type: 'dessert' }

  it('add ajoute une recette avec savedAt', () => {
    useFavoritesStore.getState().add(recipe)
    const favs = useFavoritesStore.getState().favorites
    expect(favs).toHaveLength(1)
    expect(favs[0].name).toBe('Tarte tatin')
    expect(favs[0].savedAt).toBeTruthy()
  })

  it('isFavorite reflète la présence', () => {
    expect(useFavoritesStore.getState().isFavorite('Tarte tatin')).toBe(false)
    useFavoritesStore.getState().add(recipe)
    expect(useFavoritesStore.getState().isFavorite('Tarte tatin')).toBe(true)
  })

  it('toggle ajoute puis retire', () => {
    useFavoritesStore.getState().toggle(recipe)
    expect(useFavoritesStore.getState().favorites).toHaveLength(1)
    useFavoritesStore.getState().toggle(recipe)
    expect(useFavoritesStore.getState().favorites).toHaveLength(0)
  })

  it('remove par nom', () => {
    useFavoritesStore.getState().add(recipe)
    useFavoritesStore.getState().add({ name: 'Autre', type: 'dîner' })
    useFavoritesStore.getState().remove('Tarte tatin')
    const favs = useFavoritesStore.getState().favorites
    expect(favs).toHaveLength(1)
    expect(favs[0].name).toBe('Autre')
  })
})
