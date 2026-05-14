import { useMemo, useState } from 'react'
import {
  Lock, Crown, ChevronRight, Coffee, Salad, Soup,
  Zap, Wallet, Users, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRecipeBankStore }   from '@/store/useRecipeBankStore'
import { useNavStore }          from '@/store/useNavStore'
import { useSubscriptionStore } from '@/store/useSubscriptionStore'
import RobotChef        from '@/components/mascot/RobotChef'
import SearchIntentBar  from '@/components/home/SearchIntentBar'
import InspirationCarousel from '@/components/home/InspirationCarousel'
import UpgradeModal     from '@/components/subscription/UpgradeModal'

/**
 * HomeFree — accueil mobile-first, éditorial culinaire.
 *
 * Pas de dashboard, pas de bandeau bleu, pas de grille SaaS.
 * - Hero ivoire compact avec accent script "Buongiorno"
 * - Fausse barre de recherche + chips fines (porte d'entrée recettes)
 * - Carrousel "Inspiration du moment" (cartes recettes raffinées)
 * - Tuiles légères "Vos raccourcis recettes" (mini-cartes horizontales)
 * - Bloc Premium subtil — 3 cartes max, microcopy bénéfice + CTA fin
 *
 * Largeur max ~ 480px sur mobile, jusqu'à 560-640 sur tablette/desktop, pour
 * conserver une lecture mobile-first et chaleureuse sur tous les écrans.
 */

const SEARCH_CHIPS = [
  { id: 'rapide',     label: 'Rapide',      emoji: '⚡', filter: { search: 'rapide' } },
  { id: 'budget',     label: 'Petit budget', emoji: '💶', filter: { search: 'économique' } },
  { id: 'famille',    label: 'Famille',     emoji: '👨‍👩‍👧', filter: { search: 'famille' } },
  { id: 'italien',    label: 'Italien',     emoji: '🇮🇹', filter: { search: 'italien' } },
  { id: 'vege',       label: 'Végétarien',  emoji: '🌱', filter: { search: 'végétarien' } },
  { id: 'diner',      label: 'Dîner',       emoji: '🍝', filter: { mealType: 'dîner' } },
]

const SHORTCUT_TILES = [
  { id: 'breakfast', label: 'Petit-déjeuner', sub: 'Le matin',     icon: Coffee, filter: { mealType: 'petit-déjeuner' } },
  { id: 'lunch',     label: 'Déjeuner',       sub: 'À midi',       icon: Salad,  filter: { mealType: 'déjeuner' } },
  { id: 'dinner',    label: 'Dîner',          sub: 'Le soir',      icon: Soup,   filter: { mealType: 'dîner' } },
  { id: 'rapid',     label: 'Recettes rapides', sub: '< 30 min',  icon: Zap,    filter: { search: 'rapide' } },
  { id: 'family',    label: 'Recettes famille', sub: 'Pour tous', icon: Users,  filter: { search: 'famille' } },
  { id: 'budget',    label: 'Petit budget',   sub: 'Économique',   icon: Wallet, filter: { search: 'économique' } },
]

const PREMIUM_TEASERS = [
  { id: 'frigo',     emoji: '🥦', title: 'Frigo',     desc: 'Cuisinez avec ce que vous avez déjà' },
  { id: 'express',   emoji: '⚡', title: 'Express',   desc: 'Un dîner prêt en moins de 30 minutes' },
  { id: 'transform', emoji: '🔄', title: 'Transform', desc: 'Adaptez une recette à vos envies'   },
]

export default function HomeFree() {
  const recipes        = useRecipeBankStore(s => s.recipes)
  const goToPage       = useNavStore(s => s.goToPage)
  const isRegistered   = useSubscriptionStore(s => s.isRegistered())
  const remainingQuota = useSubscriptionStore(s => s.remainingPersonalized())
  const [showUpgrade, setShowUpgrade] = useState(false)

  // Inspiration : 5 recettes cohérentes pour le carrousel
  const inspirations = useMemo(() => {
    if (!recipes?.length) return []
    const FEATURED = [
      'Magret de canard miel balsamique',
      'Saint-Jacques poêlées beurre blanc agrumes',
      'Risotto aux champignons',
      'Crème brûlée vanille Bourbon',
      'Tagliatelles aux truffes',
    ]
    const found = FEATURED.map(n => recipes.find(r => r.name === n)).filter(Boolean)
    if (found.length >= 5) return found.slice(0, 5)
    const extras = recipes
      .filter(r => !FEATURED.includes(r.name))
      .slice(0, 5 - found.length)
    return [...found, ...extras].slice(0, 5)
  }, [recipes])

  const handleChip     = (chip) => goToPage('bank', { bankFilter: chip.filter })
  const handleShortcut = (tile) => goToPage('bank', { bankFilter: tile.filter })
  const handleSearch   = ()      => goToPage('bank')
  const handleRecipe   = ()      => goToPage('bank')

  return (
    <div className="mx-auto px-4 pt-4 pb-6 space-y-7 max-w-[560px]">

      {/* ────────────────── 1 · Hero éditorial compact ──────────────── */}
      <section aria-labelledby="home-hero-title">
        <div className="flex items-center gap-3.5">
          <div className="shrink-0">
            <RobotChef expression="idle" size="sm" />
          </div>
          <div className="min-w-0">
            <p className="font-script text-[28px] text-dolce-blue-deep leading-none">
              Bonjour
            </p>
            <h1
              id="home-hero-title"
              className="font-display text-[22px] sm:text-[24px] text-dolce-blue-deep tracking-tight leading-tight mt-1"
            >
              Que cuisine-t-on aujourd'hui&nbsp;?
            </h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2.5 leading-relaxed">
          Une envie, un ingrédient, un manque d'inspiration&nbsp;? On vous aide.
        </p>
      </section>

      {/* ────────────────── Quota recettes personnalisees ──────────── */}
      {isRegistered && remainingQuota !== Infinity && (
        <PersonalizedQuotaBanner
          remaining={remainingQuota}
          onGenerate={() => goToPage('generator')}
          onUpgrade={() => setShowUpgrade(true)}
        />
      )}

      {/* ────────────────── 2 · Recherche + chips ───────────────────── */}
      <section aria-label="Recherche de recettes">
        <SearchIntentBar
          placeholder="Rechercher une recette, un ingrédient ou une envie…"
          chips={SEARCH_CHIPS}
          onSearch={handleSearch}
          onChipClick={handleChip}
        />
      </section>

      {/* ────────────────── 3 · Inspiration du moment ───────────────── */}
      <section aria-labelledby="home-inspiration-title">
        <SectionHeader
          id="home-inspiration-title"
          eyebrow="Inspiration du moment"
          title="À piocher dans votre banque"
          ctaLabel="Voir la banque"
          onCta={() => goToPage('bank')}
        />
        {inspirations.length > 0 ? (
          <InspirationCarousel
            recipes={inspirations}
            onSelect={handleRecipe}
          />
        ) : (
          <EmptyInspiration onBrowse={() => goToPage('bank')} />
        )}
      </section>

      {/* ────────────────── 4 · Vos raccourcis ──────────────────────── */}
      <section aria-labelledby="home-shortcuts-title">
        <SectionHeader
          id="home-shortcuts-title"
          eyebrow="Vos raccourcis"
          title="Par moment de la journée"
        />
        <div className="grid grid-cols-1 gap-2">
          {SHORTCUT_TILES.map(tile => (
            <ShortcutTile
              key={tile.id}
              tile={tile}
              onClick={() => handleShortcut(tile)}
            />
          ))}
        </div>
      </section>

      {/* ────────────────── 5 · Premium subtil ──────────────────────── */}
      <section aria-labelledby="home-premium-title" className="pt-2">
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Crown className="h-3.5 w-3.5 text-dolce-yellow-deep" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-dolce-blue-deep/60">
              Découvrir Premium
            </span>
          </div>
          <h2
            id="home-premium-title"
            className="font-display text-[18px] sm:text-[20px] text-dolce-blue-deep tracking-tight leading-snug"
          >
            Passez du livre de recettes à votre chef personnel
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Avec Premium, Chef Privé cuisine avec votre frigo, votre temps, votre budget et vos contraintes.
          </p>
        </div>

        <div className="space-y-2">
          {PREMIUM_TEASERS.map(t => (
            <PremiumTeaser
              key={t.id}
              teaser={t}
              onClick={() => goToPage('premium')}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goToPage('premium')}
            className="text-xs font-semibold text-dolce-blue-deep underline underline-offset-4 decoration-dolce-blue-deep/30 hover:decoration-dolce-blue-deep transition-colors"
          >
            Voir toutes les fonctions Premium
          </button>
          <button
            type="button"
            onClick={() => setShowUpgrade(true)}
            className={cn(
              'inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl',
              'bg-dolce-blue-deep text-dolce-yellow text-xs font-bold',
              'hover:shadow-[0_8px_18px_-10px_rgba(36,40,140,0.5)] transition-shadow',
            )}
          >
            <Crown className="h-3 w-3" />
            Découvrir
          </button>
        </div>
      </section>

      {showUpgrade && (
        <UpgradeModal reason="generation" onClose={() => setShowUpgrade(false)} />
      )}
    </div>
  )
}

/* ─────────────────────── Sous-composants UI internes ─────────────────────── */

function SectionHeader({ id, eyebrow, title, ctaLabel, onCta }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-3">
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-dolce-blue-deep/55">
          {eyebrow}
        </p>
        <h2
          id={id}
          className="font-display text-[18px] sm:text-[20px] text-dolce-blue-deep tracking-tight leading-snug mt-0.5"
        >
          {title}
        </h2>
      </div>
      {ctaLabel && (
        <button
          type="button"
          onClick={onCta}
          className="shrink-0 inline-flex items-center gap-0.5 text-xs font-semibold text-dolce-blue-deep/70 hover:text-dolce-blue-deep transition-colors"
        >
          {ctaLabel}
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

function ShortcutTile({ tile, onClick }) {
  const Icon = tile.icon
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left',
        'bg-white/85 border border-dolce-blue-deep/10',
        'hover:bg-white hover:border-dolce-blue-deep/25',
        'transition-colors',
      )}
    >
      <span className="shrink-0 h-9 w-9 rounded-xl bg-dolce-yellow-soft text-dolce-blue-deep flex items-center justify-center group-hover:bg-dolce-yellow transition-colors">
        <Icon className="h-4 w-4" strokeWidth={2.1} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-foreground leading-tight">
          {tile.label}
        </p>
        <p className="text-[11px] text-muted-foreground">{tile.sub}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-dolce-blue-deep/25 group-hover:text-dolce-blue-deep/60 group-hover:translate-x-0.5 transition-all" />
    </button>
  )
}

function PremiumTeaser({ teaser, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left',
        'bg-white/85 border border-dolce-blue-deep/10',
        'hover:bg-white hover:border-dolce-blue-deep/25',
        'transition-colors',
      )}
      aria-label={`${teaser.title} — fonctionnalité Premium`}
    >
      <span className="shrink-0 h-10 w-10 rounded-xl bg-dolce-yellow-soft border border-dolce-blue-deep/10 flex items-center justify-center text-lg">
        {teaser.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-bold text-foreground leading-tight">{teaser.title}</span>
          <Lock className="h-3 w-3 text-dolce-blue-deep/40" aria-hidden="true" />
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
          {teaser.desc}
        </p>
      </div>
      <span className="shrink-0 inline-flex items-center text-[11px] font-bold text-dolce-blue-deep/70 group-hover:text-dolce-blue-deep">
        Découvrir
        <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </button>
  )
}

/**
 * PersonalizedQuotaBanner — bandeau elegant qui rappelle a l'invite gratuit
 * combien de recettes personnalisees il lui reste, ou invite a passer Premium
 * lorsque le quota est epuise.
 */
function PersonalizedQuotaBanner({ remaining, onGenerate, onUpgrade }) {
  if (remaining > 0) {
    return (
      <div className="rounded-3xl border border-dolce-blue-deep/15 bg-gradient-to-br from-dolce-yellow-soft/60 via-white to-white p-4 sm:p-4.5 flex items-center gap-3.5 shadow-dolce-soft">
        <span className="shrink-0 h-10 w-10 rounded-2xl bg-white border border-dolce-blue-deep/15 flex items-center justify-center text-dolce-blue-deep">
          <Sparkles className="h-4 w-4" strokeWidth={2.1} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-dolce-blue-deep/55">
            Recettes offertes
          </p>
          <p className="text-sm font-bold text-dolce-blue-deep leading-tight mt-0.5">
            {remaining} recette{remaining > 1 ? 's' : ''} personnalisée{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          className={cn(
            'shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl',
            'bg-dolce-blue-deep text-dolce-yellow text-xs font-bold',
            'hover:opacity-90 transition-opacity'
          )}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Générer
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-dolce-blue-deep/15 bg-gradient-to-br from-white via-white to-dolce-yellow-soft/40 p-4 flex items-center gap-3.5 shadow-dolce-soft">
      <span className="shrink-0 h-10 w-10 rounded-2xl bg-dolce-blue-deep flex items-center justify-center text-dolce-yellow">
        <Crown className="h-4 w-4" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-dolce-blue-deep/55">
          Quota utilisé
        </p>
        <p className="text-sm font-bold text-dolce-blue-deep leading-tight mt-0.5">
          Passez Premium pour générer sans limite
        </p>
      </div>
      <button
        type="button"
        onClick={onUpgrade}
        className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-dolce-yellow text-dolce-blue-deep text-xs font-bold hover:opacity-90 transition-opacity"
      >
        <Crown className="h-3.5 w-3.5" />
        Premium
      </button>
    </div>
  )
}
 