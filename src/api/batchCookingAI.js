import { anthropicPost } from '@/lib/anthropic'

const MODEL = 'claude-opus-4-6'

/**
 * Construit le prompt batch cooking à partir du formulaire utilisateur.
 * Génère un plan de session complet avec :
 *   - recettes optimisées batch (stockables, réchauffables)
 *   - planning étape par étape avec durées
 *   - outils nécessaires
 *   - tips de conservation
 */
function buildBatchPrompt(form) {
  const lines = []

  const mealEntries = Object.entries(form.mealCounts ?? {}).filter(([, n]) => n > 0)
  const nbMeals     = mealEntries.reduce((sum, [, n]) => sum + n, 0)

  lines.push(
    `Tu es un chef cuisinier expert en BATCH COOKING (cuisine en avance pour toute la semaine).\n` +
    `MISSION : Génère un plan de batch cooking complet et détaillé pour ${form.totalPeople ?? 4} personne(s).\n` +
    `Nombre de recettes à préparer : ${nbMeals}.\n` +
    `LANGUE : Tout le contenu doit être en français.\n` +
    `EXCEPTION : Le champ "imageQuery" de chaque recette doit être en anglais (2-3 mots précis du plat).\n\n` +
    `CONTRAINTES BATCH COOKING :\n` +
    `- Choisis des recettes qui se conservent bien (3-5 jours frigo ou congélateur)\n` +
    `- Privilégie les plats qui se réchauffent facilement\n` +
    `- Optimise les ingrédients communs pour éviter le gaspillage\n` +
    `- Organise le planning pour que tout soit prêt en un minimum de temps\n` +
    `- Indique clairement ce qui peut cuire en parallèle\n` +
    `- Prévois les temps de repos et refroidissement avant stockage`
  )

  const mealLabels = { breakfast: 'petit-déjeuner', lunch: 'déjeuner', dinner: 'dîner' }
  lines.push('\n## RÉPARTITION DES REPAS')
  mealEntries.forEach(([type, count]) => {
    lines.push(`- ${count} ${mealLabels[type]}${count > 1 ? 's' : ''}`)
  })

  lines.push(`\n## PROFIL DU FOYER\n- Personnes : ${form.totalPeople ?? 4}`)

  if ((form.children ?? []).length > 0) {
    const ages = form.children.map((c, i) =>
      `enfant ${i + 1} : ${c.age ?? '?'} an${Number(c.age) > 1 ? 's' : ''}`
    ).join(', ')
    lines.push(`- Enfants : ${form.children.length} (${ages})`)
  }

  const allIngredients = [
    ...(form.checkedIngredients ?? []),
    ...(form.customIngredients ?? '').split(',').map(s => s.trim()).filter(Boolean),
  ]
  if (allIngredients.length > 0)
    lines.push(`\n## INGRÉDIENTS DISPONIBLES\n${allIngredients.join(', ')}`)

  if ((form.forbiddenIngredients ?? []).length > 0)
    lines.push(`\n## INGRÉDIENTS INTERDITS\n${form.forbiddenIngredients.join(', ')}`)

  if ((form.cuisines ?? []).length > 0)
    lines.push(`\n## CUISINES SOUHAITÉES\n${form.cuisines.join(', ')}`)

  if ((form.equipment ?? []).length > 0)
    lines.push(`\n## ÉQUIPEMENTS DISPONIBLES\n${form.equipment.join(', ')}`)

  const membersWithConstraints = (form.familyMembers ?? []).filter(
    m => m.selectedDiets?.length > 0 || m.customDiet?.trim()
  )
  if (membersWithConstraints.length > 0) {
    lines.push('\n## RÉGIMES ALIMENTAIRES')
    membersWithConstraints.forEach(m => {
      const diets = [...(m.selectedDiets ?? []), m.customDiet?.trim()].filter(Boolean)
      lines.push(`- ${m.name || 'Membre'} : ${diets.join(', ')}`)
    })
  }

  lines.push(`
## FORMAT DE RÉPONSE
Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou après :

{
  "sessionTitre": "Batch Cooking Semaine du [jour]",
  "dureeTotal": "2h30",
  "nbRecettes": ${nbMeals},
  "nbPortions": ${(form.totalPeople ?? 4) * nbMeals},
  "niveauDifficulte": "Facile | Moyen | Avancé",
  "outilsNecessaires": ["Casserole 2L", "Poêle antiadhésive", "Four", "Robot coupe"],
  "recettes": [
    {
      "name": "Nom de la recette",
      "type": "petit-déjeuner | déjeuner | dîner",
      "cuisine": "Française | Italienne | etc.",
      "imageQuery": "2-3 mots anglais précis du plat",
      "servings": ${form.totalPeople ?? 4},
      "prepTime": "15 min",
      "cookTime": "30 min",
      "difficulty": "Facile | Moyen | Difficile",
      "kcalPerPerson": 520,
      "conservation": "3 jours au réfrigérateur | 2 semaines au congélateur",
      "rechauffage": "Micro-ondes 3 min ou poêle 5 min",
      "ingredients": [
        { "quantity": "200", "unit": "g", "name": "Ingrédient" }
      ],
      "steps": ["Étape 1", "Étape 2"],
      "chefTip": "Astuce du chef",
      "childNote": null
    }
  ],
  "planningSession": [
    {
      "etape": 1,
      "titre": "Mise en place générale",
      "duree": "15 min",
      "description": "Description claire et actionnable de ce qu'on fait",
      "recettesAssociees": ["Nom recette 1", "Nom recette 2"],
      "outilsUtilises": ["Couteau", "Planche à découper"],
      "enParallele": false,
      "noteParallele": null
    },
    {
      "etape": 2,
      "titre": "Cuisson longue durée",
      "duree": "25 min",
      "description": "Lancez la cuisson...",
      "recettesAssociees": ["Nom recette"],
      "outilsUtilises": ["Casserole"],
      "enParallele": true,
      "noteParallele": "Pendant la cuisson, passez à l'étape 3"
    }
  ],
  "listeCoursesGroupee": {
    "Légumes & Fruits": [{ "name": "Carottes", "quantity": "500", "unit": "g" }],
    "Viandes & Poissons": [{ "name": "Poulet", "quantity": "1", "unit": "kg" }],
    "Féculents": [],
    "Produits laitiers": [],
    "Épicerie": []
  },
  "conseilsConservation": [
    "Attendez que les plats refroidissent complètement avant de les mettre en boîte",
    "Étiquetez chaque boîte avec le nom du plat et la date de préparation"
  ],
  "astucesChef": "Conseil général du chef pour réussir cette session batch cooking"
}`)

  return lines.join('\n')
}

function parseBatchPlan(text) {
  const cleaned = text.replace(/\`\`\`(?:json)?\s*/gi, '').replace(/\`\`\`\s*/g, '').trim()
  const start   = cleaned.indexOf('{')
  const end     = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1)
    throw new Error('La réponse ne contient pas de JSON valide.')
  let jsonStr = cleaned.slice(start, end + 1)
  jsonStr     = jsonStr.replace(/,(\s*[}\]])/g, '$1')
  try {
    return JSON.parse(jsonStr)
  } catch (e) {
    console.error('[parseBatchPlan] Échec JSON :', jsonStr.slice(0, 500))
    throw new Error("Impossible de parser le plan batch cooking retourné par l'API.")
  }
}

/**
 * Génère un plan de batch cooking complet.
 * @param {object} formData - données du formulaire générateur
 * @returns {Promise<object>} plan batch cooking structuré
 */
export async function fetchBatchCooking(formData) {
  const response = await anthropicPost('/messages', {
    model:      MODEL,
    max_tokens: 16000,
    messages:   [{ role: 'user', content: buildBatchPrompt(formData) }],
  })

  const data = await response.json()
  const text = data?.content?.[0]?.text ?? ''
  if (!text) throw new Error("Réponse vide reçue de l'API.")

  return parseBatchPlan(text)
}
