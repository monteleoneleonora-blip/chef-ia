/**
 * Mapping nom de recette → terme de recherche TheMealDB (anglais).
 * Seulement les recettes pour lesquelles TheMealDB retourne une photo
 * qui correspond réellement au plat. Les autres tombent sur Wikipedia.
 * https://www.themealdb.com/api.php
 */
export const MEAL_DB_MAP = {
  // ── Petit-déjeuner ────────────────────────────────────────────────
  "Pain perdu caramel beurre salé":          "French Toast",
  "Pancakes fluffy beurre noisette":         "Pancakes",
  "Granola maison miel amandes":             "Granola",
  // Œufs cocotte: Shakshuka retiré (trop différent), Wikipedia Baked_eggs utilisé
  "Porridge avoine banane miel":             "Porridge",
  "Crêpes protéinées à l'avoine":           "Crepes",

  // ── Cuisine FRANÇAISE (masterRecipeDatabase fr-001 → fr-023) ─────
  "Bœuf Bourguignon":                        "Beef Bourguignon",
  "Quiche Lorraine":                         "Quiche Lorraine",
  "Soupe à l'Oignon Gratinée":               "French Onion Soup",
  "Crêpes Bretonnes":                        "Crepes",
  "Ratatouille Provençale":                  "Ratatouille",
  "Gratin Dauphinois":                       "Potato Dauphinoise",
  "Salade Niçoise":                          "Salad Nicoise",
  "Poulet Rôti aux Herbes":                  "Roast Chicken",
  "Blanquette de Veau":                      "Blanquette De Veau",
  "Tarte Tatin":                             "Tarte Tatin",
  "Cassoulet Toulousain":                    "Beef Stew",
  "Sole Meunière":                           "Sea Bass",
  "Crème Brûlée":                            "Creme Brulee",
  "Pot-au-Feu":                              "Beef Stew",
  "Coq au Vin":                              "Coq au Vin",
  "Soufflé au Fromage":                      "Cheese Omelette",
  "Tartare de Bœuf Maison":                  "Beef Tartare",
  "Pain Perdu Brioché":                      "French Toast",

  // ── Classiques français ───────────────────────────────────────────
  "Bœuf bourguignon express Cookeo":         "Beef Bourguignon",
  "Poulet rôti jus corsé façon Etchebest":  "Roast Chicken",
  "Risotto crémeux champignons sauvages":    "Mushroom Risotto",
  "Coq au vin façon bistro parisien":        "Coq au Vin",
  "Moules marinières à la crème":            "Moules Mariniere",
  "Blanquette de veau à l'ancienne":         "Blanquette De Veau",
  "Gratin dauphinois crème ail":             "Potato Dauphinoise",
  "Soupe à l'oignon gratinée":               "French Onion Soup",
  "Pot-au-feu traditionnel":                 "Beef Stew",
  "Quiche lorraine maison":                  "Quiche Lorraine",
  "Tarte tatin aux pommes caramélisées":    "Tarte Tatin",
  "Crème brûlée vanille Bourbon":            "Creme Brulee",
  "Mousse au chocolat 70% sans crème":      "Chocolate Mousse",
  "Velouté de potimarron gingembre":         "Pumpkin Soup",
  "Ratatouille niçoise confite":             "Ratatouille",
  "Tartare de bœuf façon Etchebest":        "Beef Tartare",
  "Tarte aux poireaux chèvre frais":         "Quiche",

  // ── Poissons & fruits de mer ──────────────────────────────────────
  "Saumon mi-cuit beurre blanc nantais":     "Salmon",
  // Dos de cabillaud en croûte d'herbes: "Fish Pie" retiré (trop différent), Wikipedia utilisé
  "Saumon en papillote légumes citron":      "Baked Salmon with Fennel",
  "Tartare de saumon avocat citron vert":    "Salmon",
  "Cabillaud basse température citron confit": "Baked Cod",
  // ── Viandes ───────────────────────────────────────────────────────
  "Magret de canard miel balsamique":        "Duck Confit",
  "Joue de bœuf braisée au vin rouge":      "Beef Bourguignon",
  "Bavette à l'échalote sauce bordelaise":  "Steak",
  "Côtelettes d'agneau persillade grillées": "Lamb Chops",
  "Osso buco à la milanaise":                "Osso Bucco",
  "Filet de bœuf Wellington":               "Beef Wellington",
  "Poulet aux morilles sauce à la crème":   "Chicken Marsala",
  "Entrecôte marchand de vin":               "Rib Eye Steak",
  "Canard à l'orange façon classique":       "Duck a l Orange",
  "Filet mignon de porc en croûte moutarde": "Pork Tenderloin",

  // ── Italien ───────────────────────────────────────────────────────
  "Pâtes carbonara véritables":              "Spaghetti Carbonara",
  "Risotto homard safran":                   "Seafood Risotto",

  // ── Méditerranéen & du monde ──────────────────────────────────────
  "Tajine de poulet aux citrons confits":    "Moroccan Chicken",
  "Pad Thaï crevettes authentique":          "Pad Thai",
  "Tikka masala de poulet":                  "Chicken Tikka Masala",
  "Paëlla valenciana":                       "Spanish Paella",
  "Wok de bœuf aux légumes croquants":      "Beef Stir Fry",
  "Curry de crevettes lait de coco":         "Thai Green Curry",
  "Tian de légumes provençal au four":       "Ratatouille",
  "Salade niçoise traditionnelle":           "Salad Nicoise",
  "Ramen japonais maison":                   "Ramen",
  "Poulpe à la galicienne":                  "Grilled Octopus",
  "Buddha bowl quinoa avocat poulet":        "Chicken Bowl",

  // ── Healthy ───────────────────────────────────────────────────────
  "Soupe miso tofu wakamé":                  "Miso Soup",
  "Poulet tandoori grillé au four":          "Chicken Tandoori",
  "Dahl de lentilles épinards coco":         "Dal Fry",
  "Soupe de lentilles corail curcuma":       "Lentil Soup",
  "Taboulé libanais persil citron":          "Lebanese Tabbouleh",
  "Tacos de poisson grillé salsa avocat":    "Fish Tacos",
  "Frittata aux légumes de saison":          "Frittata",
  "Brochettes de poulet marinade yaourt harissa": "Chicken Kebab",
  "Boulettes de dinde sauce tomate légère":  "Turkey Meatballs",
  "Zucchini noodles bolognaise légère":      "Spaghetti Bolognese",
  "Curry de légumes racines anti-inflammatoire": "Vegetable Curry",
  "Omelette aux blancs d'œufs et légumes":  "Omelette",
  "Salade thaïe de poulet menthe":           "Thai Chicken Salad",
  "Poêlée de crevettes ail citron courgette": "Garlic Prawns",
  // Patates douces farcies: "Sweet Potato Fries" retiré, Wikipedia Sweet_potato utilisé
  "Poke bowl thon avocat sésame":            "Poke Bowl",
  "Salade de pois chiches méditerranéenne":  "Chickpea Salad",
  "Bowl quinoa betterave grenade halloumi":  "Quinoa Bowl",
  "Wraps de laitue au poulet et avocat":     "Chicken Lettuce Cups",
  "Soupe de carottes gingembre lait de coco": "Carrot Soup",
  "Salade tiède de lentilles saumon":        "Warm Lentil Salad",

  // ── Budget/Économique ─────────────────────────────────────────────
  "Riz sauté aux légumes et œuf":         "Egg Fried Rice",
  "Gratin de pâtes au fromage":           "Mac And Cheese",
  "Omelette aux champignons":             "Mushroom Omelette",
  "Minestrone de légumes d'hiver":        "Minestrone Soup",
  "Pasta e fagioli":                      "Pasta Fagioli",
  "Riz au lait vanille":                  "Rice Pudding",
  "Pain perdu à la cannelle":             "French Toast",
  "Crêpes économiques à l'eau":           "Crepes",
  "Frittata rapide aux légumes du frigo": "Frittata",
}
