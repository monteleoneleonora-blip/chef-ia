import { anthropicPost } from '@/lib/anthropic'
import { normalizeRecipe }              from '@/lib/recipeSchema'

const MODEL = 'claude-sonnet-4-6'

function buildPromoPrompt(products, config) {
  const prodLines = products
    .map(p => `- ${p.nom} (${p.rayon}) -- ${p.prixPromo} EUR/${p.unite} [-${p.reduction}%]`)
    .join('\n')

  return `Tu es un chef cuisinier expert et conseiller budget alimentaire.

PRODUITS EN PROMOTION selectionnes par l'utilisateur chez ${config.magasinLabel} :
${prodLines}

CONTRAINTES UTILISATEUR :
- Budget maximum : ${config.budget} EUR par personne
- Nombre de personnes : ${config.nbPersonnes}
- Type de repas : ${config.mealType}${config.diet ? `\n- Regime alimentaire : ${config.diet}` : ''}

MISSION : Genere UNE seule recette savoureuse et realiste qui :
1. Utilise le maximum de produits en promo listes ci-dessus
2. Respecte le budget indique
3. Est adaptee au type de repas et aux eventuels regimes
4. Est facile a realiser a la maison

Reponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou apres :

{
  "nom": "Nom de la recette",
  "description": "Une phrase appetissante decrivant le plat",
  "type": "${config.mealType}",
  "cuisine": "Francaise | Italienne | Asiatique | etc.",
  "imageQuery": "2-3 mots anglais visuellement descriptifs du plat",
  "servings": ${config.nbPersonnes},
  "prepTime": "X min",
  "cookTime": "X min",
  "difficulty": "Facile | Moyen | Difficile",
  "kcalPerPerson": 000,
  "proteinPerPerson": 00,
  "carbsPerPerson": 00,
  "coutParPersonne": 0.00,
  "economieRealisee": 0.00,
  "diets": [],
  "ingredients": [
    { "quantity": "200", "unit": "g", "name": "nom de l'ingredient", "prixEstime": 0.00, "enPromo": true }
  ],
  "steps": ["Etape 1", "Etape 2"],
  "chefTip": "Astuce culinaire pour sublimer le plat",
  "childNote": null,
  "conseilBudget": "Conseil pour reduire encore le cout"
}

Pour chaque ingredient en promo parmi les produits listes, mets "enPromo": true.
Pour les autres ingredients complementaires, mets "enPromo": false.
Le champ "economieRealisee" est la somme des economies (prix normal - prix promo) pour les quantites utilisees.`
}

function parsePromoRecipe(text) {
  const cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '').trim()
  const start   = cleaned.indexOf('{')
  const end     = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('Reponse JSON invalide.')
  let jsonStr   = cleaned.slice(start, end + 1)
  jsonStr       = jsonStr.replace(/,(\s*[}\]])/g, '$1')
  try {
    return JSON.parse(jsonStr)
  } catch (e) {
    console.error('[parsePromoRecipe] Échec JSON :', jsonStr.slice(0, 400))
    throw new Error("Impossible de parser la recette generee.")
  }
}

/**
 * Genere une recette a partir des produits en promo selectionnes.
 * @param {Array}  products - produits selectionnes
 * @param {Object} config   - { magasinLabel, budget, nbPersonnes, mealType, diet }
 * @param {Object} opts     - { onProgress }
 * @returns {Promise<Object>} recette JSON normalisee (avec champ canonique `name`)
 */
export async function generatePromoRecipe(products, config, { onProgress } = {}) {
  const response = await anthropicPost('/messages', {
    model:      MODEL,
    max_tokens: 4096,
    messages:   [{ role: 'user', content: buildPromoPrompt(products, config) }],
  })
  const data = await response.json()
  const text = data?.content?.[0]?.text ?? ''
  if (!text) throw new Error('Reponse vide.')
  onProgress?.(text)
  return normalizeRecipe(parsePromoRecipe(text), { type: config.mealType ?? 'déjeuner' })
}
