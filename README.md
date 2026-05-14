# Chef IA — Générateur de recettes personnalisées par IA

> **Application web complète, prête à déployer et monétiser.** Design premium, IA intégrée (Claude Anthropic), système d'abonnement précâblé. Il ne manque qu'un backend proxy + Stripe pour être en production.

---

## 🎯 Résumé pour un acheteur

Chef IA est une **SPA React mobile-first** qui génère des recettes sur-mesure en 3 questions, grâce à Claude Opus 4.6 d'Anthropic. L'interface suit un design "Dolce Vita" soigné (bleu Klein, jaune Sicile, mascotte chef italien animée). Tout le parcours utilisateur est construit, du premier lancement jusqu'au paiement — il manque uniquement le branchement Stripe et un backend proxy pour les clés API.

**Ce que vous achetez :**
- ~13 500 lignes de code React propre et commenté
- 10+ fonctionnalités finies (générateur IA, chat vocal, liste de courses, promos, bien-être, plans médicaux…)
- Un système d'abonnement 4 plans (Visiteur / Gratuit / Premium 4,99€ / Famille 9,99€)
- 114 recettes seed de qualité + banque extensible
- Un design system complet et cohérent

---

## ✨ Fonctionnalités

### Parcours principal
- **Générateur IA** — Claude Opus 4.6 en streaming SSE, prompt riche (régimes, exclusions, profils famille, plans médicaux)
- **Banque de recettes** — 114 recettes seed + ajout manuel, recherche, filtres, tri
- **Matching sans IA** — algorithme local pour les utilisateurs gratuits
- **Onboarding vocal** — 3 questions à la voix (ElevenLabs + Web Speech API)

### Fiche recette
- Photo réelle (chaîne Pexels → Unsplash → TheMealDB → Wikipedia, cache LRU 200)
- Scaling des portions en live (1–12 personnes)
- Lecture vocale étape par étape (ElevenLabs Charlotte)
- Minuteur de cuisson intégré
- Valeurs nutritionnelles, note enfant, astuce du chef

### 5 Fonctions Premium
| Mode | Description |
|---|---|
| **Frigo** | Recette anti-gaspi depuis les ingrédients disponibles |
| **Express** | Idée de repas en fonction d'une situation et d'un temps max |
| **Budget IA** | Recette avec contrainte stricte €/personne |
| **Transform** | Variante d'une recette (vegan, sans gluten, express…) |
| **Carnet** | Bibliothèque personnelle avec tags et notes libres |

### Autres modules
- **Chat assistant** — Sonnet 4.6, streaming, micro, TTS, quota par plan
- **Liste de courses** — ingrédients agrégés, cases à cocher, copier/imprimer
- **Favoris & rejetés** — persistés, les rejetées exclues du matching
- **Promos magasins** — 6 enseignes (Carrefour, Leclerc, Intermarché, Grand Frais, Lidl, Aldi)
- **Bien-être & intolérances** — journal de repas, 6 axes de ressenti, RadarChart, BarChart, LineChart
- **Plans médicaux par photo** — upload ordonnance → extraction kcal/protéines/glucides (Claude Vision)
- **Profils famille** — store prêt, à brancher au générateur (plan Family)

### Système d'abonnement
4 plans préconfigurés avec quotas, compteurs mensuels et `PremiumGate` sur toutes les fonctions IA. **Stripe non branché** (logique front 100% prête, à connecter à un webhook).

---

## 🛠 Stack technique

| Couche | Technologie |
|---|---|
| Framework | React 18.3 + Vite 5.4 |
| Style | Tailwind CSS v4 + variables CSS oklch |
| UI | shadcn/ui + Base UI |
| État | Zustand 5 + `persist` localStorage (13 stores) |
| IA principale | Anthropic Claude Opus 4.6 (streaming SSE) |
| IA chat/premium | Anthropic Claude Sonnet 4.6 |
| Voix | ElevenLabs (`eleven_multilingual_v2`) + Web Speech API |
| Photos | Pexels → Unsplash → TheMealDB → Wikipedia |
| Charts | Recharts 3.8 |

---

## 🚀 Démarrage rapide

```bash
npm install
cp .env.example .env.local   # renseigner les clés API
npm run dev                   # http://localhost:3003
```

---

## ⚙️ Variables d'environnement

```env
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_ELEVENLABS_API_KEY=...        # optionnel — TTS natif en fallback
VITE_PEXELS_KEY=...                # optionnel
VITE_UNSPLASH_KEY=...              # optionnel
```

En développement, un proxy Vite redirige les appels API.
**Pour la production : déployer un backend proxy (Vercel Functions, Cloudflare Workers, Express) qui détient les clés.**

---

## 📦 Déploiement Vercel (10 minutes)

```bash
# 1. Pusher sur GitHub
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE_USERNAME/chef-ia.git
git push -u origin main

# 2. Importer sur vercel.com → New Project → sélectionner le repo
# 3. Ajouter les variables d'environnement dans les settings Vercel
# 4. Deploy
```

Le fichier `vercel.json` est configuré pour le routing SPA React.

---

## 💡 Ce qui reste à faire

1. **Backend proxy + Stripe** — pour une production sécurisée et des paiements réels (1–2 semaines de dev)
2. **Authentification** — comptes utilisateurs pour sync multi-device
3. **Vraies promos** — connecter une API tierce (Promoz, BonjourPanier) à la place du JSON démo
4. **Profils famille actifs** — le store est prêt, à brancher au générateur

---

## 📊 Potentiel commercial

L'app est monétisable immédiatement après branchement Stripe :
- **Premium** : 4,99 €/mois · **Famille** : 9,99 €/mois
- À 200 abonnés Premium → ~1 000 € MRR → valeur de cession estimée **30 000–50 000 €**
- Segments B2B naturels : diététiciens (plan pro multi-patients), distributeurs alimentaires (API promos white-label)

---

## 📁 Structure du projet

```
src/
├── api/          ← clients HTTP (Claude, ElevenLabs, Pexels, promos, vision)
├── components/   ← composants React (form, results, chat, premium, promo, mascot…)
├── constants/    ← cuisines, régimes, équipements, ingrédients
├── data/         ← 114 recettes seed, maps photos, promos démo JSON
├── hooks/        ← useRecipeForm, useRecipeGeneration, useSpeechSynthesis
├── lib/          ← client Anthropic SSE, utils
├── pages/        ← GeneratorPage, PremiumPage, StatisticsPage, sous-pages premium
└── store/        ← 13 stores Zustand
```

---

## 🗺 Guide de modification rapide

| Pour… | Aller dans |
|---|---|
| Modifier le prompt de génération | `src/api/claude.js` (`buildPrompt`) |
| Ajouter une cuisine / un régime | `src/constants/{cuisines,diets}.js` |
| Ajouter une recette par défaut | `src/data/recipeBank.js` |
| Brancher une vraie API de promos | `src/api/promoService.js` (`getPromos`) |
| Modifier les plans tarifaires | `src/store/useSubscriptionStore.js` (`PLANS`) |
| Modifier le ton du chat | `src/api/chat.js` (`BASE_SYSTEM`) |
| Changer la voix TTS | `src/api/tts.js` (`VOICE_ID`) |
| Ajouter une fonction Premium | `src/api/premiumAI.js` + page dans `src/pages/premium/` |

---

## 📄 Licence

Codebase propriétaire — tous droits réservés. Vendu tel quel, sans garantie de revenus.
