import { nanoid } from 'nanoid'

const seed = [
  // ─────────────────────────────────────────────
  // PETIT-DÉJEUNER
  // ─────────────────────────────────────────────
  {
    name: "Pain perdu caramel beurre salé",
    type: "petit-déjeuner", cuisine: "Française", imageQuery: "french toast caramel butter brioche golden",
    servings: 4, prepTime: "10 min", cookTime: "10 min", difficulty: "Facile",
    kcalPerPerson: 420, proteinPerPerson: 12, carbsPerPerson: 52, diets: ["Végétarien"],
    ingredients: [
      {quantity:"8",unit:"tranches",name:"brioche"},{quantity:"3",unit:"",name:"œufs"},
      {quantity:"15",unit:"cl",name:"crème liquide"},{quantity:"2",unit:"c.à.s",name:"sucre vanillé"},
      {quantity:"80",unit:"g",name:"beurre demi-sel"},{quantity:"60",unit:"g",name:"sucre"},
      {quantity:"10",unit:"cl",name:"crème liquide (caramel)"}
    ],
    steps: [
      "Battre les œufs avec la crème et le sucre vanillé dans un plat creux.",
      "Tremper les tranches de brioche 30 secondes de chaque côté.",
      "Faire fondre 40 g de beurre à feu moyen dans une grande poêle et dorer les tranches 2 min par face.",
      "Pour le caramel : faire fondre le sucre à sec dans une casserole jusqu'à coloration ambrée, ajouter le reste de beurre puis la crème chaude hors du feu en remuant vivement.",
      "Dresser le pain perdu nappé de caramel chaud."
    ],
    chefTip: "Laisse reposer la brioche trempée 1 min avant la cuisson — elle absorbe mieux et la texture est plus moelleuse à cœur.",
    childNote: "Remplace le caramel par du miel et des fruits frais pour les plus petits."
  },
  {
    name: "Pancakes fluffy beurre noisette",
    type: "petit-déjeuner", cuisine: "Américaine", imageQuery: "fluffy japanese pancakes stack maple syrup",
    servings: 4, prepTime: "10 min", cookTime: "15 min", difficulty: "Facile",
    kcalPerPerson: 380, proteinPerPerson: 10, carbsPerPerson: 55, diets: ["Végétarien"],
    ingredients: [
      {quantity:"200",unit:"g",name:"farine"},{quantity:"2",unit:"c.à.c",name:"levure chimique"},
      {quantity:"1",unit:"c.à.c",name:"bicarbonate"},{quantity:"2",unit:"c.à.s",name:"sucre"},
      {quantity:"1",unit:"pincée",name:"sel"},{quantity:"2",unit:"",name:"œufs"},
      {quantity:"25",unit:"cl",name:"lait fermenté (ou lait + jus citron)"},{quantity:"50",unit:"g",name:"beurre"}
    ],
    steps: [
      "Faire fondre le beurre à feu doux jusqu'à coloration noisette (brun clair, odeur de noisette) puis laisser tiédir.",
      "Mélanger farine, levure, bicarbonate, sucre et sel dans un saladier.",
      "Dans un autre bol, fouetter les œufs, le lait fermenté et le beurre noisette tiédi.",
      "Incorporer les liquides aux secs en mélangeant juste assez — des grumeaux fins sont normaux.",
      "Cuire dans une poêle à feu moyen légèrement beurrée, 2 min jusqu'aux bulles en surface, retourner et cuire 1 min."
    ],
    chefTip: "Ne mélange jamais trop la pâte — les grumeaux garantissent des pancakes aérés. Le beurre noisette est la clé du goût.",
    childNote: null
  },
  {
    name: "Granola maison miel amandes",
    type: "petit-déjeuner", cuisine: "Américaine", imageQuery: "homemade granola honey almonds oats baking tray",
    servings: 8, prepTime: "10 min", cookTime: "25 min", difficulty: "Facile",
    kcalPerPerson: 310, proteinPerPerson: 8, carbsPerPerson: 40, diets: ["Végétarien","Sans gluten"],
    ingredients: [
      {quantity:"300",unit:"g",name:"flocons d'avoine"},{quantity:"100",unit:"g",name:"amandes effilées"},
      {quantity:"50",unit:"g",name:"noix de cajou"},{quantity:"50",unit:"g",name:"graines de courge"},
      {quantity:"80",unit:"g",name:"miel"},{quantity:"40",unit:"ml",name:"huile de coco"},
      {quantity:"1",unit:"c.à.c",name:"cannelle"},{quantity:"1",unit:"c.à.c",name:"vanille en poudre"},
      {quantity:"80",unit:"g",name:"raisins secs"}
    ],
    steps: [
      "Préchauffer le four à 160 °C.",
      "Mélanger flocons, amandes, noix et graines dans un grand bol.",
      "Faire fondre le miel et l'huile de coco ensemble, ajouter cannelle et vanille.",
      "Verser sur le mélange sec et bien enrober.",
      "Étaler sur une plaque recouverte de papier cuisson et enfourner 20-25 min en remuant à mi-cuisson.",
      "Laisser refroidir complètement avant d'ajouter les raisins secs — le granola croque en refroidissant."
    ],
    chefTip: "Ajoute une blanc d'œuf battu au mélange pour des clusters plus gros et plus croquants.",
    childNote: null
  },
  {
    name: "Œufs cocotte à la crème et aux herbes",
    type: "petit-déjeuner", cuisine: "Française", imageQuery: "baked eggs cocotte cream herbs ramekin",
    servings: 4, prepTime: "5 min", cookTime: "12 min", difficulty: "Facile",
    kcalPerPerson: 220, proteinPerPerson: 14, carbsPerPerson: 3, diets: ["Végétarien","Sans gluten"],
    ingredients: [
      {quantity:"4",unit:"",name:"œufs extra-frais"},{quantity:"8",unit:"c.à.s",name:"crème fraîche épaisse"},
      {quantity:"",unit:"",name:"ciboulette ciselée"},{quantity:"",unit:"",name:"persil plat"},
      {quantity:"",unit:"",name:"sel, poivre"},{quantity:"20",unit:"g",name:"beurre"},
      {quantity:"4",unit:"tranches",name:"pain de campagne grillé"}
    ],
    steps: [
      "Préchauffer le four à 180 °C (ou préparer un bain-marie).",
      "Beurrer 4 ramequins, déposer 2 c.à.s de crème dans chacun.",
      "Casser délicatement un œuf dans chaque ramequin sans crever le jaune.",
      "Saler légèrement le blanc (pas le jaune) et poivrer.",
      "Cuire au bain-marie 10-12 min : le blanc doit être pris, le jaune encore coulant.",
      "Parsemer d'herbes et servir immédiatement avec les mouillettes."
    ],
    chefTip: "Surveille à la minute près — une minute de trop et le jaune est cuit. Sors-les légèrement tremblotants, la chaleur résiduelle termine.",
    childNote: "Cuire 2 min de plus pour un jaune entièrement cuit côté enfants."
  },
  {
    name: "Porridge avoine banane miel",
    type: "petit-déjeuner", cuisine: "Britannique", imageQuery: "creamy oatmeal porridge banana honey walnuts",
    servings: 2, prepTime: "2 min", cookTime: "8 min", difficulty: "Facile",
    kcalPerPerson: 340, proteinPerPerson: 11, carbsPerPerson: 58, diets: ["Végétarien"],
    ingredients: [
      {quantity:"100",unit:"g",name:"flocons d'avoine"},{quantity:"40",unit:"cl",name:"lait"},
      {quantity:"10",unit:"cl",name:"eau"},{quantity:"1",unit:"pincée",name:"sel"},
      {quantity:"2",unit:"",name:"bananes"},{quantity:"2",unit:"c.à.s",name:"miel"},
      {quantity:"30",unit:"g",name:"noix concassées"},{quantity:"1",unit:"c.à.c",name:"cannelle"}
    ],
    steps: [
      "Porter le lait et l'eau à frémissement avec une pincée de sel.",
      "Ajouter les flocons d'avoine et cuire 5-7 min à feu doux en remuant régulièrement.",
      "Écraser la moitié d'une banane dans le porridge en fin de cuisson pour sucrer naturellement.",
      "Servir dans des bols, garnir de rondelles de banane, noix, miel et cannelle."
    ],
    chefTip: "Prépare-le la veille (overnight oats) : flocons + lait + toppings au frigo — prêt en 0 seconde le matin.",
    childNote: null
  },
  {
    name: "Tartines avocat œuf poché",
    type: "petit-déjeuner", cuisine: "Australienne", imageQuery: "avocado toast poached egg sourdough bread",
    servings: 2, prepTime: "5 min", cookTime: "10 min", difficulty: "Moyen",
    kcalPerPerson: 390, proteinPerPerson: 18, carbsPerPerson: 32, diets: ["Végétarien"],
    ingredients: [
      {quantity:"2",unit:"tranches épaisses",name:"pain au levain"},{quantity:"2",unit:"",name:"avocats mûrs"},
      {quantity:"2",unit:"",name:"œufs frais"},{quantity:"1",unit:"",name:"citron vert"},
      {quantity:"",unit:"",name:"piment d'Espelette"},{quantity:"",unit:"",name:"fleur de sel"},
      {quantity:"1",unit:"c.à.s",name:"vinaigre blanc"},{quantity:"",unit:"",name:"graines de sésame"}
    ],
    steps: [
      "Porter une casserole d'eau frémissante à feu doux avec le vinaigre.",
      "Casser chaque œuf dans un ramequin. Créer un tourbillon dans l'eau et y glisser l'œuf délicatement. Pocher 3 min.",
      "Griller les tartines.",
      "Écraser l'avocat à la fourchette avec le jus de citron vert, sel et piment.",
      "Étaler l'avocat sur les tartines, déposer l'œuf poché, fleur de sel, sésame et piment."
    ],
    chefTip: "L'eau ne doit jamais bouillir — juste frémir. L'œuf le plus frais possible garantit un blanc qui se tient bien autour du jaune.",
    childNote: null
  },

  // ─────────────────────────────────────────────
  // DÉJEUNER
  // ─────────────────────────────────────────────
  {
    name: "Bœuf bourguignon express Cookeo",
    type: "déjeuner", cuisine: "Française", imageQuery: "beef bourguignon red wine mushrooms carrots dutch oven",
    servings: 6, prepTime: "20 min", cookTime: "45 min", difficulty: "Facile",
    kcalPerPerson: 520, proteinPerPerson: 38, carbsPerPerson: 18, diets: [],
    ingredients: [
      {quantity:"1.2",unit:"kg",name:"bœuf à braiser (paleron ou joue)"},{quantity:"200",unit:"g",name:"lardons fumés"},
      {quantity:"200",unit:"g",name:"champignons de Paris"},{quantity:"3",unit:"",name:"carottes"},
      {quantity:"2",unit:"",name:"oignons"},{quantity:"3",unit:"gousses",name:"ail"},
      {quantity:"50",unit:"cl",name:"vin rouge (Bourgogne)"},{quantity:"2",unit:"c.à.s",name:"concentré de tomates"},
      {quantity:"1",unit:"bouquet",name:"garni (thym, laurier, persil)"}
    ],
    steps: [
      "Couper le bœuf en cubes de 4 cm. Saler, poivrer.",
      "Dorer les lardons à l'autocuiseur en mode rissolage, réserver.",
      "Faire revenir le bœuf par petites quantités jusqu'à coloration sur toutes les faces.",
      "Ajouter oignons et ail émincés, faire suer 2 min.",
      "Déglacer avec le vin rouge, gratter les sucs. Ajouter concentré, carottes, bouquet garni et lardons.",
      "Fermer et cuire sous pression 35 min. Ajouter les champignons et cuire encore 5 min.",
      "Rectifier l'assaisonnement. Servir avec des tagliatelles fraîches ou des pommes de terre vapeur."
    ],
    chefTip: "La veille c'est meilleur — les saveurs se développent toute la nuit. Réchauffer doucement le lendemain.",
    childNote: null
  },
  {
    name: "Poulet rôti jus corsé façon Etchebest",
    type: "déjeuner", cuisine: "Française", imageQuery: "roasted chicken golden crispy skin roasting pan jus",
    servings: 4, prepTime: "15 min", cookTime: "75 min", difficulty: "Moyen",
    kcalPerPerson: 480, proteinPerPerson: 45, carbsPerPerson: 8, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"1",unit:"(1.5 kg)",name:"poulet fermier"},{quantity:"1",unit:"tête",name:"ail"},
      {quantity:"1",unit:"",name:"citron"},{quantity:"2",unit:"branches",name:"thym frais"},
      {quantity:"2",unit:"branches",name:"romarin"},{quantity:"50",unit:"g",name:"beurre pommade"},
      {quantity:"2",unit:"",name:"oignons"},{quantity:"2",unit:"",name:"carottes"},
      {quantity:"20",unit:"cl",name:"fond de volaille"}
    ],
    steps: [
      "Sortir le poulet 30 min à température ambiante. Préchauffer le four à 220 °C.",
      "Glisser le beurre pommade sous la peau de la poitrine en massant délicatement.",
      "Farcir la cavité avec l'ail entier, le citron coupé en deux et les herbes.",
      "Poser le poulet sur un lit de légumes (oignons et carottes coupés grossièrement), arroser d'huile, saler.",
      "Enfourner 15 min à 220 °C pour dorer, puis baisser à 180 °C et cuire 55-60 min en arrosant toutes les 20 min.",
      "Laisser reposer 10 min sous alu. Déglacer la plaque avec le fond de volaille pour le jus.",
      "Filtrer le jus, réduire 5 min à feu vif. Découper et servir avec le jus corsé."
    ],
    chefTip: "Le repos est obligatoire — 10 min minimum sous alu. Les jus se redistribuent et la viande reste juteuse jusqu'à la dernière bouchée.",
    childNote: null
  },
  {
    name: "Risotto crémeux champignons sauvages",
    type: "déjeuner", cuisine: "Italienne", imageQuery: "creamy risotto wild mushrooms parmesan truffle oil",
    servings: 4, prepTime: "10 min", cookTime: "25 min", difficulty: "Moyen",
    kcalPerPerson: 490, proteinPerPerson: 14, carbsPerPerson: 68, diets: ["Végétarien"],
    ingredients: [
      {quantity:"300",unit:"g",name:"riz Arborio"},{quantity:"400",unit:"g",name:"champignons sauvages (cèpes, girolles)"},
      {quantity:"1",unit:"",name:"oignon"},{quantity:"2",unit:"gousses",name:"ail"},
      {quantity:"15",unit:"cl",name:"vin blanc sec"},{quantity:"1",unit:"L",name:"bouillon de légumes chaud"},
      {quantity:"80",unit:"g",name:"parmesan râpé"},{quantity:"40",unit:"g",name:"beurre"},
      {quantity:"2",unit:"c.à.s",name:"huile d'olive"},{quantity:"",unit:"",name:"persil plat"}
    ],
    steps: [
      "Faire sauter les champignons à feu vif dans l'huile avec l'ail, saler. Réserver.",
      "Faire suer l'oignon émincé dans 20 g de beurre sans coloration.",
      "Ajouter le riz et nacrer 2 min (le riz doit devenir translucide en périphérie).",
      "Déglacer avec le vin blanc, mélanger jusqu'à absorption complète.",
      "Ajouter le bouillon chaud louche par louche en mélangeant constamment. Répéter pendant 18 min.",
      "Incorporer les champignons, le reste du beurre et le parmesan hors du feu — la mantecatura.",
      "Couvrir 2 min, servir aussitôt avec persil et parmesan supplémentaire."
    ],
    chefTip: "La mantecatura (incorporation finale beurre-parmesan hors du feu, couvercle 2 min) est le secret de l'onctuosité. Ne saute pas cette étape.",
    childNote: null
  },
  {
    name: "Sole meunière beurre noisette",
    type: "déjeuner", cuisine: "Française", imageQuery: "sole meunière brown butter lemon capers pan fried fish",
    servings: 2, prepTime: "10 min", cookTime: "12 min", difficulty: "Moyen",
    kcalPerPerson: 380, proteinPerPerson: 42, carbsPerPerson: 12, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"2",unit:"",name:"soles vidées et pelées (400 g pièce)"},{quantity:"60",unit:"g",name:"farine"},
      {quantity:"80",unit:"g",name:"beurre"},{quantity:"1",unit:"",name:"citron"},
      {quantity:"",unit:"",name:"persil plat ciselé"},{quantity:"",unit:"",name:"sel, poivre"},
      {quantity:"1",unit:"c.à.s",name:"huile neutre"}
    ],
    steps: [
      "Sécher les soles avec du papier absorbant. Assaisonner et fariner légèrement.",
      "Chauffer huile + 20 g de beurre dans une grande poêle à feu moyen-vif.",
      "Cuire les soles côté peau d'abord, 4 min. Retourner délicatement et cuire encore 3-4 min.",
      "Débarrasser sur le plat de service.",
      "Dans la même poêle, ajouter le reste du beurre : le faire mousser jusqu'à la coloration noisette ambrée.",
      "Ajouter le jus de citron hors du feu (attention aux projections) et le persil.",
      "Napper immédiatement les soles de ce beurre noisette citronnée."
    ],
    chefTip: "Le beurre noisette attend personne — il va de doré à brûlé en quelques secondes. Arrête le feu dès la coloration ambrée et ajoute le citron.",
    childNote: null
  },
  {
    name: "Blanquette de veau à l'ancienne",
    type: "déjeuner", cuisine: "Française", imageQuery: "blanquette de veau cream sauce mushrooms carrots French stew",
    servings: 6, prepTime: "20 min", cookTime: "90 min", difficulty: "Moyen",
    kcalPerPerson: 510, proteinPerPerson: 40, carbsPerPerson: 22, diets: [],
    ingredients: [
      {quantity:"1.2",unit:"kg",name:"veau (épaule et tendron)"},{quantity:"200",unit:"g",name:"champignons de Paris"},
      {quantity:"3",unit:"",name:"carottes"},{quantity:"2",unit:"",name:"oignons"},
      {quantity:"1",unit:"bouquet",name:"garni"},{quantity:"30",unit:"g",name:"beurre"},
      {quantity:"30",unit:"g",name:"farine"},{quantity:"20",unit:"cl",name:"crème fraîche épaisse"},
      {quantity:"2",unit:"",name:"jaunes d'œuf"},{quantity:"1",unit:"",name:"citron"}
    ],
    steps: [
      "Couper le veau en cubes, mettre dans une grande casserole, couvrir d'eau froide. Porter à ébullition, écumer 5 min.",
      "Ajouter carottes, oignons piqués de clous de girofle, bouquet garni. Cuire à frémissement 1h15.",
      "Faire sauter les champignons au beurre séparément, réserver.",
      "Préparer un roux : faire fondre le beurre, ajouter la farine, cuire 2 min. Incorporer 50 cl de bouillon de cuisson filtré en fouettant jusqu'à épaississement.",
      "Mélanger crème et jaunes d'œuf, incorporer hors du feu à la sauce. Ne plus faire bouillir.",
      "Ajouter le veau, les légumes et les champignons. Assaisonner, ajouter le jus de citron.",
      "Servir avec du riz blanc pilaf."
    ],
    chefTip: "La liaison finale jaunes-crème doit se faire hors du feu — la sauce ne doit plus jamais bouillir sous peine de trancher.",
    childNote: "Un plat adoré des enfants, sans aucune modification nécessaire."
  },
  {
    name: "Moules marinières à la crème",
    type: "déjeuner", cuisine: "Française", imageQuery: "moules marinières cream white wine mussels pot",
    servings: 4, prepTime: "15 min", cookTime: "10 min", difficulty: "Facile",
    kcalPerPerson: 310, proteinPerPerson: 28, carbsPerPerson: 14, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"2",unit:"kg",name:"moules de bouchot"},{quantity:"2",unit:"",name:"échalotes"},
      {quantity:"2",unit:"gousses",name:"ail"},{quantity:"20",unit:"cl",name:"vin blanc sec"},
      {quantity:"20",unit:"cl",name:"crème liquide"},{quantity:"30",unit:"g",name:"beurre"},
      {quantity:"1",unit:"bouquet",name:"persil plat"},{quantity:"",unit:"",name:"poivre"}
    ],
    steps: [
      "Gratter et laver les moules, éliminer celles qui restent ouvertes après un choc.",
      "Faire suer échalotes et ail émincés dans le beurre 2 min.",
      "Déglacer avec le vin blanc, porter à ébullition.",
      "Ajouter les moules, couvrir à feu vif. Remuer toutes les 2 min jusqu'à ouverture complète (5-6 min).",
      "Retirer les moules avec une écumoire, filtrer le jus.",
      "Réduire le jus de moitié, ajouter la crème, laisser frémir 2 min.",
      "Verser sur les moules, parsemer de persil. Servir avec des frites maison."
    ],
    chefTip: "Ne jamais trop cuire les moules — dès qu'elles sont ouvertes c'est bon. Trop cuites elles deviennent caoutchouteuses.",
    childNote: null
  },
  {
    name: "Saumon mi-cuit beurre blanc nantais",
    type: "déjeuner", cuisine: "Française", imageQuery: "salmon fillet medium rare butter sauce white wine shallots",
    servings: 4, prepTime: "10 min", cookTime: "15 min", difficulty: "Moyen",
    kcalPerPerson: 450, proteinPerPerson: 38, carbsPerPerson: 4, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"4",unit:"pavés (160g)",name:"saumon Label Rouge"},{quantity:"3",unit:"",name:"échalotes"},
      {quantity:"10",unit:"cl",name:"vin blanc sec"},{quantity:"5",unit:"cl",name:"vinaigre de vin blanc"},
      {quantity:"150",unit:"g",name:"beurre froid en dés"},{quantity:"",unit:"",name:"sel, poivre"},
      {quantity:"1",unit:"c.à.s",name:"huile d'olive"}
    ],
    steps: [
      "Préparer le beurre blanc : faire réduire le vin et le vinaigre avec les échalotes jusqu'à presque sec.",
      "Hors du feu, incorporer le beurre froid dé par dé en fouettant vivement — la sauce émulsionne.",
      "Filtrer ou garder les échalotes selon goût. Maintenir au chaud sans faire bouillir.",
      "Assaisonner les pavés. Les saisir côté peau à feu vif 3 min dans l'huile.",
      "Retourner et cuire 2 min côté chair — l'intérieur reste nacré (mi-cuit).",
      "Servir nappé de beurre blanc avec des haricots verts ou des épinards."
    ],
    chefTip: "Le beurre blanc ne supporte pas l'ébullition — maintiens à 60-65 °C. Pour réchauffer, quelques gouttes d'eau froide et un coup de fouet suffisent.",
    childNote: null
  },
  {
    name: "Coq au vin façon bistro parisien",
    type: "déjeuner", cuisine: "Française", imageQuery: "coq au vin red wine chicken lardons mushrooms braised",
    servings: 6, prepTime: "20 min", cookTime: "60 min", difficulty: "Moyen",
    kcalPerPerson: 540, proteinPerPerson: 42, carbsPerPerson: 16, diets: [],
    ingredients: [
      {quantity:"1",unit:"(1.8 kg)",name:"poulet fermier découpé en 8"},{quantity:"75",unit:"cl",name:"vin rouge (Bourgogne ou Côtes du Rhône)"},
      {quantity:"200",unit:"g",name:"lardons fumés"},{quantity:"300",unit:"g",name:"champignons de Paris"},
      {quantity:"20",unit:"",name:"petits oignons grelots"},{quantity:"3",unit:"gousses",name:"ail"},
      {quantity:"1",unit:"bouquet",name:"garni"},{quantity:"2",unit:"c.à.s",name:"concentré de tomates"},
      {quantity:"2",unit:"c.à.s",name:"farine"},{quantity:"3",unit:"c.à.s",name:"cognac"}
    ],
    steps: [
      "Mariner le poulet dans le vin avec ail et bouquet garni, 2h minimum (idéalement une nuit).",
      "Égoutter et sécher le poulet. Réserver la marinade.",
      "Dorer les lardons, réserver. Faire colorer les morceaux de poulet sur toutes les faces, réserver.",
      "Faire suer les oignons grelots et l'ail. Singer avec la farine, cuire 1 min.",
      "Flamber au cognac. Ajouter la marinade filtrée et le concentré de tomates.",
      "Remettre le poulet et les lardons, couvrir et mijoter à feu doux 45 min.",
      "Ajouter les champignons sautés, cuire encore 10 min. Rectifier l'assaisonnement."
    ],
    chefTip: "La marinade la veille est essentielle. Le flambage au cognac n'est pas optionnel — il apporte une profondeur que rien d'autre ne donne.",
    childNote: null
  },
  {
    name: "Gratin dauphinois crème ail",
    type: "déjeuner", cuisine: "Française", imageQuery: "gratin dauphinois cream garlic potatoes golden crust",
    servings: 6, prepTime: "20 min", cookTime: "75 min", difficulty: "Facile",
    kcalPerPerson: 410, proteinPerPerson: 8, carbsPerPerson: 42, diets: ["Végétarien","Sans gluten"],
    ingredients: [
      {quantity:"1.2",unit:"kg",name:"pommes de terre type Bintje"},{quantity:"50",unit:"cl",name:"crème liquide entière"},
      {quantity:"20",unit:"cl",name:"lait entier"},{quantity:"2",unit:"gousses",name:"ail"},
      {quantity:"1",unit:"pincée",name:"noix de muscade"},{quantity:"",unit:"",name:"sel, poivre"},
      {quantity:"20",unit:"g",name:"beurre"}
    ],
    steps: [
      "Préchauffer le four à 160 °C. Frotter le plat à gratin avec l'ail coupé, beurrer.",
      "Éplucher et trancher les pommes de terre en fines rondelles (2 mm) à la mandoline. Ne pas les rincer.",
      "Chauffer crème, lait, ail haché, muscade, sel et poivre dans une casserole. Porter à frémissement.",
      "Plonger les pommes de terre 5 min dans ce mélange en remuant doucement.",
      "Verser dans le plat beurré, niveler. Le mélange crème doit affleurer.",
      "Cuire 70-75 min jusqu'à coloration dorée et que la pointe d'un couteau pénètre sans résistance."
    ],
    chefTip: "Pas de fromage dans le vrai gratin dauphinois — c'est l'amidon des pommes de terre non rincées qui lie la crème et crée cette onctuosité caractéristique.",
    childNote: "Un plat adoré de tous les enfants, inchangé."
  },
  {
    name: "Tajine de poulet aux citrons confits",
    type: "déjeuner", cuisine: "Marocaine", imageQuery: "chicken tagine preserved lemon olives saffron clay pot",
    servings: 4, prepTime: "15 min", cookTime: "50 min", difficulty: "Facile",
    kcalPerPerson: 430, proteinPerPerson: 38, carbsPerPerson: 18, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"1",unit:"(1.5 kg)",name:"poulet découpé"},{quantity:"2",unit:"",name:"citrons confits"},
      {quantity:"150",unit:"g",name:"olives vertes"},{quantity:"2",unit:"",name:"oignons"},
      {quantity:"3",unit:"gousses",name:"ail"},{quantity:"1",unit:"c.à.c",name:"ras-el-hanout"},
      {quantity:"1",unit:"c.à.c",name:"curcuma"},{quantity:"1",unit:"c.à.c",name:"gingembre moulu"},
      {quantity:"1",unit:"pincée",name:"safran"},{quantity:"3",unit:"c.à.s",name:"huile d'olive"},
      {quantity:"",unit:"",name:"coriandre fraîche"}
    ],
    steps: [
      "Mélanger huile, ail, épices et safran dilué dans un peu d'eau. Enrober le poulet de cette marinade 30 min.",
      "Faire dorer le poulet dans le tajine ou une cocotte. Réserver.",
      "Faire suer les oignons émincés dans le même récipient.",
      "Remettre le poulet, ajouter 15 cl d'eau, couvrir et cuire 30 min à feu doux.",
      "Rincer les citrons confits, couper en quartiers en gardant seulement le zeste.",
      "Ajouter citrons et olives, cuire encore 15 min.",
      "Parsemer de coriandre fraîche. Servir avec de la semoule."
    ],
    chefTip: "Rince bien les citrons confits — ils sont très salés. Goûte avant d'assaisonner car les olives aussi apportent du sel.",
    childNote: "Retire les olives et réduis le citron confit pour les plus jeunes."
  },
  {
    name: "Pad Thaï crevettes authentique",
    type: "déjeuner", cuisine: "Thaïlandaise", imageQuery: "pad thai shrimp rice noodles bean sprouts peanuts lime",
    servings: 2, prepTime: "15 min", cookTime: "10 min", difficulty: "Moyen",
    kcalPerPerson: 520, proteinPerPerson: 28, carbsPerPerson: 65, diets: [],
    ingredients: [
      {quantity:"200",unit:"g",name:"nouilles de riz plates"},{quantity:"200",unit:"g",name:"crevettes décortiquées"},
      {quantity:"3",unit:"c.à.s",name:"sauce poisson (nuoc-mam)"},{quantity:"2",unit:"c.à.s",name:"sauce tamarin"},
      {quantity:"1",unit:"c.à.s",name:"sucre de palme"},{quantity:"2",unit:"",name:"œufs"},
      {quantity:"100",unit:"g",name:"germes de soja"},{quantity:"3",unit:"",name:"oignons nouveaux"},
      {quantity:"50",unit:"g",name:"cacahuètes grillées concassées"},{quantity:"1",unit:"",name:"lime"}
    ],
    steps: [
      "Tremper les nouilles dans l'eau froide 30 min puis égoutter.",
      "Mélanger sauce poisson, tamarin et sucre de palme — c'est la sauce pad thai.",
      "Chauffer le wok à feu très vif avec de l'huile. Faire sauter les crevettes 2 min, pousser sur les bords.",
      "Ajouter les nouilles égouttées, la sauce. Mélanger vigoureusement 2 min.",
      "Pousser tout sur les bords, casser les œufs au centre, brouiller rapidement.",
      "Incorporer les germes de soja et les oignons nouveaux, mélanger 1 min.",
      "Servir avec cacahuètes, quartier de lime et piment séché."
    ],
    chefTip: "Le feu doit être à son maximum — le wok hei (goût fumé) ne s'obtient qu'à très haute température. Une poêle normale à feu max fait l'affaire.",
    childNote: null
  },
  {
    name: "Pâtes carbonara véritables",
    type: "déjeuner", cuisine: "Italienne", imageQuery: "spaghetti carbonara guanciale eggs pecorino romano authentic",
    servings: 4, prepTime: "10 min", cookTime: "15 min", difficulty: "Moyen",
    kcalPerPerson: 620, proteinPerPerson: 28, carbsPerPerson: 72, diets: [],
    ingredients: [
      {quantity:"400",unit:"g",name:"spaghetti"},{quantity:"200",unit:"g",name:"guanciale (ou lardons)"},
      {quantity:"4",unit:"",name:"jaunes d'œuf"},{quantity:"1",unit:"",name:"œuf entier"},
      {quantity:"100",unit:"g",name:"pecorino romano râpé"},{quantity:"50",unit:"g",name:"parmesan râpé"},
      {quantity:"",unit:"",name:"poivre noir fraîchement moulu"}
    ],
    steps: [
      "Cuire les pâtes al dente. Garder une tasse d'eau de cuisson.",
      "Faire rissoler le guanciale à feu moyen sans ajout de matière grasse jusqu'à ce qu'il soit croustillant.",
      "Mélanger jaunes + œuf entier + fromages + poivre généreux dans un bol.",
      "Égoutter les pâtes et les mettre dans la poêle hors du feu avec le guanciale.",
      "Ajouter le mélange œuf-fromage en remuant vivement, incorporer l'eau de cuisson cuillère par cuillère jusqu'à consistance crémeuse.",
      "Servir immédiatement avec poivre et pecorino supplémentaires."
    ],
    chefTip: "Jamais de crème ! C'est l'eau de cuisson amidonnée + l'émulsion œuf-fromage qui créent la sauce. La poêle hors du feu évite de brouiller les œufs.",
    childNote: null
  },
  {
    name: "Tartare de bœuf façon Etchebest",
    type: "déjeuner", cuisine: "Française", imageQuery: "beef tartare egg yolk capers cornichons classic French",
    servings: 2, prepTime: "20 min", cookTime: "0 min", difficulty: "Facile",
    kcalPerPerson: 380, proteinPerPerson: 32, carbsPerPerson: 8, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"300",unit:"g",name:"rumsteck ou filet de bœuf"},{quantity:"2",unit:"",name:"jaunes d'œuf"},
      {quantity:"1",unit:"c.à.s",name:"moutarde forte"},{quantity:"2",unit:"c.à.s",name:"câpres"},
      {quantity:"4",unit:"",name:"cornichons"},{quantity:"1",unit:"",name:"échalote"},
      {quantity:"",unit:"",name:"persil plat"},{quantity:"1",unit:"c.à.c",name:"Worcestershire"},
      {quantity:"1",unit:"c.à.c",name:"Tabasco"},{quantity:"2",unit:"c.à.s",name:"huile d'olive"}
    ],
    steps: [
      "Hacher la viande au couteau en petits cubes réguliers de 5 mm — surtout pas au mixeur.",
      "Ciseler finement échalote, cornichons, câpres et persil.",
      "Dans un bol, mélanger jaunes d'œuf, moutarde, Worcestershire, Tabasco et huile.",
      "Incorporer la viande et les condiments, assaisonner généreusement.",
      "Dresser en cercle, napper d'un filet d'huile d'olive. Servir aussitôt avec frites ou toast."
    ],
    chefTip: "La viande doit être froide jusqu'au dressage — travaille-la directement sortie du frigo. Ne prépare jamais un tartare à l'avance.",
    childNote: null
  },
  {
    name: "Velouté de potimarron gingembre",
    type: "déjeuner", cuisine: "Française", imageQuery: "pumpkin cream soup ginger coconut milk autumn bowl",
    servings: 4, prepTime: "15 min", cookTime: "30 min", difficulty: "Facile",
    kcalPerPerson: 210, proteinPerPerson: 5, carbsPerPerson: 28, diets: ["Végétarien","Vegan","Sans gluten"],
    ingredients: [
      {quantity:"1",unit:"(1 kg)",name:"potimarron"},{quantity:"2",unit:"",name:"oignons"},
      {quantity:"1",unit:"morceau (3 cm)",name:"gingembre frais"},{quantity:"2",unit:"gousses",name:"ail"},
      {quantity:"20",unit:"cl",name:"lait de coco"},{quantity:"80",unit:"cl",name:"bouillon de légumes"},
      {quantity:"2",unit:"c.à.s",name:"huile d'olive"},{quantity:"",unit:"",name:"graines de courge grillées"}
    ],
    steps: [
      "Couper le potimarron en cubes (la peau du potimarron se mange — inutile d'éplucher).",
      "Faire suer oignons et ail dans l'huile, ajouter le gingembre râpé, cuire 2 min.",
      "Ajouter les cubes de potimarron, couvrir de bouillon. Cuire 25 min à frémissement.",
      "Mixer finement avec le lait de coco. Ajuster la consistance avec du bouillon.",
      "Rectifier l'assaisonnement. Servir avec des graines de courge grillées et un filet de crème."
    ],
    chefTip: "Rôtis le potimarron 20 min au four à 200 °C avant de le mixer — la caramélisation apporte une saveur incomparable au velouté.",
    childNote: "Omets le gingembre pour les plus jeunes, le goût reste excellent."
  },
  {
    name: "Quiche lorraine maison",
    type: "déjeuner", cuisine: "Française", imageQuery: "quiche lorraine bacon cream eggs pastry tart homemade",
    servings: 6, prepTime: "20 min", cookTime: "40 min", difficulty: "Facile",
    kcalPerPerson: 440, proteinPerPerson: 16, carbsPerPerson: 30, diets: ["Végétarien"],
    ingredients: [
      {quantity:"1",unit:"",name:"pâte brisée"},{quantity:"200",unit:"g",name:"lardons fumés"},
      {quantity:"3",unit:"",name:"œufs"},{quantity:"20",unit:"cl",name:"crème fraîche épaisse"},
      {quantity:"20",unit:"cl",name:"lait"},{quantity:"",unit:"",name:"noix de muscade"},
      {quantity:"",unit:"",name:"sel, poivre"}
    ],
    steps: [
      "Préchauffer le four à 180 °C. Foncer un moule à tarte avec la pâte brisée, piquer le fond.",
      "Faire revenir les lardons à sec jusqu'à légère coloration, égoutter sur papier absorbant.",
      "Battre œufs, crème et lait. Assaisonner avec sel, poivre et muscade râpée.",
      "Répartir les lardons sur le fond de tarte, verser l'appareil.",
      "Cuire 35-40 min jusqu'à ce que l'appareil soit pris et légèrement doré."
    ],
    chefTip: "Pas de fromage dans la vraie quiche lorraine — c'est l'appareil œuf-crème bien assaisonné qui fait tout. Sors-la du four quand le centre frémit encore légèrement.",
    childNote: null
  },
  {
    name: "Dos de cabillaud en croûte d'herbes",
    type: "déjeuner", cuisine: "Française", imageQuery: "cod fillet herb crust parsley garlic breadcrumbs baked",
    servings: 4, prepTime: "10 min", cookTime: "15 min", difficulty: "Facile",
    kcalPerPerson: 310, proteinPerPerson: 36, carbsPerPerson: 14, diets: [],
    ingredients: [
      {quantity:"4",unit:"dos (160g)",name:"cabillaud"},{quantity:"60",unit:"g",name:"chapelure"},
      {quantity:"40",unit:"g",name:"beurre pommade"},{quantity:"2",unit:"gousses",name:"ail"},
      {quantity:"",unit:"",name:"persil plat"},{quantity:"",unit:"",name:"ciboulette"},
      {quantity:"",unit:"",name:"thym"},{quantity:"1",unit:"",name:"citron"},
      {quantity:"",unit:"",name:"sel, poivre"}
    ],
    steps: [
      "Préchauffer le four à 200 °C.",
      "Mixer chapelure, beurre pommade, ail, herbes ciselées, zeste de citron, sel et poivre.",
      "Sécher les dos de cabillaud. Déposer sur une plaque huilée.",
      "Étaler une couche généreuse de croûte d'herbes sur chaque dos.",
      "Cuire 12-15 min selon l'épaisseur — la croûte doit être dorée et le poisson nacré à cœur.",
      "Servir avec une purée de petits pois ou des légumes vapeur."
    ],
    chefTip: "Surveille bien la cuisson — le cabillaud sur-cuit se défait en fibres sèches. Il doit rester légèrement nacré à cœur.",
    childNote: null
  },
  {
    name: "Soupe à l'oignon gratinée",
    type: "déjeuner", cuisine: "Française", imageQuery: "French onion soup gratin gruyere cheese bread bowl classic",
    servings: 4, prepTime: "10 min", cookTime: "60 min", difficulty: "Facile",
    kcalPerPerson: 380, proteinPerPerson: 14, carbsPerPerson: 42, diets: ["Végétarien"],
    ingredients: [
      {quantity:"1",unit:"kg",name:"oignons"},{quantity:"80",unit:"g",name:"beurre"},
      {quantity:"20",unit:"cl",name:"vin blanc sec"},{quantity:"1",unit:"L",name:"bouillon de bœuf"},
      {quantity:"1",unit:"c.à.s",name:"farine"},{quantity:"4",unit:"tranches épaisses",name:"pain de campagne"},
      {quantity:"150",unit:"g",name:"gruyère râpé"},{quantity:"",unit:"",name:"thym, laurier"}
    ],
    steps: [
      "Émincer finement les oignons. Les faire fondre dans le beurre à feu doux 40 min en remuant régulièrement jusqu'à caramélisation dorée.",
      "Singer avec la farine, cuire 1 min. Déglacer avec le vin blanc.",
      "Ajouter le bouillon, thym, laurier. Cuire 20 min à frémissement.",
      "Verser dans des bols allant au four, déposer une tranche de pain grillé, couvrir généreusement de gruyère.",
      "Gratiner sous le gril jusqu'à coloration dorée et bouillonnante."
    ],
    chefTip: "La caramélisation des oignons ne se fait pas en 10 min — patience à feu doux. C'est là que tout le goût se construit.",
    childNote: null
  },
  {
    name: "Ratatouille niçoise confite",
    type: "déjeuner", cuisine: "Provençale", imageQuery: "ratatouille Provençal vegetables tomato zucchini eggplant confit",
    servings: 6, prepTime: "25 min", cookTime: "60 min", difficulty: "Facile",
    kcalPerPerson: 180, proteinPerPerson: 4, carbsPerPerson: 20, diets: ["Végétarien","Vegan","Sans gluten"],
    ingredients: [
      {quantity:"2",unit:"",name:"aubergines"},{quantity:"3",unit:"",name:"courgettes"},
      {quantity:"3",unit:"",name:"poivrons (rouge et jaune)"},{quantity:"4",unit:"",name:"tomates"},
      {quantity:"2",unit:"",name:"oignons"},{quantity:"4",unit:"gousses",name:"ail"},
      {quantity:"1",unit:"bouquet",name:"herbes de Provence"},{quantity:"6",unit:"c.à.s",name:"huile d'olive"},
      {quantity:"",unit:"",name:"sel, poivre"}
    ],
    steps: [
      "Couper tous les légumes en cubes réguliers de 2 cm.",
      "Faire revenir chaque légume séparément dans l'huile d'olive à feu vif jusqu'à légère coloration. Réserver.",
      "Faire suer oignons et ail dans la même poêle.",
      "Ajouter les tomates coupées, cuire 10 min pour concentrer.",
      "Réunir tous les légumes, assaisonner, ajouter les herbes.",
      "Mijoter à feu très doux à couvert 40 min. Déguster chaud, tiède ou froid."
    ],
    chefTip: "Le secret de la vraie ratatouille : cuire chaque légume séparément. Ensemble dès le début, ils font de la soupe — séparément, ils gardent leur identité.",
    childNote: null
  },
  {
    name: "Buddha bowl quinoa avocat poulet",
    type: "déjeuner", cuisine: "Américaine", imageQuery: "buddha bowl quinoa avocado chicken vegetables tahini sauce",
    servings: 2, prepTime: "20 min", cookTime: "15 min", difficulty: "Facile",
    kcalPerPerson: 560, proteinPerPerson: 38, carbsPerPerson: 48, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"200",unit:"g",name:"quinoa"},{quantity:"2",unit:"blancs",name:"de poulet"},
      {quantity:"1",unit:"",name:"avocat"},{quantity:"2",unit:"",name:"carottes"},
      {quantity:"100",unit:"g",name:"épinards frais"},{quantity:"10",unit:"",name:"tomates cerises"},
      {quantity:"1",unit:"c.à.s",name:"tahini"},{quantity:"1",unit:"",name:"citron"},
      {quantity:"1",unit:"c.à.s",name:"miel"},{quantity:"",unit:"",name:"graines de sésame"}
    ],
    steps: [
      "Cuire le quinoa 12 min dans deux fois son volume d'eau salée. Laisser reposer 5 min.",
      "Griller les blancs de poulet avec sel, poivre et paprika. Trancher.",
      "Râper les carottes. Couper l'avocat en tranches.",
      "Préparer la sauce : mélanger tahini, jus de citron, miel, sel et 2 c.à.s d'eau.",
      "Dresser en sections dans un grand bol : quinoa, poulet, avocat, carottes, épinards, tomates.",
      "Arroser de sauce tahini-citron et parsemer de sésame."
    ],
    chefTip: "La clé d'un bon bowl : des textures variées et une sauce maison. Le tahini-miel-citron est universel et s'adapte à tous les ingrédients.",
    childNote: null
  },
  {
    name: "Osso buco à la milanaise",
    type: "déjeuner", cuisine: "Italienne", imageQuery: "osso buco veal shank gremolata saffron risotto Milan",
    servings: 4, prepTime: "15 min", cookTime: "90 min", difficulty: "Moyen",
    kcalPerPerson: 580, proteinPerPerson: 44, carbsPerPerson: 22, diets: [],
    ingredients: [
      {quantity:"4",unit:"",name:"jarrets de veau (osso buco)"},{quantity:"2",unit:"",name:"oignons"},
      {quantity:"2",unit:"",name:"carottes"},{quantity:"2",unit:"branches",name:"céleri"},
      {quantity:"40",unit:"cl",name:"vin blanc sec"},{quantity:"40",unit:"cl",name:"bouillon de veau"},
      {quantity:"400",unit:"g",name:"tomates concassées"},{quantity:"",unit:"",name:"thym, laurier"},
      {quantity:"1",unit:"",name:"citron (zeste)"},{quantity:"2",unit:"gousses",name:"ail"},
      {quantity:"",unit:"",name:"persil plat (gremolata)"}
    ],
    steps: [
      "Fariner les jarrets, saisir à feu vif dans l'huile sur toutes les faces. Réserver.",
      "Faire revenir oignons, carottes et céleri coupés en brunoise dans la même cocotte.",
      "Déglacer au vin blanc, réduire de moitié.",
      "Ajouter tomates, bouillon, thym et laurier. Remettre les jarrets.",
      "Cuire au four à 160 °C pendant 1h30 à couvert, retourner à mi-cuisson.",
      "Préparer la gremolata : mélanger zeste de citron, ail haché et persil ciselé.",
      "Saupoudrer de gremolata au service. Accompagner de risotto Milanese au safran."
    ],
    chefTip: "La gremolata (zeste citron + ail + persil) ajoutée au dernier moment est la signature du plat — elle apporte fraîcheur et acidité à ce plat braisé.",
    childNote: null
  },
  {
    name: "Salade niçoise traditionnelle",
    type: "déjeuner", cuisine: "Provençale", imageQuery: "salade niçoise tuna egg olives anchovies fresh vegetables",
    servings: 4, prepTime: "20 min", cookTime: "10 min", difficulty: "Facile",
    kcalPerPerson: 340, proteinPerPerson: 24, carbsPerPerson: 18, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"240",unit:"g",name:"thon à l'huile d'olive"},{quantity:"4",unit:"",name:"œufs"},
      {quantity:"200",unit:"g",name:"haricots verts"},{quantity:"4",unit:"",name:"tomates"},
      {quantity:"1",unit:"",name:"poivron rouge"},{quantity:"100",unit:"g",name:"olives niçoises"},
      {quantity:"8",unit:"filets",name:"anchois"},{quantity:"1",unit:"",name:"oignon doux"},
      {quantity:"",unit:"",name:"basilic frais"},{quantity:"4",unit:"c.à.s",name:"huile d'olive extra vierge"},
      {quantity:"",unit:"",name:"vinaigre de vin"}
    ],
    steps: [
      "Cuire les œufs durs 10 min, refroidir, écaler et couper en quartiers.",
      "Blanchir les haricots verts 4 min à l'eau bouillante salée, refroidir dans l'eau glacée.",
      "Couper tomates en quartiers, poivron en lanières, oignon en fines rondelles.",
      "Émietter le thon grossièrement.",
      "Dresser les ingrédients séparément par zones sur un grand plat — pas de mélange.",
      "Assaisonner d'huile d'olive, vinaigre, sel, poivre et basilic déchiré."
    ],
    chefTip: "La vraie niçoise ne se mélange pas — chaque ingrédient est disposé séparément. Et pas de pommes de terre ni de laitue selon la tradition niçoise.",
    childNote: null
  },
  {
    name: "Paëlla valenciana",
    type: "déjeuner", cuisine: "Espagnole", imageQuery: "paella valenciana saffron chicken rabbit vegetables rice pan",
    servings: 6, prepTime: "20 min", cookTime: "40 min", difficulty: "Difficile",
    kcalPerPerson: 560, proteinPerPerson: 34, carbsPerPerson: 62, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"500",unit:"g",name:"riz rond (Bomba)"},{quantity:"400",unit:"g",name:"poulet (cuisses)"},
      {quantity:"300",unit:"g",name:"lapin"},{quantity:"200",unit:"g",name:"haricots verts plats"},
      {quantity:"200",unit:"g",name:"haricots blancs cuits"},{quantity:"1",unit:"L",name:"bouillon de volaille"},
      {quantity:"1",unit:"pincée",name:"safran"},{quantity:"2",unit:"c.à.c",name:"paprika doux fumé"},
      {quantity:"4",unit:"",name:"tomates"},{quantity:"4",unit:"gousses",name:"ail"},
      {quantity:"6",unit:"c.à.s",name:"huile d'olive"}
    ],
    steps: [
      "Chauffer l'huile dans la paëllera, dorer le poulet et le lapin coupés en morceaux. Réserver.",
      "Faire revenir ail et tomates râpées 5 min pour concentrer.",
      "Ajouter paprika et haricots verts, cuire 3 min.",
      "Remettre la viande, verser le bouillon chaud avec safran et sel.",
      "Quand ça bout, ajouter le riz en pluie uniformément. Ne plus remuer.",
      "Cuire à feu moyen-vif 10 min, puis à feu doux 8-10 min.",
      "Laisser reposer 5 min à feu éteint avec un torchon — le socarrat (croûte de riz) se forme en dessous."
    ],
    chefTip: "Ne jamais remuer après ajout du riz — c'est la règle d'or. Le socarrat (fond caramélisé) est le signe d'une bonne paëlla.",
    childNote: null
  },

  // ─────────────────────────────────────────────
  // DÎNER
  // ─────────────────────────────────────────────
  {
    name: "Magret de canard miel balsamique",
    type: "dîner", cuisine: "Française", imageQuery: "duck breast magret honey balsamic glaze pan seared",
    servings: 4, prepTime: "10 min", cookTime: "20 min", difficulty: "Moyen",
    kcalPerPerson: 490, proteinPerPerson: 36, carbsPerPerson: 18, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"2",unit:"(400g pièce)",name:"magrets de canard"},{quantity:"3",unit:"c.à.s",name:"miel"},
      {quantity:"3",unit:"c.à.s",name:"vinaigre balsamique"},{quantity:"10",unit:"cl",name:"fond de veau"},
      {quantity:"",unit:"",name:"sel, poivre du moulin"},{quantity:"1",unit:"branche",name:"thym"},
      {quantity:"1",unit:"gousse",name:"ail"}
    ],
    steps: [
      "Quadriller la peau des magrets au couteau sans entamer la chair. Assaisonner.",
      "Déposer côté peau dans une poêle froide — chauffer progressivement à feu moyen. Cuire 8-10 min en vidant la graisse régulièrement.",
      "Retourner et cuire côté chair 4 min pour une cuisson rosée.",
      "Laisser reposer 5 min sous alu.",
      "Déglacer la poêle avec le vinaigre, ajouter le miel, réduire 1 min.",
      "Ajouter le fond de veau, réduire jusqu'à consistance nappante.",
      "Trancher les magrets en biais, napper de sauce. Servir avec des pommes sarladaises."
    ],
    chefTip: "Poêle froide au départ — ça permet à la graisse de fondre progressivement et d'obtenir une peau croustillante sans brûler la chair.",
    childNote: null
  },
  {
    name: "Joue de bœuf braisée au vin rouge",
    type: "dîner", cuisine: "Française", imageQuery: "beef cheek braised red wine polenta glazed sauce",
    servings: 4, prepTime: "20 min", cookTime: "180 min", difficulty: "Moyen",
    kcalPerPerson: 580, proteinPerPerson: 48, carbsPerPerson: 14, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"4",unit:"(200g pièce)",name:"joues de bœuf parées"},{quantity:"75",unit:"cl",name:"vin rouge corsé"},
      {quantity:"2",unit:"",name:"carottes"},{quantity:"2",unit:"",name:"oignons"},
      {quantity:"3",unit:"gousses",name:"ail"},{quantity:"1",unit:"bouquet",name:"garni"},
      {quantity:"2",unit:"c.à.s",name:"concentré de tomates"},{quantity:"2",unit:"c.à.s",name:"farine"},
      {quantity:"",unit:"",name:"sel, poivre"}
    ],
    steps: [
      "Mariner les joues dans le vin avec légumes et bouquet garni, une nuit au frigo.",
      "Égoutter et sécher la viande. Filtrer la marinade.",
      "Dorer les joues sur toutes les faces dans de l'huile bien chaude.",
      "Faire revenir les légumes de la marinade, singer à la farine.",
      "Ajouter le concentré, la marinade filtrée. Remettre les joues.",
      "Cuire au four à 150 °C pendant 2h30-3h — les joues doivent se détacher à la fourchette.",
      "Sortir les joues. Réduire le jus à feu vif jusqu'à consistance sirupeuse. Servir avec polenta crémeuse."
    ],
    chefTip: "Les joues de bœuf sont un morceau sous-estimé — à 3h de braisage, elles deviennent fondantes comme du beurre. Plus tu cuis longtemps (à basse température), meilleur c'est.",
    childNote: null
  },
  {
    name: "Saint-Jacques poêlées beurre blanc agrumes",
    type: "dîner", cuisine: "Française", imageQuery: "seared scallops citrus butter sauce orange lemon elegant plate",
    servings: 4, prepTime: "15 min", cookTime: "10 min", difficulty: "Moyen",
    kcalPerPerson: 280, proteinPerPerson: 24, carbsPerPerson: 8, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"16",unit:"",name:"noix de Saint-Jacques (sans corail)"},{quantity:"100",unit:"g",name:"beurre froid"},
      {quantity:"2",unit:"",name:"échalotes"},{quantity:"10",unit:"cl",name:"vin blanc"},
      {quantity:"5",unit:"cl",name:"jus d'orange"},{quantity:"1",unit:"",name:"citron vert"},
      {quantity:"",unit:"",name:"sel, poivre"},{quantity:"",unit:"",name:"micro-herbes pour la garniture"}
    ],
    steps: [
      "Sécher parfaitement les noix sur papier absorbant — c'est essentiel pour la saisie.",
      "Préparer le beurre blanc : réduire vin blanc + échalotes jusqu'à sec, incorporer beurre froid dé par dé.",
      "Ajouter jus d'orange et zeste de citron vert à la sauce. Maintenir au chaud.",
      "Chauffer une poêle à feu très vif avec très peu d'huile.",
      "Saisir les noix 1 min 30 côté plat sans y toucher — elles doivent se détacher seules.",
      "Retourner, cuire 1 min. L'intérieur reste nacré.",
      "Dresser les noix, napper de beurre blanc aux agrumes, garnir de micro-herbes."
    ],
    chefTip: "Une seule règle : poêle très chaude, noix parfaitement sèches, et ne pas y toucher pendant la cuisson. La belle croûte dorée se forme d'elle-même.",
    childNote: null
  },
  {
    name: "Poulet aux morilles sauce à la crème",
    type: "dîner", cuisine: "Française", imageQuery: "chicken morel mushrooms cream sauce white wine French bistro",
    servings: 4, prepTime: "15 min", cookTime: "35 min", difficulty: "Moyen",
    kcalPerPerson: 520, proteinPerPerson: 42, carbsPerPerson: 10, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"4",unit:"suprêmes",name:"de poulet fermier"},{quantity:"30",unit:"g",name:"morilles séchées"},
      {quantity:"2",unit:"",name:"échalotes"},{quantity:"10",unit:"cl",name:"cognac"},
      {quantity:"20",unit:"cl",name:"vin blanc"},{quantity:"30",unit:"cl",name:"crème fraîche épaisse"},
      {quantity:"20",unit:"cl",name:"fond de volaille"},{quantity:"40",unit:"g",name:"beurre"}
    ],
    steps: [
      "Réhydrater les morilles 20 min dans de l'eau tiède. Égoutter et filtrer l'eau de trempage.",
      "Saisir les suprêmes côté peau dans beurre + huile jusqu'à coloration. Cuire 6 min, retourner et finir au four 8 min à 180 °C.",
      "Dans la même poêle, faire suer les échalotes. Ajouter les morilles, cuire 3 min.",
      "Flamber au cognac. Déglacer au vin blanc, réduire de moitié.",
      "Ajouter fond de volaille et eau de trempage filtrée. Réduire encore.",
      "Incorporer la crème, faire frémir 5 min jusqu'à consistance nappante.",
      "Servir les suprêmes nappés de sauce morilles-crème avec tagliatelles fraîches."
    ],
    chefTip: "L'eau de réhydratation des morilles filtrée contient tout le goût — surtout ne pas la jeter. C'est l'âme de la sauce.",
    childNote: null
  },
  {
    name: "Bavette à l'échalote sauce bordelaise",
    type: "dîner", cuisine: "Française", imageQuery: "bavette steak shallots red wine bordeaux sauce French bistro",
    servings: 4, prepTime: "10 min", cookTime: "20 min", difficulty: "Facile",
    kcalPerPerson: 440, proteinPerPerson: 36, carbsPerPerson: 6, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"800",unit:"g",name:"bavette d'aloyau"},{quantity:"4",unit:"",name:"échalotes"},
      {quantity:"20",unit:"cl",name:"vin rouge de Bordeaux"},{quantity:"10",unit:"cl",name:"fond de veau"},
      {quantity:"30",unit:"g",name:"beurre"},{quantity:"",unit:"",name:"sel, poivre"},
      {quantity:"1",unit:"c.à.s",name:"huile d'olive"}
    ],
    steps: [
      "Sortir la bavette 30 min avant cuisson.",
      "Saisir à feu vif dans huile + beurre, 3 min par face pour une cuisson saignante. Laisser reposer sous alu.",
      "Dans la même poêle, faire fondre les échalotes émincées 5 min à feu doux.",
      "Déglacer avec le vin rouge, gratter les sucs. Réduire de moitié.",
      "Ajouter le fond de veau, réduire encore jusqu'à consistance sirupeuse.",
      "Monter au beurre froid hors du feu pour lier et faire briller la sauce.",
      "Trancher la bavette en biais dans le sens contraire des fibres, napper de sauce."
    ],
    chefTip: "Toujours trancher la bavette dans le sens contraire des fibres — sinon elle est caoutchouteuse peu importe la cuisson.",
    childNote: null
  },
  {
    name: "Tikka masala de poulet",
    type: "dîner", cuisine: "Indienne", imageQuery: "chicken tikka masala curry tomato cream Indian spices rice",
    servings: 4, prepTime: "20 min", cookTime: "35 min", difficulty: "Facile",
    kcalPerPerson: 470, proteinPerPerson: 38, carbsPerPerson: 22, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"700",unit:"g",name:"poulet (cuisses désossées)"},{quantity:"2",unit:"c.à.s",name:"yaourt"},
      {quantity:"2",unit:"c.à.c",name:"garam masala"},{quantity:"2",unit:"c.à.c",name:"cumin"},
      {quantity:"1",unit:"c.à.c",name:"curcuma"},{quantity:"2",unit:"",name:"oignons"},
      {quantity:"400",unit:"g",name:"tomates concassées"},{quantity:"20",unit:"cl",name:"crème de coco"},
      {quantity:"3",unit:"gousses",name:"ail"},{quantity:"1",unit:"morceau",name:"gingembre"},
      {quantity:"1",unit:"c.à.s",name:"concentré de tomates"}
    ],
    steps: [
      "Mariner le poulet coupé en cubes dans yaourt, garam masala, cumin, curcuma, sel — 1h minimum.",
      "Faire griller le poulet mariné à feu vif (ou au four gril) jusqu'à légère coloration. Réserver.",
      "Faire revenir oignons, ail et gingembre râpé 5 min.",
      "Ajouter concentré de tomates et épices restantes, cuire 2 min.",
      "Ajouter tomates concassées, cuire 15 min jusqu'à réduction.",
      "Mixer la sauce pour la lisser. Remettre le poulet.",
      "Ajouter la crème de coco, mijoter 10 min. Servir avec du riz basmati et naan."
    ],
    chefTip: "Faire griller le poulet séparément avant de l'incorporer à la sauce — c'est ce qui donne les notes légèrement fumées caractéristiques.",
    childNote: "Réduis les épices de moitié pour les enfants, le goût reste savoureux."
  },
  {
    name: "Filet mignon de porc en croûte moutarde",
    type: "dîner", cuisine: "Française", imageQuery: "pork tenderloin mustard herb crust roasted golden elegant",
    servings: 4, prepTime: "15 min", cookTime: "25 min", difficulty: "Facile",
    kcalPerPerson: 380, proteinPerPerson: 42, carbsPerPerson: 10, diets: [],
    ingredients: [
      {quantity:"2",unit:"(350g pièce)",name:"filets mignons de porc"},{quantity:"3",unit:"c.à.s",name:"moutarde à l'ancienne"},
      {quantity:"60",unit:"g",name:"chapelure"},{quantity:"",unit:"",name:"herbes de Provence"},
      {quantity:"2",unit:"gousses",name:"ail"},{quantity:"30",unit:"g",name:"beurre"},
      {quantity:"10",unit:"cl",name:"fond de veau"},{quantity:"10",unit:"cl",name:"crème"}
    ],
    steps: [
      "Préchauffer le four à 200 °C.",
      "Saisir les filets mignons sur toutes les faces dans une poêle chaude. Laisser tiédir.",
      "Mélanger moutarde, chapelure, herbes et ail haché.",
      "Enrober généreusement les filets de ce mélange.",
      "Enfourner 18-20 min — 63 °C à cœur (rosé) ou 70 °C (à point).",
      "Laisser reposer 5 min. Déglacer la poêle de saisie avec fond et crème pour la sauce.",
      "Trancher et servir nappé de sauce."
    ],
    chefTip: "Un thermomètre de cuisson est ton meilleur ami ici. À 63 °C le porc est rosé et fondant, à 70 °C il reste juteux mais bien cuit.",
    childNote: null
  },
  {
    name: "Gratin de fruits de mer",
    type: "dîner", cuisine: "Française", imageQuery: "seafood gratin cream cheese sauce shrimp scallops mussels",
    servings: 4, prepTime: "20 min", cookTime: "20 min", difficulty: "Moyen",
    kcalPerPerson: 420, proteinPerPerson: 32, carbsPerPerson: 22, diets: [],
    ingredients: [
      {quantity:"200",unit:"g",name:"crevettes décortiquées"},{quantity:"200",unit:"g",name:"noix de Saint-Jacques"},
      {quantity:"200",unit:"g",name:"moules cuites"},{quantity:"2",unit:"",name:"échalotes"},
      {quantity:"20",unit:"cl",name:"vin blanc"},{quantity:"30",unit:"cl",name:"crème fraîche"},
      {quantity:"30",unit:"g",name:"beurre"},{quantity:"30",unit:"g",name:"farine"},
      {quantity:"80",unit:"g",name:"gruyère râpé"},{quantity:"",unit:"",name:"persil, ciboulette"}
    ],
    steps: [
      "Faire pocher légèrement les crevettes et noix de Saint-Jacques dans le vin blanc avec les échalotes. Réserver.",
      "Préparer une sauce béchamel avec le beurre, la farine et le jus de cuisson filtré + crème.",
      "Assaisonner, ajouter les herbes. Incorporer délicatement les fruits de mer.",
      "Verser dans des ramequins ou un plat à gratin.",
      "Couvrir de gruyère râpé.",
      "Gratiner sous le gril 8-10 min jusqu'à coloration dorée."
    ],
    chefTip: "Ne surcuis pas les fruits de mer à l'étape de pochage — ils vont encore cuire au four. Juste 2 min de pochage, pas plus.",
    childNote: null
  },
  {
    name: "Ramen japonais maison",
    type: "dîner", cuisine: "Japonaise", imageQuery: "ramen noodles soft boiled egg pork belly miso broth bowl",
    servings: 4, prepTime: "30 min", cookTime: "180 min", difficulty: "Difficile",
    kcalPerPerson: 620, proteinPerPerson: 42, carbsPerPerson: 68, diets: [],
    ingredients: [
      {quantity:"400",unit:"g",name:"noodles ramen frais"},{quantity:"500",unit:"g",name:"poitrine de porc"},
      {quantity:"4",unit:"",name:"œufs"},{quantity:"1.5",unit:"L",name:"bouillon de poulet"},
      {quantity:"4",unit:"c.à.s",name:"miso blanc"},{quantity:"3",unit:"c.à.s",name:"sauce soja"},
      {quantity:"2",unit:"c.à.s",name:"mirin"},{quantity:"100",unit:"g",name:"pousses de bambou"},
      {quantity:"4",unit:"",name:"oignons nouveaux"},{quantity:"1",unit:"feuille",name:"nori"}
    ],
    steps: [
      "Cuire la poitrine de porc entière dans eau + sauce soja + mirin 2h à frémissement. Laisser refroidir dans le bouillon.",
      "Cuire les œufs 6 min 30 dans l'eau bouillante, refroidir, écaler. Mariner dans sauce soja + mirin 1h.",
      "Faire chauffer le bouillon de poulet, incorporer le miso hors ébullition. Assaisonner.",
      "Cuire les noodles selon les instructions, bien égoutter.",
      "Trancher la poitrine de porc en tranches épaisses.",
      "Dresser : noodles dans le bol, verser le bouillon chaud, disposer porc, œuf coupé en deux, bambou, oignons et nori."
    ],
    chefTip: "Le chashu (porc braisé) et les œufs marinés peuvent se préparer la veille — c'est même meilleur. Le bouillon miso ne doit jamais bouillir ou il perd ses arômes.",
    childNote: null
  },
  {
    name: "Côtelettes d'agneau persillade grillées",
    type: "dîner", cuisine: "Française", imageQuery: "lamb chops persillade herb crust grilled plate elegant",
    servings: 4, prepTime: "15 min", cookTime: "10 min", difficulty: "Facile",
    kcalPerPerson: 420, proteinPerPerson: 34, carbsPerPerson: 6, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"12",unit:"",name:"côtelettes d'agneau"},{quantity:"60",unit:"g",name:"chapelure fine"},
      {quantity:"3",unit:"gousses",name:"ail"},{quantity:"1",unit:"bouquet",name:"persil plat"},
      {quantity:"1",unit:"c.à.s",name:"moutarde forte"},{quantity:"2",unit:"c.à.s",name:"huile d'olive"},
      {quantity:"",unit:"",name:"sel, poivre"}
    ],
    steps: [
      "Préparer la persillade : mixer chapelure, ail et persil. Ajouter l'huile d'olive.",
      "Badigeonner les côtelettes de moutarde côté chair.",
      "Appliquer la persillade en pressant pour qu'elle adhère.",
      "Griller à feu très vif, côté persillade en premier, 3 min. Retourner, 2 min pour une cuisson rosée.",
      "Laisser reposer 2 min. Servir avec haricots verts sautés à l'ail."
    ],
    chefTip: "L'agneau doit être servi rosé pour rester fondant et savoureux. Bien cuit, il perd tout son intérêt.",
    childNote: null
  },
  {
    name: "Tian de légumes provençal au four",
    type: "dîner", cuisine: "Provençale", imageQuery: "tian provencal zucchini tomato eggplant baked olive oil",
    servings: 4, prepTime: "20 min", cookTime: "60 min", difficulty: "Facile",
    kcalPerPerson: 160, proteinPerPerson: 4, carbsPerPerson: 18, diets: ["Végétarien","Vegan","Sans gluten"],
    ingredients: [
      {quantity:"2",unit:"",name:"courgettes"},{quantity:"2",unit:"",name:"tomates"},
      {quantity:"2",unit:"",name:"aubergines"},{quantity:"2",unit:"",name:"oignons"},
      {quantity:"3",unit:"gousses",name:"ail"},{quantity:"6",unit:"c.à.s",name:"huile d'olive extra vierge"},
      {quantity:"",unit:"",name:"thym, romarin"},{quantity:"",unit:"",name:"sel, poivre"}
    ],
    steps: [
      "Préchauffer le four à 180 °C.",
      "Émincer oignons et ail, les faire revenir dans l'huile. Étaler dans le fond du plat.",
      "Trancher courgettes, tomates et aubergines en rondelles de 5 mm.",
      "Dresser les légumes debout en les alternant (courgette, tomate, aubergine) dans le plat.",
      "Arroser d'huile d'olive, parsemer de thym et romarin, assaisonner.",
      "Cuire 55-60 min jusqu'à ce que les légumes soient confits et légèrement caramélisés."
    ],
    chefTip: "Coupe les légumes à l'épaisseur identique à la mandoline pour une cuisson homogène et un visuel impeccable.",
    childNote: "Un des rares plats de légumes que les enfants acceptent facilement grâce aux saveurs sucrées de la cuisson lente."
  },
  {
    name: "Curry de crevettes lait de coco",
    type: "dîner", cuisine: "Thaïlandaise", imageQuery: "shrimp curry coconut milk lemongrass Thai green curry bowl",
    servings: 4, prepTime: "15 min", cookTime: "20 min", difficulty: "Facile",
    kcalPerPerson: 390, proteinPerPerson: 26, carbsPerPerson: 28, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"600",unit:"g",name:"grosses crevettes décortiquées"},{quantity:"2",unit:"",name:"poivrons"},
      {quantity:"1",unit:"boîte (400ml)",name:"lait de coco"},{quantity:"2",unit:"c.à.s",name:"pâte de curry vert"},
      {quantity:"2",unit:"",name:"tiges de citronnelle"},{quantity:"3",unit:"feuilles",name:"kaffir lime"},
      {quantity:"1",unit:"c.à.s",name:"sauce poisson"},{quantity:"1",unit:"c.à.c",name:"sucre de canne"},
      {quantity:"",unit:"",name:"basilic thaï"},{quantity:"",unit:"",name:"riz basmati"}
    ],
    steps: [
      "Faire revenir la pâte de curry dans un peu d'huile 1 min jusqu'à ce qu'elle soit parfumée.",
      "Ajouter le lait de coco, citronnelle tapée et feuilles de kaffir lime. Porter à frémissement.",
      "Ajouter les poivrons en lanières, cuire 5 min.",
      "Incorporer les crevettes, cuire 3-4 min — juste le temps qu'elles rossissent.",
      "Assaisonner avec sauce poisson et sucre.",
      "Parsemer de basilic thaï. Servir avec riz jasmin."
    ],
    chefTip: "Les crevettes sur-cuites deviennent caoutchouteuses. Ajoute-les en dernier et retire du feu dès qu'elles sont rosées.",
    childNote: "Utilise de la pâte de curry doux (jaune) et omets la sauce poisson — remplace par une pincée de sel."
  },
  {
    name: "Wok de bœuf aux légumes croquants",
    type: "dîner", cuisine: "Asiatique", imageQuery: "beef wok stir fry vegetables oyster sauce ginger garlic sesame",
    servings: 4, prepTime: "15 min", cookTime: "10 min", difficulty: "Facile",
    kcalPerPerson: 380, proteinPerPerson: 32, carbsPerPerson: 24, diets: [],
    ingredients: [
      {quantity:"600",unit:"g",name:"bœuf (rumsteck) en lanières"},{quantity:"2",unit:"",name:"poivrons"},
      {quantity:"200",unit:"g",name:"pois sugar snap"},{quantity:"2",unit:"",name:"carottes"},
      {quantity:"3",unit:"gousses",name:"ail"},{quantity:"1",unit:"morceau",name:"gingembre frais"},
      {quantity:"4",unit:"c.à.s",name:"sauce huitre"},{quantity:"2",unit:"c.à.s",name:"sauce soja"},
      {quantity:"1",unit:"c.à.s",name:"huile de sésame"},{quantity:"",unit:"",name:"graines de sésame"}
    ],
    steps: [
      "Tailler le bœuf en lanières fines dans le sens contraire des fibres. Mariner 10 min dans sauce soja.",
      "Couper les légumes en bâtonnets réguliers.",
      "Chauffer le wok à feu très vif jusqu'à légère fumée. Saisir le bœuf 2 min, réserver.",
      "Dans le même wok, faire sauter ail et gingembre râpés 30 secondes.",
      "Ajouter les légumes par ordre de cuisson : carottes, poivrons, pois. Cuire 3 min en mélangeant.",
      "Remettre le bœuf, ajouter sauce huitre et huile de sésame. Mélanger vivement 1 min.",
      "Servir aussitôt avec riz blanc ou nouilles sautées."
    ],
    chefTip: "Tout doit être prêt avant de commencer — un wok se cuit en 10 min et ne t'autorise pas à aller chercher un ingrédient à mi-cuisson.",
    childNote: null
  },
  {
    name: "Crème brûlée vanille Bourbon",
    type: "dîner", cuisine: "Française", imageQuery: "crème brûlée vanilla custard caramelized sugar ramekin classic",
    servings: 6, prepTime: "15 min", cookTime: "45 min", difficulty: "Moyen",
    kcalPerPerson: 380, proteinPerPerson: 6, carbsPerPerson: 28, diets: ["Végétarien","Sans gluten"],
    ingredients: [
      {quantity:"6",unit:"",name:"jaunes d'œuf"},{quantity:"80",unit:"g",name:"sucre"},
      {quantity:"50",unit:"cl",name:"crème liquide entière"},{quantity:"1",unit:"",name:"gousse de vanille Bourbon"},
      {quantity:"6",unit:"c.à.s",name:"sucre roux (pour la caramélisation)"}
    ],
    steps: [
      "Préchauffer le four à 100 °C.",
      "Fendre et gratter la gousse de vanille dans la crème. Porter à frémissement, infuser 10 min hors du feu.",
      "Fouetter jaunes et sucre sans faire mousser. Verser la crème chaude filtrée en filet en mélangeant.",
      "Écumer les bulles, verser dans les ramequins.",
      "Cuire au bain-marie 40-45 min — les crèmes doivent trembler légèrement au centre.",
      "Réfrigérer minimum 3h. Au moment de servir, saupoudrer de sucre roux et brûler au chalumeau."
    ],
    chefTip: "100 °C, pas plus — une température trop élevée fait des grumeaux. La crème doit rester légèrement tremblotante en sortant du four.",
    childNote: null
  },
  {
    name: "Tarte tatin aux pommes caramélisées",
    type: "dîner", cuisine: "Française", imageQuery: "tarte tatin apple caramel upside down tart cream",
    servings: 6, prepTime: "20 min", cookTime: "45 min", difficulty: "Moyen",
    kcalPerPerson: 360, proteinPerPerson: 4, carbsPerPerson: 52, diets: ["Végétarien"],
    ingredients: [
      {quantity:"8",unit:"",name:"pommes Golden ou Reine des Reinettes"},{quantity:"100",unit:"g",name:"sucre"},
      {quantity:"80",unit:"g",name:"beurre demi-sel"},{quantity:"1",unit:"",name:"pâte feuilletée"},
      {quantity:"1",unit:"c.à.c",name:"cannelle"}
    ],
    steps: [
      "Éplucher et couper les pommes en 4, épépiner.",
      "Dans une poêle allant au four ou une poêle à tatin, faire fondre sucre et beurre jusqu'à caramel ambré.",
      "Disposer les pommes serrées dans le caramel, cannelle. Cuire 10 min à feu moyen.",
      "Recouvrir les pommes de la pâte feuilletée en rentrant les bords vers l'intérieur.",
      "Enfourner à 200 °C pour 25-30 min jusqu'à ce que la pâte soit bien dorée.",
      "Laisser tiédir 5 min, retourner sur le plat de service. Servir tiède avec crème fraîche."
    ],
    chefTip: "Retourne la tarte trop tôt et le caramel coule partout — attends au moins 5 min. Trop tard, les pommes collent. Le timing est tout.",
    childNote: null
  },
  {
    name: "Mousse au chocolat 70% sans crème",
    type: "dîner", cuisine: "Française", imageQuery: "chocolate mousse dark 70% French classic light airy dessert",
    servings: 6, prepTime: "20 min", cookTime: "5 min", difficulty: "Facile",
    kcalPerPerson: 280, proteinPerPerson: 7, carbsPerPerson: 22, diets: ["Végétarien","Sans gluten"],
    ingredients: [
      {quantity:"200",unit:"g",name:"chocolat noir 70%"},{quantity:"6",unit:"",name:"œufs"},
      {quantity:"30",unit:"g",name:"sucre"},{quantity:"1",unit:"pincée",name:"sel"},
      {quantity:"30",unit:"g",name:"beurre"}
    ],
    steps: [
      "Faire fondre le chocolat et le beurre au bain-marie. Laisser tiédir.",
      "Séparer les blancs des jaunes. Battre les jaunes avec le sucre jusqu'à blanchiment.",
      "Incorporer le chocolat tiédi aux jaunes.",
      "Battre les blancs en neige ferme avec une pincée de sel.",
      "Incorporer 1/3 des blancs vigoureusement pour détendre l'appareil, puis le reste délicatement à la maryse.",
      "Verser dans des verrines, réfrigérer minimum 2h."
    ],
    chefTip: "Pas de crème ici — c'est l'émulsion chocolat-œuf qui crée la légèreté. Le chocolat ne doit pas dépasser 50 °C quand on l'incorpore — sinon les blancs cuisent.",
    childNote: null
  },
  {
    name: "Filet de bœuf Wellington",
    type: "dîner", cuisine: "Britannique", imageQuery: "beef Wellington mushroom duxelles puff pastry golden cut slice",
    servings: 6, prepTime: "30 min", cookTime: "35 min", difficulty: "Difficile",
    kcalPerPerson: 620, proteinPerPerson: 44, carbsPerPerson: 32, diets: [],
    ingredients: [
      {quantity:"1",unit:"(1 kg)",name:"filet de bœuf paré"},{quantity:"500",unit:"g",name:"champignons de Paris"},
      {quantity:"4",unit:"tranches",name:"jambon de Parme"},{quantity:"1",unit:"",name:"pâte feuilletée"},
      {quantity:"2",unit:"c.à.s",name:"moutarde forte"},{quantity:"2",unit:"",name:"échalotes"},
      {quantity:"10",unit:"cl",name:"cognac"},{quantity:"2",unit:"",name:"jaunes d'œuf"}
    ],
    steps: [
      "Saisir le filet entier à feu très vif sur toutes les faces. Badigeonner de moutarde, réfrigérer 30 min.",
      "Mixer les champignons finement avec échalotes. Cuire à sec jusqu'à évaporation complète — duxelles.",
      "Étaler le jambon de Parme en rectangle sur film plastique, étaler la duxelles dessus.",
      "Poser le filet, rouler serré dans le film. Réfrigérer 30 min.",
      "Enrouler dans la pâte feuilletée, sceller les bords, dorer au jaune d'œuf.",
      "Enfourner à 200 °C : 20 min pour saignant (52 °C), 25 min pour à point (60 °C).",
      "Reposer 10 min avant de trancher. Servir avec sauce bordelaise."
    ],
    chefTip: "La duxelles doit être parfaitement sèche — la moindre humidité résiduelle détrempe la pâte. Cuis-la jusqu'à ce qu'elle soit comme une pâte sèche.",
    childNote: null
  },
  {
    name: "Risotto homard safran",
    type: "dîner", cuisine: "Italienne", imageQuery: "lobster risotto saffron cream seafood elegant Italian plate",
    servings: 4, prepTime: "20 min", cookTime: "30 min", difficulty: "Difficile",
    kcalPerPerson: 580, proteinPerPerson: 28, carbsPerPerson: 62, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"2",unit:"",name:"queues de homard"},{quantity:"300",unit:"g",name:"riz Carnaroli"},
      {quantity:"1",unit:"L",name:"fumet de crustacés"},{quantity:"1",unit:"pincée",name:"safran"},
      {quantity:"2",unit:"",name:"échalotes"},{quantity:"15",unit:"cl",name:"vin blanc"},
      {quantity:"60",unit:"g",name:"beurre"},{quantity:"50",unit:"g",name:"parmesan"},
      {quantity:"10",unit:"cl",name:"crème liquide"}
    ],
    steps: [
      "Infuser le safran dans 3 c.à.s de fumet chaud.",
      "Pocher les queues de homard 6 min dans le fumet frémissant. Décortiquer, réserver.",
      "Faire suer les échalotes dans 20 g de beurre. Nacrer le riz 2 min.",
      "Déglacer au vin blanc, absorber. Ajouter fumet chaud louche par louche avec le safran infusé.",
      "Après 18 min, incorporer beurre, parmesan et crème — mantecatura.",
      "Dresser, poser les morceaux de homard sur le risotto, servir immédiatement."
    ],
    chefTip: "Utilise du Carnaroli plutôt qu'Arborio pour ce risotto luxe — il tient mieux la cuisson et développe plus d'onctuosité.",
    childNote: null
  },
  {
    name: "Cabillaud basse température citron confit",
    type: "dîner", cuisine: "Française", imageQuery: "cod slow cooked preserved lemon butter sauce elegant plate",
    servings: 4, prepTime: "10 min", cookTime: "20 min", difficulty: "Moyen",
    kcalPerPerson: 290, proteinPerPerson: 38, carbsPerPerson: 4, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"4",unit:"pavés (160g)",name:"cabillaud épais"},{quantity:"1",unit:"",name:"citron confit"},
      {quantity:"60",unit:"g",name:"beurre"},{quantity:"2",unit:"",name:"échalotes"},
      {quantity:"10",unit:"cl",name:"vin blanc"},{quantity:"",unit:"",name:"aneth frais"},
      {quantity:"2",unit:"c.à.s",name:"huile d'olive"},{quantity:"",unit:"",name:"sel, poivre blanc"}
    ],
    steps: [
      "Préchauffer le four à 60 °C.",
      "Assaisonner les pavés, les arroser d'huile d'olive.",
      "Cuire au four à 60 °C pendant 20-25 min — la chair devient nacrée et se détache en feuillets.",
      "Préparer la sauce : réduire échalotes et vin blanc, monter au beurre froid.",
      "Ajouter le zeste du citron confit rincé et haché, l'aneth ciselé.",
      "Dresser les pavés de cabillaud nappés de beurre blanc citron confit."
    ],
    chefTip: "La basse température transforme le cabillaud ordinaire en quelque chose d'exceptionnel — feuillets nacrés, texture soyeuse. Impossible à rater.",
    childNote: null
  },
  {
    name: "Soufflé au fromage de brebis",
    type: "dîner", cuisine: "Française", imageQuery: "cheese soufflé French baked rising golden ramekin",
    servings: 4, prepTime: "20 min", cookTime: "20 min", difficulty: "Difficile",
    kcalPerPerson: 320, proteinPerPerson: 18, carbsPerPerson: 16, diets: ["Végétarien"],
    ingredients: [
      {quantity:"150",unit:"g",name:"fromage de brebis (ossau-iraty)"},{quantity:"4",unit:"",name:"œufs"},
      {quantity:"30",unit:"g",name:"beurre"},{quantity:"30",unit:"g",name:"farine"},
      {quantity:"25",unit:"cl",name:"lait"},{quantity:"",unit:"",name:"noix de muscade"},
      {quantity:"",unit:"",name:"sel, poivre de Cayenne"}
    ],
    steps: [
      "Préchauffer le four à 190 °C. Beurrer et fariner 4 ramequins.",
      "Préparer une béchamel épaisse : beurre + farine + lait. Incorporer le fromage râpé. Assaisonner.",
      "Séparer les blancs des jaunes. Incorporer les jaunes à la béchamel tiédie.",
      "Battre les blancs en neige très ferme.",
      "Incorporer 1/3 des blancs vigoureusement, puis le reste délicatement.",
      "Remplir les ramequins aux 3/4. Passer le pouce sur le bord pour une ligne nette (favorise la montée).",
      "Enfourner immédiatement, ne jamais ouvrir le four pendant 18-20 min."
    ],
    chefTip: "Le soufflé n'attend pas — c'est lui qui attend les convives, pas l'inverse. Sers dès la sortie du four.",
    childNote: null
  },
  {
    name: "Entrecôte marchand de vin",
    type: "dîner", cuisine: "Française", imageQuery: "rib steak red wine shallot butter sauce bistro French",
    servings: 2, prepTime: "10 min", cookTime: "15 min", difficulty: "Facile",
    kcalPerPerson: 520, proteinPerPerson: 42, carbsPerPerson: 6, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"1",unit:"(600g)",name:"entrecôte maturée"},{quantity:"3",unit:"",name:"échalotes"},
      {quantity:"20",unit:"cl",name:"vin rouge corsé"},{quantity:"60",unit:"g",name:"beurre"},
      {quantity:"1",unit:"c.à.s",name:"persil haché"},{quantity:"",unit:"",name:"sel, poivre"},
      {quantity:"1",unit:"c.à.s",name:"huile"}
    ],
    steps: [
      "Sortir l'entrecôte 30 min avant. Saisir à feu très vif dans huile + 20 g de beurre, 3 min par face pour saignant.",
      "Laisser reposer sur une grille sous alu.",
      "Dans la même poêle, faire fondre les échalotes 3 min. Déglacer au vin rouge.",
      "Réduire des 2/3, incorporer le reste du beurre froid en dés hors du feu.",
      "Ajouter le persil. Servir l'entrecôte avec la sauce et des frites."
    ],
    chefTip: "Une entrecôte maturée (30-40 jours) n'a besoin que de sel, poivre et beurre. Le reste c'est de la mise en scène.",
    childNote: null
  },
  {
    name: "Tarte aux poireaux chèvre frais",
    type: "dîner", cuisine: "Française", imageQuery: "leek goat cheese tart quiche French savory pastry",
    servings: 6, prepTime: "20 min", cookTime: "45 min", difficulty: "Facile",
    kcalPerPerson: 380, proteinPerPerson: 14, carbsPerPerson: 28, diets: ["Végétarien"],
    ingredients: [
      {quantity:"1",unit:"",name:"pâte brisée"},{quantity:"3",unit:"",name:"poireaux"},
      {quantity:"150",unit:"g",name:"chèvre frais"},{quantity:"3",unit:"",name:"œufs"},
      {quantity:"20",unit:"cl",name:"crème fraîche"},{quantity:"30",unit:"g",name:"beurre"},
      {quantity:"",unit:"",name:"noix de muscade, sel, poivre"},{quantity:"",unit:"",name:"ciboulette"}
    ],
    steps: [
      "Préchauffer le four à 180 °C. Foncer un moule avec la pâte brisée.",
      "Émincer les poireaux (partie blanche et vert tendre), les faire fondre dans le beurre 15 min sans coloration.",
      "Battre œufs et crème, assaisonner avec muscade, sel et poivre.",
      "Répartir les poireaux sur le fond de tarte, émietter le chèvre.",
      "Verser l'appareil, parsemer de ciboulette.",
      "Cuire 35 min jusqu'à coloration dorée."
    ],
    chefTip: "Les poireaux doivent être fondants et légèrement sucrés avant de les mettre dans la tarte — une cuisson courte les laisse trop crus.",
    childNote: null
  },
  {
    name: "Poulpe à la galicienne",
    type: "dîner", cuisine: "Espagnole", imageQuery: "pulpo a la gallega octopus paprika olive oil potatoes Spanish",
    servings: 4, prepTime: "10 min", cookTime: "45 min", difficulty: "Moyen",
    kcalPerPerson: 280, proteinPerPerson: 30, carbsPerPerson: 18, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"1",unit:"(1.2 kg)",name:"poulpe nettoyé"},{quantity:"4",unit:"",name:"pommes de terre"},
      {quantity:"4",unit:"c.à.s",name:"huile d'olive extra vierge"},{quantity:"2",unit:"c.à.c",name:"paprika fumé doux"},
      {quantity:"1",unit:"c.à.c",name:"paprika piquant"},{quantity:"",unit:"",name:"gros sel"},
      {quantity:"1",unit:"",name:"oignon"},{quantity:"1",unit:"feuille",name:"laurier"}
    ],
    steps: [
      "Congeler le poulpe 24h à l'avance pour attendrir les fibres, décongeler au frigo.",
      "Porter une grande casserole d'eau à ébullition avec l'oignon et le laurier.",
      "Plonger le poulpe 3 fois brièvement avant immersion complète (tradition galicienne).",
      "Cuire 35-40 min à frémissement jusqu'à ce qu'une pointe pénètre sans résistance.",
      "Cuire les pommes de terre dans l'eau de cuisson du poulpe.",
      "Trancher le poulpe. Dresser sur les pommes de terre en rondelles.",
      "Arroser d'huile d'olive, saupoudrer de paprika et gros sel. Servir tiède."
    ],
    chefTip: "La congélation remplace le fameux 'battre le poulpe' — elle rompt les fibres musculaires pour attendrir la chair. Ne saute jamais cette étape.",
    childNote: null
  },
  {
    name: "Terrine de foie gras maison mi-cuit",
    type: "dîner", cuisine: "Française", imageQuery: "foie gras terrine toast brioche French luxury starter",
    servings: 8, prepTime: "30 min", cookTime: "25 min", difficulty: "Difficile",
    kcalPerPerson: 420, proteinPerPerson: 10, carbsPerPerson: 6, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"1",unit:"(600g)",name:"lobe de foie gras cru déveiné"},{quantity:"5",unit:"g",name:"sel"},
      {quantity:"2",unit:"g",name:"poivre blanc"},{quantity:"2",unit:"g",name:"sucre"},
      {quantity:"4",unit:"cl",name:"sauternes (ou cognac)"},{quantity:"1",unit:"pincée",name:"quatre-épices"}
    ],
    steps: [
      "Séparer les deux lobes, retirer délicatement les veines avec les doigts en ouvrant la chair.",
      "Mélanger sel, poivre, sucre et épices. Assaisonner le foie sur toutes les faces.",
      "Arroser de sauternes, couvrir et réfrigérer 12h.",
      "Tasser le foie dans une terrine, presser pour éliminer les bulles d'air.",
      "Cuire au bain-marie à 120 °C pendant 20-25 min — 50 °C à cœur.",
      "Laisser refroidir, mettre sous presse au frigo au moins 48h.",
      "Servir tranché avec brioche toastée et fleur de sel."
    ],
    chefTip: "La qualité du foie gras cru est décisive — un bon foie se déveine facilement. Les 48h de repos au frigo sont incompressibles pour que la terrine se tienne.",
    childNote: null
  },
  {
    name: "Pot-au-feu traditionnel",
    type: "dîner", cuisine: "Française", imageQuery: "pot-au-feu beef vegetables broth winter French classic",
    servings: 6, prepTime: "20 min", cookTime: "180 min", difficulty: "Facile",
    kcalPerPerson: 480, proteinPerPerson: 44, carbsPerPerson: 28, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"800",unit:"g",name:"paleron de bœuf"},{quantity:"400",unit:"g",name:"plat de côtes"},
      {quantity:"1",unit:"",name:"os à moelle"},{quantity:"4",unit:"",name:"carottes"},
      {quantity:"3",unit:"",name:"poireaux"},{quantity:"2",unit:"branches",name:"céleri"},
      {quantity:"2",unit:"",name:"oignons"},{quantity:"1",unit:"bouquet",name:"garni"},
      {quantity:"6",unit:"",name:"pommes de terre"},{quantity:"",unit:"",name:"gros sel, cornichons, moutarde"}
    ],
    steps: [
      "Mettre la viande dans une grande marmite, couvrir d'eau froide. Porter à ébullition, écumer soigneusement.",
      "Ajouter oignons brûlés, bouquet garni, gros sel. Cuire à frémissement 1h30.",
      "Ajouter carottes, poireaux, céleri. Cuire encore 45 min.",
      "Ajouter pommes de terre et os à moelle, cuire 30 min.",
      "Servir le bouillon en entrée, puis la viande et les légumes.",
      "Accompagner de cornichons, gros sel, moutarde et pain grillé pour la moelle."
    ],
    chefTip: "L'écumage du début est la seule contrainte — après, le pot-au-feu se fait tout seul. Plus tu cuis longtemps à frémissement doux, plus la viande est fondante.",
    childNote: "Un bouillon de pot-au-feu maison est parfait pour les enfants malades ou en bas âge."
  },
  {
    name: "Tartare de saumon avocat citron vert",
    type: "dîner", cuisine: "Française", imageQuery: "salmon tartare avocado lime cucumber fresh elegant appetizer",
    servings: 4, prepTime: "20 min", cookTime: "0 min", difficulty: "Facile",
    kcalPerPerson: 280, proteinPerPerson: 24, carbsPerPerson: 8, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"400",unit:"g",name:"saumon frais (qualité sushi)"},{quantity:"2",unit:"",name:"avocats"},
      {quantity:"1",unit:"",name:"citron vert"},{quantity:"1",unit:"",name:"concombre"},
      {quantity:"1",unit:"c.à.c",name:"gingembre frais râpé"},{quantity:"1",unit:"c.à.s",name:"sauce soja"},
      {quantity:"2",unit:"c.à.s",name:"huile de sésame"},{quantity:"",unit:"",name:"aneth ou coriandre"},
      {quantity:"",unit:"",name:"graines de sésame"}
    ],
    steps: [
      "Couper le saumon en petits dés réguliers de 8 mm au couteau.",
      "Couper les avocats et le concombre pelé en dés de même taille.",
      "Préparer la vinaigrette : jus de citron vert, sauce soja, huile de sésame, gingembre.",
      "Mélanger délicatement saumon, avocat, concombre et vinaigrette.",
      "Dresser en cercle sur assiette froide. Parsemer d'herbes et graines de sésame.",
      "Servir immédiatement avec des chips de wonton ou des crackers."
    ],
    chefTip: "Utilise uniquement du saumon labelisé 'qualité sushi' ou 'pour crudités' — le congeler 48h à -20 °C avant est une précaution recommandée.",
    childNote: null
  },
  {
    name: "Canard à l'orange façon classique",
    type: "dîner", cuisine: "Française", imageQuery: "duck orange sauce classic French bistro glazed roasted",
    servings: 4, prepTime: "20 min", cookTime: "90 min", difficulty: "Difficile",
    kcalPerPerson: 520, proteinPerPerson: 38, carbsPerPerson: 22, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"1",unit:"(1.8 kg)",name:"canard fermier"},{quantity:"4",unit:"",name:"oranges"},
      {quantity:"1",unit:"",name:"citron"},{quantity:"60",unit:"g",name:"sucre"},
      {quantity:"5",unit:"cl",name:"vinaigre de vin blanc"},{quantity:"20",unit:"cl",name:"fond de veau"},
      {quantity:"5",unit:"cl",name:"grand Marnier"},{quantity:"30",unit:"g",name:"beurre"}
    ],
    steps: [
      "Préchauffer le four à 200 °C. Assaisonner le canard, farcir la cavité d'un quartier d'orange.",
      "Rôtir 1h15 en arrosant toutes les 20 min. Laisser reposer 15 min.",
      "Prélever les zestes de 2 oranges, blanchir 3 fois dans l'eau bouillante.",
      "Faire un caramel à sec avec le sucre, déglacer au vinaigre (caramel roux).",
      "Ajouter jus d'oranges, fond de veau et Grand Marnier. Réduire à consistance nappante.",
      "Monter au beurre froid hors du feu, ajouter les zestes blanchis.",
      "Découper le canard, servir nappé de sauce bigarade."
    ],
    chefTip: "Blanchir les zestes 3 fois est indispensable pour retirer l'amertume. La sauce doit équilibrer sucré-acide-amer — goûte et ajuste vinaigre ou sucre.",
    childNote: null
  },

  // ─────────────────────────────────────────────
  // RECETTES HEALTHY & RÉGIME
  // ─────────────────────────────────────────────

  // ── Petit-déjeuner healthy ───────────────────
  {
    name: "Bol açaï protéiné fruits rouges",
    type: "petit-déjeuner", cuisine: "Américaine", imageQuery: "acai bowl blueberry granola healthy breakfast superfood",
    servings: 1, prepTime: "5 min", cookTime: "0 min", difficulty: "Facile",
    kcalPerPerson: 320, proteinPerPerson: 18, carbsPerPerson: 38, diets: ["Végétarien","Vegan","Sans gluten"],
    ingredients: [
      {quantity:"100",unit:"g",name:"purée d'açaï congelée"},{quantity:"1",unit:"",name:"banane congelée"},
      {quantity:"30",unit:"g",name:"protéine en poudre vanille"},{quantity:"10",unit:"cl",name:"lait d'amande"},
      {quantity:"50",unit:"g",name:"myrtilles"},{quantity:"50",unit:"g",name:"framboises"},
      {quantity:"2",unit:"c.à.s",name:"granola"},{quantity:"1",unit:"c.à.s",name:"graines de chia"},
      {quantity:"1",unit:"c.à.s",name:"beurre d'amande"}
    ],
    steps: [
      "Mixer purée d'açaï, banane congelée, protéine en poudre et lait d'amande jusqu'à consistance épaisse et lisse.",
      "Verser dans un bol froid.",
      "Disposer les toppings en rangées : fruits rouges, granola, graines de chia.",
      "Terminer par un filet de beurre d'amande."
    ],
    chefTip: "La base doit être épaisse comme de la glace — ajoute le lait d'amande en petite quantité. Un bol trop liquide ne tient pas les toppings.",
    childNote: null
  },
  {
    name: "Overnight oats protéinés pomme cannelle",
    type: "petit-déjeuner", cuisine: "Américaine", imageQuery: "overnight oats apple cinnamon chia seeds healthy jar",
    servings: 1, prepTime: "5 min", cookTime: "0 min", difficulty: "Facile",
    kcalPerPerson: 380, proteinPerPerson: 22, carbsPerPerson: 45, diets: ["Végétarien"],
    ingredients: [
      {quantity:"60",unit:"g",name:"flocons d'avoine"},{quantity:"20",unit:"cl",name:"lait ou lait végétal"},
      {quantity:"1",unit:"c.à.s",name:"graines de chia"},{quantity:"30",unit:"g",name:"protéine en poudre"},
      {quantity:"1",unit:"c.à.c",name:"cannelle"},{quantity:"1",unit:"c.à.s",name:"miel ou sirop d'érable"},
      {quantity:"1",unit:"",name:"pomme"},{quantity:"30",unit:"g",name:"yaourt grec 0%"}
    ],
    steps: [
      "Dans un bocal, mélanger flocons, chia, protéine, cannelle et miel.",
      "Verser le lait, mélanger. Ajouter le yaourt grec par-dessus.",
      "Fermer et réfrigérer toute la nuit (minimum 6h).",
      "Le matin : râper la pomme, déposer sur le bol avec une pincée de cannelle supplémentaire."
    ],
    chefTip: "Prépares-en 5 d'un coup le dimanche soir — petit-déjeuner de la semaine réglé en 10 min.",
    childNote: null
  },
  {
    name: "Omelette aux blancs d'œufs et légumes",
    type: "petit-déjeuner", cuisine: "Américaine", imageQuery: "egg white omelette spinach mushrooms healthy low calorie",
    servings: 1, prepTime: "5 min", cookTime: "8 min", difficulty: "Facile",
    kcalPerPerson: 180, proteinPerPerson: 24, carbsPerPerson: 6, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"4",unit:"",name:"blancs d'œuf"},{quantity:"1",unit:"",name:"œuf entier"},
      {quantity:"60",unit:"g",name:"épinards frais"},{quantity:"60",unit:"g",name:"champignons"},
      {quantity:"¼",unit:"",name:"poivron rouge"},{quantity:"30",unit:"g",name:"fromage de chèvre frais"},
      {quantity:"",unit:"",name:"sel, poivre, paprika"},{quantity:"1",unit:"c.à.c",name:"huile d'olive"}
    ],
    steps: [
      "Faire sauter champignons et poivron 3 min dans l'huile. Ajouter les épinards, cuire 1 min.",
      "Battre blancs + œuf entier avec sel, poivre et paprika.",
      "Verser dans la poêle à feu moyen-doux, ne pas mélanger.",
      "Quand les bords sont pris, déposer les légumes et le chèvre sur une moitié.",
      "Replier et servir aussitôt."
    ],
    chefTip: "L'œuf entier apporte le goût et la liaison — uniquement des blancs est trop sec. Un seul jaune pour toute l'omelette reste très light.",
    childNote: null
  },
  {
    name: "Green smoothie détox épinards ananas",
    type: "petit-déjeuner", cuisine: "Américaine", imageQuery: "green smoothie spinach pineapple ginger detox healthy",
    servings: 1, prepTime: "5 min", cookTime: "0 min", difficulty: "Facile",
    kcalPerPerson: 180, proteinPerPerson: 4, carbsPerPerson: 38, diets: ["Végétarien","Vegan","Sans gluten"],
    ingredients: [
      {quantity:"60",unit:"g",name:"épinards frais"},{quantity:"150",unit:"g",name:"ananas (frais ou congelé)"},
      {quantity:"1",unit:"",name:"banane congelée"},{quantity:"1",unit:"morceau",name:"gingembre frais"},
      {quantity:"½",unit:"",name:"citron vert (jus)"},{quantity:"25",unit:"cl",name:"eau de coco"},
      {quantity:"1",unit:"c.à.c",name:"spiruline (optionnel)"}
    ],
    steps: [
      "Mettre tous les ingrédients dans le blender par ordre : liquide, épinards, fruits.",
      "Mixer 60 secondes à pleine puissance jusqu'à consistance lisse.",
      "Servir immédiatement dans un grand verre."
    ],
    chefTip: "Le goût des épinards disparaît complètement derrière l'ananas et le gingembre. C'est l'astuce pour faire avaler des légumes sans effort.",
    childNote: "Omets le gingembre et la spiruline pour les enfants."
  },
  {
    name: "Bowl de fromage blanc baies et graines",
    type: "petit-déjeuner", cuisine: "Française", imageQuery: "Greek yogurt bowl mixed berries seeds honey healthy breakfast",
    servings: 1, prepTime: "5 min", cookTime: "0 min", difficulty: "Facile",
    kcalPerPerson: 220, proteinPerPerson: 20, carbsPerPerson: 18, diets: ["Végétarien","Sans gluten"],
    ingredients: [
      {quantity:"200",unit:"g",name:"fromage blanc 0%"},{quantity:"50",unit:"g",name:"myrtilles"},
      {quantity:"50",unit:"g",name:"fraises"},{quantity:"1",unit:"c.à.s",name:"graines de lin"},
      {quantity:"1",unit:"c.à.s",name:"graines de tournesol"},{quantity:"1",unit:"c.à.c",name:"miel"},
      {quantity:"½",unit:"c.à.c",name:"vanille en poudre"}
    ],
    steps: [
      "Mélanger fromage blanc et vanille dans un bol.",
      "Disposer les baies par-dessus.",
      "Parsemer de graines, terminer par un filet de miel."
    ],
    chefTip: "Utilise du fromage blanc entier si tu as faim — les graisses du lait augmentent la satiété et la durée de tenue jusqu'au déjeuner.",
    childNote: "Adoré des enfants, tel quel."
  },
  {
    name: "Toast de seigle saumon aneth",
    type: "petit-déjeuner", cuisine: "Scandinave", imageQuery: "rye bread smoked salmon cream cheese dill healthy breakfast",
    servings: 1, prepTime: "5 min", cookTime: "2 min", difficulty: "Facile",
    kcalPerPerson: 280, proteinPerPerson: 22, carbsPerPerson: 24, diets: [],
    ingredients: [
      {quantity:"2",unit:"tranches",name:"pain de seigle"},{quantity:"80",unit:"g",name:"saumon fumé"},
      {quantity:"60",unit:"g",name:"fromage frais type Skyr"},{quantity:"½",unit:"",name:"citron"},
      {quantity:"",unit:"",name:"aneth frais"},{quantity:"",unit:"",name:"câpres"},
      {quantity:"",unit:"",name:"poivre noir concassé"}
    ],
    steps: [
      "Griller légèrement le pain de seigle.",
      "Mélanger le fromage frais avec le zeste de citron et l'aneth ciselé.",
      "Étaler sur les toasts, déposer le saumon fumé en rosace.",
      "Garnir de câpres, un peu de jus de citron et poivre."
    ],
    chefTip: "Le pain de seigle a un index glycémique bas qui évite le pic d'insuline matinal — bien meilleur que la baguette pour tenir jusqu'au déjeuner.",
    childNote: null
  },
  {
    name: "Crêpes protéinées à l'avoine",
    type: "petit-déjeuner", cuisine: "Américaine", imageQuery: "protein pancakes oat flour banana healthy fitness breakfast",
    servings: 2, prepTime: "5 min", cookTime: "10 min", difficulty: "Facile",
    kcalPerPerson: 290, proteinPerPerson: 20, carbsPerPerson: 30, diets: ["Végétarien"],
    ingredients: [
      {quantity:"80",unit:"g",name:"flocons d'avoine mixés en farine"},{quantity:"2",unit:"",name:"œufs"},
      {quantity:"1",unit:"",name:"banane bien mûre"},{quantity:"10",unit:"cl",name:"lait"},
      {quantity:"30",unit:"g",name:"protéine en poudre (vanille)"},{quantity:"½",unit:"c.à.c",name:"levure chimique"},
      {quantity:"1",unit:"pincée",name:"sel"}
    ],
    steps: [
      "Écraser la banane, ajouter les œufs, le lait et mélanger.",
      "Incorporer farine d'avoine, protéine, levure et sel.",
      "Cuire de petites crêpes épaisses dans une poêle légèrement huilée, 2 min par face.",
      "Servir avec du yaourt grec et des fruits frais."
    ],
    chefTip: "La banane bien mûre sucre naturellement et remplace le sucre ajouté. Plus elle est noire, plus c'est sucré et digeste.",
    childNote: "Idéal pour les enfants — goût naturellement sucré sans sucre ajouté."
  },
  {
    name: "Muesli Bircher pomme noix",
    type: "petit-déjeuner", cuisine: "Suisse", imageQuery: "bircher muesli apple walnut yogurt overnight Swiss healthy",
    servings: 2, prepTime: "10 min", cookTime: "0 min", difficulty: "Facile",
    kcalPerPerson: 340, proteinPerPerson: 12, carbsPerPerson: 48, diets: ["Végétarien"],
    ingredients: [
      {quantity:"80",unit:"g",name:"flocons d'avoine"},{quantity:"2",unit:"",name:"pommes"},
      {quantity:"150",unit:"g",name:"yaourt nature"},{quantity:"10",unit:"cl",name:"jus de pomme"},
      {quantity:"30",unit:"g",name:"noix concassées"},{quantity:"1",unit:"c.à.s",name:"raisins secs"},
      {quantity:"1",unit:"c.à.s",name:"miel"},{quantity:"1",unit:"c.à.c",name:"cannelle"},
      {quantity:"1",unit:"c.à.s",name:"jus de citron"}
    ],
    steps: [
      "Mélanger flocons, jus de pomme et yaourt. Réfrigérer toute la nuit.",
      "Le matin : râper les pommes avec leur peau, citronner pour éviter l'oxydation.",
      "Incorporer les pommes râpées, les noix et les raisins.",
      "Ajouter le miel et la cannelle. Servir frais."
    ],
    chefTip: "C'est la recette originale du Dr Bircher-Benner, inchangée depuis 1900. Les flocons imbibés sont bien plus digestibles que les flocons secs.",
    childNote: null
  },

  // ── Déjeuner healthy ─────────────────────────
  {
    name: "Poke bowl thon avocat sésame",
    type: "déjeuner", cuisine: "Hawaïenne", imageQuery: "poke bowl tuna avocado sesame edamame healthy rice bowl",
    servings: 2, prepTime: "20 min", cookTime: "15 min", difficulty: "Facile",
    kcalPerPerson: 480, proteinPerPerson: 32, carbsPerPerson: 48, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"300",unit:"g",name:"riz à sushi"},{quantity:"250",unit:"g",name:"thon frais qualité sashimi"},
      {quantity:"1",unit:"",name:"avocat"},{quantity:"100",unit:"g",name:"edamame"},
      {quantity:"1",unit:"",name:"concombre"},{quantity:"1",unit:"",name:"carotte"},
      {quantity:"2",unit:"c.à.s",name:"sauce soja faible en sel"},{quantity:"1",unit:"c.à.s",name:"huile de sésame"},
      {quantity:"1",unit:"c.à.s",name:"graines de sésame"},{quantity:"1",unit:"c.à.s",name:"vinaigre de riz"},
      {quantity:"",unit:"",name:"nori en lamelles"}
    ],
    steps: [
      "Cuire le riz à sushi, assaisonner avec vinaigre de riz, sel et une pincée de sucre. Laisser refroidir.",
      "Couper le thon en dés de 1,5 cm. Mariner 5 min dans sauce soja et huile de sésame.",
      "Préparer les légumes : concombre en demi-lunes, carotte râpée, avocat en tranches.",
      "Dresser le riz dans des bols, disposer chaque ingrédient par sections.",
      "Parsemer de sésame et nori. Arroser du reste de marinade."
    ],
    chefTip: "Le thon doit être de qualité sashimi — congèle-le 48h à -20 °C avant si tu n'es pas sûr de la source.",
    childNote: "Remplace le thon cru par du thon en boîte ou du poulet grillé."
  },
  {
    name: "Taboulé de chou-fleur keto",
    type: "déjeuner", cuisine: "Moyen-orientale", imageQuery: "cauliflower tabbouleh keto low carb parsley tomato healthy",
    servings: 4, prepTime: "15 min", cookTime: "0 min", difficulty: "Facile",
    kcalPerPerson: 140, proteinPerPerson: 5, carbsPerPerson: 10, diets: ["Végétarien","Vegan","Sans gluten","Keto"],
    ingredients: [
      {quantity:"1",unit:"(800g)",name:"chou-fleur"},{quantity:"1",unit:"gros bouquet",name:"persil plat"},
      {quantity:"½",unit:"bouquet",name:"menthe fraîche"},{quantity:"3",unit:"",name:"tomates"},
      {quantity:"1",unit:"",name:"concombre"},{quantity:"4",unit:"",name:"oignons nouveaux"},
      {quantity:"4",unit:"c.à.s",name:"huile d'olive"},{quantity:"2",unit:"",name:"citrons (jus)"},
      {quantity:"",unit:"",name:"sel, poivre"}
    ],
    steps: [
      "Râper ou mixer le chou-fleur pour obtenir une texture de semoule fine.",
      "Ciseler très finement persil et menthe (le persil doit dominer).",
      "Couper tomates, concombre et oignons en petits dés.",
      "Mélanger tous les ingrédients, assaisonner généreusement d'huile d'olive et citron.",
      "Laisser mariner 30 min au frigo avant de servir."
    ],
    chefTip: "Le chou-fleur 'cru' version taboulé est surprenant — il prend exactement la texture de la semoule une fois mariné dans le citron.",
    childNote: null
  },
  {
    name: "Soupe de lentilles corail curcuma",
    type: "déjeuner", cuisine: "Indienne", imageQuery: "red lentil soup turmeric coconut milk healthy vegan detox",
    servings: 4, prepTime: "10 min", cookTime: "25 min", difficulty: "Facile",
    kcalPerPerson: 280, proteinPerPerson: 14, carbsPerPerson: 38, diets: ["Végétarien","Vegan","Sans gluten"],
    ingredients: [
      {quantity:"200",unit:"g",name:"lentilles corail"},{quantity:"2",unit:"",name:"oignons"},
      {quantity:"3",unit:"gousses",name:"ail"},{quantity:"1",unit:"morceau",name:"gingembre frais"},
      {quantity:"2",unit:"c.à.c",name:"curcuma"},{quantity:"1",unit:"c.à.c",name:"cumin"},
      {quantity:"1",unit:"c.à.c",name:"coriandre moulue"},{quantity:"20",unit:"cl",name:"lait de coco"},
      {quantity:"80",unit:"cl",name:"bouillon de légumes"},{quantity:"1",unit:"",name:"citron"},
      {quantity:"",unit:"",name:"coriandre fraîche"}
    ],
    steps: [
      "Faire revenir oignons, ail et gingembre dans un peu d'huile.",
      "Ajouter les épices, cuire 1 min pour les torréfier.",
      "Ajouter les lentilles rincées, le bouillon et le lait de coco.",
      "Cuire 20 min à frémissement jusqu'à ce que les lentilles soient fondantes.",
      "Mixer partiellement pour garder de la texture. Ajouter le jus de citron.",
      "Servir avec coriandre fraîche."
    ],
    chefTip: "Les lentilles corail n'ont pas besoin de trempage et cuisent en 20 min — c'est la légumineuse la plus rapide. Riches en protéines et en fer.",
    childNote: "Réduis les épices à la moitié."
  },
  {
    name: "Salade de pois chiches méditerranéenne",
    type: "déjeuner", cuisine: "Méditerranéenne", imageQuery: "chickpea salad Mediterranean feta tomato cucumber olive oil healthy",
    servings: 4, prepTime: "15 min", cookTime: "0 min", difficulty: "Facile",
    kcalPerPerson: 320, proteinPerPerson: 14, carbsPerPerson: 36, diets: ["Végétarien","Vegan","Sans gluten"],
    ingredients: [
      {quantity:"400",unit:"g",name:"pois chiches (boîte, rincés)"},{quantity:"200",unit:"g",name:"tomates cerises"},
      {quantity:"1",unit:"",name:"concombre"},{quantity:"100",unit:"g",name:"feta émiettée"},
      {quantity:"½",unit:"",name:"oignon rouge"},{quantity:"80",unit:"g",name:"olives kalamata"},
      {quantity:"",unit:"",name:"menthe fraîche"},{quantity:"3",unit:"c.à.s",name:"huile d'olive extra vierge"},
      {quantity:"2",unit:"c.à.s",name:"jus de citron"},{quantity:"1",unit:"c.à.c",name:"origan séché"}
    ],
    steps: [
      "Rincer et sécher les pois chiches. Pour plus de croustillant, les poêler 5 min avec huile et paprika.",
      "Couper tomates, concombre et oignon en petits morceaux.",
      "Mélanger tous les ingrédients dans un grand bol.",
      "Assaisonner huile d'olive, citron, origan, sel et poivre.",
      "Parsemer de menthe fraîche juste avant de servir."
    ],
    chefTip: "Faire rôtir les pois chiches 5 min à la poêle transforme la salade — ils deviennent croustillants et prennent une dimension totalement différente.",
    childNote: null
  },
  {
    name: "Zucchini noodles bolognaise légère",
    type: "déjeuner", cuisine: "Italienne", imageQuery: "zucchini noodles bolognese sauce low carb spiralized healthy",
    servings: 4, prepTime: "15 min", cookTime: "25 min", difficulty: "Facile",
    kcalPerPerson: 280, proteinPerPerson: 28, carbsPerPerson: 14, diets: ["Sans gluten","Keto"],
    ingredients: [
      {quantity:"4",unit:"",name:"courgettes"},{quantity:"400",unit:"g",name:"bœuf haché 5%"},
      {quantity:"400",unit:"g",name:"tomates concassées"},{quantity:"2",unit:"",name:"oignons"},
      {quantity:"3",unit:"gousses",name:"ail"},{quantity:"1",unit:"c.à.s",name:"concentré de tomates"},
      {quantity:"",unit:"",name:"basilic, origan"},{quantity:"",unit:"",name:"parmesan léger"}
    ],
    steps: [
      "Spiraliser les courgettes ou les couper en julienne fine. Saler légèrement et laisser dégorger 10 min.",
      "Faire revenir oignon et ail. Dorer le bœuf haché.",
      "Ajouter concentré, tomates, herbes. Mijoter 20 min à feu doux.",
      "Éponger les courgettes. Les poêler 2 min à feu vif — elles doivent rester al dente.",
      "Servir immédiatement avec la sauce bolognaise et le parmesan."
    ],
    chefTip: "Ne pas trop cuire les zoodles — 2 min max, sinon ils rendent de l'eau et deviennent mous. Ils doivent rester légèrement croquants.",
    childNote: "Mélange moitié courgettes, moitié vraies pâtes pour une transition en douceur."
  },
  {
    name: "Salade thaïe de poulet menthe",
    type: "déjeuner", cuisine: "Thaïlandaise", imageQuery: "Thai chicken salad mint herbs lime dressing healthy Asian",
    servings: 2, prepTime: "15 min", cookTime: "12 min", difficulty: "Facile",
    kcalPerPerson: 310, proteinPerPerson: 34, carbsPerPerson: 16, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"2",unit:"blancs",name:"de poulet"},{quantity:"1",unit:"",name:"carotte"},
      {quantity:"½",unit:"",name:"chou rouge"},{quantity:"1",unit:"",name:"concombre"},
      {quantity:"1",unit:"bouquet",name:"menthe fraîche"},{quantity:"1",unit:"bouquet",name:"coriandre"},
      {quantity:"50",unit:"g",name:"cacahuètes grillées"},{quantity:"2",unit:"c.à.s",name:"sauce poisson"},
      {quantity:"2",unit:"c.à.s",name:"jus de citron vert"},{quantity:"1",unit:"c.à.c",name:"sucre de palme"},
      {quantity:"1",unit:"",name:"piment rouge"}
    ],
    steps: [
      "Griller les blancs de poulet avec sel, poivre et gingembre. Laisser tiédir, effilocher à la fourchette.",
      "Couper carottes, chou et concombre en julienne fine.",
      "Préparer la vinaigrette : sauce poisson + citron vert + sucre + piment.",
      "Mélanger légumes, poulet effiloché et herbes fraîches.",
      "Ajouter la vinaigrette, mélanger délicatement.",
      "Parsemer de cacahuètes concassées."
    ],
    chefTip: "Cette salade est inspirée du laab thaï. L'effilochage du poulet (pas le découpage) est essentiel — il absorbe mieux la vinaigrette.",
    childNote: null
  },
  {
    name: "Bowl quinoa betterave grenade halloumi",
    type: "déjeuner", cuisine: "Méditerranéenne", imageQuery: "quinoa bowl beet pomegranate halloumi roasted healthy grain",
    servings: 2, prepTime: "15 min", cookTime: "20 min", difficulty: "Facile",
    kcalPerPerson: 420, proteinPerPerson: 20, carbsPerPerson: 44, diets: ["Végétarien","Sans gluten"],
    ingredients: [
      {quantity:"180",unit:"g",name:"quinoa"},{quantity:"2",unit:"",name:"betteraves cuites"},
      {quantity:"100",unit:"g",name:"halloumi"},{quantity:"80",unit:"g",name:"grains de grenade"},
      {quantity:"50",unit:"g",name:"roquette"},{quantity:"40",unit:"g",name:"noix"},
      {quantity:"2",unit:"c.à.s",name:"tahini"},{quantity:"1",unit:"",name:"citron"},
      {quantity:"1",unit:"c.à.s",name:"miel"},{quantity:"",unit:"",name:"graines de courge"}
    ],
    steps: [
      "Cuire le quinoa, laisser refroidir.",
      "Griller le halloumi en tranches dans une poêle sèche, 2 min par face.",
      "Couper les betteraves en dés.",
      "Préparer la sauce : tahini + jus de citron + miel + 2 c.à.s d'eau.",
      "Dresser le quinoa, betterave, roquette, halloumi grillé.",
      "Parsemer grenade, noix, graines de courge. Napper de sauce tahini-miel."
    ],
    chefTip: "Le halloumi ne fond pas à la cuisson — c'est sa particularité. Une poêle très chaude et sèche donne une belle croûte dorée en 2 min.",
    childNote: null
  },
  {
    name: "Wraps de laitue au poulet et avocat",
    type: "déjeuner", cuisine: "Américaine", imageQuery: "lettuce wrap chicken avocado healthy low carb Asian sauce",
    servings: 2, prepTime: "15 min", cookTime: "10 min", difficulty: "Facile",
    kcalPerPerson: 290, proteinPerPerson: 30, carbsPerPerson: 8, diets: ["Sans gluten","Keto"],
    ingredients: [
      {quantity:"300",unit:"g",name:"blanc de poulet émincé"},{quantity:"8",unit:"feuilles",name:"laitue beurre"},
      {quantity:"1",unit:"",name:"avocat"},{quantity:"1",unit:"",name:"carotte"},
      {quantity:"2",unit:"",name:"oignons nouveaux"},{quantity:"2",unit:"c.à.s",name:"sauce hoisin"},
      {quantity:"1",unit:"c.à.s",name:"sauce soja"},{quantity:"1",unit:"c.à.s",name:"gingembre râpé"},
      {quantity:"",unit:"",name:"graines de sésame"}
    ],
    steps: [
      "Faire sauter le poulet avec gingembre, sauce soja et hoisin 5 min.",
      "Préparer les garnitures : carotte râpée, avocat en dés, oignons ciselés.",
      "Déposer la garniture chaude dans les feuilles de laitue.",
      "Ajouter avocat et carotte, parsemer de sésame."
    ],
    chefTip: "La laitue beurre est idéale — ses feuilles forment un bol naturel. Ne les prépare pas à l'avance, elles ramollissent vite.",
    childNote: null
  },
  {
    name: "Soupe de carottes gingembre lait de coco",
    type: "déjeuner", cuisine: "Asiatique", imageQuery: "carrot ginger soup coconut milk healthy vegan bowl orange",
    servings: 4, prepTime: "10 min", cookTime: "25 min", difficulty: "Facile",
    kcalPerPerson: 190, proteinPerPerson: 3, carbsPerPerson: 24, diets: ["Végétarien","Vegan","Sans gluten"],
    ingredients: [
      {quantity:"800",unit:"g",name:"carottes"},{quantity:"1",unit:"morceau",name:"gingembre frais"},
      {quantity:"2",unit:"",name:"oignons"},{quantity:"2",unit:"gousses",name:"ail"},
      {quantity:"20",unit:"cl",name:"lait de coco"},{quantity:"70",unit:"cl",name:"bouillon de légumes"},
      {quantity:"1",unit:"c.à.c",name:"curcuma"},{quantity:"1",unit:"",name:"orange (jus)"},
      {quantity:"2",unit:"c.à.s",name:"huile de coco"}
    ],
    steps: [
      "Faire revenir oignons, ail et gingembre râpé dans l'huile de coco.",
      "Ajouter curcuma, puis carottes coupées en rondelles.",
      "Mouiller avec le bouillon, cuire 20 min jusqu'à ce que les carottes soient tendres.",
      "Mixer finement avec le lait de coco et le jus d'orange.",
      "Rectifier l'assaisonnement. Servir avec un filet de lait de coco et des graines de courge."
    ],
    chefTip: "Le jus d'orange en fin de cuisson avive la couleur et apporte une acidité qui équilibre le gingembre. Ne pas cuire avec le jus — ça fait tourner la crème.",
    childNote: "Très appréciée des enfants grâce à la douceur naturelle des carottes."
  },
  {
    name: "Salade tiède de lentilles saumon",
    type: "déjeuner", cuisine: "Française", imageQuery: "warm lentil salad smoked salmon vinaigrette healthy French",
    servings: 2, prepTime: "10 min", cookTime: "25 min", difficulty: "Facile",
    kcalPerPerson: 390, proteinPerPerson: 30, carbsPerPerson: 34, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"180",unit:"g",name:"lentilles vertes du Puy"},{quantity:"150",unit:"g",name:"saumon fumé"},
      {quantity:"2",unit:"",name:"carottes"},{quantity:"1",unit:"branche",name:"céleri"},
      {quantity:"1",unit:"",name:"échalote"},{quantity:"2",unit:"c.à.s",name:"moutarde à l'ancienne"},
      {quantity:"2",unit:"c.à.s",name:"vinaigre de cidre"},{quantity:"3",unit:"c.à.s",name:"huile d'olive"},
      {quantity:"",unit:"",name:"persil plat, ciboulette"}
    ],
    steps: [
      "Cuire les lentilles avec carottes et céleri dans de l'eau salée, 20-25 min. Égoutter.",
      "Préparer la vinaigrette : moutarde + vinaigre + huile + échalote ciselée.",
      "Assaisonner les lentilles encore tièdes avec la vinaigrette.",
      "Disposer dans les assiettes, déposer le saumon fumé par-dessus.",
      "Parsemer d'herbes."
    ],
    chefTip: "Les lentilles absorbent mieux la vinaigrette quand elles sont encore chaudes — assaisonne toujours une salade de légumineuses à chaud.",
    childNote: null
  },
  {
    name: "Soupe miso tofu wakamé",
    type: "déjeuner", cuisine: "Japonaise", imageQuery: "miso soup tofu wakame seaweed green onion Japanese healthy",
    servings: 2, prepTime: "5 min", cookTime: "10 min", difficulty: "Facile",
    kcalPerPerson: 120, proteinPerPerson: 10, carbsPerPerson: 8, diets: ["Végétarien","Vegan","Sans gluten"],
    ingredients: [
      {quantity:"80",unit:"cl",name:"bouillon dashi (ou légumes)"},{quantity:"2",unit:"c.à.s",name:"miso blanc (shiro)"},
      {quantity:"150",unit:"g",name:"tofu soyeux"},{quantity:"10",unit:"g",name:"wakamé séché"},
      {quantity:"2",unit:"",name:"oignons nouveaux"},{quantity:"1",unit:"c.à.s",name:"sauce soja"}
    ],
    steps: [
      "Réhydrater le wakamé 5 min dans l'eau froide.",
      "Chauffer le bouillon à feu doux — ne jamais faire bouillir.",
      "Délayer le miso dans un peu de bouillon chaud, incorporer au reste.",
      "Ajouter tofu coupé en dés, wakamé égoutté.",
      "Servir dans des bols, parsemer d'oignons nouveaux ciselés."
    ],
    chefTip: "Le miso ne doit jamais bouillir — la chaleur détruit les probiotiques et les arômes. Toujours incorporer en fin de cuisson hors du feu.",
    childNote: "Excellent pour les enfants — très léger et riche en protéines."
  },
  {
    name: "Salade de watermelon feta menthe",
    type: "déjeuner", cuisine: "Méditerranéenne", imageQuery: "watermelon feta mint salad summer healthy fresh Greek",
    servings: 4, prepTime: "10 min", cookTime: "0 min", difficulty: "Facile",
    kcalPerPerson: 160, proteinPerPerson: 6, carbsPerPerson: 20, diets: ["Végétarien","Sans gluten"],
    ingredients: [
      {quantity:"1",unit:"kg",name:"pastèque"},{quantity:"150",unit:"g",name:"feta"},
      {quantity:"½",unit:"bouquet",name:"menthe fraîche"},{quantity:"1",unit:"",name:"citron vert"},
      {quantity:"2",unit:"c.à.s",name:"huile d'olive"},{quantity:"",unit:"",name:"poivre noir"},
      {quantity:"",unit:"",name:"fleur de sel"}
    ],
    steps: [
      "Couper la pastèque en cubes ou triangles, enlever les pépins.",
      "Émietter la feta grossièrement.",
      "Disposer pastèque et feta dans un plat.",
      "Arroser d'huile d'olive et jus de citron vert.",
      "Parsemer de menthe déchirée, fleur de sel et poivre."
    ],
    chefTip: "Servir bien froid — mets la pastèque au frigo 2h avant. C'est une salade de contrastes : sucré/salé, froid/cremeux, croquant/fondant.",
    childNote: "Adorée des enfants."
  },
  {
    name: "Taboulé libanais persil citron",
    type: "déjeuner", cuisine: "Libanaise", imageQuery: "Lebanese tabbouleh parsley tomato bulgur lemon fresh healthy",
    servings: 4, prepTime: "20 min", cookTime: "5 min", difficulty: "Facile",
    kcalPerPerson: 180, proteinPerPerson: 5, carbsPerPerson: 24, diets: ["Végétarien","Vegan"],
    ingredients: [
      {quantity:"3",unit:"gros bouquets",name:"persil plat"},{quantity:"½",unit:"bouquet",name:"menthe"},
      {quantity:"3",unit:"",name:"tomates"},{quantity:"3",unit:"",name:"oignons nouveaux"},
      {quantity:"60",unit:"g",name:"boulgour fin"},{quantity:"4",unit:"c.à.s",name:"huile d'olive"},
      {quantity:"2",unit:"",name:"citrons (jus)"},{quantity:"",unit:"",name:"sel, poivre"}
    ],
    steps: [
      "Tremper le boulgour fin dans l'eau chaude 5 min, égoutter et presser.",
      "Ciseler finement persil et menthe (herbes = 80% du volume total).",
      "Couper tomates et oignons en très petits dés.",
      "Mélanger tous les ingrédients, assaisonner généreusement d'huile et citron.",
      "Laisser reposer 15 min — le boulgour absorbe les jus et les saveurs se mélangent."
    ],
    chefTip: "Le vrai taboulé libanais est à 80% de persil — pas de boulgour ! C'est l'inverse du taboulé français. Cisèle les herbes très finement au couteau.",
    childNote: null
  },
  {
    name: "Dahl de lentilles épinards coco",
    type: "déjeuner", cuisine: "Indienne", imageQuery: "dal lentil spinach coconut milk curry Indian healthy vegan",
    servings: 4, prepTime: "10 min", cookTime: "30 min", difficulty: "Facile",
    kcalPerPerson: 310, proteinPerPerson: 16, carbsPerPerson: 40, diets: ["Végétarien","Vegan","Sans gluten"],
    ingredients: [
      {quantity:"200",unit:"g",name:"lentilles corail"},{quantity:"200",unit:"g",name:"épinards frais"},
      {quantity:"1",unit:"boîte",name:"lait de coco"},{quantity:"2",unit:"",name:"oignons"},
      {quantity:"3",unit:"gousses",name:"ail"},{quantity:"1",unit:"morceau",name:"gingembre"},
      {quantity:"1",unit:"c.à.s",name:"garam masala"},{quantity:"1",unit:"c.à.c",name:"curcuma"},
      {quantity:"1",unit:"c.à.c",name:"cumin"},{quantity:"400",unit:"g",name:"tomates concassées"},
      {quantity:"",unit:"",name:"coriandre fraîche"}
    ],
    steps: [
      "Faire revenir oignons, ail et gingembre. Ajouter les épices, cuire 1 min.",
      "Ajouter tomates concassées, cuire 5 min.",
      "Incorporer lentilles rincées, lait de coco et 20 cl d'eau.",
      "Mijoter 25 min en remuant régulièrement — les lentilles doivent être fondantes.",
      "Ajouter les épinards en fin de cuisson, mélanger jusqu'à flétrissement.",
      "Servir avec du riz basmati ou du pain naan. Parsemer de coriandre."
    ],
    chefTip: "Le dahl est meilleur réchauffé — prépare-en pour 2 jours. En refroidissant, les lentilles épaississent la sauce naturellement.",
    childNote: "Réduis les épices et donne avec du riz blanc."
  },

  // ── Dîner healthy ─────────────────────────────
  {
    name: "Saumon en papillote légumes citron",
    type: "dîner", cuisine: "Française", imageQuery: "salmon en papillote vegetables lemon herbs healthy baked foil",
    servings: 4, prepTime: "10 min", cookTime: "20 min", difficulty: "Facile",
    kcalPerPerson: 310, proteinPerPerson: 36, carbsPerPerson: 10, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"4",unit:"pavés (150g)",name:"saumon"},{quantity:"2",unit:"",name:"courgettes"},
      {quantity:"2",unit:"",name:"carottes"},{quantity:"1",unit:"",name:"citron"},
      {quantity:"",unit:"",name:"thym, aneth"},{quantity:"2",unit:"c.à.s",name:"huile d'olive"},
      {quantity:"",unit:"",name:"sel, poivre"}
    ],
    steps: [
      "Préchauffer le four à 200 °C.",
      "Couper courgettes et carottes en julienne fine.",
      "Sur une grande feuille de papier sulfurisé, déposer les légumes, puis le pavé de saumon.",
      "Arroser d'huile d'olive, jus de citron, herbes, sel et poivre.",
      "Fermer hermétiquement la papillote.",
      "Cuire 18-20 min. Servir directement dans la papillote."
    ],
    chefTip: "La papillote crée un effet vapeur — le poisson reste parfaitement juteux sans matière grasse supplémentaire. C'est une cuisson saine sans compromis sur le goût.",
    childNote: "Les enfants adorent ouvrir leur propre papillote à table."
  },
  {
    name: "Poulet tandoori grillé au four",
    type: "dîner", cuisine: "Indienne", imageQuery: "chicken tandoori oven grilled yogurt marinade Indian healthy",
    servings: 4, prepTime: "15 min", cookTime: "30 min", difficulty: "Facile",
    kcalPerPerson: 280, proteinPerPerson: 40, carbsPerPerson: 6, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"700",unit:"g",name:"hauts de cuisse désossés"},{quantity:"150",unit:"g",name:"yaourt grec"},
      {quantity:"2",unit:"c.à.c",name:"cumin"},{quantity:"2",unit:"c.à.c",name:"coriandre moulue"},
      {quantity:"1",unit:"c.à.c",name:"paprika fumé"},{quantity:"1",unit:"c.à.c",name:"curcuma"},
      {quantity:"½",unit:"c.à.c",name:"piment de Cayenne"},{quantity:"3",unit:"gousses",name:"ail"},
      {quantity:"1",unit:"morceau",name:"gingembre"},{quantity:"1",unit:"",name:"citron vert"}
    ],
    steps: [
      "Entailler le poulet en profondeur pour que la marinade pénètre.",
      "Mélanger yaourt, épices, ail râpé, gingembre râpé et jus de citron vert.",
      "Enrober le poulet de marinade, couvrir et réfrigérer minimum 2h (idéalement une nuit).",
      "Préchauffer le four à 220 °C (gril).",
      "Poser sur une grille, cuire 25-30 min en retournant à mi-cuisson.",
      "Servir avec du pain naan, raïta et salade verte."
    ],
    chefTip: "La marinade au yaourt attendrit la viande grâce aux acides lactiques. Plus longue est la marinade, plus la chair est tendre et parfumée.",
    childNote: "Réduis le piment — le reste des épices est très doux."
  },
  {
    name: "Cabillaud vapeur gingembre sauce soja",
    type: "dîner", cuisine: "Asiatique", imageQuery: "steamed cod ginger soy sauce scallion healthy Asian fish",
    servings: 2, prepTime: "10 min", cookTime: "12 min", difficulty: "Facile",
    kcalPerPerson: 210, proteinPerPerson: 38, carbsPerPerson: 6, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"2",unit:"filets (180g)",name:"cabillaud"},{quantity:"3",unit:"cm",name:"gingembre frais"},
      {quantity:"3",unit:"c.à.s",name:"sauce soja"},{quantity:"1",unit:"c.à.s",name:"huile de sésame"},
      {quantity:"2",unit:"",name:"oignons nouveaux"},{quantity:"1",unit:"c.à.s",name:"vin de riz (ou xérès)"},
      {quantity:"1",unit:"c.à.c",name:"sucre"},{quantity:"1",unit:"piment",name:"rouge (optionnel)"}
    ],
    steps: [
      "Déposer les filets de cabillaud dans un panier vapeur ou sur une assiette au-dessus d'eau bouillante.",
      "Parsemer de gingembre en julienne. Cuire 10-12 min.",
      "Pendant ce temps, chauffer sauce soja, vin de riz, sucre et huile de sésame dans une petite casserole.",
      "Déposer les oignons nouveaux et piment sur le poisson cuit.",
      "Verser la sauce chaude (elle doit siffler au contact) sur les herbes — cela les parfume."
    ],
    chefTip: "Verser la sauce chaude sur les herbes fraîches directement sur le poisson — la chaleur libère tous les arômes en une seconde. C'est la technique des cantines cantonaises.",
    childNote: null
  },
  {
    name: "Patates douces farcies black beans avocat",
    type: "dîner", cuisine: "Mexicaine", imageQuery: "stuffed sweet potato black beans avocado healthy vegan filling",
    servings: 4, prepTime: "10 min", cookTime: "45 min", difficulty: "Facile",
    kcalPerPerson: 380, proteinPerPerson: 12, carbsPerPerson: 58, diets: ["Végétarien","Vegan","Sans gluten"],
    ingredients: [
      {quantity:"4",unit:"",name:"patates douces"},{quantity:"1",unit:"boîte",name:"haricots noirs"},
      {quantity:"2",unit:"",name:"avocats"},{quantity:"1",unit:"",name:"citron vert"},
      {quantity:"1",unit:"c.à.c",name:"cumin"},{quantity:"1",unit:"c.à.c",name:"paprika fumé"},
      {quantity:"",unit:"",name:"coriandre fraîche"},{quantity:"100",unit:"g",name:"yaourt nature"},
      {quantity:"",unit:"",name:"piment en poudre"}
    ],
    steps: [
      "Préchauffer le four à 200 °C. Percer les patates douces, enfourner 40-45 min.",
      "Égoutter et rincer les haricots noirs, les chauffer avec cumin et paprika.",
      "Écraser les avocats en guacamole express avec citron vert et sel.",
      "Ouvrir les patates en deux, creuser légèrement la chair.",
      "Garnir de haricots chauds, guacamole, yaourt et coriandre."
    ],
    chefTip: "Les patates douces au four caramélisent naturellement et développent un goût sucré intense. Perce-les profondément pour une cuisson à cœur homogène.",
    childNote: "Un repas complet que les enfants adorent faire eux-mêmes à table."
  },
  {
    name: "Boulettes de dinde sauce tomate légère",
    type: "dîner", cuisine: "Italienne", imageQuery: "turkey meatballs tomato sauce healthy lean protein dinner",
    servings: 4, prepTime: "15 min", cookTime: "25 min", difficulty: "Facile",
    kcalPerPerson: 320, proteinPerPerson: 34, carbsPerPerson: 20, diets: [],
    ingredients: [
      {quantity:"500",unit:"g",name:"viande de dinde hachée"},{quantity:"1",unit:"",name:"œuf"},
      {quantity:"30",unit:"g",name:"chapelure"},{quantity:"2",unit:"gousses",name:"ail"},
      {quantity:"",unit:"",name:"persil, basilic"},{quantity:"400",unit:"g",name:"tomates concassées"},
      {quantity:"1",unit:"c.à.s",name:"concentré de tomates"},{quantity:"1",unit:"",name:"oignon"},
      {quantity:"",unit:"",name:"origan, sel, poivre"}
    ],
    steps: [
      "Mélanger dinde, œuf, chapelure, ail râpé, persil et assaisonnement. Former des boulettes.",
      "Dorer les boulettes dans une poêle avec un peu d'huile sur toutes les faces.",
      "Faire revenir l'oignon dans la même poêle, ajouter tomates et concentré.",
      "Remettre les boulettes dans la sauce, mijoter 15 min à couvert.",
      "Servir avec des pâtes complètes ou des courgettes sautées."
    ],
    chefTip: "La dinde hachée est très maigre (3% de MG) — ajoute un peu d'huile d'olive à la farce pour éviter des boulettes sèches.",
    childNote: "Un grand classique des enfants. Prépare le double et congèle."
  },
  {
    name: "Poêlée de crevettes ail citron courgette",
    type: "dîner", cuisine: "Méditerranéenne", imageQuery: "shrimp garlic lemon zucchini pan healthy Mediterranean dinner",
    servings: 2, prepTime: "10 min", cookTime: "10 min", difficulty: "Facile",
    kcalPerPerson: 220, proteinPerPerson: 28, carbsPerPerson: 8, diets: ["Sans gluten","Keto"],
    ingredients: [
      {quantity:"300",unit:"g",name:"crevettes décortiquées"},{quantity:"2",unit:"",name:"courgettes"},
      {quantity:"3",unit:"gousses",name:"ail"},{quantity:"1",unit:"",name:"citron"},
      {quantity:"2",unit:"c.à.s",name:"huile d'olive"},{quantity:"",unit:"",name:"persil plat"},
      {quantity:"",unit:"",name:"piment d'Espelette"},{quantity:"",unit:"",name:"sel"}
    ],
    steps: [
      "Couper les courgettes en demi-lunes fines.",
      "Faire sauter les courgettes à feu vif 4 min, réserver.",
      "Saisir les crevettes 2 min dans l'huile avec l'ail émincé.",
      "Remettre les courgettes, ajouter le jus de citron, piment et persil.",
      "Cuire 1 min encore — les crevettes doivent être rosées."
    ],
    chefTip: "Un plat de 10 min qui fait illusion. La clé : feu très vif pour saisir, pas mijoter. Les crevettes sur-cuites deviennent caoutchouteuses en 30 secondes.",
    childNote: null
  },
  {
    name: "Curry de légumes racines anti-inflammatoire",
    type: "dîner", cuisine: "Indienne", imageQuery: "vegetable root curry turmeric anti-inflammatory healthy vegan",
    servings: 4, prepTime: "15 min", cookTime: "30 min", difficulty: "Facile",
    kcalPerPerson: 260, proteinPerPerson: 7, carbsPerPerson: 36, diets: ["Végétarien","Vegan","Sans gluten"],
    ingredients: [
      {quantity:"2",unit:"",name:"patates douces"},{quantity:"2",unit:"",name:"carottes"},
      {quantity:"1",unit:"",name:"panais"},{quantity:"1",unit:"boîte",name:"pois chiches"},
      {quantity:"1",unit:"boîte",name:"lait de coco"},{quantity:"2",unit:"c.à.c",name:"curcuma"},
      {quantity:"1",unit:"c.à.c",name:"gingembre en poudre"},{quantity:"1",unit:"c.à.c",name:"cannelle"},
      {quantity:"1",unit:"c.à.c",name:"poivre noir"},{quantity:"2",unit:"",name:"oignons"},
      {quantity:"",unit:"",name:"coriandre fraîche"}
    ],
    steps: [
      "Couper les légumes en cubes.",
      "Faire revenir les oignons, ajouter toutes les épices, cuire 1 min.",
      "Ajouter les légumes, enrober des épices.",
      "Verser le lait de coco et 10 cl d'eau, mijoter 20 min.",
      "Ajouter les pois chiches, cuire encore 5 min.",
      "Servir avec du riz brun et de la coriandre."
    ],
    chefTip: "Le poivre noir est essentiel avec le curcuma — il multiplie la biodisponibilité de la curcumine par 2000. Jamais l'un sans l'autre.",
    childNote: null
  },
  {
    name: "Steak de chou-fleur rôti sauce tahini",
    type: "dîner", cuisine: "Méditerranéenne", imageQuery: "cauliflower steak roasted tahini pomegranate herbs vegetarian",
    servings: 2, prepTime: "10 min", cookTime: "30 min", difficulty: "Facile",
    kcalPerPerson: 240, proteinPerPerson: 8, carbsPerPerson: 20, diets: ["Végétarien","Vegan","Sans gluten"],
    ingredients: [
      {quantity:"1",unit:"gros",name:"chou-fleur"},{quantity:"3",unit:"c.à.s",name:"huile d'olive"},
      {quantity:"1",unit:"c.à.c",name:"cumin"},{quantity:"1",unit:"c.à.c",name:"paprika fumé"},
      {quantity:"2",unit:"c.à.s",name:"tahini"},{quantity:"1",unit:"",name:"citron"},
      {quantity:"1",unit:"gousse",name:"ail"},{quantity:"",unit:"",name:"persil, sumac"},
      {quantity:"50",unit:"g",name:"grenade"}
    ],
    steps: [
      "Préchauffer le four à 220 °C.",
      "Couper le chou-fleur en tranches épaisses de 2 cm dans le sens de la hauteur.",
      "Badigeonner d'huile d'olive mélangée avec cumin et paprika.",
      "Rôtir 25-30 min sur une plaque, retourner à mi-cuisson.",
      "Préparer la sauce : tahini + jus de citron + ail râpé + eau pour détendre.",
      "Servir les steaks nappés de sauce, grenade, persil et sumac."
    ],
    chefTip: "À 220 °C, le chou-fleur caramélise et développe des saveurs de noisette grillée. Sous-estimé comme légume principal — il tient très bien la place d'une viande.",
    childNote: null
  },
  {
    name: "Dorade entière au four fenouil citron",
    type: "dîner", cuisine: "Méditerranéenne", imageQuery: "sea bream whole roasted fennel lemon herbs Mediterranean healthy",
    servings: 4, prepTime: "10 min", cookTime: "25 min", difficulty: "Facile",
    kcalPerPerson: 260, proteinPerPerson: 36, carbsPerPerson: 4, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"2",unit:"(500g pièce)",name:"dorades vidées"},{quantity:"2",unit:"",name:"fenouils"},
      {quantity:"2",unit:"",name:"citrons"},{quantity:"4",unit:"gousses",name:"ail"},
      {quantity:"4",unit:"c.à.s",name:"huile d'olive"},{quantity:"",unit:"",name:"thym, romarin"},
      {quantity:"",unit:"",name:"sel, poivre"},{quantity:"10",unit:"cl",name:"vin blanc"}
    ],
    steps: [
      "Préchauffer le four à 200 °C.",
      "Émincer les fenouils, les disposer dans le plat avec l'ail et les herbes.",
      "Inciser les dorades en diagonale des deux côtés. Assaisonner.",
      "Glisser du citron et des herbes dans la cavité.",
      "Poser sur le lit de fenouil, arroser d'huile et de vin blanc.",
      "Rôtir 20-25 min selon la taille — la chair se détache de l'arête."
    ],
    chefTip: "Les incisions permettent aux arômes de pénétrer et accélèrent la cuisson. Compte 10 min de cuisson par cm d'épaisseur du poisson.",
    childNote: null
  },
  {
    name: "Frittata aux légumes de saison",
    type: "dîner", cuisine: "Italienne", imageQuery: "frittata vegetables eggs spinach bell pepper Italian healthy baked",
    servings: 4, prepTime: "10 min", cookTime: "20 min", difficulty: "Facile",
    kcalPerPerson: 220, proteinPerPerson: 16, carbsPerPerson: 8, diets: ["Végétarien","Sans gluten","Keto"],
    ingredients: [
      {quantity:"8",unit:"",name:"œufs"},{quantity:"1",unit:"",name:"poivron rouge"},
      {quantity:"100",unit:"g",name:"épinards frais"},{quantity:"1",unit:"",name:"courgette"},
      {quantity:"100",unit:"g",name:"feta"},{quantity:"1",unit:"",name:"oignon"},
      {quantity:"2",unit:"c.à.s",name:"huile d'olive"},{quantity:"",unit:"",name:"basilic, sel, poivre"},
      {quantity:"2",unit:"c.à.s",name:"parmesan râpé"}
    ],
    steps: [
      "Préchauffer le four à 180 °C.",
      "Faire revenir oignon, poivron et courgette dans une poêle allant au four 5 min.",
      "Ajouter les épinards, cuire 2 min jusqu'à flétrissement.",
      "Battre les œufs avec sel, poivre et basilic. Verser sur les légumes.",
      "Émietter la feta, parsemer de parmesan.",
      "Cuire sur le feu 2 min (les bords prennent), puis au four 12 min."
    ],
    chefTip: "La frittata est l'omelette qu'on finit au four — jamais pliée. Elle se mange chaude, tiède ou froide. Parfaite pour les box repas du lendemain.",
    childNote: null
  },
  {
    name: "Poulet vapeur sauce citronnelle gingembre",
    type: "dîner", cuisine: "Vietnamienne", imageQuery: "steamed chicken lemongrass ginger Vietnamese healthy light dinner",
    servings: 4, prepTime: "15 min", cookTime: "25 min", difficulty: "Facile",
    kcalPerPerson: 220, proteinPerPerson: 38, carbsPerPerson: 6, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"700",unit:"g",name:"blancs de poulet"},{quantity:"2",unit:"tiges",name:"citronnelle"},
      {quantity:"3",unit:"cm",name:"gingembre frais"},{quantity:"3",unit:"gousses",name:"ail"},
      {quantity:"2",unit:"c.à.s",name:"sauce poisson"},{quantity:"1",unit:"",name:"citron vert"},
      {quantity:"1",unit:"c.à.s",name:"sucre de canne"},{quantity:"",unit:"",name:"coriandre et menthe"},
      {quantity:"1",unit:"",name:"piment rouge (optionnel)"}
    ],
    steps: [
      "Écraser la citronnelle et la disposer dans le panier vapeur.",
      "Poser le poulet sur la citronnelle avec le gingembre tranché.",
      "Cuire à la vapeur 22-25 min jusqu'à 75 °C à cœur.",
      "Préparer la sauce : sauce poisson + jus de citron vert + sucre + ail + piment.",
      "Trancher le poulet, servir avec riz jasmin, herbes fraîches et sauce."
    ],
    chefTip: "Cuire le poulet sur la citronnelle (pas dans l'eau) — la vapeur parfumée pénètre la chair. Le résultat est infiniment plus aromatique que la cuisson à l'eau.",
    childNote: "Supprime la sauce poisson et le piment, remplace par sauce soja douce."
  },
  {
    name: "Brochettes de poulet marinade yaourt harissa",
    type: "dîner", cuisine: "Maghrébine", imageQuery: "chicken skewers yogurt harissa marinade grilled healthy kebab",
    servings: 4, prepTime: "15 min", cookTime: "15 min", difficulty: "Facile",
    kcalPerPerson: 270, proteinPerPerson: 38, carbsPerPerson: 8, diets: ["Sans gluten"],
    ingredients: [
      {quantity:"700",unit:"g",name:"blancs de poulet"},{quantity:"150",unit:"g",name:"yaourt grec"},
      {quantity:"1",unit:"c.à.s",name:"harissa"},{quantity:"2",unit:"gousses",name:"ail"},
      {quantity:"1",unit:"",name:"citron"},{quantity:"1",unit:"c.à.c",name:"cumin"},
      {quantity:"1",unit:"c.à.c",name:"coriandre moulue"},{quantity:"",unit:"",name:"persil"},
      {quantity:"",unit:"",name:"sel, poivre"}
    ],
    steps: [
      "Couper le poulet en cubes de 3 cm.",
      "Mélanger yaourt, harissa, ail râpé, épices, jus de citron et sel.",
      "Mariner le poulet minimum 1h (mieux : une nuit).",
      "Monter sur des brochettes, cuire au gril ou à la plancha 12-15 min en tournant.",
      "Servir avec salade verte, sauce yaourt à la menthe et pain pita."
    ],
    chefTip: "Le yaourt dans la marinade attendrit la viande et crée une belle croûte légèrement carbonisée à la cuisson. C'est la technique des kebabs moyen-orientaux.",
    childNote: "Divise la harissa par 3 pour les enfants."
  },
  {
    name: "Soupe de poireaux détox légère",
    type: "dîner", cuisine: "Française", imageQuery: "leek soup detox light healthy green vegan French simple",
    servings: 4, prepTime: "10 min", cookTime: "25 min", difficulty: "Facile",
    kcalPerPerson: 110, proteinPerPerson: 4, carbsPerPerson: 12, diets: ["Végétarien","Vegan","Sans gluten"],
    ingredients: [
      {quantity:"4",unit:"",name:"poireaux"},{quantity:"2",unit:"",name:"pommes de terre"},
      {quantity:"1",unit:"",name:"oignon"},{quantity:"1",unit:"L",name:"bouillon de légumes"},
      {quantity:"2",unit:"c.à.s",name:"huile d'olive"},{quantity:"",unit:"",name:"ciboulette"},
      {quantity:"",unit:"",name:"sel, poivre"},{quantity:"1",unit:"",name:"citron"}
    ],
    steps: [
      "Laver et émincer les poireaux (blancs et vert tendre).",
      "Faire fondre poireaux et oignon dans l'huile 10 min sans coloration.",
      "Ajouter pommes de terre en dés et bouillon. Cuire 15 min.",
      "Mixer finement. Ajouter un filet de jus de citron.",
      "Rectifier assaisonnement, servir avec ciboulette."
    ],
    chefTip: "Les poireaux ont des propriétés diurétiques naturelles. Cette soupe est la base de nombreuses cures détox — simple, légère, mais vraiment rassasiante.",
    childNote: "Un classique que les enfants acceptent bien grâce à la douceur des poireaux."
  },
  {
    name: "Salade de quinoa noir betterave feta",
    type: "dîner", cuisine: "Américaine", imageQuery: "black quinoa salad roasted beet feta arugula healthy grain",
    servings: 4, prepTime: "15 min", cookTime: "15 min", difficulty: "Facile",
    kcalPerPerson: 340, proteinPerPerson: 12, carbsPerPerson: 38, diets: ["Végétarien","Sans gluten"],
    ingredients: [
      {quantity:"200",unit:"g",name:"quinoa (blanc ou tri-color)"},{quantity:"3",unit:"",name:"betteraves cuites"},
      {quantity:"100",unit:"g",name:"feta"},{quantity:"80",unit:"g",name:"roquette"},
      {quantity:"50",unit:"g",name:"noix"},{quantity:"2",unit:"c.à.s",name:"vinaigre balsamique"},
      {quantity:"3",unit:"c.à.s",name:"huile d'olive"},{quantity:"1",unit:"c.à.c",name:"miel"},
      {quantity:"",unit:"",name:"graines de citrouille"}
    ],
    steps: [
      "Cuire le quinoa 12 min dans de l'eau salée. Refroidir.",
      "Couper les betteraves en dés.",
      "Préparer la vinaigrette : huile d'olive + vinaigre balsamique + miel + sel.",
      "Mélanger quinoa, betteraves et roquette.",
      "Ajouter la vinaigrette, émietter la feta par-dessus.",
      "Parsemer noix et graines de citrouille."
    ],
    chefTip: "Ajoute la roquette au dernier moment — elle fane vite avec la vinaigrette chaude. Et garde un peu de vinaigrette à part pour les amateurs de sauce.",
    childNote: null
  },
  {
    name: "Tacos de poisson grillé salsa avocat",
    type: "dîner", cuisine: "Mexicaine", imageQuery: "fish tacos grilled white fish salsa avocado cabbage healthy",
    servings: 4, prepTime: "20 min", cookTime: "10 min", difficulty: "Facile",
    kcalPerPerson: 360, proteinPerPerson: 28, carbsPerPerson: 32, diets: [],
    ingredients: [
      {quantity:"500",unit:"g",name:"filet de cabillaud ou tilapia"},{quantity:"8",unit:"",name:"petites tortillas"},
      {quantity:"2",unit:"",name:"avocats"},{quantity:"200",unit:"g",name:"chou blanc"},
      {quantity:"2",unit:"",name:"tomates"},{quantity:"1",unit:"",name:"oignon rouge"},
      {quantity:"",unit:"",name:"coriandre fraîche"},{quantity:"2",unit:"",name:"citrons verts"},
      {quantity:"1",unit:"c.à.c",name:"cumin"},{quantity:"1",unit:"c.à.c",name:"paprika"},
      {quantity:"",unit:"",name:"crème légère ou yaourt"}
    ],
    steps: [
      "Assaisonner le poisson avec cumin, paprika, sel, poivre et huile d'olive.",
      "Griller à la poêle 3 min par face. Émietter en morceaux.",
      "Préparer la salsa : tomates + oignon rouge + coriandre + jus de citron vert.",
      "Écraser l'avocat en guacamole express.",
      "Émincer finement le chou.",
      "Chauffer les tortillas. Garnir avec chou, poisson, guacamole, salsa et crème."
    ],
    chefTip: "Le chou finement émincé est indispensable dans un vrai fish taco — il apporte le croquant et la fraîcheur qui équilibrent le poisson grillé.",
    childNote: "Les enfants adorent garnir eux-mêmes leurs tacos."
  },
  {
    name: "Légumes rôtis et feta au four",
    type: "dîner", cuisine: "Méditerranéenne", imageQuery: "roasted Mediterranean vegetables feta herb healthy vegan sheet pan",
    servings: 4, prepTime: "15 min", cookTime: "35 min", difficulty: "Facile",
    kcalPerPerson: 280, proteinPerPerson: 10, carbsPerPerson: 28, diets: ["Végétarien","Sans gluten"],
    ingredients: [
      {quantity:"1",unit:"",name:"aubergine"},{quantity:"2",unit:"",name:"courgettes"},
      {quantity:"2",unit:"",name:"poivrons"},{quantity:"200",unit:"g",name:"tomates cerises"},
      {quantity:"200",unit:"g",name:"feta"},{quantity:"4",unit:"gousses",name:"ail"},
      {quantity:"4",unit:"c.à.s",name:"huile d'olive"},{quantity:"",unit:"",name:"thym, origan, basilic"},
      {quantity:"",unit:"",name:"sel, poivre"}
    ],
    steps: [
      "Préchauffer le four à 200 °C.",
      "Couper les légumes en morceaux de 3 cm.",
      "Disposer sur une grande plaque, ajouter ail et herbes, arroser d'huile.",
      "Poser le bloc de feta entier au centre.",
      "Rôtir 30-35 min jusqu'à ce que les légumes soient confits et la feta dorée.",
      "Écraser la feta fondue sur les légumes, servir avec pain pita ou quinoa."
    ],
    chefTip: "La feta en bloc fond partiellement et devient crémeuse au four — bien meilleure que la feta émiettée à froid. Technique popularisée par la feta au four finlandaise.",
    childNote: null
  },
  {
    name: "Bar en croûte de sel herbes fraîches",
    type: "dîner", cuisine: "Méditerranéenne", imageQuery: "sea bass salt crust herbs baked whole fish Mediterranean",
    servings: 4, prepTime: "15 min", cookTime: "30 min", difficulty: "Moyen",
    kcalPerPerson: 230, proteinPerPerson: 40, carbsPerPerson: 2, diets: ["Sans gluten"],
    coutParPersonne: 8.00, niveauBudget: "premium",
    economieTip: "La croûte de sel fonctionne aussi avec du lieu jaune ou de la truite saumonée à moitié prix.",
    ingredients: [
      {quantity:"1",unit:"(1.2 kg)",name:"bar entier vidé"},{quantity:"1",unit:"kg",name:"gros sel"},
      {quantity:"3",unit:"blancs",name:"d'œuf"},{quantity:"",unit:"",name:"thym, romarin, laurier"},
      {quantity:"1",unit:"",name:"citron"},{quantity:"4",unit:"gousses",name:"ail"},
      {quantity:"2",unit:"c.à.s",name:"huile d'olive"},{quantity:"",unit:"",name:"fenouil frais"}
    ],
    steps: [
      "Préchauffer le four à 220 °C.",
      "Farcir la cavité du bar avec les herbes, l'ail et le citron.",
      "Mélanger le gros sel avec les blancs d'œuf pour former une pâte.",
      "Étaler une couche de sel dans le plat, déposer le poisson, couvrir entièrement de sel.",
      "Cuire 25-30 min.",
      "Casser la croûte à table — le poisson est parfaitement cuit à la vapeur à l'intérieur."
    ],
    chefTip: "La croûte de sel cuit le poisson à la vapeur de ses propres jus — aucune matière grasse, saveur concentrée, texture parfaite. Le sel ne sale pas le poisson — il le protège.",
    childNote: null
  },

  // ─────────────────────────────────────────────
  // PETIT BUDGET (< 2 €/personne)
  // ─────────────────────────────────────────────
  {
    name: "Soupe de lentilles corail et cumin",
    type: "déjeuner", cuisine: "Moyen-Orient", imageQuery: "red lentil soup cumin turmeric healthy bowl",
    servings: 4, prepTime: "10 min", cookTime: "25 min", difficulty: "Facile",
    kcalPerPerson: 210, proteinPerPerson: 12, carbsPerPerson: 34, diets: ["Vegan","Sans gluten"],
    coutParPersonne: 0.70, niveauBudget: "économique", economieTip: null,
    ingredients: [
      {quantity:"300",unit:"g",name:"lentilles corail"},{quantity:"1",unit:"",name:"oignon"},
      {quantity:"2",unit:"gousses",name:"ail"},{quantity:"1",unit:"c.à.c",name:"cumin moulu"},
      {quantity:"1",unit:"c.à.c",name:"curcuma"},{quantity:"1",unit:"c.à.c",name:"paprika doux"},
      {quantity:"1",unit:"litre",name:"bouillon de légumes"},{quantity:"2",unit:"c.à.s",name:"huile d'olive"},
      {quantity:"1",unit:"",name:"citron"},{quantity:"",unit:"",name:"coriandre fraîche"}
    ],
    steps: [
      "Faire revenir l'oignon émincé dans l'huile à feu moyen, 5 min jusqu'à translucidité.",
      "Ajouter l'ail et les épices, cuire 1 min en remuant.",
      "Rincer les lentilles et les ajouter avec le bouillon. Porter à ébullition.",
      "Réduire le feu et cuire 20 min jusqu'à ce que les lentilles soient très tendres.",
      "Mixer partiellement ou totalement selon la texture souhaitée.",
      "Servir avec un filet de jus de citron et de la coriandre fraîche."
    ],
    chefTip: "Les lentilles corail n'ont pas besoin de trempage — gain de temps précieux. Le cumin torréfié à sec 30 secondes avant de l'ajouter décuple son arôme.",
    childNote: "Réduis le cumin à ½ c.à.c pour les petits."
  },
  {
    name: "Riz sauté aux légumes et œuf",
    type: "déjeuner", cuisine: "Asiatique", imageQuery: "fried rice egg vegetables wok soy sauce",
    servings: 2, prepTime: "10 min", cookTime: "10 min", difficulty: "Facile",
    kcalPerPerson: 380, proteinPerPerson: 14, carbsPerPerson: 58, diets: [],
    coutParPersonne: 0.80, niveauBudget: "économique", economieTip: "Idéal pour utiliser les restes de riz et les légumes de la veille.",
    ingredients: [
      {quantity:"300",unit:"g",name:"riz cuit de la veille"},{quantity:"2",unit:"",name:"œufs"},
      {quantity:"1",unit:"",name:"carotte"},{quantity:"2",unit:"",name:"oignons nouveaux"},
      {quantity:"100",unit:"g",name:"petits pois surgelés"},{quantity:"2",unit:"c.à.s",name:"sauce soja"},
      {quantity:"1",unit:"c.à.s",name:"huile de sésame"},{quantity:"1",unit:"c.à.c",name:"gingembre râpé"},
      {quantity:"2",unit:"c.à.s",name:"huile neutre"}
    ],
    steps: [
      "Chauffer l'huile à feu très vif dans un wok ou une grande poêle.",
      "Faire sauter la carotte en dés et les petits pois 3 min.",
      "Pousser les légumes sur les côtés, casser les œufs au centre et brouiller rapidement.",
      "Ajouter le riz froid et la sauce soja, mélanger vigoureusement 2-3 min à feu vif.",
      "Incorporer le gingembre et les oignons nouveaux ciselés.",
      "Finir avec l'huile de sésame hors du feu."
    ],
    chefTip: "Le riz doit être froid et sec de la veille — le riz frais colle et absorbe trop d'huile. Ce plat se fait en 10 minutes avec des restes.",
    childNote: "Remplace la sauce soja par une sauce soja sucrée pour les enfants."
  },
  {
    name: "Gratin de pâtes au fromage",
    type: "dîner", cuisine: "Française", imageQuery: "pasta cheese gratin golden crust baked macaroni",
    servings: 4, prepTime: "15 min", cookTime: "25 min", difficulty: "Facile",
    kcalPerPerson: 420, proteinPerPerson: 16, carbsPerPerson: 55, diets: ["Végétarien"],
    coutParPersonne: 1.20, niveauBudget: "économique", economieTip: null,
    ingredients: [
      {quantity:"300",unit:"g",name:"pâtes courtes (rigatoni, penne)"},{quantity:"40",unit:"g",name:"beurre"},
      {quantity:"40",unit:"g",name:"farine"},{quantity:"50",unit:"cl",name:"lait"},
      {quantity:"100",unit:"g",name:"gruyère râpé"},{quantity:"50",unit:"g",name:"parmesan râpé"},
      {quantity:"1",unit:"pincée",name:"noix de muscade"},{quantity:"",unit:"",name:"sel, poivre"},
      {quantity:"30",unit:"g",name:"chapelure"}
    ],
    steps: [
      "Cuire les pâtes al dente, égoutter et réserver.",
      "Préparer la béchamel : faire fondre le beurre, ajouter la farine et cuire 1 min. Incorporer le lait chaud progressivement en fouettant jusqu'à épaississement.",
      "Ajouter les ¾ du gruyère et tout le parmesan à la béchamel hors du feu. Assaisonner avec muscade, sel et poivre.",
      "Mélanger les pâtes et la béchamel fromagée.",
      "Verser dans un plat beurré, parsemer du reste de gruyère et de chapelure.",
      "Gratiner au four à 200 °C (gril) 15-20 min jusqu'à coloration dorée."
    ],
    chefTip: "La clé d'un gratin réussi : béchamel bien assaisonnée et gril final à haute température pour la croûte dorée et croustillante.",
    childNote: "Un classique adoré des enfants — peut se préparer à l'avance et réchauffer."
  },
  {
    name: "Poêlée de pommes de terre et lardons",
    type: "dîner", cuisine: "Française", imageQuery: "potato lardon pan fried crispy potatoes bacon skillet",
    servings: 4, prepTime: "10 min", cookTime: "25 min", difficulty: "Facile",
    kcalPerPerson: 390, proteinPerPerson: 14, carbsPerPerson: 42, diets: ["Sans gluten"],
    coutParPersonne: 1.40, niveauBudget: "économique", economieTip: null,
    ingredients: [
      {quantity:"800",unit:"g",name:"pommes de terre (type Grenaille ou Charlotte)"},
      {quantity:"200",unit:"g",name:"lardons fumés"},{quantity:"1",unit:"",name:"oignon"},
      {quantity:"2",unit:"gousses",name:"ail"},{quantity:"2",unit:"branches",name:"thym"},
      {quantity:"2",unit:"c.à.s",name:"huile"},{quantity:"",unit:"",name:"persil plat"},
      {quantity:"",unit:"",name:"sel, poivre"}
    ],
    steps: [
      "Couper les pommes de terre en dés de 2 cm. Les faire cuire à l'eau salée 10 min — elles doivent rester légèrement fermes.",
      "Égoutter et laisser sécher 5 min.",
      "Faire dorer les lardons à sec dans une grande poêle. Réserver.",
      "Dans le gras des lardons, faire sauter les pommes de terre à feu vif 10-12 min en retournant peu pour former une croûte.",
      "Ajouter oignon émincé et ail à mi-cuisson.",
      "Remettre les lardons, ajouter thym et persil. Rectifier l'assaisonnement."
    ],
    chefTip: "Le secret : pré-cuire les pommes de terre à l'eau, les sécher et les saisir à feu VIF avec peu de mouvements — c'est ce qui crée la croûte dorée.",
    childNote: null
  },
  {
    name: "Omelette aux champignons",
    type: "déjeuner", cuisine: "Française", imageQuery: "mushroom omelette golden french omelette pan herbs",
    servings: 2, prepTime: "5 min", cookTime: "10 min", difficulty: "Facile",
    kcalPerPerson: 280, proteinPerPerson: 18, carbsPerPerson: 4, diets: ["Végétarien","Sans gluten"],
    coutParPersonne: 1.30, niveauBudget: "économique", economieTip: null,
    ingredients: [
      {quantity:"4",unit:"",name:"œufs"},{quantity:"200",unit:"g",name:"champignons de Paris"},
      {quantity:"20",unit:"g",name:"beurre"},{quantity:"2",unit:"c.à.s",name:"crème fraîche"},
      {quantity:"",unit:"",name:"persil plat ciselé"},{quantity:"1",unit:"gousse",name:"ail"},
      {quantity:"",unit:"",name:"sel, poivre"}
    ],
    steps: [
      "Émincer les champignons et les faire sauter à feu vif avec la moitié du beurre et l'ail. Saler en fin de cuisson. Réserver.",
      "Battre les œufs avec la crème fraîche, sel et poivre.",
      "Chauffer le reste du beurre dans la poêle à feu moyen-vif jusqu'à mousse.",
      "Verser les œufs et mélanger rapidement avec une spatule en créant des petits mouvements.",
      "Arrêter de mélanger quand les œufs sont presque pris mais encore brillants.",
      "Déposer les champignons au centre, replier l'omelette en deux. Servir aussitôt."
    ],
    chefTip: "L'omelette française ne doit pas brunir — feu vif au début puis réduction. Elle doit rester baveuse à cœur et dorée en surface.",
    childNote: null
  },
  {
    name: "Tarte rustique aux poireaux",
    type: "déjeuner", cuisine: "Française", imageQuery: "rustic leek tart galette pastry golden baked",
    servings: 4, prepTime: "15 min", cookTime: "35 min", difficulty: "Facile",
    kcalPerPerson: 310, proteinPerPerson: 9, carbsPerPerson: 35, diets: ["Végétarien"],
    coutParPersonne: 1.50, niveauBudget: "économique", economieTip: null,
    ingredients: [
      {quantity:"1",unit:"rouleau",name:"pâte brisée"},{quantity:"3",unit:"",name:"poireaux"},
      {quantity:"150",unit:"g",name:"fromage frais (type St-Môret ou ricotta)"},{quantity:"2",unit:"",name:"œufs"},
      {quantity:"10",unit:"cl",name:"crème liquide"},{quantity:"30",unit:"g",name:"beurre"},
      {quantity:"",unit:"",name:"noix de muscade"},{quantity:"",unit:"",name:"sel, poivre"},
      {quantity:"30",unit:"g",name:"gruyère râpé"}
    ],
    steps: [
      "Préchauffer le four à 180 °C.",
      "Émincer les poireaux (blanc et vert tendre). Les faire fondre dans le beurre à feu doux, 10-12 min. Saler.",
      "Mélanger fromage frais, œufs, crème, muscade, sel et poivre.",
      "Étaler la pâte dans le moule, piquer le fond. Répartir les poireaux refroidis.",
      "Verser l'appareil fromage-crème dessus, parsemer de gruyère.",
      "Cuire 30-35 min jusqu'à prise et coloration dorée."
    ],
    chefTip: "Les poireaux doivent être bien fondus et sans eau — sinon la tarte sera liquide. Cuire à couvert puis découvrir 5 min pour évaporer l'eau.",
    childNote: null
  },
  {
    name: "Salade de pois chiches et tomates",
    type: "déjeuner", cuisine: "Méditerranéenne", imageQuery: "chickpea tomato salad fresh herbs olive oil Mediterranean",
    servings: 4, prepTime: "10 min", cookTime: "0 min", difficulty: "Facile",
    kcalPerPerson: 240, proteinPerPerson: 11, carbsPerPerson: 32, diets: ["Vegan","Sans gluten"],
    coutParPersonne: 0.90, niveauBudget: "économique", economieTip: null,
    ingredients: [
      {quantity:"2",unit:"boîtes (240g égouttés)",name:"pois chiches"},{quantity:"3",unit:"",name:"tomates"},
      {quantity:"½",unit:"",name:"concombre"},{quantity:"½",unit:"",name:"oignon rouge"},
      {quantity:"1",unit:"bouquet",name:"persil plat"},{quantity:"1",unit:"bouquet",name:"menthe fraîche"},
      {quantity:"3",unit:"c.à.s",name:"huile d'olive"},{quantity:"2",unit:"c.à.s",name:"jus de citron"},
      {quantity:"1",unit:"c.à.c",name:"cumin"},{quantity:"",unit:"",name:"sel, poivre"}
    ],
    steps: [
      "Rincer et égoutter les pois chiches.",
      "Couper les tomates en dés, le concombre en demi-lunes, l'oignon rouge finement.",
      "Ciseler le persil et la menthe.",
      "Mélanger tous les ingrédients dans un grand saladier.",
      "Assaisonner avec l'huile d'olive, le jus de citron, le cumin, sel et poivre.",
      "Laisser reposer 15 min avant de servir pour que les saveurs se mélangent."
    ],
    chefTip: "Cette salade est meilleure préparée 30 min à l'avance. Elle se conserve 2 jours au frigo et est encore meilleure le lendemain.",
    childNote: null
  },
  {
    name: "Minestrone de légumes d'hiver",
    type: "déjeuner", cuisine: "Italienne", imageQuery: "minestrone soup winter vegetables pasta beans rustic",
    servings: 6, prepTime: "20 min", cookTime: "35 min", difficulty: "Facile",
    kcalPerPerson: 220, proteinPerPerson: 9, carbsPerPerson: 35, diets: ["Vegan"],
    coutParPersonne: 1.00, niveauBudget: "économique", economieTip: "Utilise les légumes de saison les moins chers — ce potage s'adapte à tout.",
    ingredients: [
      {quantity:"2",unit:"",name:"carottes"},{quantity:"2",unit:"branches",name:"céleri"},
      {quantity:"1",unit:"",name:"oignon"},{quantity:"2",unit:"gousses",name:"ail"},
      {quantity:"1",unit:"boîte",name:"tomates concassées"},{quantity:"1",unit:"boîte",name:"haricots blancs"},
      {quantity:"100",unit:"g",name:"petites pâtes (ditalini, vermicelles)"},{quantity:"1",unit:"",name:"courgette"},
      {quantity:"100",unit:"g",name:"épinards frais"},{quantity:"1.5",unit:"L",name:"bouillon de légumes"},
      {quantity:"3",unit:"c.à.s",name:"huile d'olive"},{quantity:"",unit:"",name:"basilic, parmesan"}
    ],
    steps: [
      "Faire revenir oignon, carottes et céleri en dés dans l'huile, 5 min.",
      "Ajouter l'ail émincé, les tomates concassées et le bouillon. Porter à ébullition.",
      "Ajouter courgette en dés et haricots rincés. Cuire 15 min.",
      "Ajouter les pâtes, cuire le temps indiqué sur l'emballage.",
      "En fin de cuisson, ajouter les épinards et laisser fondre 2 min.",
      "Servir avec un filet d'huile d'olive et du parmesan râpé."
    ],
    chefTip: "Le minestrone est meilleur réchauffé le lendemain. Ajoute les pâtes à la dernière minute pour éviter qu'elles n'absorbent tout le bouillon.",
    childNote: "Émincez finement les légumes — les enfants acceptent mieux les petits morceaux."
  },
  {
    name: "Galettes de flocons d'avoine",
    type: "petit-déjeuner", cuisine: "Nordique", imageQuery: "oatmeal pancakes breakfast galettes healthy oats golden",
    servings: 4, prepTime: "5 min", cookTime: "15 min", difficulty: "Facile",
    kcalPerPerson: 260, proteinPerPerson: 9, carbsPerPerson: 38, diets: ["Végétarien"],
    coutParPersonne: 0.40, niveauBudget: "économique", economieTip: null,
    ingredients: [
      {quantity:"200",unit:"g",name:"flocons d'avoine"},{quantity:"2",unit:"",name:"œufs"},
      {quantity:"20",unit:"cl",name:"lait"},{quantity:"1",unit:"c.à.s",name:"miel ou sucre"},
      {quantity:"1",unit:"pincée",name:"sel"},{quantity:"1",unit:"c.à.c",name:"levure chimique"},
      {quantity:"1",unit:"c.à.c",name:"cannelle"},{quantity:"20",unit:"g",name:"beurre"}
    ],
    steps: [
      "Mixer les flocons d'avoine en farine grossière au blender (10 sec).",
      "Mélanger avec les œufs, le lait, le miel, le sel, la levure et la cannelle.",
      "Laisser reposer 5 min — la pâte épaissit légèrement.",
      "Cuire dans une poêle légèrement beurrée à feu moyen, 2-3 min par face.",
      "Servir avec du miel, des fruits frais ou du yaourt."
    ],
    chefTip: "Ces galettes sont plus nutritives que des crêpes classiques grâce aux flocons d'avoine. La pâte se prépare en 5 minutes avec des ingrédients de placard.",
    childNote: null
  },
  {
    name: "Soupe à l'oignon paysanne",
    type: "dîner", cuisine: "Française", imageQuery: "French onion soup peasant style bread cheese bowl rustic",
    servings: 4, prepTime: "10 min", cookTime: "40 min", difficulty: "Facile",
    kcalPerPerson: 220, proteinPerPerson: 8, carbsPerPerson: 28, diets: ["Végétarien"],
    coutParPersonne: 0.90, niveauBudget: "économique", economieTip: "Version simplifiée sans vin — le résultat est savoureux grâce à la longue caramélisation des oignons.",
    ingredients: [
      {quantity:"6",unit:"",name:"oignons"},{quantity:"40",unit:"g",name:"beurre"},
      {quantity:"1",unit:"c.à.s",name:"sucre"},{quantity:"1",unit:"L",name:"bouillon de légumes ou bœuf"},
      {quantity:"",unit:"",name:"thym, laurier"},{quantity:"4",unit:"tranches",name:"pain rassis"},
      {quantity:"80",unit:"g",name:"gruyère râpé"},{quantity:"",unit:"",name:"sel, poivre"}
    ],
    steps: [
      "Émincer finement les oignons.",
      "Les faire fondre dans le beurre à feu très doux, 25-30 min en remuant souvent, jusqu'à caramélisation dorée.",
      "Ajouter le sucre les 5 dernières minutes pour intensifier la couleur.",
      "Verser le bouillon avec thym et laurier. Cuire 10 min à frémissement.",
      "Répartir dans des bols ou une grande casserole allant au four.",
      "Poser les tranches de pain, recouvrir de gruyère et gratiner 5 min au gril."
    ],
    chefTip: "La patience est la clé : 30 min à feu doux pour caraméliser les oignons correctement — c'est là que tout le goût se développe.",
    childNote: null
  },
  {
    name: "Pasta e fagioli",
    type: "dîner", cuisine: "Italienne", imageQuery: "pasta fagioli beans soup Italian rustic thick stew",
    servings: 4, prepTime: "10 min", cookTime: "30 min", difficulty: "Facile",
    kcalPerPerson: 350, proteinPerPerson: 14, carbsPerPerson: 55, diets: ["Vegan"],
    coutParPersonne: 1.30, niveauBudget: "économique", economieTip: "Un plat 100 % placard — haricots en boîte, pâtes et conserves suffisent.",
    ingredients: [
      {quantity:"200",unit:"g",name:"petites pâtes (ditalini)"},{quantity:"2",unit:"boîtes",name:"haricots borlotti (ou blancs)"},
      {quantity:"1",unit:"boîte",name:"tomates concassées"},{quantity:"1",unit:"",name:"oignon"},
      {quantity:"3",unit:"gousses",name:"ail"},{quantity:"1",unit:"branche",name:"romarin"},
      {quantity:"1",unit:"L",name:"bouillon de légumes"},{quantity:"3",unit:"c.à.s",name:"huile d'olive"},
      {quantity:"",unit:"",name:"parmesan, poivre noir"}
    ],
    steps: [
      "Faire revenir l'oignon émincé et l'ail dans l'huile, 5 min.",
      "Ajouter les tomates et cuire 5 min.",
      "Ajouter les haricots rincés et le bouillon. Porter à ébullition.",
      "Mixer le tiers des haricots avec un peu de bouillon et reverser — cela épaissit le plat.",
      "Ajouter les pâtes et le romarin, cuire le temps indiqué sur l'emballage.",
      "Finir avec un filet d'huile d'olive et du parmesan."
    ],
    chefTip: "Le secret de la pasta e fagioli : mixer ⅓ des haricots pour créer une texture crémeuse sans crème. Plat paysan génial de la cuisine italienne.",
    childNote: null
  },
  {
    name: "Purée de carottes au gingembre",
    type: "déjeuner", cuisine: "Française", imageQuery: "carrot ginger puree soup smooth orange healthy bowl",
    servings: 4, prepTime: "10 min", cookTime: "20 min", difficulty: "Facile",
    kcalPerPerson: 130, proteinPerPerson: 2, carbsPerPerson: 20, diets: ["Vegan","Sans gluten"],
    coutParPersonne: 0.80, niveauBudget: "économique", economieTip: null,
    ingredients: [
      {quantity:"800",unit:"g",name:"carottes"},{quantity:"1",unit:"morceau (3 cm)",name:"gingembre frais"},
      {quantity:"1",unit:"",name:"oignon"},{quantity:"2",unit:"c.à.s",name:"huile d'olive"},
      {quantity:"40",unit:"cl",name:"bouillon de légumes"},{quantity:"1",unit:"c.à.s",name:"jus d'orange"},
      {quantity:"",unit:"",name:"coriandre fraîche"},{quantity:"",unit:"",name:"sel, poivre"}
    ],
    steps: [
      "Éplucher et couper les carottes en rondelles.",
      "Faire revenir l'oignon et le gingembre râpé dans l'huile, 3 min.",
      "Ajouter les carottes et le bouillon. Cuire 15-18 min jusqu'à tendreté.",
      "Mixer finement en ajoutant le jus d'orange.",
      "Ajuster la consistance avec un peu de bouillon chaud si besoin.",
      "Servir avec un filet d'huile d'olive et de la coriandre ciselée."
    ],
    chefTip: "Le jus d'orange en fin de cuisson apporte une note acidulée qui réveille le goût de la carotte. Ce velouté est aussi délicieux froid en été.",
    childNote: "Les enfants adorent — réduis le gingembre à ½ cm pour les petits."
  },
  {
    name: "Riz au lait vanille",
    type: "dîner", cuisine: "Française", imageQuery: "rice pudding vanilla creamy bowl comfort dessert",
    servings: 4, prepTime: "5 min", cookTime: "35 min", difficulty: "Facile",
    kcalPerPerson: 280, proteinPerPerson: 7, carbsPerPerson: 50, diets: ["Végétarien","Sans gluten"],
    coutParPersonne: 0.60, niveauBudget: "économique", economieTip: null,
    ingredients: [
      {quantity:"150",unit:"g",name:"riz rond (type Arborio ou riz à dessert)"},{quantity:"80",unit:"cl",name:"lait entier"},
      {quantity:"20",unit:"cl",name:"crème liquide"},{quantity:"60",unit:"g",name:"sucre"},
      {quantity:"1",unit:"gousse",name:"vanille"},{quantity:"1",unit:"pincée",name:"sel"}
    ],
    steps: [
      "Fendre la gousse de vanille et gratter les graines dans le lait avec la crème.",
      "Porter à frémissement avec le sel.",
      "Ajouter le riz et le sucre. Cuire à feu très doux 30-35 min en remuant toutes les 5 min.",
      "Le riz doit être fondant et la texture crémeuse — ajouter un peu de lait chaud si trop épais.",
      "Servir tiède ou froid, avec une touche de cannelle ou de confiture selon l'envie."
    ],
    chefTip: "Le riz au lait se sert légèrement coulant — il épaissit en refroidissant. Utilise du lait entier et de la crème pour un résultat onctueux.",
    childNote: "Un classique adoré de tous les enfants."
  },
  {
    name: "Pain perdu à la cannelle",
    type: "petit-déjeuner", cuisine: "Française", imageQuery: "French toast cinnamon powdered sugar simple rustic breakfast",
    servings: 4, prepTime: "5 min", cookTime: "10 min", difficulty: "Facile",
    kcalPerPerson: 260, proteinPerPerson: 10, carbsPerPerson: 38, diets: ["Végétarien"],
    coutParPersonne: 0.70, niveauBudget: "économique", economieTip: "Parfait pour utiliser le pain rassis — zéro déchet, maximum de plaisir.",
    ingredients: [
      {quantity:"8",unit:"tranches",name:"pain rassis (baguette ou pain de mie)"},{quantity:"3",unit:"",name:"œufs"},
      {quantity:"15",unit:"cl",name:"lait"},{quantity:"1",unit:"c.à.s",name:"sucre"},
      {quantity:"1",unit:"c.à.c",name:"cannelle"},{quantity:"1",unit:"c.à.c",name:"extrait de vanille"},
      {quantity:"20",unit:"g",name:"beurre"},{quantity:"",unit:"",name:"sucre glace pour servir"}
    ],
    steps: [
      "Battre les œufs avec le lait, le sucre, la cannelle et la vanille dans un plat creux.",
      "Tremper les tranches de pain 30 secondes de chaque côté.",
      "Faire chauffer le beurre dans une poêle à feu moyen.",
      "Dorer les tranches 2 min de chaque côté.",
      "Saupoudrer de sucre glace et servir avec du sirop d'érable ou de la confiture."
    ],
    chefTip: "Cette version utilise le pain du quotidien et des ingrédients basiques — aussi délicieuse que la version à la brioche, pour 3 fois moins cher.",
    childNote: null
  },
  {
    name: "Crêpes économiques à l'eau",
    type: "petit-déjeuner", cuisine: "Française", imageQuery: "thin crepes golden French pancakes simple stack homemade",
    servings: 4, prepTime: "5 min", cookTime: "20 min", difficulty: "Facile",
    kcalPerPerson: 210, proteinPerPerson: 7, carbsPerPerson: 38, diets: ["Végétarien"],
    coutParPersonne: 0.40, niveauBudget: "économique", economieTip: "Remplace le lait par de l'eau — crêpes légères et encore moins chères.",
    ingredients: [
      {quantity:"250",unit:"g",name:"farine"},{quantity:"3",unit:"",name:"œufs"},
      {quantity:"50",unit:"cl",name:"eau"},{quantity:"1",unit:"pincée",name:"sel"},
      {quantity:"1",unit:"c.à.s",name:"sucre"},{quantity:"1",unit:"c.à.s",name:"huile neutre"},
      {quantity:"",unit:"",name:"beurre pour la poêle"}
    ],
    steps: [
      "Mélanger la farine et le sel dans un saladier, creuser un puits.",
      "Ajouter les œufs battus et l'huile au centre, mélanger en incorporant la farine.",
      "Ajouter l'eau progressivement en fouettant pour obtenir une pâte lisse et fluide.",
      "Ajouter le sucre. Laisser reposer 15 min si possible.",
      "Cuire dans une crêpière légèrement beurrée, 1 min de chaque côté."
    ],
    chefTip: "Les crêpes à l'eau sont plus légères et croustillantes que celles au lait. Elles sont parfaites quand on manque de lait — un secret de cuisiniers économes.",
    childNote: null
  },
  {
    name: "Haricots blancs à la tomate",
    type: "déjeuner", cuisine: "Méditerranéenne", imageQuery: "white beans tomato sauce herbs stew rustic Mediterranean",
    servings: 4, prepTime: "10 min", cookTime: "25 min", difficulty: "Facile",
    kcalPerPerson: 260, proteinPerPerson: 13, carbsPerPerson: 38, diets: ["Vegan","Sans gluten"],
    coutParPersonne: 0.90, niveauBudget: "économique", economieTip: null,
    ingredients: [
      {quantity:"2",unit:"boîtes",name:"haricots blancs"},{quantity:"1",unit:"boîte",name:"tomates concassées"},
      {quantity:"1",unit:"",name:"oignon"},{quantity:"3",unit:"gousses",name:"ail"},
      {quantity:"1",unit:"c.à.c",name:"paprika fumé"},{quantity:"1",unit:"c.à.c",name:"cumin"},
      {quantity:"1",unit:"branche",name:"thym"},{quantity:"1",unit:"",name:"laurier"},
      {quantity:"3",unit:"c.à.s",name:"huile d'olive"},{quantity:"",unit:"",name:"persil, sel, poivre"}
    ],
    steps: [
      "Faire revenir l'oignon émincé dans l'huile à feu moyen, 5 min.",
      "Ajouter l'ail et les épices, cuire 1 min.",
      "Incorporer les tomates concassées, thym et laurier. Cuire 10 min.",
      "Ajouter les haricots rincés et laisser mijoter 10 min pour que les saveurs se marient.",
      "Rectifier l'assaisonnement, parsemer de persil ciselé.",
      "Servir avec du riz ou du pain de campagne."
    ],
    chefTip: "Un plat 100 % placard nourrissant et délicieux. Les haricots en conserve n'ont rien à envier aux secs — et c'est 10 fois plus rapide.",
    childNote: null
  },
  {
    name: "Poêlée de chou blanc et pommes",
    type: "déjeuner", cuisine: "Alsacienne", imageQuery: "white cabbage apple pan fried caraway simple healthy",
    servings: 4, prepTime: "10 min", cookTime: "20 min", difficulty: "Facile",
    kcalPerPerson: 140, proteinPerPerson: 3, carbsPerPerson: 22, diets: ["Vegan","Sans gluten"],
    coutParPersonne: 0.70, niveauBudget: "économique", economieTip: null,
    ingredients: [
      {quantity:"½",unit:"",name:"chou blanc (600g)"},{quantity:"2",unit:"",name:"pommes"},
      {quantity:"1",unit:"",name:"oignon"},{quantity:"1",unit:"c.à.c",name:"graines de carvi ou cumin"},
      {quantity:"2",unit:"c.à.s",name:"vinaigre de cidre"},{quantity:"1",unit:"c.à.s",name:"sucre"},
      {quantity:"2",unit:"c.à.s",name:"huile"},{quantity:"",unit:"",name:"sel, poivre"},
      {quantity:"",unit:"",name:"persil"}
    ],
    steps: [
      "Émincer finement le chou et l'oignon. Peler et couper les pommes en quartiers.",
      "Faire revenir l'oignon dans l'huile, 3 min.",
      "Ajouter le chou émincé, le carvi, sel, sucre et vinaigre.",
      "Cuire à couvert 12-15 min à feu moyen en remuant souvent — le chou doit rester légèrement croquant.",
      "Ajouter les pommes les 5 dernières minutes.",
      "Servir en accompagnement ou en plat avec du pain et du fromage."
    ],
    chefTip: "Le vinaigre de cidre et la pomme adoucissent le chou et lui donnent une saveur douce-acidulée surprenante. Ce plat est encore meilleur le lendemain.",
    childNote: "Les pommes rendent ce plat naturellement sucré — souvent apprécié des enfants."
  },
  {
    name: "Velouté de courgettes léger",
    type: "déjeuner", cuisine: "Française", imageQuery: "zucchini soup cream smooth green bowl healthy light",
    servings: 4, prepTime: "10 min", cookTime: "20 min", difficulty: "Facile",
    kcalPerPerson: 150, proteinPerPerson: 5, carbsPerPerson: 14, diets: ["Végétarien","Sans gluten"],
    coutParPersonne: 1.00, niveauBudget: "économique", economieTip: null,
    ingredients: [
      {quantity:"800",unit:"g",name:"courgettes"},{quantity:"1",unit:"",name:"oignon"},
      {quantity:"1",unit:"gousse",name:"ail"},{quantity:"60",unit:"g",name:"fromage frais (type St-Môret)"},
      {quantity:"50",unit:"cl",name:"bouillon de légumes"},{quantity:"1",unit:"c.à.s",name:"huile d'olive"},
      {quantity:"",unit:"",name:"basilic frais"},{quantity:"",unit:"",name:"sel, poivre"},
      {quantity:"",unit:"",name:"graines de courge pour servir"}
    ],
    steps: [
      "Couper les courgettes en rondelles (garder la peau — elle donne la belle couleur verte).",
      "Faire revenir oignon et ail dans l'huile, 3 min.",
      "Ajouter les courgettes et le bouillon. Cuire 15 min à feu moyen.",
      "Mixer avec le fromage frais et le basilic jusqu'à texture très lisse.",
      "Ajuster la consistance et l'assaisonnement.",
      "Servir avec quelques graines de courge et un filet d'huile d'olive."
    ],
    chefTip: "Le fromage frais remplace avantageusement la crème — moins gras, tout aussi onctueux. Cuire les courgettes avec la peau pour une couleur vert vif.",
    childNote: "Un velouté que les enfants acceptent facilement."
  },
  {
    name: "Frittata rapide aux légumes du frigo",
    type: "dîner", cuisine: "Italienne", imageQuery: "frittata vegetables quick easy eggs Italian skillet",
    servings: 4, prepTime: "10 min", cookTime: "15 min", difficulty: "Facile",
    kcalPerPerson: 220, proteinPerPerson: 14, carbsPerPerson: 8, diets: ["Végétarien","Sans gluten"],
    coutParPersonne: 1.50, niveauBudget: "économique", economieTip: "Utilisez n'importe quels restes de légumes — zéro déchet.",
    ingredients: [
      {quantity:"6",unit:"",name:"œufs"},{quantity:"300",unit:"g",name:"légumes variés (courgettes, poivrons, épinards, champignons)"},
      {quantity:"80",unit:"g",name:"feta ou fromage râpé"},{quantity:"2",unit:"c.à.s",name:"huile d'olive"},
      {quantity:"1",unit:"",name:"oignon"},{quantity:"2",unit:"gousses",name:"ail"},
      {quantity:"",unit:"",name:"herbes de Provence"},{quantity:"",unit:"",name:"sel, poivre"}
    ],
    steps: [
      "Préchauffer le four à 180 °C.",
      "Faire revenir oignon et ail dans une poêle allant au four, 3 min.",
      "Ajouter les légumes coupés et cuire 5-7 min jusqu'à tendreté.",
      "Battre les œufs avec sel, poivre et herbes de Provence. Verser sur les légumes.",
      "Émietter la feta dessus. Cuire 5 min à feu doux pour que le fond se solidifie.",
      "Enfourner 8-10 min jusqu'à ce que le centre soit pris et le dessus doré."
    ],
    chefTip: "La frittata est la reine des repas anti-gaspi. N'importe quel légume fonctionne — c'est l'occasion de vider le bas du frigo de façon délicieuse.",
    childNote: null
  },
  {
    name: "Salade de riz thon maïs",
    type: "déjeuner", cuisine: "Française", imageQuery: "rice tuna corn salad bowl lunch simple colorful",
    servings: 4, prepTime: "10 min", cookTime: "15 min", difficulty: "Facile",
    kcalPerPerson: 310, proteinPerPerson: 18, carbsPerPerson: 45, diets: ["Sans gluten"],
    coutParPersonne: 1.20, niveauBudget: "économique", economieTip: null,
    ingredients: [
      {quantity:"250",unit:"g",name:"riz long"},{quantity:"2",unit:"boîtes",name:"thon au naturel"},
      {quantity:"1",unit:"boîte",name:"maïs en conserve"},{quantity:"3",unit:"",name:"tomates"},
      {quantity:"½",unit:"",name:"concombre"},{quantity:"½",unit:"",name:"oignon rouge"},
      {quantity:"3",unit:"c.à.s",name:"mayonnaise légère"},{quantity:"2",unit:"c.à.s",name:"moutarde"},
      {quantity:"2",unit:"c.à.s",name:"jus de citron"},{quantity:"",unit:"",name:"persil, sel, poivre"}
    ],
    steps: [
      "Cuire le riz dans l'eau salée, égoutter et laisser refroidir.",
      "Égoutter le thon et le maïs.",
      "Couper les tomates, le concombre en dés, émincer l'oignon rouge.",
      "Mélanger mayonnaise, moutarde et jus de citron pour la sauce.",
      "Combiner riz, thon, maïs, légumes et sauce. Mélanger délicatement.",
      "Goûter et rectifier l'assaisonnement. Servir frais."
    ],
    chefTip: "Cette salade voyage bien — idéale pour les pique-niques ou les repas du bureau. Elle se prépare la veille et se garde 2 jours au frigo.",
    childNote: "Un incontournable des repas de plein air adoré des enfants."
  },
]

export const SEEDED_RECIPES = seed.map(r => ({
  ...r,
  id:      nanoid(),
  savedAt: new Date().toISOString(),
}))
