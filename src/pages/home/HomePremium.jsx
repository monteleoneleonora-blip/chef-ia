import { useMemo } from 'react'
import {
  Sparkles, ChevronRight, Refrigerator, Zap, Wallet,
  Shuffle, BarChart2, NotebookPen, Heart, BookOpen, ShoppingCart,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFavoritesStore }   from '@/store/useFavoritesStore'
import { useShoppingStore }    from '@/store/useShoppingStore'
import { useRecipeBankStore }  from '@/store/useRecipeBankStore'
import { useNavStore }         from '@/store/useNavStore'
import RobotChef           from '@/components/mascot/RobotChef'
import SearchIntentBar     from '@/components/home/SearchIntentBar'
import InspirationCarousel from '@/components/home/InspirationCarousel'

/**
 * HomePremium — version augmentee de la home culinaire, jamais un dashboard.
 *
 * - Hero ivoire compact "Buongiorno, chef"
 * - Zone d'intention de recherche (chips formuleees comme des envies)
 * - Carrousel "Vos modes Premium" : cartes compactes horizontales
 * - Inspirations editoriales (carrousel recettes)
 * - Section "Reprendre" : derniere recette, favoris, courses (mini-cartes)
 *
 * Aucun bandeau bleu, aucune grille SaaS : le rythme reste identique a la
 * HomeFree pour preserver l'identite Dolce Vita.
 */

const INTENT_CHIPS = [
  { id: 'frigo',     label: 'Avec mon frigo',     emoji: '🥦', target: { premium: 'frigo' }   },
  { id: 'express',   label: 'Moins de 30 min',    emoji: '⏱️', target: { premium: 'express' } },
  { id: 'budget',    label: 'Petit budget',       emoji: '💶', target: { premium: 'budget' }  },
  { id: 'leger',     label: 'Plus léger',         emoji: '🌿', target: { premium: 'transform' } },
  { id: 'enfants',   label: 'Pour les enfants',   emoji: '🧒', target: { page: 'generator' }  },
  { id: 'restes',    label: 'Avec les restes',    emoji: '🍲', target: { premium: 'frigo' }   },
]

const PREMIUM_MODES = [
  { id: 'frigo',     icon: Refrigerator, title: 'Frigo',     desc: 'Une idée avec ce que vous avez déjà.'      },
  { id: 'express',   icon: Zap,          title: 'Express',   desc: 'Un repas réaliste quand vous manquez de temps.' },
  { id: 'budget',    icon: Wallet,       title: 'Budget',    desc: 'Respectez votre enveloppe sans vous priver.' },
  { id: 'transform', icon: Shuffle,      title: 'Transform', desc: 'Adaptez une recette à votre envie.'         },
  { id: 'wellbeing', icon: BarChart2,    title: 'Bien-être', desc: 'Comprenez ce qui vous réussit.'             },
  { id: 'carnet',    icon: NotebookPen,  title: 'Carnet',    desc: 'Gardez vos meilleures créations.'           },
]

export default function HomePremium() {
  const goToPage    = useNavStore(s => s.goToPage)
  const goToPremium = useNavStore(s => s.goToPremium)
  const favorites   = useFavoritesStore(s => s.favorites)
  const cart        = useShoppingStore(s => s.selectedRecipes)
  const recipes     = useRecipeBankStore(s => s.recipes)

  const lastRecipe = recipes?.[0] ?? null
  const lastFav    = favorites?.[0] ?? null
  const cartCount  = cart?.length ?? 0
  const hasResume  = !!(lastRecipe || lastFav || cartCount > 0)

  const inspirations = useMemo(() => recipes.slice(0, 5), [recipes])

  const handleIntent = (chip) => {
    if (chip.target.premium) {
      goToPage('premium')
      goToPremium(chip.target.premium)
      return
    }
    if (chip.target.page) goToPage(chip.target.page)
  }

  const openMode = (mode) => {
    goToPage('premium')
    goToPremium(mode.id)
  }

  return (
    <div className="mx-auto px-4 pt-4 pb-6 space-y-7 max-w-[560px]">

      {/* ────────────────── 1 · Hero éditorial Premium ──────────────── */}
      <section aria-labelledby="home-premium-title">
        <div className="flex items-center gap-3.5">
          <div className="shrink-0">
            <RobotChef expression="idle" size="sm" />
          </div>
          <div className="min-w-0">
            <p className="font-script text-[28px] text-dolce-blue-deep leading-none">
              Bonjour, chef
            </p>
            <h1
              id="home-premium-title"
              className="font-display text-[22px] sm:text-[24px] text-dolce-blue-deep tracking-tight leading-tight mt-1"
            >
              Quelle envie aujourd'hui&nbsp;?
            </h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2.5 leading-relaxed">
          Dites-nous votre envie, votre temps ou ce qu'il vous reste&nbsp;: Chef Privé s'occupe du reste.
        </p>
      </section>

      {/* ────────────────── 2 · Intention + chips ───────────────────── */}
      <section aria-label="Intention de cuisine">
        <SearchIntentBar
          placeholder="Ex. : J'ai 20 minutes et des courgettes…"
          chips={INTENT_CHIPS}
          onSearch={() => goToPage('generator')}
          onChipClick={handleIntent}
        />
      </section>

      {/* ────────────────── 3 · Modes Premium ───────────────────────── */}
      <section aria-labelledby="home-modes-title">
        <SectionHeader
          id="home-modes-title"
          eyebrow="Vos modes Premium"
          title="Choisissez l'angle d'attaque"
        />

        <div
          role="list"
          aria-label="Modes Premium"
          className="flex items-stretch gap-2.5 overflow-x-auto -mx-4 px-4 pb-1 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {PREMIUM_MODES.map(mode => (
            <PremiumModeCard
              key={mode.id}
              mode={mode}
              onClick={() => openMode(mode)}
            />
          ))}
        </div>
      </section>

      {/* ────────────────── 4 · Reprendre ───────────────────────────── */}
      <section aria-labelledby="home-resume-title">
        <SectionHeader
          id="home-resume-title"
          eyebrow="Reprendre"
          title={hasResume ? 'Vos derniers passages' : 'Votre cuisine vous attend'}
        />

        {hasResume ? (
          <div className="space-y-2">
            {lastRecipe && (
              <ResumeRow
                eyebrow="Dernière recette"
                title={lastRecipe.name}
                icon={BookOpen}
                onClick={() => goToPage('bank')}
              />
            )}
            {lastFav && (
              <ResumeRow
                eyebrow="Favori récent"
                title={lastFav.name}
                icon={Heart}
                onClick={() => goToPage('favorites')}
              />
            )}
            {cartCount > 0 && (
              <ResumeRow
                eyebrow="Liste de courses"
                title={`${cartCount} recette${cartCount > 1 ? 's' : ''} sélectionnée${cartCount > 1 ? 's' : ''}`}
                icon={ShoppingCart}
                onClick={() => goToPage('shopping')}
              />
            )}
          </div>
        ) : (
          <EmptyResume onStart={() => goToPage('generator')} />
        )}
      </section>

      {/* ────────────────── 5 · Inspirations editoriales ───────────── */}
      <section aria-labelledby="home-inspiration-title" className="pt-1">
        <SectionHeader
          id="home-inspiration-title"
          eyebrow="Inspiration du moment"
          title="À piocher dans votre banque"
          ctaLabel="Tout voir"
          onCta={() => goToPage('bank')}
        />
        {inspirations.length > 0 ? (
          <InspirationCarousel
            recipes={inspirations}
            onSelect={() => goToPage('bank')}
          />
        ) : (
          <EmptyInspiration onStart={() => goToPage('generator')} />
        )}
      </section>
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

function PremiumModeCard({ mode, onClick }) {
  const Icon = mode.icon
  return (
    <button
      type="button"
      role="listitem"
      onClick={onClick}
      className={cn(
        'snap-start shrink-0 w-[180px] sm:w-[200px]',
        'rounded-2xl px-4 py-3.5 text-left',
        'bg-white/90 border border-dolce-blue-deep/10',
        'hover:bg-white hover:border-dolce-blue-deep/30 hover:-translate-y-0.5',
        'shadow-[0_4px_18px_-12px_rgba(36,40,140,0.18)]',
        'transition-all',
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="h-9 w-9 rounded-xl bg-dolce-yellow-soft border border-dolce-blue-deep/10 flex items-center justify-center text-dolce-blue-deep">
          <Icon className="h-4 w-4" strokeWidth={2.1} />
        </span>
        <p className="text-[14px] font-bold text-dolce-blue-deep leading-tight">
          {mode.title}
        </p>
      </div>
      <p className="text-[11px] text-muted-foreground leading-snug">
        {mode.desc}
      </p>
    </button>
  )
}

function ResumeRow({ eyebrow, title, icon: Icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left',
        'bg-white/85 border border-dolce-blue-deep/10',
        'hover:bg-white hover:border-dolce-blue-deep/25 transition-colors',
      )}
    >
      <span className="shrink-0 h-9 w-9 rounded-xl bg-dolce-yellow-soft text-dolce-blue-deep flex items-center justify-center">
        <Icon className="h-4 w-4" strokeWidth={2.1} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-dolce-blue-deep/55">
          {eyebrow}
        </p>
        <p className="text-[13px] font-semibold text-foreground leading-tight truncate mt-0.5">
          {title}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 text-dolce-blue-deep/25 group-hover:text-dolce-blue-deep/60 group-hover:translate-x-0.5 transition-all" />
    </button>
  )
}

function EmptyInspiration({ onStart }) {
  return (
    <div className="rounded-3xl border border-dashed border-dolce-blue-deep/15 bg-white/70 px-5 py-7 text-center">
      <p className="font-script text-2xl text-dolce-blue-deep mb-1">la banque arrive</p>
      <p className="text-xs text-muted-foreground mb-3">
        Lancez la première génération pour remplir vos inspirations.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-bold bg-dolce-blue-deep text-dolce-yellow hover:shadow-[0_8px_18px_-10px_rgba(36,40,140,0.5)] transition-shadow"
      >
        <Sparkles className="h-3 w-3" />
        Démarrer une recette
      </button>
    </div>
  )
}

function EmptyResume({ onStart }) {
  return (
    <div className="rounded-3xl border border-dashed border-dolce-blue-deep/15 bg-white/70 px-5 py-7 text-center">
      <p className="font-script text-2xl text-dolce-blue-deep mb-1">la cucina vi aspetta</p>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
        Vos favoris, listes et dernières recettes apparaîtront ici dès la prochaine séance.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-bold bg-dolce-blue-deep text-dolce-yellow hover:shadow-[0_8px_18px_-10px_rgba(36,40,140,0.5)] transition-shadow"
      >
        <Sparkles className="h-3 w-3" />
        Commencer
      </button>
    </div>
  )
}
