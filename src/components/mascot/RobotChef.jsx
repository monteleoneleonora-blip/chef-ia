/**
 * Chef IA — Mascotte (image PNG fournie : public/chef.png)
 *
 * L'image est presentee dans un cercle arrondi avec fond doux,
 * pour eviter le rendu carre brut.
 *
 * mix-blend-mode: multiply tente de faire disparaitre un fond blanc/uni
 * (typique des PNG generes par IA). Si l'image a un vrai canal alpha
 * (transparence), c'est neutre. Si elle a un fond blanc, le blanc devient
 * transparent et on voit le fond du conteneur.
 */
import { useState } from 'react'
import { cn } from '@/lib/utils'

const SIZES = { xs: 44, sm: 64, md: 96, lg: 136, xl: 192 }

const ACCESSORY_EMOJI = {
  spatula: '🥄',
  whisk:   '🧁',
  pasta:   '🍝',
  pizza:   '🍕',
}

export default function RobotChef({ expression = 'idle', accessory = null, size = 'md', className }) {
  const px = SIZES[size] ?? SIZES.md
  const [imgOk, setImgOk] = useState(true)

  // Le chef est statique : aucune animation perpétuelle (cooking/excited/idle/bob).
  // Seul l'état "loading" garde un retour visuel discret car il informe l'utilisateur
  // qu'un traitement est en cours. L'API (prop `expression`) reste inchangée pour
  // ne casser aucun appel existant.
  const animClass = expression === 'loading' ? 'animate-spin' : ''

  const badgeSize = Math.round(px * 0.32)

  return (
    <div
      className={cn('relative inline-block select-none', animClass, className)}
      style={{ width: px, height: px }}
      aria-label={`Chef Privé ${expression}`}
    >
      {imgOk ? (
        // Container rond avec fond degrade subtil + ombre douce
        <div className="absolute inset-0 rounded-full overflow-hidden bg-gradient-to-br from-dolce-yellow-soft via-white to-dolce-yellow-soft shadow-dolce-soft border border-white">
          <img
            src="/chef.png"
            alt=""
            draggable={false}
            onError={() => setImgOk(false)}
            className="h-full w-full object-cover"
            // mix-blend-mode multiply : fait disparaitre le fond blanc/clair
            // tout en preservant le sujet. Sans effet si l'image est deja
            // transparente (canal alpha).
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-dolce-yellow via-dolce-yellow-soft to-white shadow-dolce-warm border-2 border-dolce-blue-deep flex items-center justify-center">
          <span
            role="img"
            aria-hidden="true"
            style={{ fontSize: Math.round(px * 0.65), lineHeight: 1 }}
          >
            👨‍🍳
          </span>
        </div>
      )}

      {accessory && ACCESSORY_EMOJI[accessory] && (
        <div
          className="absolute -bottom-1 -right-1 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-dolce-yellow"
          style={{
            width:  badgeSize,
            height: badgeSize,
            fontSize: Math.round(badgeSize * 0.55),
          }}
          aria-hidden="true"
        >
          {ACCESSORY_EMOJI[accessory]}
        </div>
      )}
    </div>
  )
}
