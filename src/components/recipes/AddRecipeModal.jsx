import { useState } from 'react'
import { useRecipeBankStore } from '@/store/useRecipeBankStore'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Button }   from '@/components/ui/button'
import { Input }    from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, ChefHat } from 'lucide-react'
import { cn } from '@/lib/utils'

const EMPTY_INGREDIENT = { quantity: '', unit: '', name: '' }
const UNITS = ['g', 'kg', 'ml', 'cl', 'L', 'c. à s.', 'c. à c.', 'pincée', 'unité', '']

const INITIAL = {
  name:            '',
  type:            'dîner',
  cuisine:         '',
  difficulty:      'Facile',
  servings:        '4',
  prepTime:        '',
  cookTime:        '',
  kcalPerPerson:   '',
  proteinPerPerson:'',
  carbsPerPerson:  '',
  chefTip:         '',
  ingredients:     [{ ...EMPTY_INGREDIENT }],
  steps:           [''],
}

function FieldLabel({ children, required }) {
  return (
    <label className="text-xs font-semibold text-foreground/80">
      {children}{required && <span className="text-destructive ml-0.5">*</span>}
    </label>
  )
}

export default function AddRecipeModal({ open, onClose }) {
  const addManual = useRecipeBankStore(s => s.addManual)
  const [form, setForm]   = useState(INITIAL)
  const [errors, setErrors] = useState({})

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }))
  }

  // ── Ingrédients ──────────────────────────────────────────────
  const setIngredient = (i, key, value) =>
    setForm(prev => {
      const updated = [...prev.ingredients]
      updated[i] = { ...updated[i], [key]: value }
      return { ...prev, ingredients: updated }
    })

  const addIngredient = () =>
    setForm(prev => ({ ...prev, ingredients: [...prev.ingredients, { ...EMPTY_INGREDIENT }] }))

  const removeIngredient = (i) =>
    setForm(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, idx) => idx !== i) }))

  // ── Étapes ───────────────────────────────────────────────────
  const setStep = (i, value) =>
    setForm(prev => {
      const updated = [...prev.steps]
      updated[i] = value
      return { ...prev, steps: updated }
    })

  const addStep = () =>
    setForm(prev => ({ ...prev, steps: [...prev.steps, ''] }))

  const removeStep = (i) =>
    setForm(prev => ({ ...prev, steps: prev.steps.filter((_, idx) => idx !== i) }))

  // ── Validation & soumission ──────────────────────────────────
  const handleSubmit = () => {
    const errs = {}
    if (!form.name.trim())                                 errs.name        = 'Nom requis'
    if (form.ingredients.every(i => !i.name.trim()))       errs.ingredients = 'Au moins un ingrédient requis'
    if (form.steps.every(s => !s.trim()))                  errs.steps       = 'Au moins une étape requise'
    if (Object.keys(errs).length) return setErrors(errs)

    addManual({
      name:             form.name.trim(),
      type:             form.type,
      cuisine:          form.cuisine.trim() || 'Personnelle',
      imageQuery:       form.name.trim(),
      servings:         Number(form.servings) || 4,
      prepTime:         form.prepTime.trim() || null,
      cookTime:         form.cookTime.trim() || null,
      difficulty:       form.difficulty,
      kcalPerPerson:    form.kcalPerPerson    ? Number(form.kcalPerPerson)    : null,
      proteinPerPerson: form.proteinPerPerson ? Number(form.proteinPerPerson) : null,
      carbsPerPerson:   form.carbsPerPerson   ? Number(form.carbsPerPerson)   : null,
      diets:            [],
      ingredients:      form.ingredients.filter(i => i.name.trim()),
      steps:            form.steps.filter(s => s.trim()),
      chefTip:          form.chefTip.trim() || null,
      childNote:        null,
    })

    setForm(INITIAL)
    setErrors({})
    onClose()
  }

  const handleClose = () => {
    setForm(INITIAL)
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && handleClose()}>
      <DialogContent
        showCloseButton
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0"
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/40 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <ChefHat className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Ajouter une recette personnelle</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Créez et sauvegardez vos propres recettes</p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-6">

          {/* ── Infos générales ── */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Informations générales</h3>

            <div className="space-y-1">
              <FieldLabel required>Nom de la recette</FieldLabel>
              <Input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Ex : Tarte aux poireaux de mamie"
                className={cn(errors.name && 'border-destructive')}
              />
              {errors.name && <p className="text-[11px] text-destructive">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Type */}
              <div className="space-y-1">
                <FieldLabel required>Type de repas</FieldLabel>
                <div className="flex gap-1.5">
                  {[['petit-déjeuner','🥐'],['déjeuner','🥗'],['dîner','🍝']].map(([val, emoji]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => set('type', val)}
                      className={cn(
                        'flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg border text-xs font-medium transition-all',
                        form.type === val
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border text-muted-foreground hover:border-primary/40'
                      )}
                    >
                      <span className="text-base">{emoji}</span>
                      <span className="capitalize text-[10px]">{val === 'petit-déjeuner' ? 'Petit-déj' : val}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulté */}
              <div className="space-y-1">
                <FieldLabel>Difficulté</FieldLabel>
                <div className="flex gap-1.5">
                  {['Facile','Moyen','Difficile'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => set('difficulty', d)}
                      className={cn(
                        'flex-1 py-2 rounded-lg border text-xs font-medium transition-all',
                        form.difficulty === d
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-background border-border text-muted-foreground hover:border-amber-400/40'
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <FieldLabel>Cuisine</FieldLabel>
                <Input value={form.cuisine} onChange={e => set('cuisine', e.target.value)} placeholder="Française…" />
              </div>
              <div className="space-y-1">
                <FieldLabel>Personnes</FieldLabel>
                <Input type="number" min="1" max="20" value={form.servings} onChange={e => set('servings', e.target.value)} />
              </div>
              <div className="space-y-1">
                <FieldLabel>Prép.</FieldLabel>
                <Input value={form.prepTime} onChange={e => set('prepTime', e.target.value)} placeholder="15 min" />
              </div>
            </div>
          </section>

          {/* ── Ingrédients ── */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                Ingrédients <span className="text-destructive">*</span>
              </h3>
              <button type="button" onClick={addIngredient} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium">
                <Plus className="h-3.5 w-3.5" /> Ajouter
              </button>
            </div>
            {errors.ingredients && <p className="text-[11px] text-destructive">{errors.ingredients}</p>}

            <div className="space-y-2">
              {form.ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    type="text"
                    placeholder="Qté"
                    value={ing.quantity}
                    onChange={e => setIngredient(i, 'quantity', e.target.value)}
                    className="w-16 shrink-0 text-xs px-2"
                  />
                  <select
                    value={ing.unit}
                    onChange={e => setIngredient(i, 'unit', e.target.value)}
                    className="w-20 shrink-0 h-9 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {UNITS.map(u => <option key={u} value={u}>{u || '—'}</option>)}
                  </select>
                  <Input
                    placeholder="Ingrédient"
                    value={ing.name}
                    onChange={e => setIngredient(i, 'name', e.target.value)}
                    className="flex-1 text-xs"
                  />
                  {form.ingredients.length > 1 && (
                    <button type="button" onClick={() => removeIngredient(i)} className="text-muted-foreground/40 hover:text-destructive shrink-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Étapes ── */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                Étapes <span className="text-destructive">*</span>
              </h3>
              <button type="button" onClick={addStep} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium">
                <Plus className="h-3.5 w-3.5" /> Ajouter
              </button>
            </div>
            {errors.steps && <p className="text-[11px] text-destructive">{errors.steps}</p>}

            <div className="space-y-2">
              {form.steps.map((step, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="h-6 w-6 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center shrink-0 mt-1.5 font-semibold">
                    {i + 1}
                  </span>
                  <Textarea
                    value={step}
                    onChange={e => setStep(i, e.target.value)}
                    placeholder={`Étape ${i + 1}…`}
                    rows={2}
                    className="flex-1 text-xs resize-none"
                  />
                  {form.steps.length > 1 && (
                    <button type="button" onClick={() => removeStep(i)} className="text-muted-foreground/40 hover:text-destructive shrink-0 mt-2">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Optionnel ── */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Optionnel</h3>

            <div className="space-y-1">
              <FieldLabel>Astuce du chef</FieldLabel>
              <Textarea
                value={form.chefTip}
                onChange={e => set('chefTip', e.target.value)}
                placeholder="Un conseil pour sublimer ce plat…"
                rows={2}
                className="text-xs resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'kcalPerPerson',    label: 'kcal / pers.' },
                { key: 'proteinPerPerson', label: 'Protéines (g)' },
                { key: 'carbsPerPerson',   label: 'Glucides (g)' },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <FieldLabel>{label}</FieldLabel>
                  <Input
                    type="number"
                    min="0"
                    value={form[key]}
                    onChange={e => set(key, e.target.value)}
                    placeholder="—"
                    className="text-xs"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        <DialogFooter className="px-6">
          <Button variant="outline" onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <ChefHat className="h-4 w-4" />
            Enregistrer la recette
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
