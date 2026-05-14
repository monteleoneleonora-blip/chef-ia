// ElevenLabs TTS
// Voix : "Charlotte" (XB0fDUnXU5powFXDhCwa) — voix francaise expressive
// Modele : eleven_multilingual_v2

const VOICE_ID = 'XB0fDUnXU5powFXDhCwa'
const MODEL_ID = 'eleven_multilingual_v2'

const API_BASE     = import.meta.env.VITE_API_BASE
const DIRECT_KEY   = import.meta.env.VITE_ELEVENLABS_API_KEY
const USES_BACKEND = !!API_BASE

/**
 * Convertit du texte en audio via ElevenLabs.
 * Utilise le backend proxy si VITE_API_BASE est defini, sinon appelle
 * ElevenLabs directement (mode legacy avec cle exposee).
 *
 * @param {string} text
 * @returns {Promise<string>} URL blob de l'audio (MP3)
 */
export async function textToSpeech(text) {
  // Mode backend
  if (USES_BACKEND) {
    const response = await fetch(`${API_BASE}/api/elevenlabs/tts`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ text, voiceId: VOICE_ID, modelId: MODEL_ID }),
    })
    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(`TTS: ${err.error ?? response.status}`)
    }
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  }

  // Mode direct (legacy)
  if (!DIRECT_KEY) throw new Error('Cle ElevenLabs manquante (VITE_ELEVENLABS_API_KEY) ou VITE_API_BASE non defini')

  const response = await fetch(`/api/elevenlabs/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'xi-api-key':    DIRECT_KEY,
      'Accept':        'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: {
        stability:        0.45,
        similarity_boost: 0.80,
        style:            0.35,
        use_speaker_boost: true,
      },
    }),
  })

  if (!response.ok) {
    const err = await response.text().catch(() => response.statusText)
    throw new Error(`ElevenLabs TTS: ${err}`)
  }

  const blob = await response.blob()
  return URL.createObjectURL(blob)
}
