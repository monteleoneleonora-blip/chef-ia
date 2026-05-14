import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const FIELDS = [
  { key: 'kcal',    label: 'Kcal / pers.',    unit: 'kcal', placeholder: '600' },
  { key: 'protein', label: 'Protéines / pers.', unit: 'g',   placeholder: '30'  },
  { key: 'carbs',   label: 'Féculents / pers.', unit: 'g',   placeholder: '60'  },
]

export default function NutritionTargets({ targets, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {FIELDS.map(({ key, label, unit, placeholder }) => (
        <div key={key} className="space-y-1">
          <Label htmlFor={`nutrition-${key}`} className="text-xs font-medium">
            {label}
          </Label>
          <div className="relative">
            <Input
              id={`nutrition-${key}`}
              type="number"
              min="0"
              placeholder={placeholder}
              value={targets[key] ?? ''}
              onChange={(e) => onChange(key, e.target.value)}
              className="h-8 text-sm pr-9 rounded-xl"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
              {unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
