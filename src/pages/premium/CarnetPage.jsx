import { useState }                       from 'react'
import { useCarnetStore, CARNET_TAGS, SOURCE_LABEL } from '@/store/useCarnetStore'
import { cn }                             from '@/lib/utils'
import { Search, Trash2, Tag, Pencil, Check, X, BookOpen, Clock } from 'lucide-react'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function CarnetCard({ entry, onRemove }) {
  const { toggleTag, updateNote }  = useCarnetStore()
  const [editNote, setEditNote]    = useState(false)
  const [noteText, setNoteText]    = useState(entry.note)
  const [showAll,  setShowAll]     = useState(false)

  const recipe = entry.recipe
  const nom    = recipe.nom ?? recipe.name ?? 'Sans titre'
  const source = SOURCE_LABEL[entry.source] ?? SOURCE_LABEL.ai

  const saveNote = () => {
    updateNote(entry.id, noteText)
    setEditNote(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={cn('inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full', source.color)}>
                {source.emoji} {source.label}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {formatDate(entry.createdAt)}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-sm leading-snug">{nom}</h3>
            {recipe.description && (
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 italic">{recipe.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onRemove(entry.id)}
            className="shrink-0 p-1.5 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Supprimer du carnet"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats mini */}
      <div className="px-4 pb-3 flex items-center gap-3 text-xs text-gray-400">
        {recipe.prepTime && <span>⏱️ {recipe.prepTime}</span>}
        {recipe.servings && <span>👤 {recipe.servings} pers.</span>}
        {recipe.coutParPersonne != null && (
          <span className="text-emerald-600 font-semibold">
            💰 {recipe.coutParPersonne.toFixed(2).replace('.', ',')} €/pers.
          </span>
        )}
        {recipe.difficulty && <span>{recipe.difficulty}</span>}
      </div>

      {/* Tags */}
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-1.5">
          {CARNET_TAGS.map(tag => {
            const active = entry.tags.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(entry.id, tag)}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-xl border text-xs font-medium transition-all',
                  active
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                    : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-emerald-200 hover:text-emerald-500'
                )}
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </button>
            )
          })}
        </div>
      </div>

      {/* Note personnelle */}
      <div className="px-4 pb-4 border-t border-gray-50 pt-3">
        {editNote ? (
          <div className="flex flex-col gap-2">
            <textarea
              rows={3}
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Ma note personnelle…"
              className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300 text-gray-700"
            />
            <div className="flex gap-2">
              <button type="button" onClick={saveNote}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors">
                <Check className="h-3 w-3" /> Enregistrer
              </button>
              <button type="button" onClick={() => { setNoteText(entry.note); setEditNote(false) }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-50 transition-colors">
                <X className="h-3 w-3" /> Annuler
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditNote(true)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-600 transition-colors"
          >
            <Pencil className="h-3 w-3" />
            {entry.note ? <span className="italic text-gray-500">"{entry.note}"</span> : 'Ajouter une note…'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function CarnetPage({ onBack }) {
  const { entries, removeEntry } = useCarnetStore()
  const [search,    setSearch]   = useState('')
  const [tagFilter, setTagFilter] = useState('')

  const filtered = entries.filter(e => {
    const nom = (e.recipe.nom ?? e.recipe.name ?? '').toLowerCase()
    if (search && !nom.includes(search.toLowerCase())) return false
    if (tagFilter && !e.tags.includes(tagFilter)) return false
    return true
  })

  const usedTags = [...new Set(entries.flatMap(e => e.tags))].filter(Boolean)

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-5">

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-amber-100 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h2 className="font-bold text-gray-800">Mon carnet de recettes</h2>
          <p className="text-xs text-gray-500">{entries.length} recette{entries.length > 1 ? 's' : ''} sauvegardée{entries.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📖</div>
          <p className="text-gray-500 font-medium text-sm">Votre carnet est vide</p>
          <p className="text-gray-400 text-xs mt-1">Sauvegardez des recettes générées par l'IA depuis n'importe quelle fonctionnalité Premium</p>
        </div>
      ) : (
        <>
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une recette…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Filtre par tag */}
          {usedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTagFilter('')}
                className={cn(
                  'px-3 py-1.5 rounded-xl border text-xs font-medium transition-all',
                  !tagFilter ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-500 border-gray-200 hover:border-amber-300'
                )}
              >
                Tous
              </button>
              {usedTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTagFilter(tag === tagFilter ? '' : tag)}
                  className={cn(
                    'flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all',
                    tagFilter === tag ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-500 border-gray-200 hover:border-amber-300'
                  )}
                >
                  <Tag className="h-2.5 w-2.5" /> {tag}
                </button>
              ))}
            </div>
          )}

          {/* Résultats */}
          <p className="text-xs text-gray-400">
            {filtered.length} recette{filtered.length > 1 ? 's' : ''}
            {(search || tagFilter) ? ' (filtrée' + (filtered.length > 1 ? 's' : '') + ')' : ''}
          </p>

          <div className="space-y-4">
            {filtered.map(entry => (
              <CarnetCard key={entry.id} entry={entry} onRemove={removeEntry} />
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-8">Aucune recette ne correspond à votre recherche.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
