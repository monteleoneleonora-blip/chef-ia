# Chef IA — Contexte produit & user stories

> Document de référence pour le pilotage produit, axé parcours utilisateur.
> Mis à jour le 6 mai 2026.

---

## 1. Vue d'ensemble produit

**Chef IA** est une application web mobile-first qui aide une personne (et sa famille) à décider quoi cuisiner, à le cuisiner correctement, et à comprendre l'impact de ce qu'elle mange sur son bien-être. L'app s'adresse à des gens qui veulent manger varié, équilibré, et adapté à leurs contraintes (régimes, intolérances, budget, équipement, frigo du moment), sans passer une heure à chercher des idées.

**Promesse principale** : « En 3 questions, je vous prépare des recettes sur-mesure ».

**Trois piliers fonctionnels** :

1. **Décider** — un parcours story (Buongiorno !) qui transforme 5 questions en une sélection de recettes prêtes à cuisiner, avec une banque de 114 recettes en repli si l'IA n'est pas accessible.
2. **Cuisiner** — fiche recette riche : photo réelle, ingrédients scalables, étapes lisibles, lecture vocale étape par étape, minuteur de cuisson, astuce du chef, version enfant.
3. **Apprendre & gérer** — favoris, liste de courses agrégée, suivi du bien-être après chaque repas avec détection d'intolérances, promos magasins, carnet personnel.

**Stack** : React 18 + Vite 5, Tailwind v4, Zustand 5 persisté en `localStorage`, Anthropic Claude (Opus pour la génération principale, Sonnet pour le chat et les fonctions Premium), ElevenLabs (voix Charlotte), backend Express optionnel pour proxifier les clés API.

**Direction visuelle** : « Dolce Vita » — jaune Sicile, bleu Klein, ivoire trattoria. Mascotte chef italien (toque, moustache, tablier rayé). Stories plein écran type Instagram pour le parcours principal.

---

## 2. Personas & plans tarifaires

### 2.1 Personas

| Persona | Profil | Besoins principaux |
|---|---|---|
| **Léa, jeune actif célibataire** | 28 ans, télétravail, peu de temps, frigo souvent à moitié vide | Idées rapides, mode Frigo, mode Express, peu de vaisselle |
| **Marc & Camille, couple foodie** | 35 ans, deux convives, aiment essayer des cuisines du monde | Inspirations cuisines, recettes IA originales, carnet pour les coups de cœur |
| **Famille Berger, 2 ados + parents** | 4-5 personnes, contraintes mixtes (un végé, un sans gluten, ado sportif) | Profils diététiques par membre, scaling automatique, courses partagées |
| **Sophie, suivi santé** | 42 ans, intolérances soupçonnées, plan diététique du médecin | Onglet Bien-être, détection d'intolérances, plan médical par photo |
| **Kévin, étudiant budget serré** | 21 ans, budget < 50 €/semaine | Mode Budget IA, banque économique, promos magasins, mode visiteur |

### 2.2 Plans

| Plan | Prix | IA | Chat | Banque | Fonctions Premium | Cible |
|---|---|---|---|---|---|---|
| **Visiteur** | 0 € | ❌ | 5 / mois | Limitée à 3 recettes | ❌ | Découverte sans inscription |
| **Free** | 0 € | ❌ | 30 / mois | Illimitée | ❌ | Utilisateur engagé qui s'appuie sur la banque |
| **Premium** | 4,99 € / mois | ✅ illimitée | ✅ illimité | ✅ + ajouts perso | ✅ Frigo / Express / Budget / Transform / Carnet | Cœur de cible monétisé |
| **Family** | 9,99 € / mois | ✅ illimitée | ✅ illimité | ✅ | ✅ + (preview) profils famille, batch cooking | Foyers 3+ personnes |

---

## 3. Parcours utilisateur principaux

### 3.1 Onboarding première visite (visiteur → free)

```
[Atterrissage] → WelcomeScreen plein écran
   1. Buongiorno + intro Chef italien
   2. Pour combien de personnes ? (chips 1-6)
   3. Quel type de repas ? (3 cards)
   4. Préférences alimentaires ? (multi-select)
   → bascule plan visitor → free, push réponses dans WizardStore
   → ouvre GeneratorPage qui consomme les réponses et génère / matche
```

Critères de réussite : moins de 30 secondes, possibilité de skip, navigation back possible.

### 3.2 Génération de recettes (parcours principal)

```
[GeneratorPage — vue 'story'] flow story plein écran 6 cartes :
   0. Buongiorno !            (intro chef, lien banque)
   1. Capitolo uno  : Quels repas ?           (3 cards stepper)
   2. Capitolo due  : Pour combien de personnes ?  (stepper + presets)
   3. Capitolo tre  : Inspirations culinaires (chips cuisines)
   4. Capitolo quattro : Régimes alimentaires (chips multi)
   5. Finalmente !  : récap + bouton Générer
        ├─ si premium → claude.js (Opus 4.6) en streaming SSE
        └─ si free    → recipeMatcher.js (matching dans la banque)
   → bascule sur la vue 'results'
[Vue 'results'] : header "X recettes générées", groupes par type de repas, RecipeCards
   → actions : favori (♥), courses (🛒), écouter, transformer (Premium)
```

### 3.3 De la recette à la cuisine

```
[RecipeCard]
   - Cliquer "Voir la recette" → expand ingrédients + étapes
   - Ajuster servings (stepper) → quantités scalées en live
   - "Écouter" → TTS étape par étape, navigation Suivant/Précédent
   - "Minuteur" → décompte cuisson par étape
   - ♥ Favori → useFavoritesStore
   - 🛒 Courses → useShoppingStore (l'agrégation se fait dans buildShoppingList)
   - 🚫 Rejeter → useRedListStore (exclu du matching)
```

### 3.4 Préparation des courses

```
[ShoppingListPage]
   - Header glass : recettes incluses + total ingrédients
   - Progress bar (cochés / total)
   - Liste agrégée triée par rayon (sommée si même unité)
   - Cocher au fur et à mesure → barré + opacité 40%
   - Actions : copier, imprimer, vider
   - Empty state : "la lista è vuota"
```

### 3.5 Suivi du bien-être

```
[StatisticsPage]
   1. Saisir un repas (3 étapes : info / ressentis sur 6 axes / aliments + symptômes)
   2. Visualisation :
       - 6 KPI cards (énergie, digestion, satiété, légèreté, humeur, satisfaction)
       - RadarChart bien-être
       - BarChart par cuisine et par type de repas
       - LineChart évolution 30 derniers repas
   3. Détection d'intolérances :
       - Après 2+ repas par groupe alimentaire
       - Score composite (digestion + légèreté + taux de symptômes)
       - Cards d'alerte par groupe (alert / warning / neutral / good / insufficient)
```

### 3.6 Fonctions Premium (5 modes IA)

```
[PremiumPage] hub des 5 fonctions, gardé par PremiumGate
   ├─ Frigo     : "J'ai X, Y, Z dans mon frigo" → recette anti-gaspi
   ├─ Express   : "30 min max, repas du soir, 2 pers" → idée réaliste
   ├─ Budget IA : "5 €/personne max" → recette économique
   ├─ Transform : prend une recette existante → variante (vegan, sans gluten, plus rapide…)
   └─ Carnet    : sauvegarde manuelle des coups de cœur Premium avec tags + notes
```

### 3.7 Promos magasins

```
[PromoPage] (embarqué dans la banque, pas dans la nav)
   1. StoreSelector : choisir l'enseigne (6 disponibles)
   2. PromoGrid : cocher les produits intéressants
   3. promoRecipeAI : générer une recette qui exploite ces promos avec calcul économies
   → PromoRecipeCard avec "économie réalisée" affichée
```

### 3.8 Conversation avec le Chef IA

```
[ChatPanel] flottant en bas à droite, présent sur toutes les pages
   - Cliquer le bouton chef → ouverture du panel
   - 5 suggestions par défaut (substitut beurre, brunoise, …)
   - Saisie texte ou micro (Web Speech API, auto-envoi 600 ms après le final)
   - Streaming SSE token par token + timer "Xs"
   - Si bloc ```recipe-json détecté → bouton "Sauvegarder dans la banque"
   - Toggle 🔊 lecture auto (ElevenLabs Charlotte ou speechSynthesis natif)
   - Quota décompté : pastille "X msg" en bas du panel
```

---

## 4. User stories par fonctionnalité

> Format : `En tant que [persona], je veux [action], afin de [bénéfice].`
> Convention : la 1re story de chaque bloc est la « happy path » essentielle.

### 4.1 Onboarding & accueil

- En tant que **nouveau visiteur**, je veux comprendre ce que fait Chef IA en moins de 5 secondes, afin de décider si je continue ou si je quitte.
- En tant que **nouveau visiteur**, je veux répondre à 3 questions courtes (personnes / type de repas / régimes), afin que les premières recettes soient déjà personnalisées.
- En tant que **nouveau visiteur**, je veux pouvoir **passer l'onboarding** d'un seul tap, afin d'accéder direct à l'app si je suis pressé.
- En tant que **nouveau visiteur**, je veux pouvoir **revenir en arrière** dans l'onboarding, afin de corriger une réponse sans tout recommencer.
- En tant que **utilisateur récurrent**, je veux **ne plus voir l'onboarding**, afin de gagner du temps à chaque ouverture.
- En tant que **utilisateur visiteur**, je veux qu'à la fin de l'onboarding mon plan passe automatiquement en `free`, afin d'avoir accès à la banque complète.

### 4.2 Parcours de génération de recettes

- En tant que **utilisateur**, je veux choisir combien de **petits-déjeuners / déjeuners / dîners** je veux générer, afin que la sélection couvre vraiment mes besoins de la semaine.
- En tant que **utilisateur**, je veux régler le **nombre de convives** au stepper et avec des presets (2/4/6/8), afin que les quantités soient justes.
- En tant que **utilisateur**, je veux choisir des **inspirations culinaires** (italien, asiatique, marocain…), afin d'avoir des recettes qui me parlent.
- En tant que **utilisateur**, je veux laisser les inspirations vides, afin d'avoir de la variété par défaut.
- En tant que **utilisateur**, je veux cocher mes **régimes alimentaires** (végé, vegan, sans gluten…), afin d'éviter qu'on me propose des recettes incompatibles.
- En tant que **utilisateur Premium**, je veux ouvrir un panneau **Configuration avancée** depuis le récap final, afin de paramétrer les profils par membre, les équipements de cuisine, les ingrédients interdits et les plans médicaux.
- En tant que **utilisateur**, je veux voir un **récap visuel** sur la dernière story (repas / convives / cuisines / régimes) avant de lancer la génération, afin de ne pas avoir de mauvaise surprise.
- En tant que **utilisateur Premium**, je veux que le bouton **Générer** lance l'IA Claude Opus en streaming, afin que les recettes apparaissent vite et soient 100 % originales.
- En tant que **utilisateur free**, je veux que le bouton **Générer** lance le matcher dans la banque, afin d'avoir un résultat immédiat sans payer.
- En tant que **utilisateur free**, je veux qu'un CTA clair m'invite à passer Premium pour la génération IA, afin de comprendre la valeur ajoutée du payant.
- En tant que **utilisateur**, je veux pouvoir **parcourir la banque** depuis le récap final, afin de ne pas être obligé de générer.
- En tant que **utilisateur**, je veux pouvoir **revenir à la cuisine** depuis les résultats ou la banque, afin de re-générer avec des paramètres différents.

### 4.3 Fiche recette & cuisine

- En tant que **utilisateur**, je veux voir la **photo, le titre, le temps total, le nombre de personnes et la difficulté** au premier coup d'œil, afin de juger rapidement si la recette m'intéresse.
- En tant que **utilisateur**, je veux **scaler les portions** (de 1 à 12) sans recharger, afin que la liste d'ingrédients suive automatiquement.
- En tant que **utilisateur**, je veux voir les **valeurs nutritionnelles par personne** (kcal, protéines, glucides), afin de garder un œil sur mes apports.
- En tant que **utilisateur**, je veux des **étapes numérotées et lisibles**, afin de cuisiner sans me perdre.
- En tant que **utilisateur Premium**, je veux écouter la recette **étape par étape avec ElevenLabs**, afin de cuisiner les mains pleines.
- En tant que **utilisateur**, je veux un **minuteur de cuisson** intégré pour chaque étape avec un temps, afin de ne pas oublier le four.
- En tant que **utilisateur avec enfant**, je veux voir une **note enfant** simple (« Étape facile : casser les œufs ! »), afin que mon ado m'aide.
- En tant que **utilisateur**, je veux voir les **astuces du chef** en bas de la fiche, afin d'apprendre.
- En tant que **utilisateur**, je veux les **badges régimes / budget** sur la carte, afin de scanner ma liste de favoris d'un coup d'œil.

### 4.4 Banque de recettes

- En tant que **utilisateur**, je veux **rechercher** une recette par nom ou cuisine, afin de retrouver vite.
- En tant que **utilisateur**, je veux **filtrer par type de repas** (petit-déj / déjeuner / dîner / tous), afin de scanner uniquement ce qui m'intéresse.
- En tant que **utilisateur**, je veux **filtrer par cuisine** (italien, asiatique, …), afin de varier les inspirations.
- En tant que **utilisateur**, je veux **filtrer par budget** (éco / moyen / premium / max €/personne), afin de respecter mon budget.
- En tant que **utilisateur**, je veux **trier** (récents, A→Z, difficulté, budget asc/desc), afin d'organiser ma navigation.
- En tant que **utilisateur**, je veux **ajouter une recette personnelle** avec photo, ingrédients, étapes, afin d'avoir tout au même endroit.
- En tant que **utilisateur**, je veux **supprimer une recette** de la banque, afin de nettoyer.
- En tant que **utilisateur**, je veux pouvoir **vider la banque** avec confirmation, afin de repartir de zéro sans drame.
- En tant que **utilisateur visiteur**, je veux voir **3 recettes vedettes** mises en avant, afin d'avoir un aperçu de la qualité avant de m'engager.

### 4.5 Favoris

- En tant que **utilisateur**, je veux **ajouter une recette aux favoris en un tap**, afin de la retrouver demain.
- En tant que **utilisateur**, je veux **rechercher dans mes favoris**, afin de retrouver vite quand j'en ai beaucoup.
- En tant que **utilisateur**, je veux **filtrer mes favoris par type de repas**, afin de planifier la semaine.
- En tant que **utilisateur**, je veux **trier par récents ou A→Z**, afin de voir mes derniers coups de cœur en premier.
- En tant que **utilisateur**, je veux **retirer un favori** sans confirmation, afin d'aller vite.
- En tant que **utilisateur**, je veux voir un **état vide engageant** (« amore mio… ») quand je n'ai pas encore de favoris, afin d'être incité à en ajouter.

### 4.6 Liste de courses

- En tant que **utilisateur**, je veux **ajouter toutes les recettes d'une sélection à la liste**, afin de préparer mes courses pour la semaine.
- En tant que **utilisateur**, je veux que les **mêmes ingrédients soient agrégés** (somme des unités), afin de ne pas acheter en double.
- En tant que **utilisateur**, je veux **cocher au fur et à mesure** dans le magasin, afin de suivre l'avancement.
- En tant que **utilisateur**, je veux voir une **barre de progression** (% cochés), afin de visualiser ma progression.
- En tant que **utilisateur**, je veux voir un **message de réussite** quand tout est coché, afin de finir la course sur une bonne note.
- En tant que **utilisateur**, je veux **copier la liste dans le presse-papier**, afin de la coller dans mes notes ou un message.
- En tant que **utilisateur**, je veux **imprimer la liste**, afin de l'avoir sur papier dans le sac de courses.
- En tant que **utilisateur**, je veux **retirer une recette** de la liste, afin d'ajuster sans perdre tout le monde.
- En tant que **utilisateur**, je veux **vider toute la liste** d'un seul bouton, afin de repartir à zéro.
- En tant que **utilisateur**, je veux **tout décocher** sans tout supprimer, afin de pouvoir refaire les mêmes courses.

### 4.7 Recettes rejetées

- En tant que **utilisateur**, je veux **rejeter une recette qui ne me plaît pas**, afin qu'elle ne me soit plus jamais proposée.
- En tant que **utilisateur**, je veux **voir la liste de mes recettes rejetées**, afin de pouvoir réintégrer une recette si je me suis trompé.
- En tant que **utilisateur**, je veux **vider la liste des rejetées**, afin de redonner une chance à toutes les recettes.

### 4.8 Bien-être & détection d'intolérances

- En tant que **utilisateur**, je veux **enregistrer un repas** (date, type, cuisine, recette consommée), afin de tracer mes habitudes.
- En tant que **utilisateur**, je veux **noter mes ressentis** sur 6 axes (énergie, digestion, satiété, légèreté, humeur, satisfaction), afin de mesurer comment je me sens après.
- En tant que **utilisateur**, je veux **cocher des aliments suspects** et des **symptômes** (ballonnements, fatigue, maux de tête…), afin que l'app puisse détecter des patterns.
- En tant que **utilisateur**, je veux voir un **score d'intolérance** par groupe alimentaire (gluten, lactose, légumineuses, …) après 2+ repas, afin de comprendre mes inconforts.
- En tant que **utilisateur**, je veux voir un **radar bien-être** synthétisant mes 6 axes, afin de voir mes points forts et faibles.
- En tant que **utilisateur**, je veux voir un **bar chart par cuisine et par type de repas**, afin de savoir quelle cuisine me réussit le mieux.
- En tant que **utilisateur**, je veux voir une **courbe d'évolution sur 30 jours**, afin de suivre une amélioration ou une dégradation.
- En tant que **utilisateur**, je veux **supprimer un repas mal saisi**, afin de garder des stats fiables.

### 4.9 Chat avec le Chef IA

- En tant que **utilisateur**, je veux **poser une question culinaire** par texte, afin d'avoir un avis d'expert immédiat.
- En tant que **utilisateur**, je veux **parler au chef** au micro, afin de ne pas avoir à taper.
- En tant que **utilisateur**, je veux que les **réponses arrivent en streaming**, afin de ne pas attendre 30 secondes devant un écran vide.
- En tant que **utilisateur**, je veux que **mes 5 dernières conversations soient gardées**, afin de pouvoir reprendre.
- En tant que **utilisateur**, je veux **effacer l'historique** d'un seul bouton, afin de repartir propre.
- En tant que **utilisateur**, je veux activer la **lecture vocale automatique** des réponses, afin de cuisiner les mains libres.
- En tant que **utilisateur**, je veux **sauvegarder une recette** que le chef m'a dictée, afin de l'avoir dans ma banque.
- En tant que **utilisateur free**, je veux voir mon **quota de messages restants**, afin de savoir quand je dois passer Premium.
- En tant que **utilisateur free qui atteint la limite**, je veux voir un **upgrade modal clair**, afin de comprendre l'offre Premium.

### 4.10 Mode Frigo (Premium)

- En tant que **utilisateur Premium**, je veux **lister les ingrédients que j'ai dans mon frigo**, afin que le chef me propose une recette anti-gaspi.
- En tant que **utilisateur Premium**, je veux savoir **quels ingrédients me manquent** pour la recette suggérée, afin de décider d'aller au magasin ou pas.
- En tant que **utilisateur Premium**, je veux **demander une autre suggestion** avec les mêmes ingrédients, afin d'avoir le choix.
- En tant que **utilisateur Premium**, je veux **sauvegarder la recette dans le carnet**, afin de la retrouver plus tard.

### 4.11 Mode Express (Premium)

- En tant que **utilisateur Premium**, je veux préciser une **situation** (« déjeuner pour 2, j'ai 20 min, je n'ai pas envie de viande »), afin d'avoir une idée réaliste tout de suite.
- En tant que **utilisateur Premium**, je veux fixer un **temps maximum**, afin que la recette tienne dans mon créneau.
- En tant que **utilisateur Premium**, je veux pouvoir **régénérer** si la suggestion ne me parle pas, afin d'avoir des alternatives.

### 4.12 Mode Budget IA (Premium)

- En tant que **utilisateur Premium**, je veux **fixer un budget €/personne**, afin de respecter mes limites.
- En tant que **utilisateur Premium**, je veux que la recette générée affiche le **coût total et par personne**, afin de vérifier.
- En tant que **utilisateur Premium**, je veux que la recette inclue des **astuces budget** (où acheter, alternatives moins chères), afin d'apprendre à économiser.

### 4.13 Mode Transform (Premium)

- En tant que **utilisateur Premium**, je veux **transformer une recette existante** en variante (vegan, sans gluten, plus rapide, plus light), afin d'adapter sans tout réécrire.
- En tant que **utilisateur Premium**, je veux que la variante précise **les changements clés** par rapport à l'original, afin de comprendre ce qui a été adapté.

### 4.14 Carnet personnel (Premium)

- En tant que **utilisateur Premium**, je veux **sauvegarder une recette** dans mon carnet, afin de constituer une bibliothèque personnelle.
- En tant que **utilisateur Premium**, je veux **ajouter des tags** (« week-end », « pour les copains », « réconfort »), afin de retrouver par contexte.
- En tant que **utilisateur Premium**, je veux **ajouter une note libre** (« j'ai mis 1/2 cuillère de moins de sel »), afin de me souvenir de mes ajustements.
- En tant que **utilisateur Premium**, je veux **filtrer par tag**, afin de retrouver vite une recette adaptée.
- En tant que **utilisateur Premium**, je veux **supprimer une entrée** du carnet, afin de garder seulement mes vraies préférées.

### 4.15 Promos magasins

- En tant que **utilisateur**, je veux **choisir mon enseigne préférée** (Carrefour, Leclerc, Intermarché, Grand Frais, Lidl, Aldi), afin d'accéder à ses promos.
- En tant que **utilisateur**, je veux voir les **promos de la semaine** organisées par rayon, afin d'identifier les bonnes affaires.
- En tant que **utilisateur**, je veux **cocher plusieurs produits en promo**, afin de bâtir mon panier d'inspiration.
- En tant que **utilisateur Premium**, je veux **générer une recette qui exploite ces promos**, afin de cuisiner pas cher avec ce qui est en réduction.
- En tant que **utilisateur Premium**, je veux voir l'**économie réalisée** par rapport au prix normal, afin de me motiver.

### 4.16 Plans nutritionnels par photo (Premium)

- En tant que **utilisateur Premium suivi par un médecin**, je veux **uploader la photo d'une ordonnance ou d'un plan diététique**, afin que le chef adapte mes recettes en conséquence.
- En tant que **utilisateur Premium**, je veux que l'app **extraie automatiquement** les apports cibles (kcal, protéines, glucides, lipides, fibres), afin que je n'aie pas à les saisir.
- En tant que **utilisateur Premium**, je veux pouvoir **désactiver** un plan médical à tout moment, afin de revenir à des recettes libres.

### 4.17 Profils famille (Family — preview)

- En tant que **utilisateur Family**, je veux **créer un profil par membre du foyer**, afin que chaque personne ait ses régimes et restrictions.
- En tant que **utilisateur Family**, je veux que les **recettes générées soient compatibles avec tous les profils**, afin de cuisiner un seul plat pour tout le monde.
- En tant que **utilisateur Family avec un enfant**, je veux préciser l'**âge des enfants**, afin que les recettes soient adaptées (textures, allergènes courants).
- En tant que **utilisateur Family**, je veux pouvoir **switcher de profil principal** rapidement, afin de cuisiner pour une personne en particulier.

### 4.18 Abonnement & paiement

- En tant que **utilisateur visiteur**, je veux **comprendre clairement les 4 plans** (visiteur / free / premium / family), afin de choisir.
- En tant que **utilisateur free**, je veux **passer Premium** depuis n'importe quelle paywall, afin de ne pas perdre le contexte.
- En tant que **utilisateur Premium**, je veux **voir mon plan actif** dans le header, afin d'avoir une réassurance.
- En tant que **utilisateur Premium**, je veux **annuler mon abonnement** depuis la page Subscription, afin de garder le contrôle.
- En tant que **utilisateur Premium**, je veux voir un **récap de mon usage** (recettes IA générées, chats utilisés ce mois), afin d'évaluer la valeur du plan.

### 4.19 Navigation & accessibilité

- En tant que **utilisateur mobile**, je veux une **nav inférieure 4 + Plus** qui rentre sur tous les écrans, afin d'avoir une expérience fluide.
- En tant que **utilisateur mobile**, je veux que **tous les écrans respectent le safe area** (notch, home indicator), afin que rien ne soit coupé.
- En tant que **utilisateur clavier**, je veux pouvoir **naviguer dans le wizard avec les flèches haut/bas**, afin d'utiliser l'app sans souris.
- En tant que **utilisateur clavier**, je veux des **focus rings visibles** (3 px bleu Klein), afin de toujours savoir où je suis.
- En tant que **utilisateur lecteur d'écran**, je veux des **labels ARIA cohérents** sur tous les boutons, afin de comprendre les actions.
- En tant que **utilisateur**, je veux que le **chat flottant ne masque jamais la nav**, afin d'avoir tous les boutons accessibles.

### 4.20 Onboarding contextuel & tutoriels

- En tant que **utilisateur free qui découvre la banque**, je veux voir un **tutorial overlay** pointant les filtres clés, afin d'être guidé.
- En tant que **utilisateur free qui ouvre les promos**, je veux un **mini-tutoriel** sur le workflow magasin → produits → recette, afin de ne pas être perdu.

---

## 5. Métriques de succès suggérées

| Métrique | Objectif | Mesure |
|---|---|---|
| **Activation** | 70 % des nouveaux visiteurs terminent l'onboarding | `localStorage['chef-ia-welcomed'] === 'true'` côté serveur (avec backend) |
| **TTV (Time To Value)** | < 1 minute entre 1re ouverture et 1re recette consultée | Tracking client : timestamp open → 1re ouverture de RecipeCard |
| **Engagement banque** | ≥ 5 recettes consultées la 1re semaine | Compteur d'ouverture par recette |
| **Conversion free → premium** | 5–8 % à 30 jours | Comparaison `useSubscriptionStore.activate('premium')` vs cohorte free |
| **Rétention J7 / J30** | 35 % / 18 % | Backend logs |
| **Adoption Frigo / Express** | 40 % des Premium les utilisent au moins 1 fois / mois | `usage.aiGenerated` par mode |
| **Liste de courses** | 60 % des recettes cochées en favoris finissent dans la liste | Cross-store ratio |
| **Bien-être** | 25 % des Premium saisissent ≥ 4 repas / semaine | `useFeedbackStore.entries` par utilisateur |
| **Chat satisfaction** | 80 % des conversations terminées sans abandon (pas de fermeture < 5 s) | Tracking timestamp ouverture/fermeture |

---

## 6. Roadmap produit suggérée

### Court terme (1-2 sprints)
- Sécuriser la prod : backend proxy + Stripe (cf. ANALYSE_PROJET §8 phase 1).
- Réintroduire la **Configuration avancée** (régimes par membre, équipements, plans médicaux) dans le wizard.
- Brancher `useRedListStore` au matcher (les rejetées sont stockées mais pas filtrées).
- Ajouter Promos à la nav principale ou le supprimer du standalone.
- Unifier le schéma recette `name` / `nom`.

### Moyen terme (3-6 sprints)
- Activer **Profils famille** réellement (le store existe, le générateur ne les utilise pas).
- **Batch cooking** (combiner plusieurs recettes en session de prep).
- **PWA** + mode offline sur les favoris.
- **Vraies promos** via API tierce (Promoz, BonjourPanier).
- **Synchronisation multi-device** (favoris, banque, courses).

### Long terme (6-12 mois)
- **Marketplace de chefs** : créateurs publient des recettes premium.
- **Coaching nutritionnel** par photo (intégration avec un partenaire diététicien).
- **Mode famille connecté** : chaque membre a son téléphone, le chef synchronise les listes de courses.
- **Génération vidéo** des étapes (intégration Runway/Sora-like).

---

*Document vivant — à mettre à jour à chaque release majeure.*
