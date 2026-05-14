import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Upload, FileText, ImageIcon, Loader2, CheckCircle2,
  X, AlertCircle, RotateCcw, Stethoscope,
} from 'lucide-react'
import { analyzeNutritionPhoto } from '@/api/vision'
import { cn } from '@/lib/utils'

// Valeurs nutritionnelles à afficher
const NUTRIENTS = [
  { key: 'kcal',    label: 'Calories',   unit: 'kcal', color: 'text-amber-600',   bg: 'bg-amber-50   border-amber-200' },
  { key: 'protein', label: 'Protéines',  unit: 'g',    color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  { key: 'carbs',   label: 'Glucides',   unit: 'g',    color: 'text-sky-600',     bg: 'bg-sky-50     border-sky-200' },
  { key: 'lipids',  label: 'Lipides',    unit: 'g',    color: 'text-rose-600',    bg: 'bg-rose-50    border-rose-200' },
  { key: 'fiber',   label: 'Fibres',     unit: 'g',    color: 'text-violet-600',  bg: 'bg-violet-50  border-violet-200' },
]

function NutrientBadge({ value, label, unit, color, bg }) {
  if (!value) return null
  return (
    <div className={cn('flex flex-col items-center px-3 py-2 rounded-xl border text-center min-w-[64px]', bg)}>
      <span className={cn('text-lg font-extrabold leading-tight', color)}>{value}</span>
      <span className={cn('text-[10px] font-medium', color)}>{unit}</span>
      <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
    </div>
  )
}

export default function MedicalPlanSection({ plan, onUpdate }) {
  const fileRef          = useRef(null)
  const [preview,        setPreview]        = useState(null)   // URL blob (images uniquement)
  const [isDragging,     setIsDragging]     = useState(false)

  // ── Lecture du fichier ──────────────────────────────────────
  const processFile = async (file) => {
    if (!file) return

    const isImage = file.type.startsWith('image/')
    const isPdf   = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

    if (!isImage && !isPdf) {
      onUpdate({ status: 'error', error: 'Format non supporté. Utilisez une image (JPG, PNG, WEBP) ou un PDF.' })
      return
    }

    // Aperçu image
    setPreview(isImage ? URL.createObjectURL(file) : null)

    // Lance l'analyse immédiatement
    onUpdate({ status: 'analyzing', fileName: file.name, isImage, isPdf })

    try {
      const data = await analyzeNutritionPhoto(file)
      onUpdate({
        status:     'done',
        fileName:   file.name,
        isImage,
        isPdf,
        kcal:       data.kcal    ?? null,
        protein:    data.protein ?? null,
        carbs:      data.carbs   ?? null,
        lipids:     data.lipids  ?? null,
        fiber:      data.fiber   ?? null,
        note:       data.note    ?? '',
        analyzedAt: new Date().toISOString(),
        error:      null,
      })
    } catch (err) {
      onUpdate({ status: 'error', fileName: file.name, error: err.message })
    }
  }

  const handleFileInput = (e) => processFile(e.target.files?.[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    processFile(e.dataTransfer.files?.[0])
  }

  const clear = () => {
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
    onUpdate(null)
  }

  // ── État : analyse en cours ─────────────────────────────────
  if (plan?.status === 'analyzing') {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Loader2 className="h-5 w-5 text-amber-600 animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800">Analyse IA en cours…</p>
            <p className="text-xs text-amber-600 truncate">{plan.fileName}</p>
          </div>
        </div>
        <div className="h-1.5 w-full bg-amber-100 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400 rounded-full animate-[slide_1.8s_ease-in-out_infinite] w-1/2" />
        </div>
        <p className="text-xs text-amber-600 text-center">
          Extraction des objectifs nutritionnels…
        </p>
      </div>
    )
  }

  // ── État : résultat ─────────────────────────────────────────
  if (plan?.status === 'done') {
    const hasAny = NUTRIENTS.some(n => plan[n.key])
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-4">
        {/* En-tête */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-800">Plan analysé avec succès</p>
              <p className="text-[11px] text-emerald-600 truncate max-w-[220px]">{plan.fileName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={clear}
            className="h-7 w-7 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-200 transition-colors shrink-0"
            title="Supprimer ce plan"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Valeurs extraites */}
        {hasAny && (
          <div className="flex flex-wrap gap-2">
            {NUTRIENTS.map(n => (
              <NutrientBadge key={n.key} value={plan[n.key]} {...n} />
            ))}
          </div>
        )}

        {/* Note de l'IA */}
        {plan.note && (
          <div className="rounded-xl bg-white/70 border border-emerald-100 px-3 py-2.5">
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              <span className="font-semibold">Note IA :</span> {plan.note}
            </p>
          </div>
        )}

        {/* Date d'analyse */}
        <p className="text-[10px] text-emerald-500 text-right">
          Analysé le {new Date(plan.analyzedAt).toLocaleDateString('fr', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>

        {/* Ré-analyser */}
        <button
          type="button"
          onClick={clear}
          className="w-full flex items-center justify-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-800 py-1 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Remplacer par un autre document
        </button>
      </div>
    )
  }

  // ── État : erreur ───────────────────────────────────────────
  if (plan?.status === 'error') {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-700">Analyse échouée</p>
              {plan.fileName && (
                <p className="text-[11px] text-red-500 truncate max-w-[220px]">{plan.fileName}</p>
              )}
            </div>
          </div>
          <button type="button" onClick={clear} className="h-7 w-7 rounded-full flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-red-700 leading-relaxed">{plan.error}</p>
        <label className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-dashed border-red-300 text-xs text-red-600 hover:bg-red-100 cursor-pointer transition-colors">
          <RotateCcw className="h-3.5 w-3.5" />
          Réessayer avec un autre fichier
          <input ref={fileRef} type="file" accept="image/*,.pdf,application/pdf" className="sr-only" onChange={handleFileInput} />
        </label>
      </div>
    )
  }

  // ── État : idle (zone de dépôt) ─────────────────────────────
  return (
    <div className="space-y-3">
      {/* Description */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50 border border-sky-100">
        <Stethoscope className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
        <p className="text-xs text-sky-700 leading-relaxed">
          Importez votre ordonnance diététique ou plan nutritionnel médical (PDF ou photo).
          L'IA extraira automatiquement les objectifs caloriques, protéines, glucides et lipides
          pour personnaliser toutes vos recettes générées.
        </p>
      </div>

      {/* Zone de dépôt */}
      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed cursor-pointer',
          'transition-all duration-200',
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-border/50 bg-muted/20 hover:border-primary/40 hover:bg-primary/3'
        )}
      >
        {/* Icônes de type */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
            <FileText className="h-6 w-6 text-red-400" />
          </div>
          <span className="text-muted-foreground/40 font-light text-lg">ou</span>
          <div className="h-12 w-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center">
            <ImageIcon className="h-6 w-6 text-sky-400" />
          </div>
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {isDragging ? 'Déposez le fichier ici' : 'Glissez votre document ici'}
          </p>
          <p className="text-xs text-muted-foreground">
            ou cliquez pour choisir un fichier
          </p>
          <p className="text-[11px] text-muted-foreground/60">
            PDF · JPG · PNG · WEBP — max 5 Mo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl pointer-events-none text-xs h-8"
          >
            <Upload className="h-3.5 w-3.5" />
            Choisir un fichier
          </Button>
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
            IA Vision
          </span>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf,application/pdf"
          className="sr-only"
          onChange={handleFileInput}
        />
      </label>

      {/* Exemples acceptés */}
      <div className="flex flex-wrap gap-1.5">
        {['Ordonnance diététique', 'Plan alimentaire', 'Tableau nutritionnel', 'Photo du plan'].map(ex => (
          <span key={ex} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
            {ex}
          </span>
        ))}
      </div>
    </div>
  )
}
