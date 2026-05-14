import { usePromoStore } from '@/store/usePromoStore'
import { MAGASINS }      from '@/api/promoService'
import { cn }            from '@/lib/utils'
import { Users, Euro, UtensilsCrossed, Leaf } from 'lucide-react'

const MEAL_TYPES = [
  { id: 'petit-déjeuner', label: 'Petit-déj.' },
  { id: 'déjeuner',       label: 'Déjeuner'   },
  { id: 'dîner',          label: 'Dîner'       },
]

const DIETS = [
  { id: '',            label: 'Aucun' },
  { id: 'végétarien',  label: 'Végétarien' },
  { id: 'végétalien',  label: 'Végétalien' },
  { id: 'sans gluten', label: 'Sans gluten' },
  { id: 'sans lactose',label: 'Sans lactose' },
]

export default function StoreSelector({ onNext }) {
  const {
    magasin, setMagasin,
    budget, setBudget,
    nbPersonnes, setNbPersonnes,
    mealType, setMealType,
    diet, setDiet,
  } = usePromoStore()

  const selected = MAGASINS.find(m => m.id === magasin)

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-6 px-4">

      {/* Choix du magasin */}
      <section>
        <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="text-xl">🏪</span> Choisissez votre magasin
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MAGASINS.map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMagasin(m.id)}
              className={cn(
                'flex items-center gap-2.5 px-4 py-3 rounded-2xl border-2 text-sm font-medium transition-all duration-150',
                magasin === m.id
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm shadow-emerald-100'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <span className="text-xl leading-none">{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Paramètres */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
        <h2 className="text-base font-semibold text-gray-700 flex items-center gap-2">
          <span className="text-xl">⚙️</span> Paramètres du repas
        </h2>

        {/* Budget */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
            <Euro className="h-4 w-4 text-emerald-500" />
            Budget max par personne : <span className="text-emerald-700 font-bold">{budget} €</span>
          </label>
          <input
            type="range"
            min={3} max={30} step={1}
            value={budget}
            onChange={e => setBudget(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>3 €</span><span>30 €</span>
          </div>
        </div>

        {/* Nb personnes */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
            <Users className="h-4 w-4 text-emerald-500" />
            Nombre de personnes
          </label>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 8].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setNbPersonnes(n)}
                className={cn(
                  'h-9 w-9 rounded-xl text-sm font-semibold border transition-all duration-150',
                  nbPersonnes === n
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Type de repas */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
            <UtensilsCrossed className="h-4 w-4 text-emerald-500" />
            Type de repas
          </label>
          <div className="flex gap-2 flex-wrap">
            {MEAL_TYPES.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setMealType(t.id)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150',
                  mealType === t.id
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Régime */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
            <Leaf className="h-4 w-4 text-emerald-500" />
            Régime alimentaire
          </label>
          <div className="flex gap-2 flex-wrap">
            {DIETS.map(d => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDiet(d.id)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-sm font-medium border transition-all duration-150',
                  diet === d.id
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <button
        type="button"
        onClick={onNext}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-base shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 active:scale-[0.98] transition-all duration-200"
      >
        Voir les promos chez {selected?.label} →
      </button>
    </div>
  )
}
