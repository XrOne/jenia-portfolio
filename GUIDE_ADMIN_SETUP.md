# 🎯 Guide Complet : Configuration Admin en 5 Minutes

## Étape 1 : Créer Votre Compte Admin (2 min)

1. **Ouvrez votre navigateur** et allez sur :
   ```
   https://jenia-portfolio-git-main-studio-jenia.vercel.app/admin
   ```

2. Vous verrez un formulaire **"Connexion Admin"** avec deux champs

3. **Créez votre compte** :
   - Entrez votre email (ex: `bch.film@gmail.com`)
   - Choisissez un mot de passe fort
   - Cliquez sur **"S'inscrire"** (ou changez vers le mode inscription)
   - Supabase vous enverra un email de confirmation (vérifiez vos spams)

4. **Confirmez votre email** en cliquant sur le lien dans l'email

5. **Revenez sur `/admin`** et connectez-vous avec vos identifiants

6. ⏳ **Attendez 1 seconde** → la page se rechargera automatiquement

**À ce stade :** Vous êtes connecté, mais vous serez encore redirigé vers l'accueil car vous n'avez pas encore le rôle `admin`.

---

## Étape 2 : Activer le Rôle Admin dans Supabase (2 min)

1. **Ouvrez Supabase Dashboard** :
   ```
   https://supabase.com/dashboard/project/dmqffcyiclqxqzfkdijy
   ```

2. Connectez-vous à votre compte Supabase

3. Dans le menu de gauche, cliquez sur **"SQL Editor"**

4. Cliquez sur **"New query"** (Nouvelle requête)

5. **Copiez-collez ce script SQL** :
   ```sql
   -- Remplacez 'votre-email@gmail.com' par l'email que vous venez d'utiliser
   UPDATE users 
   SET role = 'admin' 
   WHERE email = 'bch.film@gmail.com';
   ```

6. **Modifiez l'email** dans le script pour matcher celui que vous avez utilisé

7. Cliquez sur **"Run"** (Exécuter)

8. Vous devriez voir : **"Success. 1 rows updated."**

---

## Étape 3 : Vérifier Que Ça Fonctionne (1 min)

1. **Retournez sur votre site** :
   ```
   https://jenia-portfolio-git-main-studio-jenia.vercel.app/admin
   ```

2. **Rechargez la page** (F5 ou Ctrl+R)

3. 🎉 **Vous devriez maintenant voir le Dashboard Admin !**

Avec les onglets :
- 📹 **Vidéos** : Gérer les vidéos du portfolio
- 🎯 **Missions** : Gérer les projets clients
- ⚡ **Workflows** : Gérer les démos techniques
- 💡 **Experience** : Publier du contenu R&D

---

## 🆘 En Cas de Problème

### Problème : "Toujours redirigé vers l'accueil"
**Solution :**
1. Vérifiez que le SQL a bien été exécuté dans Supabase
2. Vérifiez avec cette requête :
   ```sql
   SELECT email, role FROM users WHERE email = 'votre-email@gmail.com';
   ```
3. La colonne `role` doit afficher `admin`

### Problème : "La table 'users' n'existe pas"
**Solution :**
1. Vous devez d'abord créer les tables de la base de données
2. Exécutez le script : [`UPDATE_DB.sql`](file:///i:/jenia-portfolio/UPDATE_DB.sql)
3. Dans Supabase → SQL Editor → Copiez tout le contenu → Run

### Problème : "Le formulaire de connexion ne s'affiche pas"
**Solution :**
- Attendez 2-3 minutes que le déploiement Vercel se termine
- Vérifiez l'URL du déploiement dans votre dashboard Vercel

---

## 📝 Prochaines Étapes

Une fois connecté au dashboard admin, vous pouvez :

1. **Télécharger des vidéos** pour votre portfolio
2. **Créer des missions** (projets clients) avec images et descriptions
3. **Ajouter des workflows** (démos techniques) liés aux missions
4. **Publier du contenu R&D** dans la section Experience

**Bon travail ! 🚀**
