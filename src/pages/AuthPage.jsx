import { useState } from 'react'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import RobotChef from '@/components/mascot/RobotChef'
import { useAuthStore } from '@/store/useAuthStore'

/**
 * AuthPage — Page d'inscription / connexion
 *
 * Fonctionne en mode démo (localStorage) tant que Firebase n'est pas configuré.
 * Pour activer Firebase :
 *   1. npm install firebase
 *   2. Remplir .env.local avec les clés Firebase
 *   3. Décommenter le bloc Firebase dans src/lib/firebase.js
 */
export default function AuthPage({ onSuccess }) {
  const setUser     = useAuthStore(s => s.setUser)
  const setConsents = useAuthStore(s => s.setConsents)

  const [mode,       setMode]       = useState('signup') // 'signup' | 'login'
  const [firstName,  setFirstName]  = useState('')
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [showPwd,    setShowPwd]    = useState(false)
  const [newsletter, setNewsletter] = useState(false)
  const [commercial, setCommercial] = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (mode === 'signup' && password.length < 6) {
      setError('Mot de passe trop court (6 caractères minimum).')
      return
    }

    setLoading(true)

    // ── Mode démo local (sans Firebase) ──────────────────────────
    // Remplacer ce bloc par les appels Firebase une fois installé
    await new Promise(r => setTimeout(r, 600)) // simule latence réseau

    const uid = `local-${Date.now()}`
    const name = mode === 'signup' ? firstName : email.split('@')[0]

    setUser({ uid, email, firstName: name, photoURL: null })
    setConsents({ newsletter, commercial, date: new Date().toISOString() })
    setLoading(false)
    onSuccess?.()
  }

  const handleGoogle = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    // Mode démo — en prod Firebase fournira le vrai email Google
    setUser({ uid: `google-${Date.now()}`, email: 'yoann.curt@gmail.com', firstName: 'Yoann', photoURL: null })
    setConsents({ newsletter, commercial, date: new Date().toISOString() })
    setLoading(false)
    onSuccess?.()
  }

  return (
    <div
      className="fixed inset-0 z-[200] overflow-y-auto flex flex-col"
      style={{
        backgroundImage:
          'repeating-linear-gradient(to right, #FFFBE6 0px, #FFFBE6 20px, #FFFFFF 20px, #FFFFFF 40px)',
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-6">

          {/* ── Hero ── */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <RobotChef expression="excited" size="lg" />
            </div>
            <h1 className="font-display text-3xl text-dolce-blue-deep tracking-tight">
              {mode === 'signup' ? 'Créez votre compte' : 'Bon retour !'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === 'signup'
                ? 'Recevez des recettes sur-mesure pour toute votre famille.'
                : 'Connectez-vous pour retrouver vos recettes.'}
            </p>
          </div>

          {/* ── Carte formulaire ── */}
          <div className="bg-white rounded-3xl shadow-dolce-soft border border-dolce-blue-deep/10 p-6 space-y-4">

            {/* Bouton Google */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 h-11 rounded-2xl border-2 border-dolce-blue-deep/15 bg-white hover:bg-dolce-yellow-soft hover:border-dolce-blue-deep/30 transition-all text-sm font-semibold text-dolce-blue-deep disabled:opacity-50"
            >
              <GoogleIcon />
              Continuer avec Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-dolce-blue-deep/10" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">ou</span>
              <div className="flex-1 h-px bg-dolce-blue-deep/10" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">

              {/* Prénom (inscription uniquement) */}
              {mode === 'signup' && (
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-dolce-blue-deep/40" />
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    className="w-full h-11 pl-10 pr-4 rounded-2xl border-2 border-dolce-blue-deep/15 focus:border-dolce-blue-deep/40 outline-none text-sm text-dolce-blue-deep font-medium placeholder:text-muted-foreground/60 transition-colors"
                  />
                </div>
              )}

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-dolce-blue-deep/40" />
                <input
                  type="email"
                  placeholder="Adresse email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-2xl border-2 border-dolce-blue-deep/15 focus:border-dolce-blue-deep/40 outline-none text-sm text-dolce-blue-deep font-medium placeholder:text-muted-foreground/60 transition-colors"
                />
              </div>

              {/* Mot de passe */}
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-dolce-blue-deep/40" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full h-11 pl-10 pr-10 rounded-2xl border-2 border-dolce-blue-deep/15 focus:border-dolce-blue-deep/40 outline-none text-sm text-dolce-blue-deep font-medium placeholder:text-muted-foreground/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dolce-blue-deep/40 hover:text-dolce-blue-deep/70"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Consentements RGPD (inscription uniquement) */}
              {mode === 'signup' && (
                <div className="space-y-2.5 pt-1">
                  <ConsentCheckbox
                    checked={newsletter}
                    onChange={setNewsletter}
                    label="Je souhaite recevoir la newsletter Chef Privé (nouveautés, recettes exclusives)."
                  />
                  <ConsentCheckbox
                    checked={commercial}
                    onChange={setCommercial}
                    label="J'accepte de recevoir des offres commerciales et promotionnelles de Chef Privé."
                  />
                  <p className="text-[10px] text-muted-foreground/55 leading-relaxed pt-0.5">
                    Données traitées conformément au RGPD. Désinscription possible à tout moment.{' '}
                    <span className="underline cursor-pointer hover:text-muted-foreground transition-colors">
                      Politique de confidentialité
                    </span>.
                  </p>
                </div>
              )}

              {/* Erreur */}
              {error && (
                <div className="flex items-start gap-2 text-red-600 bg-red-50 rounded-xl p-3">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium">{error}</p>
                </div>
              )}

              {/* Bouton submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-2xl bg-dolce-blue-deep text-dolce-yellow font-display text-lg tracking-tight hover:shadow-[0_8px_24px_-10px_rgba(36,40,140,0.5)] transition-all disabled:opacity-60 active:scale-[0.99]"
              >
                {loading
                  ? 'Chargement…'
                  : mode === 'signup'
                    ? 'Créer mon compte'
                    : 'Se connecter'}
              </button>
            </form>
          </div>

          {/* ── Toggle mode ── */}
          <p className="text-center text-sm text-muted-foreground">
            {mode === 'signup' ? 'Déjà un compte ? ' : 'Pas encore de compte ? '}
            <button
              type="button"
              onClick={() => { setMode(m => m === 'signup' ? 'login' : 'signup'); setError('') }}
              className="font-bold text-dolce-blue-deep underline underline-offset-2 hover:text-dolce-blue-deep/70 transition-colors"
            >
              {mode === 'signup' ? 'Se connecter' : "S'inscrire"}
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}

/* ─── Composants internes ─────────────────────────────────────────── */

function ConsentCheckbox({ checked, onChange, label }) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={cn(
          'mt-0.5 h-4 w-4 rounded shrink-0 border-2 flex items-center justify-center transition-all cursor-pointer',
          checked
            ? 'bg-dolce-blue-deep border-dolce-blue-deep'
            : 'border-dolce-blue-deep/25 group-hover:border-dolce-blue-deep/50'
        )}
      >
        {checked && (
          <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2">
            <path
              d="M1 4l2.5 2.5L9 1"
              stroke="#F5C842"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="text-[11px] text-muted-foreground leading-relaxed">{label}</span>
    </label>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  )
}
