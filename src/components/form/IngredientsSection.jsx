import { Label } from '@/components/ui/label'
import IngredientChecklist from './IngredientChecklist'
import TagInput from './TagInput'

/**
 * Section ingrédients : checklist par catégorie + interdits.
 */
export default function IngredientsSection({
  checkedIngredients,
  customIngredients,
  forbiddenIngredients,
  onToggleIngredient,
  onCustomIngredientsChange,
  onAddTag,
  onRemoveTag,
}) {
  return (
    <div className="space-y-5">
      {/* Ingrédients à privilégier */}
      <IngredientChecklist
        checkedIngredients={checkedIngredients}
        customIngredients={customIngredients}
        onToggle={onToggleIngredient}
        onCustomChange={onCustomIngredientsChange}
      />

      {/* Séparateur */}
      <div className="border-t" />

      {/* Ingrédients interdits */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Ingrédients interdits</Label>
        <p className="text-xs text-muted-foreground">Ne figureront jamais dans les recettes</p>
        <TagInput
          tags={forbiddenIngredients}
          onAdd={(val) => onAddTag('forbiddenIngredients', val)}
          onRemove={(i) => onRemoveTag('forbiddenIngredients', i)}
          placeholder="Ex : arachides, gluten, fruits de mer..."
          chipVariant="danger"
        />
      </div>
    </div>
  )
}
