import { useState } from 'react'
import { Crown, Sparkles, Check, BookOpen, ChevronRight, Clock, Users, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import RobotChef         from '@/components/mascot/RobotChef'
import FamilyOnboarding  from '@/components/onboarding/FamilyOnboarding'

/**
 * LandingPage — premiere page d'entree de Chef IA.
 *
 * Structure optimisée pour la conversion :
 * 1. Hero centré — promesse affirmative immédiate
 * 2. Badge "3 recettes offertes" avant le CTA
 * 3. Preuve visuelle — exemple de recette générée
 * 4. Comparatif Free / Premium (après la preuve de valeur)
 */
export default function LandingPage({ onExplore, onPremium, onRegistered }) {
  const [showOnboarding, setShowOnboarding] = useState(false)

  return (
    <div className="fixed inset-0 z-[100] bg-background overflow-y-auto">

      {/* ────────────────── Header compact ──────────────────────────── */}
      <header className="sticky top-0 z-10 bg-background/85 backdrop-blur-md border-b border-dolce-blue-deep/10">
        <div className="max-w-[560px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 flex items-center justify-center shrink-0">
              <RobotChef expression="idle" size="xs" />
            </div>
            <span className="font-display text-base text-dolce-blue-deep tracking-tight uppercase truncate">
              Chef IA
            </span>
          </div>
          <button
            type="button"
            onClick={onPremium}
            className="inline-flex items-center gap-1 text-xs font-semibold text-dolce-blue-deep/70 hover:text-dolce-blue-deep transition-colors"
          >
            <Crown className="h-3.5 w-3.5" />
            Premium
          </button>
        </div>
      </header>

      {/* ────────────────── Contenu ─────────────────────────────────── */}
      <div className="mx-auto max-w-[560px] px-4 pt-8 pb-12 space-y-10">

        {/* ── Hero — centré, promesse affirmative ─────────────────── */}
        <section aria-labelledby="landing-title" className="text-center">

          {/* Mascotte + salutation empilées, centrées */}
          <div className="flex flex-col items-center gap-1 mb-5">
            <RobotChef expression="happy" size="lg" />
            <p className="font-script text-[32px] text-dolce-blue-deep leading-none mt-1">
              Buongiorno&nbsp;!
            </p>
          </div>

          {/* H1 — promesse affirmative */}
          <h1
            id="landing-title"
            className="font-display text-[28px] sm:text-[32px] text-dolce-blue-deep tracking-tight leading-tight"
          >
            Des repas faits pour votre famille,{' '}
            <span className="text-dolce-yellow-deep">en quelques secondes.</span>
          </h1>

          {/* Sous-titre — personnalisation progressive */}
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-[380px] mx-auto">
            Plus Chef IA connaît votre famille, mieux il adapte chaque suggestion
            à vos goûts, vos contraintes et votre quotidien.
          </p>

          {/* Badge offre gratuite — juste avant le CTA */}
          <div className="mt-6 inline-flex items-center gap-1.5 bg-dolce-yellow-soft border border-dolce-yellow-deep/30 rounded-full px-3 py-1">
            <Sparkles className="h-3 w-3 text-dolce-yellow-deep shrink-0" />
            <span className="text-[11px] font-bold text-dolce-blue-deep">
              3 recettes personnalisées offertes — sans CB
            </span>
          </div>

          {/* CTAs */}
          <div className="mt-3 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => setShowOnboarding(true)}
              className={cn(
                'inline-flex items-center justify-center gap-2 h-13 rounded-2xl px-6',
                'bg-dolce-blue-deep text-dolce-yellow text-sm font-bold tracking-wide',
                'shadow-[0_8px_22px_-12px_rgba(36,40,140,0.55)]',
                'hover:shadow-[0_12px_26px_-12px_rgba(36,40,140,0.65)] hover:-translate-y-px',
                'active:translate-y-0 transition-all',
              )}
            >
              <Sparkles className="h-4 w-4" />
              Commencer gratuitement
            </button>
            <button
              type="button"
              onClick={onExplore}
              className={cn(
                'inline-flex items-center justify-center gap-2 h-11 rounded-2xl px-4',
                'bg-white/85 backdrop-blur border border-dolce-blue-deep/20 text-dolce-blue-deep',
                'text-sm font-semibold hover:bg-white hover:border-dolce-blue-deep/40 transition-all',
              )}
            >
              <BookOpen className="h-4 w-4" />
              Explorer les recettes
            </button>
          </div>
        </section>

        {/* ── Preuve visuelle — exemple de recette IA ─────────────── */}
        <section aria-label="Exemple de recette générée">
          <p className="text-[10px] font-bold uppercase tracking-wider text-dolce-blue-deep/50 text-center mb-3">
            Exemple généré par Chef IA
          </p>
          <RecipeCard />
        </section>

        {/* ── Comparatif Free vs Premium ───────────────────────────── */}
        <section aria-labelledby="landing-compare">
          <div className="mb-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-dolce-blue-deep/50 mb-1">
              Découvrir, puis personnaliser
            </p>
            <h2
              id="landing-compare"
              className="font-display text-[20px] text-dolce-blue-deep tracking-tight leading-snug"
            >
              Gratuit pour découvrir.{' '}
              <br className="sm:hidden" />
              Premium pour tout personnaliser.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <PlanColumn
              title="Invité gratuit"
              tone="muted"
              features={[
                'Fiche famille simplifiée',
                '3 recettes personnalisées',
                'Banque de recettes complète',
                'Recherche & filtres',
                'Favoris & courses',
              ]}
            />
            <PlanColumn
              title="Premium"
              tone="primary"
              features={[
                'Recettes IA illimitées',
                'Fiche famille complète',
                'Mode Frigo, Express, Budget',
                'Transformer une recette',
                'Carnet & bien-être',
              ]}
              badge="4,99 €/mois"
            />
          </div>

          <button
            type="button"
            onClick={onPremium}
            className="mt-4 w-full text-center text-xs font-semibold text-dolce-blue-deep underline underline-offset-4 decoration-dolce-blue-deep/30 hover:decoration-dolce-blue-deep transition-colors"
          >
            Voir tous les avantages Premium
            <ChevronRight className="inline-block h-3.5 w-3.5 -mt-px" />
          </button>
        </section>

      </div>

      {/* Onboarding (overlay) */}
      {showOnboarding && (
        <FamilyOnboarding
          onClose={() => setShowOnboarding(false)}
          onComplete={() => {
            setShowOnboarding(false)
            onRegistered?.()
          }}
        />
      )}
    </div>
  )
}

/* ── Carte recette exemple ──────────────────────────────────────────── */
function RecipeCard() {
  return (
    <div className="rounded-3xl border border-dolce-blue-deep/10 bg-white overflow-hidden shadow-[0_4px_24px_-8px_rgba(36,40,140,0.10)]">
      {/* Bandeau coloré en lieu de photo */}
      <div className="h-28 bg-gradient-to-br from-dolce-yellow-soft via-dolce-yellow/60 to-dolce-yellow-deep/40 flex items-center justify-center relative">
        <span className="text-5xl select-none">🍝</span>
        <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur rounded-full px-2.5 py-0.5 text-[10px] font-bold text-dolce-blue-deep flex items-center gap-1">
          <Zap className="h-3 w-3 text-dolce-yellow-deep" />
          Généré par IA
        </span>
      </div>

      <div className="p-4">
        {/* Titre et meta */}
        <h3 className="font-display text-[16px] text-dolce-blue-deep leading-tight">
          Tagliatelles au citron & parmesan
        </h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Adapté à votre famille · Sans lactose possible
        </p>

        {/* Pills info */}
        <div className="flex items-center gap-2 mt-3">
          <Pill icon={<Clock className="h-3 w-3" />} label="20 min" />
          <Pill icon={<Users className="h-3 w-3" />} label="4 pers." />
          <Pill icon={<span className="text-[10px]">💶</span>} label="~8 €" />
        </div>

        {/* Ingrédients résumés */}
        <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed line-clamp-2">
          Tagliatelles fraîches · Citron bio · Parmesan · Crème légère · Basilic · Ail
        </p>

        {/* Nudge inscription */}
        <div className="mt-3 pt-3 border-t border-dolce-blue-deep/8 flex items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground">
            Personnalisée pour <span className="font-semibold text-dolce-blue-deep">votre famille</span>
          </p>
          <span className="text-[10px] font-bold text-dolce-yellow-deep bg-dolce-yellow-soft rounded-full px-2 py-0.5">
            Exemple gratuit
          </span>
        </div>
      </div>
    </div>
  )
}

function Pill({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 bg-dolce-blue-soft/60 rounded-full px-2.5 py-1 text-[11px] font-medium text-dolce-blue-deep">
      {icon}
      {label}
    </span>
  )
}

/* ── Colonne plan tarifaire ─────────────────────────────────────────── */
function PlanColumn({ title, tone, features, badge }) {
  const isPrimary = tone === 'primary'
  return (
    <div
      className={cn(
        'relative rounded-3xl p-4 border',
        isPrimary
          ? 'bg-dolce-blue-deep text-white border-dolce-blue-deep'
          : 'bg-white text-dolce-blue-deep border-dolce-blue-deep/15',
      )}
    >
      <div className="flex items-center gap-1.5">
        {isPrimary && <Crown className="h-3.5 w-3.5 text-dolce-yellow" />}
        {/* Contraste corrigé : opacité pleine sur fond sombre */}
        <p className={cn(
          'text-[10px] font-bold uppercase tracking-wider',
          isPrimary ? 'text-dolce-yellow' : 'text-dolce-blue-deep/55',
        )}>
          {title}
        </p>
      </div>
      {badge && (
        <p className={cn(
          'mt-1 text-[13px] font-bold',
          isPrimary ? 'text-dolce-yellow' : 'text-dolce-blue-deep',
        )}>
          {badge}
        </p>
      )}
      <ul className="mt-3 space-y-2">
        {features.map(f => (
          <li
            key={f}
            className={cn(
              'flex items-start gap-1.5 text-[12px] leading-snug',
              isPrimary ? 'text-white/90' : 'text-foreground',
            )}
          >
            <span className={cn(
              'mt-0.5 shrink-0 h-3.5 w-3.5 rounded-full flex items-center justify-center',
              isPrimary ? 'bg-dolce-yellow/25' : 'bg-dolce-yellow-soft border border-dolce-blue-deep/10',
            )}>
              <Check className={cn('h-2 w-2', isPrimary ? 'text-dolce-yellow' : 'text-dolce-blue-deep')} strokeWidth={4} />
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
