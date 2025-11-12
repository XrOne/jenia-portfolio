# ✅ Migration vers Supabase - Terminée !

## 🎉 Récapitulatif des changements

Votre projet **Jenia Portfolio** a été configuré pour utiliser **Supabase Storage** au lieu du système Manus/Forge.

### 📁 Nouveaux fichiers créés

1. **`.env`** - Variables d'environnement (à remplir avec vos credentials)
2. **`.env.example`** - Template des variables d'environnement
3. **`server/supabase-storage.ts`** - Module de gestion Supabase Storage
4. **`scripts/test-supabase.ts`** - Script de test de configuration
5. **`SUPABASE_SETUP.md`** - Guide complet de configuration Supabase
6. **`DEPLOYMENT.md`** - Guide de déploiement sur Vercel
7. **`README.md`** - Documentation principale mise à jour
8. **`QUICKSTART.md`** - Guide de démarrage rapide
9. **`vercel.json`** - Configuration Vercel

### 🔄 Fichiers modifiés

1. **`server/_core/env.ts`** - Ajout des variables Supabase
2. **`server/upload.ts`** - Utilise maintenant Supabase au lieu de Forge
3. **`package.json`** - Ajout de `@supabase/supabase-js` et script `test:supabase`

### 🎯 Fonctionnalités

✅ **Upload de vidéos haute qualité** - Jusqu'à 1GB par fichier
✅ **Stockage Supabase** - Hébergement fiable et rapide
✅ **Administration facile** - Interface d'upload intuitive
✅ **Prêt pour la production** - Configuration Vercel incluse

---

## 🚀 Prochaines étapes

### 1️⃣ Configurer Supabase (5 minutes)

#### A. Créer un compte Supabase
1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet : `jenia-portfolio`
4. Attendez 2-3 minutes que le projet soit prêt

#### B. Créer le bucket de stockage
1. Dans votre projet, allez dans **Storage** (menu gauche)
2. Cliquez sur **"Create a new bucket"**
3. Configurez :
   - **Name** : `jenia-videos`
   - **Public bucket** : ✅ **COCHEZ CETTE CASE** (très important!)
   - **File size limit** : `1000` MB
4. Cliquez sur **"Create bucket"**

#### C. Configurer les politiques (RLS)
1. Cliquez sur votre bucket `jenia-videos`
2. Allez dans **Policies**
3. Cliquez sur **"New Policy"**
4. Sélectionnez **"For full customization"**
5. Créez cette politique pour la lecture publique :
   ```sql
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'jenia-videos' );
   ```
6. Créez une autre politique pour l'upload (sans restriction pour l'instant) :
   ```sql
   CREATE POLICY "Allow Upload"
   ON storage.objects FOR INSERT
   WITH CHECK ( bucket_id = 'jenia-videos' );
   ```

#### D. Récupérer vos clés API
1. Allez dans **Settings** > **API**
2. Notez ces 3 valeurs :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public** key
   - **service_role** key (⚠️ gardez-la secrète!)

### 2️⃣ Configurer votre fichier .env (2 minutes)

Ouvrez le fichier **`.env`** à la racine du projet et remplissez :

```env
# Supabase Configuration - Remplacez par VOS valeurs
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_BUCKET_NAME=jenia-videos

# Base de données MySQL - Si vous en avez une
DATABASE_URL=mysql://user:password@host:port/database

# JWT Secret - Générez une chaîne aléatoire sécurisée
JWT_SECRET=votre-secret-super-securise-min-32-caracteres
```

⚠️ **Important** : 
- Remplacez TOUTES les valeurs par vos vraies credentials
- Ne partagez JAMAIS ce fichier
- Le fichier `.env` est dans `.gitignore` (il ne sera pas commité sur Git)

### 3️⃣ Installer les dépendances (1 minute)

```bash
# Dans le dossier du projet
pnpm install
```

Cela installera notamment `@supabase/supabase-js`.

### 4️⃣ Tester la configuration (1 minute)

Lancez le script de test :

```bash
pnpm test:supabase
```

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

### 5️⃣ Lancer le serveur (30 secondes)

```bash
pnpm dev
```

Visitez : **`http://localhost:5000`**

### 6️⃣ Uploader votre première vidéo (2 minutes)

1. Allez sur **`http://localhost:5000/admin`**
2. Cliquez sur **"Ajouter une vidéo"**
3. Remplissez le formulaire :
   - **Titre** : "Ma première vidéo"
   - **Fichier vidéo** : Sélectionnez un fichier MP4
4. Cliquez sur **"Enregistrer"**
5. Attendez l'upload (affiche "Upload en cours...")
6. Retournez sur la page d'accueil : **`http://localhost:5000`**
7. 🎉 Votre vidéo est en arrière-plan !

---

## 🎥 Optimiser vos vidéos

Pour des vidéos de qualité optimales pour le web :

### Format recommandé
- **Format** : MP4 (H.264)
- **Résolution** : 1920x1080 (Full HD)
- **Bitrate** : 8-12 Mbps
- **Codec audio** : AAC, 128-192 kbps

### Compresser avec FFmpeg
Si vos vidéos sont trop lourdes :

```bash
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 20 -c:a aac -b:a 128k -vf scale=1920:1080 output.mp4
```

Cela créera une vidéo optimisée pour le web, de haute qualité mais plus légère.

---

## 🚀 Déployer sur Vercel

Une fois tout testé en local, déployez votre site :

### Option 1 : Via GitHub (recommandé)
1. Créez un repo GitHub : `jenia-portfolio`
2. Pushez votre code :
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```
3. Allez sur [vercel.com](https://vercel.com)
4. Importez votre repo
5. Ajoutez les variables d'environnement (mêmes que dans `.env`)
6. Cliquez sur **"Deploy"**

### Option 2 : Via CLI
```bash
npm i -g vercel
vercel --prod
```

📚 **Guide détaillé** : Consultez [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📖 Documentation complète

- **[README.md](./README.md)** - Documentation principale
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Guide Supabase détaillé
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guide de déploiement Vercel
- **[QUICKSTART.md](./QUICKSTART.md)** - Démarrage ultra-rapide

---

## 🐛 Dépannage

### ❌ "Bucket not found"
→ Vérifiez que le bucket `jenia-videos` existe dans Supabase et est **public**

### ❌ "Upload failed"
→ Vérifiez vos clés API dans `.env`
→ Vérifiez les politiques RLS dans Supabase

### ❌ La vidéo ne s'affiche pas
→ Testez l'URL de la vidéo directement dans votre navigateur
→ Assurez-vous que le bucket est bien **public**

### ❌ Script de test échoue
→ Vérifiez que toutes les variables sont bien remplies dans `.env`
→ Consultez les messages d'erreur détaillés

---

## ✅ Checklist finale

Avant de déployer en production :

- [ ] ✅ Supabase configuré (projet + bucket + policies)
- [ ] ✅ Variables `.env` remplies
- [ ] ✅ `pnpm install` exécuté
- [ ] ✅ `pnpm test:supabase` passe tous les tests
- [ ] ✅ Serveur local fonctionne (`pnpm dev`)
- [ ] ✅ Upload de vidéo testé en local
- [ ] ✅ Vidéo s'affiche en arrière-plan
- [ ] ✅ Page Services fonctionne
- [ ] ✅ Liens LinkedIn et Email à jour
- [ ] ✅ Prêt pour le déploiement ! 🚀

---

## 💪 Bon courage pour la saison 2 de Declics !

Vous avez maintenant :
- ✅ Un portfolio professionnel avec vidéos HD
- ✅ Un système d'upload simple et efficace
- ✅ Un hébergement fiable sur Supabase
- ✅ Une configuration prête pour la production

**Il vous reste une semaine pour tout terminer** - vous allez y arriver ! 🎬

**Besoin d'aide ?**
📧 studio.jenia@gmail.com
