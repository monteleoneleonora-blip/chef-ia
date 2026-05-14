import { describe, it, expect, beforeEach } from 'vitest'
import { useSubscriptionStore, PLANS } from './useSubscriptionStore'

beforeEach(() => {
  // Reset store entre tests
  useSubscriptionStore.setState({
    plan: 'visitor',
    activatedAt: null,
    expiresAt: null,
    usage: { generations: 0, chatMessages: 0, resetAt: new Date().toISOString() },
  })
})

describe('useSubscriptionStore — plans', () => {
  it('plan par défaut = visitor', () => {
    expect(useSubscriptionStore.getState().plan).toBe('visitor')
  })

  it('isVisitor / isPremium cohérents', () => {
    const s = useSubscriptionStore.getState()
    expect(s.isVisitor()).toBe(true)
    expect(s.isPremium()).toBe(false)
  })

  it('activate(premium) bascule en premium et pose expiresAt', () => {
    useSubscriptionStore.getState().activate('premium')
    const s = useSubscriptionStore.getState()
    expect(s.plan).toBe('premium')
    expect(s.activatedAt).toBeTruthy()
    expect(s.expiresAt).toBeTruthy()
    expect(s.isPremium()).toBe(true)
    expect(s.canUseAI()).toBe(true)
  })

  it('activate(free) ne pose pas expiresAt', () => {
    useSubscriptionStore.getState().activate('free')
    expect(useSubscriptionStore.getState().expiresAt).toBeNull()
  })
})

describe('useSubscriptionStore — quotas', () => {
  it('visitor n\'a pas droit à l\'IA', () => {
    expect(useSubscriptionStore.getState().canUseAI()).toBe(false)
  })

  it('canGenerate() suit le quota du plan', () => {
    useSubscriptionStore.getState().activate('premium')
    expect(useSubscriptionStore.getState().canGenerate()).toBe(true)
  })

  it('trackGeneration incrémente le compteur', () => {
    useSubscriptionStore.getState().activate('premium')
    useSubscriptionStore.getState().trackGeneration()
    expect(useSubscriptionStore.getState().usage.generations).toBe(1)
  })

  it('remainingChat retourne Infinity pour les plans payants', () => {
    useSubscriptionStore.getState().activate('premium')
    expect(useSubscriptionStore.getState().remainingChat()).toBe(Infinity)
  })

  it('remainingChat = (limit - used) pour les plans free/visitor', () => {
    useSubscriptionStore.getState().activate('free')
    useSubscriptionStore.getState().trackChatMessage()
    useSubscriptionStore.getState().trackChatMessage()
    expect(useSubscriptionStore.getState().remainingChat()).toBe(PLANS.free.chatMessages - 2)
  })
})

describe('useSubscriptionStore — cancelSubscription', () => {
  it('reset le plan à free et l\'usage à 0', () => {
    useSubscriptionStore.getState().activate('premium')
    useSubscriptionStore.getState().trackGeneration()
    useSubscriptionStore.getState().trackChatMessage()

    useSubscriptionStore.getState().cancelSubscription()

    const s = useSubscriptionStore.getState()
    expect(s.plan).toBe('free')
    expect(s.activatedAt).toBeNull()
    expect(s.expiresAt).toBeNull()
    expect(s.usage.generations).toBe(0)
    expect(s.usage.chatMessages).toBe(0)
  })
})
