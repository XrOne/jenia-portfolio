# 🚀 Guide Complet - Configuration Supabase pour Jenia Portfolio

## 📋 Vue d'ensemble

Ce guide vous accompagne **pas à pas** pour configurer Supabase Storage et héberger vos vidéos haute qualité.

**Durée estimée** : 10-15 minutes  
**Coût** : Gratuit (plan free jusqu'à 1GB de stockage)

---

## 🎯 Étape 1 : Créer un compte Supabase (2 minutes)

### 1.1 S'inscrire

1. Allez sur **[https://supabase.com](https://supabase.com)**
2. Cliquez sur **"Start your project"** ou **"Sign Up"**
3. Choisissez votre méthode d'inscription :
   - GitHub (recommandé - le plus rapide)
   - Email + mot de passe
   - Google

### 1.2 Créer un nouveau projet

Une fois connecté :

1. Cliquez sur **"New Project"**
2. Remplissez les informations :
   ```
   Name:              jenia-portfolio
   Database Password: [Générez un mot de passe fort - sauvegardez-le!]
   Region:            Europe West (si vous êtes en France)
   Pricing Plan:      Free (1GB gratuit)
   ```
3. Cliquez sur **"Create new project"**
4. ⏳ Attendez 2-3 minutes que le projet soit créé

---

## 📦 Étape 2 : Créer le bucket de stockage (3 minutes)

### 2.1 Accéder à Storage

Dans le menu latéral gauche de votre projet Supabase :
1. Cliquez sur **"Storage"** (icône de dossier)

### 2.2 Créer le bucket

1. Cliquez sur **"Create a new bucket"**
2. Configurez le bucket :
   ```
   Name:              jenia-videos
   Public bucket:     ✅ COCHEZ CETTE CASE (très important!)
   File size limit:   1000 MB
   Allowed MIME:      (laissez vide pour tout autoriser)
   ```
3. Cliquez sur **"Create bucket"**

⚠️ **Important** : Le bucket DOIT être public pour que les vidéos soient accessibles sur votre site.

---

## 🔐 Étape 3 : Configurer les politiques de sécurité (RLS) (3 minutes)

Les politiques RLS (Row Level Security) contrôlent qui peut lire/écrire dans votre bucket.

### 3.1 Accéder aux politiques

1. Cliquez sur votre bucket **"jenia-videos"**
2. Allez dans l'onglet **"Policies"**

### 3.2 Créer les politiques

Vous devez créer 3 politiques :

#### Politique 1 : Lecture publique (tout le monde peut voir les vidéos)

1. Cliquez sur **"New Policy"**
2. Sélectionnez **"For full customization"**
3. Configurez :
   ```
   Policy name:       Public Read Access
   Allowed operation: SELECT
   Target roles:      public (laissez par défaut)
   ```
4. Dans **"Policy definition"**, collez ce SQL :
   ```sql
   bucket_id = 'jenia-videos'
   ```
5. Cliquez sur **"Review"** puis **"Save policy"**

**OU** méthode rapide :
1. Cliquez sur **"New Policy"**
2. Sélectionnez le template **"Allow public read access"**
3. Cliquez sur **"Use this template"**

#### Politique 2 : Upload (pour l'admin)

1. Cliquez sur **"New Policy"**
2. Sélectionnez **"For full customization"**
3. Configurez :
   ```
   Policy name:       Allow Upload
   Allowed operation: INSERT
   Target roles:      authenticated, anon (les deux)
   ```
4. Dans **"Policy definition"**, collez :
   ```sql
   bucket_id = 'jenia-videos'
   ```
5. Cliquez sur **"Review"** puis **"Save policy"**

#### Politique 3 : Suppression (pour l'admin)

1. Répétez les mêmes étapes mais avec :
   ```
   Policy name:       Allow Delete
   Allowed operation: DELETE
   Target roles:      authenticated, anon
   ```
4. Même définition :
   ```sql
   bucket_id = 'jenia-videos'
   ```

---

## 🔑 Étape 4 : Récupérer vos clés API (2 minutes)

### 4.1 Accéder aux paramètres API

Dans le menu latéral gauche :
1. Cliquez sur **"Settings"** (icône d'engrenage en bas)
2. Puis sur **"API"**

### 4.2 Copier les informations importantes

Vous verrez plusieurs sections. Notez ces 3 valeurs :

#### 📌 URL du projet
Dans la section **"Project URL"** :
```
https://xxxxxxxxxxxxx.supabase.co
```
➡️ C'est votre **SUPABASE_URL**

#### 📌 Clé anonyme (anon / public)
Dans la section **"Project API keys"**, sous **"anon public"** :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```
➡️ C'est votre **SUPABASE_ANON_KEY**

#### 📌 Clé service role
Dans la même section, sous **"service_role"** :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```
➡️ C'est votre **SUPABASE_SERVICE_ROLE_KEY**

⚠️ **ATTENTION** : Ne partagez JAMAIS votre clé `service_role` ! Elle donne un accès complet à votre projet.

---

## ⚙️ Étape 5 : Configurer le fichier .env (2 minutes)

### 5.1 Ouvrir le fichier .env

Dans votre projet, ouvrez le fichier **`.env`** (à la racine).

### 5.2 Remplir les valeurs Supabase

Remplacez les valeurs vides par celles que vous avez copiées :

```env
# =====================================================
# 🗄️ SUPABASE STORAGE CONFIGURATION
# =====================================================
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_BUCKET_NAME=jenia-videos
```

### 5.3 (Optionnel) Configurer la base de données MySQL

Si vous avez une base de données MySQL :

```env
# Format: mysql://username:password@host:port/database
DATABASE_URL=mysql://root:password@localhost:3306/jenia_portfolio
```

Si vous n'en avez pas, vous pouvez :
- Utiliser MySQL local (via XAMPP, MAMP, ou MySQL Workbench)
- Utiliser PlanetScale (base de données MySQL gratuite en ligne)
- Laisser vide pour l'instant (l'app fonctionnera en mode limité)

### 5.4 Générer un secret JWT

Pour le `JWT_SECRET`, générez une chaîne aléatoire sécurisée :

**Méthode 1** : En ligne
- Allez sur https://generate-secret.vercel.app/32
- Copiez la chaîne générée

**Méthode 2** : Via terminal
```bash
openssl rand -base64 32
```

Collez le résultat :
```env
JWT_SECRET=votre-chaine-aleatoire-de-32-caracteres-minimum
```

### 5.5 Sauvegarder

**Sauvegardez le fichier `.env`** ✅

⚠️ Ce fichier ne sera jamais commité sur Git (il est dans `.gitignore`).

---

## ✅ Étape 6 : Tester la configuration (2 minutes)

### 6.1 Installer les dépendances

Si ce n'est pas déjà fait :

```bash
pnpm install
```

### 6.2 Lancer le script de test

```bash
pnpm test:supabase
```

### 6.3 Résultat attendu

Vous devriez voir :

```
🧪 Test de configuration Supabase

📋 Variables d'environnement:
   SUPABASE_URL: ✅ Définie
   SUPABASE_SERVICE_ROLE_KEY: ✅ Définie
   BUCKET_NAME: jenia-videos

🔍 Test 1: Connexion à Supabase...
✅ Connexion réussie!
   Buckets trouvés: 1

🔍 Test 2: Vérification du bucket "jenia-videos"...
✅ Bucket trouvé!

🔍 Test 3: Test d'upload...
✅ Upload réussi!

🔍 Test 4: Récupération de l'URL publique...
✅ URL publique générée:
   https://xxxxx.supabase.co/storage/v1/object/public/jenia-videos/test-xxx.txt

🔍 Test 5: Suppression du fichier test...
✅ Fichier test supprimé!

🎉 Tous les tests sont passés avec succès!
```

✅ **Si tous les tests passent** → Votre configuration est parfaite !

❌ **Si un test échoue** → Consultez la section "Dépannage" ci-dessous.

---

## 🎬 Étape 7 : Lancer votre application (1 minute)

### 7.1 Démarrer le serveur

```bash
pnpm dev
```

Vous devriez voir :

```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5000/
  ➜  Network: use --host to expose
```

### 7.2 Accéder au site

Ouvrez votre navigateur et allez sur :
- **Page d'accueil** : http://localhost:5000
- **Interface admin** : http://localhost:5000/admin

---

## 📤 Étape 8 : Uploader votre première vidéo (3 minutes)

### 8.1 Accéder à l'admin

1. Allez sur **http://localhost:5000/admin**
2. Cliquez sur **"Ajouter une vidéo"**

### 8.2 Remplir le formulaire

```
Titre:        Ma première démo
Description:  Vidéo de test
Ordre:        1
Actif:        ✅ Coché
```

3. **Fichier vidéo** : Cliquez sur "Choisir un fichier" et sélectionnez une vidéo MP4

### 8.3 Valider

1. Cliquez sur **"Enregistrer"**
2. Attendez que l'upload se termine (barre de progression)
3. Vous verrez un message de succès ✅

### 8.4 Vérifier

1. Retournez sur la page d'accueil : http://localhost:5000
2. Votre vidéo devrait jouer en arrière-plan ! 🎉

---

## 🎥 Optimisation : Préparer vos vidéos

Pour des vidéos de qualité optimales :

### Formats recommandés
```
Format:      MP4 (H.264)
Résolution:  1920x1080 (Full HD)
Bitrate:     8-12 Mbps
Codec audio: AAC, 128-192 kbps
Durée:       10-60 secondes
```

### Compresser avec FFmpeg

Si vos vidéos sont trop lourdes, utilisez FFmpeg :

```bash
# Installation FFmpeg
# - Windows: https://ffmpeg.org/download.html
# - Mac: brew install ffmpeg
# - Linux: sudo apt install ffmpeg

# Compression optimale
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -preset slow \
  -crf 20 \
  -c:a aac \
  -b:a 128k \
  -vf scale=1920:1080 \
  output.mp4
```

Cela créera une vidéo optimisée pour le web, de haute qualité mais plus légère.

---

## 🐛 Dépannage

### ❌ Erreur "Bucket not found"

**Causes** :
- Le bucket n'existe pas dans Supabase
- Le nom du bucket ne correspond pas (`SUPABASE_BUCKET_NAME`)

**Solutions** :
1. Vérifiez que le bucket `jenia-videos` existe dans **Storage**
2. Vérifiez que `SUPABASE_BUCKET_NAME=jenia-videos` dans `.env`
3. Relancez le test : `pnpm test:supabase`

### ❌ Erreur "Upload failed"

**Causes** :
- Clés API incorrectes
- Politiques RLS mal configurées

**Solutions** :
1. Vérifiez vos clés dans `.env` (copiez-les à nouveau depuis Supabase)
2. Vérifiez les politiques dans **Storage > jenia-videos > Policies**
3. Assurez-vous d'avoir les 3 politiques : SELECT, INSERT, DELETE

### ❌ Vidéo ne s'affiche pas sur le site

**Causes** :
- Bucket non public
- URL de la vidéo incorrecte
- Problème de CORS

**Solutions** :
1. Vérifiez que le bucket est **public** (case cochée lors de la création)
2. Testez l'URL de la vidéo directement dans votre navigateur
3. Consultez la console du navigateur (F12) pour voir les erreurs

### ❌ "Connection refused" lors du test

**Causes** :
- `SUPABASE_URL` incorrecte
- Problème de connexion internet

**Solutions** :
1. Vérifiez que l'URL est correcte (format: `https://xxxxx.supabase.co`)
2. Testez l'URL dans votre navigateur
3. Vérifiez votre connexion internet

### ❌ Script de test échoue immédiatement

**Causes** :
- Variables d'environnement non chargées
- Fichier `.env` non sauvegardé

**Solutions** :
1. Vérifiez que le fichier `.env` existe à la racine du projet
2. Vérifiez qu'il contient bien toutes les valeurs
3. Relancez le terminal et réessayez

---

## 🚀 Prochaines étapes

Maintenant que Supabase est configuré :

1. ✅ **Uploadez vos vidéos** via l'interface admin
2. ✅ **Personnalisez le design** (couleurs, textes, etc.)
3. ✅ **Ajoutez vos services** sur la page Services
4. ✅ **Testez sur mobile** pour vérifier le responsive
5. ✅ **Déployez sur Vercel** (voir [DEPLOYMENT.md](./DEPLOYMENT.md))

---

## 📚 Ressources utiles

- **Documentation Supabase Storage** : https://supabase.com/docs/guides/storage
- **Supabase Discord** : https://discord.supabase.com/
- **FFmpeg Documentation** : https://ffmpeg.org/documentation.html

---

## ✉️ Besoin d'aide ?

Si vous rencontrez des problèmes :
- 📧 Email : studio.jenia@gmail.com
- 💬 Créez une issue sur GitHub
- 📖 Consultez les autres fichiers de documentation (README.md, SUPABASE_SETUP.md)

---

## 🎉 Félicitations !

Votre portfolio est maintenant prêt avec Supabase ! 🚀

**Bon courage pour votre saison 2 de Declics !** 🎬


