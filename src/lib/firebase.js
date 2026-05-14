/**
 * Configuration Firebase — Chef Privé
 *
 * Étapes pour activer Firebase :
 *  1. npm install firebase
 *  2. Créer un projet sur https://console.firebase.google.com
 *  3. Activer Authentication (Email/Password + Google)
 *  4. Activer Firestore Database
 *  5. Remplir .env.local avec les clés du projet
 */

export const isFirebaseConfigured = Boolean(import.meta.env.VITE_FIREBASE_API_KEY)

// auth, db et googleProvider seront exportés depuis ici une fois Firebase installé.
// En attendant, AuthPage fonctionne en mode démo local.
export const auth           = null
export const db             = null
export const googleProvider = null
