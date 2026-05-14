import { useState, useRef, useEffect, useCallback } from 'react'
import { textToSpeech } from '@/api/tts'

// ── Sélection de la meilleure voix française ──────────────────────
const VOICE_PRIORITY = [
  'Microsoft Denise Online (Natural) - fr-FR',
  'Microsoft Henri Online (Natural) - fr-FR',
  'Google français',
  'Microsoft Julie Online (Natural) - fr-FR',
  'Microsoft Guillaume Online (Natural) - fr-FR',
  'Microsoft Hortense Desktop - French',
  'Microsoft Paul Desktop - French',
]

function getBestFrenchVoice(voices) {
  for (const name of VOICE_PRIORITY) {
    const v = voices.find(v => v.name === name)
    if (v) return v
  }
  return voices.find(v => v.lang === 'fr-FR')
      ?? voices.find(v => v.lang.startsWith('fr'))
      ?? null
}

function loadVoices() {
  return new Promise(resolve => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) return resolve(voices)
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      resolve(window.speechSynthesis.getVoices())
    }, { once: true })
  })
}

// ── Hook partagé ──────────────────────────────────────────────────
export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speakingId, setSpeakingId] = useState(null)
  const [isLoading,  setIsLoading]  = useState(false)
  const audioRef   = useRef(null)
  const blobUrlRef = useRef(null)

  const hasElevenLabs = !!import.meta.env.VITE_ELEVENLABS_API_KEY
  const isSupported   = typeof window !== 'undefined' && ('speechSynthesis' in window || hasElevenLabs)

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel()
    setIsSpeaking(false)
    setSpeakingId(null)
    setIsLoading(false)
  }, [])

  const speak = useCallback(async (text, id) => {
    if (!text) return
    stop()
    setSpeakingId(id ?? null)

    if (hasElevenLabs) {
      setIsLoading(true)
      try {
        const url   = await textToSpeech(text)
        blobUrlRef.current = url
        const audio = new Audio(url)
        audioRef.current   = audio
        audio.onplay  = () => { setIsSpeaking(true); setIsLoading(false) }
        audio.onended = stop
        audio.onerror = stop
        await audio.play()
      } catch { stop() }

    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsLoading(true)
      const voices    = await loadVoices()
      const bestVoice = getBestFrenchVoice(voices)
      setIsLoading(false)

      const u  = new SpeechSynthesisUtterance(text)
      u.lang   = 'fr-FR'
      u.rate   = 0.95
      u.pitch  = 1.0
      u.volume = 1.0
      if (bestVoice) u.voice = bestVoice

      u.onstart = () => setIsSpeaking(true)
      u.onend   = () => { setIsSpeaking(false); setSpeakingId(null) }
      u.onerror = () => { setIsSpeaking(false); setSpeakingId(null) }
      window.speechSynthesis.speak(u)
    }
  }, [hasElevenLabs, stop])

  useEffect(() => () => stop(), [stop])

  return { speak, stop, isSpeaking, isLoading, speakingId, isSupported, audioRef }
}

// ── Lecture étape par étape avec pause ────────────────────────────
export function useStepByStepSpeech(steps) {
  const [stepIndex,  setStepIndex]  = useState(-1) // -1 = pas démarré
  const [isPaused,   setIsPaused]   = useState(false)
  const { speak, stop, isSpeaking, isSupported, audioRef: sharedAudioRef } = useSpeechSynthesis()
  const hasElevenLabs = !!import.meta.env.VITE_ELEVENLABS_API_KEY

  const totalSteps = steps?.length ?? 0
  const isActive   = stepIndex >= 0

  const readStep = useCallback(async (index) => {
    if (!steps || index < 0 || index >= steps.length) return
    // BUG-019 : ignorer les étapes vides plutôt que de les lire à voix haute.
    const stepText = steps[index]
    if (!stepText?.trim()) return
    setStepIndex(index)
    setIsPaused(false)
    await speak(`Étape ${index + 1} : ${stepText}`)
  }, [steps, speak])

  const start = useCallback(() => readStep(0), [readStep])

  const next  = useCallback(() => {
    const next = stepIndex + 1
    if (next < totalSteps) readStep(next)
    else { stop(); setStepIndex(-1) }
  }, [stepIndex, totalSteps, readStep, stop])

  const prev  = useCallback(() => {
    const prev = stepIndex - 1
    if (prev >= 0) readStep(prev)
  }, [stepIndex, readStep])

  const pause = useCallback(() => {
    if (hasElevenLabs && sharedAudioRef?.current) {
      sharedAudioRef.current.pause()
      setIsPaused(true)
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause()
      setIsPaused(true)
    }
  }, [hasElevenLabs, sharedAudioRef])

  const resume = useCallback(() => {
    if (hasElevenLabs && sharedAudioRef?.current) {
      sharedAudioRef.current.play().catch(() => {})
      setIsPaused(false)
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    }
  }, [hasElevenLabs, sharedAudioRef])

  const cancel = useCallback(() => {
    stop()
    setStepIndex(-1)
    setIsPaused(false)
  }, [stop])

  return {
    stepIndex, totalSteps, isActive, isSpeaking, isPaused, isSupported,
    start, next, prev, pause, resume, cancel,
  }
}

// ── Formateur de recette en texte naturel ─────────────────────────
export function recipeToSpeechText(recipe) {
  const parts = []

  // Intro naturelle
  const servings = recipe.servings
  const forWho = servings === 1 ? 'une personne' : `${servings} personnes`
  parts.push(`Allez, on fait ${recipe.name}${recipe.cuisine ? `, façon ${recipe.cuisine}` : ''}, pour ${forWho}.`)

  // Temps de façon conversationnelle
  if (recipe.prepTime || recipe.cookTime) {
    const times = []
    if (recipe.prepTime) times.push(`${recipe.prepTime} de prep`)
    if (recipe.cookTime)  times.push(`${recipe.cookTime} de cuisson`)
    parts.push(`Compte ${times.join(' et ')}.`)
  }

  // Ingrédients avec jointure naturelle
  if (recipe.ingredients?.length > 0) {
    const ingList = recipe.ingredients.map(ing => {
      const qty  = ing.quantity ? `${ing.quantity} ` : ''
      const unit = ing.unit     ? `${ing.unit} de ` : ''
      return `${qty}${unit}${ing.name}`
    })

    if (ingList.length === 1) {
      parts.push(`T'as besoin de ${ingList[0]}.`)
    } else {
      const last = ingList.pop()
      parts.push(`Pour les ingrédients, t'as besoin de ${ingList.join(', ')}, et ${last}.`)
    }
  }

  // Étapes avec transitions naturelles
  if (recipe.steps?.length > 0) {
    parts.push(`C'est parti pour la préparation.`)
    recipe.steps.forEach((step, i) => {
      // BUG-019 : ignorer les étapes vides pour éviter un crash ou un bruit.
      if (!step?.trim()) return
      const intro = i === 0
        ? 'On commence par'
        : i === recipe.steps.length - 1
          ? 'Pour finir,'
          : i === 1
            ? 'Ensuite,'
            : 'Après,'
      parts.push(`${intro} ${step.charAt(0).toLowerCase()}${step.slice(1)}`)
    })
  }

  // Astuce du chef
  if (recipe.chefTip) {
    parts.push(`Et mon petit conseil : ${recipe.chefTip}`)
  }

  parts.push(`Bonne dégustation !`)

  return parts.join(' ')
}
