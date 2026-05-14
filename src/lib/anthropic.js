/**
 * Utilitaires partages pour l'API Anthropic.
 *
 * Deux modes :
 *   1. Backend proxy (recommande) — VITE_API_BASE defini → POST /api/anthropic/messages
 *      sur ton serveur Express. Aucune cle dans le bundle front.
 *   2. Direct browser (legacy)    — VITE_ANTHROPIC_API_KEY defini → appel direct vers
 *      api.anthropic.com via le proxy Vite en dev. La cle est exposee au build front.
 *
 * En production, toujours utiliser le mode 1.
 */

const API_BASE     = import.meta.env.VITE_API_BASE
const DIRECT_KEY   = import.meta.env.VITE_ANTHROPIC_API_KEY

export const USES_BACKEND = !!API_BASE

// En mode backend, on poste sur /api/anthropic/messages — pas de /v1.
// En mode direct, on poste sur le proxy Vite /api/anthropic/v1/messages.
const PATH_PREFIX = USES_BACKEND ? `${API_BASE}/api/anthropic` : '/api/anthropic/v1'

/**
 * Retourne les headers HTTP communs a tous les appels Anthropic.
 * En mode backend on n'envoie pas la cle : seul le serveur la connait.
 * @param {Record<string,string>} [extra] - headers additionnels (ex: anthropic-beta)
 */
export function getHeaders(extra = {}) {
  if (USES_BACKEND) {
    const headers = { 'Content-Type': 'application/json' }
    // Le backend propage `anthropic-beta` s'il est present (PDF vision)
    if (extra['anthropic-beta']) headers['x-anthropic-beta'] = extra['anthropic-beta']
    return headers
  }
  if (!DIRECT_KEY) {
    throw new Error('Configuration manquante. Renseignez VITE_API_BASE (recommande) ou VITE_ANTHROPIC_API_KEY dans .env')
  }
  return {
    'Content-Type':                              'application/json',
    'x-api-key':                                 DIRECT_KEY,
    'anthropic-version':                         '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true',
    ...extra,
  }
}

export const ANTHROPIC_API_BASE = PATH_PREFIX

/**
 * Lit un stream SSE Anthropic et appelle `onChunk` a chaque token recu.
 * Retourne le texte complet accumule.
 *
 * @param {Response}              response  - reponse fetch deja verifiee (response.ok)
 * @param {(text: string) => void} onChunk  - appele avec le texte cumule a chaque token
 * @returns {Promise<string>}               texte complet
 */
export async function readSSEStream(response, onChunk) {
  const reader  = response.body.getReader()
  const decoder = new TextDecoder()
  let fullText  = ''
  let buffer    = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop()

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const raw = line.slice(6).trim()
      if (raw === '[DONE]') continue
      try {
        const event = JSON.parse(raw)
        if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
          fullText += event.delta.text
          onChunk?.(fullText)
        }
        if (event.type === 'error') {
          throw new Error(event.error?.message ?? 'Erreur stream Anthropic')
        }
      } catch (e) {
        if (e.message.includes('Erreur')) throw e
        // JSON incomplet → on ignore
      }
    }
  }

  return fullText
}

/**
 * Lance un appel POST vers l'API Anthropic (direct ou via backend) et verifie le statut.
 * Retourne la Response si ok, sinon leve une Error avec le message de l'API.
 *
 * @param {string} path   - ex: '/messages'
 * @param {object} body   - corps JSON
 * @param {object} [extra] - headers additionnels (ex: anthropic-beta pour PDF)
 */
export async function anthropicPost(path, body, extra = {}) {
  const response = await fetch(`${ANTHROPIC_API_BASE}${path}`, {
    method:  'POST',
    headers: getHeaders(extra),
    body:    JSON.stringify(body),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(`Erreur API Anthropic : ${err?.error?.message ?? err?.error ?? response.status}`)
  }

  return response
}
