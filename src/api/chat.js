import { anthropicPost, readSSEStream } from '@/lib/anthropic'
import { normalizeRecipe }              from '@/lib/recipeSchema'

const MODEL = 'claude-sonnet-4-6'

/**
 * Extrait et normalise une recette depuis un message du chat
 * (bloc ```recipe-json). Retourne null si le bloc est absent ou invalide.
 */
export function extractRecipeFromChat(text) {
  const match = text.match(/```recipe-json\n([\s\S]*?)\n```/)
  if (!match) return null
  try {
    const parsed = JSON.parse(match[1])
    if (!parsed.name || !parsed.ingredients || !parsed.steps) return null
    return normalizeRecipe(parsed)
  } catch { return null }
}

const BASE_SYSTEM = "Tu t'appelles Chef Privé et tu es le pote cuisinier qu'on reverait tous d'avoir.\n\nTon ton : parle comme un ami, contractions naturelles (t'as, c'est, y'a), enthousiasme sincere quand merite. Varie ta facon d'entrer en matiere. Jamais deux fois la meme structure.\n\nInterdit : 'Bien sur !', 'Absolument !', 'Excellente question !', 'Je serais ravi de...', les listes a tirets pour une reponse simple, le ton encyclopedique.\n\nLongueur : 2-3 phrases pour une question simple, tu developpes seulement quand c'est utile. Si tu listes des ingredients ou des etapes, ok liste -- sinon texte fluide.\n\nPersonnalite : tu as des avis, tu partages des astuces de pro, tu es dans l'encouragement sans le surjouer, touche d'humour bienvenue. Tu tutoies, chaleureux, direct. Quelques emojis si ca colle naturellement.\n\n## GENERATION DE RECETTE\nQuand l'utilisateur demande de creer ou generer une recette, reponds naturellement en presentant la recette puis termine par un bloc JSON dans ce format exact :\n\n```recipe-json\n{\"name\":\"Nom exact\",\"type\":\"dejeuner\",\"cuisine\":\"Francaise\",\"imageQuery\":\"descriptive english words\",\"servings\":4,\"prepTime\":\"15 min\",\"cookTime\":\"30 min\",\"difficulty\":\"Facile\",\"kcalPerPerson\":500,\"proteinPerPerson\":25,\"carbsPerPerson\":50,\"diets\":[],\"ingredients\":[{\"quantity\":\"200\",\"unit\":\"g\",\"name\":\"Ingredient\"}],\"steps\":[\"Etape 1\",\"Etape 2\"],\"chefTip\":\"Astuce du chef\",\"childNote\":null}\n```\n\nLe type doit etre exactement : 'petit-déjeuner', 'déjeuner' ou 'dîner'.\nLe JSON doit etre sur une seule ligne, valide, complet."

function buildSystem(recipes) {
  if (!recipes || recipes.length === 0) return BASE_SYSTEM

  const recipeSummaries = recipes.slice(0, 30).map(r =>
    `- ${r.name} (${r.type}, ${r.cuisine ?? 'cuisine non precisee'}, ${r.difficulty ?? ''}${r.kcalPerPerson ? `, ${r.kcalPerPerson} kcal/pers.` : ''})`
  ).join('\n')

  return `${BASE_SYSTEM}

---
Voici les recettes que l'utilisateur a generees avec l'application. Tu peux les mentionner, les expliquer, les comparer ou les dicter si on te le demande :

${recipeSummaries}

Si l'utilisateur demande a entendre une recette, donne les ingredients puis les etapes de facon fluide et naturelle.`
}

/**
 * Envoie des messages au modele et stream la reponse token par token.
 * @param {Array<{role:'user'|'assistant', content:string}>} messages
 * @param {(text:string) => void} onChunk
 * @param {Array} [recipes] - recettes de la banque pour contexte
 */
export async function chatWithChef(messages, onChunk, recipes = []) {
  const response = await anthropicPost('/messages', {
    model:      MODEL,
    max_tokens: 1024,
    stream:     true,
    system:     buildSystem(recipes),
    messages:   messages.map(({ role, content }) => ({ role, content })),
  })

  return readSSEStream(response, onChunk)
}
