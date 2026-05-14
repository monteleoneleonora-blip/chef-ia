
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { INGREDIENT_CATEGORIES } from '@/constants/ingredients'

/**
 * Checklist d'ingrédients organisée par catégorie (tabs)
 * + champ texte libre pour les autres ingrédients.
 */
export default function IngredientChecklist({
  checkedIngredients,
  customIngredients,
  onToggle,
  onCustomChange,
}) {
  return (
    <div className="space-y-4">
      <Tabs defaultValue={INGREDIENT_CATEGORIES[0].key}>
        {/* Barre d'onglets avec scroll horizontal */}
        <TabsList className="flex w-full h-auto flex-wrap gap-1 bg-muted/60 p-1 rounded-xl">
          {INGREDIENT_CATEGORIES.map(({ key, label, emoji }) => (
            <TabsTrigger
              key={key}
              value={key}
              className="flex-1 min-w-fit text-xs gap-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
            >
              <span>{emoji}</span>
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {INGREDIENT_CATEGORIES.map(({ key, items }) => (
          <TabsContent key={key} value={key} className="mt-3">
            <div className="flex flex-wrap gap-1.5">
              {items.map((ingredient) => {
                const selected = checkedIngredients.includes(ingredient)
                return (
                  <button
                    key={ingredient}
                    type="button"
                    onClick={() => onToggle(ingredient)}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 border',
                      selected
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                    )}
                  >
                    {ingredient}
                  </button>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Compteur d'ingrédients sélectionnés */}
      {checkedIngredients.length > 0 && (
        <p className="text-xs text-primary font-medium">
          {checkedIngredients.length} ingrédient{checkedIngredients.length > 1 ? 's' : ''} sélectionné{checkedIngredients.length > 1 ? 's' : ''}
          {' : '}{checkedIngredients.join(', ')}
        </p>
      )}

      {/* Autres ingrédients */}
      <div className="space-y-1.5">
        <Label htmlFor="custom-ingredients" className="text-xs text-muted-foreground uppercase tracking-wider">
          Autres ingrédients
        </Label>
        <Textarea
          id="custom-ingredients"
          value={customIngredients}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="Ex : farine de sarrasin, lait de coco, tahini... (séparés par des virgules)"
          rows={2}
          className="text-sm resize-none"
        />
      </div>
    </div>
  )
}
