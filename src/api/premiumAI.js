import { anthropicPost } from '@/lib/anthropic'
import { normalizeRecipe }              from '@/lib/recipeSchema'

const MODEL = 'claude-sonnet-4-6'

const JSON_SCHEMA = `{
  "nom": "Nom de la recette",
  "description": "Une phrase appetissante",
  "cuisine": "Francaise | Italienne | etc.",
  "servings": N,
  "prepTime": "X min",
  "cookTime": "X min",
  "difficulty": "Facile | Moyen | Difficile",
  "kcalPerPerson": 000,
  "proteinPerPerson": 00,
  "coutParPersonne": 0.00,
  "ingredients": [
    { "quantity": "200", "unit": "g", "name": "nom", "available": true }
  ],
  "steps": ["Etape 1", "Etape 2"],
  "chefTip": "Astuce du chef",
  "childNote": null,
  "badges": [],
  "manquants": []
}`

function parseRecipe(text) {
  const cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '').trim()
  const start   = cleaned.indexOf('{')
  const end     = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('Reponse JSON invalide.')
  let jsonStr   = cleaned.slice(start, end + 1)
  jsonStr       = jsonStr.replace(/,(\s*[}\]])/g, '$1')
  try { return JSON.parse(jsonStr) }
  catch (e) {
    console.error('[parseRecipe] Échec JSON :', jsonStr.slice(0, 400))
    throw new Error('Impossible de parser la recette generee.')
  }
}

async function callAI(prompt, onProgress, overrides = {}) {
  const response = await anthropicPost('/messages', {
    model:      MODEL,
    max_tokens: 4096,
    messages:   [{ role: 'user', content: prompt }],
  })
  const data    = await response.json()
  const text    = data?.content?.[0]?.text ?? ''
  if (!text) throw new Error('Reponse vide.')
  onProgress?.(text)
  // Normalise pour garantir { name, type, ingredients, steps } coherents
  // entre toutes les sources (claude.js, premiumAI, promo, chat).
  return normalizeRecipe(parseRecipe(text), overrides)
}

// FRIGO
export async function generateFrigoRecipe(ingredients, config, { onProgress } = {}) {
  const list = ingredients.map(i => `- ${i.trim()}`).filter(Boolean).join('\n')
  const prompt = `Tu es un chef cuisinier expert et conseiller anti-gaspi.

INGREDIENTS DISPONIBLES DANS LE FRIGO/PLACARDS :
${list}

CONTRAINTES :
- Nombre de personnes : ${config.nbPersonnes}
- Temps disponible : ${config.temps ?? 'libre'}
- Difficulte souhaitee : ${config.difficulty ?? 'Facile'}
- Type de repas : ${config.type ?? 'déjeuner'}${config.diet ? `\n- Regime : ${config.diet}` : ''}

MISSION : Genere UNE recette savoureuse qui :
1. Utilise le MAXIMUM d'ingredients disponibles (field "available": true)
2. Minimise les ingredients a acheter
3. Respecte les contraintes de temps et difficulte
4. Est realiste a la maison

Dans le champ "manquants", liste UNIQUEMENT les ingredients non disponibles mais necessaires.
Dans "available": true pour les ingredients du frigo, false pour les ingredients a acheter.
Dans "badges" : inclure des string parmi ["anti-gaspi", "rapide", "economique", "peu-ingredients"].

Reponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou apres :
${JSON_SCHEMA}`

  return callAI(prompt, onProgress, { type: config.type ?? 'déjeuner' })
}

// EXPRESS
export async function generateExpressRecipe(situation, config, { onProgress } = {}) {
  const prompt = `Tu es un chef cuisinier expert specialise dans les repas rapides et pratiques.

SITUATION DE L'UTILISATEUR :
${situation}

CONTRAINTES :
- Nombre de personnes : ${config.nbPersonnes}${config.tempsMax ? `\n- Temps maximum : ${config.tempsMax}` : ''}${config.diet ? `\n- Regime : ${config.diet}` : ''}

MISSION : Genere UNE recette EXPRESS qui :
1. Correspond exactement a la situation decrite
2. Est realiste, rapide et peu stressante a preparer
3. Limite les etapes et la vaisselle
4. Peut etre realisee avec des ingredients courants

Dans "badges" : inclure les string applicables parmi ["15min", "30min", "1-poele", "enfants", "simple", "peu-ingredients", "sans-cuisson", "economique"].
Dans "manquants" : laisser vide [].
Dans "available" : mettre true pour tous les ingredients (supposes disponibles).

Reponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou apres :
${JSON_SCHEMA}`

  // BUG-018 : utiliser config.type si fourni (ne pas forcer 'déjeuner').
  return callAI(prompt, onProgress, { type: config.type ?? 'déjeuner' })
}

// BUDGET
export async function generateBudgetRecipe(config, { onProgress } = {}) {
  const budgetParPersonne = config.budgetTotal && config.nbPersonnes
    ? (config.budgetTotal / config.nbPersonnes).toFixed(2)
    : config.budgetParPersonne ?? 5

  const prompt = `Tu es un chef cuisinier expert et conseiller budget alimentaire.

CONTRAINTE BUDGETAIRE :
- Budget total : ${config.budgetTotal ? `${config.budgetTotal} EUR` : 'libre'}
- Budget par personne : max ${budgetParPersonne} EUR
- Nombre de personnes : ${config.nbPersonnes}
- Niveau souhaite : ${config.niveau ?? 'familial'}
- Type de repas : ${config.type ?? 'déjeuner'}${config.diet ? `\n- Regime : ${config.diet}` : ''}${
  config.ingredientsDisponibles?.length
    ? `\nINGREDIENTS DEJA DISPONIBLES :\n${config.ingredientsDisponibles.map(i => `- ${i}`).join('\n')}`
    : ''
}

MISSION : Genere UNE recette economique mais savoureuse qui :
1. Respecte STRICTEMENT le budget par personne (max ${budgetParPersonne} EUR/pers.)
2. Favorise les ingredients peu couteux et polyvalents
3. Evite les ingredients rares ou onereux
4. Est quand meme appetissante et equilibree

Le champ "coutParPersonne" DOIT etre inferieur ou egal a ${budgetParPersonne}.
Dans "badges" : inclure ["economique"] et autres applicables parmi ["familial", "gourmand", "simple", "leger", "rapide"].
Dans "manquants" : ingredients non disponibles a acheter (vide si pas d'ingredients disponibles fournis).
Dans "available" : true pour ingredients deja disponibles, false sinon.

Reponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou apres :
${JSON_SCHEMA}`

  return callAI(prompt, onProgress, { type: config.type ?? 'déjeuner' })
}

// TRANSFORM
export async function transformRecipe(recipeName, recipeDescription, transformation, { onProgress } = {}) {
  const prompt = `Tu es un chef cuisinier expert en adaptation et variation de recettes.

RECETTE ORIGINALE :
Nom : ${recipeName}
${recipeDescription ? `Description : ${recipeDescription}` : ''}

TRANSFORMATION DEMANDEE : ${transformation}

MISSION : Genere une NOUVELLE VERSION de cette recette qui applique la transformation demandee.
La nouvelle version doit :
1. Rester reconnaissable par rapport a l'originale
2. Appliquer clairement la transformation
3. Etre realiste et realisable a la maison
4. Avoir un nom legerement different pour marquer la variante

Dans "nom" : ajouter une mention de la transformation (ex: "... -- version legere")
Dans "badges" : indiquer la transformation : "${transformation}"
Dans "manquants" et "available" : utiliser les valeurs par defaut ([] et true).

Reponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou apres :
${JSON_SCHEMA}`

  return callAI(prompt, onProgress)
}
