import { useState } from 'react'
import { UtensilsCrossed, Baby, Carrot, Link2, Users, Cpu, Globe, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import MealConfig           from './MealConfig'
import ChildrenConfig       from './ChildrenConfig'
import IngredientsSection   from './IngredientsSection'
import CompatibilitySection from './CompatibilitySection'
import FamilyDietsSection   from './FamilyDietsSection'
import EquipmentSelector    from './EquipmentSelector'
import CuisineSelector      from './CuisineSelector'

const SECTIONS = [
  {
    id: 'meal', icon: UtensilsCrossed, title: 'Repas & foyer', defaultOpen: true,
    render: (p) => (
      <MealConfig
        mealCounts={p.formData.mealCounts}
        totalPeople={p.formData.totalPeople}
        onMealTypeCountChange={p.setMealTypeCount}
        onTotalPeopleChange={p.setTotalPeople}
      />
    ),
  },
  {
    id: 'cuisines', icon: Globe, title: 'Cuisines du monde', optional: true, defaultOpen: false,
    render: (p) => (
      <CuisineSelector selected={p.formData.cuisines} onToggle={p.toggleCuisine} />
    ),
  },
  {
    id: 'equipment', icon: Cpu, title: 'Équipements', optional: true, defaultOpen: false,
    render: (p) => (
      <EquipmentSelector selected={p.formData.equipment} onToggle={p.toggleEquipment} />
    ),
  },
  {
    id: 'ingredients', icon: Carrot, title: 'Ingrédients', optional: true, defaultOpen: false,
    render: (p) => (
      <IngredientsSection
        checkedIngredients={p.formData.checkedIngredients}
        customIngredients={p.formData.customIngredients}
        forbiddenIngredients={p.formData.forbiddenIngredients}
        onToggleIngredient={p.toggleIngredient}
        onCustomIngredientsChange={p.setCustomIngredients}
        onAddTag={p.addTag}
        onRemoveTag={p.removeTag}
      />
    ),
  },
  {
    id: 'children', icon: Baby, title: 'Enfants', defaultOpen: false,
    render: (p) => (
      <ChildrenConfig
        children={p.formData.children}
        onAdd={p.addChild}
        onRemove={p.removeChild}
        onUpdateAge={p.updateChildAge}
      />
    ),
  },
  {
    id: 'compatibility', icon: Link2, title: 'Associations', defaultOpen: false,
    render: (p) => (
      <CompatibilitySection
        compatibleCombinations={p.formData.compatibleCombinations}
        incompatibleCombinations={p.formData.incompatibleCombinations}
        onAdd={p.addTag}
        onRemove={p.removeTag}
      />
    ),
  },
  {
    id: 'diets', icon: Users, title: 'Régimes par membre', defaultOpen: false,
    render: (p) => (
      <FamilyDietsSection
        familyMembers={p.formData.familyMembers}
        onAdd={p.addFamilyMember}
        onRemove={p.removeFamilyMember}
        onUpdateName={p.updateMemberName}
        onToggleDiet={p.toggleMemberDiet}
        onUpdateCustomDiet={p.updateMemberCustomDiet}
        onUpdateNutritionPlan={p.updateMemberNutritionPlan}
        onUpdateNutritionTarget={p.updateMemberNutritionTarget}
        onLoadMembers={p.loadFamilyMembers}
      />
    ),
  },
]

function SectionAccordion({ section, props }) {
  const [open, setOpen] = useState(section.defaultOpen)
  const Icon    = section.icon
  const hasBadge = section.badge?.(props)

  return (
    <div className={cn(
      'rounded-2xl border bg-white shadow-sm overflow-hidden transition-all duration-200',
      open ? 'border-border/80' : 'border-border/40',
      hasBadge && !open && 'border-emerald-300'
    )}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={`section-${section.id}`}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={cn(
            'h-6 w-6 rounded-lg flex items-center justify-center transition-colors shrink-0',
            open ? 'bg-primary/15 text-primary' : hasBadge ? 'bg-emerald-100 text-emerald-600' : 'bg-muted text-muted-foreground'
          )}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex items-center gap-1.5 flex-wrap">
            <span className={cn(
              'text-sm font-semibold transition-colors',
              open ? 'text-foreground' : hasBadge ? 'text-emerald-700' : 'text-muted-foreground'
            )}>
              {section.title}
            </span>
            {section.optional && (
              <span className="text-[10px] font-medium text-muted-foreground/50 border border-border/40 rounded-full px-1.5 py-0 leading-4 shrink-0">
                optionnel
              </span>
            )}
            {section.subtitle && !open && (
              <p className="text-[10px] text-muted-foreground/60 truncate w-full">{section.subtitle}</p>
            )}
          </div>
          {hasBadge && (
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block shrink-0" title="Plan importé" />
          )}
        </div>
        <ChevronDown className={cn(
          'h-4 w-4 text-muted-foreground/60 transition-transform duration-200',
          open && 'rotate-180'
        )} />
      </button>
      {open && (
        <div id={`section-${section.id}`} className="px-4 pb-4 border-t border-border/30 pt-3">
          {section.render(props)}
        </div>
      )}
    </div>
  )
}

export default function RecipeForm(props) {
  return (
    <form
      className="flex flex-col gap-2.5"
      onSubmit={(e) => e.preventDefault()}
      noValidate
    >
      {SECTIONS.map(section => (
        <SectionAccordion key={section.id} section={section} props={props} />
      ))}
    </form>
  )
}
