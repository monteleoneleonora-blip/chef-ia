import { useState, useEffect } from 'react'
import {
  BookOpen, Crown, Heart, MoreHorizontal,
  Sparkles, ShoppingCart, BarChart2, Tag, Ban, Users, UtensilsCrossed, Database,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFavoritesStore }    from '@/store/useFavoritesStore'
import { useShoppingStore }     from '@/store/useShoppingStore'
import { useRecipeBankStore }   from '@/store/useRecipeBankStore'
import { useRedListStore }      from '@/store/useRedListStore'
import { useBatchStore }        from '@/store/useBatchStore'
import { useSubscriptionStore } from '@/store/useSubscriptionStore'
import { useFamilyStore }       from '@/store/useFamilyStore'
import { useNavStore }          from '@/store/useNavStore'
import { useAuthStore, selectIsLoggedIn } from '@/store/useAuthStore'
import { useIsAdmin }    from '@/lib/adminAuth'
import RobotChef         from '@/components/mascot/RobotChef'
import ChatPanel         from '@/components/chat/ChatPanel'
import AuthPage          from '@/pages/AuthPage'
import FamilyProfilePage from '@/pages/FamilyProfilePage'
import GeneratorPage      from '@/pages/GeneratorPage'
import RecipeBankPage     from '@/pages/RecipeBankPage'
import AdminDatabasePage  from '@/pages/AdminDatabasePage'
import FavoritesPage      from '@/pages/FavoritesPage'
import ShoppingListPage   from '@/pages/ShoppingListPage'
import StatisticsPage     from '@/pages/StatisticsPage'
import RejectedPage       from '@/pages/RejectedPage'
import PremiumPage        from '@/pages/PremiumPage'
import PromoPage          from '@/pages/PromoPage'
import BatchCookingPage   from '@/pages/BatchCookingPage'

/**
 * App — refonte "Dolce Vita v3 — Home application".
 *
 * Differences vs v2 :
 * - L'accueil n'est plus un parcours story plein ecran ; c'est une vraie home
 *   d'application (HomePage), differenciee Free vs Premium.
 * - La nav basse expose Premium pour favoriser la conversion : visible mais fine.
 * - Le chef est statique (RobotChef sans animation).
 * - Le style Dolce Vita est preserve : jaune Sicile / bleu Klein / ivoire.
 *
 * Aucune route existante n'est supprimee : le generateur reste accessible via
 * la home ("Trouver une recette") ainsi que via la nav "Plus".
 */

const PRIMARY_NAV = [
  { id: 'generator', label: 'Cuisine',  icon: Sparkles },
  { id: 'premium',   label: 'Premium',  icon: Crown    },
  { id: 'favorites', label: 'Favoris',  icon: Heart    },
]

const SECONDARY_NAV = [
  { id: 'batch',     label: 'Batch',     icon: UtensilsCrossed },
  { id: 'shopping',  label: 'Courses',   icon: ShoppingCart    },
  { id: 'stats',     label: 'Bien-etre', icon: BarChart2       },
  { id: 'promo',     label: 'Promos',    icon: Tag             },
  { id: 'rejected',  label: 'Rejetees',  icon: Ban             },
  { id: 'profile',   label: 'Profil',    icon: Users           },
  { id: 'admin',     label: 'Admin DB',  icon: Database        },
]

const ALL_PAGES = new Map(
  [...PRIMARY_NAV, ...SECONDARY_NAV].map(n => [n.id, n])
)

const NAV_HEIGHT = 64

export default function App() {
  const [page, setPage]         = useState('generator')
  const [showMore, setShowMore] = useState(false)
  const adminAccess             = useIsAdmin()

  // La création de la fiche famille est presque obligatoire au premier lancement.
  // On exige désormais qu'au moins UN membre soit renseigné (pas juste un nom
  // de foyer ou un régime) pour que la sélection "Qui sera présent ?" fonctionne.
  //
  // `sessionBypass` permet de passer cette étape pour la session en cours
  // (bouton "Passer pour l'instant" discret dans FamilyProfilePage).
  // Étape 1 : authentification (AuthPage)
  const isLoggedIn   = useAuthStore(selectIsLoggedIn)

  // Étape 2 : création du profil famille (FamilyProfilePage)
  const hasMembers   = useFamilyStore(s => (s.profile.members?.length ?? 0) > 0)
  const [sessionBypass, setSessionBypass] = useState(false)
  const welcomed     = hasMembers || sessionBypass
  const setWelcomed  = setSessionBypass

  const { premiumTarget, pageTarget, consumePageTarget } = useNavStore()

  // Si une autre page demande l'ouverture d'une sous-page Premium, on bascule.
  useEffect(() => { if (premiumTarget) setPage('premium') }, [premiumTarget])

  // Cible de page demandee par n'importe quel composant (chips home, etc.)
  useEffect(() => {
    if (pageTarget) {
      setPage(pageTarget)
      consumePageTarget()
      setShowMore(false)
    }
  }, [pageTarget, consumePageTarget])

  useEffect(() => { window.scrollTo({ top: 0 }) }, [page])

  const seedOnce = useRecipeBankStore(s => s.seedOnce)
  useEffect(() => { seedOnce() }, [seedOnce])

  const favCount      = useFavoritesStore(s => s.favorites.length)
  const cartCount     = useShoppingStore(s => s.selectedRecipes.length)
  const rejectedCount = useRedListStore(s => s.redList.length)
  const batchCount    = useBatchStore(s => s.plans.length)

  const BADGES = {
    favorites: favCount,
    shopping:  cartCount,
    rejected:  rejectedCount,
    batch:     batchCount,
  }

  const isOnSecondary = SECONDARY_NAV.some(n => n.id === page)

  const renderPage = () => {
    switch (page) {
      case 'generator': return <GeneratorPage />
      case 'favorites': return <FavoritesPage />
      case 'batch':     return <BatchCookingPage />
      case 'shopping':  return <ShoppingListPage />
      case 'promo':     return <PromoPage />
      case 'rejected':  return <RejectedPage />
      case 'stats':     return <StatisticsPage />
      case 'premium':   return <PremiumPage />
      case 'profile':   return <FamilyProfilePage asOverlay={false} onComplete={() => setPage('generator')} />
      case 'bank':      return <RecipeBankPage />
      case 'admin':     return <AdminDatabasePage />
      default:          return <GeneratorPage />
    }
  }

  // Le generateur garde sa hauteur en story plein ecran (calc(100dvh - 144px)),
  // pour ne PAS impacter ce parcours specifique. Tout le reste paginate avec
  // une marge basse pour la nav.
  const isStoryPage = page === 'generator'

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">

      <header
        className={cn('sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-dolce-blue-deep/10', (!isLoggedIn || !welcomed) && 'hidden')}
        style={{ height: 60 }}
      >
        <div className="max-w-[1400px] mx-auto px-4 h-full flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setPage('generator')}
            className="flex items-center gap-2.5 group min-w-0"
            title="Accueil Chef Privé"
          >
            <div className="h-9 w-9 flex items-center justify-center shrink-0">
              <RobotChef expression="idle" size="xs" />
            </div>
            <div className="leading-none text-left min-w-0">
              <span className="font-display text-[17px] text-dolce-blue-deep tracking-tight uppercase block">
                Chef Privé
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            {adminAccess && (
              <button
                type="button"
                onClick={() => setPage('admin')}
                title="Base de données admin"
                className={cn(
                  'flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors',
                  page === 'admin'
                    ? 'bg-dolce-blue-deep text-white border-dolce-blue-deep'
                    : 'bg-white border-dolce-blue-deep/30 text-dolce-blue-deep hover:border-dolce-blue-deep/60'
                )}
              >
                <Database className="h-3 w-3" />
                Admin DB
              </button>
            )}
            {page !== 'profile' && <SubscriptionBadge />}
          </div>
        </div>
      </header>

      <main
        role="main"
        className={cn('flex-1', isStoryPage ? 'pb-0' : 'pb-24 lg:pb-24')}
      >
        {renderPage()}
      </main>

      <ChatPanel />

      {/* ────────────────── Navigation basse — fine, elegante ─────────── */}
      <nav
        className={cn('fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-dolce-blue-deep/15 shadow-[0_-8px_24px_-12px_rgba(36,40,140,0.18)]', (!isLoggedIn || !welcomed) && 'hidden')}
        aria-label="Navigation principale"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
          height: NAV_HEIGHT + 'px',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-2 h-full flex items-stretch justify-around gap-1">
          {PRIMARY_NAV.map(({ id, label, icon: Icon }) => {
            const active = page === id
            const badge  = BADGES[id]
            return (
              <NavButton
                key={id}
                label={label}
                icon={Icon}
                active={active}
                badge={badge}
                emphasized={id === 'premium'}
                onClick={() => { setPage(id); setShowMore(false) }}
              />
            )
          })}

          <NavButton
            label={isOnSecondary ? (ALL_PAGES.get(page)?.label ?? 'Plus') : 'Plus'}
            icon={MoreHorizontal}
            active={showMore || isOnSecondary}
            badge={BADGES.rejected}
            onClick={() => setShowMore(s => !s)}
            ariaExpanded={showMore}
          />
        </div>
      </nav>

      {showMore && (
        <>
          <div
            className="fixed inset-0 z-30 bg-dolce-blue-deep/40 backdrop-blur-sm animate-in fade-in"
            onClick={() => setShowMore(false)}
            aria-hidden
          />
          <div
            className="fixed left-3 right-3 z-40 bg-white border border-dolce-blue-deep/15 rounded-3xl shadow-dolce-deep p-3 animate-in slide-up-soft"
            style={{
              bottom:       NAV_HEIGHT + 12 + 'px',
              marginBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Plus d'options
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {SECONDARY_NAV.map(({ id, label, icon: Icon }) => {
                const badge = BADGES[id]
                const active = page === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { setPage(id); setShowMore(false) }}
                    className={cn(
                      'relative flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-colors',
                      active
                        ? 'bg-dolce-yellow-soft border border-dolce-blue-deep/15'
                        : 'hover:bg-dolce-yellow-soft/60'
                    )}
                  >
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-white border border-dolce-blue-deep/15 text-dolce-blue-deep shadow-sm">
                      <Icon className="h-4 w-4" strokeWidth={2.2} />
                    </div>
                    <span className="text-[10px] font-bold text-foreground text-center leading-tight">
                      {label}
                    </span>
                    {badge > 0 && (
                      <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full text-[9px] font-extrabold flex items-center justify-center bg-dolce-orange text-white border border-white">
                        {badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Étape 1 — Inscription / Connexion */}
      {!isLoggedIn && (
        <AuthPage onSuccess={() => {}} />
      )}

      {/* Étape 2 — Profil famille (seulement si connecté) */}
      {isLoggedIn && !welcomed && (
        <FamilyProfilePage
          onComplete={() => setPage('generator')}
          onExplore={() => { setWelcomed(true); setPage('generator') }}
        />
      )}
    </div>
  )
}

/**
 * NavButton — bouton fin et elegant pour la navigation basse.
 * - Pas d'aplat agressif, contour discret pour les actifs.
 * - Le bouton "emphasized" (Premium) recoit un point d'accent jaune subtil.
 */
function NavButton({ label, icon: Icon, active, badge, emphasized, onClick, ariaExpanded }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      aria-expanded={ariaExpanded}
      className={cn(
        'relative flex-1 flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-all duration-200 group min-w-0',
        active ? 'text-dolce-blue-deep' : 'text-dolce-blue-deep/50 hover:text-dolce-blue-deep'
      )}
    >
      <div className={cn(
        'h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-200',
        active
          ? 'bg-dolce-yellow-soft border border-dolce-blue-deep/15 shadow-[0_2px_8px_-4px_rgba(36,40,140,0.25)]'
          : 'group-hover:bg-dolce-yellow-soft/60'
      )}>
        <Icon className={cn('h-4 w-4', active && 'text-dolce-blue-deep')} strokeWidth={active ? 2.4 : 2} />
        {emphasized && !active && (
          <span className="absolute top-1.5 right-3 h-1.5 w-1.5 rounded-full bg-dolce-yellow-deep ring-2 ring-white" aria-hidden />
        )}
      </div>
      <span className={cn(
        'text-[10px] font-bold leading-tight tracking-wide truncate max-w-full px-1',
        active ? 'text-dolce-blue-deep' : 'text-dolce-blue-deep/60'
      )}>
        {label}
      </span>
      {badge > 0 && (
        <span className="absolute top-0.5 right-1.5 h-4 min-w-4 px-1 rounded-full text-[9px] font-extrabold flex items-center justify-center bg-dolce-orange text-white shadow-md border border-white">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  )
}

function SubscriptionBadge() {
  const sub  = useSubscriptionStore()
  const plan = sub.getPlan()

  if (sub.isPremium()) {
    return (
      <div className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-dolce-blue-deep text-dolce-yellow text-[10px] font-bold uppercase tracking-wider shrink-0">
        <Crown className="h-3 w-3" />
        {plan.name}
      </div>
    )
  }
  if (sub.isVisitor()) {
    return (
      <button
        type="button"
        onClick={() => useNavStore.getState().goToPage('profile')}
        className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-white border border-dolce-blue-deep/20 text-dolce-blue-deep/70 text-[10px] font-bold uppercase tracking-wider hover:border-dolce-blue-deep/40 transition-colors shrink-0"
      >
        Créer un compte
      </button>
    )
  }
  return null
}
