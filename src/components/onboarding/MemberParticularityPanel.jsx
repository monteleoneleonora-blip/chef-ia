import { useRef, useState } from 'react'
import {
  X, Plus, ScanLine, Loader2, CheckCircle2, AlertCircle, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { FAMILY_DIETS } from '@/store/useFamilyStore'
import { analyzeNutritionPhoto } from '@/api/vision'

/**
 * MemberParticularityPanel — formulaire repliable détaillant la particularité
 * (régime / allergies / intolérances / objectifs nutritionnels / plan PDF)
 * d'un membre du foyer. S'affiche uniquement si l'utilisateur clique
 * « Ajouter une particularité » sur la carte du membre.
 *
 * Props :
 * - member          : objet membre {id, name, kind, age, particularity}
 * - onUpdate(patch) : applique un patch sur particularity
 * - onRemove()      : désactive la particularité (revient à null)
 */
export default function MemberParticularityPanel({ member, onUpdate, onRemove }) {
  const part = member.particularity
  if (!part) return null

  return (
    <div className="mt-3 rounded-2xl border border-dolce-blue-deep/15 bg-white/70 p-3 space-y-4 shadow-inner">

      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-dolce-blue-deep/70 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-dolce-yellow-deep" />
          Particularité de {member.name?.trim() || (member.kind === 'child' ? 'cet enfant' : 'cet adulte')}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="text-[11px] font-semibold text-muted-foreground hover:text-destructive underline"
        >
          Retirer
        </button>
      </div>

      {/* ── Régime particulier ── */}
      <Field label="Régime particulier">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {FAMILY_DIETS.map(d => {
            const active = part.diet === d
            return (
              <button
                key={d}
                type="button"
                onClick={() => onUpdate({ diet: active ? '' : d })}
                className={cn(
                  'inline-flex items-center h-7 px-2.5 rounded-full text-[11px] font-semibold border transition-all',
                  active
                    ? 'bg-dolce-blue-deep text-dolce-yellow border-dolce-blue-deep'
                    : 'border-dolce-blue-deep/15 text-dolce-blue-deep bg-white hover:bg-dolce-yellow-soft',
                )}
              >
                {d}
              </button>
            )
          })}
        </div>
        <input
          type="text"
          value={part.diet ?? ''}
          onChange={e => onUpdate({ diet: e.target.value })}
          placeholder="Autre régime (ex. FODMAP, paléo…)"
          className="w-full h-9 px-3 rounded-xl text-sm bg-white border border-dolce-blue-deep/15 focus:border-dolce-blue-deep/40 outline-none"
        />
      </Field>

      {/* ── Allergies ── */}
      <TagListField
        label="Allergies"
        placeholder="Ex. arachides, fruits de mer…"
        items={part.allergies ?? []}
        onChange={(items) => onUpdate({ allergies: items })}
      />

      {/* ── Intolérances ── */}
      <TagListField
        label="Intolérances"
        placeholder="Ex. lactose, gluten, histamine…"
        items={part.intolerances ?? []}
        onChange={(items) => onUpdate({ intolerances: items })}
      />

      {/* ── Objectifs nutritionnels par repas ── */}
      <Field label="Objectifs par repas">
        <div className="grid grid-cols-3 gap-2">
          <NumberField
            label="kcal"
            value={part.kcal}
            onChange={(v) => onUpdate({ kcal: v })}
            placeholder="500"
          />
          <NumberField
            label="Protéines (g)"
            value={part.protein}
            onChange={(v) => onUpdate({ protein: v })}
            placeholder="30"
          />
          <NumberField
            label="Féculent (g)"
            value={part.carbs}
            onChange={(v) => onUpdate({ carbs: v })}
            placeholder="50"
          />
        </div>
      </Field>

      {/* ── Plan nutritionnel médical (PDF / image) ── */}
      <NutritionPlanUpload
        plan={part.nutritionPlan}
        onUpdatePlan={(plan) => {
          // Si l'IA renvoie des valeurs, on pré-remplit les objectifs si vides
          if (plan?.status === 'done') {
            const patch = { nutritionPlan: plan }
            if (!part.kcal    && plan.kcal)    patch.kcal    = plan.kcal
            if (!part.protein && plan.protein) patch.protein = plan.protein
            if (!part.carbs   && plan.carbs)   patch.carbs   = plan.carbs
            onUpdate(patch)
          } else {
            onUpdate({ nutritionPlan: plan })
          }
        }}
      />
    </div>
  )
}

/* ─────────────── Sous-composants ─────────────── */

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-dolce-blue-deep/55">
        {label}
      </p>
      {children}
    </div>
  )
}

function NumberField({ label, value, onChange, placeholder }) {
  return (
    <label className="space-y-1 block">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <input
        type="number"
        min="0"
        inputMode="numeric"
        placeholder={placeholder}
        value={value ?? ''}
        onChange={e => {
          const raw = e.target.value
          onChange(raw === '' ? null : Number(raw))
        }}
        className="w-full h-9 px-2 rounded-xl text-sm bg-white border border-dolce-blue-deep/15 focus:border-dolce-blue-deep/40 outline-none"
      />
    </label>
  )
}

function TagListField({ label, placeholder, items, onChange }) {
  const [input, setInput] = useState('')

  const add = () => {
    const v = input.trim()
    if (!v) return
    if (items.includes(v)) return
    onChange([...items, v])
    setInput('')
  }
  const remove = (item) => onChange(items.filter(x => x !== item))

  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
          placeholder={placeholder}
          className="flex-1 h-9 px-3 rounded-xl text-sm bg-white border border-dolce-blue-deep/15 focus:border-dolce-blue-deep/40 outline-none"
        />
        <button
          type="button"
          onClick={add}
          className="h-9 px-3 rounded-xl bg-white border border-dolce-blue-deep/20 text-dolce-blue-deep text-xs font-semibold hover:bg-dolce-yellow-soft transition-colors inline-flex items-center gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Ajouter
        </button>
      </div>
      {items.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {items.map(item => (
            <span
              key={item}
              className="inline-flex items-center gap-1 h-6 px-2 rounded-full text-[11px] font-semibold bg-dolce-yellow-soft text-dolce-blue-deep border border-dolce-blue-deep/15"
            >
              {item}
              <button
                type="button"
                onClick={() => remove(item)}
                aria-label={`Retirer ${item}`}
                className="text-dolce-blue-deep/60 hover:text-dolce-blue-deep"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </Field>
  )
}

function NutritionPlanUpload({ plan, onUpdatePlan }) {
  const fileRef = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    onUpdatePlan({ status: 'analyzing', fileName: file.name })
    try {
      const data = await analyzeNutritionPhoto(file)
      onUpdatePlan({
        status:     'done',
        fileName:   file.name,
        kcal:       data.kcal    ?? null,
        protein:    data.protein ?? null,
        carbs:      data.carbs   ?? null,
        note:       data.note    ?? '',
        error:      null,
        analyzedAt: new Date().toISOString(),
      })
    } catch (err) {
      onUpdatePlan({ status: 'error', fileName: file.name, error: err?.message ?? 'Erreur inconnue' })
    }
  }

  const reset = () => {
    if (fileRef.current) fileRef.current.value = ''
    onUpdatePlan(null)
  }

  if (plan?.status === 'done') {
    return (
      <Field label="Plan nutritionnel médical">
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold text-emerald-800">Plan analysé par l'IA</span>
            </div>
            <button
              type="button"
              onClick={reset}
              className="h-5 w-5 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-200 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <p className="text-[10px] text-emerald-700 truncate">{plan.fileName}</p>
          <div className="flex flex-wrap gap-2.5 text-xs text-emerald-700">
            {plan.kcal    && <span><strong>{plan.kcal}</strong> kcal</span>}
            {plan.protein && <span><strong>{plan.protein}</strong> g prot.</span>}
            {plan.carbs   && <span><strong>{plan.carbs}</strong> g féculent</span>}
          </div>
          {plan.note && <p className="text-[10px] text-emerald-600 italic line-clamp-3">{plan.note}</p>}
        </div>
      </Field>
    )
  }

  if (plan?.status === 'analyzing') {
    return (
      <Field label="Plan nutritionnel médical">
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-2.5">
          <div className="flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 text-amber-600 animate-spin shrink-0" />
            <span className="text-xs text-amber-700 font-medium">Analyse IA en cours…</span>
          </div>
          <p className="text-[10px] text-amber-600 mt-1 truncate">{plan.fileName}</p>
        </div>
      </Field>
    )
  }

  if (plan?.status === 'error') {
    return (
      <Field label="Plan nutritionnel médical">
        <div className="rounded-xl bg-red-50 border border-red-200 p-2.5 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
              <span className="text-xs font-semibold text-red-700">Analyse échouée</span>
            </div>
            <button
              type="button"
              onClick={reset}
              className="h-5 w-5 rounded-full flex items-center justify-center text-red-600 hover:bg-red-200 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <p className="text-[10px] text-red-600 line-clamp-3">{plan.error}</p>
          <label className="flex items-center gap-1.5 text-[10px] text-red-700 cursor-pointer underline hover:text-red-900">
            Réessayer
            <input ref={fileRef} type="file" accept="image/*,.pdf" className="sr-only" onChange={handleFile} />
          </label>
        </div>
      </Field>
    )
  }

  return (
    <Field label="Plan nutritionnel médical (PDF / image)">
      <label className={cn(
        'flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed cursor-pointer text-xs',
        'border-dolce-blue-deep/25 bg-white text-dolce-blue-deep/80',
        'hover:bg-dolce-yellow-soft hover:border-dolce-blue-deep/40 transition-colors'
      )}>
        <ScanLine className="h-3.5 w-3.5 shrink-0 text-dolce-blue-deep/70" />
        <span className="flex-1">Importer un PDF émis par votre médecin</span>
        <span className="text-[10px] bg-dolce-blue-deep text-dolce-yellow px-1.5 py-0.5 rounded-full font-bold">IA Vision</span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          className="sr-only"
          onChange={handleFile}
        />
      </label>
      <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
        Le document est analysé localement pour extraire vos kcal/protéines/féculents par repas.
      </p>
    </Field>
  )
}
