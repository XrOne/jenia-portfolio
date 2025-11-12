# 🎬 Jenia - Portfolio Vidéo Générative IA

Site portfolio professionnel pour présenter vos créations vidéo générées par intelligence artificielle. Design minimaliste avec vidéos en plein écran.

![Jenia Preview](https://via.placeholder.com/800x400/000000/FFFFFF?text=Jenia+Portfolio)

---

## 🚀 NOUVEAU : Migration vers Supabase terminée !

**👉 COMMENCEZ ICI** : [START_HERE.md](./START_HERE.md) ou [MIGRATION_SUPABASE.md](./MIGRATION_SUPABASE.md)

Votre projet est maintenant configuré pour utiliser **Supabase Storage** au lieu du système Manus/Forge.

### Actions immédiates :
1. `pnpm install` - Installer les dépendances
2. Configurer Supabase (5 minutes) → [MIGRATION_SUPABASE.md](./MIGRATION_SUPABASE.md)
3. Remplir le fichier `.env` avec vos credentials
4. `pnpm test:supabase` - Tester la configuration
5. `pnpm dev` - Lancer le serveur

---

## ✨ Fonctionnalités

- 🎥 **Arrière-plan vidéo dynamique** - Vidéos en plein écran avec transition automatique
- 📱 **Responsive** - Design adaptatif mobile/tablette/desktop
- 🎨 **Interface Admin** - Gestion facile des vidéos
- ☁️ **Supabase Storage** - Hébergement vidéos haute qualité (jusqu'à 1GB)
- 🚀 **Optimisé** - Chargement progressif et buffering intelligent
- 🔒 **Sécurisé** - Authentification et protection des routes admin

## 🛠 Stack Technique

### Frontend
- **React 19** + **TypeScript**
- **Tailwind CSS** - Design utility-first
- **Framer Motion** - Animations fluides
- **Wouter** - Routing léger
- **tRPC** - Type-safe API

### Backend
- **Express** - Serveur Node.js
- **Drizzle ORM** - Base de données MySQL
- **Supabase Storage** - Stockage vidéos
- **Multer** - Upload de fichiers

### DevOps
- **Vite** - Build tool ultra-rapide
- **pnpm** - Gestionnaire de packages
- **Vercel** - Déploiement

## 📦 Installation

### Prérequis
- Node.js 18+
- pnpm (ou npm)
- Compte Supabase (gratuit)
- Base de données MySQL

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/jenia-portfolio.git
cd jenia-portfolio
```

### 2. Installer les dépendances
```bash
pnpm install
```

### 3. Configurer Supabase
Suivez le guide détaillé : **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

Résumé rapide :
1. Créez un projet sur [supabase.com](https://supabase.com)
2. Créez un bucket public `jenia-videos`
3. Configurez les politiques RLS
4. Récupérez vos clés API

### 4. Configurer les variables d'environnement
Copiez et remplissez le fichier `.env` :
```bash
cp .env.example .env
```

Éditez `.env` avec vos credentials :
```env
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-key
SUPABASE_BUCKET_NAME=jenia-videos

# Base de données
DATABASE_URL=mysql://user:password@host:port/database

# JWT Secret (générez une chaîne aléatoire)
JWT_SECRET=votre-secret-jwt-min-32-caracteres
```

### 5. Configurer la base de données
```bash
pnpm db:push
```

### 6. Lancer en développement
```bash
pnpm dev
```

Le site sera accessible sur `http://localhost:5000`

## 🎯 Utilisation

### Ajouter des vidéos
1. Accédez à l'interface admin : `http://localhost:5000/admin`
2. Cliquez sur "Ajouter une vidéo"
3. Remplissez le formulaire :
   - **Titre** : Nom de la vidéo
   - **Description** : (optionnel)
   - **Fichier vidéo** : Votre vidéo (jusqu'à 1GB)
   - **Miniature** : (optionnel) Image de prévisualisation
   - **Ordre** : Position dans le carrousel
4. Cliquez sur "Enregistrer"

### Formats vidéo recommandés
- **Format** : MP4 (H.264)
- **Résolution** : 1920x1080 (Full HD) recommandé
- **Bitrate** : 8-12 Mbps
- **Durée** : 10-60 secondes pour un chargement optimal

### Compresser vos vidéos
Pour optimiser le poids et la qualité :
```bash
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 20 -c:a aac -b:a 128k -vf scale=1920:1080 output.mp4
```

## 🚀 Déploiement sur Vercel

### Méthode 1 : Via GitHub (recommandé)
1. Poussez votre code sur GitHub
2. Allez sur [vercel.com](https://vercel.com)
3. Cliquez sur "New Project"
4. Importez votre repo GitHub
5. Configurez les variables d'environnement :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `SUPABASE_BUCKET_NAME`
6. Cliquez sur "Deploy"

### Méthode 2 : Via Vercel CLI
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

### Configuration des variables d'environnement
Dans Vercel Dashboard :
1. Allez dans **Settings** > **Environment Variables**
2. Ajoutez toutes les variables de votre fichier `.env`
3. ⚠️ Utilisez des secrets pour les clés sensibles

## 📁 Structure du projet

```
jenia-portfolio/
├── client/                 # Frontend React
│   ├── public/            # Assets statiques
│   └── src/
│       ├── components/    # Composants React
│       ├── pages/         # Pages du site
│       ├── lib/           # Utilitaires
│       └── App.tsx        # Composant principal
├── server/                 # Backend Express
│   ├── _core/             # Configuration serveur
│   ├── routers.ts         # Routes tRPC
│   ├── upload.ts          # Gestion uploads
│   └── supabase-storage.ts # Module Supabase
├── drizzle/               # Schéma base de données
├── shared/                # Code partagé
├── .env                   # Variables d'environnement
└── package.json           # Dépendances
```

## 🎨 Personnalisation

### Modifier les couleurs
Éditez `client/src/index.css` :
```css
:root {
  --primary: 220 90% 56%;
  --secondary: 260 60% 65%;
  /* ... autres couleurs */
}
```

### Changer le logo/titre
Éditez `client/src/pages/Home.tsx` :
```tsx
<h1 className="text-9xl font-bold text-white">
  Votre Nom
</h1>
```

### Modifier les services
Éditez `client/src/pages/Services.tsx` pour ajuster vos offres.

### Personnaliser l'admin
Éditez `client/src/pages/Admin.tsx` pour adapter l'interface.

## 🔧 Scripts disponibles

```bash
pnpm dev          # Lancer en développement
pnpm build        # Build pour production
pnpm start        # Lancer en production
pnpm check        # Vérifier TypeScript
pnpm format       # Formater le code
pnpm test         # Lancer les tests
pnpm db:push      # Mettre à jour la base de données
```

## 🐛 Dépannage

### Les vidéos ne se chargent pas
1. Vérifiez que votre bucket Supabase est **public**
2. Testez l'URL directement dans le navigateur
3. Vérifiez les politiques RLS dans Supabase
4. Consultez la console du navigateur pour les erreurs

### Erreur d'upload
1. Vérifiez vos clés API dans `.env`
2. Assurez-vous que le bucket existe
3. Vérifiez la taille du fichier (max 1GB par défaut)
4. Consultez les logs serveur : `pnpm dev`

### Erreur de base de données
1. Vérifiez votre `DATABASE_URL`
2. Lancez les migrations : `pnpm db:push`
3. Vérifiez que MySQL est bien accessible

### Build échoue sur Vercel
1. Vérifiez que toutes les variables d'environnement sont définies
2. Assurez-vous que `pnpm` est bien configuré comme package manager
3. Consultez les logs de build Vercel

## 📝 TODO / Améliorations futures

- [ ] Formulaire de contact fonctionnel
- [ ] Gestion des projets/démos
- [ ] Système de tags/catégories pour les vidéos
- [ ] Analytics (vues, durée de visionnage)
- [ ] Support multilingue
- [ ] Mode sombre/clair
- [ ] Galerie d'images
- [ ] Blog intégré

## 📄 Licence

MIT License - Libre d'utilisation

## 👤 Auteur

**Studio Jenia**
- LinkedIn: [Charles Henri Marraud des Grottes](https://www.linkedin.com/in/charleshenrimarrauddesgrottes/)
- Email: studio.jenia@gmail.com

## 🙏 Remerciements

Créé avec Manus.im - Template base adaptée pour portfolio vidéo IA.

---

**Bon courage pour votre saison 2 de Declics ! 🎬**
