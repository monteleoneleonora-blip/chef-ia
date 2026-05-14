/**
 * Mapping statique nom de recette → URL Unsplash CDN.
 *
 * IMPORTANT — Strategie v6 :
 * Ce mapping est utilise en FALLBACK 4eme seulement (apres MEAL_DB_MAP et WIKI_MAP),
 * car TheMealDB et Wikipedia garantissent une photo precise par plat. Ici on
 * privilegie l'unicite : 1 recette = 1 ID Unsplash different.
 *
 * Si un ID 404 ou ne correspond pas visuellement, le fallback Pexels search
 * (via le backend) prendra le relais.
 *
 * URLs CDN publiques Unsplash, pas de cle API.
 */
const U = id => `https://images.unsplash.com/photo-${id}?w=1200&q=85&auto=format&fit=crop`
const P = id => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop`

export const RECIPE_PHOTO_MAP = {
  // ── Cuisine FRANÇAISE (23 recettes) ──────────────────────────────────
  "Bœuf Bourguignon":            U('1547489432-cf93fa6c71ec'),
  "Quiche Lorraine":             U('1571748982800-fa51082c2224'),
  "Soupe à l'Oignon Gratinée":   U('1614777986384-007141a8a4f0'),
  "Crêpes Bretonnes":            U('1519676867240-f03562e64548'),
  "Ratatouille Provençale":      U('1597600159211-d6c104f1b96a'),
  "Gratin Dauphinois":           U('1606755962773-d324e0a13086'),
  "Salade Niçoise":              U('1540420773420-3366772f4999'),
  "Poulet Rôti aux Herbes":      U('1598103442097-8b74394b95c6'),
  "Blanquette de Veau":          U('1620776948267-0e4f33de8b95'),
  "Tarte Tatin":                 U('1568571780765-9276ac8b75a2'),
  "Cassoulet Toulousain":        U('1544025162-d76538c29898'),
  "Sole Meunière":               U('1485921325833-c519f76c4927'),
  "Crème Brûlée":                U('1567171466295-4afa63d45416'),
  "Pot-au-Feu":                  U('1574484284002-952d92456975'),
  "Flamiche aux Poireaux":       U('1565299543923-37dd37887442'),
  "Magret de Canard aux Cerises":U('1572441713132-51c75654db73'),
  "Vichyssoise":                 U('1605209547636-edf9bee92d8a'),
  "Pain Perdu Brioché":          U('1484723091739-30990106e9ac'),
  "Coq au Vin":                  U('1432139509613-5c4255815697'),
  "Soufflé au Fromage":          U('1568901346375-23c9450c58cd'),
  "Tartare de Bœuf Maison":      U('1559847844-d9e636e08b73'),
  "Œufs Cocotte à la Crème":    U('1525351484163-7529414344d8'),
  "Gâteau Basque à la Crème":    U('1578985545062-69928b1d9587'),


  // ── Petit-dejeuner (20) ───────────────────────────────────────────
  "Pain perdu caramel beurre salé":           U('1484723091739-30990106e9ac'),
  "Pain perdu à la cannelle":                 U('1551782450-a2132b4ba21d'),
  "Pancakes fluffy beurre noisette":          U('1567620905732-2d1ec7ab7445'),
  "Crêpes protéinées à l'avoine":             U('1517673400267-0251440c45dc'),
  "Crêpes économiques à l'eau":               U('1519676867240-f03562e64548'),
  "Granola maison miel amandes":              U('1611068661864-699fa6eee53c'),
  "Muesli Bircher pomme noix":                U('1517593715953-007d896ff75d'),
  "Galettes de flocons d'avoine":             U('1494859802809-d069c3b71a8a'),
  "Œufs cocotte à la crème et aux herbes":   U('1525351484163-7529414344d8'),
  "Omelette aux blancs d'œufs et légumes":   U('1510693206972-df098062cb71'),
  "Omelette aux champignons":                 U('1612966809470-7ada72c4d1ea'),
  "Frittata aux légumes de saison":           U('1568910748155-01ca989dbdd6'),
  "Frittata rapide aux légumes du frigo":     U('1565958011703-44f9829ba187'),
  "Porridge avoine banane miel":              U('1517593715953-007d896ff75d'),
  "Overnight oats protéinés pomme cannelle":  U('1542691457-cbe4df041eb2'),
  "Bol açaï protéiné fruits rouges":          U('1490323948693-fea21f0bbe8b'),
  "Bowl de fromage blanc baies et graines":   U('1488477181946-6428a0291777'),
  "Green smoothie détox épinards ananas":     U('1502741338009-cac2772e18bc'),
  "Tartines avocat œuf poché":                U('1525351484163-7529414344d8'),
  "Toast de seigle saumon aneth":             U('1496116218417-1a781b1c416c'),

  // ── Classiques francais (15) ──────────────────────────────────────
  "Bœuf bourguignon express Cookeo":          U('1547489432-cf93fa6c71ec'),
  "Joue de bœuf braisée au vin rouge":        U('1544025162-d76538c29898'),
  "Blanquette de veau à l'ancienne":          U('1620776948267-0e4f33de8b95'),
  "Osso buco à la milanaise":                 U('1574484284002-952d92456975'),
  "Pot-au-feu traditionnel":                  U('1540420773420-3366772f4999'),
  "Poulet rôti jus corsé façon Etchebest":   U('1598103442097-8b74394b95c6'),
  "Poulet aux morilles sauce à la crème":    U('1604908550845-2f0a4e44fc4c'),
  "Coq au vin façon bistro parisien":         U('1432139509613-5c4255815697'),
  "Tajine de poulet aux citrons confits":     U('1547928579-baeec4f0e0bf'),
  "Poulet tandoori grillé au four":           U('1606491956689-2ea866880c84'),
  "Brochettes de poulet marinade yaourt harissa": U('1598514982901-5c96e0b96b47'),
  "Poulet vapeur sauce citronnelle gingembre": U('1567620832903-9fc6debc209f'),
  "Risotto crémeux champignons sauvages":     U('1534939561126-855b8675edd7'),
  "Risotto homard safran":                    U('1546549032-9571cd6b27df'),
  "Pâtes carbonara véritables":               U('1612874742237-6526221588e3'),

  // ── Italien & pates (4) ───────────────────────────────────────────
  "Gratin de pâtes au fromage":               U('1551183053-bf91798d1d19'),
  "Pasta e fagioli":                          U('1576278960-1a8c4c1aa42d'),
  "Zucchini noodles bolognaise légère":       U('1588013273468-315fd88ea34c'),
  "Paëlla valenciana":                        U('1534080564583-6be75777b70a'),

  // ── Viandes (10) ──────────────────────────────────────────────────
  "Bavette à l'échalote sauce bordelaise":   U('1558030006-450675393462'),
  "Entrecôte marchand de vin":                U('1600891964092-4316c288032e'),
  "Tartare de bœuf façon Etchebest":         U('1559847844-d9e636e08b73'),
  "Filet de bœuf Wellington":                U('1544025162-d76538c29898'),
  "Filet mignon de porc en croûte moutarde": U('1432139438709-d894a6181fda'),
  "Côtelettes d'agneau persillade grillées":  U('1607103058027-4c5e3866a299'),
  "Magret de canard miel balsamique":         U('1572441713132-51c75654db73'),
  "Canard à l'orange façon classique":        U('1604908175898-0fb0deafe27e'),

  // ── Soupes & veloutes (8) ─────────────────────────────────────────
  "Velouté de potimarron gingembre":          U('1547592180-85f173990554'),
  "Soupe à l'oignon gratinée":                U('1614777986384-007141a8a4f0'),
  "Soupe à l'oignon paysanne":                U('1605996020611-6f0c12c9e2cd'),
  "Soupe de carottes gingembre lait de coco": U('1547308283-b941e91b0e10'),
  "Soupe de poireaux détox légère":           U('1605209547636-edf9bee92d8a'),
  "Velouté de courgettes léger":              U('1583608354155-90119f739c0b'),
  "Soupe miso tofu wakamé":                   U('1607301406259-dfb186e15de8'),
  "Minestrone de légumes d'hiver":            U('1543352634-99a5d50ae78e'),

  // ── Quiches & tartes salees (3) ───────────────────────────────────
  "Quiche lorraine maison":                   U('1571748982800-fa51082c2224'),
  "Tarte aux poireaux chèvre frais":          U('1565299543923-37dd37887442'),
  "Tarte rustique aux poireaux":              U('1568901346375-23c9450c58cd'),

  // ── Legumes & gratins (8) ─────────────────────────────────────────
  "Ratatouille niçoise confite":              U('1597600159211-d6c104f1b96a'),
  "Tian de légumes provençal au four":        U('1572455024247-8eba33a78a09'),
  "Légumes rôtis et feta au four":            U('1540713434306-58505cf1b6fc'),
  "Steak de chou-fleur rôti sauce tahini":    U('1606923829579-0cb981a83e2b'),
  "Gratin dauphinois crème ail":              U('1606755962773-d324e0a13086'),
  "Soufflé au fromage de brebis":             U('1568901346375-23c9450c58cd'),
  "Poêlée de chou blanc et pommes":           U('1601045574739-7e7baadbf6b2'),
  "Poêlée de pommes de terre et lardons":     U('1605209547636-edf9bee92d8a'),

  // ── Poissons & fruits de mer (12) ─────────────────────────────────
  "Saumon mi-cuit beurre blanc nantais":      U('1519708227271-8f404b8b4e2a'),
  "Tartare de saumon avocat citron vert":     U('1576019442-7b2c47e2a0fd'),
  "Saumon en papillote légumes citron":       U('1467003909585-2f8a72700288'),
  "Salade tiède de lentilles saumon":         U('1604335078948-7fce75bdc81c'),
  "Sole meunière beurre noisette":            U('1485921325833-c519f76c4927'),
  "Dos de cabillaud en croûte d'herbes":     U('1559717201-fbb671ff56b7'),
  "Cabillaud basse température citron confit": U('1481931098730-318b6f776db0'),
  "Cabillaud vapeur gingembre sauce soja":    U('1565299585323-38d6b0865b47'),
  "Dorade entière au four fenouil citron":    U('1599045118108-bf9954418b76'),
  "Bar en croûte de sel herbes fraîches":     U('1535400875775-d44793ba43c0'),
  "Tacos de poisson grillé salsa avocat":     U('1565299585323-38d6b0865b47'),
  "Moules marinières à la crème":             U('1559737558-2f5a35f4523b'),
  "Saint-Jacques poêlées beurre blanc agrumes": U('1612204078213-a227dba74093'),
  "Gratin de fruits de mer":                  U('1565299507177-b0ac66763828'),
  "Poêlée de crevettes ail citron courgette": U('1565557623262-b51c2513a641'),
  "Curry de crevettes lait de coco":          U('1604908554007-cdb0fcde2dde'),
  "Poulpe à la galicienne":                   U('1599487488170-d11ec9c172f0'),

  // ── Cuisines du monde (5) ─────────────────────────────────────────
  "Tikka masala de poulet":                   U('1565557623262-b51c2513a641'),
  "Pad Thaï crevettes authentique":           U('1559314809-0d155014e29e'),
  "Ramen japonais maison":                    U('1569050467447-ce54b3bbc37d'),
  "Wok de bœuf aux légumes croquants":       U('1525755662778-989d0524087e'),
  "Curry de légumes racines anti-inflammatoire": U('1604908554049-bcd13d6e8c2c'),

  // ── Healthy & legumineuses (8) ────────────────────────────────────
  "Dahl de lentilles épinards coco":          U('1605478279097-bd1bbeec7ee8'),
  "Soupe de lentilles corail curcuma":        U('1547592180-85f173990554'),
  "Soupe de lentilles corail et cumin":       U('1612102119897-fff15c9b4b5b'),
  "Boulettes de dinde sauce tomate légère":   U('1529042410759-befb1204b468'),
  "Haricots blancs à la tomate":              U('1476718406336-bb5a9690ee2a'),
  "Purée de carottes au gingembre":           U('1551192933-9d1a2bb0a0bd'),
  "Riz au lait vanille":                      U('1605637860940-6acbd7a02d22'),
  "Riz sauté aux légumes et œuf":             U('1603133872878-684f208fb84b'),

  // ── Salades & bowls (10) ──────────────────────────────────────────
  "Salade niçoise traditionnelle":            U('1540420773420-3366772f4999'),
  "Salade thaïe de poulet menthe":            U('1540420773420-285a8b1bea7d'),
  "Salade de pois chiches méditerranéenne":   U('1546549032-9571cd6b27df'),
  "Salade de pois chiches et tomates":        U('1604335078948-7fce75bdc81c'),
  "Salade de watermelon feta menthe":         U('1567015873293-7e6b6e98b9ac'),
  "Salade de quinoa noir betterave feta":     U('1556909114-f6e7ad7d3136'),
  "Salade de riz thon maïs":                  U('1551248429-40975aa4de74'),
  "Taboulé libanais persil citron":           U('1505253213-13b2-455b-9d8f-2b8c5b65b3a4'),
  "Taboulé de chou-fleur keto":               U('1576749872435-ff88a71c1ae2'),
  "Buddha bowl quinoa avocat poulet":         U('1546069901-ba9599a7e63c'),
  "Poke bowl thon avocat sésame":             U('1571197119282-7c4e2c2842cf'),
  "Bowl quinoa betterave grenade halloumi":   U('1551248429-40975aa4de74'),
  "Patates douces farcies black beans avocat": U('1604908815747-7da38437b21c'),
  "Wraps de laitue au poulet et avocat":      U('1565299507177-b0ac66763828'),

  // ── Desserts (4) ──────────────────────────────────────────────────
  "Crème brûlée vanille Bourbon":             U('1567171466295-4afa63d45416'),
  "Tarte tatin aux pommes caramélisées":     U('1568571780765-9276ac8b75a2'),
  "Mousse au chocolat 70% sans crème":       U('1578985545062-69928b1d9587'),
  "Terrine de foie gras maison mi-cuit":      U('1606502281004-f08d70b46d6d'),
}
