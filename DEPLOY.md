# Guide de déploiement — Chef IA

Ce guide permet de déployer l'app sur Vercel en moins de 15 minutes.

---

## Prérequis

- Un compte [GitHub](https://github.com) (gratuit)
- Un compte [Vercel](https://vercel.com) (gratuit)
- Une clé API Anthropic — obtenir sur [console.anthropic.com](https://console.anthropic.com)
- (Optionnel) Clés ElevenLabs, Pexels, Unsplash pour la voix et les photos

---

## Étape 1 — Initialiser Git et pousser sur GitHub

Dans le dossier du projet, ouvrir un terminal et exécuter :

```bash
git init
git add .
git commit -m "Initial commit"
```

Puis créer un nouveau repo sur GitHub (bouton "New repository"), copier l'URL et :

```bash
git remote add origin https://github.com/VOTRE_USERNAME/chef-ia.git
git branch -M main
git push -u origin main
```

---

## Étape 2 — Déployer sur Vercel

1. Aller sur [vercel.com](https://vercel.com) → **Add New Project**
2. Sélectionner le repo GitHub `chef-ia`
3. Vercel détecte automatiquement Vite — ne rien changer dans les settings de build
4. Avant de cliquer Deploy, aller dans **Environment Variables** et ajouter :

| Nom | Valeur |
|---|---|
| `VITE_ANTHROPIC_API_KEY` | `sk-ant-...` (votre clé Anthropic) |
| `VITE_ELEVENLABS_API_KEY` | (optionnel) votre clé ElevenLabs |
| `VITE_PEXELS_KEY` | (optionnel) votre clé Pexels |
| `VITE_UNSPLASH_KEY` | (optionnel) votre clé Unsplash |

5. Cliquer **Deploy** — l'app sera live en ~2 minutes sur une URL `chef-ia-xxxx.vercel.app`

---

## Étape 3 — Tester la démo

Une fois déployé :
- Ouvrir l'URL Vercel
- Passer en mode **Premium** depuis la page Abonnement (le bouton active le plan localement)
- Tester la génération de recettes, le chat, les fonctions Premium

> ⚠️ Note : en mode déploiement direct, la clé Anthropic est visible dans le bundle JavaScript. C'est acceptable pour une démo, mais pour une mise en production réelle, déployer un backend proxy (voir ci-dessous).

---

## Pour aller plus loin — Backend sécurisé (optionnel)

Pour cacher les clés API et ajouter une vraie authentification :

Le dossier `backend/` contient un serveur Express minimal prêt à déployer sur [Railway](https://railway.app) ou [Render](https://render.com) (tous deux gratuits en tier de base).

Une fois le backend déployé, définir `VITE_API_BASE=https://votre-backend.railway.app` dans les variables Vercel — le front basculera automatiquement sur le proxy.

---

## Pour brancher Stripe

La logique d'abonnement est entièrement en place côté front (`src/store/useSubscriptionStore.js`). Pour brancher les vrais paiements :

1. Créer les produits Premium et Family dans le [dashboard Stripe](https://dashboard.stripe.com)
2. Ajouter un endpoint webhook dans le backend qui appelle `activate(planId)` à la réception de `checkout.session.completed`
3. Remplacer le bouton "Activer" dans `src/pages/SubscriptionPage.jsx` par un lien vers Stripe Checkout

---

## Ressources utiles

- [Documentation Anthropic](https://docs.anthropic.com)
- [Documentation ElevenLabs](https://docs.elevenlabs.io)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Railway](https://docs.railway.app)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
