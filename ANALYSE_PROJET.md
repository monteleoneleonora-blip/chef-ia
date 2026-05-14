# Analyse détaillée — Chef IA (Application de Recettes)

> Rapport de reprise de développement — préparé pour Yoann
> Date : 6 mai 2026
> Périmètre : audit complet du dépôt local (102 fichiers source, ~13 500 lignes)

---

## 1. Vue d'ensemble

**Chef IA** est une SPA React + Vite (sans TypeScript, JS pur avec JSDoc) qui combine un générateur de recettes IA (Anthropic Claude), une banque de recettes locale, un assistant chat vocal, et plusieurs outils premium (frigo, express, budget, transformation, carnet, promos magasins). Le tout est packagé sans backend : tous les appels API partent du navigateur via un proxy Vite, et l'état est persisté dans `localStorage` via Zustand.

**Stack technique**

| Couche | Technologie | Version |
|---|---|---|
| Framework | React | 18.3.1 |
| Build | Vite | 5.4 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) + variables CSS oklch | 4.2 |
| UI primitives | shadcn/ui (style « base-nova ») + Base UI | — |
| State | Zustand 5 + middleware `persist` | 5.0.12 |
| Charts | Recharts | 3.8 |
| Icons | lucide-react | **1.8.0** ⚠️ (cf. § 7) |
| IA conversationnelle | Anthropic API (`claude-opus-4-6`, `claude-sonnet-4-6`) | — |
| Voix | ElevenLabs (`Charlotte`, `eleven_multilingual_v2`) + Web Speech API | — |
| Photos | Pexels + Unsplash + TheMealDB + Wikipedia (chaîne de fallback) | — |

**Configuration & build**

- Alias `@/*` → `src/*` (configuré dans `vite.config.js` et `jsconfig.json`).
- Proxy Vite : `/api/anthropic/*` → `https://api.anthropic.com/*`, `/api/elevenlabs/*` → `https://api.elevenlabs.io/*`. **N'existe qu'en dev** : en prod, le navigateur appellera directement les APIs avec les clés en clair.
- Pas de tests, pas de CI, pas de linter configuré, pas de Git initialisé (`fatal: your current branch 'master' does not have any commits yet`).
- Un dossier `dist/` est présent (build du 6 mai 14:21).

---

## 2. Architecture des dossiers

```
src/
├── App.jsx                  ← root, header + nav + page switch + welcome screen
├── main.jsx                 ← bootstrap React
├── index.css                ← Tailwind v4, thème oklch, animations robot
│
├── api/                     ← clients HTTP (9 fichiers)
│   ├── claude.js            ← génération principale (Opus 4.6, streaming SSE)
│   ├── chat.js              ← assistant conversationnel (Sonnet 4.6)
│   ├── premiumAI.js         ← frigo, express, budget, transform (Sonnet 4.6)
│   ├── promoRecipeAI.js     ← recettes à partir des promos
│   ├── promoService.js      ← lecture du JSON de promos + cache 4h
│   ├── recipeMatcher.js     ← moteur de matching pour le plan gratuit
│   ├── images.js            ← Pexels → Unsplash → TheMealDB → Wikipedia
│   ├── tts.js               ← ElevenLabs Charlotte
│   └── vision.js            ← analyse de PDF/photo nutritionnels
│
├── lib/
│   ├── anthropic.js         ← headers + lecteur SSE générique
│   └── utils.js             ← `cn()` (clsx + tailwind-merge)
│
├── hooks/
│   ├── useRecipeForm.js     ← état du formulaire complet (220 LOC)
│   ├── useRecipeGeneration.js
│   └── useSpeechSynthesis.js ← TTS + lecture étape par étape
│
├── store/                   ← 13 stores Zustand (cf. § 4)
│
├── pages/
│   ├── GeneratorPage.jsx    ← page d'accueil : wizard + résumé + résultats + banque
│   ├── FavoritesPage.jsx
│   ├── ShoppingListPage.jsx
│   ├── RejectedPage.jsx
│   ├── StatisticsPage.jsx   ← 757 LOC, recharts, détection d'intolérances
│   ├── PremiumPage.jsx      ← hub des 5 fonctions IA
│   ├── PromoPage.jsx        ← orphelin du nav (cf. § 7)
│   ├── RecipeBankPage.jsx   ← 510 LOC, embarquée dans GeneratorPage
│   ├── SubscriptionPage.jsx
│   └── premium/
│       ├── FrigoPage.jsx
│       ├── ExpressPage.jsx
│       ├── BudgetAIPage.jsx
│       ├── TransformPage.jsx
│       └── CarnetPage.jsx
│
├── components/
│   ├── form/                ← 12 composants : WizardForm (utilisé) + RecipeForm (mort)
│   ├── results/             ← RecipeCard (527 LOC), ResultsPanel, IngredientList...
│   ├── chat/ChatPanel.jsx   ← chat flottant avec micro/TTS (605 LOC)
│   ├── mascot/              ← RobotChef (SVG animé) + RobotBubble
│   ├── premium/             ← AIRecipeResult, PremiumGate, PremiumPaywall, TransformModal
│   ├── promo/               ← StoreSelector, PromoGrid, PromoRecipeCard
│   ├── recipes/AddRecipeModal.jsx
│   ├── budget/BudgetPanel.jsx
│   ├── tutorial/TutorialOverlay.jsx
│   ├── welcome/WelcomeScreen.jsx ← onboarding vocal première visite
│   ├── subscription/UpgradeModal.jsx
│   ├── generator/SmartSummary.jsx ← carte récap + double CTA (banque / IA)
│   ├── FlowStepper.jsx
│   └── ui/                  ← primitives shadcn (10 composants)
│
├── data/
│   ├── recipeBank.js        ← 114 recettes seed (2 604 LOC)
│   ├── budgetMap.js         ← coût / niveau / astuces budget par recette
│   ├── recipePhotoMap.js    ← URL d'images vérifiées par recette
│   ├── mealDbMap.js         ← mapping vers TheMealDB
│   ├── wikiMap.js           ← mapping vers Wikipedia
│   └── promos-demo.json     ← 30 promos sur 6 enseignes
│
├── constants/               ← cuisines, diets, equipment, ingredients
└── utils/shoppingList.js    ← agrégation d'ingrédients
```

---

## 3. Fonctionnalités utilisateur

### 3.1 Parcours principal (Generator)

`GeneratorPage` est le cœur de l'app. Elle empile :

1. **`FlowStepper` (étape 1/3 « Configurer »)** — fil d'Ariane visuel.
2. **Bandeau paywall** si l'utilisateur n'est pas Premium.
3. **`WizardForm` (sticky à gauche)** — formulaire en 3 étapes (Repas / Cuisines+exclusions / Régimes).
4. **`SmartSummary` (à droite)** — récapitulatif intelligent avec messages adaptatifs du robot mascotte, double CTA (banque + IA), indicateur ETA.
5. **`ResultsPanel`** une fois la génération lancée — skeletons, regroupement par type de repas, animation `slide-in-from-bottom-4` en cascade.
6. **Section « Banque de recettes » embarquée** (`RecipeBankPage embedded`) — toujours accessible même sans IA.

À noter : si le `useWizardStore.pending` est vrai (parcours vocal terminé dans `WelcomeScreen`), `GeneratorPage` consomme les réponses au montage et déclenche la génération automatiquement après 200 ms.

### 3.2 Chat assistant (`ChatPanel`)

- Toujours présent (rendu dans `App.jsx`), bouton flottant en bas à droite.
- Streaming SSE token par token avec timer de génération.
- Reconnaissance vocale Web Speech API (Chrome only) avec auto-envoi 600 ms après le `final`.
- Synthèse vocale ElevenLabs si clé présente, sinon `speechSynthesis` natif.
- Détection automatique d'un bloc ` ```recipe-json ` dans la réponse → bouton « Sauvegarder dans la banque ».
- Quota chat décompté via `useSubscriptionStore.trackChatMessage()`.
- Le system prompt injecte les 30 premières recettes de la banque pour permettre au chef de les commenter ou les dicter.

### 3.3 Cinq fonctions Premium (`PremiumPage` + sous-pages)

| Slug | Module | Modèle IA | Particularité |
|---|---|---|---|
| `frigo` | `FrigoPage` | Sonnet 4.6 | Liste d'ingrédients libres → recette anti-gaspi avec champ `manquants` |
| `express` | `ExpressPage` | Sonnet 4.6 | Saisie d'une « situation » + temps max |
| `budget` | `BudgetAIPage` | Sonnet 4.6 | Contrainte stricte `coutParPersonne` |
| `transform` | `TransformPage` + `TransformModal` | Sonnet 4.6 | Variante d'une recette existante |
| `carnet` | `CarnetPage` | — | Sauvegarde manuelle, tags, note libre |

`PremiumPage` détecte un `useNavStore.premiumTarget` non nul et bascule sur la sous-page directement (utilisé par les raccourcis dans `RecipeBankPage`).

### 3.4 Promos magasins (`PromoPage`)

Workflow en 3 étapes : choix de l'enseigne → grille de produits cochables → recette générée. Données démo dans `src/data/promos-demo.json` (30 produits, 6 enseignes : Carrefour, Leclerc, Intermarché, Grand Frais, Lidl, Aldi). Cache localStorage 4 h. **La page n'est jamais accessible depuis la nav principale** — uniquement embarquée dans `RecipeBankPage` derrière le filtre « En promo ».

### 3.5 Statistiques & détection d'intolérances (`StatisticsPage`)

Saisie d'un repas en 3 étapes (info / ressentis / aliments+symptômes). Le store `useFeedbackStore` agrège les entrées et l'algorithme `detectIntolerances` calcule un score de risque par groupe alimentaire (digestion + légèreté + taux de symptômes). Affichage : KPI cards, RadarChart bien-être, BarChart par cuisine et par type de repas, LineChart évolution 30 derniers repas, cards d'alertes par groupe (alert/warning/neutral/good/insufficient).

### 3.6 Liste de courses, favoris, rejetés

- `useShoppingStore.toggle(recipe)` ajoute/retire une recette ; `buildShoppingList` agrège les ingrédients (somme si même unité, sinon concaténation).
- Cases à cocher persistées (`checkedItemNames`), barre de progression, copie presse-papier, impression CSS dédiée.
- `RejectedPage` exclut les recettes du matching (mais le store ne semble jamais consulté par `recipeMatcher.js` — bug latent, cf. § 7).

### 3.7 Plans nutritionnels par photo (`vision.js`)

Upload d'une image ou PDF (ordonnance, plan diététique). L'API Claude Sonnet 4.6 extrait `kcal`, `protein`, `carbs`, `lipids`, `fiber` par repas (divise par 3 si valeurs journalières) et une note explicative. Utilisé à la fois dans `MedicalPlanSection` (plan global) et dans `FamilyDietsSection.MemberNutritionUpload` (par membre).

### 3.8 Onboarding vocal (`WelcomeScreen`)

Première visite uniquement (gardé par `localStorage['chef-ia-welcomed']`). 3 questions à la voix (`Pour combien de personnes ?` / `Type de repas ?` / `Préférences alimentaires ?`) avec TTS natif et chips fallback. Les réponses sont poussées dans `useWizardStore`, consommées au montage de `GeneratorPage`.

---

## 4. État global (13 stores Zustand)

Tous les stores **sauf** `useNavStore` et `useWizardStore` sont persistés dans `localStorage` (clés préfixées `chef-ia-…`).

| Store | Rôle | Persisté ? | Notes |
|---|---|---|---|
| `useSubscriptionStore` | 4 plans (visitor, free, premium, family), quotas mensuels, tracking | ✓ | Cf. § 5 |
| `useRecipeBankStore` | Banque dédupliquée par nom + seed versionné (v4) | ✓ | Auto-enrichit avec `BUDGET_MAP` au seed |
| `useFavoritesStore` | Liste des favoris | ✓ | Clé : `recipe.name` (risque doublons) |
| `useShoppingStore` | Recettes sélectionnées + ingrédients cochés | ✓ | |
| `useRedListStore` | Recettes rejetées | ✓ | **Non consommé** par `recipeMatcher.js` |
| `useChatStore` | Historique chat (60 derniers) + état panel | ✓ partiel (messages seulement) | |
| `useFeedbackStore` | Entrées de stats bien-être | ✓ | |
| `useCarnetStore` | Recettes Premium sauvegardées + tags + notes | ✓ | Tags prédéfinis dans le store |
| `useBudgetStore` | Filtres budget actifs + préférences € | ✓ | |
| `usePromoStore` | Préférences promo + état session (non persisté via `partialize`) + tutoriel | ✓ partiel | |
| `useHouseholdStore` | Sauvegarde des membres famille (sans `nutritionPlan`) | ✓ | |
| `useNavStore` | `premiumTarget` pour cross-page navigation | ✗ | Read by `App.jsx` + `PremiumPage` |
| `useWizardStore` | Réponses du parcours vocal initial | ✗ | Consommé une fois |

Le pattern est cohérent (sélecteurs `getPlan()/getUsage()`, actions imperatives `add/remove/toggle/clear`), mais on note plusieurs sources de vérité pour la même information (par ex. `useBudgetStore.nbPersonnes` vs `useRecipeForm.totalPeople`) et un pont Carnet ↔ Bank (le carnet stocke `entry.recipe` complet, dupliquant la donnée).

---

## 5. Système d'abonnement

```
visitor  → 0 €  · pas d'IA · 5 chats/mois · banque limitée à 3 recettes
free     → 0 €  · pas d'IA · 30 chats/mois · banque illimitée + favoris + courses
premium  → 4,99 € · IA illimitée + TTS + chat illimité + 5 fonctions Premium
family   → 9,99 € · Premium + (en preview) profils famille, batch cooking
```

L'activation est purement front-side (`activate(planId)` met à jour le store + persiste). `expiresAt = now + 1 mois`. Aucune intégration Stripe, aucun jeton serveur — la mention « En production, ceci serait connecté à Stripe » est explicite dans `SubscriptionPage`.

Le compteur d'usage se réinitialise au début de chaque mois calendaire (`startOfMonth()` + `isNewMonth(resetAt)`). **Bug** : `isNewMonth` compare juste mois et année — un utilisateur qui change de fuseau horaire ou la date système déclenche un reset.

`canUseAI()` n'est vrai que pour `premium`/`family`. Le `getPlan()` fait un `?? PLANS.free` qui masque tout plan inconnu (utile pour la migration).

---

## 6. Couche IA & intégrations externes

### 6.1 Anthropic

Centralisé dans `src/lib/anthropic.js` :

- `getHeaders()` lit `VITE_ANTHROPIC_API_KEY`, ajoute `x-api-key`, `anthropic-version: 2023-06-01` et **`anthropic-dangerous-direct-browser-access: true`**.
- `readSSEStream(response, onChunk)` parse les events `content_block_delta` / `text_delta` et accumule le texte.
- `anthropicPost(path, body, extra)` poste vers `/api/anthropic/v1${path}` (proxifié en dev).

Quatre clients :

| Client | Modèle | `max_tokens` | Stream | Particularité |
|---|---|---|---|---|
| `claude.js` (génération principale) | `claude-opus-4-6` | 8 192 | ✓ | Prompt très structuré : profil foyer, ingrédients, exclusions, profils diététiques par membre, plans médicaux. JSON parsé via `[…]` |
| `chat.js` | `claude-sonnet-4-6` | 1 024 | ✓ | System prompt « Chef IA – pote cuisinier » + injection des 30 dernières recettes de la banque |
| `premiumAI.js` | `claude-sonnet-4-6` | 4 096 | ✓ | 4 fonctions (Frigo / Express / Budget / Transform) avec un schéma JSON commun |
| `promoRecipeAI.js` | `claude-sonnet-4-6` | 4 096 | ✓ | Calcule `economieRealisee` |
| `vision.js` | `claude-sonnet-4-6` | 512 | ✗ | Bloc `image` ou `document` (PDF beta `pdfs-2024-09-25`) |

**Incohérence importante** : la génération principale utilise les champs `name/type/cuisine/imageQuery/servings/prepTime/cookTime/difficulty/kcalPerPerson/proteinPerPerson/carbsPerPerson/diets/ingredients/steps/chefTip/childNote`. Les fonctions Premium et le Chat-recipe utilisent un schéma proche mais avec **`nom`** (FR) au lieu de `name` (EN), pas de `type`, ajoutent `description`, `coutParPersonne`, `badges`, `manquants`. Conséquence : le code (`useCarnetStore`, `AIRecipeResult`) doit jongler avec `recipe.nom ?? recipe.name`. À unifier (cf. § 8).

### 6.2 ElevenLabs

`src/api/tts.js` : voix `XB0fDUnXU5powFXDhCwa` (Charlotte), modèle `eleven_multilingual_v2`. Réglages `stability 0.45 / similarity 0.80 / style 0.35`. Renvoie un `URL.createObjectURL(blob)` libéré dans `useSpeechSynthesis.stop()`.

### 6.3 Photos (`images.js`)

Chaîne de fallback : cache localStorage (LRU 200) → `RECIPE_PHOTO_MAP` (curé manuellement) → Pexels → Unsplash → `MEAL_DB_MAP` → `WIKI_MAP` → TheMealDB par mots-clés filtrés (skip-words tels que `fluffy/creamy/golden/…`) → Wikipedia par mot-clé. Petite typo : deux étapes sont commentées « 4. » dans le code.

### 6.4 Promos

`promoService.js` est volontairement abstrait — un commentaire indique que remplacer `fetchFromAPI()` par un vrai endpoint suffit. La structure d'un produit : `{ id, magasin, nom, rayon, prixNormal, prixPromo, reduction, unite, imageQuery, dateDebut, dateFin }`.

---

## 7. Bugs & dette technique identifiés

### 🔴 Bloquant / sécurité

1. **Clés API exposées au client.** `VITE_ANTHROPIC_API_KEY`, `VITE_ELEVENLABS_API_KEY`, `VITE_PEXELS_KEY`, `VITE_UNSPLASH_KEY` sont injectées par Vite dans le bundle JavaScript. Le proxy Vite (`/api/anthropic`, `/api/elevenlabs`) **n'existe qu'en dev** ; en prod, le bundle appelle directement `api.anthropic.com` avec la clé visible côté client. Le header `anthropic-dangerous-direct-browser-access: true` ne fait que lever la garde Anthropic — il n'apporte aucune protection. **Priorité 1 : déployer un backend (worker Cloudflare, route Vercel, Express…) qui détient les clés et expose des endpoints proxifiés.**

2. **`PremiumGate` laisse passer les visiteurs.**
   ```jsx
   const isPremium = plan !== 'free'   // ← inclut 'visitor' !
   if (isPremium) return children
   ```
   Un visiteur qui force la navigation `/premium/frigo` consomme l'IA gratuitement. Correctif : `plan !== 'free' && plan !== 'visitor'`.

3. **Recettes rejetées (`useRedListStore`) jamais filtrées dans le matching.** `recipeMatcher.js` consulte uniquement la banque ; il n'exclut pas les noms présents dans `redList`. Pourtant, l'UX promet « ne seront plus proposées à la génération » (`RejectedPage` ligne 45). À corriger en passant `redList` au matcher.

4. **Pas de garde sur le plan dans `chat.js`.** `useSubscriptionStore.canChat()` est vérifié seulement dans `ChatPanel.send()` ; un appel programmatique de `chatWithChef` ignorerait le quota. Acceptable tant qu'aucun autre composant n'appelle l'API directement, mais à garder en tête.

### 🟠 Important

5. **`PromoPage` orpheline.** Importée par `RecipeBankPage` (mode embarqué) mais jamais déclarée dans la nav `PAGES` de `App.jsx`. Décider : l'ajouter à la nav, ou supprimer le mode standalone et n'en garder que la version embarquée.

6. **`RecipeForm` mort.** `src/components/form/RecipeForm.jsx` (161 LOC) n'est plus importé que par lui-même ; `GeneratorPage` n'utilise que `WizardForm` (3 étapes simplifiées). Toutes les sections avancées (`MedicalPlanSection`, `FamilyDietsSection`, `EquipmentSelector`, `IngredientsSection`, `CompatibilitySection`, `NutritionTargets`, `ChildrenConfig`) ne sont accessibles nulle part dans l'UI actuelle. **C'est probablement une régression majeure** : `claude.js` génère un prompt très riche qui exploite tous ces champs, mais le wizard simplifié n'en alimente que 3 (repas, cuisines, régimes).

7. **`lucide-react@1.8.0` suspect.** Cette version n'existe pas sur npm (les versions courantes sont 0.5xx). Le `npm list` confirme que c'est ce qui est installé, mais il s'agit probablement d'un fork ou d'un package homonyme. Vérifier ce qui est résolu dans `node_modules` et migrer vers la version officielle (`^0.541.0` au moment de la rédaction).

8. **`scrollToTop` automatique sur changement de page** (`App.jsx`) est en `behavior: 'smooth'` mais `<html>` a déjà `scroll-behavior: smooth` en CSS — on déclenche une animation par-dessus le rendu initial des pages, ce qui peut être perçu comme un saut.

9. **Hack DOM dans `RecipeBankPage`** :
   ```jsx
   document.querySelector('[aria-label="Courses"]')?.click()
   ```
   couplage fragile à la nav. Préférer un `useNavStore.goToPage('shopping')`.

10. **Schéma de recette double (`name` vs `nom`).** Voir § 6.1. Le code traite ce cas sporadiquement (`recipe.nom ?? recipe.name`), mais la liste de courses, les favoris, le matcher utilisent `name` strictement — un objet venant de `premiumAI.js` ne s'agrège pas correctement.

11. **Dédup par `name` partout.** Stores favoris/red/shopping clés par nom uniquement. Deux recettes IA qui génèrent le même titre seront fusionnées même si leurs ingrédients diffèrent.

12. **`seedOnce` réimporte les seeds à chaque incrément de version**, et fait un `recipes.map` complet à chaque montage du root. Avec 114 recettes, ce n'est pas grave aujourd'hui, mais la version saute déjà à v4 — penser à un système de migration explicite.

13. **`useStreamTimer` interne à `Message`** : recréé à chaque rerender. Acceptable, mais l'effet `setInterval` se relance à chaque changement d'`active`.

14. **`useRecipeForm` : `INITIAL_MEMBER` est partagé entre tous les `useState` initiaux**. En JS pur c'est OK (réf en lecture seule au montage), mais plusieurs `addFamilyMember` pourraient partager des structures mutables si on change la valeur initiale en objet imbriqué — défensif via `Date.now().toString()` pour `id`.

### 🟡 Mineur / cosmétique

15. **Copie marketing désynchronisée** : « Banque · 80+ recettes » (`SmartSummary`) alors que la banque seed contient désormais **114 recettes**.
16. **`subscriptionStore.cancelSubscription()`** ne reset pas `usage` — un utilisateur résilié garde son compteur de générations consommées du mois.
17. **Visiteur : 5 messages/mois** (vu via `getUsage()` qui reset). L'intention semble être « 5 à vie » d'après les perks (« 5 messages au chef IA »).
18. **`tts.js` ne libère pas le blob URL** si l'audio plante avant `onended` (le `stop()` du hook le couvre, mais en cas de double-`speak` rapide la 1re URL fuit jusqu'au prochain `stop()`).
19. **Numérotation dupliquée `// 4.`** dans `images.js`.
20. **Chaîne magique `'chef-ia-welcomed'`** localStorage utilisée à 2 endroits (`App.jsx` + `WelcomeScreen.jsx`). Centraliser dans un module de constantes.
21. **`StatisticsPage` (757 LOC) mélange logique métier, sous-composants et page**. Extraire `IntoleranceCard`, `FeelingForm`, `StatCard` dans `components/stats/`.
22. **`RecipeCard` (527 LOC) idem** : timer cuisson, TTS étape par étape, scaling, paywall transform sont tous inlinés. Découpage à prévoir.
23. **Pas de `key` stable pour les recettes IA fraîches** dans `ResultsPanel` (`key={recipe.name}`). Si l'IA renvoie deux recettes au même nom, React warning + animations doublonnées.
24. **Le `seedVersion` est sauvegardé dans le même state que `recipes`** ; un développeur qui appelle `clear()` reset à `seedVersion: 0` ce qui re-seedera au prochain montage — comportement correct mais pas évident.
25. **Aucune accessibilité « skip to content »**, peu de `aria-live`, mais l'ensemble est globalement correct (boutons titlés, `aria-label` présents, `:focus-visible` global stylé).

### ⚪ Outillage

26. **Pas de Git initialisé.** `git log` renvoie « your current branch 'master' does not have any commits yet ». Avant tout, faire `git init && git add . && git commit -m "Reprise"` pour avoir une base de travail.
27. **Pas de tests automatisés** (ni unit, ni E2E).
28. **Pas de linter / formatter** (`eslint.config.*`, `prettier.config.*` absents). Pourtant `// eslint-disable-line react-hooks/exhaustive-deps` apparaît dans `GeneratorPage` et `PromoPage` → quelqu'un a ESLint local mais pas dans le repo.
29. **Pas de `.editorconfig`, pas de `README`.**
30. **`.env` versionné ?** À vérifier : `.gitignore` exclut `.env` et `.env.local`, mais comme aucun commit n'existe, le risque d'avoir poussé les clés est nul pour le moment.

---

## 8. Recommandations stratégiques

### Phase 0 — Prérequis (2-3 jours)

1. **Initialiser Git** et faire un commit de baseline.
2. **Mettre en place ESLint + Prettier** (config flat ESLint 9, plugin React, plugin Tailwind).
3. **Rétrograder ou corriger `lucide-react`** vers une version officielle.
4. **Créer un README** documentant : variables d'env, scripts npm, architecture de haut niveau.

### Phase 1 — Sécuriser la production (1 semaine)

5. **Backend proxy.** Implémenter une fonction Vercel/Cloudflare/Edge qui détient les clés Anthropic, ElevenLabs, Pexels, Unsplash. Le front appelle `/api/recipes`, `/api/chat`, `/api/tts`, `/api/photo`, `/api/vision`. Bonus : déplacer la logique de prompt côté serveur pour pouvoir l'itérer sans redéploiement front.
6. **Authentification minimale** + jetons côté serveur, base de données light (Supabase/PocketBase/Turso) pour persister abonnements, favoris, banque. Le front peut continuer à charger depuis `localStorage` en optimistic + sync serveur.
7. **Brancher Stripe** (ou LemonSqueezy) pour les abonnements réels — webhooks pour synchroniser `useSubscriptionStore.activate()` avec un endpoint serveur.

### Phase 2 — Bugs critiques (3-5 jours)

8. **Corriger `PremiumGate`**, **brancher `useRedListStore` au matcher**, **réintroduire le formulaire avancé** (soit basculer `WizardForm` → `RecipeForm`, soit migrer les sections avancées en mode « configuration avancée » pliable dans le wizard).
9. **Unifier le schéma recette** : choisir `name` partout, écrire un util `normalizeRecipe(raw)` à l'entrée des APIs Premium et Promo.
10. **Ajouter `Promo` à la nav** ou supprimer la version standalone.

### Phase 3 — Qualité & confiance (1-2 semaines)

11. **Tests** : commencer par les utils purs (`shoppingList`, `recipeMatcher`, `detectIntolerances`, `parseTimeToSeconds`, `scaleIngredients`), puis les stores Zustand (faciles à tester sans React), puis les hooks (`useRecipeForm`, `useSpeechSynthesis`).
12. **Découpe des gros composants** : `RecipeCard` (527), `WizardForm` (523), `RecipeBankPage` (510), `FamilyDietsSection` (406), `WelcomeScreen` (401), `SmartSummary` (383), `StatisticsPage` (757).
13. **Migration JavaScript → TypeScript** progressive (commencer par `lib/`, `api/`, `store/`).
14. **Observabilité** : ajouter Sentry pour les erreurs front + un logger côté backend pour les appels IA (latence, coût, erreurs Claude).

### Phase 4 — Évolutions produit (continu)

15. **Profils famille** (déjà mentionné « bientôt » dans `PremiumPage`) — l'infra `useHouseholdStore` est en place mais pas exploitée pour générer.
16. **Batch cooking** — combiner plusieurs recettes en une session de prep.
17. **Synchronisation multi-device** une fois le backend en place.
18. **Vraies promos** via une API tierce (Promoz, BonjourPanier, scraping Carrefour) pour remplacer `promos-demo.json`.
19. **PWA** (manifest, service worker, install prompt) — l'app est très adaptée à un usage mobile.
20. **Mode offline** sur les recettes en favoris (le SW peut cacher photos + JSON).

---

## 9. Cartographie rapide des modules clés

| Quand vous voulez… | Aller dans… |
|---|---|
| Modifier le prompt de génération principale | `src/api/claude.js` (fonction `buildPrompt`) |
| Ajouter une cuisine, un régime, un équipement | `src/constants/{cuisines,diets,equipment,ingredients}.js` |
| Ajouter une recette par défaut | `src/data/recipeBank.js` (incrémenter `CURRENT_VERSION` dans `useRecipeBankStore.seedOnce`) |
| Brancher une vraie API de promos | `src/api/promoService.js` (fonction `getPromos`) |
| Modifier le système d'abonnement | `src/store/useSubscriptionStore.js` (objet `PLANS`) |
| Modifier le ton du chat | `src/api/chat.js` (constante `BASE_SYSTEM`) |
| Changer la voix TTS | `src/api/tts.js` (`VOICE_ID`) |
| Ajouter un sous-mode Premium | `src/api/premiumAI.js` + une page dans `src/pages/premium/` + une entrée dans `FEATURES` (`PremiumPage`) + un slug dans `useNavStore.goToPremium` |
| Modifier le mascot | `src/components/mascot/RobotChef.jsx` + animations dans `src/index.css` |
| Modifier le seuil d'alerte intolérance | `src/pages/StatisticsPage.jsx` (fonction `detectIntolerances`) |

---

## 10. Synthèse exécutive

**Le projet est mature et soigné côté UX/UI** : design cohérent, mascotte attachante, micro-interactions polies, parcours premium clair, intégration vocale aboutie. Le code est lisible, bien commenté en français, l'organisation par feature est saine.

**Les vrais chantiers à attaquer en priorité** sont :

1. 🔐 **Backend proxy + Stripe** — sans ça, l'app ne peut pas être ouverte au public sans risque de fuite de clés et de coûts non maîtrisés.
2. 🐛 **Bug `PremiumGate` (visiteur = premium)** — correctif d'une ligne, à faire immédiatement.
3. 🧠 **Réintroduire le formulaire avancé** ou aligner le wizard simplifié avec le prompt de `claude.js` — il y a aujourd'hui une grosse partie du moteur (régimes par membre, plans médicaux, équipements, associations compatibles/incompatibles) qui n'est plus alimentée par l'UI.
4. 📐 **Unifier le schéma recette** (`name` vs `nom`) pour que la liste de courses, les favoris et le carnet fonctionnent avec toutes les sources.
5. 🧰 **Mettre en place Git, ESLint, README, premiers tests** pour pouvoir itérer en confiance.

Une fois ces fondations posées, les fonctionnalités produit (profils famille, batch cooking, vraies promos, PWA, multi-device) deviennent triviales à dérouler car l'architecture s'y prête déjà.

---

*Fin du rapport — prêt à enchaîner sur le plan d'attaque dès que tu veux.*
