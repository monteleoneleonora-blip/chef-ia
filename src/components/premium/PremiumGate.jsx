import { useSubscriptionStore } from '@/store/useSubscriptionStore'
import PremiumPaywall           from './PremiumPaywall'

/**
 * Wraps premium-only content. Shows PremiumPaywall for free users.
 * Important : un visiteur ne doit pas acceder aux fonctions premium.
 * Le bug precedent testait `!== 'free'` et laissait passer les visiteurs.
 */
export default function PremiumGate({ feature = 'default', compact = false, children }) {
  const plan      = useSubscriptionStore(s => s.plan)
  const isPremium = plan !== 'free' && plan !== 'visitor'

  if (isPremium) return children
  return <PremiumPaywall feature={feature} compact={compact} />
}
