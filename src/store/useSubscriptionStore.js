import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const PLANS = {
  visitor: {
    id:           'visitor',
    name:         'Visiteur',
    price:        0,
    priceLabel:   'Gratuit',
    aiGeneration: false,
    generations:  0,
    personalizedRecipes: 0,
    chatMessages: 5,
    tts:          false,
    color:        'gray',
    bankLimit:    3,
    perks: [
      'Apercu de 3 recettes de la banque',
      '5 messages au chef IA',
      'Creez un compte gratuit pour tout debloquer',
    ],
  },
  free: {
    id:           'free',
    name:         'Gratuit',
    price:        0,
    priceLabel:   'Gratuit',
    aiGeneration: true,           // ouvert pour les 3 recettes offertes
    generations:  Infinity,        // pas de limite de generations brutes
    personalizedRecipes: 3,        // 3 recettes personnalisees offertes
    chatMessages: 30,
    tts:          false,
    color:        'slate',
    perks: [
      '3 recettes personnalisees offertes',
      'Acces a toute la banque de recettes',
      'Recherche et filtres simples',
      '30 messages au chef / mois',
      'Liste de courses & favoris',
    ],
  },
  premium: {
    id:           'premium',
    name:         'Premium',
    price:        4.99,
    priceLabel:   '4,99 EUR / mois',
    aiGeneration: true,
    generations:  Infinity,
    personalizedRecipes: Infinity,
    chatMessages: Infinity,
    tts:          true,
    color:        'emerald',
    perks: [
      "Recettes 100% generees par l'IA",
      'Mode Frigo — cuisinez ce que vous avez',
      'Repas Express — idee en 30 secondes',
      'Transformation de recettes en variantes',
      'Carnet de recettes personnalise',
      'Budget IA — repas selon votre enveloppe',
      'Chat illimite & lecture vocale',
    ],
  },
  family: {
    id:           'family',
    name:         'Famille',
    price:        9.99,
    priceLabel:   '9,99 EUR / mois',
    aiGeneration: true,
    generations:  Infinity,
    personalizedRecipes: Infinity,
    chatMessages: Infinity,
    tts:          true,
    color:        'violet',
    perks: [
      'Tout Premium inclus',
      "Profils famille (jusqu'a 6 membres)",
      'Recettes adaptees a chaque profil',
      'Batch cooking automatique',
      'Plans nutritionnels personnalises',
    ],
  },
}

function startOfMonth() {
  const d = new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function isNewMonth(resetAt) {
  if (!resetAt) return true
  const reset = new Date(resetAt)
  const now   = new Date()
  return reset.getMonth() !== now.getMonth() || reset.getFullYear() !== now.getFullYear()
}

export const useSubscriptionStore = create(persist(
  (set, get) => ({
    plan:        'visitor',
    activatedAt: null,
    expiresAt:   null,
    /** Email saisi a l'inscription gratuite (registration). null = pas inscrit. */
    email:       null,
    usage: {
      generations:        0,
      chatMessages:       0,
      personalizedRecipes: 0,
      resetAt:            startOfMonth(),
    },

    // Selecteurs
    getPlan() {
      return PLANS[get().plan] ?? PLANS.free
    },

    getUsage() {
      // BUG-007 : ne jamais appeler set() dans un getter (cascade de re-rendus).
      // On retourne simplement l'usage courant ; si le mois a changé, on
      // retourne un objet frais SANS persister — la persistance se fait au
      // prochain trackXxx() via resetIfNewMonth().
      const state = get()
      if (isNewMonth(state.usage.resetAt)) {
        return {
          generations:        0,
          chatMessages:       0,
          personalizedRecipes: state.usage?.personalizedRecipes ?? 0,
          resetAt:            startOfMonth(),
        }
      }
      return state.usage
    },

    /** Réinitialise le quota mensuel si nécessaire. Appelé depuis les actions. */
    resetIfNewMonth() {
      const state = get()
      if (isNewMonth(state.usage.resetAt)) {
        set({
          usage: {
            generations:        0,
            chatMessages:       0,
            personalizedRecipes: state.usage?.personalizedRecipes ?? 0,
            resetAt:            startOfMonth(),
          },
        })
      }
    },

    isVisitor()    { return get().plan === 'visitor' },
    // BUG-017 : vérification de l'expiration de l'abonnement.
    isPremium() {
      const s = get()
      if (s.plan === 'free' || s.plan === 'visitor') return false
      if (s.expiresAt && new Date(s.expiresAt) < new Date()) return false
      return true
    },
    /** L'utilisateur est un "invite gratuit" : Free + email enregistre. */
    isRegistered() { return Boolean(get().email) },
    canUseAI()     { return get().getPlan().aiGeneration === true },

    /** Quota de recettes personnalisees restant. Infinity pour Premium. */
    remainingPersonalized() {
      const plan  = get().getPlan()
      const cap   = plan.personalizedRecipes ?? 0
      if (cap === Infinity) return Infinity
      const usage = get().getUsage()
      return Math.max(0, cap - (usage.personalizedRecipes ?? 0))
    },

    /** True si l'utilisateur peut encore generer une recette personnalisee. */
    canPersonalize() {
      return get().remainingPersonalized() > 0
    },

    canGenerate() {
      const plan  = get().getPlan()
      const usage = get().getUsage()
      return plan.generations === Infinity || usage.generations < plan.generations
    },

    canChat() {
      const plan  = get().getPlan()
      const usage = get().getUsage()
      return plan.chatMessages === Infinity || usage.chatMessages < plan.chatMessages
    },

    remainingGenerations() {
      const plan  = get().getPlan()
      if (plan.generations === Infinity) return Infinity
      const usage = get().getUsage()
      return Math.max(0, plan.generations - usage.generations)
    },

    remainingChat() {
      const plan  = get().getPlan()
      if (plan.chatMessages === Infinity) return Infinity
      const usage = get().getUsage()
      return Math.max(0, plan.chatMessages - usage.chatMessages)
    },

    // Actions
    trackGeneration() {
      get().resetIfNewMonth()
      const usage = get().getUsage()
      set({ usage: { ...usage, generations: usage.generations + 1 } })
    },

    trackChatMessage() {
      get().resetIfNewMonth()
      const usage = get().getUsage()
      set({ usage: { ...usage, chatMessages: usage.chatMessages + 1 } })
    },

    /** Decremente le quota de recettes personnalisees (3 -> 0). */
    trackPersonalizedRecipe() {
      get().resetIfNewMonth()
      const usage = get().getUsage()
      set({ usage: { ...usage, personalizedRecipes: (usage.personalizedRecipes ?? 0) + 1 } })
    },

    /**
     * Inscription gratuite avec email. Bascule en plan 'free' (3 recettes
     * personnalisees offertes) et marque l'utilisateur comme inscrit.
     */
    registerEmail(email) {
      const trimmed = (email ?? '').trim().toLowerCase()
      if (!trimmed) return
      const now = new Date().toISOString()
      set({
        email:       trimmed,
        plan:        'free',
        activatedAt: now,
        expiresAt:   null,
      })
    },

    activate(planId) {
      const now     = new Date()
      const expires = new Date(now)
      expires.setMonth(expires.getMonth() + 1)
      set({
        plan:        planId,
        activatedAt: now.toISOString(),
        expiresAt:   planId === 'free' ? null : expires.toISOString(),
      })
    },

    cancelSubscription() {
      // Reset usage en meme temps que la resiliation pour ne pas garder
      // un compteur de generations consommees sur l'ancien plan.
      // L'email reste conserve : l'utilisateur garde son compte gratuit.
      set({
        plan:        'free',
        activatedAt: null,
        expiresAt:   null,
        usage: {
          generations:        0,
          chatMessages:       0,
          personalizedRecipes: 0,
          resetAt:            startOfMonth(),
        },
      })
    },
  }),
  { name: 'chef-ia-subscription' }
))
