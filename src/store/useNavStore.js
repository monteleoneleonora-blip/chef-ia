import { create } from 'zustand'

/**
 * Navigation store — permet a n'importe quel composant de declencher
 * une navigation vers une page principale ou une sous-page Premium
 * sans prop drilling.
 *
 * Usage :
 *   useNavStore.getState().goToPage('shopping')   // page principale
 *   useNavStore.getState().goToPremium('frigo')   // sous-page premium
 */
export const useNavStore = create(set => ({
  // Cible pour la nav racine (App.jsx la consomme via useEffect)
  pageTarget: null,
  // Cible pour la sous-page Premium (PremiumPage la consomme)
  premiumTarget: null,
  // Filtre transmis a la banque de recettes lors d'une navigation
  // depuis les acces rapides (RecipeBankPage le consomme via useEffect)
  // Forme : { mealType?: string, search?: string, tag?: string }
  bankFilter: null,

  goToPage:           (page, options = {}) => set({
    pageTarget: page,
    bankFilter: options.bankFilter ?? null,
  }),
  consumePageTarget:  () => set({ pageTarget: null }),

  goToPremium:          (sub) => set({ premiumTarget: sub }),
  consumePremiumTarget: ()    => set({ premiumTarget: null }),

  consumeBankFilter:    () => set({ bankFilter: null }),
}))
