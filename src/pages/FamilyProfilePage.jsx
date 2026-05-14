import { useEffect, useMemo, useState } from 'react'
import {
  Users, Plus, Trash2, ChevronDown, ChevronUp, Sparkles, ArrowRight,
  User, Baby, CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import RobotChef from '@/components/mascot/RobotChef'
import MemberParticularityPanel from '@/components/onboarding/MemberParticularityPanel'
import {
  useFamilyStore,
  createMember,
  createEmptyParticularity,
} from '@/store/useFamilyStore'

/**
 * FamilyProfilePage — première page de l'application Chef IA.
 *
 * Permet à l'utilisateur de créer son profil famille :
 * - Nom de la famille
 * - Nombre d'adultes (compteur)
 * - Liste des enfants avec leur âge
 * - Pour CHAQUE membre, possibilité d'ajouter une « particularité » :
 *     régime, allergies, intolérances, kcal/protéines/féculents par repas,
 *     plan nutritionnel médical (PDF analysé par l'IA Vision).
 *
 * Cette page remplace l'ancienne LandingPage : elle s'affiche tant qu'aucun
 * profil n'a été enregistré (useFamilyStore.hasProfile() === false).
 *
 * Props :
 * - onComplete()  : callback appelé une fois le profil validé.
 * - onExplore?()  : optionnel — accès rapide « Mode visiteur » (banque seule).
 * - onPremium?()  : optionnel — accès direct à la page Premium.
 */
export default function FamilyProfilePage({ onComplete, onExplore, onPremium, asOverlay = true }) {
  const profile = useFamilyStore(s => s.profile)
  const setProfile = useFamilyStore(s => s.setProfile)

  // Vrai si l'utilisateur a déjà un profil enregistré (mode édition)
  const isEditing = !!(profile.members?.length)

  // ── État local : on n'écrit dans le store qu'à la validation finale.
  const [householdName, setHouseholdName] = useState(profile.householdName ?? '')
  const [members, setMembers] = useState(() => {
    if (profile.members?.length) return profile.members
    // Bootstrap : 2 adultes par défaut, conformément au profil vide.
    return [
      createMember({ kind: 'adult', name: 'Prénom adulte 1' }),
      createMember({ kind: 'adult', name: 'Prénom adulte 2' }),
    ]
  })

  // Membres dépliés (pour montrer/masquer le panneau particularité).
  const [openIds, setOpenIds] = useState(() => new Set())

  // ── Compteurs dérivés (affichage) ────────────────────────────────────
  const adultsCount   = useMemo(() => members.filter(m => m.kind === 'adult').length, [members])
  const childrenCount = useMemo(() => members.filter(m => m.kind === 'child').length, [members])

  // ── Mutations locales ────────────────────────────────────────────────
  const updateMember = (id, patch) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m))
  }
  const removeMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id))
    setOpenIds(prev => {
      const next = new Set(prev); next.delete(id); return next
    })
  }
  const addAdult = () => {
    const same = members.filter(m => m.kind === 'adult').length
    setMembers(prev => [...prev, createMember({ kind: 'adult', name: `Prénom adulte ${same + 1}` })])
  }
  const addChild = () => {
    const same = members.filter(m => m.kind === 'child').length
    setMembers(prev => [...prev, createMember({ kind: 'child', name: `Prénom enfant ${same + 1}`, age: 6 })])
  }
  const adjustAdults = (delta) => {
    if (delta > 0) {
      addAdult()
    } else {
      // BUG-006 : vérifier le minimum AVANT de modifier la liste.
      const adultsNow = members.filter(m => m.kind === 'adult').length
      if (adultsNow <= 1) return
      const list = [...members]
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].kind === 'adult') {
          list.splice(i, 1)
          break
        }
      }
      setMembers(list)
    }
  }

  const toggleParticularity = (id) => {
    const member = members.find(m => m.id === id)
    if (!member) return

    if (!member.particularity) {
      // Pas encore de particularité : on la crée et on ouvre le panneau
      setMembers(prev => prev.map(m =>
        m.id !== id ? m : { ...m, particularity: createEmptyParticularity() }
      ))
      setOpenIds(prev => { const next = new Set(prev); next.add(id); return next })
    } else {
      // Particularité déjà existante : on toggle juste l'affichage du panneau
      setOpenIds(prev => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    }
  }

  const updateParticularity = (id, patch) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== id) return m
      const part = m.particularity ?? createEmptyParticularity()
      return { ...m, particularity: { ...part, ...patch } }
    }))
  }

  // ── Validation ───────────────────────────────────────────────────────
  const canSubmit = adultsCount >= 1 && members.every(m => {
    if (m.kind === 'child') return Number.isFinite(m.age) && m.age >= 0
    return true
  })

  const [saved, setSaved] = useState(false)

  const handleSubmit = () => {
    if (!canSubmit) return
    setProfile({
      householdName: householdName.trim(),
      adults: adultsCount,
      children: members.filter(m => m.kind === 'child').map(c => ({ id: c.id, age: c.age, name: c.name })),
      members,
      diets:     dedup(members.flatMap(m => (m.particularity?.diet ? [m.particularity.diet] : []))),
      allergies: dedup(members.flatMap(m => m.particularity?.allergies ?? [])),
    })
    if (isEditing) {
      // Mode édition : confirmation flash, pas de redirection
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } else {
      onComplete?.()
    }
  }

  // ── Mascotte : sourit dès qu'on a tapé un nom de famille
  const expression = householdName.trim().length > 0 ? 'happy' : 'idle'

  // Scroll au top à l'arrivée
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div
      className={asOverlay ? 'fixed inset-0 z-[100] overflow-y-auto' : 'min-h-screen'}
      style={{
        backgroundImage:
          'repeating-linear-gradient(to right, #FFFBE6 0px, #FFFBE6 20px, #FFFFFF 20px, #FFFFFF 40px)',
      }}
    >

      {/* ────────────────── Lien passer discret ──────────────────── */}
      {onExplore && (
        <div className="flex justify-end px-4 pt-3">
          <button
            type="button"
            onClick={onExplore}
            className="text-[11px] text-dolce-blue-deep/30 hover:text-dolce-blue-deep/60 transition-colors"
          >
            Passer pour l'instant
          </button>
        </div>
      )}

      {/* ────────────────── Hero + Form ──────────────────── */}
      <div className="mx-auto max-w-[640px] px-4 pt-6 pb-12 space-y-7">

        {/* Hero */}
        <section className="flex flex-col items-center text-center pt-2 pb-1">
          <RobotChef expression={expression} size="lg" />
          <h1 className="font-display text-[24px] sm:text-[26px] text-dolce-blue-deep tracking-tight leading-tight mt-3">
            Créez votre profil famille
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed mt-1 max-w-sm">
            Dites-nous qui compose votre foyer — Chef Privé adaptera chaque recette à votre famille.
          </p>
        </section>

        {/* Nom de famille */}
        <Section title="Nom de la famille" icon={Users}>
          <input
            type="text"
            value={householdName}
            onChange={e => setHouseholdName(e.target.value)}
            placeholder="Ex. La famille Rossi"
            className="w-full h-12 px-4 rounded-2xl text-sm bg-white border border-dolce-blue-deep/15 focus:border-dolce-blue-deep/40 shadow-sm focus:shadow-md outline-none transition-shadow"
            autoFocus
          />
        </Section>

        {/* Compteur adultes */}
        <Section title="Adultes" icon={User}>
          <Counter
            value={adultsCount}
            onIncrement={() => adjustAdults(+1)}
            onDecrement={() => adjustAdults(-1)}
            min={1}
            max={10}
            suffix={adultsCount > 1 ? 'adultes' : 'adulte'}
          />
          <div className="space-y-2 mt-3">
            {members.filter(m => m.kind === 'adult').map((adult, idx) => (
              <AdultNameRow
                key={adult.id}
                adult={adult}
                index={idx}
                onChangeName={(name) => updateMember(adult.id, { name })}
              />
            ))}
          </div>
        </Section>

        {/* Compteur enfants + saisie d'âge par enfant */}
        <Section
          title="Enfants"
          icon={Baby}
          action={
            <button
              type="button"
              onClick={addChild}
              className="inline-flex items-center gap-1 text-xs font-semibold text-dolce-blue-deep hover:text-dolce-blue transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Ajouter un enfant
            </button>
          }
        >
          {childrenCount === 0 ? (
            <p className="text-xs text-muted-foreground italic">Pas d'enfants au foyer.</p>
          ) : (
            <div className="space-y-2">
              {members.filter(m => m.kind === 'child').map(child => (
                <ChildAgeRow
                  key={child.id}
                  child={child}
                  onChangeAge={(age) => updateMember(child.id, { age })}
                  onChangeName={(name) => updateMember(child.id, { name })}
                  onRemove={() => removeMember(child.id)}
                />
              ))}
            </div>
          )}
        </Section>

        {/* Liste de tous les membres (adultes + enfants) avec bouton particularité */}
        <Section
          title="Particularités par personne"
          subtitle="Régime, allergies, intolérances, plan médical… uniquement si concerné·e."
        >
          <div className="space-y-2.5">
            {members.map(m => (
              <MemberCard
                key={m.id}
                member={m}
                isOpen={openIds.has(m.id)}
                onUpdateName={(name) => updateMember(m.id, { name })}
                onToggle={() => toggleParticularity(m.id)}
                onUpdateParticularity={(patch) => updateParticularity(m.id, patch)}
                onRemoveParticularity={() => {
                  updateMember(m.id, { particularity: null })
                  setOpenIds(prev => { const n = new Set(prev); n.delete(m.id); return n })
                }}
              />
            ))}
          </div>
        </Section>

        {/* CTA principal */}
        <div className="pt-2 space-y-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              'inline-flex items-center justify-center gap-2 w-full h-13 py-3.5 rounded-2xl px-4',
              'bg-dolce-blue-deep text-dolce-yellow text-sm font-bold tracking-wide',
              'shadow-[0_8px_22px_-12px_rgba(36,40,140,0.55)]',
              'hover:shadow-[0_12px_26px_-12px_rgba(36,40,140,0.65)] hover:-translate-y-px transition-all',
              'disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed',
            )}
          >
            {saved
              ? <><CheckCircle2 className="h-4 w-4" /> Profil mis à jour !</>
              : isEditing
                ? <><Sparkles className="h-4 w-4" /> Enregistrer les modifications <ArrowRight className="h-4 w-4" /></>
                : <><Sparkles className="h-4 w-4" /> Créer mon profil famille <ArrowRight className="h-4 w-4" /></>
            }
          </button>
          {!isEditing && (
            <p className="text-[11px] text-muted-foreground/80 text-center leading-relaxed">
              Vous pourrez modifier votre profil à tout moment depuis vos réglages.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────── Sous-composants UI ─────────────── */

function dedup(arr) {
  return Array.from(new Set(arr.filter(Boolean)))
}

function Section({ title, subtitle, icon: Icon, action, children }) {
  return (
    <section className="space-y-2.5 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-dolce-blue-deep/8 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="h-8 w-8 rounded-xl bg-dolce-yellow-soft border border-dolce-blue-deep/10 flex items-center justify-center text-dolce-blue-deep">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div>
            <h2 className="font-display text-[15px] text-dolce-blue-deep tracking-tight uppercase">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function Counter({ value, onIncrement, onDecrement, min, max, suffix }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-2xl bg-white border border-dolce-blue-deep/15 p-1.5">
      <button
        type="button"
        onClick={onDecrement}
        disabled={value <= min}
        aria-label="Diminuer"
        className="h-9 w-9 rounded-xl flex items-center justify-center text-dolce-blue-deep hover:bg-dolce-yellow-soft disabled:opacity-30 transition-colors"
      >
        −
      </button>
      <span className="text-base font-bold tabular-nums text-dolce-blue-deep min-w-[2rem] text-center">
        {value}
      </span>
      {suffix && (
        <span className="text-xs text-muted-foreground pr-1">{suffix}</span>
      )}
      <button
        type="button"
        onClick={onIncrement}
        disabled={value >= max}
        aria-label="Augmenter"
        className="h-9 w-9 rounded-xl flex items-center justify-center text-dolce-blue-deep hover:bg-dolce-yellow-soft disabled:opacity-30 transition-colors"
      >
        +
      </button>
    </div>
  )
}

function AdultNameRow({ adult, index, onChangeName }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-dolce-blue-deep flex items-center justify-center shrink-0">
        <User className="h-3.5 w-3.5 text-dolce-yellow" />
      </div>
      <input
        type="text"
        value={adult.name ?? ''}
        onChange={e => onChangeName(e.target.value)}
        placeholder={`Prénom adulte ${index + 1}`}
        className="flex-1 min-w-0 h-10 px-3 text-sm rounded-xl bg-white border-2 border-dolce-blue-deep/20 focus:border-dolce-blue-deep/50 outline-none text-dolce-blue-deep font-semibold placeholder:font-normal placeholder:text-muted-foreground/50 transition-colors shadow-sm"
      />
    </div>
  )
}

function ChildAgeRow({ child, onChangeAge, onChangeName, onRemove }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-dolce-yellow-soft border border-dolce-blue-deep/15 flex items-center justify-center shrink-0">
        <Baby className="h-3.5 w-3.5 text-dolce-blue-deep" />
      </div>
      <input
        type="text"
        value={child.name ?? ''}
        onChange={e => onChangeName(e.target.value)}
        placeholder="Prénom de l'enfant"
        className="flex-1 min-w-0 h-10 px-3 text-sm rounded-xl bg-white border-2 border-dolce-blue-deep/20 focus:border-dolce-blue-deep/50 outline-none placeholder:text-muted-foreground/50 transition-colors shadow-sm"
      />
      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-dolce-blue-deep/70">
        Âge
        <input
          type="number"
          min="0"
          max="17"
          inputMode="numeric"
          value={child.age ?? ''}
          onChange={e => {
            const raw = e.target.value
            onChangeAge(raw === '' ? null : Math.max(0, Math.min(17, Number(raw))))
          }}
          className="w-14 h-9 px-2 text-sm rounded-xl bg-white border border-dolce-blue-deep/15 focus:border-dolce-blue-deep/40 outline-none text-center"
        />
        <span className="text-[11px] text-muted-foreground">ans</span>
      </label>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Retirer cet enfant"
        className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors shrink-0"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function MemberCard({
  member, isOpen,
  onUpdateName, onToggle, onUpdateParticularity, onRemoveParticularity,
}) {
  const hasParticularity = !!member.particularity
  const Icon = member.kind === 'child' ? Baby : User

  return (
    <div className={cn(
      'rounded-2xl border bg-white transition-all',
      hasParticularity
        ? 'border-dolce-blue-deep/30 shadow-dolce-soft'
        : 'border-dolce-blue-deep/10',
    )}>
      <div className="flex items-center gap-2 p-3">
        <div className={cn(
          'h-9 w-9 rounded-full flex items-center justify-center shrink-0 border',
          hasParticularity
            ? 'bg-dolce-blue-deep text-dolce-yellow border-dolce-blue-deep'
            : 'bg-dolce-yellow-soft text-dolce-blue-deep border-dolce-blue-deep/15',
        )}>
          <Icon className="h-4 w-4" />
        </div>

        <input
          type="text"
          value={member.name ?? ''}
          onChange={e => onUpdateName(e.target.value)}
          placeholder={member.kind === 'child' ? 'Prénom de l\'enfant' : 'Prénom de l\'adulte'}
          className="flex-1 min-w-0 h-9 px-3 text-sm font-semibold rounded-xl bg-white border-2 border-dolce-blue-deep/20 focus:border-dolce-blue-deep/50 outline-none text-dolce-blue-deep placeholder:font-normal placeholder:text-muted-foreground/50 transition-colors"
        />


        {member.kind === 'child' && Number.isFinite(member.age) && (
          <span className="text-[11px] font-semibold text-dolce-blue-deep/70 px-2 py-0.5 rounded-full bg-dolce-yellow-soft">
            {member.age} an{member.age > 1 ? 's' : ''}
          </span>
        )}

        <button
          type="button"
          onClick={onToggle}
          aria-label={hasParticularity ? 'Masquer les particularités' : 'Ajouter une particularité'}
          className={cn(
            'ml-auto shrink-0 h-8 px-2.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-colors',
            hasParticularity
              ? 'bg-dolce-blue-deep text-dolce-yellow'
              : 'bg-dolce-yellow-soft text-dolce-blue-deep hover:bg-dolce-yellow/40',
          )}
        >
          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {hasParticularity ? 'Particularités' : 'Ajouter'}
        </button>
      </div>

      {isOpen && member.particularity && (
        <div className="px-3 pb-3">
          <MemberParticularityPanel
            member={member}
            onUpdate={onUpdateParticularity}
            onRemove={onRemoveParticularity}
          />
        </div>
      )}
    </div>
  )
}
