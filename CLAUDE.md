# Chef Privé — Notes de projet

## Démarrage du serveur de développement

**Port fixe : `http://localhost:3003`**

Toujours lancer avec :
```bash
npm run dev
```

Le port 3003 est verrouillé dans `vite.config.js` (`strictPort: true`).
Si le port est occupé, tuer le processus qui l'utilise avant de relancer.

### Fermer un port bloqué (Windows PowerShell)
```powershell
# Trouver le PID qui occupe le port
netstat -ano | findstr :3003

# Tuer le processus (remplacer XXXX par le PID trouvé)
taskkill /PID XXXX /F
```

---

## Stack technique
- **Framework** : React + Vite
- **Style** : Tailwind CSS (thème dolce vita — bleu marine / jaune)
- **État** : Zustand (`useFamilyStore`)
- **IA** : Anthropic Claude (via proxy Vite en dev)
- **Voix** : ElevenLabs (via proxy Vite en dev)

## Conventions
- Composants dans `src/components/`
- Pages dans `src/pages/`
- Variables CSS du thème dans `src/index.css`
