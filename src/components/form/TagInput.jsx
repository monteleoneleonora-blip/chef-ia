import { useState, useRef } from 'react'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Variantes de couleur pour les chips selon le contexte */
const CHIP_VARIANTS = {
  default:  'bg-primary text-primary-foreground',
  danger:   'bg-destructive text-destructive-foreground',
  warning:  'bg-amber-500 text-white',
  neutral:  'bg-muted text-muted-foreground border border-border',
}

/**
 * Champ de saisie avec système de tags.
 * Valider avec Entrée ou virgule. Supprimer avec Backspace ou ×.
 */
export default function TagInput({ tags, onAdd, onRemove, placeholder = 'Ajouter...', chipVariant = 'default' }) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  const submit = (value) => {
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setInputValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      submit(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onRemove(tags.length - 1)
    }
  }

  const chipClass = CHIP_VARIANTS[chipVariant] ?? CHIP_VARIANTS.default

  return (
    <div
      className="flex flex-wrap gap-1.5 min-h-10 p-2 border border-input rounded-md bg-background cursor-text focus-within:ring-1 focus-within:ring-ring transition-shadow"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, index) => (
        <span
          key={index}
          className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium max-w-[180px]', chipClass)}
          title={tag}
        >
          <span className="truncate">{tag}</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(index) }}
            className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            aria-label={`Supprimer ${tag}`}
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </span>
      ))}

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => submit(inputValue)}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[100px] border-none outline-none bg-transparent text-sm placeholder:text-muted-foreground"
        aria-label={placeholder}
      />
    </div>
  )
}
