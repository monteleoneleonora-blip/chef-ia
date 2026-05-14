import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Store d'authentification — Chef Privé
 * Gère l'état de connexion de l'utilisateur.
 *
 * Persisté dans localStorage : la session survit aux rechargements de page
 * et aux redémarrages du serveur de dev.
 * Quand Firebase est configuré, la session sera également gérée côté Firebase.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,          // { uid, email, firstName, photoURL }
      consents: null,      // { newsletter: bool, commercial: bool, date: ISO }

      setUser: (user) => set({ user }),
      setConsents: (consents) => set({ consents }),

      logout: () => set({ user: null, consents: null }),
    }),
    { name: 'chef-prive-auth' }
  )
)

// Sélecteurs pratiques
export const selectIsLoggedIn = (s) => s.user !== null
export const selectUser       = (s) => s.user
export const selectConsents   = (s) => s.consents
