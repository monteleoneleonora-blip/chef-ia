import { useState } from 'react'
import { usePromoStore }    from '@/store/usePromoStore'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import { cn }               from '@/lib/utils'
import {
  Clock, Users, Flame, Euro, Tag, Lightbulb, RefreshCw,
  Heart, ChefHat, Star, ArrowLeft, Sparkles,
} from 'lucide-react'

function Badge({ children, className }) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold', className)}>
      {children}
    </span>
  )
}

function IngredientRow({ ing }) {
  return (
    <li className={cn(
      'flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0',
    )}>
      {ing.enPromo && (
        <span className="mt-0.5 flex-shrink-0">
          <Tag className="h-3.5 w-3.5 text-orange-500" />
        </span>
      )}
      {!ing.enPromo && <span className="w-3.5 flex-shrink-0" />}
      <span className="text-sm text-gray-700 flex-1">
        <span className={cn('font-medium', ing.enPromo && 'text-orange-700')}>
          {ing.quantity} {ing.unit}
        </span>
        {' '}{ing.name}
        {ing.enPromo && (
          <Badge className="ml-2 bg-orange-100 text-orange-700">promo</Badge>
        )}
      </span>
      {ing.prixEstime != null && (
        <span className="text-xs text-gray-400 flex-shrink-0">
          ≈ {ing.prixEstime.toFixed(2).replace('.', ',')} €
        </span>
      )}
    </li>
  )
}

export default function PromoRecipeCard({ onRegenerate, onBack }) {
  const recipe  = usePromoStore(s => s.recipe)
  const loading = usePromoStore(s => s.loading)
  const streamText = usePromoStore(s => s.streamText)
  const { add, remove, isFavorite } = useFavoritesStore()
  const [activeTab, setActiveTab] = useState('ingredients')

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 px-4">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <ChefHat className="absolute inset-0 m-auto h-7 w-7 text-emerald-600" />
        </div>
        <p className="text-gray-600 font-medium text-center">Chef Privé cuisine votre recette…</p>
        {streamText && (
          <div className="max-w-lg w-full bg-gray-50 rounded-xl border border-gray-100 p-4 font-mono text-xs text-gray-500 overflow-auto max-h-48 whitespace-pre-wrap">
            {streamText}
          </div>
        )}
      </div>
    )
  }

  if (!recipe) return null

  // Recette normalisée par @/api/promoRecipeAI → champ canonique `name`
  const fav = isFavorite?.(recipe.name)
  const toggleFav = () => fav ? remove(recipe.name) : add(recipe)

  const promoCount = recipe.ingredients?.filter(i => i.enPromo).length ?? 0

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">

      {/* Header carte */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-100 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className="bg-emerald-100 text-emerald-700">
                <Sparkles className="h-3 w-3" /> IA
              </Badge>
              <Badge className="bg-orange-100 text-orange-700">
                <Tag className="h-3 w-3" /> {promoCount} produit{promoCount > 1 ? 's' : ''} en promo
              </Badge>
              {recipe.difficulty && (
                <Badge className="bg-gray-100 text-gray-600">{recipe.difficulty}</Badge>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{recipe.name}</h2>
            {recipe.description && (
              <p className="text-sm text-gray-500 mt-1 italic">"{recipe.description}"</p>
            )}
          </div>
          <button
            type="button"
            onClick={toggleFav}
            className={cn(
              'p-2.5 rounded-2xl border-2 transition-all duration-200',
              fav
                ? 'border-rose-300 bg-rose-50 text-rose-500'
                : 'border-gray-200 bg-white text-gray-400 hover:border-rose-200 hover:text-rose-400'
            )}
            title={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart className={cn('h-5 w-5', fav && 'fill-current')} />
          </button>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {recipe.prepTime && (
            <div className="bg-white rounded-xl p-2.5 text-center border border-white">
              <Clock className="h-4 w-4 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">Préparation</p>
              <p className="text-sm font-bold text-gray-700">{recipe.prepTime}</p>
            </div>
          )}
          {recipe.cookTime && (
            <div className="bg-white rounded-xl p-2.5 text-center border border-white">
              <Flame className="h-4 w-4 text-orange-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">Cuisson</p>
              <p className="text-sm font-bold text-gray-700">{recipe.cookTime}</p>
            </div>
          )}
          <div className="bg-white rounded-xl p-2.5 text-center border border-white">
            <Users className="h-4 w-4 text-blue-400 mx-auto mb-1" />
            <p className="text-xs text-gray-400">Personnes</p>
            <p className="text-sm font-bold text-gray-700">{recipe.servings}</p>
          </div>
          {recipe.coutParPersonne != null && (
            <div className="bg-emerald-100 rounded-xl p-2.5 text-center border border-emerald-200">
              <Euro className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
              <p className="text-xs text-emerald-600">Coût / pers.</p>
              <p className="text-sm font-bold text-emerald-700">
                {recipe.coutParPersonne.toFixed(2).replace('.', ',')} €
              </p>
            </div>
          )}
        </div>

        {/* Économie réalisée */}
        {recipe.economieRealisee > 0 && (
          <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
            <Star className="h-4 w-4 text-green-600 shrink-0" />
            <p className="text-sm text-green-700">
              Économie réalisée grâce aux promos :{' '}
              <span className="font-bold">{recipe.economieRealisee.toFixed(2).replace('.', ',')} €</span>
            </p>
          </div>
        )}
      </div>

      {/* Onglets */}
      <div className="flex border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
        {[
          { id: 'ingredients', label: 'Ingrédients' },
          { id: 'steps',       label: 'Étapes'       },
          { id: 'conseils',    label: 'Conseils'      },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 py-3 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-emerald-500 text-white'
                : 'text-gray-500 hover:bg-gray-50'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu onglet */}
      {activeTab === 'ingredients' && recipe.ingredients && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Ingrédients</h3>
            <p className="text-xs text-gray-400">
              <Tag className="h-3 w-3 inline mr-0.5 text-orange-500" />
              = produit en promotion
            </p>
          </div>
          <ul className="px-4 py-2">
            {recipe.ingredients.map((ing, i) => (
              <IngredientRow key={i} ing={ing} />
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'steps' && recipe.steps && (
        <div className="space-y-3">
          {recipe.steps.map((step, i) => (
            <div key={i} className="flex gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{step.replace(/^Étape \d+ ?:? ?/, '')}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'conseils' && (
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
          {recipe.conseilBudget && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex gap-3">
              <Lightbulb className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-green-700 mb-1">Conseil budget</p>
                <p className="text-sm text-green-800">{recipe.conseilBudget}</p>
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
                {recipe.proteinPerPerson && <span><b>{recipe.proteinPerPerson}g</b> protéines</span>}
                {recipe.carbsPerPerson && <span><b>{recipe.carbsPerPerson}g</b> glucides</span>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Promos
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          className="flex-1 py-3 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Régénérer
        </button>
      </div>
    </div>
  )
}
