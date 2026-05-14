import { useState, useMemo } from 'react'
import { useFeedbackStore } from '@/store/useFeedbackStore'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import { Badge }  from '@/components/ui/badge'
import {
  BarChart2, Plus, Trash2, Zap, Wind, Smile, Droplets,
  Star, UtensilsCrossed, AlertTriangle, CheckCircle2,
  HelpCircle, Info, ChevronDown, ChevronUp, TrendingDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer, Legend,
} from 'recharts'

/* ── Données de référence ───────────────────────────────────── */

const MEAL_TYPES = ['petit-déjeuner', 'déjeuner', 'dîner']

const CUISINES = [
  'Française','Italienne','Méditerranéenne','Asiatique','Japonaise',
  'Indienne','Orientale','Mexicaine','Américaine','Espagnole','Africaine','Nordique',
]

const FOOD_GROUPS = [
  { key: 'Gluten',                emoji: '🌾', desc: 'Blé, pain, pâtes, semoule' },
  { key: 'Lactose',               emoji: '🥛', desc: 'Lait, fromage, yaourt, crème' },
  { key: 'Œufs',                  emoji: '🥚', desc: 'Œufs sous toutes formes' },
  { key: 'Fruits à coque',        emoji: '🥜', desc: 'Noix, amandes, noisettes, cajou' },
  { key: 'Légumineuses',          emoji: '🫘', desc: 'Lentilles, pois chiches, haricots' },
  { key: 'Viande rouge',          emoji: '🥩', desc: 'Bœuf, porc, agneau, veau' },
  { key: 'Poisson',               emoji: '🐟', desc: 'Poisson et fruits de mer' },
  { key: 'Solanacées',            emoji: '🍅', desc: 'Tomates, poivrons, aubergines' },
  { key: 'Alliacées',             emoji: '🧅', desc: 'Ail, oignon, poireau, échalote' },
  { key: 'Sucre raffiné',         emoji: '🍬', desc: 'Sucre blanc, sodas, confiseries' },
  { key: 'Café / Théine',         emoji: '☕', desc: 'Café, thé noir, sodas caféinés' },
  { key: 'Alcool',                emoji: '🍷', desc: 'Vin, bière, spiritueux' },
  { key: 'Soja',                  emoji: '🌱', desc: 'Tofu, lait de soja, edamame' },
  { key: 'Fructose / Fruits',     emoji: '🍑', desc: 'Fruits sucrés, jus de fruits' },
]

const SYMPTOM_LIST = [
  'Ballonnements', 'Fatigue post-repas', 'Maux de tête', 'Nausées',
  'Lourdeur digestive', 'Reflux gastrique', 'Douleurs abdominales',
  'Éruptions cutanées', 'Congestion nasale', 'Diarrhée',
  'Constipation', 'Somnolence intense',
]

const FEELINGS = [
  { key: 'energy',       label: 'Énergie',      icon: Zap,             color: '#f59e0b' },
  { key: 'digestion',    label: 'Digestion',    icon: Droplets,        color: '#06b6d4' },
  { key: 'satiety',      label: 'Satiété',      icon: Star,            color: '#8b5cf6' },
  { key: 'lightness',    label: 'Légèreté',     icon: Wind,            color: '#10b981' },
  { key: 'mood',         label: 'Humeur',       icon: Smile,           color: '#ec4899' },
  { key: 'satisfaction', label: 'Satisfaction', icon: UtensilsCrossed, color: '#f97316' },
]

/* ── Algorithme de détection d'intolérance ──────────────────── */

function avg(list, key) {
  if (!list?.length) return 0
  return +(list.reduce((s, e) => s + (Number(e[key]) || 0), 0) / list.length).toFixed(2)
}

function detectIntolerances(entries) {
  const grouped = {}
  entries.forEach(entry => {
    (entry.foodGroups ?? []).forEach(group => {
      if (!grouped[group]) grouped[group] = []
      grouped[group].push(entry)
    })
  })

  return Object.entries(grouped).map(([group, es]) => {
    const avgDigestion  = avg(es, 'digestion')
    const avgLightness  = avg(es, 'lightness')
    const avgEnergy     = avg(es, 'energy')
    const withSymptoms  = es.filter(e => e.symptoms?.length > 0)
    const symptomRate   = withSymptoms.length / es.length

    // Top symptômes
    const symCount = {}
    es.forEach(e => (e.symptoms ?? []).forEach(s => { symCount[s] = (symCount[s] || 0) + 1 }))
    const topSymptoms = Object.entries(symCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([s, n]) => ({ s, n }))

    // Score de risque composite
    const digestScore = (5 - avgDigestion) + (5 - avgLightness)
    const symScore    = symptomRate * 4
    const riskScore   = (digestScore + symScore) / 3

    let status
    if (es.length < 2) {
      status = 'insufficient'
    } else if (avgDigestion < 2.5 || avgLightness < 2.5 || symptomRate > 0.65) {
      status = 'alert'
    } else if (avgDigestion < 3.2 || avgLightness < 3.2 || symptomRate > 0.35) {
      status = 'warning'
    } else if (avgDigestion >= 3.8 && avgLightness >= 3.8 && symptomRate < 0.15) {
      status = 'good'
    } else {
      status = 'neutral'
    }

    const meta = FOOD_GROUPS.find(f => f.key === group) ?? { emoji: '🍽️', desc: '' }

    return {
      group, emoji: meta.emoji, desc: meta.desc,
      count: es.length, avgDigestion, avgLightness, avgEnergy,
      symptomRate, topSymptoms, status, riskScore,
    }
  }).sort((a, b) => {
    const order = { alert: 0, warning: 1, neutral: 2, good: 3, insufficient: 4 }
    return (order[a.status] ?? 5) - (order[b.status] ?? 5)
  })
}

/* ── Sous-composants UI ─────────────────────────────────────── */

function ScoreDots({ value, max = 5, color }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className="h-2 w-2 rounded-full transition-colors"
          style={{ backgroundColor: i < Math.round(value) ? color : '#e5e7eb' }}
        />
      ))}
    </div>
  )
}

const STATUS_CONFIG = {
  alert: {
    icon: AlertTriangle,
    label: 'Intolérance probable',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
    icon_color: 'text-red-500',
    tip: 'Digestion et/ou légèreté faibles et/ou symptômes fréquents. Envisagez une éviction temporaire de 3 semaines.',
  },
  warning: {
    icon: TrendingDown,
    label: 'Sensibilité possible',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    icon_color: 'text-amber-500',
    tip: 'Légère corrélation. Surveillez attentivement lors des prochains repas.',
  },
  neutral: {
    icon: Info,
    label: 'Résultats mitigés',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    badge: 'bg-slate-100 text-slate-600',
    icon_color: 'text-slate-400',
    tip: 'Pas de signal clair. Continuez à enregistrer pour affiner l\'analyse.',
  },
  good: {
    icon: CheckCircle2,
    label: 'Bien toléré',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    icon_color: 'text-emerald-500',
    tip: 'Cet aliment semble bien toléré par votre organisme.',
  },
  insufficient: {
    icon: HelpCircle,
    label: 'Données insuffisantes',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-500',
    icon_color: 'text-gray-400',
    tip: 'Enregistrez au moins 2 repas contenant cet aliment pour obtenir une analyse.',
  },
}

function IntoleranceCard({ item }) {
  const [open, setOpen] = useState(item.status === 'alert' || item.status === 'warning')
  const cfg = STATUS_CONFIG[item.status]
  const Icon = cfg.icon

  return (
    <div className={cn('rounded-2xl border overflow-hidden transition-all', cfg.bg, cfg.border)}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <span className="text-2xl shrink-0">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm">{item.group}</span>
            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', cfg.badge)}>
              {cfg.label}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">{item.count} repas · {item.desc}</p>
        </div>
        <Icon className={cn('h-4 w-4 shrink-0', cfg.icon_color)} />
        {open ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />}
      </button>

      {open && item.status !== 'insufficient' && (
        <div className="px-4 pb-4 space-y-3 border-t border-inherit pt-3">
          {/* Scores */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] text-muted-foreground mb-1">Digestion</p>
              <ScoreDots value={item.avgDigestion} color="#06b6d4" />
              <p className="text-xs font-bold mt-0.5">{item.avgDigestion}/5</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-1">Légèreté</p>
              <ScoreDots value={item.avgLightness} color="#10b981" />
              <p className="text-xs font-bold mt-0.5">{item.avgLightness}/5</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-1">Symptômes</p>
              <div className="h-2 bg-white/60 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round(item.symptomRate * 100)}%`,
                    backgroundColor: item.symptomRate > 0.5 ? '#ef4444' : item.symptomRate > 0.3 ? '#f59e0b' : '#10b981',
                  }}
                />
              </div>
              <p className="text-xs font-bold mt-0.5">{Math.round(item.symptomRate * 100)}% des repas</p>
            </div>
          </div>

          {/* Top symptômes */}
          {item.topSymptoms.length > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground mb-1.5">Symptômes fréquents</p>
              <div className="flex flex-wrap gap-1.5">
                {item.topSymptoms.map(({ s, n }) => (
                  <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-white/70 border border-inherit font-medium">
                    {s} <span className="opacity-60">×{n}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Conseil */}
          <div className="flex gap-2 p-2.5 rounded-xl bg-white/50 border border-inherit">
            <Icon className={cn('h-3.5 w-3.5 mt-0.5 shrink-0', cfg.icon_color)} />
            <p className="text-[11px] leading-relaxed text-foreground/70">{cfg.tip}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-4 flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-extrabold tabular-nums">{value}</p>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </div>
    </div>
  )
}

/* ── Formulaire de saisie ───────────────────────────────────── */

const EMPTY_FORM = {
  recipeName: '', mealType: 'déjeuner', cuisine: '',
  energy: 3, digestion: 3, satiety: 3, lightness: 3, mood: 3, satisfaction: 3,
  foodGroups: [], symptoms: [],
}

function StarRating({ value, onChange, color = '#f59e0b' }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="text-xl transition-transform hover:scale-110 active:scale-95 select-none"
          style={{ color: n <= value ? color : '#d1d5db' }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function ToggleChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
        active
          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
          : 'border-border text-muted-foreground hover:border-primary/40 bg-white'
      )}
    >
      {label}
    </button>
  )
}

function FeelingForm({ onClose }) {
  const addEntry = useFeedbackStore(s => s.addEntry)
  const [form, setForm]   = useState(EMPTY_FORM)
  const [step, setStep]   = useState(1) // 1 = infos, 2 = ressentis, 3 = aliments+symptômes

  const set     = (k, v)   => setForm(prev => ({ ...prev, [k]: v }))
  const toggle  = (k, val) => setForm(prev => ({
    ...prev,
    [k]: prev[k].includes(val) ? prev[k].filter(v => v !== val) : [...prev[k], val],
  }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.recipeName.trim()) return
    addEntry({ ...form, date: new Date().toISOString() })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Progress dots */}
      <div className="flex items-center gap-2">
        {[1,2,3].map(n => (
          <div key={n} className={cn('h-1.5 flex-1 rounded-full transition-colors', n <= step ? 'bg-primary' : 'bg-border')} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="font-bold">1 · Quel repas avez-vous fait ?</h3>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Nom de la recette</label>
            <Input
              placeholder="ex : Poulet rôti aux herbes"
              value={form.recipeName}
              onChange={e => set('recipeName', e.target.value)}
              required
              className="rounded-xl"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Type de repas</label>
            <div className="flex gap-2 flex-wrap">
              {MEAL_TYPES.map(t => (
                <ToggleChip key={t} label={t} active={form.mealType === t} onClick={() => set('mealType', t)} />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Cuisine</label>
            <select
              value={form.cuisine}
              onChange={e => set('cuisine', e.target.value)}
              className="w-full h-9 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">— Choisir (optionnel) —</option>
              {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Button
            type="button"
            className="w-full rounded-xl"
            disabled={!form.recipeName.trim()}
            onClick={() => setStep(2)}
          >
            Suivant →
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="font-bold">2 · Comment vous êtes-vous senti·e ?</h3>
          {FEELINGS.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 w-32 shrink-0">
                <Icon className="h-3.5 w-3.5 shrink-0" style={{ color }} />
                <span className="text-sm font-medium">{label}</span>
              </div>
              <StarRating value={form[key]} onChange={v => set(key, v)} color={color} />
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(1)}>← Retour</Button>
            <Button type="button" className="flex-1 rounded-xl" onClick={() => setStep(3)}>Suivant →</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="font-bold">3 · Ce que vous avez mangé</h3>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              Groupes alimentaires présents <span className="font-normal text-muted-foreground/60">(sélectionnez tout ce qui s'applique)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FOOD_GROUPS.map(({ key, emoji }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggle('foodGroups', key)}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all',
                    form.foodGroups.includes(key)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40 bg-white'
                  )}
                >
                  <span>{emoji}</span>
                  {key}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              Symptômes ressentis <span className="font-normal text-muted-foreground/60">(laissez vide si aucun)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SYMPTOM_LIST.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggle('symptoms', s)}
                  className={cn(
                    'px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all',
                    form.symptoms.includes(s)
                      ? 'bg-red-500 text-white border-red-500'
                      : 'border-border text-muted-foreground hover:border-red-300 bg-white'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(2)}>← Retour</Button>
            <Button type="submit" className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600">
              Enregistrer ✓
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}

/* ── Page principale ────────────────────────────────────────── */

export default function StatisticsPage() {
  const { entries, removeEntry } = useFeedbackStore()
  const [showForm, setShowForm]  = useState(false)

  const intolerances = useMemo(() => detectIntolerances(entries), [entries])
  const alerts       = intolerances.filter(i => i.status === 'alert' || i.status === 'warning')

  // Données pour les charts
  const radarData = FEELINGS.map(({ key, label }) => ({ subject: label, value: avg(entries, key) }))

  const byCuisine = useMemo(() => {
    const m = {}
    entries.forEach(e => {
      if (!e.cuisine) return
      if (!m[e.cuisine]) m[e.cuisine] = []
      m[e.cuisine].push(e)
    })
    return Object.entries(m)
      .map(([c, es]) => ({ c, énergie: avg(es, 'energy'), digestion: avg(es, 'digestion'), humeur: avg(es, 'mood') }))
      .sort((a, b) => b.énergie - a.énergie)
      .slice(0, 8)
  }, [entries])

  const lineData = useMemo(() =>
    [...entries]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30)
      .map(e => ({
        date:     new Date(e.date).toLocaleDateString('fr', { day: '2-digit', month: '2-digit' }),
        Énergie:  e.energy,
        Digestion:e.digestion,
        Légèreté: e.lightness,
      }))
  , [entries])

  const mealData = useMemo(() => {
    const m = {}
    entries.forEach(e => { if (!m[e.mealType]) m[e.mealType] = []; m[e.mealType].push(e) })
    return MEAL_TYPES.map(t => ({
      repas:     t,
      Énergie:   avg(m[t] ?? [], 'energy'),
      Digestion: avg(m[t] ?? [], 'digestion'),
      Légèreté:  avg(m[t] ?? [], 'lightness'),
    }))
  }, [entries])

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
            <BarChart2 className="h-4.5 w-4.5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold">Mes statistiques</h1>
            <p className="text-xs text-muted-foreground">{entries.length} repas · {intolerances.filter(i => i.status !== 'insufficient').length} aliments analysés</p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(s => !s)}
          className="gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600"
        >
          {showForm ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Fermer' : 'Enregistrer un repas'}
        </Button>
      </div>

      {/* ── Formulaire inline ── */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-border/60 shadow-md p-5">
          <FeelingForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {/* ── Alerte résumé si intolérances détectées ── */}
      {alerts.length > 0 && !showForm && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm text-red-800">
              {alerts.filter(a => a.status === 'alert').length > 0
                ? `${alerts.filter(a => a.status === 'alert').length} intolérance${alerts.filter(a => a.status === 'alert').length > 1 ? 's' : ''} probable${alerts.filter(a => a.status === 'alert').length > 1 ? 's' : ''} détectée${alerts.filter(a => a.status === 'alert').length > 1 ? 's' : ''}`
                : 'Sensibilités alimentaires détectées'}
            </p>
            <p className="text-xs text-red-700/80 mt-0.5">
              {alerts.map(a => a.group).join(', ')} — Consultez la section ci-dessous.
            </p>
          </div>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div className="h-24 w-24 rounded-3xl bg-violet-50 border border-violet-100 flex items-center justify-center shadow-inner">
            <span className="text-5xl">📊</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">Commencez à enregistrer vos repas</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">
              Enregistrez vos ressentis après chaque repas. L'IA détecte automatiquement les corrélations entre votre alimentation et votre bien-être.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center max-w-sm">
            {[['🌾','Gluten ?'],['🥛','Lactose ?'],['🥜','Fruits à coque ?']].map(([e, l]) => (
              <div key={l} className="py-3 px-2 rounded-2xl bg-white border border-border shadow-sm">
                <div className="text-2xl mb-1">{e}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* ── KPI ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={Zap}      label="Énergie moy."   value={`${avg(entries,'energy')}/5`}    sub={`${entries.length} repas`} color="#f59e0b" />
            <StatCard icon={Droplets} label="Digestion moy." value={`${avg(entries,'digestion')}/5`} sub="Bien digéré ≥ 4"  color="#06b6d4" />
            <StatCard icon={Wind}     label="Légèreté moy."  value={`${avg(entries,'lightness')}/5`} sub="Léger ≥ 4"        color="#10b981" />
            <StatCard icon={Smile}    label="Humeur moy."    value={`${avg(entries,'mood')}/5`}      sub="Bonne humeur ≥ 4" color="#ec4899" />
          </div>

          {/* ═══════════════════════════════════════════════════
              SECTION DÉTECTION D'INTOLÉRANCES
          ═══════════════════════════════════════════════════ */}
          {intolerances.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                </div>
                <h2 className="font-extrabold text-base">Détection d'intolérances</h2>
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground shrink-0">
                  Basé sur {entries.filter(e => e.foodGroups?.length > 0).length} repas avec aliments renseignés
                </span>
              </div>

              <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-3.5 text-xs text-amber-800 flex gap-2">
                <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <p>Ces résultats sont indicatifs et basés sur vos données personnelles. Consultez un professionnel de santé avant tout régime d'éviction.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {intolerances.map(item => (
                  <IntoleranceCard key={item.group} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* ── Charts ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Radar profil */}
            <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5">
              <h2 className="text-sm font-bold mb-4">Profil bien-être global</h2>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                  <Radar name="Moyenne" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Évolution */}
            <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5">
              <h2 className="text-sm font-bold mb-4">Évolution sur 30 repas</h2>
              {lineData.length < 2 ? (
                <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
                  Enregistrez au moins 2 repas pour voir l'évolution
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis domain={[1, 5]} tick={{ fontSize: 10 }} tickCount={5} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="Énergie"   stroke="#f59e0b" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Digestion" stroke="#06b6d4" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Légèreté"  stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Par cuisine */}
            {byCuisine.length > 0 && (
              <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5">
                <h2 className="text-sm font-bold mb-4">Bien-être par cuisine</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={byCuisine} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                    <XAxis type="number" domain={[0,5]} tick={{ fontSize: 10 }} />
                    <YAxis dataKey="c" type="category" width={90} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="énergie"   name="Énergie"   fill="#f59e0b" radius={[0,4,4,0]} barSize={8} />
                    <Bar dataKey="digestion" name="Digestion" fill="#06b6d4" radius={[0,4,4,0]} barSize={8} />
                    <Bar dataKey="humeur"    name="Humeur"    fill="#ec4899" radius={[0,4,4,0]} barSize={8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Par type de repas */}
            <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5">
              <h2 className="text-sm font-bold mb-4">Bien-être par type de repas</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={mealData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="repas" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0,5]} tick={{ fontSize: 10 }} tickCount={6} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Énergie"   fill="#f59e0b" radius={[4,4,0,0]} barSize={20} />
                  <Bar dataKey="Digestion" fill="#06b6d4" radius={[4,4,0,0]} barSize={20} />
                  <Bar dataKey="Légèreté"  fill="#10b981" radius={[4,4,0,0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Historique ── */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border/40 flex items-center justify-between">
              <h2 className="text-sm font-bold">Historique des repas</h2>
              <span className="text-xs text-muted-foreground">{entries.length} entrée{entries.length > 1 ? 's' : ''}</span>
            </div>
            <div className="divide-y divide-border/30 max-h-96 overflow-y-auto">
              {[...entries].map(entry => (
                <div key={entry.id} className="px-5 py-3 flex items-start gap-3">
                  <div className="shrink-0 w-14 text-center pt-0.5">
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('fr', { day: '2-digit', month: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{entry.recipeName}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{entry.mealType}</Badge>
                      {entry.cuisine && <span className="text-[10px] text-muted-foreground">{entry.cuisine}</span>}
                      {entry.symptoms?.length > 0 && (
                        <span className="text-[10px] text-red-600 font-medium">⚠ {entry.symptoms.slice(0,2).join(', ')}{entry.symptoms.length > 2 ? `…` : ''}</span>
                      )}
                    </div>
                    {entry.foodGroups?.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {entry.foodGroups.map(g => {
                          const meta = FOOD_GROUPS.find(f => f.key === g)
                          return <span key={g} title={g} className="text-base leading-none">{meta?.emoji ?? '🍽️'}</span>
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0 pt-0.5">
                    {FEELINGS.slice(0,4).map(({ key, color }) => (
                      <span key={key} className="text-xs font-bold tabular-nums" style={{ color }}>{entry[key]}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    className="shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
