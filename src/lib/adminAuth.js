import { useAuthStore } from '@/store/useAuthStore'

const ADMIN_EMAIL = 'yoann.curt@gmail.com'

function emailMatches(email) {
  return (email ?? '').trim().toLowerCase() === ADMIN_EMAIL
}

/**
 * Retourne true si l'utilisateur connecté est l'administrateur.
 */
export function isAdmin() {
  const user = useAuthStore.getState().user
  return emailMatches(user?.email)
}

/**
 * Hook React — abonné au store pour réactivité.
 */
export function useIsAdmin() {
  const email = useAuthStore(s => s.user?.email)
  return emailMatches(email)
}
