# Guide de Déploiement - Jenia Portfolio

## 📋 Prérequis

- Compte GitHub
- Compte Vercel ou Railway (gratuit)
- Projet Supabase configuré (déjà fait)
- Node.js 22+ (pour développement local)

## 🚀 Option 1 : Déploiement sur Vercel (Recommandé)

### Étape 1 : Pousser le code sur GitHub

```bash
cd /chemin/vers/jenia-portfolio
git push origin main
```

### Étape 2 : Connecter à Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Add New Project"
3. Importez le repository `XrOne/jenia-portfolio`
4. Configurez le projet :
   - **Framework Preset** : Vite
   - **Root Directory** : `./`
   - **Build Command** : `pnpm build`
   - **Output Directory** : `dist/public`

### Étape 3 : Configurer les Variables d'Environnement

Dans les paramètres Vercel, ajoutez :

```
# Supabase Backend
SUPABASE_URL=https://dmqffcyiclqxqzfkdijy.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres...

# Supabase Frontend
VITE_SUPABASE_URL=https://dmqffcyiclqxqzfkdijy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application
VITE_APP_TITLE=Jenia
VITE_APP_LOGO=/logo.svg
```

### Étape 4 : Déployer

Cliquez sur "Deploy" et attendez la fin du déploiement.

## 🚂 Option 2 : Déploiement sur Railway

### Étape 1 : Créer un nouveau projet

1. Allez sur [railway.app](https://railway.app)
2. Cliquez sur "New Project"
3. Sélectionnez "Deploy from GitHub repo"
4. Choisissez `XrOne/jenia-portfolio`

### Étape 2 : Configurer les Variables

Ajoutez les mêmes variables que pour Vercel (voir ci-dessus)

### Étape 3 : Configurer le Build

Railway détecte automatiquement le projet Node.js. Vérifiez que :
- **Build Command** : `pnpm build`
- **Start Command** : `pnpm start`

## 🔧 Configuration Post-Déploiement

### 1. Configurer les Redirect URLs dans Supabase

1. Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez le projet "site internet Jenia"
3. Allez dans **Authentication → URL Configuration**
4. Ajoutez votre URL de déploiement dans **Redirect URLs** :
   ```
   https://votre-site.vercel.app
   https://votre-site.vercel.app/**
   ```

### 2. Tester la Connexion Admin

1. Allez sur `https://votre-site.vercel.app/admin`
2. Connectez-vous avec :
   - Email : `bch.film@gmail.com`
   - Mot de passe : `Admin123!Jenia`
3. ⚠️ **Changez immédiatement le mot de passe**

### 3. Uploader une Vidéo de Test

1. Dans l'interface admin, cliquez sur "Ajouter une vidéo"
2. Remplissez les informations
3. Uploadez une vidéo (max 2 Go)
4. Vérifiez qu'elle s'affiche sur la page d'accueil

## 🔐 Sécurité Post-Déploiement

### Changer le Mot de Passe Admin

Vous pouvez changer le mot de passe via Supabase Dashboard :

1. Allez dans **Authentication → Users**
2. Trouvez l'utilisateur `bch.film@gmail.com`
3. Cliquez sur les 3 points → **Reset Password**
4. Envoyez un email de réinitialisation

Ou via SQL :

```sql
-- Dans le SQL Editor de Supabase
UPDATE auth.users 
SET encrypted_password = crypt('VotreNouveauMotDePasse', gen_salt('bf'))
WHERE email = 'bch.film@gmail.com';
```

### Créer des Utilisateurs Supplémentaires

Utilisez le script fourni :

```bash
# Modifier l'email et le mot de passe dans create-admin-user.mjs
node create-admin-user.mjs
```

## 🐛 Dépannage

### Le site ne se charge pas

1. Vérifiez les logs de déploiement
2. Assurez-vous que toutes les variables d'environnement sont configurées
3. Vérifiez que le build s'est terminé sans erreur

### L'upload de vidéos ne fonctionne pas

1. Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est configurée
2. Vérifiez les politiques RLS du bucket `videos`
3. Consultez les logs du serveur

### La connexion admin ne fonctionne pas

1. Vérifiez que l'utilisateur existe dans Supabase Auth
2. Vérifiez que le rôle est bien `admin` dans la table `users`
3. Vérifiez les Redirect URLs dans Supabase

## 📊 Monitoring

### Logs Vercel

```bash
vercel logs votre-projet
```

### Logs Railway

Disponibles directement dans le dashboard Railway

### Logs Supabase

1. Allez dans **Logs** dans le dashboard Supabase
2. Filtrez par service (Database, Auth, Storage)

## 🔄 Mises à Jour

### Déployer une Nouvelle Version

```bash
git add .
git commit -m "Description des changements"
git push origin main
```

Vercel/Railway redéploiera automatiquement.

## 📞 Support

Pour toute question ou problème :
- Consultez `PROJET_STATUS.md` pour l'état actuel
- Consultez `todo.md` pour l'historique des modifications
- Vérifiez les logs de déploiement

## ✅ Checklist de Déploiement

- [ ] Code poussé sur GitHub
- [ ] Projet créé sur Vercel/Railway
- [ ] Variables d'environnement configurées
- [ ] Redirect URLs ajoutées dans Supabase
- [ ] Premier déploiement réussi
- [ ] Connexion admin testée
- [ ] Mot de passe admin changé
- [ ] Upload de vidéo testé
- [ ] Vidéo affichée sur la page d'accueil
- [ ] Liens LinkedIn et Email vérifiés
