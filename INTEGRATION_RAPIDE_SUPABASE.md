# ⚡ Intégration Rapide Supabase - 5 Minutes

## 🎯 Objectif

Configurer Supabase Storage pour héberger vos vidéos HD en **5 minutes chrono**.

---

## ✅ Checklist d'intégration

### 📌 Étape 1 : Compte Supabase (1 min)

```
☐ Allez sur https://supabase.com
☐ Créez un compte (GitHub = le plus rapide)
☐ Créez un projet "jenia-portfolio"
☐ Choisissez région "Europe West"
☐ Attendez 2-3 minutes
```

---

### 📌 Étape 2 : Créer le bucket (1 min)

```
☐ Allez dans Storage (menu gauche)
☐ Cliquez "Create a new bucket"
☐ Name: jenia-videos
☐ Public bucket: ✅ COCHEZ
☐ File size limit: 1000 MB
☐ Créez le bucket
```

---

### 📌 Étape 3 : Politiques RLS (1 min)

**Option rapide** : Utilisez les templates

```
☐ Cliquez sur "jenia-videos"
☐ Onglet "Policies"
☐ "New Policy" → "Allow public read access" → "Use template"
☐ "New Policy" → Créez une policy INSERT pour tout le monde
```

**Policy INSERT** (copiez-collez) :
```sql
bucket_id = 'jenia-videos'
```

Configurez :
- Policy name: `Allow Upload`
- Operation: `INSERT`
- Target roles: `public, authenticated`

---

### 📌 Étape 4 : Récupérer les clés (1 min)

```
☐ Settings > API
☐ Copiez "Project URL"
☐ Copiez "anon public" key
☐ Copiez "service_role" key
```

---

### 📌 Étape 5 : Configurer .env (1 min)

Ouvrez le fichier `.env` et remplissez :

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_BUCKET_NAME=jenia-videos

# Optionnel pour l'instant
DATABASE_URL=
JWT_SECRET=
```

**Générer un JWT_SECRET** :
```bash
# Option 1 : En ligne
https://generate-secret.vercel.app/32

# Option 2 : Terminal
openssl rand -base64 32
```

Sauvegardez le fichier ✅

---

### 📌 Étape 6 : Tester (30 sec)

```bash
pnpm install
pnpm test:supabase
```

Résultat attendu :
```
🎉 Tous les tests sont passés avec succès!
```

---

### 📌 Étape 7 : Lancer l'app (30 sec)

```bash
pnpm dev
```

Ouvrez : http://localhost:5000

---

## 🚀 Premier upload

1. **Admin** : http://localhost:5000/admin
2. **Cliquez** : "Ajouter une vidéo"
3. **Remplissez** : Titre + Sélectionnez une vidéo MP4
4. **Enregistrez** ✅
5. **Vérifiez** : Retournez sur la page d'accueil

🎉 Votre vidéo devrait jouer !

---

## 📋 Résumé des URLs importantes

| Service | URL |
|---------|-----|
| **Supabase Dashboard** | https://app.supabase.com |
| **Votre projet Supabase** | https://app.supabase.com/project/[votre-id] |
| **Storage** | Dashboard > Storage > jenia-videos |
| **API Settings** | Dashboard > Settings > API |
| **Site local** | http://localhost:5000 |
| **Admin local** | http://localhost:5000/admin |

---

## 🔧 Commandes utiles

```bash
# Installer les dépendances
pnpm install

# Tester Supabase
pnpm test:supabase

# Lancer en développement
pnpm dev

# Mettre à jour la BDD (si configurée)
pnpm db:push

# Build pour production
pnpm build
```

---

## ⚠️ Les 3 erreurs les plus courantes

### 1. "Bucket not found"
```
❌ Le bucket n'existe pas ou le nom est incorrect
✅ Vérifiez que le bucket "jenia-videos" existe dans Storage
✅ Vérifiez SUPABASE_BUCKET_NAME=jenia-videos dans .env
```

### 2. "Upload failed"
```
❌ Politiques RLS manquantes ou incorrectes
✅ Créez les politiques SELECT et INSERT
✅ Cochez "Public bucket" lors de la création
```

### 3. "Connection refused"
```
❌ SUPABASE_URL incorrecte ou problème de connexion
✅ Vérifiez l'URL dans Settings > API
✅ Format: https://xxxxx.supabase.co (sans /v1 à la fin)
```

---

## 📚 Documentation complète

Pour plus de détails, consultez :

- **[GUIDE_CONFIGURATION_SUPABASE.md](./GUIDE_CONFIGURATION_SUPABASE.md)** - Guide complet pas à pas
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Configuration détaillée
- **[MIGRATION_SUPABASE.md](./MIGRATION_SUPABASE.md)** - Récapitulatif de la migration
- **[README.md](./README.md)** - Documentation générale du projet

---

## 🎁 Bonus : Optimiser vos vidéos

### Format idéal
```
Format:      MP4 (H.264)
Résolution:  1920x1080
Bitrate:     8-12 Mbps
Durée:       15-30 secondes
```

### Commande FFmpeg
```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -preset slow -crf 20 \
  -c:a aac -b:a 128k \
  -vf scale=1920:1080 \
  output.mp4
```

---

## ✅ Vous avez terminé !

**Félicitations !** 🎉 Votre portfolio est opérationnel avec Supabase.

**Prochaines étapes** :
1. ✅ Uploadez vos vidéos de qualité
2. ✅ Personnalisez le design
3. ✅ Déployez sur Vercel

**Besoin d'aide ?** → studio.jenia@gmail.com


