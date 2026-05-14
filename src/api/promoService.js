/**
 * Service de récupération des promotions.
 * Utilise les données de démonstration (promos-demo.json).
 * Architecture conçue pour brancher une vraie API sans modifier les composants :
 * remplacer fetchFromAPI() par un vrai appel HTTP suffit.
 */
import PROMOS_DEMO from '@/data/promos-demo.json'

const CACHE_KEY = 'chef-ia-promos-cache'
const CACHE_TTL = 4 * 60 * 60 * 1000  // 4 heures

export const MAGASINS = [
  { id: 'carrefour',    label: 'Carrefour',    emoji: '🔴', color: 'bg-red-50   border-red-200   text-red-700' },
  { id: 'leclerc',      label: 'E.Leclerc',    emoji: '🔵', color: 'bg-blue-50  border-blue-200  text-blue-700' },
  { id: 'intermarche',  label: 'Intermarché',  emoji: '🟡', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { id: 'grand-frais',  label: 'Grand Frais',  emoji: '🟢', color: 'bg-green-50 border-green-200 text-green-700' },
  { id: 'lidl',         label: 'Lidl',         emoji: '🟠', color: 'bg-orange-50 border-orange-200 text-orange-700' },
  { id: 'aldi',         label: 'Aldi',         emoji: '⚪', color: 'bg-slate-50  border-slate-200  text-slate-700' },
]

function readCache(magasin) {
  try {
    const raw  = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data[magasin]) return null
    if (Date.now() - data[magasin].ts > CACHE_TTL) return null
    return data[magasin].promos
  } catch { return null }
}

function writeCache(magasin, promos) {
  try {
    const raw  = localStorage.getItem(CACHE_KEY)
    const data = raw ? JSON.parse(raw) : {}
    data[magasin] = { promos, ts: Date.now() }
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {}
}

/**
 * Retourne les promos pour un magasin donné.
 * Utilise un cache de 4h pour éviter les appels répétés.
 * @param {string} magasin - identifiant du magasin (ex: 'carrefour')
 * @returns {Promise<Array>}
 */
export async function getPromos(magasin) {
  const cached = readCache(magasin)
  if (cached) return cached

  // Simulation d'un délai réseau (remplacer par un vrai fetch si API disponible)
  await new Promise(r => setTimeout(r, 600))

  const promos = magasin === 'all'
    ? PROMOS_DEMO
    : PROMOS_DEMO.filter(p => p.magasin === magasin)

  writeCache(magasin, promos)
  return promos
}

export function clearPromoCache() {
  try { localStorage.removeItem(CACHE_KEY) } catch {}
}
