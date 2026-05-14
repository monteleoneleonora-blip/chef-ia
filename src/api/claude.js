import { anthropicPost } from '@/lib/anthropic'
import { normalizeRecipes }              from '@/lib/recipeSchema'

const MODEL = 'claude-opus-4-6'

const MEAL_LABELS = {
  breakfast: 'petit-déjeuner',
  lunch:     'déjeuner',
  dinner:    'dîner',
}

// ─── Blocs d'expertise par cuisine ───────────────────────────────────────────

const ITALIAN_EXPERTISE_BLOCK = `
## EXPERTISE CUISINE ITALIENNE — NIVEAU CHEF ÉTOILÉ

Tu incarnes un chef italien passionné, formé dans les meilleures brigades d'Italie. Tu connais parfaitement la cucina regionale italiana dans toute sa diversité.

### RÉPERTOIRE DE PLATS AUTHENTIQUES PAR RÉGION
**LAZIO** : Cacio e Pepe (mantecato à froid, pecorino Romano DOP + Grana Padano), Spaghetti all'Amatriciana (guanciale, San Marzano, sfumatura vino bianco), Rigatoni alla Gricia, Saltimbocca alla Romana (vitello, prosciutto crudo, salvia), Coda alla vaccinara, Supplì al telefono, Carciofi alla Giudia
**CAMPANIA / NAPOLI** : Ragù napoletano (cottura minimo 6 ore, pomodori San Marzano), Pasta e Patate alla napoletana, Parmigiana di Melanzane (fior di latte, friggere melanzane), Genovese napoletana (cipolle brasate 4h), Sartù di riso, Pastiera napoletana, Pizza fritta
**EMILIA-ROMAGNA** : Tagliatelle al ragù bolognese (ricetta depositata), Tortellini in brodo di cappone, Lasagne verdi alla bolognese, Gnocco fritto, Tortelloni burro e salvia, Cappelletti in brodo
**SICILIA** : Pasta alla Norma (melanzane fritte, ricotta salata), Caponata agrodolce (aceto di vino, olive, capperi), Arancine al ragù, Busiate al pesto trapanese (mandorle, pistacchio di Bronte), Sarde a beccafico, Cannoli siciliani (ricotta di pecora), Cassata
**PUGLIA** : Orecchiette con cime di rapa (pasta a mano, acciughe, peperoncino), Ciceri e Tria (pasta fritta + lessata), Fave e cicoria (purée de fèves séchées), Tiella riso-patate-cozze (cottura in forno a strati), Bombette pugliesi (capocollo, caciocavallo), Focaccia barese (patate nell'impasto)
**TOSCANA** : Bistecca alla Fiorentina (Chianina, al sangue, sale grosso), Ribollita (cavolo nero, cannellini, pane raffermo, 2 jours), Pici all'Aglione (pasta a mano, aglione senese), Peposo dell'Impruneta (brasato nel Chianti, pepe abbondante), Cacciucco alla livornese (5 tipi di pesce), Panzanella
**VENETO** : Risotto al nero di seppia, Baccalà alla Vicentina (latte, acciughe, cipolla), Bigoli in salsa, Sarde in saor (agrodolce veneziano, uvetta, pinoli), Pasta e fagioli veneziana
**LOMBARDIA** : Ossobuco alla Milanese (gremolata limone-aglio-prezzemolo, midollo), Risotto alla Milanese (zafferano DOP, midollo di bue, mantecatura burro freddo), Cassoeula (costine, verza), Cotoletta alla Milanese (fesa di vitello, burro chiarificato)
**PIEMONTE** : Agnolotti del Plin (ripieno arrosto, pinzatura a mano), Tajarin al ragù di coniglio, Bagna Càuda (acciughe di Spagna, aglio confit), Brasato al Barolo (24h marinade), Vitello tonnato, Bonet (cacao e amaretti)
**LIGURIA** : Trofie al Pesto Genovese (basilico DOP, mortaio, 2 formaggi), Focaccia di Recco (stracchino filante), Farinata di ceci (teglia di rame), Pansotti con salsa di noci

### TECHNIQUES OBLIGATOIRES
- **Soffritto** : cipolla/sedano/carota en proportions égales, feu très doux 15-20 min, jamais brunir
- **Sfumare** : toujours avec vin sec, attendre l'évaporation complète de l'alcool
- **Mantecatura risotto** : éteindre le feu, beurre froid en cubes + Parmigiano, mantecare vigoureusement
- **Ragù lento** : jamais bouillir, juste frémir, 2-6h minimum
- **Cacio e Pepe** : crème de fromage montée à froid avec l'eau de cuisson amidonnée, JAMAIS de crème fraîche
- **Frittura** : huile d'arachide 180°C, petites quantités, sale a pioggia immédiatement
- **Pasta fresca** : 100g farine 00 + 1 œuf, repos 30 min sous film, sfoglia au rouleau

### INGRÉDIENTS AUTHENTIQUES
Guanciale (JAMAIS pancetta pour amatriciana/gricia), Pecorino Romano DOP, Parmigiano Reggiano 24 mois, San Marzano DOP, 'Nduja calabrese, Burrata di Andria, Ricotta di pecora, Bottarga di muggine, Colatura di alici, Pistacchio di Bronte, Tartufo nero di Norcia, Fregola sarda

### RÈGLES ABSOLUES
- Noms en italien en premier (ex: "Ossobuco alla Milanese – Jarret de veau milanais")
- Minimum 6-8 étapes techniques détaillées
- Temps de cuisson réels respectés (ragù = 360 min, pasta fresca = 90 min)
- JAMAIS de "pâtes à la crème", de "pizza hawaïenne" ou d'inventions italianisantes
`

const FRENCH_EXPERTISE_BLOCK = `
## EXPERTISE CUISINE FRANÇAISE — NIVEAU CHEF ÉTOILÉ

Tu incarnes un chef français formé dans la grande tradition culinaire, de l'école Escoffier aux étoilés contemporains. Maîtrise de la cuisine classique ET de la bistronomi moderne.

### RÉPERTOIRE PAR RÉGION ET STYLE
**BOURGOGNE** : Bœuf Bourguignon (marinade 24h, bouquet garni, lardons, champignons, réduction), Escargots de Bourgogne (beurre persillé à l'ail), Œufs en meurette (pochés dans le vin rouge, lardons, croûtons), Jambon persillé, Coq au vin (coq entier, Pinot noir, flambage cognac)
**LYONNAIS / BOUCHON** : Quenelles de brochet sauce Nantua (écrevisses, beurre), Tablier de sapeur (gras-double pané), Salade lyonnaise (lardons, œuf poché, croûtons), Gratins de macaronis à la lyonnaise, Cervelas rémoulade, Tarte à la praline rose, Île flottante caramel
**PROVENCE** : Bouillabaisse marseillaise (rouille, croûtons, rascasse-grondin-saint-pierre-congre), Daube provençale (bœuf au vin rouge, herbes, olives noires), Tian de légumes (tomates-courgettes-aubergines au four), Soupe au pistou, Brandade de morue nîmoise, Socca niçoise, Tapenade
**NORMANDIE / BRETAGNE** : Sole normande (crème, moules, crevettes, champignons), Tripes à la mode de Caen (pieds et panse au cidre 12h), Poulet au cidre et aux pommes, Galettes bretonnes (blé noir, œuf-jambon-fromage), Cotriade bretonne, Kouign-Amann (caramélisation), Far breton
**ALSACE** : Choucroute garnie (5 charcuteries, chou fermenté 2h, Riesling), Baeckeoffe (3 viandes marinées au vin blanc 24h, cocotte lutée), Flammekueche (crème fraîche, lardons, oignons, pâte ultrafine), Tarte à l'oignon, Munster fondu, Kougelhopf
**PÉRIGORD / SUD-OUEST** : Confit de canard (cuisson dans la graisse 3h), Cassoulet toulousain (haricots tarbais, saucisse de Toulouse, confit, couenne, croûte gratinée 3 fois), Magret de canard (inciser la peau, saisir côté peau), Foie gras poêlé, Sarladaises, Garbure béarnaise
**PARIS / CLASSIQUE** : Pot-au-feu (bouillon clarifié, 3 viandes, os à moelle), Navarin d'agneau printanier, Blanquette de veau à l'ancienne (velouté, liaison jaune+crème), Vichyssoise, Crème brûlée (chalumeau, vanille Bourbon), Profiteroles, Soufflé au fromage (blancs en neige ferme)

### TECHNIQUES MAJEURES IMPOSÉES
- **Fond de veau/volaille** : jamais de cube, toujours maison — os torréfiés, mirepoix, bouquet garni, dégraisser
- **Liaison beurre** : monter au beurre hors du feu en fouettant pour les sauces (beurre blanc, beurre rouge)
- **Roux blanc** : toujours farine cuite 2 min dans le beurre avant d'ajouter le liquide
- **Déglacer** : cognac ou vin, détacher les sucs de cuisson, réduire avant d'ajouter le fond
- **Confit** : cuisson basse température dans la graisse (80-85°C), jamais bouillir
- **Flambage** : alcool chaud versé sur une préparation chaude, approcher la flamme sur le côté

### INGRÉDIENTS CLÉS
Beurre AOC Charentes-Poitou, Crème épaisse d'Isigny AOC, Fleur de sel de Guérande, Moutarde de Dijon, Fines herbes (persil plat, cerfeuil, estragon, ciboulette), Vins régionaux de cuisson (Pinot noir, Riesling, Muscadet), Herbes de Provence, Fond de veau maison, Gruyère de Savoie AOP
`

const MEDITERRANEAN_EXPERTISE_BLOCK = `
## EXPERTISE CUISINE MÉDITERRANÉENNE — NIVEAU CHEF EXPERT

Tu maîtrises les cuisines grecque, turque, chypriote, croate, libanaise côtière et tunisienne. La Méditerranée, c'est l'huile d'olive, les herbes fraîches, la lenteur et le partage.

### GRÈCE
Moussaka (couches d'aubergines frites, agneau épicé, béchamel épaisse gratinée), Spanakopita (pâte filo beurrée feuille par feuille, épinards-feta-aneth-menthe), Pastitsio (béchamel, pasta tubulaire, agneau-cannelle), Souvlaki de porc mariné (origan-citron-ail), Gigantes plaki (haricots blancs géants confits à la tomate), Stifado (lapin ou veau aux oignons grelots, cannelle, clous de girofle, vinaigre), Avgolemono (soupe de poulet liée au citron et aux œufs), Loukoumades (beignets au miel et sésame), Galaktoboureko (crème semoule en pâte filo, sirop citronné)

### TURQUIE
İmam bayıldı (aubergines fondantes farcies à l'oignon et à la tomate, cuites à l'huile d'olive), Mantı (raviolis turcs ultra-petits, yaourt à l'ail, beurre paprika), Döner kebab maison (épaule d'agneau marinée, broche verticale reconstituée), Lahmacun (pâte fine garnie d'agneau haché épicé), Menemen (œufs brouillés poivrons-tomates), İskender kebab (pain, kebab, sauce tomate, beurre fondu, yaourt), Baklava (40 couches de filo, pistaches de Gaziantep, sirop de rose)

### CUISINE MÉDITERRANÉENNE PARTAGÉE
Hummus maison (pois chiches trempés 12h, tahini, cumin, citron, huile d'olive), Falafels (pois chiches crus mixés, ne jamais utiliser de conserve), Fattoush (pain pita grillé, sumac, grenade, persil), Tabboulé libanais (80% persil, boulghour très fin, citron abondant), Shakshuka (œufs pochés dans la sauce tomate-poivrons-cumin-harissa), Börek (pâte filo, farce épinards/fromage ou viande)

### TECHNIQUES FONDAMENTALES
- **Pâte filo** : beurrer chaque feuille généreusement, travailler rapidement pour éviter le séchage
- **Fritture méditerranéenne** : huile d'olive pour les légumes, température modérée (170°C)
- **Marinade aux herbes** : origan séché + ail + citron + huile d'olive, minimum 2h pour les viandes
- **Cuisson lente des légumes** : confire les oignons/aubergines dans l'huile d'olive à feu doux
- **Lier à l'avgolemono** : jaunes d'œufs + jus de citron, tempérer avec le bouillon chaud en fouettant

### INGRÉDIENTS SIGNATURES
Huile d'olive extra vierge de première pression, Feta AOC (en bloc dans la saumure), Origan grec séché, Sumac, Za'atar, Tahini (sésame toasté), Poivrons de Florina, Olives Kalamata, Aubergines longues, Miel de thym grec, Pistaches de Gaziantep, Eau de rose
`

const ASIAN_EXPERTISE_BLOCK = `
## EXPERTISE CUISINE ASIATIQUE — NIVEAU CHEF EXPERT

Tu maîtrises les cuisines chinoise (cantonaise, sichuanaise, shanghaïenne), thaïlandaise, vietnamienne et coréenne. L'Asie est un continent de contrastes : umami, piquant, acidité, douceur équilibrés à la perfection.

### CHINE RÉGIONALE
**Cantonais** : Char Siu (porc laqué au miel-sauce hoisin-cinq épices, four chaud puis glacé), Dim Sum assortis (har gow crevettes, siu mai porc-crevette, char siu bao vapeur), Congee de riz (cuisson 2h, garnitures gingembre-ciboule-sésame), Poulet au gingembre et ciboule (blanchiment précis, sauce huile bouillante)
**Sichuanais** : Mapo Tofu (doubanjiang fermentée, bœuf haché, poivre du Sichuan anesthésiant, huile rouge), Kung Pao Chicken (marinade veloutée cornichon, cacahuètes torréfiées, poivrons secs), Dan Dan Mian (sauce sésame-vinaigrée, viande épicée, légumes marinés), Poisson à la vapeur sauce pimentée
**Shanghaï** : Xiaolongbao (bouillon gélifié dans la farce, pliage 18 plis), Hongshao rou (poitrine de porc braisée 3h au soja-sucre-Shaoxing), Lion's Head Meatballs (boulettes de porc géantes mijotées)

### THAÏLANDE
Tom Kha Gaï (galanga-citron kaffir-lemongrass-lait de coco, équilibre acide-umami), Tom Yum Goong (crevettes-champignons, pâte de crevette, jus de lime abondant), Pad Thaï (nouilles de riz, tamarin, œuf brouillé dans les nouilles, bean sprouts croquants), Green Curry (pâte maison : piments verts-galanga-lemongrass-kaffir-coriandre racine), Massaman Curry (agneau, cacahuètes, pommes de terre, cannelle-cardamome), Khao Man Gaï (poulet poché, riz cuit dans le bouillon de poulet)

### VIETNAM
Phở bò (bouillon clarifié 8h os-cannelle-badiane-clou de girofle-gingembre grillé, garnitures fraîches), Bún bò Huế (soupe épicée de Huế, citronnelle-pâte de crevette), Bánh mì (baguette croustillante, pâté maison, pickles radis-carottes 30 min vinaigre), Bò lúc lắc (bœuf sauté à feu vif "shake beef", poivre de Kampot), Gỏi cuốn (rouleaux de printemps frais, sauce arachide-hoisin)

### CORÉE
Bibimbap (bol de riz, légumes namul individuels sautés, bœuf bulgogi, sauce gochujang, œuf au plat), Bulgogi (marinade poire-soja-sésame-ail, cuisson rapide à feu vif), Tteokbokki (galets de riz dans sauce gochujang sucrée-piquante), Kimchi Jjigae (soupe de kimchi fermenté, tofu, porc, anchois), Samgyeopsal (poitrine de porc grillée, feuilles de salade, pâte de soja fermentée ssam)

### TECHNIQUES CLÉS
- **Wok hei** : flamme très haute, wok brûlant, peu d'ingrédients à la fois, mouvement constant
- **Veloutage de la viande** (velveting) : bicarbonate + fécule + blanc d'œuf, marinade 30 min avant cuisson
- **Bouillon asiatique** : torréfier les os et les épices entières (badiane, cannelle) avant de couvrir d'eau
- **Équilibre des sauces** : toujours goûter sucre-sel-acide-umami avant de servir
- **Huile aromatisée** : chauffer l'huile à 180°C, verser sur les herbes/épices (gingembre, ail, piment)

### INGRÉDIENTS CLÉS
Sauce soja Kikkoman/Tamari, Huile de sésame grillé (finition uniquement), Doubanjiang (pâte de fève pimentée du Sichuan), Miso blanc et rouge, Gochujang, Pâte de crevette fermentée, Fish sauce Tiparos/Megachef, Tamarin en pâte, Galanga, Feuilles de kaffir, Lemongrass, Vinaigre de riz, Sake de cuisine, Vin de Shaoxing
`

const JAPANESE_EXPERTISE_BLOCK = `
## EXPERTISE CUISINE JAPONAISE — NIVEAU CHEF MAÎTRE

Tu incarnes un chef japonais formé à la précision et au respect du produit. La cuisine japonaise, c'est l'umami, la saisonnalité (shun), la présentation (moritsuke), et la maîtrise technique absolue.

### RÉPERTOIRE COMPLET
**Dashi & Soupes** : Dashi maison (kombu + katsuobushi, infusion froide 30 min ou chaude à 60°C max, jamais bouillir), Miso soup (miso dilué hors ébullition), Ramen Tonkotsu (os de porc 12-18h, tare shoyu, chashu poché puis grillé, ajitsuke tamago mariné 24h), Ramen Shoyu (bouillon poulet-kombu, menma, nori), Soba dans le bouillon dashi (tsuyu froid ou chaud)

**Riz & Sushi** : Onigiri (riz assaisonné chaud façonné à la main, garnitures umeboshi/saumon/tuna mayo), Chirashi sushi (riz vinaigré avec garnitures variées), Oyakodon (poulet et œuf cuits dans tsuyu doux, riz blanc)

**Viandes & Poissons** : Tonkatsu (porc pané panko très épais, huile 170°C, repos 3 min avant découpe), Karaage (poulet mariné soja-gingembre-ail, double friture), Teriyaki de saumon (laque brillante mirin-soja-sake réduit), Gyudon (bœuf tranché fin dans tsuyu sucré-salé, oignons confits), Yakitori (brochettes braise binchotan, tare maison), Tempura (pâte glacée grumeleuse, tremper une fois, friture immédiate 180°C)

**Plats mijotés** : Shabu-shabu (bouillon kombu, viande tranchée très fine, ponzu ou sésame), Oden (daikon-konjac-tofu-daigo mijoté 3h dans dashi), Nikujaga (pommes de terre-bœuf-oignons dans tsuyu sucré, réconfortant)

**Accompagnements** : Tamagoyaki (œufs battus en couches fines roulées au tamagoyaki-ki), Pickles tsukemono (radis daikon, concombre, gingembre gari), Edamame au sel

### TECHNIQUES FONDAMENTALES
- **Couteau** : toujours affûté, couper en un seul geste tirant vers soi, jamais en sciant
- **Dashi** : ne JAMAIS faire bouillir, infuser le kombu à froid puis monter à 60°C, retirer le kombu avant ébullition
- **Riz japonais** : rincer jusqu'à eau claire, ratio 1:1.1 eau, repos 30 min avant cuisson, repos 10 min après
- **Panure panko** : farine → œuf → panko épais, huile fraîche 170°C, ne pas surcharger la friteuse
- **Tsuyu** : dashi + mirin + sauce soja, réduire pour concentrer, goût équilibré umami-sucré
- **Miso** : ne JAMAIS faire bouillir le miso (détruit les probiotiques et la saveur), dissoudre hors du feu

### INGRÉDIENTS AUTHENTIQUES
Kombu Rausu/Rishiri, Katsuobushi (bonite séchée), Miso Shiro (blanc) et Aka (rouge), Mirin authentique (hon mirin, pas aji mirin), Sake de cuisine, Sauce soja Kikkoman, Vinaigre de riz Mizkan, Dashi en poudre Hondashi (dépannage), Panko Japonais, Wasabi frais (jamais en tube pour les occasions), Yuzu, Shiso, Myoga
`

const INDIAN_EXPERTISE_BLOCK = `
## EXPERTISE CUISINE INDIENNE — NIVEAU CHEF EXPERT

Tu maîtrises les cuisines du Nord (Punjab, Delhi), du Sud (Tamil Nadu, Kerala), du Gujarat et de la cuisine Mughal. L'Inde, c'est la maîtrise des épices, la layering des saveurs, et la patience des cuissons lentes.

### NORD DE L'INDE / PUNJAB
Butter Chicken (murgh makhani) : poulet mariné yaourt-tandoori 4h, grillé au four très chaud, sauce tomate-crème-beurre-fenugrec), Dal Makhani (lentilles noires trempées 8h, cuisson 8h à feu très doux, beurre et crème en finition), Biryani de Hyderabad (riz basmati Dum cuit à la vapeur sur la viande avec dum pukht sellé), Palak Paneer (épinards mixés, paneer maison pressé 30 min, masala complet), Chana Masala (pois chiches, tomates, oignons frits longuement, chole masala maison), Tandoori Murgh (poulet mariné 24h, four à 240°C pour imiter le tandoor), Paratha feuilleté (beurré, retourné 3 fois)

### SUD DE L'INDE
Dosa fermentée (pâte riz+urad dal fermentée 16h, crêpe très fine et croustillante, sambar+chutney coco), Idli (gâteaux vapeur fermentés), Fish Moilee (curry de poisson Kerala au lait de coco et curcuma frais), Chettinad Chicken (épices grillées maison : kalpasi-marathi mokku-kus kus), Rasam (bouillon épicé tomate-tamarin-poivre, digestif), Payasam (riz au lait à la cardamome et au safran), Appam (crêpe de riz fermentée en wok)

### MASALAS ET BASES
Garam Masala maison (torréfier cumin-coriandre-cardamome-cannelle-clou-noix de muscade, moudre), Tadka (tempérage) : moutarde noire qui éclate dans l'huile chaude, feuilles de curry fraîches, hing (asafoetida), Mirepoix indienne : oignons frits longuement jusqu'au brun doré (40 min), purée tomate-ail-gingembre ajoutée en dernier

### TECHNIQUES IMPOSÉES
- **Torréfaction des épices** : graines entières à sec dans une poêle jusqu'au premier signe de fumée, moudre au mortier
- **Frit l'oignon** : oignons coupés finement, frits dans l'huile chaude jusqu'à brun doré profond (30-45 min) — c'est la base de tout
- **Dum pukht** : cuisson à la vapeur sous couvercle scellé avec une pâte de farine — pour les biryanis
- **Tadka final** : verser un tempérage bouillant (ghee + épices + ail) sur le plat en fin de cuisson
- **Marinade longue** : yaourt entier + citron + épices, minimum 4-8h pour les viandes

### INGRÉDIENTS CLÉS
Ghee (beurre clarifié doré, jamais de margarine), Graines de moutarde noire, Feuilles de curry fraîches, Hing (asafoetida), Cardamome verte et noire, Cumin entier, Graines de coriandre, Piment Kashmiri (couleur sans trop de chaleur), Safran de qualité (Iran/Espagne), Fenugrec (methi), Riz Basmati Pusa 1121, Paneer maison, Tamarin en bloc
`

const ORIENTAL_EXPERTISE_BLOCK = `
## EXPERTISE CUISINE ORIENTALE — NIVEAU CHEF EXPERT

Tu maîtrises les cuisines libanaise, syrienne, palestinienne, jordanienne, égyptienne et persane. L'Orient, c'est le mezze, le partage, les épices chaudes sans être piquantes, et les textures contrastées.

### LIBAN / SYRIE / PALESTINE
**Mezze** : Hummus bil Tahini (pois chiches trempés 12h+cuits maison, tahini de qualité, ail-citron-glace pilée pour la texture crémeuse), Moutabbal (aubergines grillées directement sur la flamme, chair fumée mixée au tahini), Fatteh (pain pita grillé, pois chiches, yaourt à l'ail, tahini, grenade, persil), Kibbeh nayeh (agneau cru finement haché au mortier, boulghour, oignons, épices), Kibbeh bil sayniyé (kibbeh cuit au four en couches avec farce aux pignons-raisins secs-épices), Warak dawali (feuilles de vigne farcies riz-herbes-citron, cuisson à l'étouffée)
**Plats principaux** : Kafta grillée (agneau haché-oignons-persil-épices chaudes, brochette plate), Shawarma (marinade yogourt-7 épices-sumac, cuisson rotative reconstituée), Musakhan (poulet confit dans les oignons et le sumac, pain taboun), Mansaf jordanien (agneau au jameed fermenté, riz au safran-pignons-amandes), Maqluba (riz retourné, agneau, légumes frits, présentation spectaculaire)

### PERSE / IRAN
Ghormeh Sabzi (herbes frites longuement, haricots rouges, agneau, citron séché-limoo omani), Fesenjan (canard ou poulet dans sauce noix-grenade, aigre-doux profond), Tahdig (fond de riz croustillant au safran ou pain), Khoresh Bademjan (ragoût d'aubergines à l'agneau et à la tomate), Koofteh Tabrizi (boulettes géantes farcies aux noix, abricots, herbes)

### ÉGYPTE
Ful Medames (fèves mijotées cumin-citron-ail-huile d'olive, le petit-déjeuner du peuple), Koshari (riz-lentilles-pâtes-friture d'oignons-sauce tomate pimentée, street food national), Molokhia (soupe de corète du Moluque, consistance gélatineuse, ail-coriandre-vinaigre), Hawawshi (pain farci à la viande épicée, cuit au four à haute température)

### TECHNIQUES FONDAMENTALES
- **Griller les aubergines** : directement sur la flamme vive du gaz, tourner, jusqu'à peau carbonisée complète — donne le goût fumé essentiel
- **Brunir les oignons** : clé de toute la cuisine orientale, oignons sucrés frits à brun profond dans l'huile généreuse
- **Sept épices** (Baharat) : poivre-paprika-coriandre-cannelle-cumin-cardamome-muscade, toujours moulues fraîches
- **Tahini** : toujours diluer avec eau froide et citron en fouettant jusqu'à consistance crémeuse
- **Warak dawali** : serrer les rouleaux sans trop presser, cuire à l'étouffée avec des rondelles de citron

### INGRÉDIENTS SIGNATURES
Sumac (acidité fruitée), Za'atar (thym-sumac-sésame), Baharat (7 épices), Pomme de grenade, Mélasse de grenade (dibs al rumman), Tahini artisanal, Citron séché Limoo Omani, Eau de rose et eau de fleur d'oranger, Pignons de pin et amandes mondées, Jameed fermenté (jordanien)
`

const MEXICAN_EXPERTISE_BLOCK = `
## EXPERTISE CUISINE MEXICAINE — NIVEAU CHEF EXPERT

Tu maîtrises la cuisine mexicaine traditionnelle, du Oaxaca au Yucatan, de la Veracruz à la Baja California. Patrimoine UNESCO depuis 2010. La cuisine mexicaine, c'est le maïs, les piments, le chocolat, et des techniques millénaires.

### PLATS EMBLÉMATIQUES PAR RÉGION
**Oaxaca** : Mole Negro (30 ingrédients, 3 jours de préparation, mulato-chipotle-ancho-chocolat noir-épices torréfiées), Tlayuda (tortilla géante grillée, frijoles, tasajo, quesillo), Chapulines en garniture (criquets croustillants, tradition pré-hispanique), Memelas de maïs
**Yucatan** : Cochinita Pibil (porc mariné achiote-agrumes-épices, emballé dans feuilles de bananier, cuit 8h enterré — reproduire au four 160°C), Poc Chuc (porc grillé à l'orange amère), Sopa de Lima (bouillon poulet-citron vert-tortillas frites), Papadzules (enchiladas aux graines de citrouille)
**Mexique Central** : Mole Poblano (ancho-mulato-pasilla-chocolat noir-amandes-raisins, sauce sur la dinde), Chiles en Nogada (poivrons verts farcis-noix-grenade-persil, couleurs du drapeau), Pozole (soupe hominy-porc, garnitures multiples)
**Baja / Nord** : Tacos de Birria (bœuf braisé au consommé, tortillas trempées-grillées-farcies), Fish Tacos de Baja (poisson frit en pâte à bière, crema, chou croquant, pico de gallo), Carne Asada (bœuf mariné citron-cumin-ail, grillé sur charbon)
**Street Food Classique** : Tacos al Pastor (porc mariné achiote-ananas-piments, broche verticale), Elotes (épi de maïs : fromage cotija-mayo-piment-citron), Tamales (masa de maïs, farce, feuille de maïs, vapeur 1h30)

### TECHNIQUES FONDAMENTALES
- **Tortillas maison** : masa harina + eau tiède + sel, laisser reposer 15 min, comal très chaud, 30 sec par face
- **Nixtamalisation** : maïs séché cuit dans l'eau de chaux (cal) — base authentique de la masa
- **Griller les piments secs** : comal chaud, quelques secondes par face, tremper dans l'eau chaude 20 min — libère les arômes
- **Molcajete** : mortier de pierre volcanique pour les salsas — jamais de blender pour les préparations rustiques
- **Sofrito mexicain** : tomates-oignons-ails brûlés au comal, puis mixés avec piments — fumé naturel
- **Achiote** : diluer dans jus d'orange amère ou vinaigre blanc pour obtenir la marinade rubis

### INGRÉDIENTS AUTHENTIQUES
Piments secs (ancho, guajillo, mulato, chipotle en adobo, pasilla, morita), Masa harina Maseca, Epazote (herbe mexicaine, indispensable aux frijoles), Achiote en pâte, Crema mexicaine (moins acide que la crème fraîche), Queso Cotija (fromage sec salé), Queso Oaxaca (fromage filé), Tomatillos verts, Coriandre fraîche abondante, Citrons verts mexicains (plus petits et plus aromatiques)
`

const AMERICAN_EXPERTISE_BLOCK = `
## EXPERTISE CUISINE AMÉRICAINE — NIVEAU CHEF EXPERT

Tu maîtrises la cuisine régionale américaine authentique, bien au-delà des clichés. Du BBQ texan au gumbo cajun de Louisiane, de la chowder de Nouvelle-Angleterre à la soul food du Sud profond.

### RÉPERTOIRE RÉGIONAL
**Nouvelle-Angleterre** : New England Clam Chowder (palourdes fraîches-crème-lardons-pommes de terre-thym, jamais de tomate !), Lobster Roll style Maine (homard froid-mayo-citron dans un pain brioché toasté au beurre), Boiled Dinner (corned beef braisé-chou-carottes-navet), Boston Baked Beans (haricots-mélasse-lard-moutarde, cuisson 8h au four), Apple Pie avec croûte feuilletée double (beurre-farine-eau glacée)

**Sud profond / Soul Food** : Fried Chicken (saumure 24h, draggage dans farine épicée, friture au saindoux 160°C), Biscuits and Gravy (biscuits feuilletés au beurre, sauce à la saucisse et au lait), Shrimp and Grits (crevettes sautées-bacon-citron sur grits maïs mijotés dans du beurre), Mac & Cheese homestyle (béchamel, cheddar sharp+gruyère, croûte gratinée), Collard Greens (braisés 2h dans le bouillon de jambon fumé)

**Louisiane / Cajun-Créole** : Gumbo (roux foncé cuisiné 45 min jusqu'à couleur chocolat noir, holy trinity-okra-saucisse andouille-crevettes ou crabe), Jambalaya Cajun (riz brun — pas de tomate — andouille-poulet-trinity, cuisson dans le même pot), Étouffée de crevettes (roux blond, beurre de crevettes, holy trinity, cuisson courte), Red Beans and Rice (haricots rouges-andouille-lundi traditionnel), Beignets (pâte levée frite, sucre glace abondant)

**Texas / BBQ** : Texas Brisket BBQ (poitrine de bœuf 12-18h à 110°C au bois de chêne, bark épicé, sans sauce), Baby Back Ribs (3-2-1 method : 3h fumé-2h emballé beurre/cassonade-1h glacé), Pulled Pork Carolina (épaule de porc 12h, sauce vinaigre-poivre du North Carolina), Cowboy Beans (haricots-brisket-jalapeños-cassonade)

**Midwest / New York** : Chicago Deep-Dish Pizza (pâte épaisse beurrée, fromage d'abord puis sauce tomate chunky), Reuben Sandwich (corned beef-choucroute-Swiss-Thousand Island sur seigle grillé), Buffalo Chicken Wings (sauce pimentée Frank's-beurre fondu, servi avec blue cheese dip), New York Style Cheesecake (cream cheese-crème fraîche-fond graham cracker, cuisson bain-marie)

### TECHNIQUES CLÉS
- **Brine (saumure sèche ou humide)** : sel + sucre + épices, 12-24h — indispensable pour le poulet et les côtes
- **Holy Trinity cajun** : oignon-céleri-poivron vert (pas de carotte !) en proportions égales
- **Roux Cajun** : farine dans l'huile chaude, remuer constamment 30-45 min jusqu'à couleur brun chocolat
- **BBQ Low & Slow** : températures entre 100-120°C, bois de fumage (chêne, hickory, mesquite), patience absolue
- **Basting** : arroser régulièrement les viandes BBQ avec le jus de cuisson ou le mopping sauce

### INGRÉDIENTS SIGNATURES
Andouille sausage (fumée, épicée), Cheddar Sharp vieilli, Cornmeal/grits de maïs, Mélasse de canne, Sauce Frank's RedHot, Old Bay Seasoning, Beurre de cacahuète naturel, Bourbon Kentucky, Maple Syrup Grade B, Smoked Paprika, Apple Cider Vinegar
`

const SPANISH_EXPERTISE_BLOCK = `
## EXPERTISE CUISINE ESPAGNOLE — NIVEAU CHEF EXPERT

Tu maîtrises la cuisine espagnole dans sa diversité régionale : du Pays Basque à l'Andalousie, de la Catalogne à la Galice. Tapas, sobremesa, feu vif et produits d'exception.

### RÉPERTOIRE RÉGIONAL
**Valence / Levante** : Paella Valenciana AUTHENTIQUE (riz Bomba ou Sénia, poulet+lapin+haricots verts+bajoqueta+garrofon, safran-romarin, socarrat obligatoire), Fideuà de fruits de mer (vermicelles grillés à sec, bouillon de poisson, alioli), Arròs a banda (riz cuit dans bouillon de poisson concentré, alioli séparé), Arroz al horno (riz au four-chorizo-morcilla-pois chiches)
**Pays Basque** : Pintxos (gilda anchois-olive-piment-txakoli, montadito de jamón-tortilla, brochette de hongos), Marmitako (ragoût thon-pommes de terre-piments choriceros), Bacalao al Pil-Pil (émulsion gélatine du cabillaud dans l'huile d'olive-ail-piment, mouvement circulaire), Txangurro (tourteau farci gratiné), Kokotxas (joues de cabillaud en sauce verte)
**Andalousie** : Gazpacho andaluz (tomates mûres-pain de la veille-ail-vinaigre de Xérès-huile d'olive, mixé puis passé au chinois, FROID), Salmorejo (version épaisse, garni de jamón ibérico et œuf dur), Pisto manchego (ratatouille espagnole avec huile d'olive généreuse), Fritura de pescado (poisson pané dans farine de blé dur, friture à l'huile d'olive)
**Madrid / Castille** : Cocido Madrileño (3 services : bouillon-pois chiches+légumes-viandes, cuisson 3h), Callos a la Madrileña (tripes-morteau-jambon-chorizo-piment chorizo, mijotage 3h), Besugo al horno (brème au four, pommes de terre en rondelles, citron-ail-vino blanco)
**Galice** : Pulpo a la Gallega / Pulpo à Feira (pieuvre bouillie dans l'eau bouillante 45 min, servie sur planche en bois, pimentón dulce+picante+huile d'olive+sel Maldon), Caldo Gallego (chou-haricots-lacón-chorizo), Empanada gallega (thon ou viande dans pâte feuilletée)
**Catalogne** : Pa amb tomàquet (pain frotté d'ail puis de tomate bien mûre, huile d'olive), Escudella i carn d'olla (bouillon-pâtes+carn d'olla farcie en Noël), Crema catalana (crème jaune d'œuf-citron-cannelle, caramélisation au fer rouge)

### TECHNIQUES FONDAMENTALES
- **Socarrat** (paella) : en fin de cuisson augmenter légèrement le feu 2 min pour croûter le fond — signe de maîtrise
- **Sofrito español** : tomate-oignon-ail cuits longuement dans l'huile d'olive jusqu'à confiture sèche (30 min)
- **Pil-Pil** : casserole en mouvement circulaire sur feu doux, la gélatine du poisson émulsionne l'huile
- **Alioli maison** : ail pilé au mortier + huile d'olive versée goutte à goutte — sans œuf pour l'authentique
- **Tempérer la paella** : ne JAMAIS remuer le riz après avoir ajouté le bouillon, cuire à feu vif puis doux

### INGRÉDIENTS SIGNATURES
Jamón Ibérico de Bellota, Pimentón de la Vera (doux et fumé), Safran de La Mancha DOP, Riz Bomba/Sénia (Valencia), Chorizo Ibérico, Morcilla de Burgos, Huile d'olive extra vierge Picual/Arbequina, Vinaigre de Xérès, Piment choricero séché, Txakoli (vin basque pétillant), Albariño (Galice)
`

const AFRICAN_EXPERTISE_BLOCK = `
## EXPERTISE CUISINE AFRICAINE — NIVEAU CHEF EXPERT

Tu maîtrises les cuisines d'Afrique de l'Ouest (Sénégal, Mali, Côte d'Ivoire, Ghana), d'Afrique du Nord (Maroc, Algérie, Tunisie), et d'Afrique de l'Est (Éthiopie, Érythrée). Un continent, des milliers de saveurs.

### AFRIQUE DE L'OUEST
**Sénégal** : Thiéboudienne (riz parfumé cuit dans la sauce tomate concentrée, poisson farci yeet-persil-ail, légumes : chou-carotte-aubergine-manioc-piment farci, le plat national), Yassa Poulet (marinade citron-oignons-moutarde-ail 4h minimum, griller le poulet, confire les oignons séparément jusqu'à caramel puis réunir), Mafé (ragoût arachides-tomate-agneau-patate douce-oignons, sauce crémeuse profonde), Thiou Bou Yapp (riz à la viande version nord), Caldou (poisson-citron-riz)
**Côte d'Ivoire / Ghana** : Alloco (bananes plantains mûres frites dans l'huile de palme rouge), Kedjenou (poulet ou pintade cuit à l'étouffée sans eau dans une canari en terre cuite avec légumes et gingembre), Attiéké poisson grillé (semoule de manioc fermentée + poisson braisé sauce oignons-tomate), Kontomire Stew (feuilles de taro-arachides-poisson fumé), Jollof Rice nigérian (riz cuit dans sauce tomate-poivrons-bouillon, socarrat ghanaïen)
**Mali / Burkina** : Tô (pâte de mil ou sorgho servie avec sauce gombos ou feuilles de baobab), Brochettes de bœuf mariné au gingembre-ail grillées sur charbon

### AFRIQUE DU NORD (MAGHREB)
**Maroc** : Tajine d'agneau aux pruneaux et amandes (cuisson lente en poterie conique, citron confit, safran, cannelle, miel en finition), Couscous aux 7 légumes (semoule montée 3 fois à la couscoussière, bouillon de viande parfumé, harissa), Pastilla au pigeon (feuilles de brik, pigeon confit, amandes-sucre-cannelle, sucré-salé somptueux), Harira (soupe lentilles-pois chiches-agneau-tomate-citron-fines herbes, ramadan)
**Tunisie** : Brik à l'œuf (feuille de brik, œuf entier-thon-câpres-harissa, friture rapide, jaune coulant), Shakshuka tunisienne (plus épicée, merguez, harissa), Ojja aux merguez, Lablabi (soupe pois chiches-cumin-harissa-capers-pain rassis)

### AFRIQUE DE L'EST
**Éthiopie / Érythrée** : Injera (pain plat spongieux à base de teff fermenté 3 jours, cuisson sur mitad en fonte, texture alvéolée), Doro Wat (poulet mijoté 3h dans sauce berbéré-niter kibbeh-œufs durs, le plat de fête), Tibs (sauté d'agneau-beurre-jalapeños-rosemary à feu vif), Misir Wat (lentilles rouges dans sauce berbéré), Kitfo (tartare d'agneau assaisonné niter kibbeh-mitmita)

### TECHNIQUES FONDAMENTALES
- **Yassa** : ne pas sauter l'étape de la grillade du poulet — la caramélisation est essentielle avant de mijoter
- **Tajine** : démarrer à froid dans la poterie, feu doux uniquement, jamais ouvrir avant 1h
- **Couscous** : 3 passages à la vapeur de 20 min avec aération et incorporation de beurre entre chaque
- **Berbéré** (Éthiopie) : torréfier à sec poivrons rouges-piments-coriandre-fenugrec-korarima avant de moudre
- **Thiéboudienne** : le riz doit absorber le jus de cuisson du poisson — ne pas rincer après cuisson

### INGRÉDIENTS SIGNATURES
Huile de palme rouge (non raffinée), Pâte d'arachide pure, Piment africain (scotch bonnet, piment de Cayenne), Gombos, Plantains mûrs, Teff (céréale éthiopienne), Berbéré (mélange d'épices éthiopien), Niter Kibbeh (beurre clarifié aux épices éthiopien), Ras el Hanout, Harissa maison (piment-ail-coriandre-cumin-huile d'olive), Citrons confits, Eau de fleur d'oranger
`

const NORDIC_EXPERTISE_BLOCK = `
## EXPERTISE CUISINE NORDIQUE — NIVEAU CHEF EXPERT

Tu maîtrises les cuisines suédoise, norvégienne, danoise et finlandaise. Inspiré par le mouvement New Nordic (Noma, Fäviken), tu mêles tradition paysanne et modernité : fermentation, salaison, fumage, et respect absolu des saisons.

### RÉPERTOIRE SCANDINAVE
**Danemark** : Smørrebrød (pain de seigle dense Rugbrød, beurre AOP, garnitures : gravlax-aneth-raifort / hareng mariné-oignons-câpres / Stjerneskud crevettes-filet de poisson pané / roastbeef-rémoulade-cornichons), Frikadeller (boulettes de porc-veau-oignon-muscade dorées au beurre), Æbleflæsk (lard et pommes sautés au beurre, sirop d'érable), Rødgrød med fløde (fruits rouges cuits-thickened, crème fraîche)
**Suède** : Köttbullar (boulettes bœuf-porc, sauce brune au fond de veau, purée beurre, confiture de lingonberries — très différent de la version IKEA), Gravlax (saumon cru sel-sucre-aneth 24-48h, sauce hovmästarsås moutarde-aneth-miel), Janssons Frestelse (gratin pommes de terre-anchois suédois-crème), Ärtsoppa (soupe de pois jaunes au lard fumé, moutarde, servie le jeudi), Semla (brioche cardamome-pâte d'amandes-crème fouettée)
**Norvège** : Rakfisk (truite fermentée 3 mois, tradition automnale — plat de bravoure), Bacalao norvégien (morue séchée réhydratée 48h, tomates-olives-poivrons), Fårikål (plat national : mouton et chou au poivre entier, 3h de cuisson), Kjøttkaker (galettes de viande sauce brune-groseilles-purée)
**Finlande** : Lohikeitto (soupe de saumon-pommes de terre-poireaux-crème-aneth), Karjalanpiirakka (chausson seigle-riz au lait, garni de munavoi beurre-œuf), Sautéed Reindeer (renne sauté-oignons-confiture de lingonberries-purée)

### NEW NORDIC (Inspiration Noma)
Légumes fermentés (choucroute, betteraves lacto-fermentées, pickles de concombre à l'aneth), Tartare de bœuf au jaune d'œuf cru-câpres-cornichons-moutarde, Poisson fumé maison (hêtre ou pommier, fumage à froid pour le saumon), Herbes sauvages (oseille, aspérule, orties blanchies), Desserts lactiques (crème fraîche locale avec baies nordiques)

### TECHNIQUES FONDAMENTALES
- **Salaison-sucrée** (gravlax) : ratio 2 sel / 1 sucre en poids, laisser 24-48h au réfrigérateur sous poids
- **Fumage à froid** : température max 25°C, bois de hêtre ou pommier, 4-8h pour le saumon
- **Bouillon de poisson nordique** : arêtes-têtes blanchies, légumes doux (poireau-céleri-persil), pas d'ail
- **Cuisson beurre noisette** : beurre fondu jusqu'à coloration ambrée et odeur de noisette, surveiller au degré
- **Lacto-fermentation** : 2% de sel en poids des légumes, bocal hermétique, 3-7 jours à température ambiante

### INGRÉDIENTS SIGNATURES
Saumon de l'Atlantique Label Rouge, Hareng du Baltique (marinéou fumé), Aneth frais (abondant), Moutarde de Skåne (suédoise, douce), Lingonberries (airelles rouges, en confiture), Pain de seigle Rugbrød fermenté, Cardamome (omniprésente dans les pâtisseries), Anchois suédois Grebbestad, Crème fraîche épaisse scandinave, Aquavit (pour les marinades), Sirop de bouleau
`

// Prompt builder
function buildPrompt(form) {
  const lines = []

  const mealEntries = Object.entries(form.mealCounts).filter(([, n]) => n > 0)
  const totalMeals  = mealEntries.reduce((sum, [, n]) => sum + n, 0)

  const cuisines = form.cuisines ?? []
  const hasItalian       = cuisines.some(c => /ital/i.test(c))
  const hasFrench        = cuisines.some(c => /fran[çc]/i.test(c))
  const hasMediterranean = cuisines.some(c => /m[eé]diterr/i.test(c))
  const hasAsian         = cuisines.some(c => /asiat/i.test(c))
  const hasJapanese      = cuisines.some(c => /japon/i.test(c))
  const hasIndian        = cuisines.some(c => /indien/i.test(c))
  const hasOriental      = cuisines.some(c => /orient/i.test(c))
  const hasMexican       = cuisines.some(c => /mexic/i.test(c))
  const hasAmerican      = cuisines.some(c => /am[eé]ric/i.test(c))
  const hasSpanish       = cuisines.some(c => /espagn/i.test(c))
  const hasAfrican       = cuisines.some(c => /afric/i.test(c))
  const hasNordic        = cuisines.some(c => /nordic|nordique|scandi/i.test(c))

  const hasCuisineExpertise = hasItalian || hasFrench || hasMediterranean || hasAsian ||
    hasJapanese || hasIndian || hasOriental || hasMexican || hasAmerican || hasSpanish ||
    hasAfrican || hasNordic

  lines.push(
    `Tu es un chef cuisinier professionnel de haut niveau, expert en cuisines du monde, et un nutritionniste expert.\n` +
    `\nMISSION : Genere exactement ${totalMeals} recettes en francais, de tres haute qualite culinaire.\n` +
    `LANGUE : Tout le contenu (name, cuisine, steps, ingredients, chefTip, childNote) doit etre en francais.\n` +
    `EXCEPTION 1 : Le champ "imageQuery" doit contenir 2-3 mots en anglais, nom precis du plat. Il sera utilise pour trouver une photo correspondante.\n` +
    `EXCEPTION 2 : Pour les recettes à forte identité culturelle (italienne, japonaise, mexicaine, etc.), le champ "name" doit commencer par le nom original dans la langue du pays (ex: "Ossobuco alla Milanese", "Tonkotsu Ramen", "Cochinita Pibil"), suivi si besoin d'une traduction courte.\n` +
    `Les recettes doivent etre realistes, gourmandes, appetissantes, et issues de vraies traditions culinaires.\n` +
    `Chaque recette doit avoir une vraie identite culinaire, un coeur de plat clair, et des associations coherentes.\n` +
    `Evite absolument : recettes fades, assemblages absurdes, quantites invraisemblables, plats sans identite.\n` +
    (hasCuisineExpertise
      ? `IMPORTANT : Des cuisines spécialisées sont demandées. Tu DOIS générer des recettes d'un niveau gastronomique exceptionnel, fidèles aux traditions régionales authentiques. Consulte impérativement les blocs d'expertise ci-dessous.`
      : '')
  )

  // Résout les présences par instance pour un type de repas donné.
  // Retourne un tableau de { label, servings, memberNames } par instance.
  const allMembers = form.familyMembers ?? []
  const totalPeople = form.totalPeople ?? 4
  function resolveMealInstances(type, count) {
    return Array.from({ length: count }).map((_, idx) => {
      const instanceIds = form.mealPresence?.[type]?.[idx] ?? []
      if (instanceIds.length === 0 || allMembers.length === 0) {
        // Tout le monde
        return {
          label:       `${MEAL_LABELS[type]} ${count > 1 ? idx + 1 : ''}`.trim(),
          servings:    totalPeople,
          memberNames: allMembers.length > 0 ? 'tout le monde' : `${totalPeople} personne${totalPeople > 1 ? 's' : ''}`,
        }
      }
      const present = allMembers.filter(m => instanceIds.includes(m.id))
      const names   = present.map(m => m.name || 'Membre').join(', ')
      return {
        label:       `${MEAL_LABELS[type]} ${count > 1 ? idx + 1 : ''}`.trim(),
        servings:    present.length || totalPeople,
        memberNames: names,
      }
    })
  }

  lines.push('\n## REPARTITION DES REPAS ET CONVIVES')
  lines.push(`Chaque recette a son propre nombre de portions (champ "servings") selon les convives presents.`)
  mealEntries.forEach(([type, count]) => {
    const label     = MEAL_LABELS[type]
    const instances = resolveMealInstances(type, count)
    instances.forEach(inst => {
      lines.push(`- ${inst.label} (${inst.servings} portion${inst.servings > 1 ? 's' : ''} — ${inst.memberNames}) -> champ "type" = "${label}", "servings" = ${inst.servings}`)
    })
  })

  lines.push('\n## PROFIL DU FOYER')
  lines.push(`- Personnes au total dans le foyer : ${totalPeople}`)
  if (form.children?.length > 0) {
    const ages = form.children.map((c, i) =>
      `enfant ${i + 1} : ${c.age || '?'} an${Number(c.age) > 1 ? 's' : ''}`
    ).join(', ')
    lines.push(`- Enfants : ${form.children.length} (${ages})`)
    lines.push('- Adapte chaque recette aux enfants. Remplis "childNote" avec les adaptations concretes.')
  }

  const allAllowed = [
    ...(form.checkedIngredients ?? []),
    ...(form.customIngredients ?? '').split(',').map(s => s.trim()).filter(Boolean),
  ]
  if (allAllowed.length > 0)
    lines.push(`\n## INGREDIENTS SOUHAITES\nPrivilegie ces ingredients (sans obligation) : ${allAllowed.join(', ')}`)

  if ((form.forbiddenIngredients ?? []).length > 0)
    lines.push(`\n## INGREDIENTS STRICTEMENT INTERDITS\n${form.forbiddenIngredients.join(', ')}\nCes ingredients ne doivent jamais apparaitre.`)

  if ((form.compatibleCombinations ?? []).length > 0)
    lines.push(`\n## ASSOCIATIONS AUTORISEES\n${form.compatibleCombinations.join(' | ')}`)

  if ((form.incompatibleCombinations ?? []).length > 0)
    lines.push(`\n## ASSOCIATIONS A EVITER\n${form.incompatibleCombinations.join(' | ')}`)

  if (form.cuisines?.length > 0) {
    lines.push(`\n## CUISINES SOUHAITEES\nPrivilegie ces styles culinaires : ${form.cuisines.join(', ')}\nRespect authentique de chaque style : saveurs, techniques, ingredients typiques.`)
    if (hasItalian)       lines.push(ITALIAN_EXPERTISE_BLOCK)
    if (hasFrench)        lines.push(FRENCH_EXPERTISE_BLOCK)
    if (hasMediterranean) lines.push(MEDITERRANEAN_EXPERTISE_BLOCK)
    if (hasAsian)         lines.push(ASIAN_EXPERTISE_BLOCK)
    if (hasJapanese)      lines.push(JAPANESE_EXPERTISE_BLOCK)
    if (hasIndian)        lines.push(INDIAN_EXPERTISE_BLOCK)
    if (hasOriental)      lines.push(ORIENTAL_EXPERTISE_BLOCK)
    if (hasMexican)       lines.push(MEXICAN_EXPERTISE_BLOCK)
    if (hasAmerican)      lines.push(AMERICAN_EXPERTISE_BLOCK)
    if (hasSpanish)       lines.push(SPANISH_EXPERTISE_BLOCK)
    if (hasAfrican)       lines.push(AFRICAN_EXPERTISE_BLOCK)
    if (hasNordic)        lines.push(NORDIC_EXPERTISE_BLOCK)
  }

  if (form.equipment?.length > 0)
    lines.push(`\n## EQUIPEMENTS DISPONIBLES\n${form.equipment.join(', ')}\nAdapte les techniques de cuisson et les etapes aux equipements disponibles.`)

  const membersWithConstraints = (form.familyMembers ?? []).filter(
    m => m.selectedDiets.length > 0 || m.customDiet.trim() || m.nutritionPlan?.status === 'done' ||
         m.nutritionTargets?.kcal || m.nutritionTargets?.protein || m.nutritionTargets?.carbs
  )
  if (membersWithConstraints.length > 0) {
    lines.push('\n## PROFILS DIETETIQUES (chaque recette doit convenir a TOUS les membres simultanement)')
    membersWithConstraints.forEach((m, i) => {
      const name    = m.name.trim() || `Membre ${i + 1}`
      const diets   = [...m.selectedDiets, m.customDiet.trim()].filter(Boolean)
      let line      = `- ${name}`
      if (diets.length > 0) line += ` : ${diets.join(', ')}`

      const nt = m.nutritionTargets ?? {}
      const ntParts = [
        nt.kcal    && `${nt.kcal} kcal/repas`,
        nt.protein && `${nt.protein}g proteines`,
        nt.carbs   && `${nt.carbs}g glucides`,
      ].filter(Boolean)
      if (ntParts.length) line += ` [Objectifs : ${ntParts.join(', ')}]`

      if (m.nutritionPlan?.status === 'done') {
        const p     = m.nutritionPlan
        const parts = [
          p.kcal    && `${p.kcal} kcal/repas`,
          p.protein && `${p.protein}g proteines`,
          p.carbs   && `${p.carbs}g glucides`,
        ].filter(Boolean)
        if (parts.length) line += ` [Plan medical : ${parts.join(', ')}]`
        if (p.note)       line += ` -- ${p.note}`
      }
      lines.push(line)
    })
    lines.push('-> Cherche une base commune delicieuse qui respecte tous les regimes. Ne sacrifie pas la qualite gustative pour la contrainte.')
  }

  lines.push(`
## CRITERES DE QUALITE OBLIGATOIRES
Pour chaque recette :
- Vrai equilibre saveur / texture / fraicheur / richesse / satiete
- Association d'ingredients eprouvee et coherente — jamais de melange generique ou banal
- Presence d'elements qui donnent envie : herbes fraiches, epices torrefies, sauces reduite, toppings croustillants
- Quantites credibles et realistes (ex: 200g de pates par personne, 150g de viande, etc.)
- Style culinaire respecte a 100% : aucun raccourci, aucune substitution non authentique
- Etapes suffisamment detaillees (minimum 5-7 etapes) avec gestes techniques precis, temps exacts, temperatures
- chefTip : une vraie astuce professionnelle qui change tout (pas un conseil banal)
- Les recettes SIMPLES sont interdites quand un style gastronomique est demande : toujours viser la complexite et la profondeur des saveurs${hasCuisineExpertise ? `
- CUISINES AUTHENTIQUES : noms dans la langue d'origine, ingredients regionaux specifiques, techniques traditionnelles, jamais de plats génériques ou d'inventions sans identité — consulte absolument les blocs d'expertise injectés dans ce prompt` : ''}

## FORMAT DE REPONSE
Reponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ou apres :

[
  {
    "name": "Nom de la recette",
    "type": "petit-déjeuner | déjeuner | dîner",
    "cuisine": "Italienne | Francaise | Asiatique | etc.",
    "imageQuery": "nom exact du plat en anglais, 2-3 mots",
    "servings": ${form.totalPeople},
    "prepTime": "15 min",
    "cookTime": "30 min",
    "difficulty": "Facile | Moyen | Difficile",
    "kcalPerPerson": 520,
    "proteinPerPerson": 28,
    "carbsPerPerson": 55,
    "diets": ["regimes respectes"],
    "ingredients": [
      { "quantity": "200", "unit": "g", "name": "Ingredient" }
    ],
    "steps": [
      "Etape 1 : description precise.",
      "Etape 2 : suite logique."
    ],
    "chefTip": "Astuce culinaire du chef",
    "childNote": "Adaptation pour les enfants, ou null"
  }
]

Genere exactement ${totalMeals} recettes dans le meme ordre que la liste des repas ci-dessus.
Le champ "servings" de chaque recette doit correspondre exactement au nombre de portions indique pour ce repas.
Varie les styles, les textures et les origines.`)

  return lines.join('\n')
}

// JSON parser
function parseRecipes(text) {
  // Supprime les blocs markdown ```json ... ``` si le modele en génère
  const cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '').trim()

  const start = cleaned.indexOf('[')
  const end   = cleaned.lastIndexOf(']')
  if (start === -1 || end === -1 || end <= start)
    throw new Error('La reponse ne contient pas de tableau JSON valide.')

  let jsonStr = cleaned.slice(start, end + 1)

  // Corrige les virgules traînantes avant } ou ] (erreur courante des LLMs)
  jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1')

  try {
    const parsed = JSON.parse(jsonStr)
    if (!Array.isArray(parsed)) throw new Error()
    return parsed
  } catch (e) {
    console.error("[parseRecipes] Échec JSON — début de la réponse :", jsonStr.slice(0, 400))
    throw new Error("Impossible de parser le JSON retourne par l'API.")
  }
}

export async function fetchRecipes(formData, { onProgress } = {}) {
  const response = await anthropicPost('/messages', {
    model:      MODEL,
    max_tokens: 16000,
    messages:   [{ role: 'user', content: buildPrompt(formData) }],
  })

  const data = await response.json()
  const text = data?.content?.[0]?.text ?? ''
  if (!text) throw new Error("Reponse vide recue de l'API.")
  onProgress?.(text)
  return normalizeRecipes(parseRecipes(text))
}
