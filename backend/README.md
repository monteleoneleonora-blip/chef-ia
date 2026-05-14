# Backend Chef IA — proxy API

Ce serveur Express minimal détient les clés API (Anthropic, ElevenLabs, Pexels, Unsplash). Le front les appelle **uniquement à travers ce serveur** : aucune clé ne se retrouve dans le bundle JavaScript publié au navigateur.

## Pourquoi un backend ?

Sans ça, les variables `VITE_*` injectées par Vite finissent **en clair** dans le JS livré au navigateur. N'importe qui peut les extraire et facturer ton compte Anthropic.

## Démarrage local

```bash
cd backend
npm install
cp .env.example .env       # renseigne tes clés
npm run dev                 # nodemon-like via --watch (Node 20+)
```

Le serveur écoute par défaut sur `http://localhost:3001`.

## Configuration côté front

Dans `.env` à la racine du projet front, ajoute :

```
VITE_API_BASE=http://localhost:3001
```

Et adapte `vite.config.js` si tu veux garder le proxy en dev (déjà en place vers Anthropic / ElevenLabs).

## Endpoints

| Méthode | Path | Rôle |
|---|---|---|
| `GET` | `/health` | Healthcheck (utile pour Railway/Render) |
| `POST` | `/api/anthropic/messages` | Proxy vers `https://api.anthropic.com/v1/messages`. Stream SSE supporté. |
| `POST` | `/api/elevenlabs/tts` | Synthèse vocale ElevenLabs. Renvoie un `audio/mpeg`. |
| `GET` | `/api/photo?query=…&source=auto\|pexels\|unsplash` | Renvoie une URL d'image (ou `null`). |

## Déploiement

### Railway

```bash
railway login
railway init
railway up
railway variables set ANTHROPIC_API_KEY=… ELEVENLABS_API_KEY=… PEXELS_API_KEY=… UNSPLASH_API_KEY=… ALLOWED_ORIGINS=https://ton-front.com
```

### Render

1. Connecte le repo, choisis « Web Service », runtime Node.
2. Build command : `cd backend && npm ci`
3. Start command : `cd backend && npm start`
4. Variables d'env identiques.

### Cloud Run / Fly.io

Un `Dockerfile` minimal fonctionnerait :

```Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci --omit=dev
COPY backend/. .
EXPOSE 3001
CMD ["node", "server.js"]
```

## Sécurité

- **CORS strict** : seules les origines listées dans `ALLOWED_ORIGINS` sont autorisées.
- **Rate limit** : 60 req/min/IP par défaut (`RATE_LIMIT_MAX`).
- **Pas d'exposition** des clés dans les réponses.
- **Body limit** : 20 Mo (suffisant pour les PDFs nutritionnels en base64).

## Évolutions futures

- Auth JWT/Clerk pour identifier les utilisateurs avant d'autoriser les appels Anthropic.
- Persistance des abonnements en base (Postgres/Supabase) au lieu de `localStorage`.
- Webhooks Stripe pour synchroniser le plan utilisateur.
- Cache Redis pour les recherches photo (réduire les coûts Pexels/Unsplash).
