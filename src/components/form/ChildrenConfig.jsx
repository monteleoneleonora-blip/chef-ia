import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import NumberStepper from './NumberStepper'

/**
 * Nombre d'enfants et saisie de leur âge individuel.
 */
export default function ChildrenConfig({ children, onAdd, onRemove, onUpdateAge }) {
  const count = children.length

  const handleCountChange = (newCount) => {
    if (newCount > count) onAdd()
    else if (newCount < count) onRemove(count - 1)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Nombre d'enfants</p>
          <p className="text-xs text-muted-foreground">Inclus dans le total</p>
        </div>
        <NumberStepper value={count} min={0} max={10} onChange={handleCountChange} />
      </div>

      {count > 0 && (
        <div className="mt-4 pt-4 border-t grid grid-cols-2 sm:grid-cols-3 gap-3">
          {children.map((child, index) => (
            <div key={index} className="space-y-1">
              <Label htmlFor={`child-age-${index}`} className="text-xs text-muted-foreground">
                Enfant {index + 1}
              </Label>
              <Input
                id={`child-age-${index}`}
                type="number"
                placeholder="Âge"
                min="0"
                max="17"
                value={child.age}
                onChange={(e) => onUpdateAge(index, e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
