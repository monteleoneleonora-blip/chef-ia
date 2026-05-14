import { useState }          from 'react'
import { useCarnetStore }    from '@/store/useCarnetStore'
import { cn }                from '@/lib/utils'
import {
  Clock, Users, Flame, Euro, ChefHat, RefreshCw,
  ArrowLeft, BookOpen, CheckCircle, ShoppingBag,
  Zap, Leaf, Wallet, Layers,
} from 'lucide-react'

const BADGE_CONFIG = {
  '15min':         { label: '≤ 15 min',          icon: Clock,       color: 'bg-green-100 text-green-700'   },
  '30min':         { label: '≤ 30 min',           icon: Clock,       color: 'bg-green-100 text-green-700'   },
  '1-poele':       { label: 'Une seule poêle',    icon: Layers,      color: 'bg-blue-100 text-blue-700'     },
  'enfants':       { label: 'Enfant-friendly',    icon: null,        color: 'bg-pink-100 text-pink-700'     },
  'simple':        { label: 'Sans prise de tête', icon: null,        color: 'bg-sky-100 text-sky-700'       },
  'anti-gaspi':    { label: 'Anti-gaspi',         icon: Leaf,        color: 'bg-lime-100 text-lime-700'     },
  'economique':    { label: 'Petit budget',        icon: Wallet,      color: 'bg-emerald-100 text-emerald-700'},
  'peu-ingredients':{ label: 'Peu d\'ingrédients', icon: null,        color: 'bg-purple-100 text-purple-700' },
  'rapide':        { label: 'Rapide',             icon: Zap,         color: 'bg-yellow-100 text-yellow-700' },
  'familial':      { label: 'Familial',           icon: Users,       color: 'bg-orange-100 text-orange-700' },
  'gourmand':      { label: 'Gourmand',           icon: null,        color: 'bg-rose-100 text-rose-700'     },
  'leger':         { label: 'Léger',              icon: Leaf,        color: 'bg-teal-100 text-teal-700'     },
  'sans-cuisson':  { label: 'Sans cuisson',       icon: null,        color: 'bg-cyan-100 text-cyan-700'     },
}

function IngRow({ ing }) {
  return (
    <li className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0 text-sm text-gray-700">
      <span className={cn('h-2 w-2 rounded-full shrink-0', ing.available === false ? 'bg-red-400' : 'bg-emerald-400')} />
      <span className="flex-1">
        <b>{ing.quantity} {ing.unit}</b> {ing.name}
      </span>
      {ing.available === false && (
        <span className="text-xs text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">À acheter</span>
      )}
    </li>
  )
}

export default function AIRecipeResult({ recipe, loading, streamText, source, onRegenerate, onBack }) {
  const [tab, setTab] = useState('ingredients')
  const { addEntry, hasEntry } = useCarnetStore()
  const nom    = recipe?.nom ?? recipe?.name ?? ''
  const saved  = hasEntry(nom)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 gap-5">
        <div className="relative">
          <div className="h-14 w-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <ChefHat className="absolute inset-0 m-auto h-6 w-6 text-emerald-600" />
        </div>
        <p className="text-gray-600 font-medium text-center text-sm">Chef Privé prépare votre recette…</p>
        {streamText && (
          <div className="w-full max-w-md bg-gray-50 border border-gray-100 rounded-2xl p-4 font-mono text-xs text-gray-400 max-h-40 overflow-auto whitespace-pre-wrap">
            {streamText}
          </div>
        )}
      </div>
    )
  }

  if (!recipe) return null

  const manquants = recipe.manquants ?? []
  const badges    = (recipe.badges ?? []).filter(b => BADGE_CONFIG[b])

  return (
    <div className="max-w-2xl mx-auto space-y-5 py-6 px-4">

      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-100 p-5 shadow-sm">
        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {badges.map(b => {
              const cfg = BADGE_CONFIG[b]
              const Icon = cfg.icon
              return (
                <span key={b} className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold', cfg.color)}>
                  {Icon && <Icon className="h-3 w-3" />}
                  {cfg.label}
                </span>
              )
            })}
          </div>
        )}

        <h2 className="text-lg font-bold text-gray-900 leading-tight mb-1">{nom}</h2>
        {recipe.description && <p className="text-sm text-gray-500 italic mb-4">"{recipe.description}"</p>}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {recipe.prepTime && (
            <Stat icon={Clock} label="Préparation" value={recipe.prepTime} />
          )}
          {recipe.cookTime && (
            <Stat icon={Flame} label="Cuisson" value={recipe.cookTime} color="orange" />
          )}
          <Stat icon={Users} label="Personnes" value={recipe.servings} color="blue" />
          {recipe.coutParPersonne != null && (
            <Stat icon={Euro} label="Coût / pers." value={`${recipe.coutParPersonne.toFixed(2).replace('.', ',')} €`} color="green" />
          )}
        </div>

        {/* Manquants */}
        {manquants.length > 0 && (
          <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
            <ShoppingBag className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-red-700 mb-0.5">Ingrédients à acheter :</p>
              <p className="text-xs text-red-600">{manquants.join(', ')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Onglets */}
      <div className="flex border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
        {[
          { id: 'ingredients', label: 'Ingrédients' },
          { id: 'steps',       label: 'Étapes'       },
          { id: 'conseils',    label: 'Conseils'      },
        ].map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'flex-1 py-3 text-sm font-medium transition-colors',
              tab === t.id ? 'bg-emerald-500 text-white' : 'text-gray-500 hover:bg-gray-50'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenu onglet */}
      {tab === 'ingredients' && recipe.ingredients?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-50 flex items-center justify-between text-xs text-gray-400">
            <span className="font-semibold text-gray-600 text-sm">Ingrédients</span>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="h-2 w-2 bg-emerald-400 rounded-full" /> disponible</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 bg-red-400 rounded-full" /> à acheter</span>
            </span>
          </div>
          <ul className="px-4 py-2">
            {recipe.ingredients.map((ing, i) => <IngRow key={i} ing={ing} />)}
          </ul>
        </div>
      )}

      {tab === 'steps' && recipe.steps?.length > 0 && (
        <div className="space-y-3">
          {recipe.steps.map((step, i) => (
            <div key={i} className="flex gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="shrink-0 h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{step.replace(/^Étape \d+ ?:? ?/, '')}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'conseils' && (
        <div className="space-y-3">
          {recipe.chefTip && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
              <ChefHat className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-700 mb-1">Astuce du chef</p>
                <p className="text-sm text-amber-800">{recipe.chefTip}</p>
              </div>
            </div>
          )}
          {recipe.childNote && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-xs font-semibold text-blue-700 mb-1">Pour les enfants</p>
              <p className="text-sm text-blue-800">{recipe.childNote}</p>
            </div>
          )}
          {recipe.kcalPerPerson && (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-500 mb-1">Nutrition / personne</p>
              <div className="flex gap-4 text-sm text-gray-600">
                <span><b>{recipe.kcalPerPerson}</b> kcal</span>
                {recipe.proteinPerPerson && <span><b>{recipe.proteinPerPerson}g</b> prot.</span>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-3 rounded-2xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </button>
        )}
        <button
          type="button"
          onClick={() => addEntry(recipe, source)}
          disabled={saved}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors border',
            saved
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
              : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50'
          )}
        >
          {saved
            ? <><CheckCircle className="h-4 w-4" /> Sauvegardée</>
            : <><BookOpen className="h-4 w-4" /> Carnet</>
          }
        </button>
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            className="flex-1 py-3 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Regénérer
          </button>
        )}
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value, color }) {
  const colors = {
    orange: 'bg-orange-50 border-orange-100',
    blue:   'bg-blue-50 border-blue-100',
    green:  'bg-emerald-100 border-emerald-200',
  }
  return (
    <div className={cn('rounded-xl p-2.5 text-center border', color ? colors[color] : 'bg-white border-white')}>
      <Icon className={cn('h-4 w-4 mx-auto mb-1', color === 'green' ? 'text-emerald-600' : color === 'orange' ? 'text-orange-400' : color === 'blue' ? 'text-blue-400' : 'text-gray-400')} />
      <p className="text-xs text-gray-400">{label}</p>
      <p className={cn('text-sm font-bold', color === 'green' ? 'text-emerald-700' : 'text-gray-700')}>{value}</p>
    </div>
  )
}
