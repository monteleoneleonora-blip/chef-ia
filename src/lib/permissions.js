/**
 * Helpers centralisés pour les permissions liées au plan d'abonnement.
 *
 * Source de vérité : useSubscriptionStore (champ `plan`).
 *
 * Règles métier :
 * - Free / Visiteur → univers "recettes" uniquement
 *   (banque, recherche, filtres, consultation, favoris, courses).
 * - Premium / Family → toutes les autres fonctionnalités
 *   (génération IA, Frigo, Express, Budget IA, Transform, Bien-être, Carnet,
 *    promos intelligentes, etc.).
 *
 * Les fonctions ci-dessous prennent un `plan` (string) en entrée.
 * Pour brancher au store, utilise les hooks dans `usePermissions.js`.
 */

export const PREMIUM_FEATURES = [
  'frigo',
  'express',
  'budget',
  'transform',
  'carnet',
  'wellbeing',
  'promo',
  'generation',
]

export function isPremiumPlan(plan) {
  return plan !== 'free' && plan !== 'visitor'
}

export function isFreePlan(plan) {
  // "free" est strictement le plan gratuit connecté.
  return plan === 'free'
}

export function isVisitorPlan(plan) {
  return plan === 'visitor'
}

/** Retourne true si le plan donné peut accéder à la feature donnée. */
export function canAccess(plan, feature) {
  if (PREMIUM_FEATURES.includes(feature)) return isPremiumPlan(plan)
  return true
}
