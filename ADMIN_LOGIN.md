# Guide de Connexion Admin - Portfolio Jenia

## 🔐 Accès Admin

Votre compte administrateur a été créé avec les identifiants suivants :

**Email**: `bch.film@gmail.com`  
**Mot de passe**: `Admin123!Jenia`

## 📍 URL de Connexion

Pour accéder au panneau d'administration, utilisez l'URL suivante :

```
https://jenia-portfolio-git-main-studio-jenia.vercel.app/admin
```

## 🚀 Étapes de Connexion

1. **Ouvrez l'URL ci-dessus** dans votre navigateur
2. Vous serez automatiquement redirigé vers la page de connexion Supabase
3. **Entrez vos identifiants** :
   - Email: `bch.film@gmail.com`
   - Password: `Admin123!Jenia`
4. Cliquez sur **Se connecter**
5. Vous serez redirigé vers le dashboard admin

## ⚙️ Fonctionnalités Admin

Une fois connecté, vous pourrez :

### 📹 Vidéos
- Télécharger et gérer les vidéos du portfolio
- Ajouter des titres, descriptions et métadonnées

### 🎯 Missions (Projets Clients)
- Créer/modifier/supprimer des missions
- Ajouter des images de couverture
- Définir les descriptions et détails

### ⚡ Workflows (Démos Techniques)
- Associer des workflows aux missions
- Spécifier les outils utilisés
- Ajouter des liens vers démos et code

### 💡 Experience (R&D)
- Publier du contenu R&D (Notebooks, Vidéos, Podcasts)
- Gérer les tags et catégories
- Associer des médias (liens NotebookLM, YouTube, etc.)

## 🔧 En Cas de Problème

Si vous ne pouvez pas vous connecter :
1.  Vérifiez que vous utilisez la bonne URL
2.  Essayez de réinitialiser votre mot de passe via Supabase
3.  Exécutez à nouveau le script : `npx tsx create-admin-user.mjs`

## 📝 Remarques

- Le lien "Admin" n'apparaît dans le menu **que lorsque vous êtes connecté avec un compte admin**
- Les visiteurs normaux ne verront jamais ce lien
- Votre session reste active tant que vous ne vous déconnectez pas explicitement
