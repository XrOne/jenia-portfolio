# Jenia - Portfolio Vidéo Générative

<<<<<<< HEAD
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
=======
Portfolio minimaliste avec vidéos en arrière-plan plein écran, construit avec React, Vite, Express, et Supabase.

## 🎯 Fonctionnalités

- **Design Minimaliste** : Fond noir avec vidéos plein écran
- **Gestion de Vidéos** : Interface admin pour uploader et gérer les vidéos
- **Authentification Sécurisée** : Supabase Auth avec email/password
- **Stockage Cloud** : Supabase Storage pour les vidéos (jusqu'à 2 Go)
- **Base de Données** : PostgreSQL via Supabase
- **Responsive** : Compatible mobile et desktop

## 🛠️ Stack Technique

### Frontend
- React 19
- Vite 7
- TypeScript
- Tailwind CSS 4
- Wouter (routing)
- Framer Motion (animations)
- shadcn/ui (composants)

### Backend
- Express
- tRPC
- Supabase (Auth + Database + Storage)
- Drizzle ORM

## 📦 Installation Locale

### Prérequis
- Node.js 22+
- pnpm 10+

### Étapes

1. **Cloner le repository**
   ```bash
   git clone https://github.com/XrOne/jenia-portfolio.git
   cd jenia-portfolio
   ```

2. **Installer les dépendances**
   ```bash
   pnpm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   # Éditer .env avec vos clés Supabase
   ```

4. **Lancer en développement**
   ```bash
   pnpm dev
   ```

5. **Accéder au site**
   - Site : http://localhost:3000
   - Admin : http://localhost:3000/admin

## 🚀 Déploiement

Consultez le [Guide de Déploiement](./GUIDE_DEPLOIEMENT.md) pour des instructions détaillées.

### Déploiement Rapide sur Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/XrOne/jenia-portfolio)

N'oubliez pas de configurer les variables d'environnement !

## 🔐 Authentification

### Connexion Admin

Par défaut, un utilisateur admin est créé avec :
- **Email** : bch.film@gmail.com
- **Mot de passe** : Admin123!Jenia

⚠️ **Changez ce mot de passe immédiatement après le premier déploiement !**

### Créer un Nouvel Utilisateur Admin

```bash
# Modifier create-admin-user.mjs avec le nouvel email/password
node create-admin-user.mjs
```

## 📁 Structure du Projet

```
jenia-portfolio/
├── client/               # Frontend React
│   ├── src/
│   │   ├── pages/       # Pages (Home, Admin, etc.)
│   │   ├── components/  # Composants React
│   │   └── lib/         # Utilitaires
│   └── index.html
├── server/              # Backend Express
│   ├── _core/          # Configuration serveur
│   ├── routers.ts      # Routes tRPC
│   ├── db.ts           # Opérations base de données
│   └── upload.ts       # Gestion uploads
├── drizzle/            # Schémas base de données
├── .env.example        # Template variables d'environnement
├── GUIDE_DEPLOIEMENT.md # Guide de déploiement
└── PROJET_STATUS.md    # Statut du projet
```

## 🎨 Personnalisation

### Changer le Titre

Modifiez `VITE_APP_TITLE` dans `.env` :
```
VITE_APP_TITLE=Votre Nom
```

### Changer les Liens Sociaux

Éditez `client/src/pages/Home.tsx` :
```tsx
<a href="https://linkedin.com/in/votre-profil">
<a href="mailto:votre@email.com">
```

### Personnaliser le Design

Les styles sont dans `client/src/index.css` et utilisent Tailwind CSS.

## 📊 Base de Données

### Tables

- **users** : Utilisateurs et rôles
- **videos** : Métadonnées des vidéos
- **projects** : Projets/démos (futur)
- **services** : Services offerts (futur)

### Migrations

```bash
pnpm db:push
```

## 🔧 Scripts Disponibles

```bash
pnpm dev          # Développement
pnpm build        # Build production
pnpm start        # Démarrer en production
pnpm check        # Vérification TypeScript
pnpm format       # Formater le code
pnpm test         # Tests
```

## 🐛 Dépannage

### Problème d'Upload de Vidéos

1. Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est configurée
2. Vérifiez les politiques RLS du bucket `videos` dans Supabase
3. Consultez les logs du serveur

### Erreur de Connexion Admin

1. Vérifiez que l'utilisateur existe dans Supabase Auth
2. Vérifiez le rôle dans la table `users`
3. Vérifiez les Redirect URLs dans Supabase

### Le Site ne se Charge pas

1. Vérifiez que toutes les variables d'environnement sont configurées
2. Vérifiez les logs du serveur
3. Assurez-vous que Supabase est accessible

## 📝 Documentation

- [Guide de Déploiement](./GUIDE_DEPLOIEMENT.md)
- [Statut du Projet](./PROJET_STATUS.md)
- [Variables d'Environnement](./ENV_VARIABLES.md)
- [Todo List](./todo.md)

## 🔒 Sécurité

- ✅ Authentification Supabase Auth
- ✅ RLS activé sur toutes les tables
- ✅ Politiques RLS sur le storage
- ✅ Clés API sécurisées (non versionnées)
- ✅ HTTPS en production
>>>>>>> 0376452c70ef3df260c7497bfa47d52870b390e5

## 📄 Licence

MIT
<<<<<<< HEAD
=======

## 👤 Auteur

Charles-Henri Marraud des Grottes
- LinkedIn : [charleshenrimarrauddesgrottes](https://www.linkedin.com/in/charleshenrimarrauddesgrottes/)
- Email : studio.jenia@gmail.com

## 🙏 Remerciements

- [Supabase](https://supabase.com) pour le backend
- [shadcn/ui](https://ui.shadcn.com) pour les composants
- [Vercel](https://vercel.com) pour l'hébergement
>>>>>>> 0376452c70ef3df260c7497bfa47d52870b390e5
