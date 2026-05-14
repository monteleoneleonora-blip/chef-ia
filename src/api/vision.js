import { anthropicPost } from '@/lib/anthropic'

const MODEL = 'claude-sonnet-4-6'

const EXTRACTION_PROMPT = `Analyse ce document nutritionnel (plan alimentaire, ordonnance diététique, tableau nutritionnel, prescription médicale ou autre).

Extrais les objectifs nutritionnels PAR REPAS. Si les valeurs sont journalières, divise par 3 :
- Calories (kcal)
- Protéines (g)
- Glucides / féculents / hydrates de carbone (g)
- Lipides / graisses / matières grasses (g) — si présents
- Fibres (g) — si présentes

IMPORTANT :
- Si les valeurs sont journalières, divise par 3 pour obtenir le par repas.
- Mets null si une valeur n'est pas mentionnée dans le document.
- La note doit expliquer brièvement ce que tu as trouvé et comment tu as interprété le document.

Réponds UNIQUEMENT avec ce JSON, sans texte avant ni après :
{"kcal": <nombre ou null>, "protein": <nombre ou null>, "carbs": <nombre ou null>, "lipids": <nombre ou null>, "fiber": <nombre ou null>, "note": "<explication courte en français>"}`

/** Convertit un File en chaîne base64 (sans le préfixe data:...) */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/** Détermine si le fichier est un PDF */
function isPdf(file) {
  return file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf')
}

/** Construit le bloc de contenu (image ou document PDF) pour l'API Anthropic */
function buildContentBlock(file, base64) {
  if (isPdf(file)) {
    return {
      type:   'document',
      source: { type: 'base64', media_type: 'application/pdf', data: base64 },
    }
  }
  return {
    type:   'image',
    source: { type: 'base64', media_type: file.type || 'image/jpeg', data: base64 },
  }
}

/**
 * Analyse une image ou un PDF contenant un plan nutritionnel.
 * Retourne les valeurs extraites par repas (null si non trouvées).
 *
 * @param {File} file
 * @returns {Promise<{kcal:number|null, protein:number|null, carbs:number|null, lipids:number|null, fiber:number|null, note:string}>}
 */
export async function analyzeNutritionPhoto(file) {
  const base64 = await fileToBase64(file)

  // L'API PDF requiert le header beta
  const extraHeaders = isPdf(file) ? { 'anthropic-beta': 'pdfs-2024-09-25' } : {}

  const response = await anthropicPost('/messages', {
    model:      MODEL,
    max_tokens: 512,
    messages: [{
      role:    'user',
      content: [
        buildContentBlock(file, base64),
        { type: 'text', text: EXTRACTION_PROMPT },
      ],
    }],
  }, extraHeaders)

  const data = await response.json()
  const text = data.content?.[0]?.text ?? ''

  try {
    const start  = text.indexOf('{')
    const end    = text.lastIndexOf('}')
    const parsed = JSON.parse(text.slice(start, end + 1))
    const round  = (v) => (v ? Math.round(Number(v)) : null)
    return {
      kcal:    round(parsed.kcal),
      protein: round(parsed.protein),
      carbs:   round(parsed.carbs),
      lipids:  round(parsed.lipids),
      fiber:   round(parsed.fiber),
      note:    parsed.note ?? '',
    }
  } catch {
    throw new Error("Impossible d'extraire les valeurs nutritionnelles du document.")
  }
}
