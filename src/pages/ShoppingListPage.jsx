import { useState } from 'react'
import { useShoppingStore } from '@/store/useShoppingStore'
import { buildShoppingList, formatQty } from '@/utils/shoppingList'
import { Button }    from '@/components/ui/button'
import { ShoppingCart, Printer, Trash2, X, Check, Copy, CheckCheck } from 'lucide-react'
import RobotChef    from '@/components/mascot/RobotChef'
import { cn } from '@/lib/utils'

export default function ShoppingListPage() {
  const { selectedRecipes, remove, clear, checkedItemNames, toggleChecked, clearChecked } = useShoppingStore()
  const items = buildShoppingList(selectedRecipes)
  const [copied, setCopied] = useState(false)

  const done  = checkedItemNames.length
  const total = items.length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0

  function copyToClipboard() {
    const lines = [
      `Liste de courses — Chef Privé`,
      `Recettes : ${selectedRecipes.map(r => r.name).join(', ')}`,
      '',
      ...items.map(item => {
        const qty  = formatQty(item)
        const tick = checkedItemNames.includes(item.name) ? '✓' : '○'
        return `${tick} ${item.name}${qty ? ' — ' + qty : ''}`
      }),
    ]
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (selectedRecipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center px-6 animate-in slide-up">
        <div className="animate-bob">
          <RobotChef expression="thinking" size="lg" accessory="spatula" />
        </div>
        <div className="space-y-2 max-w-sm">
          <p className="font-script text-3xl text-dolce-blue">Rien dans le panier</p>
          <h2 className="font-display text-2xl font-bold">Liste de courses vide !</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ajoutez des recettes depuis la cuisine ou vos favoris en cliquant sur 🛒.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="print:p-0">
    <div className="max-w-[1000px] mx-auto px-4 py-6 print:p-0 animate-in fade-in">

      {/* Header */}
      <div className="flex items-center justify-between mb-5 print:hidden flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-3xl bg-gradient-to-br from-dolce-basil to-dolce-basil-deep flex items-center justify-center shadow-dolce-warm">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-script text-2xl text-dolce-blue leading-none">Mes courses</p>
            <h1 className="font-display text-2xl font-bold leading-tight">Liste de courses</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {selectedRecipes.length} recette{selectedRecipes.length > 1 ? 's' : ''} · {total} ingrédients
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="gap-1.5 rounded-2xl" onClick={copyToClipboard}>
            {copied ? <CheckCheck className="h-3.5 w-3.5 text-dolce-basil-deep" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copié !' : 'Copier'}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 rounded-2xl" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" /> Imprimer
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 rounded-2xl text-destructive border-destructive/20 hover:bg-destructive/5" onClick={clear}>
            <Trash2 className="h-3.5 w-3.5" /> Vider
          </Button>
        </div>
      </div>

      {/* Progress */}
      {total > 0 && (
        <div className="mb-5 print:hidden space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {pct === 100 ? '🎉 C\'est prêt !' : `${done} / ${total} cochés`}
            </span>
            <span className="font-bold text-dolce-blue-deep tabular-nums">{pct}%</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-dolce-basil via-dolce-citron to-dolce-citron-deep rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          {pct === 100 && (
            <div className="pt-2 flex items-center justify-center gap-3 p-3 rounded-2xl bg-dolce-basil/10 border border-dolce-basil/30 animate-ciao">
              <div className="animate-bob">
                <RobotChef expression="excited" size="xs" accessory="pasta" />
              </div>
              <p className="text-sm font-semibold text-dolce-basil-deep">
                Bravo ! Place à la cuisine 🍳
              </p>
            </div>
          )}
        </div>
      )}

      {/* En-tête imprimable */}
      <div className="hidden print:block mb-6">
        <h1 className="font-display text-2xl font-bold">Liste de courses — Chef Privé</h1>
        <p className="text-sm text-gray-500 mt-1">{selectedRecipes.map(r => r.name).join(', ')}</p>
        <hr className="mt-3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-5">

        {/* Ingrédients */}
        <div className="bg-white rounded-3xl border border-border shadow-dolce-soft overflow-hidden print:shadow-none">
          <div className="px-5 py-3.5 border-b border-border/40 flex items-center justify-between">
            <h2 className="font-display text-base font-bold">Ingrédients</h2>
            {done > 0 && (
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={clearChecked}
              >
                Tout décocher
              </button>
            )}
          </div>
          <ul className="divide-y divide-border/30" role="list">
            {items.map((item, i) => {
              const isChecked = checkedItemNames.includes(item.name)
              return (
                <li
                  key={`${item.name}-${i}`}
                  onClick={() => toggleChecked(item.name)}
                  className={cn(
                    'flex items-center gap-3.5 px-5 py-3 cursor-pointer transition-colors select-none group',
                    isChecked ? 'bg-muted/30' : 'hover:bg-dolce-blue-soft/20'
                  )}
                  role="checkbox"
                  aria-checked={isChecked}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleChecked(item.name) } }}
                >
                  <div className={cn(
                    'h-5 w-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-all print:rounded-none',
                    isChecked ? 'bg-dolce-basil border-dolce-basil' : 'border-border/60 group-hover:border-dolce-blue/40'
                  )}>
                    {isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                  </div>
                  <div className={cn('flex-1 flex items-center justify-between gap-2', isChecked && 'opacity-40')}>
                    <span className={cn('text-sm font-medium', isChecked && 'line-through')}>{item.name}</span>
                    <span className="text-xs text-muted-foreground tabular-nums shrink-0">{formatQty(item)}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Recettes incluses */}
        <div className="space-y-2.5 print:hidden">
          <h2 className="font-display text-sm font-bold text-muted-foreground px-0.5">Recettes incluses</h2>
          {selectedRecipes.map(recipe => (
            <div
              key={recipe.name}
              className="bg-white rounded-3xl border border-border shadow-dolce-soft px-4 py-3 flex items-center gap-3"
            >
              <span className="text-2xl shrink-0" aria-hidden="true">
                {recipe.type === 'petit-déjeuner' ? '🥐' : recipe.type === 'déjeuner' ? '🥗' : '🍝'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight truncate">{recipe.name}</p>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">{recipe.type}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(recipe.name)}
                aria-label={`Retirer ${recipe.name}`}
                className="shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          <div className="pt-2 flex items-center gap-2 p-3 rounded-2xl bg-dolce-citron/20 border border-dolce-citron/40">
            <div className="animate-bob">
              <RobotChef expression="happy" size="xs" />
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">
              Cochez les ingrédients au fur et à mesure de vos achats ✅
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
