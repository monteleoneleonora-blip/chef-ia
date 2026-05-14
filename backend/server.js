/**
 * Chef IA — backend proxy.
 *
 * Rôle :
 *   - Détient les clés API (Anthropic, ElevenLabs, Pexels, Unsplash) côté serveur.
 *   - Expose des endpoints simples consommés par le front.
 *   - Gère le streaming SSE Anthropic en passe-plat (pour ne pas casser le UX).
 *   - Applique un rate-limit par IP (anti-abus).
 *
 * Déploiement :
 *   - Railway / Render / Fly.io / Cloud Run : `node server.js`
 *   - Variables d'env : voir `.env.example`
 *   - Le front pointe `VITE_API_BASE` sur l'URL publique de ce serveur.
 */
import 'dotenv/config'
import express        from 'express'
import cors           from 'cors'
import morgan         from 'morgan'
import rateLimit      from 'express-rate-limit'

const PORT = Number(process.env.PORT) || 3001
const {
  ANTHROPIC_API_KEY,
  ELEVENLABS_API_KEY,
  PEXELS_API_KEY,
  UNSPLASH_API_KEY,
  ALLOWED_ORIGINS = 'http://localhost:5173',
  RATE_LIMIT_MAX  = '60',
} = process.env

if (!ANTHROPIC_API_KEY) {
  console.error('⛔  ANTHROPIC_API_KEY manquante. Voir backend/.env.example')
  process.exit(1)
}

const app = express()
app.disable('x-powered-by')

// ── Logs HTTP simples ─────────────────────────────────────────────
app.use(morgan('tiny'))

// ── CORS strict ───────────────────────────────────────────────────
const origins = ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true) // curl / outils internes
    if (origins.includes(origin) || origins.includes('*')) return cb(null, true)
    cb(new Error(`Origine non autorisée : ${origin}`))
  },
  credentials: false,
}))

// ── Body parser (tailles modestes — vision peut envoyer du base64) ──
app.use(express.json({ limit: '20mb' }))

// ── Rate limit global — anti-abus IP ──────────────────────────────
app.use(rateLimit({
  windowMs:  60 * 1000,
  max:       Number(RATE_LIMIT_MAX),
  standardHeaders: true,
  legacyHeaders:   false,
  message:   { error: 'Trop de requêtes. Réessayez dans une minute.' },
}))

// ── Healthcheck ───────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ ok: true, ts: Date.now() }))

// ─────────────────────────────────────────────────────────────────
// Anthropic — streaming SSE en passe-plat
// ─────────────────────────────────────────────────────────────────
const ANTHROPIC_HEADERS = {
  'content-type':      'application/json',
  'x-api-key':         ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
}

/** Pipe-streaming d'une réponse fetch vers la réponse Express */
async function pipeFetchStream(upstream, res) {
  res.status(upstream.status)
  upstream.headers.forEach((value, key) => {
    // On ne propage que les headers utiles, pas les sensibles
    if (['content-type', 'cache-control'].includes(key.toLowerCase())) {
      res.setHeader(key, value)
    }
  })
  if (!upstream.body) return res.end()

  const reader = upstream.body.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    res.write(value)
  }
  res.end()
}

/**
 * POST /api/anthropic/messages
 *   Body : payload Anthropic standard (model, messages, max_tokens, stream, system, ...)
 *   Header optionnel `x-anthropic-beta` → propagé tel quel
 */
app.post('/api/anthropic/messages', async (req, res, next) => {
  try {
    const headers = { ...ANTHROPIC_HEADERS }
    if (req.get('x-anthropic-beta')) headers['anthropic-beta'] = req.get('x-anthropic-beta')

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers,
      body:    JSON.stringify(req.body),
    })

    if (!req.body?.stream) {
      const json = await upstream.json()
      return res.status(upstream.status).json(json)
    }
    await pipeFetchStream(upstream, res)
  } catch (err) {
    next(err)
  }
})

// ─────────────────────────────────────────────────────────────────
// ElevenLabs — TTS audio (binaire en passe-plat)
// ─────────────────────────────────────────────────────────────────
app.post('/api/elevenlabs/tts', async (req, res, next) => {
  try {
    if (!ELEVENLABS_API_KEY) {
      return res.status(503).json({ error: 'TTS désactivé : ELEVENLABS_API_KEY non configurée.' })
    }
    const { text, voiceId, modelId, voiceSettings } = req.body ?? {}
    if (!text) return res.status(400).json({ error: 'Champ "text" requis.' })

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId ?? 'XB0fDUnXU5powFXDhCwa'}`
    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'xi-api-key':   ELEVENLABS_API_KEY,
        'accept':       'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: modelId ?? 'eleven_multilingual_v2',
        voice_settings: voiceSettings ?? {
          stability:        0.45,
          similarity_boost: 0.80,
          style:            0.35,
          use_speaker_boost: true,
        },
      }),
    })
    if (!upstream.ok) {
      const txt = await upstream.text().catch(() => upstream.statusText)
      return res.status(upstream.status).json({ error: txt })
    }
    res.setHeader('content-type', 'audio/mpeg')
    const buffer = Buffer.from(await upstream.arrayBuffer())
    res.send(buffer)
  } catch (err) {
    next(err)
  }
})

// ─────────────────────────────────────────────────────────────────
// Photos — Pexels + Unsplash (renvoi d'URL uniquement, pas du binaire)
// ─────────────────────────────────────────────────────────────────
app.get('/api/photo', async (req, res, next) => {
  try {
    const { query, source = 'auto', orientation = 'landscape' } = req.query
    if (!query) return res.status(400).json({ error: 'Param "query" requis.' })

    const tryPexels = async () => {
      if (!PEXELS_API_KEY) return null
      const r = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=${orientation}`,
        { headers: { Authorization: PEXELS_API_KEY } }
      )
      if (!r.ok) return null
      const data = await r.json()
      const photo = data.photos?.[0]
      return photo?.src?.large2x ?? photo?.src?.large ?? null
    }

    const tryUnsplash = async () => {
      if (!UNSPLASH_API_KEY) return null
      const r = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=${orientation}&client_id=${UNSPLASH_API_KEY}`
      )
      if (!r.ok) return null
      const data = await r.json()
      return data.urls?.full ?? data.urls?.regular ?? null
    }

    let url = null
    if (source === 'pexels' || source === 'auto') url = await tryPexels()
    if (!url && (source === 'unsplash' || source === 'auto')) url = await tryUnsplash()

    res.json({ url })
  } catch (err) {
    next(err)
  }
})

// ─────────────────────────────────────────────────────────────────
// Error handler
// ─────────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('💥', err.message)
  res.status(500).json({ error: err.message })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend Chef IA prêt sur http://localhost:${PORT}`)
  console.log(`   → CORS autorisé : ${origins.join(', ')}`)
  console.log(`   → Rate limit    : ${RATE_LIMIT_MAX} req/min/IP`)
})
