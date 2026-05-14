import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Baby, Carrot, Link2, Users, Cpu, ChevronDown, SlidersHorizontal, Stethoscope } from 'lucide-react'
import ChildrenConfig       from './ChildrenConfig'
import IngredientsSection   from './IngredientsSection'
import CompatibilitySection from './CompatibilitySection'
import FamilyDietsSection   from './FamilyDietsSection'
import EquipmentSelector    from './EquipmentSelector'
import MedicalPlanSection   from './MedicalPlanSection'

/**
 * Panneau « Configuration avancée » dépliable, à utiliser sous le wizard.
 *
 * Expose les sections puissantes du formulaire qui n'entrent pas dans le wizard
 * 3 étapes : enfants, équipements, ingrédients détaillés (checklist + interdits),
 * associations compatibles/incompatibles, profils diététiques par membre, plan
 * médical global.
 *
 * Les props correspondent exactement à celles renvoyées par useRecipeForm().
 */
const SECTIONS = [
  {
    id: 'equipment', icon: Cpu, title: 'Équipements de cuisine',
    badge: (p) => (p.formData.equipment?.length ?? 0) > 0,
    render: (p) => (
      <EquipmentSelector
        selected={p.formData.equipment}
        onToggle={p.toggleEquipment}
      />
    ),
  },
  {
    id: 'ingredients', icon: Carrot, title: 'Ingrédients détaillés',
    badge: (p) =>
      (p.formData.checkedIngredients?.length ?? 0) > 0 ||
      (p.formData.customIngredients?.trim().length ?? 0) > 0 ||
      (p.formData.forbiddenIngredients?.length ?? 0) > 0,
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
    id: 'children', icon: Baby, title: 'Enfants',
    badge: (p) => (p.formData.children?.length ?? 0) > 0,
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
    id: 'compatibility', icon: Link2, title: 'Associations à favoriser / éviter',
    badge: (p) =>
      (p.formData.compatibleCombinations?.length ?? 0) > 0 ||
      (p.formData.incompatibleCombinations?.length ?? 0) > 0,
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
    id: 'diets', icon: Users, title: 'Profils diététiques par membre',
    badge: (p) =>
      (p.formData.familyMembers ?? []).some(
        m => m.selectedDiets?.length > 0 || m.customDiet?.trim() || m.nutritionPlan?.status === 'done'
      ),
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
  {
    id: 'medical', icon: Stethoscope, title: 'Plan nutritionnel médical (global)',
    badge: (p) => p.formData.medicalNutritionPlan?.status === 'done',
    render: (p) => (
      <MedicalPlanSection
        plan={p.formData.medicalNutritionPlan}
        onUpdate={p.updateMedicalNutritionPlan}
      />
    ),
  },
]

function Accordion({ section, props }) {
  const Icon       = section.icon
  const hasContent = section.badge?.(props)
  const [open, setOpen] = useState(hasContent)

  return (
    <div className={cn(
      'rounded-2xl border bg-white shadow-sm overflow-hidden transition-all duration-200',
      open ? 'border-border/80' : hasContent ? 'border-emerald-300' : 'border-border/40',
    )}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={`adv-${section.id}`}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={cn(
            'h-6 w-6 rounded-lg flex items-center justify-center transition-colors shrink-0',
            open ? 'bg-primary/15 text-primary' : hasContent ? 'bg-emerald-100 text-emerald-600' : 'bg-muted text-muted-foreground'
          )}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <span className={cn(
            'text-sm font-semibold transition-colors',
            open ? 'text-foreground' : hasContent ? 'text-emerald-700' : 'text-muted-foreground'
          )}>
            {section.title}
          </span>
          {hasContent && (
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block shrink-0" title="Configuré" />
          )}
        </div>
        <ChevronDown className={cn(
          'h-4 w-4 text-muted-foreground/60 transition-transform duration-200',
          open && 'rotate-180'
        )} />
      </button>
      {open && (
        <div id={`adv-${section.id}`} className="px-4 pb-4 border-t border-border/30 pt-3">
          {section.render(props)}
        </div>
      )}
    </div>
  )
}

export default function AdvancedPanel(props) {
  // Compte les sections non-vides pour le résumé du toggle
  const filledCount = SECTIONS.filter(s => s.badge?.(props)).length

  return (
    <div className="flex flex-col gap-2.5 mt-3">
      <div className="flex items-center gap-2 px-1">
        <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground/60" />
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
          Configuration avancée
        </p>
        {filledCount > 0 && (
          <span className="ml-auto text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
            {filledCount} active{filledCount > 1 ? 's' : ''}
          </span>
        )}
      </div>
      {SECTIONS.map(section => (
        <Accordion key={section.id} section={section} props={props} />
      ))}
    </div>
  )
}
