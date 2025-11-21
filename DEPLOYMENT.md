# Guide de Déploiement Vercel - Jenia Portfolio

Ce guide vous explique comment déployer votre portfolio Jenia sur Vercel avec Supabase.

## Prérequis

- ✅ Compte Vercel (gratuit sur [vercel.com](https://vercel.com))
- ✅ Projet Supabase configuré (voir section Configuration Supabase)
- ✅ Code source prêt à déployer

## Configuration Supabase

### 1. Créer/Vérifier le Bucket Storage

1. Accédez à [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet "site internet Jenia"
3. Allez dans **Storage** → **Buckets**
4. Si le bucket `videos` n'existe pas:
   - Cliquez sur **New Bucket**
   - Nom: `videos`
   - ✅ Cochez **Public bucket**
   - Cliquez sur **Create bucket**

### 2. Configurer les Politiques RLS

Le bucket doit permettre les uploads via le SERVICE_ROLE_KEY. Deux options:

**Option A: Désactiver RLS (Plus simple)**
```sql
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

**Option B: Créer des politiques (Recommandé)**
```sql
-- Autoriser uploads via service role
CREATE POLICY "Allow authenticated uploads to videos bucket"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'videos');

-- Autoriser lecture publique
CREATE POLICY "Allow public read access to videos bucket"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'videos');

-- Autoriser suppression via service role
CREATE POLICY "Allow authenticated deletes to videos bucket"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'videos');
```

### 3. Créer les Tables de Base de Données

Exécutez le script SQL suivant dans **SQL Editor**:

```sql
-- Créer l'enum pour les rôles
CREATE TYPE "public"."role" AS ENUM('user', 'admin');

-- Table users
CREATE TABLE "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "openId" varchar(64) NOT NULL UNIQUE,
  "name" text,
  "email" varchar(320),
  "loginMethod" varchar(64),
  "role" "role" DEFAULT 'user' NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  "lastSignedIn" timestamp DEFAULT now() NOT NULL
);

-- Table videos
CREATE TABLE "videos" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" varchar(255) NOT NULL,
  "description" text,
  "videoUrl" text NOT NULL,
  "thumbnailUrl" text,
  "fileKey" varchar(512) NOT NULL,
  "duration" integer,
  "isActive" boolean DEFAULT true NOT NULL,
  "displayOrder" integer DEFAULT 0 NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Table projects (future use)
CREATE TABLE "projects" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" varchar(255) NOT NULL,
  "description" text,
  "clientName" varchar(255),
  "storyboardImageUrl" text,
  "loraTrainingDetails" text,
  "workflowDescription" text,
  "finalVideoUrl" text,
  "isPublished" boolean DEFAULT false NOT NULL,
  "displayOrder" integer DEFAULT 0 NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Table services (future use)
CREATE TABLE "services" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(255) NOT NULL,
  "description" text NOT NULL,
  "features" text NOT NULL,
  "priceDescription" varchar(255),
  "isActive" boolean DEFAULT true NOT NULL,
  "displayOrder" integer DEFAULT 0 NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Créer un utilisateur admin par défaut
INSERT INTO users (openId, name, email, role) 
VALUES ('admin-default', 'Admin Jenia', 'admin@jenia.com', 'admin')
ON CONFLICT (openId) DO UPDATE SET role = 'admin';
```

## Déploiement sur Vercel

### 1. Installation et Connexion

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login
```

### 2. Premier Déploiement

```bash
# Depuis le dossier du projet
cd i:\jenia-portfolio

# Lancer le déploiement
vercel

# Suivez les instructions:
# - Set up and deploy? Yes
# - Which scope? Sélectionnez votre compte
# - Link to existing project? No
# - Project name? jenia-portfolio (ou autre)
# - Directory? ./ (confirmer)
# - Override settings? No
```

### 3. Configuration des Variables d'Environnement

#### Via Dashboard Vercel

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet `jenia-portfolio`
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez les variables suivantes:

**Variables Supabase (Backend)**
```
SUPABASE_URL = https://dmqffcyiclqxqzfkdijy.supabase.co
SUPABASE_SERVICE_ROLE_KEY = [votre-service-role-key]
SUPABASE_ANON_KEY = [votre-anon-key]
DATABASE_URL = postgresql://postgres:[password]@db.dmqffcyiclqxqzfkdijy.supabase.co:5432/postgres
```

**Variables Supabase (Frontend)**
```
VITE_SUPABASE_URL = https://dmqffcyiclqxqzfkdijy.supabase.co
VITE_SUPABASE_ANON_KEY = [votre-anon-key]
```

**Variables Application**
```
VITE_APP_TITLE = Jenia
VITE_APP_LOGO = /logo.svg
NODE_ENV = production
```

**Variables OAuth (Optionnel)**
```
JWT_SECRET = [génerer un secret aléatoire]
OAUTH_SERVER_URL = https://api.manus.im
VITE_OAUTH_PORTAL_URL = https://auth.manus.im
OWNER_OPEN_ID = [votre-open-id]
OWNER_NAME = [votre-nom]
```

> **Note**: Pour chaque variable, sélectionnez **Production**, **Preview**, et **Development**

#### Via CLI (Alternative)

```bash
vercel env add SUPABASE_URL production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add SUPABASE_ANON_KEY production
# ... etc
```

### 4. Déploiement en Production

```bash
# Déployer en production
vercel --prod
```

### 5. Obtenir les Credentials Supabase

1. Dashboard Supabase → **Settings** → **API**
   - `SUPABASE_URL` = Project URL
   - `SUPABASE_ANON_KEY` = anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role key (⚠️ CONFIDENTIEL)

2. Dashboard Supabase → **Settings** → **Database** → **Connection string**
   - Sélectionnez **URI**
   - Copiez l'URL complète pour `DATABASE_URL`

## Vérification Post-Déploiement

### 1. Vérifier le Site

1. Ouvrez l'URL Vercel de votre projet (ex: `https://jenia-portfolio.vercel.app`)
2. La page d'accueil devrait s'afficher
3. Testez la navigation

### 2. Tester l'Administration

1. Accédez à `/admin`
2. Si OAuth est configuré, connectez-vous
3. Sinon, modifiez temporairement le code pour permettre l'accès
4. Testez l'upload d'une vidéo:
   - Sélectionnez un fichier MP4
   - Remplissez titre et description
   - Cliquez sur "Enregistrer"
   - Vérifiez qu'elle apparaît sur la page d'accueil

### 3. Consulter les Logs

```bash
# Via CLI
vercel logs [deployment-url]

# Ou via Dashboard
# Vercel Dashboard → Deployments → [sélectionner un déploiement] → Runtime Logs
```

## Dépannage

### Upload de Vidéo Échoue

**Erreur**: "new row violates row-level security policy"

**Solution**: Vérifiez les politiques RLS du bucket `videos` (voir section Configuration Supabase)

### Erreur 500 au Démarrage

**Erreur**: "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined"

**Solution**: Vérifiez que toutes les variables d'environnement sont configurées dans Vercel

### Build Échoue

**Erreur**: TypeScript errors

**Solution**: 
```bash
# Testez le build localement
pnpm run build

# Corrigez les erreurs TypeScript
pnpm run check
```

### Authentification Admin ne Fonctionne Pas

**Solution**: Si vous n'utilisez pas OAuth Manus, vous pouvez:
1. Désactiver temporairement l'authentification dans `server/routers.ts`
2. Ou créer un système d'authentification simple
3. Ou utiliser les variables OAuth Manus si vous avez accès

## Commandes Utiles

```bash
# Lister les déploiements
vercel ls

# Afficher les détails d'un déploiement
vercel inspect [deployment-url]

# Afficher les variables d'environnement
vercel env ls

# Supprimer un déploiement
vercel remove [deployment-url]

# Promouvoir un déploiement en production
vercel promote [deployment-url]
```

## Mises à Jour Futures

Pour déployer des modifications:

```bash
# Commit vos changements
git add .
git commit -m "Description des changements"

# Déployer
vercel --prod
```

Ou configurez le déploiement automatique via Git:
1. Vercel Dashboard → Project Settings → Git
2. Connectez votre repository GitHub/GitLab
3. Configurez la branche de production (ex: `main`)
4. Chaque push déclenchera un déploiement automatique

## Support

- **Documentation Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Documentation Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Logs en temps réel**: `vercel logs --follow`
