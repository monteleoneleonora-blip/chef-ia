import { useState, useCallback } from 'react'
import { fetchRecipes }          from '../api/claude'
import { fetchBatchCooking }     from '../api/batchCookingAI'
import { matchRecipesFromBank }  from '../api/recipeMatcher'
import { useRecipeBankStore }    from '../store/useRecipeBankStore'
import { useSubscriptionStore }  from '../store/useSubscriptionStore'
import { useBatchStore }         from '../store/useBatchStore'

export function useRecipeGeneration() {
  const [recipes,      setRecipes]      = useState(null)
  const [batchPlan,    setBatchPlan]    = useState(null)
  const [isLoading,    setIsLoading]    = useState(false)
  const [isBatch,      setIsBatch]      = useState(false)
  const [error,        setError]        = useState(null)
  const [showUpgrade,  setShowUpgrade]  = useState(false)

  const addToBank  = useRecipeBankStore(s => s.addRecipes)
  const savePlan   = useBatchStore(s => s.savePlan)

  const _checkAccess = () => {
    const sub = useSubscriptionStore.getState()
    if (!sub.canUseAI()) { setShowUpgrade(true); return null }
    if (!sub.canGenerate() || !sub.canPersonalize()) { setShowUpgrade(true); return null }
    return sub
  }

  /** Génération classique — base maîtresse d'abord, IA en fallback */
  const generateRecipes = useCallback(async (formData) => {
    const sub = _checkAccess()
    if (!sub) return

    setIsLoading(true)
    setError(null)
    setRecipes(null)
    setBatchPlan(null)
    setIsBatch(false)

    try {
      // ── 1. Chercher dans la base maîtresse ──────────────────────────────
      const { results: dbResults, missing } = matchRecipesFromBank(formData)

      if (missing.length === 0 && dbResults.length > 0) {
        // La base couvre entièrement la demande — pas d'IA nécessaire
        setRecipes(dbResults)
        sub.trackGeneration()
        if (!sub.isPremium()) sub.trackPersonalizedRecipe()
        return
      }

      // ── 2. Fallback IA pour les recettes manquantes ──────────────────────
      // Construire un formData réduit aux types manquants
      const missingCounts = {}
      for (const m of missing) {
        const key = Object.keys({ breakfast: 'petit-déjeuner', lunch: 'déjeuner', dinner: 'dîner' })
          .find(k => ({ breakfast: 'petit-déjeuner', lunch: 'déjeuner', dinner: 'dîner' }[k] === m.type)
          )
        if (key) missingCounts[key] = m.asked - m.found
      }

      const partialFormData = { ...formData, mealCounts: missingCounts }
      const aiResult = await fetchRecipes(partialFormData)

      // Fusionner résultats DB + IA
      const combined = [...dbResults, ...(Array.isArray(aiResult) ? aiResult : [])]
      setRecipes(combined)
      sub.trackGeneration()
      if (!sub.isPremium()) sub.trackPersonalizedRecipe()
      // Sauvegarder uniquement les recettes IA dans la banque (les DB sont déjà persistées)
      if (aiResult?.length) addToBank(aiResult)
    } catch (err) {
      setError(err.message ?? 'Une erreur inattendue est survenue.')
    } finally {
      setIsLoading(false)
    }
  }, [addToBank])

  /** Génération d'un plan batch cooking complet */
  const generateBatchCooking = useCallback(async (formData) => {
    const sub = _checkAccess()
    if (!sub) return

    setIsLoading(true)
    setError(null)
    setRecipes(null)
    setBatchPlan(null)
    setIsBatch(true)

    try {
      const plan = await fetchBatchCooking(formData)
      setBatchPlan(plan)
      savePlan(plan)
      sub.trackGeneration()
      if (!sub.isPremium()) sub.trackPersonalizedRecipe()
      if (plan.recettes?.length) addToBank(plan.recettes)
    } catch (err) {
      setError(err.message ?? 'Une erreur inattendue est survenue.')
    } finally {
      setIsLoading(false)
    }
  }, [addToBank, savePlan])

  const resetResults = useCallback(() => {
    setRecipes(null)
    setBatchPlan(null)
    setError(null)
    setIsBatch(false)
  }, [])

  return {
    recipes,
    batchPlan,
    isBatch,
    isLoading,
    error,
    generateRecipes,
    generateBatchCooking,
    resetResults,
    showUpgrade,
    setShowUpgrade,
  }
}
