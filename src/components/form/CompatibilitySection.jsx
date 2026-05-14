import { Label } from '@/components/ui/label'
import TagInput from './TagInput'

/**
 * Saisie des combinaisons d'ingrédients autorisées et interdites.
 */
export default function CompatibilitySection({ compatibleCombinations, incompatibleCombinations, onAdd, onRemove }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Combinaisons autorisées</Label>
        <p className="text-xs text-muted-foreground">Ex : "poulet + citron", "tomate + basilic"</p>
        <TagInput
          tags={compatibleCombinations}
          onAdd={(val) => onAdd('compatibleCombinations', val)}
          onRemove={(i) => onRemove('compatibleCombinations', i)}
          placeholder="Saisir une combinaison..."
          chipVariant="neutral"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Combinaisons à éviter</Label>
        <p className="text-xs text-muted-foreground">Ex : "lait + agrumes", "poisson + crème"</p>
        <TagInput
          tags={incompatibleCombinations}
          onAdd={(val) => onAdd('incompatibleCombinations', val)}
          onRemove={(i) => onRemove('incompatibleCombinations', i)}
          placeholder="Saisir une combinaison..."
          chipVariant="warning"
        />
      </div>
    </div>
  )
}
