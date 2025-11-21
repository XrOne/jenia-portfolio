# Jenia - Portfolio Vidéo Générative

Portfolio interactif pour présenter des vidéos génératives créées avec des techniques d'IA avancées. Interface d'administration pour gérer facilement le contenu.

## 🎯 Fonctionnalités

- ✨ **Portfolio Vidéo**: Galerie élégante de vos créations vidéo
- 🔐 **Administration Sécurisée**: Interface admin pour gérer les vidéos
- 📤 **Upload Optimisé**: Support de gros fichiers (jusqu'à 2GB) avec Supabase Storage
- 🎨 **Design Moderne**: Interface utilisateur responsive et élégante
- ⚡ **Performance**: Build optimisé avec Vite et hébergement sur Vercel

## 🏗️ Architecture Technique

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Express.js + tRPC
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage
- **Authentification**: OAuth Manus (configurable)
- **Styling**: Tailwind CSS + Radix UI
- **Déploiement**: Vercel

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- pnpm (recommandé) ou npm
- Compte Supabase

### Installation

```bash
# Cloner le projet
git clone [votre-repo]
cd jenia-portfolio

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
# Copiez .env.example vers .env et remplissez les valeurs
```

### Configuration

Créez un fichier `.env` à la racine avec:

```env
# Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
SUPABASE_ANON_KEY=votre-anon-key
DATABASE_URL=postgresql://...

# Frontend
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-anon-key
VITE_APP_TITLE=Jenia
```

Consultez [ENV_VARIABLES.md](./ENV_VARIABLES.md) pour la liste complète.

### Développement

```bash
# Lancer le serveur de développement
pnpm run dev

# Le site sera accessible sur http://localhost:3000
```

### Build de Production

```bash
# Compiler le projet
pnpm run build

# Lancer en mode production
pnpm run start
```

## 📦 Déploiement

Consultez le guide détaillé: [DEPLOYMENT.md](./DEPLOYMENT.md)

**Résumé:**
1. Configurez Supabase (base de données + storage)
2. Installez Vercel CLI: `npm install -g vercel`
3. Déployez: `vercel --prod`
4. Configurez les variables d'environnement dans Vercel Dashboard

## 🔧 Configuration Supabase

### Tables Requises

- `users` - Gestion des utilisateurs admin
- `videos` - Métadonnées des vidéos
- `projects` - Projets portfolio (futur)
- `services` - Services offerts (futur)

Scripts SQL disponibles dans `drizzle/0000_clammy_obadiah_stane.sql`

### Storage

Créez un bucket public nommé `videos` pour stocker les fichiers vidéo.

Consultez [SUPABASE_RLS_FIX.md](./SUPABASE_RLS_FIX.md) pour configurer les politiques RLS.

## 🧪 Vérification

```bash
# Vérifier la configuration Supabase
node verify-supabase.mjs

# Vérifier le TypeScript
pnpm run check

# Lancer les tests
pnpm run test
```

## 📝 Scripts Disponibles

- `pnpm run dev` - Serveur de développement
- `pnpm run build` - Build de production
- `pnpm run start` - Lancer la version production
- `pnpm run check` - Vérification TypeScript
- `pnpm run format` - Formatter le code
- `pnpm run test` - Lancer les tests
- `pnpm run db:push` - Migrer la base de données

## 📚 Documentation

- [ENV_VARIABLES.md](./ENV_VARIABLES.md) - Variables d'environnement
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide de déploiement Vercel
- [SUPABASE_RLS_FIX.md](./SUPABASE_RLS_FIX.md) - Configuration Storage Supabase
- [DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md) - Déploiement alternatif sur Railway

## 🤝 Contribution

Ce projet est un portfolio personnel. Les contributions ne sont pas acceptées pour le moment.

## 📄 Licence

MIT
