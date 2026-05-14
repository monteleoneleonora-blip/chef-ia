import { useState }        from 'react'
import { useRedListStore } from '@/store/useRedListStore'
import RecipeCard  from '@/components/results/RecipeCard'
import RobotChef   from '@/components/mascot/RobotChef'
import { Button }  from '@/components/ui/button'
import { Ban, RotateCcw, Trash2 } from 'lucide-react'

export default function RejectedPage() {
  const { redList, remove, clear } = useRedListStore()
  const [confirmClear, setConfirmClear] = useState(false)

  if (redList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center px-6 animate-in slide-up">
        <div className="animate-bob">
          <RobotChef expression="happy" size="lg" />
        </div>
        <div className="space-y-2 max-w-sm">
          <p className="font-script text-3xl text-dolce-blue">Tout est bon !</p>
          <h2 className="font-display text-2xl font-bold">Aucune recette rejetée</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Quand vous cliquez sur 🚫 sur une recette, elle apparaît ici. Vous pouvez la restaurer à tout moment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-3xl bg-gradient-to-br from-dolce-terracotta to-dolce-rose flex items-center justify-center shadow-dolce-warm">
            <Ban className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-script text-2xl text-dolce-blue leading-none">À ne plus proposer</p>
            <h1 className="font-display text-2xl font-bold leading-tight">Recettes rejetées</h1>
            <p className="text-xs text-muted-foreground">
              {redList.length} recette{redList.length > 1 ? 's' : ''} — ne seront plus proposées à la génération
            </p>
          </div>
        </div>

        {!confirmClear ? (
          <Button variant="outline" size="sm" className="gap-1.5 rounded-2xl text-destructive border-destructive/20" onClick={() => setConfirmClear(true)}>
            <Trash2 className="h-3.5 w-3.5" /> Tout restaurer
          </Button>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Confirmer ?</span>
            <Button size="sm" variant="destructive" className="rounded-2xl h-8 text-xs"
              onClick={() => { clear(); setConfirmClear(false) }}>Oui</Button>
            <Button size="sm" variant="outline" className="rounded-2xl h-8 text-xs"
              onClick={() => setConfirmClear(false)}>Non</Button>
          </div>
        )}
      </div>

      <div className="mb-5 flex items-start gap-3 p-4 rounded-3xl bg-dolce-rose/15 border border-dolce-rose/40">
        <Ban className="h-4 w-4 text-dolce-terracotta shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/80">
          Ces recettes ne seront plus générées tant qu'elles sont dans cette liste. Cliquez sur{' '}
          <span className="font-bold">Restaurer</span> ou sur le bouton 🚫 de la carte pour les réactiver.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {redList.map(recipe => (
          <div key={recipe.name} className="relative animate-in slide-up-soft">
            <RecipeCard recipe={recipe} mealType={recipe.type} />

            <div className="absolute inset-x-0 bottom-0 p-3 flex justify-center">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 rounded-2xl bg-white/95 border-dolce-basil text-dolce-basil-deep hover:bg-dolce-basil/10 shadow-dolce-soft text-xs"
                onClick={() => remove(recipe.name)}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restaurer
              </Button>
            </div>

            <div className="absolute top-3 left-3 z-10">
              <span className="text-[10px] bg-black/60 text-white rounded-full px-2 py-0.5 backdrop-blur-sm">
                Rejeté le {new Date(recipe.addedAt).toLocaleDateString('fr', { day: '2-digit', month: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
