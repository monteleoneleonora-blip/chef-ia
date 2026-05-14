/**
 * Coût estimé par personne + niveau budget pour toutes les recettes de la banque.
 * Règles : économique < 2 € | moyen 2-5 € | premium > 5 €
 * economieTip : conseil pour réduire le coût (optionnel).
 */
export const BUDGET_MAP = {

  // ── Petit-déjeuner ────────────────────────────────────────────────
  "Pain perdu caramel beurre salé": {
    coutParPersonne: 1.25, niveauBudget: "économique",
    economieTip: "Remplace la brioche par du pain de campagne rassis pour réduire de 40 %.",
  },
  "Pancakes fluffy beurre noisette": {
    coutParPersonne: 0.50, niveauBudget: "économique",
    economieTip: null,
  },
  "Granola maison miel amandes": {
    coutParPersonne: 0.75, niveauBudget: "économique",
    economieTip: "Remplace les amandes par des flocons d'avoine supplémentaires pour diviser le coût par 2.",
  },
  "Œufs cocotte à la crème et aux herbes": {
    coutParPersonne: 0.65, niveauBudget: "économique",
    economieTip: null,
  },
  "Porridge avoine banane miel": {
    coutParPersonne: 0.90, niveauBudget: "économique",
    economieTip: null,
  },
  "Tartines avocat œuf poché": {
    coutParPersonne: 2.10, niveauBudget: "moyen",
    economieTip: "Remplace un avocado par de la ricotta pour économiser ~0,80 € par personne.",
  },
  "Bol açaï protéiné fruits rouges": {
    coutParPersonne: 3.80, niveauBudget: "moyen",
    economieTip: "Remplace la poudre d'açaï (chère) par des myrtilles congelées pour diviser le coût par 3.",
  },
  "Overnight oats protéinés pomme cannelle": {
    coutParPersonne: 0.75, niveauBudget: "économique",
    economieTip: null,
  },
  "Omelette aux blancs d'œufs et légumes": {
    coutParPersonne: 1.00, niveauBudget: "économique",
    economieTip: null,
  },
  "Green smoothie détox épinards ananas": {
    coutParPersonne: 1.80, niveauBudget: "économique",
    economieTip: "Utilise des épinards surgelés et de l'ananas en boîte pour descendre à 0,80 €/pers.",
  },
  "Bowl de fromage blanc baies et graines": {
    coutParPersonne: 2.50, niveauBudget: "moyen",
    economieTip: "Remplace les fruits rouges frais par des fruits rouges surgelés (-1 €/pers).",
  },
  "Toast de seigle saumon aneth": {
    coutParPersonne: 3.00, niveauBudget: "moyen",
    economieTip: "Utilise du saumon fumé en chutes (moins cher) pour économiser ~1 €/pers.",
  },
  "Crêpes protéinées à l'avoine": {
    coutParPersonne: 0.75, niveauBudget: "économique",
    economieTip: null,
  },
  "Muesli Bircher pomme noix": {
    coutParPersonne: 1.25, niveauBudget: "économique",
    economieTip: null,
  },

  // ── Classiques français ───────────────────────────────────────────
  "Bœuf bourguignon express Cookeo": {
    coutParPersonne: 4.20, niveauBudget: "moyen",
    economieTip: "Le paleron est moins cher que la joue — économie de ~0,80 €/pers.",
  },
  "Poulet rôti jus corsé façon Etchebest": {
    coutParPersonne: 3.50, niveauBudget: "moyen",
    economieTip: "Un poulet fermier entier coûte moins cher que des découpes — bon rapport qualité-prix.",
  },
  "Risotto crémeux champignons sauvages": {
    coutParPersonne: 3.00, niveauBudget: "moyen",
    economieTip: "Mélange champignons séchés (moins chers) et champignons frais pour garder le goût.",
  },
  "Coq au vin façon bistro parisien": {
    coutParPersonne: 4.50, niveauBudget: "moyen",
    economieTip: "Un vin de table à 3 € suffit pour la cuisson — inutile de prendre un grand cru.",
  },
  "Moules marinières à la crème": {
    coutParPersonne: 2.50, niveauBudget: "moyen",
    economieTip: "Achète les moules en vrac au marché : 2× moins cher qu'en filet préemballé.",
  },
  "Blanquette de veau à l'ancienne": {
    coutParPersonne: 4.80, niveauBudget: "moyen",
    economieTip: "L'épaule de veau est moins chère que le tendron — utilise un mélange des deux.",
  },
  "Gratin dauphinois crème ail": {
    coutParPersonne: 0.85, niveauBudget: "économique",
    economieTip: null,
  },
  "Soupe à l'oignon gratinée": {
    coutParPersonne: 1.20, niveauBudget: "économique",
    economieTip: null,
  },
  "Pot-au-feu traditionnel": {
    coutParPersonne: 3.70, niveauBudget: "moyen",
    economieTip: "Achète les os à moelle chez le boucher — peu chers et ils enrichissent considérablement le bouillon.",
  },
  "Quiche lorraine maison": {
    coutParPersonne: 1.20, niveauBudget: "économique",
    economieTip: null,
  },
  "Tarte tatin aux pommes caramélisées": {
    coutParPersonne: 1.00, niveauBudget: "économique",
    economieTip: null,
  },
  "Crème brûlée vanille Bourbon": {
    coutParPersonne: 1.25, niveauBudget: "économique",
    economieTip: "Remplace la vanille Bourbon par de l'extrait de vanille (-0,80 €/recette).",
  },
  "Mousse au chocolat 70% sans crème": {
    coutParPersonne: 1.50, niveauBudget: "économique",
    economieTip: "Un chocolat noir à 70 % de marque distributeur fonctionne parfaitement.",
  },
  "Velouté de potimarron gingembre": {
    coutParPersonne: 1.25, niveauBudget: "économique",
    economieTip: null,
  },
  "Ratatouille niçoise confite": {
    coutParPersonne: 1.00, niveauBudget: "économique",
    economieTip: null,
  },
  "Tartare de bœuf façon Etchebest": {
    coutParPersonne: 7.00, niveauBudget: "premium",
    economieTip: "Pour un tartare plus accessible, remplace le filet par de la bavette finement hachée (-4 €/pers).",
  },
  "Tarte aux poireaux chèvre frais": {
    coutParPersonne: 1.70, niveauBudget: "économique",
    economieTip: null,
  },
  "Soufflé au fromage de brebis": {
    coutParPersonne: 2.00, niveauBudget: "moyen",
    economieTip: "Remplace le fromage de brebis par de l'emmental râpé — résultat identique, coût divisé par 2.",
  },

  // ── Poissons & fruits de mer ──────────────────────────────────────
  "Saumon mi-cuit beurre blanc nantais": {
    coutParPersonne: 6.00, niveauBudget: "premium",
    economieTip: "Le saumon surgelé de qualité coûte 2× moins cher que le frais pour un résultat quasi identique.",
  },
  "Sole meunière beurre noisette": {
    coutParPersonne: 8.00, niveauBudget: "premium",
    economieTip: "La truite meunière est 4× moins chère et se prépare exactement de la même façon.",
  },
  "Dos de cabillaud en croûte d'herbes": {
    coutParPersonne: 5.50, niveauBudget: "premium",
    economieTip: "Le colin (lieu noir) est 2× moins cher que le cabillaud avec un goût très proche.",
  },
  "Saumon en papillote légumes citron": {
    coutParPersonne: 5.80, niveauBudget: "premium",
    economieTip: "Saumon surgelé -2 €/pers. Résultat en papillote identique.",
  },
  "Tartare de saumon avocat citron vert": {
    coutParPersonne: 3.75, niveauBudget: "moyen",
    economieTip: null,
  },
  "Cabillaud basse température citron confit": {
    coutParPersonne: 5.80, niveauBudget: "premium",
    economieTip: "Le lieu noir supporte très bien la cuisson basse température à moitié prix.",
  },
  "Saint-Jacques poêlées beurre blanc agrumes": {
    coutParPersonne: 7.50, niveauBudget: "premium",
    economieTip: "En saison (oct-fév) les coquilles Saint-Jacques fraîches sont 30 % moins chères.",
  },
  "Gratin de fruits de mer": {
    coutParPersonne: 3.50, niveauBudget: "moyen",
    economieTip: "Utilise un mélange surgelé de fruits de mer — 2× moins cher que le frais.",
  },
  "Cabillaud vapeur gingembre sauce soja": {
    coutParPersonne: 5.75, niveauBudget: "premium",
    economieTip: "Le lieu noir ou le merlan fonctionne très bien à la vapeur pour moitié moins cher.",
  },
  "Dorade entière au four fenouil citron": {
    coutParPersonne: 7.50, niveauBudget: "premium",
    economieTip: "La daurade de mer d'élevage coûte 40 % moins cher que la sauvage.",
  },
  "Bar en croûte de sel herbes fraîches": {
    coutParPersonne: 8.00, niveauBudget: "premium",
    economieTip: "La croûte de sel peut s'utiliser avec du lieu jaune ou de la truite — résultat spectaculaire à moindre coût.",
  },

  // ── Viandes ───────────────────────────────────────────────────────
  "Magret de canard miel balsamique": {
    coutParPersonne: 5.50, niveauBudget: "premium",
    economieTip: null,
  },
  "Joue de bœuf braisée au vin rouge": {
    coutParPersonne: 4.50, niveauBudget: "moyen",
    economieTip: "La joue de bœuf est un morceau abordable qui s'attendrit admirablement à la cuisson longue.",
  },
  "Bavette à l'échalote sauce bordelaise": {
    coutParPersonne: 3.00, niveauBudget: "moyen",
    economieTip: "La bavette est l'un des morceaux de bœuf les plus abordables avec un goût excellent.",
  },
  "Côtelettes d'agneau persillade grillées": {
    coutParPersonne: 5.50, niveauBudget: "premium",
    economieTip: "Les côtelettes premières coûtent moins cher que les côtelettes d'agneau gigot.",
  },
  "Osso buco à la milanaise": {
    coutParPersonne: 8.25, niveauBudget: "premium",
    economieTip: "Les jarrets de porc remplacent avantageusement le veau pour un résultat similaire à moitié prix.",
  },
  "Filet de bœuf Wellington": {
    coutParPersonne: 8.35, niveauBudget: "premium",
    economieTip: null,
  },
  "Poulet aux morilles sauce à la crème": {
    coutParPersonne: 6.00, niveauBudget: "premium",
    economieTip: "Les morilles séchées moins chères rehaussées de champignons frais donnent un résultat presque identique.",
  },
  "Entrecôte marchand de vin": {
    coutParPersonne: 6.75, niveauBudget: "premium",
    economieTip: "L'onglet ou la bavette d'aloyau à la bordelaise coûte 2× moins cher pour un goût tout aussi intense.",
  },
  "Canard à l'orange façon classique": {
    coutParPersonne: 6.25, niveauBudget: "premium",
    economieTip: null,
  },
  "Filet mignon de porc en croûte moutarde": {
    coutParPersonne: 2.75, niveauBudget: "moyen",
    economieTip: "Le filet mignon de porc est l'un des morceaux les plus tendres à prix accessible.",
  },
  "Terrine de foie gras maison mi-cuit": {
    coutParPersonne: 5.85, niveauBudget: "premium",
    economieTip: null,
  },

  // ── Italien ───────────────────────────────────────────────────────
  "Pâtes carbonara véritables": {
    coutParPersonne: 2.00, niveauBudget: "moyen",
    economieTip: "La pancetta fumée est souvent moins chère que le guanciale avec un résultat très proche.",
  },
  "Risotto homard safran": {
    coutParPersonne: 10.00, niveauBudget: "premium",
    economieTip: "Remplace le homard par des gambas pour diviser le coût par 2 avec un rendu similaire.",
  },

  // ── Méditerranéen & du monde ──────────────────────────────────────
  "Tajine de poulet aux citrons confits": {
    coutParPersonne: 4.00, niveauBudget: "moyen",
    economieTip: null,
  },
  "Pad Thaï crevettes authentique": {
    coutParPersonne: 4.00, niveauBudget: "moyen",
    economieTip: "Les crevettes surgelées décortiquées coûtent 2× moins cher que les fraîches.",
  },
  "Tikka masala de poulet": {
    coutParPersonne: 2.50, niveauBudget: "moyen",
    economieTip: null,
  },
  "Paëlla valenciana": {
    coutParPersonne: 5.00, niveauBudget: "premium",
    economieTip: "Utilise un mélange de fruits de mer surgelés (-2 €/pers). Utilise du colorant alimentaire à la place du safran.",
  },
  "Wok de bœuf aux légumes croquants": {
    coutParPersonne: 3.00, niveauBudget: "moyen",
    economieTip: null,
  },
  "Curry de crevettes lait de coco": {
    coutParPersonne: 3.00, niveauBudget: "moyen",
    economieTip: "Crevettes surgelées décortiquées : qualité identique, prix divisé par 2.",
  },
  "Tian de légumes provençal au four": {
    coutParPersonne: 1.35, niveauBudget: "économique",
    economieTip: null,
  },
  "Salade niçoise traditionnelle": {
    coutParPersonne: 2.25, niveauBudget: "moyen",
    economieTip: "Le thon en boîte est aussi bon que le frais dans la niçoise pour 4× moins cher.",
  },
  "Ramen japonais maison": {
    coutParPersonne: 5.00, niveauBudget: "premium",
    economieTip: "Un bouillon de poulet maison remplace avantageusement le fond de ramen du commerce.",
  },
  "Poulpe à la galicienne": {
    coutParPersonne: 5.00, niveauBudget: "premium",
    economieTip: "Le poulpe surgelé est aussi tendre que le frais après décongélation — et bien moins cher.",
  },
  "Buddha bowl quinoa avocat poulet": {
    coutParPersonne: 4.00, niveauBudget: "moyen",
    economieTip: "Remplace le quinoa par du boulgour ou du riz complet — moitié moins cher.",
  },

  // ── Healthy ───────────────────────────────────────────────────────
  "Soupe miso tofu wakamé": {
    coutParPersonne: 1.75, niveauBudget: "économique",
    economieTip: null,
  },
  "Poulet tandoori grillé au four": {
    coutParPersonne: 3.00, niveauBudget: "moyen",
    economieTip: null,
  },
  "Dahl de lentilles épinards coco": {
    coutParPersonne: 1.75, niveauBudget: "économique",
    economieTip: null,
  },
  "Soupe de lentilles corail curcuma": {
    coutParPersonne: 1.00, niveauBudget: "économique",
    economieTip: null,
  },
  "Taboulé libanais persil citron": {
    coutParPersonne: 1.25, niveauBudget: "économique",
    economieTip: null,
  },
  "Tacos de poisson grillé salsa avocat": {
    coutParPersonne: 3.00, niveauBudget: "moyen",
    economieTip: "Utilise du merlan ou du lieu noir à la place du bar ou de la dorade.",
  },
  "Frittata aux légumes de saison": {
    coutParPersonne: 2.00, niveauBudget: "moyen",
    economieTip: "Utilise les légumes en fin de vie du frigo — zéro déchet, coût presque nul.",
  },
  "Brochettes de poulet marinade yaourt harissa": {
    coutParPersonne: 2.00, niveauBudget: "moyen",
    economieTip: null,
  },
  "Boulettes de dinde sauce tomate légère": {
    coutParPersonne: 2.50, niveauBudget: "moyen",
    economieTip: null,
  },
  "Zucchini noodles bolognaise légère": {
    coutParPersonne: 2.50, niveauBudget: "moyen",
    economieTip: null,
  },
  "Curry de légumes racines anti-inflammatoire": {
    coutParPersonne: 2.00, niveauBudget: "moyen",
    economieTip: null,
  },
  "Omelette aux blancs d'œufs et légumes": {
    coutParPersonne: 1.00, niveauBudget: "économique",
    economieTip: null,
  },
  "Salade thaïe de poulet menthe": {
    coutParPersonne: 2.00, niveauBudget: "moyen",
    economieTip: null,
  },
  "Poêlée de crevettes ail citron courgette": {
    coutParPersonne: 2.75, niveauBudget: "moyen",
    economieTip: "Crevettes surgelées décortiquées : même texture après cuisson, prix divisé par 2.",
  },
  "Poke bowl thon avocat sésame": {
    coutParPersonne: 6.50, niveauBudget: "premium",
    economieTip: "Remplace le thon sashimi par du thon en boîte au naturel égoutté : économie de 4 €/pers.",
  },
  "Salade de pois chiches méditerranéenne": {
    coutParPersonne: 1.25, niveauBudget: "économique",
    economieTip: null,
  },
  "Bowl quinoa betterave grenade halloumi": {
    coutParPersonne: 3.00, niveauBudget: "moyen",
    economieTip: "Remplace le halloumi par de la feta — moins chère et tout aussi bonne dans ce bowl.",
  },
  "Wraps de laitue au poulet et avocat": {
    coutParPersonne: 2.25, niveauBudget: "moyen",
    economieTip: null,
  },
  "Soupe de carottes gingembre lait de coco": {
    coutParPersonne: 1.25, niveauBudget: "économique",
    economieTip: null,
  },
  "Salade tiède de lentilles saumon": {
    coutParPersonne: 3.50, niveauBudget: "moyen",
    economieTip: "Remplace le saumon par des sardines en boîte à l'huile d'olive — économie de 2 €/pers.",
  },
  "Taboulé de chou-fleur keto": {
    coutParPersonne: 1.50, niveauBudget: "économique",
    economieTip: null,
  },
  "Steak de chou-fleur rôti sauce tahini": {
    coutParPersonne: 2.50, niveauBudget: "moyen",
    economieTip: null,
  },
  "Dorade entière au four fenouil citron": {
    coutParPersonne: 7.50, niveauBudget: "premium",
    economieTip: "La daurade d'élevage coûte 40 % moins cher que la sauvage.",
  },
  "Poulet vapeur sauce citronnelle gingembre": {
    coutParPersonne: 2.50, niveauBudget: "moyen",
    economieTip: null,
  },
  "Soupe de poireaux détox légère": {
    coutParPersonne: 1.00, niveauBudget: "économique",
    economieTip: null,
  },
  "Salade de quinoa noir betterave feta": {
    coutParPersonne: 2.25, niveauBudget: "moyen",
    economieTip: "Le quinoa blanc est 2× moins cher que le noir avec un goût très proche.",
  },
  "Légumes rôtis et feta au four": {
    coutParPersonne: 2.25, niveauBudget: "moyen",
    economieTip: null,
  },
  "Salade de watermelon feta menthe": {
    coutParPersonne: 2.25, niveauBudget: "moyen",
    economieTip: null,
  },
  "Patates douces farcies black beans avocat": {
    coutParPersonne: 2.00, niveauBudget: "moyen",
    economieTip: null,
  },
}

/** Retourne les données budget d'une recette (lookup puis valeur par défaut) */
export function getBudget(recipe) {
  const from = BUDGET_MAP[recipe.name]
  if (recipe.coutParPersonne != null) {
    // Les données sont directement sur la recette (recettes seedées v4+)
    return {
      coutParPersonne: recipe.coutParPersonne,
      niveauBudget:    recipe.niveauBudget ?? deriverNiveau(recipe.coutParPersonne),
      economieTip:     recipe.economieTip ?? null,
    }
  }
  return from ?? null
}

export function deriverNiveau(cout) {
  if (cout < 2)  return "économique"
  if (cout <= 5) return "moyen"
  return "premium"
}
