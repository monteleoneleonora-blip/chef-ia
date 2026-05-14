import { usePromoStore } from '@/store/usePromoStore'
import { cn }            from '@/lib/utils'
import { CheckSquare, Square, Tag, ChefHat } from 'lucide-react'

const RAYON_EMOJI = {
  'Poissons':        '🐟',
  'Volailles':       '🍗',
  'Boucherie':       '🥩',
  'Fruits & Légumes':'🥦',
  'Épicerie':        '🛒',
  'Crèmerie':        '🧀',
  'Charcuterie':     '🥓',
  'Fromages':        '🧀',
  'Fruits exotiques':'🥭',
  'Fruits':          '🍓',
}

function PromoCard({ promo }) {
  const { selected, toggleSelected } = usePromoStore()
  const isSelected = selected.includes(promo.id)

  return (
    <button
      type="button"
      onClick={() => toggleSelected(promo.id)}
      className={cn(
        'relative text-left w-full rounded-2xl border-2 p-3.5 transition-all duration-150 cursor-pointer group',
        isSelected
          ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
          : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-gray-50'
      )}
    >
      {/* Checkbox */}
      <div className="absolute top-3 right-3">
        {isSelected
          ? <CheckSquare className="h-5 w-5 text-emerald-500" />
          : <Square className="h-5 w-5 text-gray-300 group-hover:text-gray-400" />
        }
      </div>

      {/* Rayon emoji */}
      <div className="text-2xl mb-2 leading-none">
        {RAYON_EMOJI[promo.rayon] ?? '🛍️'}
      </div>

      {/* Nom */}
      <p className="font-semibold text-gray-800 text-sm leading-snug pr-6 mb-1">
        {promo.nom}
      </p>

      {/* Rayon */}
      <p className="text-xs text-gray-400 mb-3">{promo.rayon}</p>

      {/* Prix */}
      <div className="flex items-end gap-2">
        <span className="text-emerald-700 font-bold text-base">
          {promo.prixPromo.toFixed(2).replace('.', ',')} €
        </span>
        <span className="text-gray-400 text-xs line-through">
          {promo.prixNormal.toFixed(2).replace('.', ',')} €
        </span>
        <span className="text-xs text-gray-500">/ {promo.unite}</span>
      </div>

      {/* Badge réduction */}
      <span className="absolute bottom-3 right-3 flex items-center gap-0.5 bg-red-100 text-red-600 rounded-full px-2 py-0.5 text-xs font-bold">
        <Tag className="h-3 w-3" />
        -{promo.reduction}%
      </span>
    </button>
  )
}

export default function PromoGrid({ onNext, onBack }) {
  const { promos, selected, selectAll, deselectAll, loading } = usePromoStore()

  const grouped = promos.reduce((acc, p) => {
    ;(acc[p.rayon] = acc[p.rayon] ?? []).push(p)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Chargement des promos…</p>
      </div>
    )
  }

  if (!promos.length) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-400 text-sm">Aucune promotion trouvée pour ce magasin.</p>
        <button type="button" onClick={onBack} className="mt-4 text-emerald-600 text-sm underline">
          Changer de magasin
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">

      {/* Barre d'actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-emerald-700">{selected.length}</span> produit{selected.length > 1 ? 's' : ''} sélectionné{selected.length > 1 ? 's' : ''}
          <span className="text-gray-400"> / {promos.length}</span>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="px-3 py-1.5 rounded-xl text-xs font-medium border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            Tout cocher
          </button>
          <button
            type="button"
            onClick={deselectAll}
            className="px-3 py-1.5 rounded-xl text-xs font-medium border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 transition-colors"
          >
            Tout décocher
          </button>
        </div>
      </div>

      {/* Grille par rayon */}
      {Object.entries(grouped).map(([rayon, items]) => (
        <section key={rayon}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>{RAYON_EMOJI[rayon] ?? '🛍️'}</span> {rayon}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {items.map(p => <PromoCard key={p.id} promo={p} />)}
          </div>
        </section>
      ))}

      {/* Actions bas de page */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          ← Retour
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={selected.length === 0}
          className={cn(
            'flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200',
            selected.length > 0
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-200 hover:shadow-lg active:scale-[0.98]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          )}
        >
          <ChefHat className="h-4 w-4" />
          Générer ma recette ({selected.length})
        </button>
      </div>
    </div>
  )
}
