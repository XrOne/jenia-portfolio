# 🚀 COMMENCEZ ICI - Configuration Supabase

## 👋 Bienvenue !

Votre projet **Jenia Portfolio** est déjà **100% configuré** pour Supabase.

Il ne vous reste qu'**une seule chose** à faire : configurer Supabase et remplir le fichier `.env`.

---

## ⏱️ Temps estimé : 10 minutes

---

## 🎯 ÉTAPE 1 : Créer votre compte Supabase (2 min)

### 1. Allez sur https://supabase.com
### 2. Cliquez sur "Sign Up" (GitHub recommandé)
### 3. Créez un nouveau projet :

```
Name:              jenia-portfolio
Database Password: [Générez un mot de passe fort]
Region:            Europe West (si en France)
Plan:              Free
```

### 4. Attendez 2-3 minutes que le projet soit créé ⏳

---

## 🗂️ ÉTAPE 2 : Créer le bucket de stockage (1 min)

### 1. Dans le menu gauche, cliquez sur **"Storage"**
### 2. Cliquez sur **"Create a new bucket"**
### 3. Configurez :

```
Name:              jenia-videos
Public bucket:     ✅ COCHEZ CETTE CASE (très important!)
File size limit:   1000 MB
```

### 4. Cliquez sur **"Create bucket"**

---

## 🔐 ÉTAPE 3 : Configurer les politiques (2 min)

### 1. Cliquez sur votre bucket **"jenia-videos"**
### 2. Allez dans l'onglet **"Policies"**

### 3. Créez la première politique (lecture publique) :

```
New Policy > Use template "Allow public read access" > Use template
```

### 4. Créez la deuxième politique (upload) :

```
New Policy > For full customization

Policy name:       Allow Upload
Operation:         INSERT
Target roles:      public, authenticated (cochez les deux)
Policy definition: bucket_id = 'jenia-videos'

Review > Save
```

---

## 🔑 ÉTAPE 4 : Récupérer vos clés (1 min)

### 1. Dans le menu gauche, cliquez sur **"Settings"** (engrenage en bas)
### 2. Puis cliquez sur **"API"**

### 3. Notez ces 3 valeurs importantes :

#### 📌 Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```

#### 📌 anon public key (dans "Project API keys")
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 📌 service_role key (dans "Project API keys")
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ Ne partagez JAMAIS votre `service_role` key !

---

## ⚙️ ÉTAPE 5 : Remplir le fichier .env (2 min)

### 1. Ouvrez le fichier `.env` à la racine du projet

### 2. Remplacez les valeurs vides par celles que vous avez copiées :

```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_BUCKET_NAME=jenia-videos
```

### 3. Générez un JWT_SECRET :

**Méthode rapide** : Allez sur https://generate-secret.vercel.app/32

**OU via terminal** :
```bash
openssl rand -base64 32
```

Collez le résultat :
```env
JWT_SECRET=votre-chaine-aleatoire-generee
```

### 4. (Optionnel) Base de données MySQL

Si vous en avez une :
```env
DATABASE_URL=mysql://user:password@host:port/database
```

Sinon, laissez vide pour l'instant.

### 5. **SAUVEGARDEZ le fichier .env** ✅

---

## ✅ ÉTAPE 6 : Tester la configuration (2 min)

### 1. Installez les dépendances :

```bash
pnpm install
```

### 2. Lancez le test Supabase :

```bash
pnpm test:supabase
```

### 3. Résultat attendu :

```
🎉 Tous les tests sont passés avec succès!
```

✅ **Si vous voyez ce message, c'est parfait !**

❌ **Si un test échoue**, vérifiez :
- Que toutes les valeurs du `.env` sont correctes
- Que le bucket est bien **public**
- Que les politiques RLS sont créées

---

## 🎬 ÉTAPE 7 : Lancer l'application (1 min)

### 1. Démarrez le serveur :

```bash
pnpm dev
```

### 2. Ouvrez votre navigateur :

- **Page d'accueil** : http://localhost:5000
- **Interface admin** : http://localhost:5000/admin

---

## 📤 ÉTAPE 8 : Votre premier upload ! (2 min)

### 1. Allez sur http://localhost:5000/admin

### 2. Cliquez sur **"Ajouter une vidéo"**

### 3. Remplissez le formulaire :

```
Titre:        Ma première démo
Description:  Test
Ordre:        1
Actif:        ✅ Coché
Fichier:      [Sélectionnez une vidéo MP4]
```

### 4. Cliquez sur **"Enregistrer"**

### 5. Attendez l'upload (barre de progression)

### 6. Retournez sur http://localhost:5000

### 7. 🎉 **Votre vidéo devrait jouer en arrière-plan !**

---

## 🎉 Félicitations !

Votre portfolio est maintenant **100% opérationnel** avec Supabase !

---

## 📚 Documentation supplémentaire

Si vous voulez en savoir plus :

| Document | Description |
|----------|-------------|
| **INTEGRATION_RAPIDE_SUPABASE.md** | Guide express (5 min) |
| **GUIDE_CONFIGURATION_SUPABASE.md** | Guide complet détaillé |
| **ARCHITECTURE_SUPABASE.md** | Comprendre l'architecture |
| **RESUME_INTEGRATION_SUPABASE.md** | Récapitulatif complet |
| **README.md** | Documentation générale |

---

## 🔧 Commandes utiles

```bash
# Installer les dépendances
pnpm install

# Tester Supabase
pnpm test:supabase

# Lancer en développement
pnpm dev

# Build pour production
pnpm build

# Mettre à jour la BDD
pnpm db:push
```

---

## 🆘 Problèmes ?

### ❌ "Bucket not found"
→ Vérifiez que le bucket `jenia-videos` existe et est public

### ❌ "Upload failed"
→ Vérifiez vos clés dans `.env` et les politiques RLS

### ❌ Vidéo ne s'affiche pas
→ Testez l'URL directement dans le navigateur, vérifiez la console (F12)

---

## 📞 Besoin d'aide ?

- 📧 Email : studio.jenia@gmail.com
- 📚 Documentation Supabase : https://supabase.com/docs
- 💬 Discord Supabase : https://discord.supabase.com

---

## 🚀 Prochaines étapes

Maintenant que Supabase est configuré :

1. ✅ Uploadez vos meilleures vidéos
2. ✅ Personnalisez les couleurs et textes
3. ✅ Ajoutez vos informations de contact
4. ✅ Testez sur mobile
5. ✅ Déployez sur Vercel (voir `DEPLOYMENT.md`)

---

**Bon courage pour votre projet ! 🎬**

**Vous allez cartonnez ! 💪**


