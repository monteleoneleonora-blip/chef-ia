# AUDIT — Chef Privé / Chef IA

> Audit réalisé le 12 mai 2026. Périmètre : dépôt local `APPLI DE RECETTE/`.
> Ce document constate l'état du code ; il n'apporte aucune modification.

---

## 1. STACK

### Front
- **Framework** : React 18.3.1 + Vite 5.4 (JavaScript, pas de TypeScript).
- **Styling** : Tailwind CSS v4 (`@tailwindcss/vite`) + variables CSS oklch + `tw-animate-css`.
- **UI primitives** : `@base-ui/react` 1.3 + shadcn/ui (style « base-nova ») + `lucide-react` 1.8 (⚠️ version suspecte — voir `ANALYSE_PROJET.md` §7.7).
- **State** : Zustand 5.0.12 + middleware `persist` (14 stores → `localStorage`).
- **Charts** : Recharts 3.8 (page Statistiques).
- **Fonts** : Geist Variable (npm) + Inter via Google Fonts ([index.html:10](index.html:10)).
- **Pas de PWA, pas de service worker, pas de manifest.**

### Backend
- **Backend proxy Express minimal** dans [backend/server.js](backend/server.js) (218 LOC).
  - Node 20+ (utilise `--watch`).
  - Dépendances : `express`, `cors`, `morgan`, `express-rate-limit`, `dotenv`.
  - Endpoints :
    - `GET /health` — healthcheck.
    - `POST /api/anthropic/messages` — passe-plat SSE vers `api.anthropic.com`.
    - `POST /api/elevenlabs/tts` — proxy ElevenLabs, renvoie `audio/mpeg`.
    - `GET /api/photo` — proxy Pexels + Unsplash, renvoie l'URL.
  - CORS strict via `ALLOWED_ORIGINS` (env), rate-limit IP via `RATE_LIMIT_MAX=60` req/min.
  - Le front bascule sur ce backend si `VITE_API_BASE` est défini, sinon il appelle Anthropic / ElevenLabs en direct via le proxy Vite (dev) ou directement (prod, clés exposées).

### Base de données
- **Aucune base de données.** Tout l'état (recettes, favoris, courses, profils famille, plans nutritionnels, abonnement, historique chat, feedbacks bien-être, etc.) est persisté dans `localStorage` côté navigateur via Zustand `persist`. 14 stores au total (préfixés `chef-ia-*` ou `chef-prive-*`, cf. §5).
- **Firebase est *prévu* mais pas installé** ([src/lib/firebase.js](src/lib/firebase.js) — stub, exports `null`). `package.json` n'a pas la dépendance `firebase`. [.env.local](.env.local) contient les variables `VITE_FIREBASE_*` mais elles sont vides.

### Hébergement actuel
- **Rien n'est en production.**
  - Pas d'historique git (`git log` → « your current branch 'master' does not have any commits yet »).
  - Aucun remote git configuré (`git remote -v` vide).
  - Aucun fichier de déploiement (pas de `vercel.json`, `netlify.toml`, `Dockerfile`, `railway.json`, `render.yaml`, `fly.toml`, `wrangler.toml`).
  - Un dossier [dist/](dist) existe (build local du 6 mai 2026) — bundle JS 1.18 Mo + CSS 152 Ko, mais non déployé.
  - [backend/README.md](backend/README.md) documente des cibles potentielles (Railway, Render, Cloud Run, Fly.io) mais aucune n'est connectée.
  - Le port dev est verrouillé sur `3003` ([vite.config.js:14](vite.config.js:14) — cohérent avec [CLAUDE.md](CLAUDE.md), incohérent avec le README qui dit `5173`).

---

## 2. APIS PAYANTES

### 2.1 Anthropic (Claude) — **plus gros poste de coût**

Tous les appels passent par [src/lib/anthropic.js](src/lib/anthropic.js) qui ajoute le header `anthropic-dangerous-direct-browser-access: true` quand on est en mode direct.

| Client | Fichier | Modèle | `max_tokens` | Stream | Déclenché par |
|---|---|---|---|---|---|
| Génération principale | [src/api/claude.js:566](src/api/claude.js:566) (`fetchRecipes`) | `claude-opus-4-6` | **16 000** | ❌ (sortie non streamée malgré le commentaire « streaming SSE » dans le README) | Bouton « Générer mes recettes » du `WizardForm` (page Générateur). Appel depuis [src/hooks/useRecipeGeneration.js](src/hooks/useRecipeGeneration.js). |
| Chat assistant | [src/api/chat.js:45](src/api/chat.js:45) (`chatWithChef`) | `claude-sonnet-4-6` | 1 024 | ✅ | Chaque message envoyé via `ChatPanel` ([src/components/chat/ChatPanel.jsx](src/components/chat/ChatPanel.jsx)) — bouton flottant présent sur toutes les pages. |
| Premium Frigo | [src/api/premiumAI.js:57](src/api/premiumAI.js:57) (`generateFrigoRecipe`) | `claude-sonnet-4-6` | 4 096 | ❌ | Bouton « Générer ma recette » dans [src/pages/premium/FrigoPage.jsx](src/pages/premium/FrigoPage.jsx). |
| Premium Express | [src/api/premiumAI.js:87](src/api/premiumAI.js:87) (`generateExpressRecipe`) | `claude-sonnet-4-6` | 4 096 | ❌ | [src/pages/premium/ExpressPage.jsx](src/pages/premium/ExpressPage.jsx). |
| Premium Budget | [src/api/premiumAI.js:114](src/api/premiumAI.js:114) (`generateBudgetRecipe`) | `claude-sonnet-4-6` | 4 096 | ❌ | [src/pages/premium/BudgetAIPage.jsx](src/pages/premium/BudgetAIPage.jsx). |
| Premium Transform | [src/api/premiumAI.js:150](src/api/premiumAI.js:150) (`transformRecipe`) | `claude-sonnet-4-6` | 4 096 | ❌ | [src/pages/premium/TransformPage.jsx](src/pages/premium/TransformPage.jsx) + [TransformModal.jsx](src/components/premium/TransformModal.jsx) (bouton « Transformer » sur une recette). |
| Recette promo | [src/api/promoRecipeAI.js:81](src/api/promoRecipeAI.js:81) (`generatePromoRecipe`) | `claude-sonnet-4-6` | 4 096 | ❌ | Bouton de la [PromoPage.jsx](src/pages/PromoPage.jsx) après sélection des produits en promo. |
| Vision (PDF/photo nutri) | [src/api/vision.js:58](src/api/vision.js:58) (`analyzeNutritionPhoto`) | `claude-sonnet-4-6` (avec header beta `pdfs-2024-09-25` pour les PDF) | 512 | ❌ | Upload d'un document dans [MedicalPlanSection.jsx](src/components/form/MedicalPlanSection.jsx) ou [MemberParticularityPanel.jsx](src/components/onboarding/MemberParticularityPanel.jsx). |
| Batch cooking | [src/api/batchCookingAI.js:168](src/api/batchCookingAI.js:168) (`fetchBatchCooking`) | `claude-opus-4-6` | **16 000** | ❌ | Bouton « Générer ma session batch » dans [src/pages/BatchCookingPage.jsx](src/pages/BatchCookingPage.jsx). |

**Ordres de grandeur de coût par appel** (tarifs Anthropic publics au mois de mai 2026 — Opus ~15 $/MTok input et 75 $/MTok output, Sonnet ~3 $/MTok input et 15 $/MTok output) :

- Génération principale (Opus, prompt ~3–8 k tokens si plusieurs blocs d'expertise cuisine injectés, sortie ~3–10 k tokens) → **~0,15 à 0,80 $ par génération**.
- Batch cooking (Opus, idem) → **~0,15 à 0,60 $ par session**.
- Vision nutritionnelle (Sonnet, PDF en base64 → entrée parfois lourde, sortie 100–300 tokens) → **~0,01 à 0,10 $ par upload**.
- Premium Frigo/Express/Budget/Transform/Promo (Sonnet, prompt ~500 tokens, sortie ~1 k tokens) → **~0,005 à 0,02 $ par appel**.
- Chat (Sonnet, prompt = system + 30 recettes injectées + historique, sortie ≤1 k tokens) → **~0,005 à 0,02 $ par message**.

**Fréquence de déclenchement utilisateur** (limites enforced uniquement côté front via [useSubscriptionStore](src/store/useSubscriptionStore.js:4)) :

| Plan | Générations IA / mois | Recettes personnalisées | Chat / mois | TTS |
|---|---|---|---|---|
| visitor | 0 (AI désactivée) | 0 | 5 | non |
| free | illimitées (mais filtrées par matcher banque) | **3 à vie** (compteur ne reset pas) | 30 | non |
| premium (4,99 €/mo) | illimitées | illimitées | illimité | oui |
| family (9,99 €/mo) | illimitées | illimitées | illimité | oui |

⚠️ Ces limites sont **uniquement côté client** — un utilisateur qui édite `localStorage` ou appelle directement le backend contourne tout. Le seul garde-fou serveur est `RATE_LIMIT_MAX=60` req/min/IP ([backend/server.js:57](backend/server.js:57)), insuffisant pour bloquer une fuite de clé.

### 2.2 ElevenLabs (TTS)
- Voix `XB0fDUnXU5powFXDhCwa` (« Charlotte »), modèle `eleven_multilingual_v2` ([src/api/tts.js:5](src/api/tts.js:5)).
- Appelé depuis [src/hooks/useSpeechSynthesis.js](src/hooks/useSpeechSynthesis.js) :
  - Lecture étape par étape d'une recette (bouton 🔊 dans `RecipeCard`).
  - Lecture audio des réponses du chef dans `ChatPanel`.
  - Onboarding vocal (`WelcomeScreen`).
- Tarif ElevenLabs « Creator » : ~22 $/100 k caractères → ~0,0002 $ par caractère → une recette dictée (~1 500 caractères) ≈ **0,30 $**.
- Réservé aux plans `premium`/`family` côté front (gating via `getPlan().tts` = `true`).

### 2.3 Pexels
- Recherche d'images de recettes ([src/api/images.js:69](src/api/images.js:69), `fetchPexels`).
- Une recherche par recette générée (sauf cache LRU 200 dans `localStorage`, clé `chef-ia-photo-cache-v7`) et par mapping manuel raté.
- Tarif : gratuit avec rate-limit (200 req/h dev, 20 000 req/mois free tier).

### 2.4 Unsplash
- Fallback après Pexels ([src/api/images.js:82](src/api/images.js:82), `fetchUnsplash`).
- Tarif : gratuit 50 req/h en dev, 5 000 req/h en prod (production app key requise).

### 2.5 APIs gratuites (mentionnées pour exhaustivité)
- **TheMealDB** ([src/api/images.js:48](src/api/images.js:48)) — gratuit sans clé.
- **Wikipedia REST API** ([src/api/images.js:59](src/api/images.js:59)) — gratuit sans clé.
- **Google Fonts** (Inter) chargée depuis [index.html:10](index.html:10) — gratuit.

### 2.6 APIs non utilisées
- ❌ **Aucune intégration Stripe / paiement** (la phrase « En production, ceci serait connecté à Stripe » est explicite dans [SubscriptionPage.jsx:48](src/pages/SubscriptionPage.jsx:48)).
- ❌ Aucun envoi d'email (SendGrid, Mailgun, Resend, Postmark) — la newsletter cochée à l'inscription n'est connectée à rien.
- ❌ Aucun SMS (Twilio) ni push.
- ❌ Aucun OAuth réel (le bouton « Continuer avec Google » dans [AuthPage.jsx:54](src/pages/AuthPage.jsx:54) renseigne un faux user `yoann.curt@gmail.com` en dur).

---

## 3. CLÉS API

### Emplacements
- [.env](.env) à la racine (versionné dans `.gitignore`, donc local-only) — contient actuellement une **clé Anthropic active** (`VITE_ANTHROPIC_API_KEY=sk-ant-…`) et un PIN admin par défaut `VITE_ADMIN_PIN=1234`. Les autres clés (`VITE_ELEVENLABS_API_KEY`, `VITE_PEXELS_KEY`, `VITE_UNSPLASH_KEY`) sont vides.
- [.env.local](.env.local) à la racine — variables `VITE_FIREBASE_*` toutes vides (stub).
- [.env.example](.env.example) à la racine — versionné, ne contient que des placeholders.
- [backend/.env.example](backend/.env.example) — versionné, placeholders.
- `backend/.env` — **absent** du dépôt local (seul l'exemple existe).

### Stockage / mode d'injection
- **Mode actuel = direct browser (legacy).** Les variables `VITE_*` sont injectées par Vite **dans le bundle JS** à la compilation. Le proxy Vite (`/api/anthropic` → `api.anthropic.com`) n'est actif **qu'en dev** ([vite.config.js:18](vite.config.js:18)). En production, le bundle appelle directement `api.anthropic.com` avec la clé visible dans le source.
- **Mode recommandé = backend proxy.** Si `VITE_API_BASE` est renseigné côté front, le code (`anthropic.js`, `tts.js`, `images.js`) bascule sur le serveur Express qui détient les clés côté serveur via `process.env`.
- Aucun secret manager (AWS Secrets, Doppler, Vault, etc.) n'est utilisé.
- Aucune clé n'est hardcodée dans le code source. Toutes passent par `import.meta.env.VITE_*` côté front ou `process.env.*` côté backend.

### Protection contre une fuite git
- [.gitignore](.gitignore) exclut `.env`, `.env.local`, `node_modules`, `dist`, `.DS_Store`.
- Le repo n'a aucun commit ni remote → aucune clé n'a fuité publiquement à ce jour.
- ⚠️ **Mais** : si un build prod est aujourd'hui généré avec `.env` tel quel et déployé statiquement (Vercel, Netlify, S3…), la clé Anthropic atterrit en clair dans `dist/assets/index-*.js`. Le header `anthropic-dangerous-direct-browser-access: true` ne protège rien — il lève seulement la garde Anthropic.

### Auth admin
- `VITE_ADMIN_PIN=1234` (en dur dans [.env](.env), valeur identique au fallback `'1234'` dans [AdminDatabasePage.jsx:9](src/pages/AdminDatabasePage.jsx:9)).
- Le « rôle admin » est en plus comparé à l'email `yoann.curt@gmail.com` codé en dur dans [src/lib/adminAuth.js:3](src/lib/adminAuth.js:3).

---

## 4. PREMIUM

### Plans
Définis dans [src/store/useSubscriptionStore.js:4](src/store/useSubscriptionStore.js:4), objet `PLANS` :

| id | prix | quotas | features |
|---|---|---|---|
| `visitor` | 0 € | 0 IA, 5 chats/mois, banque limitée à 3 recettes | aperçu seulement |
| `free` | 0 € | 3 recettes personnalisées « offertes » (à vie, pas de reset mensuel sur ce compteur), 30 chats/mois | banque illimitée, favoris, courses |
| `premium` | **4,99 €/mois** | illimité | IA full + TTS + 5 fonctions Premium |
| `family` | **9,99 €/mois** | illimité | Premium + profils famille (annoncé), batch cooking, plans nutritionnels |

### Activation / paiement
- **Aucune intégration Stripe ni autre PSP.** La fonction [`activate(planId)`](src/store/useSubscriptionStore.js:237) écrit directement dans le store Zustand (donc `localStorage`) et fixe `expiresAt = now + 1 mois`.
- L'utilisateur peut auto-activer n'importe quel plan via les boutons de [SubscriptionPage.jsx](src/pages/SubscriptionPage.jsx) sans payer.
- [`cancelSubscription()`](src/store/useSubscriptionStore.js:248) repasse en `free` et reset l'usage du mois.
- [`registerEmail(email)`](src/store/useSubscriptionStore.js:225) bascule un visitor en `free` après saisie d'email (compte gratuit avec 3 recettes offertes).

### Gates / paywalls
- **Composant gate** : [src/components/premium/PremiumGate.jsx](src/components/premium/PremiumGate.jsx) — enveloppe les contenus payants, affiche `<PremiumPaywall>` si `plan === 'free' || plan === 'visitor'`.
- **Composant paywall UI** : `src/components/premium/PremiumPaywall.jsx`.
- **Modale d'upgrade** : `src/components/subscription/UpgradeModal.jsx`.
- **Bandeau paywall** dans [GeneratorPage.jsx](src/pages/GeneratorPage.jsx) quand l'utilisateur n'est pas premium.

### Feature flags / helpers de plan
- Liste centrale des features premium : [src/lib/permissions.js:17](src/lib/permissions.js:17), `PREMIUM_FEATURES = ['frigo', 'express', 'budget', 'transform', 'carnet', 'wellbeing', 'promo', 'generation']`.
- Helpers : `isPremiumPlan(plan)`, `isFreePlan(plan)`, `isVisitorPlan(plan)`, `canAccess(plan, feature)`.
- Checks de quota dans le store : `canUseAI()`, `canGenerate()`, `canChat()`, `canPersonalize()`, `remainingGenerations()`, `remainingChat()`, `remainingPersonalized()` ([useSubscriptionStore.js:159-198](src/store/useSubscriptionStore.js:159)).
- Tracking d'usage : `trackGeneration()`, `trackChatMessage()`, `trackPersonalizedRecipe()`.
- Vérification d'expiration corrigée dans [useSubscriptionStore.js:151](src/store/useSubscriptionStore.js:151) (`isPremium()` retourne `false` si `expiresAt` dépassé).

### Failles connues
- ⚠️ Tout passe par le `localStorage` → un utilisateur peut éditer `chef-ia-subscription` pour passer en `premium` sans payer.
- ⚠️ Pas de validation côté serveur — le backend Express ne consulte pas le plan.
- ⚠️ La page admin ([src/pages/AdminDatabasePage.jsx](src/pages/AdminDatabasePage.jsx)) n'est protégée que par un PIN à 4 chiffres lu côté client (`VITE_ADMIN_PIN`, défaut `1234`).

---

## 5. DONNÉES PERSO

### Données collectées
- **Compte / auth** ([useAuthStore](src/store/useAuthStore.js)) : `uid`, `email`, `firstName`, `photoURL`, consentements `{ newsletter, commercial, date }`. Le mot de passe est saisi dans [AuthPage.jsx](src/pages/AuthPage.jsx) mais **n'est jamais persisté** (mode démo : seul le `user` est sauvegardé).
- **Abonnement** ([useSubscriptionStore](src/store/useSubscriptionStore.js)) : `plan`, `email` (dupliqué), `activatedAt`, `expiresAt`, compteurs d'usage.
- **Profil foyer** ([useFamilyStore](src/store/useFamilyStore.js)) : `householdName`, nombre d'adultes, liste d'enfants avec âge, liste de membres avec :
  - `name`, `age`, `kind` (adult/child),
  - `particularity` : régimes, allergies, intolérances, objectifs `kcal`/`protein`/`carbs`,
  - **`nutritionPlan`** : **document médical** uploadé (PDF/photo d'ordonnance ou plan diététique) → `fileName`, `status`, valeurs nutritionnelles extraites + `note`. Le fichier lui-même n'est pas stocké, mais son nom et les valeurs médicales le sont.
- **Bien-être / digestion** ([useFeedbackStore](src/store/useFeedbackStore.js)) : `recipeName`, type de repas, cuisine, scores 1-5 d'`energy`/`digestion`/`satiety`/`lightness`/`mood`/`satisfaction`, `foodGroups`, **`symptoms`** ressentis après repas → potentiellement donnée de santé sensible (RGPD art. 9).
- **Activité produit** : favoris ([useFavoritesStore](src/store/useFavoritesStore.js)), liste de courses ([useShoppingStore](src/store/useShoppingStore.js)), rejetés ([useRedListStore](src/store/useRedListStore.js)), historique chat 60 derniers messages ([useChatStore](src/store/useChatStore.js)), carnet de recettes sauvegardées ([useCarnetStore](src/store/useCarnetStore.js)), préférences budget, préférences promo, plans batch ([useBatchStore](src/store/useBatchStore.js)).

### Stockage
- **Tout en `localStorage` du navigateur, en clair (JSON-stringifié, non chiffré).** Aucune base de données serveur, aucun hashing, aucun chiffrement at-rest. 14 clés au total :

| Clé localStorage | Source |
|---|---|
| `chef-prive-auth` | [useAuthStore](src/store/useAuthStore.js) |
| `chef-prive-batch` | [useBatchStore](src/store/useBatchStore.js) |
| `chef-ia-subscription` | [useSubscriptionStore](src/store/useSubscriptionStore.js) |
| `chef-ia-family` | [useFamilyStore](src/store/useFamilyStore.js) |
| `chef-ia-household` | [useHouseholdStore](src/store/useHouseholdStore.js) |
| `chef-ia-feedback` | [useFeedbackStore](src/store/useFeedbackStore.js) |
| `chef-ia-favorites` | [useFavoritesStore](src/store/useFavoritesStore.js) |
| `chef-ia-shopping` | [useShoppingStore](src/store/useShoppingStore.js) |
| `chef-ia-redlist` | [useRedListStore](src/store/useRedListStore.js) |
| `chef-ia-chat` | [useChatStore](src/store/useChatStore.js) |
| `chef-ia-carnet` | [useCarnetStore](src/store/useCarnetStore.js) |
| `chef-ia-budget` | [useBudgetStore](src/store/useBudgetStore.js) |
| `chef-ia-promo` | [usePromoStore](src/store/usePromoStore.js) |
| `chef-ia-recipe-bank` | [useRecipeBankStore](src/store/useRecipeBankStore.js) |
| `chef-ia-photo-cache-v7` | [src/api/images.js:12](src/api/images.js:12) |
| `chef-ia-welcomed` | flag onboarding |

### Transmission externe
- **Anthropic** reçoit le profil foyer dans le prompt principal ([claude.js:412-489](src/api/claude.js:412)) : nombre de personnes, âges des enfants, régimes par membre, plans médicaux extraits.
- **Anthropic Vision** reçoit les **documents médicaux** uploadés (PDF/image base64) dans [vision.js:64](src/api/vision.js:64).
- **ElevenLabs** reçoit le texte à lire (peut inclure des étapes de recette ou des messages chat).
- **Pexels / Unsplash** reçoivent uniquement des termes de recherche en anglais.
- Anthropic et ElevenLabs sont basés aux US — pas de mention DPA / transfert UE→US documenté.

### Suppression de compte
**❌ Pas de flow de suppression de compte.**
- [`useAuthStore.logout()`](src/store/useAuthStore.js:21) vide `user` + `consents` du store auth uniquement.
- [`useSubscriptionStore.cancelSubscription()`](src/store/useSubscriptionStore.js:248) downgrade en `free` et garde l'email.
- [`useFamilyStore.reset()`](src/store/useFamilyStore.js:258) vide le profil foyer uniquement.
- Chaque store individuel a un `clear()` ou `removeEntry()` (recettes du carnet, favoris, etc.) mais **aucun bouton « Supprimer mon compte » n'existe nulle part dans l'UI** et **aucune action ne purge l'ensemble des 14 clés `localStorage`** d'un coup.
- Les consentements sont collectés dans [AuthPage.jsx:161](src/pages/AuthPage.jsx:161) (mention RGPD + lien « Politique de confidentialité » non fonctionnel), mais aucune action ne donne suite (pas d'export de données, pas de retrait de consentement, pas de droit à l'oubli).

---

## 6. ANALYTICS

**Aucun analytics, aucun outil d'observabilité produit ou erreurs n'est installé.**

- ❌ Aucun Google Analytics / GTM (rien dans [index.html](index.html), aucun `gtag`, aucun import).
- ❌ Aucun PostHog, Mixpanel, Amplitude, Segment.
- ❌ Aucun Sentry, Datadog RUM, LogRocket, Bugsnag.
- ❌ Aucun Hotjar, FullStory, Clarity (recording).
- ❌ Aucun Plausible, Fathom, Umami.
- ❌ Aucun pixel Facebook / TikTok / LinkedIn.
- ❌ Aucun heartbeat / ping interne.

**Seul logger en place** : `morgan('tiny')` côté backend Express ([backend/server.js:40](backend/server.js:40)) — log HTTP basique en stdout (uniquement visible dans la console du serveur, non agrégé, non persisté).

[ANALYSE_PROJET.md](ANALYSE_PROJET.md) §8 phase 3 recommande d'ajouter Sentry et un logger backend pour les appels IA (latence, coût, erreurs Claude). Ce n'est pas fait.

---

## Synthèse exécutive

- **Stack solide pour un MVP, zéro production.** Pas de git distant, pas d'hébergeur, pas de DB.
- **Plus gros risque financier** : une clé Anthropic active est dans [.env](.env). Si l'app est buildée puis déployée statiquement en l'état (sans backend proxy), elle fuit publiquement et n'importe quel attaquant peut générer des recettes (Opus, 16 k tokens) à volonté.
- **Plus gros risque produit** : l'abonnement est purement front. N'importe qui peut s'auto-activer Premium en éditant `localStorage`. Stripe n'est pas branché.
- **Plus gros risque RGPD** : données de santé collectées (symptômes, plans médicaux PDF) sans chiffrement, sans flow de suppression de compte, sans politique de confidentialité publiée. Les documents médicaux sont en plus envoyés à Anthropic (US).
- **Observabilité** : zéro. En cas de bug en prod, aucune trace.

À traiter en priorité avant tout déploiement public : (1) basculer 100 % des appels IA sur le backend Express + héberger ce backend avec les clés ; (2) brancher Stripe (ou LemonSqueezy) avec webhooks et plan persisté côté serveur ; (3) ajouter un endpoint « supprimer mon compte » + politique de confidentialité ; (4) installer Sentry au minimum.
