import { describe, it, expect, beforeEach } from 'vitest'
import { useRedListStore } from './useRedListStore'

beforeEach(() => {
  useRedListStore.setState({ redList: [] })
})

describe('useRedListStore', () => {
  const recipe = { name: 'Soupe froide', type: 'déjeuner' }

  it('add ajoute en tête avec addedAt', () => {
    useRedListStore.getState().add(recipe)
    const list = useRedListStore.getState().redList
    expect(list).toHaveLength(1)
    expect(list[0].addedAt).toBeTruthy()
  })

  it('isInRedList vrai après add', () => {
    useRedListStore.getState().add(recipe)
    expect(useRedListStore.getState().isInRedList('Soupe froide')).toBe(true)
  })

  it('toggle alterne add/remove', () => {
    useRedListStore.getState().toggle(recipe)
    expect(useRedListStore.getState().redList).toHaveLength(1)
    useRedListStore.getState().toggle(recipe)
    expect(useRedListStore.getState().redList).toHaveLength(0)
  })

  it('clear vide complètement', () => {
    useRedListStore.getState().add(recipe)
    useRedListStore.getState().add({ name: 'Autre' })
    useRedListStore.getState().clear()
    expect(useRedListStore.getState().redList).toHaveLength(0)
  })
})
