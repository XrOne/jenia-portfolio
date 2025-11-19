# Guide de Déploiement sur Railway

Ce guide vous explique comment déployer votre site **Jenia** sur Railway, une plateforme stable et performante qui supporte parfaitement les applications Node.js avec upload de fichiers volumineux.

## Pourquoi Railway ?

Railway offre plusieurs avantages par rapport à l'environnement Manus actuel :

**Stabilité et performance** : Railway utilise une infrastructure cloud professionnelle sans les limitations de l'environnement sandbox. Votre serveur ne crashera plus lors de l'upload de vidéos volumineuses, car Railway gère correctement les fichiers jusqu'à 5 GB sans problème de mémoire.

**Base de données PostgreSQL incluse** : Railway fournit gratuitement une base de données PostgreSQL compatible avec votre configuration Supabase actuelle. Vous pouvez soit continuer à utiliser Supabase, soit migrer vers la base de données Railway pour simplifier votre architecture.

**Déploiement automatique depuis GitHub** : Chaque fois que vous poussez du code sur votre repository GitHub, Railway redéploie automatiquement votre site. Plus besoin de créer des checkpoints manuellement comme avec Manus.

**Support natif de Node.js et Express** : Railway détecte automatiquement votre application Node.js et configure l'environnement correctement. Aucune configuration complexe n'est nécessaire.

## Prérequis

Avant de commencer, assurez-vous d'avoir :

- Un compte GitHub (gratuit) avec votre code déjà poussé sur un repository
- Un compte Railway (gratuit, créez-le sur [railway.app](https://railway.app))
- Vos clés Supabase à portée de main (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY)

## Étape 1 : Préparer le projet

Votre projet est déjà prêt pour Railway, mais vérifions quelques points importants.

### Vérifier le fichier package.json

Railway utilise le script `start` pour lancer votre application en production. Votre `package.json` doit contenir :

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx watch server/_core/index.ts",
    "build": "tsc && vite build",
    "start": "NODE_ENV=production node dist/server/_core/index.js"
  }
}
```

Si le script `start` n'existe pas, Railway utilisera automatiquement `npm run dev`, ce qui fonctionne également mais est moins optimisé pour la production.

### Créer le fichier railway.toml (optionnel)

Railway détecte automatiquement les applications Node.js, mais vous pouvez créer un fichier `railway.toml` pour plus de contrôle :

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "pnpm run start"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

Ce fichier indique à Railway d'utiliser `pnpm` (plus rapide que `npm`) et de redémarrer automatiquement le serveur en cas d'erreur.

## Étape 2 : Créer un nouveau projet sur Railway

Connectez-vous à [railway.app](https://railway.app) et suivez ces étapes :

1. Cliquez sur **"New Project"** dans le dashboard Railway
2. Sélectionnez **"Deploy from GitHub repo"**
3. Autorisez Railway à accéder à votre compte GitHub si ce n'est pas déjà fait
4. Sélectionnez le repository **"generative-video-portfolio"** (ou le nom que vous avez donné)
5. Railway commence automatiquement le déploiement

Railway va maintenant cloner votre repository, installer les dépendances avec `pnpm install`, et démarrer votre serveur. Le premier déploiement prend généralement entre deux et cinq minutes.

## Étape 3 : Configurer les variables d'environnement

Une fois le déploiement initial terminé, vous devez configurer les variables d'environnement. Cliquez sur votre projet dans Railway, puis sur l'onglet **"Variables"**.

### Variables Supabase (obligatoires)

Ajoutez ces variables pour que votre application puisse se connecter à Supabase :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `SUPABASE_URL` | `https://dmqffcyiclqxqzfkdijy.supabase.co` | URL de votre projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` (votre clé) | Clé admin qui contourne RLS |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` (votre clé) | Clé publique pour le frontend |
| `DATABASE_URL` | `postgresql://postgres...` | URL de connexion PostgreSQL Supabase |

Pour obtenir `DATABASE_URL`, allez dans votre dashboard Supabase → Settings → Database → Connection string (mode "URI").

### Variables d'authentification Manus (optionnelles)

Si vous voulez conserver l'authentification Manus OAuth, ajoutez également :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `JWT_SECRET` | `votre-secret-jwt` | Secret pour signer les tokens de session |
| `OAUTH_SERVER_URL` | `https://api.manus.im` | URL du serveur OAuth Manus |
| `VITE_OAUTH_PORTAL_URL` | `https://auth.manus.im` | URL du portail de connexion |
| `OWNER_OPEN_ID` | `votre-open-id` | Votre identifiant Manus |
| `OWNER_NAME` | `Charles-Henri Marraud des Grottes` | Votre nom |

**Note importante** : Si vous ne configurez pas ces variables, l'authentification admin ne fonctionnera pas. Vous pouvez soit les configurer, soit désactiver temporairement l'authentification dans le code pour tester le déploiement.

### Variables frontend (obligatoires)

Ces variables sont utilisées par le frontend Vite :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `VITE_SUPABASE_URL` | `https://dmqffcyiclqxqzfkdijy.supabase.co` | URL Supabase pour le frontend |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` (votre clé anon) | Clé publique Supabase |
| `VITE_APP_TITLE` | `Jenia` | Titre de l'application |
| `VITE_APP_LOGO` | `/logo.svg` | Chemin vers le logo |

Après avoir ajouté toutes les variables, cliquez sur **"Deploy"** pour redémarrer l'application avec la nouvelle configuration.

## Étape 4 : Configurer le domaine

Railway génère automatiquement un domaine public pour votre application (format : `xxx.railway.app`). Vous pouvez le trouver dans l'onglet **"Settings"** de votre projet.

### Utiliser le domaine Railway (gratuit)

Le domaine Railway est gratuit et fonctionne immédiatement. Copiez l'URL et testez votre site dans un navigateur. Vous devriez voir la page d'accueil Jenia avec la vidéo en arrière-plan.

### Connecter un domaine personnalisé (optionnel)

Si vous possédez un nom de domaine (par exemple `jenia.studio`), vous pouvez le connecter à Railway :

1. Allez dans **Settings** → **Domains** → **Custom Domain**
2. Entrez votre nom de domaine (par exemple `jenia.studio`)
3. Railway vous donne un enregistrement CNAME à ajouter dans votre registrar DNS
4. Ajoutez cet enregistrement chez votre fournisseur de domaine (OVH, Namecheap, Cloudflare, etc.)
5. Attendez quelques minutes que la propagation DNS se termine

Railway génère automatiquement un certificat SSL (HTTPS) pour votre domaine personnalisé. Votre site sera accessible en HTTPS sans configuration supplémentaire.

## Étape 5 : Tester l'upload de vidéos

Une fois votre site déployé, testez l'upload de vidéos pour vérifier que tout fonctionne correctement.

1. Accédez à votre site via l'URL Railway (ou votre domaine personnalisé)
2. Cliquez sur **"Admin"** en haut à droite
3. Connectez-vous avec votre compte Manus (si l'authentification est configurée)
4. Cliquez sur **"Ajouter une vidéo"**
5. Remplissez le formulaire et sélectionnez une vidéo volumineuse (par exemple 500 MB)
6. Cliquez sur **"Enregistrer"**

L'upload devrait fonctionner sans crash, même pour des fichiers de plusieurs centaines de mégaoctets. Railway gère correctement les uploads volumineux grâce à son infrastructure cloud professionnelle.

## Étape 6 : Surveiller et déboguer

Railway fournit des outils de surveillance intégrés pour suivre l'état de votre application.

### Consulter les logs

Allez dans l'onglet **"Logs"** de votre projet Railway pour voir les logs en temps réel. Vous verrez les messages suivants lors du démarrage :

```
[OAuth] Initialized with baseURL: https://api.manus.im
Server running on http://localhost:3000/
```

Si vous voyez des erreurs, elles apparaîtront ici avec des détails complets. Les erreurs les plus courantes sont liées aux variables d'environnement manquantes ou incorrectes.

### Surveiller l'utilisation des ressources

Railway affiche l'utilisation CPU, RAM et bande passante dans l'onglet **"Metrics"**. Votre application utilise généralement :

- **CPU** : 5-10% en idle, jusqu'à 50% pendant les uploads
- **RAM** : 100-200 MB en idle, jusqu'à 500 MB pendant les uploads
- **Bande passante** : Variable selon le trafic

Si vous dépassez les limites du plan gratuit (500 heures d'exécution par mois), Railway vous facturera automatiquement. Le plan gratuit est largement suffisant pour un site portfolio avec trafic modéré.

## Dépannage

Voici les problèmes les plus courants et leurs solutions.

### Le site ne démarre pas

**Symptôme** : Railway affiche "Deployment failed" ou "Application crashed".

**Solution** : Vérifiez les logs dans l'onglet "Logs". L'erreur la plus courante est une variable d'environnement manquante. Assurez-vous que toutes les variables Supabase sont configurées correctement.

### L'upload de vidéos échoue

**Symptôme** : L'upload commence mais échoue avec une erreur "Upload failed".

**Solution** : Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est bien configurée. Cette clé contourne les politiques RLS de Supabase et est nécessaire pour uploader des fichiers. Si l'erreur persiste, vérifiez que le bucket `videos` existe dans votre projet Supabase et que RLS est désactivé ou que les politiques sont correctement configurées.

### L'authentification ne fonctionne pas

**Symptôme** : Le bouton "Admin" ne fait rien ou affiche une erreur.

**Solution** : Vérifiez que toutes les variables OAuth Manus sont configurées (`JWT_SECRET`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`). Si vous ne voulez pas utiliser l'authentification Manus, vous pouvez temporairement désactiver la protection admin dans le code.

### Les vidéos ne s'affichent pas

**Symptôme** : La page d'accueil affiche "Aucune vidéo" alors que vous avez uploadé des vidéos.

**Solution** : Vérifiez que `DATABASE_URL` est correctement configurée et que la connexion à Supabase fonctionne. Consultez les logs Railway pour voir si des erreurs SQL apparaissent. Vérifiez également que les tables `videos`, `projects`, `services`, et `users` existent dans votre base de données Supabase.

## Comparaison Manus vs Railway

Voici un tableau comparatif pour vous aider à comprendre les différences :

| Critère | Manus | Railway |
|---------|-------|---------|
| **Stabilité serveur** | Crashs fréquents avec uploads volumineux | Très stable, supporte fichiers jusqu'à 5 GB |
| **Déploiement** | Système de checkpoint bugué | Automatique depuis GitHub |
| **Base de données** | Supabase externe | PostgreSQL inclus ou Supabase externe |
| **Limite upload** | Problèmes mémoire au-delà de 100 MB | Aucun problème jusqu'à 2 GB |
| **Prix** | Gratuit (avec limitations) | Gratuit jusqu'à 500h/mois, puis $5/mois |
| **Support** | Communauté | Documentation complète + support |
| **Domaine personnalisé** | Oui (xxx.manus.space) | Oui (gratuit avec SSL automatique) |

## Prochaines étapes recommandées

Une fois votre site déployé sur Railway, voici quelques améliorations à envisager :

**Optimiser les performances** : Ajoutez un CDN (comme Cloudflare) devant Railway pour accélérer le chargement des vidéos et réduire la bande passante. Cloudflare offre un plan gratuit qui fonctionne parfaitement avec Railway.

**Ajouter un système de catégories** : Permettez aux visiteurs de filtrer les vidéos par catégorie (Animation 2D, Motion Design, VFX, etc.). Cela améliore l'expérience utilisateur et facilite la navigation dans votre portfolio.

**Implémenter une galerie de miniatures** : Ajoutez une barre de miniatures en bas de page pour que les visiteurs puissent naviguer entre les vidéos sans attendre la rotation automatique. Cela rend le site plus interactif et engageant.

## Support et ressources

Si vous rencontrez des problèmes pendant le déploiement, voici quelques ressources utiles :

- **Documentation Railway** : [docs.railway.app](https://docs.railway.app)
- **Discord Railway** : Communauté active pour poser des questions
- **Documentation Supabase** : [supabase.com/docs](https://supabase.com/docs)
- **GitHub Issues** : Ouvrez une issue sur votre repository pour documenter les problèmes

---

**Auteur** : Manus AI  
**Date** : 17 novembre 2025  
**Version** : 1.0
