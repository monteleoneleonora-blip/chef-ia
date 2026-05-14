import { useSubscriptionStore } from '@/store/useSubscriptionStore'
import { isPremiumPlan, isFreePlan, isVisitorPlan, canAccess } from '@/lib/permissions'

/**
 * Hook unique pour consommer la logique de permissions dans les composants.
 * Évite de dupliquer `plan !== 'free' && plan !== 'visitor'` partout.
 */
export function usePermissions() {
  const plan = useSubscriptionStore(s => s.plan)

  return {
    plan,
    isPremiumUser: isPremiumPlan(plan),
    isFreeUser:    isFreePlan(plan),
    isVisitorUser: isVisitorPlan(plan),
    canAccess: (feature) => canAccess(plan, feature),
  }
}
