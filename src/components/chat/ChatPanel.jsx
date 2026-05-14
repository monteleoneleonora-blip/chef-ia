import { useState, useRef, useEffect, useCallback } from 'react'
import { useChatStore }           from '@/store/useChatStore'
import { useRecipeBankStore }     from '@/store/useRecipeBankStore'
import { useSubscriptionStore }   from '@/store/useSubscriptionStore'
import { chatWithChef, extractRecipeFromChat } from '@/api/chat'
import { useSpeechSynthesis }     from '@/hooks/useSpeechSynthesis'
import UpgradeModal               from '@/components/subscription/UpgradeModal'
import RobotChef from '@/components/mascot/RobotChef'
import { Button } from '@/components/ui/button'
import { Send, X, Trash2, ChevronDown, Mic, MicOff, Volume2, VolumeX, Square, Loader2, BookmarkPlus, CheckCircle2, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

// L'extraction est désormais centralisée dans @/api/chat.js (extractRecipeFromChat)
// pour qu'elle bénéficie de normalizeRecipe et soit testable en isolation.

// Retire le bloc JSON du texte affiché
function cleanMessageText(text) {
  return text.replace(/```recipe-json\n[\s\S]*?\n```/g, '').trim()
}

const SUGGESTIONS = [
  'Comment réduire le sel dans mes recettes ?',
  'Quel substitut pour le beurre ?',
  'Comment adapter une recette pour un enfant ?',
  'Qu\'est-ce qu\'une brunoise ?',
  'Comment savoir si je suis intolérant au gluten ?',
]

// ── Détection support Web Speech API ──────────────────────────
const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? (window.SpeechRecognition || window.webkitSpeechRecognition)
    : null

// ── Hook reconnaissance vocale ─────────────────────────────────
function useSpeechRecognition({ onInterim, onFinal, onError }) {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  // Refs pour toujours avoir les callbacks les plus récents sans recréer start()
  const onInterimRef = useRef(onInterim)
  const onFinalRef   = useRef(onFinal)
  const onErrorRef   = useRef(onError)
  useEffect(() => { onInterimRef.current = onInterim }, [onInterim])
  useEffect(() => { onFinalRef.current   = onFinal   }, [onFinal])
  useEffect(() => { onErrorRef.current   = onError   }, [onError])

  const isSupported = !!SpeechRecognitionAPI

  const start = useCallback(() => {
    if (!isSupported || isListening) return

    const rec = new SpeechRecognitionAPI()
    rec.lang            = 'fr-FR'
    rec.continuous      = false
    rec.interimResults  = true
    rec.maxAlternatives = 1

    rec.onstart = () => setIsListening(true)

    rec.onresult = (e) => {
      let interim = ''
      let final   = ''
      for (const result of e.results) {
        if (result.isFinal) final   += result[0].transcript
        else                interim += result[0].transcript
      }
      // Utilise les refs pour toujours appeler la version la plus récente
      if (interim) onInterimRef.current?.(interim)
      if (final)   onFinalRef.current?.(final)
    }

    rec.onerror = (e) => {
      setIsListening(false)
      if (e.error !== 'aborted' && e.error !== 'no-speech') {
        onErrorRef.current?.(e.error)
      }
    }

    rec.onend = () => setIsListening(false)

    recognitionRef.current = rec
    rec.start()
  }, [isSupported, isListening]) // plus besoin des callbacks dans les deps

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const toggle = useCallback(() => {
    if (isListening) stop()
    else             start()
  }, [isListening, start, stop])

  // Nettoie quand le composant est démonté
  useEffect(() => () => recognitionRef.current?.abort(), [])

  return { isListening, isSupported, toggle, stop }
}

// ── Timer pendant le streaming ─────────────────────────────────
function useStreamTimer(active) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (!active) { setElapsed(0); return }
    const t = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [active])
  return elapsed
}

// ── Composant Message ──────────────────────────────────────────
function Message({ msg, isStreaming, onSpeak, isSpeaking, isLoading, onSaveRecipe }) {
  const isUser  = msg.role === 'user'
  // Toujours nettoyer le JSON, même pendant le streaming
  const display = cleanMessageText(msg.content)
  const recipe  = !isUser && !isStreaming ? extractRecipeFromChat(msg.content) : null
  const [saved, setSaved] = useState(false)
  const elapsed = useStreamTimer(isStreaming && !isUser)

  const handleSave = () => {
    onSaveRecipe?.(recipe)
    setSaved(true)
  }

  return (
    <div className={cn('flex gap-2.5 items-end', isUser && 'flex-row-reverse')}>
      {!isUser && (
        <div className="shrink-0 mb-0.5">
          <RobotChef
            expression={isStreaming ? 'loading' : isSpeaking ? 'excited' : 'happy'}
            size="xs"
            accessory="spatula"
          />
        </div>
      )}

      <div className="flex flex-col gap-1 max-w-[78%]">
        <div className={cn(
          'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-white border border-border/60 text-foreground rounded-bl-sm shadow-sm'
        )}>
          {display}
          {isStreaming && !display && (
            <span className="flex gap-1 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{animationDelay:'0ms'}}/>
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{animationDelay:'150ms'}}/>
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{animationDelay:'300ms'}}/>
            </span>
          )}
        </div>

        {/* Timer pendant la génération */}
        {isStreaming && !isUser && (
          <span className="self-start flex items-center gap-1 text-[10px] text-muted-foreground/50 px-1">
            <Loader2 className="h-2.5 w-2.5 animate-spin" />
            {elapsed}s
          </span>
        )}


        {/* Bouton sauvegarder la recette */}
        {recipe && (
          <button
            type="button"
            onClick={handleSave}
            disabled={saved}
            className={cn(
              'self-start flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-xl border transition-all',
              saved
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 cursor-default'
                : 'bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:shadow-sm'
            )}
          >
            {saved
              ? <><CheckCircle2 className="h-3.5 w-3.5" /> Recette sauvegardée !</>
              : <><BookmarkPlus className="h-3.5 w-3.5" /> Sauvegarder « {recipe.name} »</>
            }
          </button>
        )}

        {/* Bouton lire à voix haute */}
        {!isUser && !isStreaming && msg.content && onSpeak && (
          <button
            type="button"
            onClick={() => onSpeak(display, msg.id)}
            title={isSpeaking ? 'Arrêter la lecture' : 'Lire à voix haute'}
            className={cn(
              'self-start flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-all',
              isSpeaking
                ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                : isLoading
                ? 'bg-amber-50 border-amber-200 text-amber-600'
                : 'bg-transparent border-transparent text-muted-foreground/40 hover:border-border hover:text-muted-foreground'
            )}
          >
            {isSpeaking
              ? <><Square className="h-2.5 w-2.5 fill-current" /> Stop</>
              : isLoading
              ? <><Loader2 className="h-2.5 w-2.5 animate-spin" /> Chargement…</>
              : <><Volume2 className="h-2.5 w-2.5" /> Écouter</>
            }
          </button>
        )}
      </div>

      {!isStreaming && (
        <span className={cn('text-[10px] text-muted-foreground/50 mb-1 shrink-0', isUser ? 'mr-1' : 'ml-1')}>
          {new Date(msg.ts).toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  )
}

// ── Composant principal ────────────────────────────────────────
export default function ChatPanel() {
  const { messages, isOpen, addMessage, updateLastAssistant, clearHistory, setOpen } = useChatStore()
  const recipes   = useRecipeBankStore(s => s.recipes)
  const addManual = useRecipeBankStore(s => s.addManual)
  const [input,        setInput]        = useState('')
  const [isLoading,    setIsLoading]    = useState(false)
  const [error,        setError]        = useState(null)
  const [voiceError,   setVoiceError]   = useState(null)
  const [interimText,  setInterimText]  = useState('')
  const [autoSpeak,    setAutoSpeak]    = useState(false) // lecture auto des réponses
  const [showUpgrade,  setShowUpgrade]  = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef       = useRef(null)

  const { speak, stop, isSpeaking, isLoading: ttsLoading, speakingId, isSupported: ttsSupported } = useSpeechSynthesis()

  // Refs pour éviter que TTS soit dans les dépendances de send → pas d'interférence avec le micro
  const speakRef     = useRef(speak)
  const autoSpeakRef = useRef(autoSpeak)
  useEffect(() => { speakRef.current     = speak     }, [speak])
  useEffect(() => { autoSpeakRef.current = autoSpeak }, [autoSpeak])

  // Ref pour stop TTS → évite de recréer l'effet de fermeture du panel
  const stopTtsRef = useRef(stop)
  useEffect(() => { stopTtsRef.current = stop }, [stop])

  // ── Auto-scroll ──
  useEffect(() => {
    if (isOpen) setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [messages, isOpen])

  // ── Focus à l'ouverture ──
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150)
  }, [isOpen])

  // ── Envoi du message ──
  const send = useCallback(async (text) => {
    const content = (text ?? input).trim()
    if (!content || isLoading) return

    // Vérification quota — lit le state frais sans mettre canChat dans les deps
    if (!useSubscriptionStore.getState().canChat()) {
      setShowUpgrade(true)
      return
    }

    setInput('')
    setInterimText('')
    setError(null)
    addMessage('user', content)
    setIsLoading(true)
    addMessage('assistant', '')

    try {
      const apiMessages = [
        ...messages,
        { role: 'user', content },
      ].map(({ role, content: c }) => ({ role, content: c }))

      let finalText = ''
      await chatWithChef(apiMessages, (partial) => {
        updateLastAssistant(partial)
        finalText = partial
      }, recipes)

      // Comptabilise le message envoyé
      useSubscriptionStore.getState().trackChatMessage()
      // Lecture auto via ref → pas dans les dépendances de send
      if (autoSpeakRef.current && finalText) speakRef.current(finalText)
    } catch (err) {
      updateLastAssistant("Désolé, une erreur est survenue. Réessaie dans un instant !")
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages, addMessage, updateLastAssistant])

  // ── Reconnaissance vocale ──
  const { isListening, isSupported, toggle: toggleVoice, stop: stopVoice } = useSpeechRecognition({
    onInterim: (text) => setInterimText(text),
    onFinal:   (text) => {
      setInterimText('')
      const combined = (input + ' ' + text).trim()
      setInput(combined)
      // Auto-envoi après un court délai pour laisser l'utilisateur voir le texte
      setTimeout(() => send(combined), 600)
    },
    onError: (errCode) => {
      const msgs = {
        'not-allowed':    'Accès au microphone refusé. Autorisez-le dans les paramètres du navigateur.',
        'network':        'Erreur réseau lors de la reconnaissance vocale.',
        'audio-capture':  'Aucun microphone détecté.',
      }
      setVoiceError(msgs[errCode] ?? `Erreur vocale : ${errCode}`)
      setTimeout(() => setVoiceError(null), 4000)
    },
  })

  // Arrête reconnaissance et lecture si le panel se ferme
  useEffect(() => {
    if (!isOpen) { stopVoice(); stopTtsRef.current() }
  }, [isOpen, stopVoice])

  // Ferme le panel avec Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, setOpen])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  // Texte affiché dans le textarea (input réel ou texte intermédiaire vocal)
  const displayValue = isListening && interimText ? interimText : input

  return (
    <>
      {/* ── Bouton flottant — discret, ne masque pas la nav (64px + 12px d'air) ── */}
      <button
        type="button"
        onClick={() => setOpen(!isOpen)}
        style={{ bottom: 'calc(76px + env(safe-area-inset-bottom))' }}
        className={cn(
          'fixed right-4 z-40 h-11 w-11 rounded-full flex items-center justify-center',
          'bg-dolce-blue-deep text-dolce-yellow border border-dolce-yellow/30',
          'shadow-[0_8px_22px_-8px_rgba(36,40,140,0.45)]',
          'hover:shadow-[0_10px_24px_-8px_rgba(36,40,140,0.55)] hover:-translate-y-0.5',
          'transition-all duration-200',
          isOpen && 'scale-95'
        )}
        title={isOpen ? 'Fermer Chef Privé' : 'Discuter avec Chef Privé'}
        aria-label={isOpen ? 'Fermer le chat avec Chef Privé' : 'Ouvrir le chat avec Chef Privé'}
      >
        {isOpen
          ? <ChevronDown className="h-5 w-5" />
          : <RobotChef expression="idle" size="xs" />
        }
        {!isOpen && messages.length === 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-dolce-orange ring-2 ring-background" />
        )}
      </button>

      {/* ── Panel de chat ── */}
      {isOpen && (
        <div
          style={{ bottom: 'calc(132px + env(safe-area-inset-bottom))' }}
          className={cn(
            'fixed right-4 z-50 w-[370px] max-h-[560px] flex flex-col',
            'bg-background rounded-2xl border border-dolce-blue-deep/15 shadow-dolce-deep',
            'transition-all duration-200 animate-in slide-in-from-bottom-4 fade-in-0',
            'max-sm:right-0 max-sm:left-0 max-sm:w-full max-sm:max-h-[calc(100dvh-200px)] max-sm:rounded-b-none'
          )}
        >

          {/* ── En-tête ── */}
          <div className="flex items-center gap-3 px-4 py-3 border-b-4 border-dolce-yellow bg-dolce-blue-deep rounded-t-2xl max-sm:rounded-t-none">
            <RobotChef expression={isListening ? 'excited' : isLoading ? 'cooking' : 'happy'} size="xs" />
            <div className="flex-1 min-w-0">
              <p className="text-dolce-yellow font-display text-sm uppercase tracking-wide">Chef Privé</p>
              <p className="text-dolce-yellow/70 text-[10px] truncate">
                {isListening ? 'Je vous écoute…' : isLoading ? 'En train de réfléchir…' : 'Votre commis numérique'}
              </p>
            </div>
            <div className="flex gap-1.5">
              {/* Toggle lecture auto */}
              {ttsSupported && (
                <button
                  type="button"
                  onClick={() => { setAutoSpeak(v => !v); if (isSpeaking) stop() }}
                  title={autoSpeak ? 'Désactiver la lecture vocale' : 'Activer la lecture vocale automatique'}
                  className={cn(
                    'h-7 w-7 rounded-full flex items-center justify-center transition-colors',
                    autoSpeak
                      ? 'bg-dolce-yellow/20 text-dolce-yellow hover:bg-dolce-yellow/30'
                      : 'text-dolce-yellow/50 hover:text-dolce-yellow hover:bg-dolce-yellow/15'
                  )}
                >
                  {autoSpeak
                    ? <Volume2 className="h-3.5 w-3.5" />
                    : <VolumeX className="h-3.5 w-3.5" />
                  }
                </button>
              )}
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearHistory}
                  title="Effacer la conversation"
                  className="h-7 w-7 rounded-full flex items-center justify-center text-dolce-yellow/60 hover:text-dolce-yellow hover:bg-dolce-yellow/15 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-7 w-7 rounded-full flex items-center justify-center text-dolce-yellow/60 hover:text-dolce-yellow hover:bg-dolce-yellow/15 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" aria-live="polite" aria-label="Conversation avec Chef Privé">
            {messages.length === 0 && (
              <div className="text-center space-y-3 py-4">
                <RobotChef expression="excited" size="md" className="mx-auto robot-idle" />
                <div>
                  <p className="font-bold text-sm">Bonjour ! Je suis Chef Privé 👨‍🍳</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Posez-moi toutes vos questions culinaires — recettes, techniques, nutrition, intolérances…
                  </p>
                  {isSupported && (
                    <p className="text-xs text-emerald-600 mt-1">
                      🎤 Parlez directement avec le micro !
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="w-full text-left text-xs px-3 py-2 rounded-xl border border-border/60 bg-muted/40 hover:bg-muted hover:border-primary/30 transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <Message
                key={msg.id}
                msg={msg}
                isStreaming={isLoading && i === messages.length - 1 && msg.role === 'assistant'}
                onSpeak={ttsSupported ? (text, id) => isSpeaking && speakingId === id ? stop() : speak(text, id) : null}
                isSpeaking={isSpeaking && speakingId === msg.id}
                isLoading={ttsLoading && speakingId === msg.id}
                onSaveRecipe={(recipe) => addManual({ ...recipe, isManual: true })}
              />
            ))}

            {error && (
              <p className="text-xs text-destructive text-center bg-destructive/10 px-3 py-2 rounded-xl">
                {error}
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Erreur vocale ── */}
          {voiceError && (
            <div className="mx-3 mb-1 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 text-center">
              {voiceError}
            </div>
          )}

          {/* ── Indicateur d'écoute ── */}
          {isListening && (
            <div className="mx-3 mb-1 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-xs text-emerald-700 font-medium">
                {interimText || 'Parlez maintenant…'}
              </span>
            </div>
          )}

          {/* ── Zone de saisie ── */}
          <div className="p-3 border-t border-border/40 bg-muted/20">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={displayValue}
                onChange={e => { if (!isListening) setInput(e.target.value) }}
                onKeyDown={handleKey}
                placeholder={isListening ? 'En écoute…' : 'Posez votre question à Chef Privé…'}
                aria-label="Message à envoyer au chef"
                rows={1}
                disabled={isLoading}
                readOnly={isListening}
                className={cn(
                  'flex-1 resize-none rounded-xl border border-border bg-white px-3 py-2.5 text-sm',
                  'focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/60',
                  'disabled:opacity-50 max-h-28 min-h-[42px] leading-relaxed',
                  isListening && 'border-red-300 bg-red-50/30 text-muted-foreground italic'
                )}
                style={{ fieldSizing: 'content' }}
              />

              {/* Bouton micro */}
              {isSupported && (
                <button
                  type="button"
                  onClick={toggleVoice}
                  disabled={isLoading}
                  title={isListening ? 'Arrêter la reconnaissance vocale' : 'Parler à Chef Privé'}
                  className={cn(
                    'h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200',
                    'border focus:outline-none',
                    isListening
                      ? 'bg-red-500 border-red-600 text-white hover:bg-red-600 animate-pulse'
                      : 'bg-white border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5',
                    isLoading && 'opacity-40 cursor-not-allowed'
                  )}
                >
                  {isListening
                    ? <MicOff className="h-4 w-4" />
                    : <Mic className="h-4 w-4" />
                  }
                </button>
              )}

              {/* Bouton envoyer */}
              <Button
                type="button"
                size="icon"
                disabled={(!input.trim() && !interimText) || isLoading || isListening}
                onClick={() => send()}
                className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-1.5">
              <p className="text-[10px] text-muted-foreground/50">
                {isSupported
                  ? 'Entrée pour envoyer · Maj+Entrée saut de ligne · 🎤 pour parler'
                  : 'Entrée pour envoyer · Maj+Entrée pour saut de ligne'
                }
              </p>
              <ChatUsagePill onUpgrade={() => setShowUpgrade(true)} />
            </div>
          </div>
        </div>
      )}

      {showUpgrade && (
        <UpgradeModal reason="chat" onClose={() => setShowUpgrade(false)} />
      )}
    </>
  )
}

// ── Indicateur de quota chat ──────────────────────────────────────
function ChatUsagePill({ onUpgrade }) {
  const sub = useSubscriptionStore()
  const plan = sub.getPlan()
  if (plan.chatMessages === Infinity) return null

  const remaining = sub.remainingChat()
  const isLow     = remaining <= 5

  return (
    <button
      type="button"
      onClick={onUpgrade}
      className={cn(
        'flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border transition-colors',
        isLow
          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
          : 'bg-muted/50 border-border/50 text-muted-foreground/60 hover:text-muted-foreground'
      )}
    >
      <Crown className="h-2.5 w-2.5" />
      {remaining} msg
    </button>
  )
}
