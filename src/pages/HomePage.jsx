import { usePermissions } from '@/hooks/usePermissions'
import HomeFree    from '@/pages/home/HomeFree'
import HomePremium from '@/pages/home/HomePremium'

/**
 * HomePage — point d'entrée de l'accueil de l'application.
 *
 * Aiguillage :
 * - Free / Visiteur → HomeFree   (orientée découverte recettes + conversion Premium)
 * - Premium / Family → HomePremium (cockpit d'actions Premium)
 *
 * Cette page remplace l'ancien parcours "story plein écran" sur la home.
 * Les routes existantes (generator, bank, favorites, shopping, etc.) restent
 * accessibles via la navigation basse, donc aucun écran n'est supprimé.
 */
export default function HomePage() {
  const { isPremiumUser } = usePermissions()
  return isPremiumUser ? <HomePremium /> : <HomeFree />
}
