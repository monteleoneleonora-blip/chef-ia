import { AlertCircle, BookOpen, Crown, Sparkles, Clock } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import RecipeCard  from './RecipeCard'
import RobotChef   from '@/components/mascot/RobotChef'
import RobotBubble from '@/components/mascot/RobotBubble'
import { useSubscriptionStore } from '@/store/useSubscriptionStore'
import { cn } from '@/lib/utils'

const TYPE_META = {
  'petit-déjeuner': { emoji: '🥐', label: 'Petit-déjeuner' },
  'déjeuner':       { emoji: '🥗', label: 'Déjeuner' },
  'dîner':          { emoji: '🍝', label: 'Dîner' },
}

// ── Skeleton ──────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-3xl bg-white border-2 border-dolce-blue-deep/10 shadow-dolce-soft overflow-hidden animate-pulse">
      <div className="h-72 bg-dolce-yellow-soft/60" />
      <div className="h-1 bg-dolce-blue-deep/10" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          {[1,2,3].map(i => <div key={i} className="h-6 w-20 bg-dolce-yellow-soft/80 rounded-full" />)}
        </div>
        <div className="h-8 bg-dolce-yellow-soft/80 rounded-xl" />
        <div className="space-y-2 pt-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex justify-between">
              <div className="h-3 bg-dolce-yellow-soft/80 rounded-full w-2/3" />
              <div className="h-3 bg-dolce-yellow-soft/80 rounded-full w-1/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Compteur animé ────────────────────────────────────────────────
function CountBadge({ count }) {
  const isAI = useSubscriptionStore(s => s.canUseAI())
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-extrabold bg-dolce-blue-deep text-dolce-yellow shadow-dolce-warm">
      {isAI ? <Sparkles className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
      {count} recette{count > 1 ? 's' : ''} {isAI ? 'générée' : 'trouvée'}{count > 1 ? 's' : ''} !
    </div>
  )
}

export default function ResultsPanel({ recipes, isLoading, error, bankWarning }) {
  const isAI = useSubscriptionStore(s => s.canUseAI())

  /* ── Chargement ── */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-end gap-4 px-4 py-4 rounded-3xl bg-dolce-yellow-soft border-2 border-dolce-blue-deep/15 shadow-dolce-soft">
          <RobotChef expression="cooking" size="md" className="shrink-0" />
          <div className="pb-2 min-w-0">
            <p className="font-display text-base text-dolce-blue-deep">
              {isAI ? 'Je cuisine vos recettes…' : 'Je cherche dans la banque…'}
            </p>
            <p className="text-sm text-dolce-blue-deep/70 mt-0.5">
              {isAI
                ? 'Chaque recette est créée sur-mesure pour vous.'
                : 'Sélection des meilleures recettes correspondantes.'}
            </p>
            <div className="mt-3 flex gap-1.5">
              {['🥘', '🍳', '🥗', '🍝'].map((e, i) => (
                <span
                  key={i}
                  className="text-xl animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s`, animationDuration: '1s' }}
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  /* ── Erreur ── */
  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive" className="border-destructive/30 bg-destructive/5 rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Une erreur est survenue</AlertTitle>
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
        <RobotBubble
          expression="sad"
          size="sm"
          message="Désolé, quelque chose s'est mal passé. Vérifiez votre connexion et réessayez !"
          variant="warning"
        />
      </div>
    )
  }

  /* ── État initial ── */
  if (!recipes) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-8 text-center">
        <RobotBubble
          expression="happy"
          size="lg"
          animate
          message={
            <div className="space-y-1.5">
              <p className="font-bold text-sm">Bonjour ! Je suis votre Chef Privé 👋</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Retournez à la cuisine pour configurer vos repas, et je vous prépare des recettes parfaites !
              </p>
            </div>
          }
          variant="tip"
        />

        <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
          {[
            { emoji: '🥐', label: 'Petit-déj' },
            { emoji: '🥗', label: 'Déjeuner'  },
            { emoji: '🍝', label: 'Dîner'     },
          ].map(({ emoji, label }) => (
            <div key={label} className="relative overflow-hidden p-4 rounded-3xl text-dolce-blue-deep shadow-dolce-soft bg-gradient-to-br from-dolce-yellow to-dolce-yellow-deep border-2 border-dolce-blue-deep/15">
              <div className="text-3xl mb-1.5">{emoji}</div>
              <div className="text-xs font-extrabold">{label}</div>
              <div className="absolute -bottom-2 -right-2 text-5xl opacity-15">{emoji}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground/70 bg-white/70 border border-dolce-blue-deep/15 px-4 py-2 rounded-full">
          <Clock className="h-3.5 w-3.5" />
          {isAI ? 'Génération IA en 15–45 secondes' : 'Résultat instantané depuis la banque'}
        </div>
      </div>
    )
  }

  /* ── Aucune recette ── */
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <RobotBubble
          expression="thinking"
          size="md"
          message="Hmm… aucune recette ne correspond à vos critères. Essayez d'assouplir vos contraintes ou passez à Premium pour des recettes IA illimitées !"
          variant="warning"
        />
      </div>
    )
  }

  /* ── Résultats ── */
  const TYPE_ORDER = ['petit-déjeuner', 'déjeuner', 'dîner']
  const groups = recipes.reduce((acc, r) => {
    const t = r.type ?? 'Autre'
    if (!acc[t]) acc[t] = []
    acc[t].push(r)
    return acc
  }, {})
  const orderedKeys = [
    ...TYPE_ORDER.filter(k => groups[k]),
    ...Object.keys(groups).filter(k => !TYPE_ORDER.includes(k)),
  ]

  return (
    <div className="space-y-8">

      {/* ── Header résultats ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <RobotChef expression="excited" size="sm" />
          <div className="min-w-0">
            <CountBadge count={recipes.length} />
            <p className="text-xs text-muted-foreground mt-1.5">
              ❤️ Favoris · 🛒 Liste de courses · 🔇 Écouter
            </p>
          </div>
        </div>
      </div>

      {/* Avertissement banque partielle */}
      {bankWarning && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-3xl border-2 bg-dolce-yellow-soft border-dolce-yellow-deep/40 text-xs text-dolce-blue-deep">
          <BookOpen className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span className="leading-relaxed flex-1">{bankWarning}</span>
          <Crown className="h-3.5 w-3.5 shrink-0 text-dolce-yellow-deep mt-0.5" />
        </div>
      )}

      {/* ── Groupes par type de repas ── */}
      {orderedKeys.map(type => {
        const meta  = TYPE_META[type] ?? { emoji: '🍴', label: type }
        const group = groups[type]
        return (
          <section key={type} className="space-y-4">
            {/* Titre de section */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 pl-3 pr-4 py-2 rounded-2xl bg-dolce-blue-deep text-dolce-yellow text-sm font-extrabold uppercase tracking-wide shadow-dolce-soft">
                <span className="text-xl">{meta.emoji}</span>
                {meta.label}
                <span className="text-xs font-bold opacity-70 ml-1 normal-case tracking-normal">
                  · {group.length} recette{group.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="h-1 flex-1 rounded-full bg-dolce-blue-deep/15" />
            </div>

            {/* Grille */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {group.map((recipe, idx) => (
                <div
                  key={recipe.name}
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'both' }}
                >
                  <RecipeCard recipe={recipe} mealType={type} />
                </div>
              ))}
            </div>
          </section>
        )
      })}

      {/* Footer encouragement */}
      <div className="flex justify-center pt-4 pb-8">
        <RobotBubble
          expression="happy"
          size="sm"
          message="Bon appétit ! Ajoutez vos recettes préférées aux ❤️ favoris et pensez à la liste de courses 🛒"
          variant="tip"
          side="left"
        />
      </div>
    </div>
  )
}
