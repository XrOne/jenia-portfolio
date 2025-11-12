# 🚀 Guide de Déploiement - Jenia Portfolio

Ce guide vous accompagne étape par étape pour déployer votre site sur Vercel.

## Prérequis

- ✅ Compte GitHub
- ✅ Compte Vercel (gratuit)
- ✅ Compte Supabase configuré
- ✅ Base de données MySQL accessible en ligne

## Étape 1 : Préparer votre base de données

### Option A : Base de données MySQL distante
Si vous n'avez pas encore de base MySQL en ligne, voici quelques options :

**PlanetScale** (recommandé, gratuit)
1. Créez un compte sur [planetscale.com](https://planetscale.com)
2. Créez une nouvelle base de données
3. Récupérez la connection string (format : `mysql://user:pass@host/db`)

**Railway** (facile, gratuit)
1. Créez un compte sur [railway.app](https://railway.app)
2. Créez un nouveau projet MySQL
3. Récupérez la connection string

**Aiven** (plan gratuit disponible)
1. Créez un compte sur [aiven.io](https://aiven.io)
2. Créez un service MySQL
3. Récupérez la connection string

### Migrer vos données locales (optionnel)
Si vous avez des vidéos en local :
```bash
# Exporter la base locale
mysqldump -u root -p jenia_portfolio > backup.sql

# Importer dans la base distante
mysql -h hostname -u username -p database_name < backup.sql
```

## Étape 2 : Pousser votre code sur GitHub

### Créer un nouveau repository
1. Allez sur [github.com](https://github.com)
2. Cliquez sur "New repository"
3. Nommez-le : `jenia-portfolio`
4. Choisissez **Private** (recommandé pour les projets professionnels)
5. Ne cochez pas "Initialize with README" (vous en avez déjà un)
6. Cliquez sur "Create repository"

### Pousser votre code
```bash
# Dans le dossier du projet
cd I:\jenia-portfolio

# Initialiser git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Portfolio Jenia"

# Lier au repository GitHub
git remote add origin https://github.com/votre-username/jenia-portfolio.git

# Pousser le code
git branch -M main
git push -u origin main
```

⚠️ **Important** : Vérifiez que le fichier `.env` n'est PAS dans votre repo (il doit être dans `.gitignore`)

## Étape 3 : Déployer sur Vercel

### Configuration initiale
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur **"Add New..." → "Project"**
4. Importez votre repository `jenia-portfolio`

### Configuration du projet
1. **Framework Preset** : None (ou Other)
2. **Root Directory** : `.` (laissez vide)
3. **Build Command** : `pnpm build`
4. **Output Directory** : `dist`
5. **Install Command** : `pnpm install`

### Variables d'environnement
Cliquez sur **"Environment Variables"** et ajoutez :

```env
NODE_ENV=production
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_BUCKET_NAME=jenia-videos
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=votre-secret-jwt-securise-min-32-caracteres
VITE_APP_ID=jenia-portfolio
```

⚠️ **Très important** :
- Copiez-collez exactement vos valeurs depuis votre fichier `.env` local
- Pour `DATABASE_URL`, utilisez votre base de données distante
- Ne partagez jamais ces clés publiquement

### Déployer
1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes
3. ✅ Votre site est en ligne !

## Étape 4 : Configuration post-déploiement

### Configurer le domaine
1. Dans Vercel, allez dans **Settings** > **Domains**
2. Ajoutez votre domaine personnalisé (optionnel)
   - Par exemple : `jenia.studio`
   - Ou utilisez le domaine Vercel : `jenia-portfolio.vercel.app`

### Tester votre site
1. Visitez l'URL fournie par Vercel
2. Testez la page d'accueil
3. Accédez à `/admin` et uploadez une vidéo de test
4. Vérifiez que la vidéo apparaît en arrière-plan

### Vérifier Supabase
1. Allez dans votre dashboard Supabase
2. **Storage** > **jenia-videos**
3. Vous devriez voir vos fichiers uploadés depuis l'admin

## Étape 5 : Optimisations production

### Activer les fonctionnalités Vercel

**Analytics** (recommandé)
1. Dans Vercel : **Analytics** > **Enable**
2. Gratuit, suivez les performances de votre site

**Speed Insights**
1. Dans Vercel : **Speed Insights** > **Enable**
2. Mesurez les Core Web Vitals

### Configurer le cache
Ajoutez dans `vercel.json` (déjà fait) :
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, must-revalidate"
        }
      ]
    }
  ]
}
```

## Étape 6 : Maintenance et mises à jour

### Déployer des changements
```bash
# Faire vos modifications
# ...

# Commit et push
git add .
git commit -m "Description de vos changements"
git push origin main
```

Vercel redéploiera automatiquement ! 🚀

### Surveiller les erreurs
1. Dans Vercel : **Deployments** > Cliquez sur le dernier
2. Consultez les **Build Logs** en cas d'erreur
3. Vérifiez les **Runtime Logs** pour les erreurs serveur

### Rollback en cas de problème
1. Dans Vercel : **Deployments**
2. Trouvez la version stable
3. Cliquez sur **"..."** > **"Promote to Production"**

## 🔒 Sécurité

### Protéger la route admin
Le système vérifie déjà le rôle admin, mais pour plus de sécurité :

1. Créez un utilisateur admin dans votre base :
```sql
INSERT INTO users (openId, name, email, role)
VALUES ('your-open-id', 'Admin', 'admin@jenia.studio', 'admin');
```

2. Configurez OAuth (optionnel mais recommandé)

### Variables sensibles
- ❌ Ne commitez JAMAIS `.env`
- ✅ Utilisez Vercel Environment Variables
- ✅ Régénérez les clés en cas de fuite

### Bucket Supabase
- ✅ Bucket en mode "public" pour les vidéos
- ✅ RLS policies pour limiter l'upload
- ✅ Service role key gardée secrète

## 📊 Surveillance

### Logs Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Voir les logs en temps réel
vercel logs
```

### Supabase Analytics
1. Dashboard Supabase > **Database** > **Query Performance**
2. Surveillez l'utilisation du stockage
3. Plan gratuit : 1GB max

## 🐛 Résolution de problèmes

### Build échoue
```
Error: Build failed
```
**Solutions** :
1. Vérifiez les variables d'env dans Vercel
2. Assurez-vous que `pnpm` est configuré
3. Consultez les logs de build

### Base de données inaccessible
```
Error: Cannot connect to database
```
**Solutions** :
1. Vérifiez `DATABASE_URL` dans Vercel
2. Autorisez l'IP de Vercel dans votre firewall DB
3. Testez la connexion depuis votre machine

### Vidéos ne chargent pas
```
Error: Failed to load video
```
**Solutions** :
1. Vérifiez les URLs dans la base de données
2. Testez l'URL Supabase directement
3. Vérifiez les CORS de Supabase
4. Assurez-vous que le bucket est public

### Upload échoue
```
Error: Upload failed
```
**Solutions** :
1. Vérifiez `SUPABASE_SERVICE_ROLE_KEY`
2. Vérifiez les politiques RLS
3. Vérifiez la taille du fichier (1GB max)
4. Consultez les logs Vercel

## 📈 Mise à l'échelle

### Passer au plan Pro
Si vous avez besoin de plus de ressources :

**Vercel Pro ($20/mois)**
- Build minutes illimités
- Analytics avancées
- Serverless functions optimisées

**Supabase Pro ($25/mois)**
- 100 GB de stockage
- Pas de limite de bande passante
- Support prioritaire

## ✅ Checklist finale

Avant de partager votre site :

- [ ] ✅ Vidéos uploadées et fonctionnelles
- [ ] ✅ Page d'accueil testée
- [ ] ✅ Page Services vérifiée
- [ ] ✅ Interface Admin sécurisée
- [ ] ✅ Liens LinkedIn et Email à jour
- [ ] ✅ Responsive vérifié (mobile/tablette)
- [ ] ✅ SEO configuré (title, meta, favicon)
- [ ] ✅ Analytics activées
- [ ] ✅ Domaine personnalisé (optionnel)

## 🎉 C'est fait !

Votre site est maintenant en ligne ! 

URL de production : `https://votre-projet.vercel.app`

**Partagez-le avec le monde ! 🌍**

---

**Besoin d'aide ?**
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Supabase](https://supabase.com/docs)
- Email : studio.jenia@gmail.com
