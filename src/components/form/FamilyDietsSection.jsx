import { useRef, useState, useEffect } from 'react'
import { Button }   from '@/components/ui/button'
import { Input }    from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { UserPlus, Trash2, User, Loader2, CheckCircle2, X, ScanLine, AlertCircle, Target, ChevronDown, Save, FolderOpen, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRESET_DIETS } from '@/constants/diets'
import { analyzeNutritionPhoto } from '@/api/vision'
import { useHouseholdStore } from '@/store/useHouseholdStore'

/** Couleurs cycliques pour chaque membre */
const MEMBER_COLORS = [
  { ring: 'ring-emerald-300', bg: 'bg-emerald-50',  icon: 'text-emerald-600', dot: 'bg-emerald-400' },
  { ring: 'ring-violet-300',  bg: 'bg-violet-50',   icon: 'text-violet-600',  dot: 'bg-violet-400'  },
  { ring: 'ring-amber-300',   bg: 'bg-amber-50',    icon: 'text-amber-600',   dot: 'bg-amber-400'   },
  { ring: 'ring-rose-300',    bg: 'bg-rose-50',     icon: 'text-rose-600',    dot: 'bg-rose-400'    },
  { ring: 'ring-sky-300',     bg: 'bg-sky-50',      icon: 'text-sky-600',     dot: 'bg-sky-400'     },
]

function getColor(index) {
  return MEMBER_COLORS[index % MEMBER_COLORS.length]
}

/** Upload + analyse du plan nutritionnel par membre */
function MemberNutritionUpload({ memberId, plan, onUpdatePlan }) {
  const fileRef    = useRef(null)
  const [preview,  setPreview]  = useState(null)
  const [error,    setError]    = useState(null)

  // Synchronise l'état local si le plan est réinitialisé depuis l'extérieur (ex: resetForm)
  useEffect(() => {
    if (!plan) {
      setPreview(null)
      setError(null)
      if (fileRef.current) fileRef.current.value = ''
    }
  }, [plan])

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const isImage = file.type.startsWith('image/')
    setPreview(isImage ? URL.createObjectURL(file) : null)
    setError(null)

    // Déclenche l'analyse immédiatement
    onUpdatePlan(memberId, { status: 'analyzing', fileName: file.name })
    try {
      const data = await analyzeNutritionPhoto(file)
      onUpdatePlan(memberId, {
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
      setError(err.message)
      onUpdatePlan(memberId, { status: 'error', fileName: file.name, error: err.message })
    }
  }

  const clearPlan = () => {
    setPreview(null)
    setError(null)
    if (fileRef.current) fileRef.current.value = ''
    onUpdatePlan(memberId, null)
  }

  // ── Etat : plan importé et analysé ──
  if (plan?.status === 'done') {
    return (
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold text-emerald-800">Plan importé</span>
          </div>
          <button type="button" onClick={clearPlan} className="h-5 w-5 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-200 transition-colors">
            <X className="h-3 w-3" />
          </button>
        </div>
        <p className="text-[10px] text-emerald-600 truncate">{plan.fileName}</p>
        <div className="flex gap-2.5 text-xs text-emerald-700">
          {plan.kcal    && <span><strong>{plan.kcal}</strong> kcal</span>}
          {plan.protein && <span><strong>{plan.protein}</strong>g prot.</span>}
          {plan.carbs   && <span><strong>{plan.carbs}</strong>g glucides</span>}
        </div>
        {plan.note && <p className="text-[10px] text-emerald-600 italic line-clamp-2">{plan.note}</p>}
      </div>
    )
  }

  // ── Etat : analyse en cours ──
  if (plan?.status === 'analyzing') {
    return (
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-2.5">
        <div className="flex items-center gap-2">
          <Loader2 className="h-3.5 w-3.5 text-amber-600 animate-spin shrink-0" />
          <span className="text-xs text-amber-700 font-medium">Analyse IA en cours…</span>
        </div>
        <p className="text-[10px] text-amber-600 mt-1 truncate">{plan.fileName}</p>
      </div>
    )
  }

  // ── Etat : erreur ──
  if (plan?.status === 'error') {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-2.5 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
            <span className="text-xs font-semibold text-red-700">Analyse échouée</span>
          </div>
          <button type="button" onClick={clearPlan} className="h-5 w-5 rounded-full flex items-center justify-center text-red-600 hover:bg-red-200 transition-colors">
            <X className="h-3 w-3" />
          </button>
        </div>
        <p className="text-[10px] text-red-600 line-clamp-2">{plan.error ?? error}</p>
        <label className="flex items-center gap-1.5 text-[10px] text-red-600 cursor-pointer underline hover:text-red-800">
          Réessayer
          <input ref={fileRef} type="file" accept="image/*,.pdf" className="sr-only" onChange={handleFile} />
        </label>
      </div>
    )
  }

  // ── Etat : idle (aucun plan) ──
  return (
    <div className="rounded-xl border border-dashed border-border/50 bg-white/50 overflow-hidden">
      <label className={cn(
        'flex items-center gap-2 px-3 py-2 cursor-pointer text-xs text-muted-foreground',
        'hover:text-foreground hover:bg-muted/30 transition-colors'
      )}>
        <ScanLine className="h-3.5 w-3.5 shrink-0 text-primary/60" />
        <span>Importer un plan nutritionnel</span>
        <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded-full">IA Vision</span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          className="sr-only"
          onChange={handleFile}
        />
      </label>
    </div>
  )
}

/** Objectifs nutritionnels compacts par membre (collapsible) */
function MemberNutritionTargets({ memberId, targets, onUpdate }) {
  const [open, setOpen] = useState(false)
  const t = targets ?? {}
  const hasValues = t.kcal || t.protein || t.carbs

  return (
    <div className="rounded-xl border border-dashed border-border/50 bg-white/50 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={cn(
          'flex items-center gap-2 w-full px-3 py-2 text-xs transition-colors',
          hasValues ? 'text-amber-700' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
        )}
      >
        <Target className={cn('h-3.5 w-3.5 shrink-0', hasValues ? 'text-amber-500' : 'text-primary/60')} />
        <span className="flex-1 text-left">
          {hasValues
            ? [t.kcal && `${t.kcal} kcal`, t.protein && `${t.protein}g prot.`, t.carbs && `${t.carbs}g glucides`].filter(Boolean).join(' · ')
            : 'Objectifs nutritionnels (optionnel)'
          }
        </span>
        {hasValues && <span className="text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">Défini</span>}
        <ChevronDown className={cn('h-3 w-3 transition-transform shrink-0', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="px-3 pb-3 border-t border-border/30 pt-2.5 space-y-2">
          <p className="text-[10px] text-muted-foreground">Par personne · par repas</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'kcal',    label: 'kcal',      placeholder: '500' },
              { key: 'protein', label: 'Protéines',  placeholder: '30g' },
              { key: 'carbs',   label: 'Glucides',   placeholder: '50g' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1">
                <label className="text-[10px] font-medium text-muted-foreground">{label}</label>
                <Input
                  type="number"
                  min="0"
                  placeholder={placeholder}
                  value={t[key] ?? ''}
                  onChange={(e) => onUpdate(memberId, key, e.target.value)}
                  className="h-7 text-xs px-2"
                />
              </div>
            ))}
          </div>
          {hasValues && (
            <button
              type="button"
              onClick={() => { onUpdate(memberId, 'kcal', ''); onUpdate(memberId, 'protein', ''); onUpdate(memberId, 'carbs', '') }}
              className="text-[10px] text-muted-foreground hover:text-destructive underline"
            >
              Effacer
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Gestion des régimes alimentaires par membre de la famille.
 * Chaque membre a son propre nom + ses propres régimes + son plan nutritionnel.
 */
export default function FamilyDietsSection({
  familyMembers,
  onAdd,
  onRemove,
  onUpdateName,
  onToggleDiet,
  onUpdateCustomDiet,
  onUpdateNutritionPlan,
  onUpdateNutritionTarget,
  onLoadMembers,
  hideSave = false,
}) {
  const { members: saved, savedAt, save, clear } = useHouseholdStore()
  const [justSaved, setJustSaved] = useState(false)

  const handleSave = () => {
    save(familyMembers)
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  const handleLoad = () => {
    if (saved && onLoadMembers) onLoadMembers(saved)
  }

  const savedDate = savedAt
    ? new Date(savedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className="space-y-3">

      {/* ── Barre de sauvegarde ── */}
      {!hideSave && <div className="rounded-xl border border-border/40 bg-muted/30 p-2.5 flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={handleSave}
          className={cn(
            'flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all',
            justSaved
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : 'bg-white border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
          )}
        >
          {justSaved
            ? <><CheckCircle2 className="h-3.5 w-3.5" /> Sauvegardé !</>
            : <><Save className="h-3.5 w-3.5" /> Sauvegarder le foyer</>
          }
        </button>

        {saved && (
          <>
            <button
              type="button"
              onClick={handleLoad}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border bg-white border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              Charger ({saved.length} membre{saved.length > 1 ? 's' : ''})
            </button>
            <button
              type="button"
              onClick={clear}
              className="flex items-center gap-1 text-[10px] text-muted-foreground/50 hover:text-destructive transition-colors ml-auto"
              title="Supprimer la sauvegarde"
            >
              <RotateCcw className="h-3 w-3" />
              Effacer
            </button>
          </>
        )}

        {saved && savedAt && (
          <span className="text-[10px] text-muted-foreground/50 w-full mt-0.5">
            Dernière sauvegarde : {savedDate}
          </span>
        )}
      </div>}

      {familyMembers.map((member, index) => {
        const color = getColor(index)
        const hasDiets = member.selectedDiets.length > 0 || member.customDiet.trim()
        const hasPlan  = !!member.nutritionPlan

        return (
          <div
            key={member.id}
            className={cn(
              'rounded-2xl border-2 p-3 space-y-3 transition-all',
              hasDiets || hasPlan ? `${color.ring} ${color.bg}` : 'border-border bg-card'
            )}
          >
            {/* En-tête du membre */}
            <div className="flex items-center gap-2">
              <div className={cn('h-7 w-7 rounded-full flex items-center justify-center shrink-0', color.bg, 'border', color.ring)}>
                <User className={cn('h-3.5 w-3.5', color.icon)} />
              </div>

              <Input
                value={member.name}
                onChange={(e) => onUpdateName(member.id, e.target.value)}
                placeholder={`Membre ${index + 1} (ex : Maman, Papa, Lila...)`}
                className="h-8 text-sm border-0 bg-transparent shadow-none focus-visible:ring-0 px-1 font-medium placeholder:font-normal"
              />

              {familyMembers.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onRemove(member.id)}
                  aria-label="Supprimer ce membre"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {/* Régimes présets */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_DIETS.map((diet) => {
                const active = member.selectedDiets.includes(diet)
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => onToggleDiet(member.id, diet)}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150',
                      active
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                    )}
                    aria-pressed={active}
                  >
                    {diet}
                  </button>
                )
              })}
            </div>

            {/* Régime personnalisé */}
            <Textarea
              value={member.customDiet}
              onChange={(e) => onUpdateCustomDiet(member.id, e.target.value)}
              placeholder="Régime personnalisé, intolérances spécifiques..."
              rows={2}
              className="text-xs resize-none bg-white/70 border-border/60"
            />

            {/* Objectifs nutritionnels */}
            {onUpdateNutritionTarget && (
              <MemberNutritionTargets
                memberId={member.id}
                targets={member.nutritionTargets}
                onUpdate={onUpdateNutritionTarget}
              />
            )}

            {/* Plan nutritionnel */}
            {onUpdateNutritionPlan && (
              <MemberNutritionUpload
                memberId={member.id}
                plan={member.nutritionPlan}
                onUpdatePlan={onUpdateNutritionPlan}
              />
            )}
          </div>
        )
      })}

      {/* Bouton ajouter un membre */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full border-dashed gap-2 text-muted-foreground hover:text-foreground"
        onClick={onAdd}
      >
        <UserPlus className="h-3.5 w-3.5" />
        Ajouter un membre
      </Button>
    </div>
  )
}
