# Refonte "Dolce Vita" — Chef IA

> Refonte radicale de l'interface et du parcours utilisateur.
> Date : 6 mai 2026

---

## Vision

L'app passe d'un wizard utilitaire 3 étapes à un **flow story plein écran**, dans une ambiance Méditerranée italienne : bleu Santorin, jaune citron sicilien, vert basilic, blanc cassé ivoire, touches de terracotta toscane et rose Bellini.

La mascotte robot devient un **Chef italien** (toque blanche, moustache en guidon, tablier rayé rouge/blanc).

---

## Design System

### Palette (`src/index.css`)

```css
--dolce-blue:        oklch(0.62 0.13 235)    /* bleu Santorin moyen */
--dolce-blue-deep:   oklch(0.42 0.14 240)    /* bleu profond mer Égée */
--dolce-blue-soft:   oklch(0.86 0.06 230)    /* bleu ciel délicat */
--dolce-cream:       oklch(0.96 0.02 85)     /* blanc cassé chaud */
--dolce-ivory:       oklch(0.985 0.012 92)   /* ivoire trattoria */
--dolce-citron:      oklch(0.88 0.16 100)    /* jaune citron éclat */
--dolce-citron-deep: oklch(0.78 0.18 90)     /* jaune doré Sicile */
--dolce-basil:       oklch(0.68 0.16 145)    /* vert basilic frais */
--dolce-basil-deep:  oklch(0.45 0.14 145)    /* vert olive profond */
--dolce-terracotta:  oklch(0.65 0.16 35)     /* terracotta toscan */
--dolce-rose:        oklch(0.82 0.08 20)     /* rose poudré Bellini */
--dolce-stone:       oklch(0.72 0.02 90)     /* pierre travertin */
```

Utilisation Tailwind : `bg-dolce-blue`, `text-dolce-citron-deep`, `border-dolce-basil`, etc.

### Typographie

3 familles, importées depuis Google Fonts :

| Token | Famille | Usage |
|---|---|---|
| `--font-display` | **Fraunces** (axes opsz/SOFT/WONK) | Titres éditoriaux, h1/h2/h3, cartes vedettes |
| `--font-script` | **Italianno** | Accents dolce vita (`buongiorno`, `capitolo uno`, "la dolce cucina") |
| `--font-sans` | **Inter** | Corps de texte, UI |

Classes utilitaires : `font-display`, `font-script`, `font-sans` (par défaut).

### Gradients & ombres

Classes utilitaires fournies dans `index.css` :

- `.bg-dolce-mediterranean` — fond ambiance principale
- `.bg-dolce-sea` — bleu profond pour CTA
- `.bg-dolce-lemon` — jaune citron doux
- `.bg-dolce-sunset` — citron / rose / terracotta
- `.shadow-dolce-soft` — ombre subtile bleutée
- `.shadow-dolce-warm` — ombre dorée
- `.shadow-dolce-deep` — ombre de profondeur

### Animations

- `.animate-bob` — flottement organique (mascotte, hints)
- `.animate-ciao` — entrée pétillante
- Body : `dolce-bg-drift` lent (30s) sur les radiaux

### Glass morphism

- `.glass` — verre clair (header, nav inférieure, modals)
- `.glass-dark` — verre sombre (overlays plein écran)

---

## Nouveau parcours utilisateur

### Architecture des écrans

```
WelcomeScreen (1ère visite)
   │
   ├─ Story 0  : "Buongiorno !" + Chef italien + CTA Iniziamo
   ├─ Story 1  : Pour combien de personnes ? (chips)
   ├─ Story 2  : Type de repas ? (3 cartes)
   └─ Story 3  : Préférences alimentaires (multi)
   │
   ▼
App.jsx
   │
   ├─ Header glass (logo + accent script + pastille premium)
   │
   ├─ MAIN
   │   └─ GeneratorPage (page d'accueil)
   │       │
   │       ├─ Vue 'story' (par défaut)
   │       │   StoryFeed plein écran avec 6 cartes :
   │       │   ├─ Buongiorno + intro
   │       │   ├─ capitolo uno   : Quels repas ?
   │       │   ├─ capitolo due   : Pour combien de personnes ?
   │       │   ├─ capitolo tre   : Inspirations culinaires
   │       │   ├─ capitolo quattro : Régimes alimentaires
   │       │   └─ Récap "À table !" + générer / banque / avancé
   │       │
   │       ├─ Vue 'results' (quand on génère)
   │       │   ResultsPanel + bouton retour
   │       │
   │       └─ Vue 'bank' (banque)
   │           RecipeBankPage + bouton retour
   │
   └─ Nav inférieure tabs (mobile-first)
       ├─ Cuisine    → 'generator'
       ├─ Banque     → 'bank' (génère, ouvre la banque)
       ├─ Favoris    → 'favorites'
       ├─ Courses    → 'shopping'
       ├─ Bien-être  → 'stats'
       └─ Plus ⋯     → overlay : Promos / Rejetées / Premium
```

### Navigation StoryFeed

Le composant `StoryFeed` (`src/components/story/StoryFeed.jsx`) supporte :

- **Scroll snap natif** vertical
- **Touches** : Flèche Haut/Bas, Page Up/Down, Espace
- **Gestes touch** swipe haut/bas
- **Boutons hint** chevrons sur les bords (animés `bob`)
- **Barre de progression** en haut (style stories Instagram)

API :

```jsx
import StoryFeed, { StoryCard } from '@/components/story/StoryFeed'

<StoryFeed onChange={(idx) => console.log(idx)}>
  <StoryCard gradient="bg-dolce-mediterranean">
    {/* contenu story 1 */}
  </StoryCard>
  <StoryCard gradient="bg-dolce-sunset">
    {/* contenu story 2 */}
  </StoryCard>
</StoryFeed>
```

---

## Mascotte Chef italien

Fichier `src/components/mascot/RobotChef.jsx` (nom conservé pour la compat des imports).

**Caractéristiques visuelles** :
- Toque blanche bombée (3 lobes) avec léger reflet
- Visage doré méditerranéen avec joues roses
- Yeux expressifs adaptatifs (happy / excited / cooking / thinking / loading / sad / idle)
- Moustache italienne en guidon noir
- Bouche LIP couleur terracotta selon l'humeur
- Tablier rayé rouge/blanc avec bretelles + poche centrale "C"
- Accessoires : `spatula` | `whisk` | `pasta` | `pizza` | `null`

Animations CSS dédiées (`chef-idle`, `chef-cooking`, `chef-excited`, `chef-bow`).

Compat : les anciennes classes `robot-*` sont aliases vers `chef-*`.

---

## Pages refondues

| Page | État |
|---|---|
| `App.jsx` | ✅ Refondue (header glass + nav inférieure tabs + overlay Plus) |
| `WelcomeScreen.jsx` | ✅ Refondue en flow stories 4 cartes |
| `GeneratorPage.jsx` | ✅ Refondue en flow story plein écran |
| `FavoritesPage.jsx` | ✅ Refondue (header + filtres dolce vita) |
| `mascot/RobotChef.jsx` | ✅ Chef italien |
| `index.css` | ✅ Nouveau design system complet |

### Pages à raffiner (utilisent automatiquement les nouvelles variables CSS mais peuvent gagner en cohérence) :

| Page | Action recommandée |
|---|---|
| `ShoppingListPage.jsx` | Header dolce vita (script + Chef avec spatule), cards rounded-3xl |
| `RecipeBankPage.jsx` | Filtres en chips dolce, cartes plus aérées |
| `StatisticsPage.jsx` | KPI cards en glass, charts Recharts avec palette dolce |
| `PromoPage.jsx` | Header gradient sunset + chips magasins |
| `RejectedPage.jsx` | Adapter au nouveau style |
| `PremiumPage.jsx` | Header signature avec script italien |
| `pages/premium/*.jsx` | Adapter chaque sous-page (Frigo, Express, Budget, Transform, Carnet) |
| `components/results/RecipeCard.jsx` | Migrer vers gradients dolce + tokens CSS |
| `components/chat/ChatPanel.jsx` | Header glass + bulle chef italien |

L'inertie : ces composants utilisent encore les classes `bg-emerald-*`, `border-emerald-*`, etc. Ils restent fonctionnels (les anciennes couleurs Tailwind existent toujours) mais ne reflètent pas la palette Méditerranée tant qu'ils ne sont pas mis à jour.

---

## Fichiers ajoutés / modifiés

```
+ src/components/story/StoryFeed.jsx       (nouveau composant story plein écran)
~ src/index.css                             (design system complet)
~ src/components/mascot/RobotChef.jsx       (Chef italien)
~ src/components/welcome/WelcomeScreen.jsx  (flow stories)
~ src/App.jsx                               (header glass + nav tabs)
~ src/pages/GeneratorPage.jsx               (flow story plein écran)
~ src/pages/FavoritesPage.jsx               (refondu dolce)
+ REDESIGN_DOLCE_VITA.md                    (ce document)
```

---

## Pour Yoann — prochains pas concrets

### À tester immédiatement après `npm install && npm run dev`

1. **Première visite** (clear `localStorage` → reload) : nouveau WelcomeScreen 4 stories
2. **Page d'accueil** (Cuisine) : nouveau flow story plein écran, swipe vertical
3. **Mascotte** : Chef italien dans le header + sur les cartes story
4. **Nav inférieure** : tabs avec bulle citron sur l'actif
5. **Overlay "Plus"** : tap sur ⋯ → grille avec Promos / Rejetées / Premium
6. **Favoris** : nouveau header avec script italien

### Ajustements rapides possibles

- Modifier la palette : éditer les tokens `--dolce-*` dans `src/index.css` (ligne ~95)
- Désactiver l'animation de fond : retirer `animation: dolce-bg-drift…` sur `body`
- Changer la voix script : remplacer `Italianno` par `Great Vibes` / `Pinyon Script` / `Allura` dans le `@import`
- Changer la display : remplacer `Fraunces` par `Playfair Display` / `Cormorant Garamond` dans le même import

### Pages à finir de migrer (priorité)

1. `RecipeCard.jsx` (527 LOC, très visible) — chips en `bg-dolce-citron`, badges premium en gradient citron→terracotta
2. `ChatPanel.jsx` — header en `glass` + chef italien dans les bulles
3. `ShoppingListPage.jsx` — items en cards rounded-3xl, progress en `bg-dolce-basil`
4. `RecipeBankPage.jsx` — filtres en chips dolce, raccourcis premium en gradients dolce
5. `StatisticsPage.jsx` — cartes glass + charts Recharts repalettés

Estimation : ~4-6h de travail par dev pour tout terminer.

---

## Compatibilité backward

- Les anciens `localStorage` existants restent valides (les stores Zustand sont inchangés)
- Le hook `useRecipeForm` est inchangé (donc tous les composants qui l'utilisent continuent à fonctionner)
- Les anciennes classes d'animation `robot-idle`, `robot-cooking`, `robot-excited` sont aliases vers les nouvelles `chef-*`
- L'API et les stores n'ont aucun changement de surface — la refonte est purement visuelle et structurelle (UX flow)

