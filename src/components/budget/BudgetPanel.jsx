import { useState, useMemo } from 'react'
import { X, Users, Euro, Calendar, CalendarDays, ChevronDown, ChevronUp, Shuffle, Info } from 'lucide-react'
import { useBudgetStore } from '@/store/useBudgetStore'
import { getBudget }      from '@/data/budgetMap'
import { cn }             from '@/lib/utils'

// ── Helpers ───────────────────────────────────────────────────────
function fmt(n) {
  return n.toFixed(2).replace('.', ',')
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

// ── Filtre 1 — Seuil par personne ────────────────────────────────
function FiltreParPersonne() {
  const { filtreMaxParPersonne, setFiltreMaxParPersonne, filtreNiveau } = useBudgetStore()
  const SEUILS = ['', '1', '2', '3', '5']

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Filtrez la banque de recettes selon un coût maximum par personne.
        Ce filtre s'applique combiné avec le filtre de niveau.
      </p>
      <div className="flex flex-wrap gap-2">
        {SEUILS.map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setFiltreMaxParPersonne(s)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
              filtreMaxParPersonne === s
                ? 'bg-green-600 text-white border-green-600'
                : 'border-border text-muted-foreground hover:border-green-400/40 bg-white'
            )}
          >
            {s === '' ? 'Tout' : `≤ ${s} €/pers.`}
          </button>
        ))}
      </div>

      {filtreMaxParPersonne && (
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          Seules les recettes avec un coût ≤ {filtreMaxParPersonne} € par personne sont affichées.
          Le badge vert indique le coût réel de chaque recette.
        </div>
      )}
    </div>
  )
}

// ── Filtre 2 — Budget repas total ────────────────────────────────
function FiltreTotalRepas({ recipes }) {
  const { nbPersonnes, setNbPersonnes } = useBudgetStore()
  const [maxTotal, setMaxTotal] = useState('')

  const withBudget = useMemo(() =>
    recipes
      .map(r => ({ ...r, _b: getBudget(r) }))
      .filter(r => r._b != null)
      .map(r => ({ ...r, _total: r._b.coutParPersonne * nbPersonnes }))
      .sort((a, b) => a._total - b._total),
    [recipes, nbPersonnes]
  )

  const filtered = maxTotal
    ? withBudget.filter(r => r._total <= parseFloat(maxTotal))
    : withBudget

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
            <Users className="h-3 w-3 inline mr-1" />Nombre de convives
          </label>
          <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2 w-fit">
            <button
              type="button"
              onClick={() => setNbPersonnes(Math.max(1, nbPersonnes - 1))}
              className="h-5 w-5 rounded-full bg-white shadow-sm flex items-center justify-center text-sm font-bold hover:bg-muted"
            >−</button>
            <span className="text-sm font-bold w-6 text-center">{nbPersonnes}</span>
            <button
              type="button"
              onClick={() => setNbPersonnes(Math.min(20, nbPersonnes + 1))}
              className="h-5 w-5 rounded-full bg-white shadow-sm flex items-center justify-center text-sm font-bold hover:bg-muted"
            >+</button>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
            <Euro className="h-3 w-3 inline mr-1" />Budget max total (€)
          </label>
          <input
            type="number"
            min="1"
            step="0.50"
            placeholder="ex : 15"
            value={maxTotal}
            onChange={e => setMaxTotal(e.target.value)}
            className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/40"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
          {filtered.slice(0, 20).map(r => (
            <div key={r.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors">
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">{r.name}</p>
                <p className="text-[11px] text-muted-foreground">{r.cuisine}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-green-700">{fmt(r._total)} €</p>
                <p className="text-[11px] text-muted-foreground">{fmt(r._b.coutParPersonne)} €/pers.</p>
              </div>
            </div>
          ))}
          {filtered.length > 20 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              + {filtered.length - 20} recettes supplémentaires dans la banque
            </p>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-4">
          Aucune recette ne correspond à ce budget pour {nbPersonnes} personne{nbPersonnes > 1 ? 's' : ''}.
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        {withBudget.length} recettes avec données budget · {filtered.length} dans le budget
      </p>
    </div>
  )
}

// ── Filtre 3 — Menu semaine ───────────────────────────────────────
function FiltreSemaine({ recipes }) {
  const { nbPersonnes, setNbPersonnes, budgetSemaine, setBudgetSemaine } = useBudgetStore()
  const [menu, setMenu] = useState(null)
  const [error, setError] = useState('')

  const budgeted = useMemo(() =>
    recipes
      .map(r => ({ ...r, _b: getBudget(r) }))
      .filter(r => r._b != null),
    [recipes]
  )

  function genererMenu() {
    const budget = parseFloat(budgetSemaine)
    if (isNaN(budget) || budget <= 0) {
      setError('Entrez un budget valide.')
      return
    }
    setError('')

    const byType = {
      'petit-déjeuner': budgeted.filter(r => r.type === 'petit-déjeuner'),
      'déjeuner':       budgeted.filter(r => r.type === 'déjeuner'),
      'dîner':          budgeted.filter(r => r.type === 'dîner'),
    }

    // Objectif : 7 jours × 3 repas, total ≤ budget
    const coutCible = budget / (7 * nbPersonnes) // coût moyen par repas par personne
    let essais = 0
    let meilleur = null
    let meilleurEcart = Infinity

    while (essais < 200) {
      essais++
      const semaine = JOURS.map(jour => ({
        jour,
        dejeuner:    shuffle(byType['déjeuner'])[0]          ?? null,
        diner:       shuffle(byType['dîner'])[0]             ?? null,
        petitDej:    shuffle(byType['petit-déjeuner'])[0]    ?? null,
      }))

      const totalSemaine = semaine.reduce((sum, j) => {
        const prixJ = [j.petitDej, j.dejeuner, j.diner].reduce((s, r) =>
          s + (r ? r._b.coutParPersonne * nbPersonnes : 0), 0
        )
        return sum + prixJ
      }, 0)

      const ecart = Math.abs(totalSemaine - budget)
      if (totalSemaine <= budget && ecart < meilleurEcart) {
        meilleurEcart = ecart
        meilleur = { semaine, totalSemaine }
      }
    }

    if (!meilleur) {
      // Prend quand même la solution la moins chère
      const semaine = JOURS.map(jour => {
        const cheapest = (arr) => [...arr].sort((a,b) => a._b.coutParPersonne - b._b.coutParPersonne)[0] ?? null
        return {
          jour,
          petitDej: cheapest(byType['petit-déjeuner']),
          dejeuner: cheapest(byType['déjeuner']),
          diner:    cheapest(byType['dîner']),
        }
      })
      const totalSemaine = semaine.reduce((sum, j) =>
        sum + [j.petitDej, j.dejeuner, j.diner].reduce((s,r) =>
          s + (r ? r._b.coutParPersonne * nbPersonnes : 0), 0), 0)
      meilleur = { semaine, totalSemaine }
    }

    setMenu(meilleur)
  }

  const coutCumule = menu
    ? menu.semaine.reduce((acc, j, i) => {
        const prev = acc[i - 1]?.cumul ?? 0
        const jour = [j.petitDej, j.dejeuner, j.diner].reduce((s,r) =>
          s + (r ? r._b.coutParPersonne * nbPersonnes : 0), 0)
        acc.push({ ...j, jourCout: jour, cumul: prev + jour })
        return acc
      }, [])
    : []

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
            <Users className="h-3 w-3 inline mr-1" />Convives
          </label>
          <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2 w-fit">
            <button type="button" onClick={() => setNbPersonnes(Math.max(1, nbPersonnes - 1))}
              className="h-5 w-5 rounded-full bg-white shadow-sm flex items-center justify-center text-sm font-bold hover:bg-muted">−</button>
            <span className="text-sm font-bold w-6 text-center">{nbPersonnes}</span>
            <button type="button" onClick={() => setNbPersonnes(Math.min(20, nbPersonnes + 1))}
              className="h-5 w-5 rounded-full bg-white shadow-sm flex items-center justify-center text-sm font-bold hover:bg-muted">+</button>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
            <Calendar className="h-3 w-3 inline mr-1" />Budget semaine (€)
          </label>
          <input
            type="number" min="10" step="5" placeholder="ex : 80"
            value={budgetSemaine}
            onChange={e => setBudgetSemaine(e.target.value)}
            className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/40"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="button"
        onClick={genererMenu}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors"
      >
        <Shuffle className="h-3.5 w-3.5" />
        Générer le menu de la semaine
      </button>

      {menu && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Menu 7 jours</p>
            <div className={cn(
              'text-xs font-bold px-2.5 py-1 rounded-full',
              menu.totalSemaine <= parseFloat(budgetSemaine || 999)
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
            )}>
              Total : {fmt(menu.totalSemaine)} € / sem.
            </div>
          </div>

          {/* Barre de progression budget */}
          {budgetSemaine && (
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all', menu.totalSemaine > parseFloat(budgetSemaine) ? 'bg-orange-500' : 'bg-green-500')}
                style={{ width: `${Math.min(100, (menu.totalSemaine / parseFloat(budgetSemaine)) * 100)}%` }}
              />
            </div>
          )}

          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {coutCumule.map(({ jour, petitDej, dejeuner, diner, jourCout, cumul }) => (
              <div key={jour} className="bg-muted/30 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold">{jour}</span>
                  <div className="flex gap-2 text-[11px]">
                    <span className="text-muted-foreground">{fmt(jourCout)} €/jour</span>
                    <span className="text-green-700 font-semibold">Cumul : {fmt(cumul)} €</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: '🥐 Petit-déj', r: petitDej },
                    { label: '🥗 Déjeuner',  r: dejeuner },
                    { label: '🍝 Dîner',     r: diner    },
                  ].map(({ label, r }) => (
                    <div key={label} className="bg-white rounded-lg p-2">
                      <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
                      <p className="text-[11px] font-semibold leading-tight line-clamp-2">
                        {r?.name ?? <span className="text-muted-foreground italic">—</span>}
                      </p>
                      {r && <p className="text-[10px] text-green-700 font-bold mt-0.5">{fmt(r._b.coutParPersonne * nbPersonnes)} €</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Filtre 4 — Budget mensuel ─────────────────────────────────────
function FiltreMois({ recipes }) {
  const { nbPersonnes, setNbPersonnes, budgetMois, setBudgetMois } = useBudgetStore()

  const budgeted = useMemo(() =>
    recipes
      .map(r => ({ ...r, _b: getBudget(r) }))
      .filter(r => r._b != null),
    [recipes]
  )

  const analyse = useMemo(() => {
    const budget = parseFloat(budgetMois)
    if (isNaN(budget) || budget <= 0 || !nbPersonnes) return null

    // Repas dans le budget par mois (3 repas/jour × 30 jours)
    const totalRepasMois = 3 * 30
    const coutMoyenParRepas = budget / totalRepasMois

    const econos = budgeted.filter(r => r._b.coutParPersonne * nbPersonnes <= coutMoyenParRepas)
    const moyens  = budgeted.filter(r => {
      const c = r._b.coutParPersonne * nbPersonnes
      return c > coutMoyenParRepas && c <= coutMoyenParRepas * 2
    })

    const repasPossibles = Math.floor(budget / (budgeted.reduce((s,r) => s + r._b.coutParPersonne * nbPersonnes, 0) / budgeted.length || 1))

    return {
      budget,
      coutMoyenParRepas,
      nbRepasPossibles: repasPossibles,
      econos: econos.slice(0, 6),
      moyens: moyens.slice(0, 4),
      couverturePourcentage: Math.min(100, Math.round((econos.length / budgeted.length) * 100)),
    }
  }, [budgetMois, nbPersonnes, budgeted])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
            <Users className="h-3 w-3 inline mr-1" />Convives
          </label>
          <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2 w-fit">
            <button type="button" onClick={() => setNbPersonnes(Math.max(1, nbPersonnes - 1))}
              className="h-5 w-5 rounded-full bg-white shadow-sm flex items-center justify-center text-sm font-bold hover:bg-muted">−</button>
            <span className="text-sm font-bold w-6 text-center">{nbPersonnes}</span>
            <button type="button" onClick={() => setNbPersonnes(Math.min(20, nbPersonnes + 1))}
              className="h-5 w-5 rounded-full bg-white shadow-sm flex items-center justify-center text-sm font-bold hover:bg-muted">+</button>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
            <CalendarDays className="h-3 w-3 inline mr-1" />Budget mensuel (€)
          </label>
          <input
            type="number" min="50" step="10" placeholder="ex : 300"
            value={budgetMois}
            onChange={e => setBudgetMois(e.target.value)}
            className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/40"
          />
        </div>
      </div>

      {analyse && (
        <div className="space-y-4">
          {/* Résumé */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
              <p className="text-2xl font-extrabold text-green-700">{fmt(analyse.coutMoyenParRepas)} €</p>
              <p className="text-[11px] text-green-600 font-medium">budget moyen par repas</p>
              <p className="text-[10px] text-muted-foreground">pour {nbPersonnes} pers.</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
              <p className="text-2xl font-extrabold text-blue-700">{analyse.couverturePourcentage}%</p>
              <p className="text-[11px] text-blue-600 font-medium">des recettes accessibles</p>
              <p className="text-[10px] text-muted-foreground">{analyse.econos.length} recettes éco. disponibles</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground bg-muted/40 rounded-xl px-3 py-2">
            Avec {fmt(analyse.budget)} € / mois pour {nbPersonnes} personne{nbPersonnes > 1 ? 's' : ''},
            vous disposez de <strong>{fmt(analyse.coutMoyenParRepas)} €</strong> par repas.
            Votre budget couvre environ <strong>{analyse.nbRepasPossibles} repas</strong> (estimation sur recettes de la banque).
          </p>

          {analyse.econos.length > 0 && (
            <div>
              <p className="text-xs font-bold text-green-700 mb-2">✅ Dans votre budget ({analyse.econos.length} recettes)</p>
              <div className="space-y-1">
                {analyse.econos.map(r => (
                  <div key={r.id} className="flex items-center justify-between px-3 py-1.5 bg-green-50 rounded-lg">
                    <p className="text-xs font-medium truncate">{r.name}</p>
                    <p className="text-xs font-bold text-green-700 shrink-0 ml-2">
                      {fmt(r._b.coutParPersonne * nbPersonnes)} €/repas
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analyse.moyens.length > 0 && (
            <div>
              <p className="text-xs font-bold text-blue-700 mb-2">⚠️ Légèrement au-dessus ({analyse.moyens.length} recettes)</p>
              <div className="space-y-1">
                {analyse.moyens.map(r => (
                  <div key={r.id} className="flex items-center justify-between px-3 py-1.5 bg-blue-50 rounded-lg">
                    <p className="text-xs font-medium truncate">{r.name}</p>
                    <p className="text-xs font-bold text-blue-700 shrink-0 ml-2">
                      {fmt(r._b.coutParPersonne * nbPersonnes)} €/repas
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!analyse && budgetMois === '' && (
        <p className="text-xs text-muted-foreground text-center py-4">
          Entrez votre budget mensuel pour voir une estimation personnalisée.
        </p>
      )}
    </div>
  )
}

// ── Composant principal ───────────────────────────────────────────
const TABS = [
  { key: 'seuil',   label: 'Par personne', icon: Euro         },
  { key: 'total',   label: 'Repas total',  icon: Users        },
  { key: 'semaine', label: 'Semaine',      icon: Calendar     },
  { key: 'mois',    label: 'Mois',         icon: CalendarDays },
]

export default function BudgetPanel({ recipes, onClose }) {
  const [tab, setTab] = useState('seuil')
  const [open, setOpen] = useState(true)

  return (
    <div className="bg-white border border-green-200 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white">
        <div className="flex items-center gap-2">
          <Euro className="h-4 w-4" />
          <span className="font-bold text-sm">Filtres budget avancés</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="h-6 w-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
          >
            {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-6 w-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {open && (
        <>
          {/* Onglets */}
          <div className="flex border-b border-border">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all',
                  tab === key
                    ? 'border-b-2 border-green-600 text-green-700 bg-green-50/50'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                )}
              >
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Contenu */}
          <div className="p-4">
            {tab === 'seuil'   && <FiltreParPersonne />}
            {tab === 'total'   && <FiltreTotalRepas recipes={recipes} />}
            {tab === 'semaine' && <FiltreSemaine recipes={recipes} />}
            {tab === 'mois'    && <FiltreMois recipes={recipes} />}
          </div>
        </>
      )}
    </div>
  )
}
