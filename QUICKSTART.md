# 🚀 Démarrage Rapide - 5 minutes

Guide ultra-rapide pour mettre en place Jenia Portfolio.

## ⚡ Installation express

### 1. Cloner et installer (2 min)
```bash
git clone https://github.com/votre-username/jenia-portfolio.git
cd jenia-portfolio
pnpm install
```

### 2. Configurer Supabase (2 min)
1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un projet
3. Créez un bucket **public** nommé `jenia-videos`
4. Récupérez vos clés API (Settings > API)

### 3. Configurer .env (30 sec)
Éditez `.env` :
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_key
DATABASE_URL=mysql://user:pass@host/db
JWT_SECRET=generez-un-secret-securise
```

### 4. Lancer (30 sec)
```bash
pnpm db:push
pnpm dev
```

✅ Visitez : `http://localhost:5000`

## 📤 Premier upload

1. Allez sur `/admin`
2. Cliquez "Ajouter une vidéo"
3. Uploadez votre vidéo MP4
4. Retournez sur `/` pour voir le résultat

## 🚀 Déployer sur Vercel (2 min)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

Ou via GitHub + Vercel dashboard (plus simple).

## 📚 Documentation complète

- [README.md](./README.md) - Documentation principale
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Guide Supabase détaillé
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide de déploiement complet

## ❓ Problèmes courants

### ❌ Erreur "Bucket not found"
→ Vérifiez que le bucket `jenia-videos` existe et est **public**

### ❌ Erreur d'upload
→ Vérifiez vos clés API dans `.env`

### ❌ Build échoue
→ Lancez `pnpm install` et `pnpm check`

## 💡 Conseils

- **Format vidéo** : MP4 (H.264), 1920x1080
- **Taille max** : 1GB (ajustable)
- **Durée idéale** : 10-60 secondes
- **Compression** : Utilisez FFmpeg pour optimiser

## 🆘 Besoin d'aide ?

📧 studio.jenia@gmail.com
