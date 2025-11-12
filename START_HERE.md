# 🎬 Jenia Portfolio - Résumé Visuel

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ✅ MIGRATION VERS SUPABASE TERMINÉE                   │
│                                                         │
│  Votre site est maintenant prêt à :                    │
│  • Héberger des vidéos HD sur Supabase                 │
│  • Uploader facilement via l'interface admin           │
│  • Être déployé sur Vercel en production               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Ce qui a été fait pour vous

### 📦 Nouveaux fichiers
```
jenia-portfolio/
├── .env                        # ⚠️ À REMPLIR avec vos credentials
├── .env.example                # Template des variables
├── server/
│   └── supabase-storage.ts     # Module Supabase (✅ prêt)
├── scripts/
│   └── test-supabase.ts        # Script de test (✅ prêt)
├── MIGRATION_SUPABASE.md       # 👉 COMMENCEZ ICI
├── SUPABASE_SETUP.md           # Guide Supabase détaillé
├── DEPLOYMENT.md               # Guide déploiement Vercel
├── README.md                   # Documentation complète
├── QUICKSTART.md               # Démarrage 5 minutes
└── TODO.md                     # Checklist actions
```

### 🔄 Fichiers modifiés
```
✅ package.json         → Ajout @supabase/supabase-js + script test
✅ server/upload.ts     → Utilise Supabase au lieu de Forge
✅ server/_core/env.ts  → Variables Supabase ajoutées
```

---

## 🚀 Plan d'action en 3 étapes

### 📅 ÉTAPE 1 : Configuration Supabase (5-10 minutes)

```
1. supabase.com → Créer compte
2. Créer projet "jenia-portfolio"
3. Storage → Créer bucket "jenia-videos" (PUBLIC ✅)
4. Settings → API → Copier les clés
5. Remplir fichier .env avec vos clés
```

**📖 Guide détaillé** : [MIGRATION_SUPABASE.md](./MIGRATION_SUPABASE.md)

---

### 📅 ÉTAPE 2 : Test local (5 minutes)

```bash
# 1. Installer les dépendances
pnpm install

# 2. Tester la configuration Supabase
pnpm test:supabase
# Si ✅ tous les tests passent → OK !

# 3. Lancer le serveur
pnpm dev

# 4. Uploader une vidéo test
# → http://localhost:5000/admin
# → "Ajouter une vidéo"
# → Uploader un MP4

# 5. Vérifier l'affichage
# → http://localhost:5000
# → La vidéo doit être en arrière-plan ✅
```

---

### 📅 ÉTAPE 3 : Déploiement Vercel (5-10 minutes)

```
Option A - Via GitHub (recommandé)
1. Push code → GitHub
2. vercel.com → Import repo
3. Configurer les variables d'env
4. Deploy → ✅ Site en ligne !

Option B - Via CLI
1. npm i -g vercel
2. vercel --prod
3. Configurer les variables
4. ✅ Site en ligne !
```

**📖 Guide détaillé** : [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📋 Variables d'environnement à configurer

Dans le fichier **`.env`** (local) et **Vercel** (production) :

```env
# Supabase - Récupérées sur supabase.com
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_BUCKET_NAME=jenia-videos

# Base de données MySQL (PlanetScale, Railway, Aiven...)
DATABASE_URL=mysql://user:password@host:port/database

# JWT Secret (chaîne aléatoire sécurisée, min 32 caractères)
JWT_SECRET=votre-secret-super-securise-ici

# App ID
VITE_APP_ID=jenia-portfolio
```

---

## 🎥 Format vidéo recommandé

Pour des vidéos optimales :

```
Format    : MP4 (H.264)
Résolution: 1920x1080 (Full HD)
Bitrate   : 8-12 Mbps
Audio     : AAC, 128-192 kbps
Taille max: 1GB (ajustable)
Durée     : 10-60 secondes (optimal)
```

**Compresser avec FFmpeg** :
```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -preset slow -crf 20 \
  -c:a aac -b:a 128k \
  -vf scale=1920:1080 \
  output.mp4
```

---

## 🎯 Architecture du système

```
┌─────────────────────────────────────────────────┐
│  CLIENT (React)                                 │
│  ↓                                              │
│  http://localhost:5000/admin                    │
│  • Upload vidéo MP4                             │
│  • Formulaire : titre, description              │
└────────────────────┬────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────┐
│  SERVER (Express + tRPC)                       │
│  ↓                                             │
│  server/upload.ts                              │
│  • Reçoit le fichier (multer)                  │
│  • Appelle supabase-storage.ts                 │
└────────────────────┬───────────────────────────┘
                     ↓
┌────────────────────────────────────────────────┐
│  SUPABASE STORAGE                              │
│  ↓                                             │
│  Bucket: jenia-videos (public)                 │
│  • Stockage des vidéos                         │
│  • Génération URL publique                     │
│  • Diffusion CDN                               │
└────────────────────┬───────────────────────────┘
                     ↓
┌────────────────────────────────────────────────┐
│  BASE DE DONNÉES MySQL                         │
│  ↓                                             │
│  Table: videos                                 │
│  • id, title, description                      │
│  • videoUrl (URL Supabase)                     │
│  • thumbnailUrl, displayOrder                  │
└────────────────────────────────────────────────┘
```

---

## ✅ Checklist rapide

- [ ] `pnpm install` ✅
- [ ] Supabase configuré ✅
- [ ] `.env` rempli ✅
- [ ] `pnpm test:supabase` passe ✅
- [ ] `pnpm dev` fonctionne ✅
- [ ] Upload vidéo testé ✅
- [ ] Vidéo affichée ✅
- [ ] Déployé sur Vercel ✅

---

## 🆘 Aide rapide

| Problème | Solution |
|----------|----------|
| ❌ Bucket not found | Créer bucket "jenia-videos" PUBLIC dans Supabase |
| ❌ Upload failed | Vérifier clés API dans `.env` + policies RLS |
| ❌ Vidéo ne s'affiche pas | Bucket doit être PUBLIC, tester URL directement |
| ❌ Script test échoue | Vérifier TOUTES les variables dans `.env` |
| ❌ Build Vercel échoue | Vérifier variables d'env dans Vercel dashboard |

---

## 📚 Documentation

| Document | Usage |
|----------|-------|
| **[MIGRATION_SUPABASE.md](./MIGRATION_SUPABASE.md)** | 👉 **COMMENCER ICI** |
| [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) | Configuration détaillée Supabase |
| [README.md](./README.md) | Documentation complète |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Déployer sur Vercel |
| [QUICKSTART.md](./QUICKSTART.md) | Démarrage 5 minutes |
| [TODO.md](./TODO.md) | Checklist actions |

---

## 🎬 Bon courage pour Declics Saison 2 !

**Vous avez maintenant un portfolio professionnel avec :**
- ✅ Upload vidéos HD jusqu'à 1GB
- ✅ Hébergement fiable sur Supabase
- ✅ Interface admin intuitive
- ✅ Prêt pour la production sur Vercel

**Il vous reste une semaine** - Vous allez y arriver ! 💪

---

## 📧 Support

Email : studio.jenia@gmail.com
LinkedIn : [Charles Henri Marraud des Grottes](https://www.linkedin.com/in/charleshenrimarrauddesgrottes/)

```
 ██╗███████╗███╗   ██╗██╗ █████╗ 
 ██║██╔════╝████╗  ██║██║██╔══██╗
 ██║█████╗  ██╔██╗ ██║██║███████║
 ██║██╔══╝  ██║╚██╗██║██║██╔══██║
 ██║███████╗██║ ╚████║██║██║  ██║
 ╚═╝╚══════╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝
```
