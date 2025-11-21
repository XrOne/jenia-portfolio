# 🔧 Guide de Dépannage - Accès Admin Bloqué

## ⚠️ Problème

L'accès à `/admin` est bloqué et vous êtes redirigé vers la page d'accueil.

## 🔍  Diagnostic

Il y a **deux étapes** pour avoir l'accès admin :

### Étape 1 : Compte Supabase Auth (Authentification)
Vous avez besoin d'un compte utilisateur dans **Supabase Auth**

### Étape 2 : Rôle Admin dans la BD (Autorisation)
Le compte doit avoir `role='admin'` dans la table `users`

**Le problème actuel** : L'étape 1 ou 2 n'est pas complétée.

## ✅ Solution : Configuration Manuelle

### 1️⃣ Créer le Compte Supabase Auth

1. Allez sur [Supabase Dashboard](https://supabase.com/dashboard/project/dmqffcyiclqxqzfkdijy)
2. Cliquez sur **Authentication** → **Users**
3. Cliquez "**Add user**" → "**Create new user**"
4. Remplissez :
   - **Email**: `bch.film@gmail.com`
   - **Password**: `Admin123!Jenia`
   - ✅ Cochez "**Auto Confirm User**"
5. Cliquez "**Create user**"

### 2️⃣ Attribuer le Rôle Admin dans la BD

1. Dans Supabase Dashboard, allez sur **SQL Editor**
2. Cliquez "**New query**"
3. Copiez-collez le script suivant :

```sql
INSERT INTO users (openId, name, email, role, loginMethod, "createdAt", "updatedAt")
VALUES (
  'bch.film@gmail.com',
  'Admin Jenia',
  'bch.film@gmail.com',
  'admin',
  'email',
  NOW(),
  NOW()
)
ON CONFLICT (openId) 
DO UPDATE SET 
  role = 'admin',
  "updatedAt" = NOW();
```

4. Cliquez "**Run**"
5. Vérifiez avec :
```sql
SELECT id, name, email, role FROM users WHERE role = 'admin';
```

### 3️⃣ Vérifier les Variables d'Environnement Vercel

1. Allez sur [Vercel Dashboard](https://vercel.com/studio-jenia/jenia-portfolio/settings/environment-variables)
2. Vérifiez que ces variables existent :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `DATABASE_URL`

3. Si elles manquent, ajoutez-les depuis le fichier `.env` local

### 4️⃣ Redéployer Vercel

Après avoir ajouté les variables d'environnement :
1. Allez sur **Deployments**
2. Cliquez sur les **...** du dernier déploiement
3. Cliquez "**Redeploy**"

## 🎯 Test de Connexion

Une fois les étapes ci-dessus complétées :

1. Allez sur `https://jenia-portfolio-git-main-studio-jenia.vercel.app/admin`
2. Connectez-vous avec :
   - **Email**: `bch.film@gmail.com`
   - **Password**: `Admin123!Jenia`
3. Vous devriez accéder au dashboard

## 📝 Fichiers de Référence

- Script SQL direct : [`CREATE_ADMIN.sql`](file:///i:/jenia-portfolio/CREATE_ADMIN.sql)
- Script Node.js (si env configuré) : [`create-admin-user.mjs`](file:///i:/jenia-portfolio/create-admin-user.mjs)
