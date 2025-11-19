# Jenia - Portfolio Vidéo Générative

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

## 📄 Licence

MIT

## 👤 Auteur

Charles-Henri Marraud des Grottes
- LinkedIn : [charleshenrimarrauddesgrottes](https://www.linkedin.com/in/charleshenrimarrauddesgrottes/)
- Email : studio.jenia@gmail.com

## 🙏 Remerciements

- [Supabase](https://supabase.com) pour le backend
- [shadcn/ui](https://ui.shadcn.com) pour les composants
- [Vercel](https://vercel.com) pour l'hébergement
