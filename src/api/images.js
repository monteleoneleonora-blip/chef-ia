import { WIKI_MAP }         from '@/data/wikiMap'
import { MEAL_DB_MAP }      from '@/data/mealDbMap'
import { RECIPE_PHOTO_MAP } from '@/data/recipePhotoMap'

const PEXELS_KEY   = import.meta.env.VITE_PEXELS_KEY
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY
const API_BASE     = import.meta.env.VITE_API_BASE
const USES_BACKEND = !!API_BASE

// Cache localStorage — LRU, max 200 entrees
// v6 : nouvelle priorite (MEAL_DB_MAP avant RECIPE_PHOTO_MAP) → invalide l'ancien cache
const CACHE_LS_KEY = 'chef-ia-photo-cache-v7'
const CACHE_MAX    = 200

let _cache = null

function getCache() {
  if (_cache) return _cache
  try { _cache = JSON.parse(localStorage.getItem(CACHE_LS_KEY) ?? '{}') }
  catch { _cache = {} }
  return _cache
}

function saveToCache(key, url) {
  const c = getCache()
  c[key] = { url, ts: Date.now() }

  const keys = Object.keys(c)
  if (keys.length > CACHE_MAX) {
    const oldest = keys.sort((a, b) => (c[a].ts ?? 0) - (c[b].ts ?? 0))
    oldest.slice(0, keys.length - CACHE_MAX).forEach(k => delete c[k])
  }

  try { localStorage.setItem(CACHE_LS_KEY, JSON.stringify(c)) } catch {}
}

// Backend proxy unifie (Pexels + Unsplash)
async function fetchViaBackend(query, source) {
  try {
    const res  = await fetch(`${API_BASE}/api/photo?source=${source}&query=${encodeURIComponent(query)}`)
    if (!res.ok) return null
    const data = await res.json()
    return data.url ?? null
  } catch { return null }
}

// TheMealDB (gratuit, sans cle, 1 plat = 1 photo HD verifiee)
async function fetchMealDB(searchTerm) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`
  )
  if (!res.ok) return null
  const data = await res.json()
  const meal = data.meals?.[0]
  return meal?.strMealThumb ?? null
}

// Wikipedia (gratuit, sans cle)
async function fetchWikipedia(wikiTitle) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = await res.json()
  const thumb = data.thumbnail?.source
  if (thumb) return thumb.replace(/\/\d+px-/, '/1200px-')
  return data.originalimage?.source ?? null
}

async function fetchPexels(query) {
  if (USES_BACKEND) return fetchViaBackend(query, 'pexels')
  if (!PEXELS_KEY) return null
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
    { headers: { Authorization: PEXELS_KEY } }
  )
  if (!res.ok) return null
  const data = await res.json()
  const photo = data.photos?.[0]
  return photo?.src?.large2x ?? photo?.src?.large ?? null
}

async function fetchUnsplash(query) {
  if (USES_BACKEND) return fetchViaBackend(query, 'unsplash')
  if (!UNSPLASH_KEY) return null
  const res = await fetch(
    `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${UNSPLASH_KEY}`
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.urls?.full ?? data.urls?.regular ?? null
}

const SKIP_WORDS_DESCRIPTIVE = new Set([
  'fluffy','creamy','crispy','golden','roasted','baked','grilled','steamed','fried',
  'healthy','light','fresh','classic','french','italian','thai','japanese','moroccan',
  'indian','spanish','chinese','mediterranean','warm','cold','spicy','sweet','savory',
])

const SKIP_WORDS_BASIC = new Set([
  'healthy','homemade','classic','crispy','fluffy','creamy','light','fresh',
])

/**
 * Resout l'URL d'une photo pour une recette.
 *
 * Strategie de priorite (v7, optimisee pour 1 plat = 1 photo precise) :
 *
 *   1. Cache localStorage
 *   2. RECIPE_PHOTO_MAP → Unsplash CDN curé (garanti, pas de réseau externe)
 *   3. MEAL_DB_MAP   → TheMealDB (photos pro, 1 plat = 1 photo, vérifié)
 *   4. WIKI_MAP      → Wikipedia (article specifique au plat)
 *   5. Pexels search (via backend ou direct)
 *   6. Unsplash random (via backend ou direct)
 *   7. TheMealDB par mots-cles extraits de imageQuery
 *   8. Wikipedia par mot-cle de imageQuery
 *
 * BUG-016 corrigé : RECIPE_PHOTO_MAP est en priorité #2 (CDN Unsplash
 * statique, aucune dépendance réseau) ; MEAL_DB_MAP est en #3.
 *
 * @param {string} recipeName  - nom exact de la recette (pour les mappings)
 * @param {string} imageQuery  - termes anglais descriptifs (fallback recherche)
 * @returns {Promise<string|null>}
 */
export async function resolvePhotoUrl(recipeName, imageQuery) {
  const cacheKey = recipeName || imageQuery
  if (!cacheKey) return null

  // 1. Cache
  const entry = getCache()[cacheKey]
  if (entry) {
    const url = typeof entry === 'string' ? entry : entry.url
    if (typeof entry === 'object') entry.ts = Date.now()
    return url
  }

  let url = null

  // 2. RECIPE_PHOTO_MAP en priorité si une photo statique est définie
  //    (CDN Unsplash garanti, pas de dépendance réseau externe)
  if (recipeName && RECIPE_PHOTO_MAP[recipeName]) {
    url = RECIPE_PHOTO_MAP[recipeName]
    saveToCache(cacheKey, url)
    return url
  }

  // 3. TheMealDB via mapping explicite (pour les recettes sans photo statique)
  if (!url && recipeName) {
    const mealTerm = MEAL_DB_MAP[recipeName]
    if (mealTerm) {
      try { url = await fetchMealDB(mealTerm) } catch {}
    }
  }

  // 4. Wikipedia via mapping explicite
  if (!url && recipeName) {
    const wikiTitle = WIKI_MAP[recipeName]
    if (wikiTitle) {
      try { url = await fetchWikipedia(wikiTitle) } catch {}
    }
  }

  // 5. Pexels search (recherche dynamique avec query precise)
  if (!url && (PEXELS_KEY || USES_BACKEND)) {
    try { url = await fetchPexels(`${imageQuery} food photography plated`) } catch {}
  }

  // 6. Unsplash search
  if (!url && (UNSPLASH_KEY || USES_BACKEND)) {
    try { url = await fetchUnsplash(`${imageQuery} food`) } catch {}
  }

  // 7. TheMealDB par imageQuery (fallback dynamique)
  if (!url && imageQuery) {
    const words = imageQuery.split(' ')
    const meaningful = words.filter(w => !SKIP_WORDS_DESCRIPTIVE.has(w.toLowerCase())).slice(0, 2).join(' ')
    const searchTerm = meaningful || words.slice(0, 2).join(' ')
    try { url = await fetchMealDB(searchTerm) } catch {}
  }

  // 8. Wikipedia par mot-cle (dernier recours)
  if (!url && imageQuery) {
    const words = imageQuery.split(' ')
    const keyword = words.find(w => !SKIP_WORDS_BASIC.has(w.toLowerCase())) ?? words[0]
    try { url = await fetchWikipedia(keyword) } catch {}
  }

  if (url) saveToCache(cacheKey, url)
  return url
}

export const hasPhotoApi = !!(PEXELS_KEY || UNSPLASH_KEY || USES_BACKEND)
