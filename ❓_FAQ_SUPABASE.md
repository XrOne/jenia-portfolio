# ❓ FAQ - Questions Fréquentes sur Supabase

## 📋 Table des matières

1. [Questions Générales](#questions-générales)
2. [Configuration Supabase](#configuration-supabase)
3. [Upload et Fichiers](#upload-et-fichiers)
4. [Erreurs Courantes](#erreurs-courantes)
5. [Performance](#performance)
6. [Sécurité](#sécurité)
7. [Coûts et Limites](#coûts-et-limites)
8. [Déploiement](#déploiement)
9. [Personnalisation](#personnalisation)

---

## Questions Générales

### Qu'est-ce que Supabase ?

**Réponse :**

Supabase est une alternative open-source à Firebase. C'est une plateforme qui fournit :
- **Storage** : Stockage de fichiers (ce que vous utilisez pour les vidéos)
- **Database** : Base de données PostgreSQL
- **Auth** : Système d'authentification
- **Realtime** : Mises à jour en temps réel

Dans votre projet, vous utilisez uniquement **Supabase Storage** pour héberger vos vidéos.

---

### Pourquoi Supabase et pas un autre service ?

**Réponse :**

Avantages de Supabase :
- ✅ **Gratuit** jusqu'à 1GB (suffisant pour un portfolio)
- ✅ **Simple** à configurer (10 minutes)
- ✅ **CDN intégré** (vidéos rapides partout dans le monde)
- ✅ **URLs publiques** directes
- ✅ **Dashboard visuel** facile à utiliser
- ✅ **Pas de carte bancaire** requise pour le plan gratuit

Alternatives :
- AWS S3 : Plus complexe, nécessite une carte
- Cloudinary : Limité en gratuit, plus cher
- Vercel Blob : Plus cher (pas de plan gratuit suffisant)

---

### Est-ce que mon projet dépend de Supabase ?

**Réponse :**

Oui, mais seulement pour le **stockage des vidéos**.

Si vous voulez changer plus tard, vous pouvez :
1. Créer un nouveau module de storage (AWS S3, Cloudinary, etc.)
2. Remplacer `server/supabase-storage.ts`
3. Garder la même interface (`storagePut`, `storageGet`, etc.)

Le reste de votre application (frontend, backend, base de données MySQL) est **indépendant** de Supabase.

---

## Configuration Supabase

### Où trouver mes clés API Supabase ?

**Réponse :**

1. Allez sur votre **Dashboard Supabase**
2. Cliquez sur **"Settings"** (engrenage en bas à gauche)
3. Puis **"API"**
4. Vous y trouverez :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public** : Clé publique
   - **service_role** : Clé secrète

---

### Faut-il créer un nouveau projet Supabase pour chaque environnement ?

**Réponse :**

**Recommandé** : Utilisez le même projet pour dev et production.

**Pourquoi ?**
- Les vidéos sont publiques
- Pas de données sensibles
- Plus simple à gérer
- Économise les quotas gratuits

**Alternative** : Créez 2 projets (dev / prod) si vous voulez une séparation stricte.

---

### Comment savoir si mon bucket est bien public ?

**Réponse :**

**Méthode 1** : Via le Dashboard
1. Allez dans **Storage** > **jenia-videos**
2. Regardez les détails du bucket
3. "Public bucket" doit être **coché**

**Méthode 2** : Testez une URL
1. Uploadez un fichier test
2. Copiez l'URL publique
3. Ouvrez-la dans un navigateur **en navigation privée**
4. Si le fichier se télécharge → Bucket public ✅
5. Si erreur 401/403 → Bucket privé ❌

---

### Dois-je créer les politiques RLS même si le bucket est public ?

**Réponse :**

**OUI !** C'est essentiel.

Le bucket "public" signifie que les fichiers peuvent être lus publiquement, **mais** les politiques RLS contrôlent qui peut :
- **SELECT** (lire) : Tout le monde
- **INSERT** (uploader) : Vous définissez
- **DELETE** (supprimer) : Vous définissez

Sans politiques, même avec un bucket public, vous aurez des erreurs.

---

## Upload et Fichiers

### Quelle est la taille maximale pour un fichier ?

**Réponse :**

**Par défaut dans votre projet** : 1000 MB (1 GB)

**Configurable** :
- Dans le code : `server/upload.ts` (ligne `fileSize: 1000 * 1024 * 1024`)
- Dans Supabase : Settings du bucket (jusqu'à 5 GB)

**Limite Supabase** :
- Plan gratuit : 500 MB par défaut (configurable jusqu'à 5 GB)
- Plan Pro : 5 GB max

---

### Quels formats de vidéo sont supportés ?

**Réponse :**

**Tous les formats vidéo** sont techniquement supportés par Supabase Storage.

**Recommandé pour le web** :
- **MP4** (H.264) : Le meilleur choix
- **WebM** : Alternative moderne
- **MOV** : Fonctionne mais plus lourd

**À éviter** :
- AVI : Trop lourd, pas optimisé web
- MKV : Pas supporté par tous les navigateurs

---

### Comment optimiser mes vidéos avant l'upload ?

**Réponse :**

**Utiliser FFmpeg** :

```bash
# Installation
# Windows: https://ffmpeg.org/download.html
# Mac: brew install ffmpeg
# Linux: sudo apt install ffmpeg

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

**Paramètres expliqués** :
- `-c:v libx264` : Codec H.264
- `-preset slow` : Meilleure compression (plus lent)
- `-crf 20` : Qualité (18-23 recommandé, plus bas = meilleure qualité)
- `-c:a aac` : Codec audio
- `-b:a 128k` : Bitrate audio
- `-vf scale=1920:1080` : Résolution Full HD

**Résultat** :
- Vidéo plus légère (30-50% de réduction)
- Qualité visuelle conservée
- Chargement plus rapide

---

### Puis-je uploader des images aussi ?

**Réponse :**

**OUI !** Votre projet supporte les images.

Dans `server/upload.ts`, le filtre accepte :
```javascript
file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')
```

Les images seront stockées dans `thumbnails/` au lieu de `videos/`.

**Formats supportés** : JPG, PNG, GIF, WebP, etc.

---

### Comment supprimer une vidéo de Supabase ?

**Réponse :**

**Méthode 1** : Via votre interface admin
1. Allez sur `/admin`
2. Cliquez sur le bouton "Supprimer" de la vidéo
3. La vidéo sera supprimée de Supabase ET de la base de données

**Méthode 2** : Via le Dashboard Supabase
1. Storage > jenia-videos
2. Trouvez le fichier
3. Cliquez sur les 3 points > Delete

**Méthode 3** : Via code
```typescript
import { storageDelete } from './server/supabase-storage';
await storageDelete('videos/mon-fichier.mp4');
```

---

## Erreurs Courantes

### ❌ "Bucket not found"

**Cause** : Le bucket n'existe pas ou le nom est incorrect.

**Solutions** :
1. Vérifiez que le bucket existe dans Supabase Dashboard
2. Vérifiez le nom dans `.env` : `SUPABASE_BUCKET_NAME=jenia-videos`
3. Attention à la casse (majuscules/minuscules)

---

### ❌ "Upload failed" ou "Policy violation"

**Cause** : Politiques RLS manquantes ou incorrectes.

**Solutions** :
1. Vérifiez que vous avez créé les 3 politiques (SELECT, INSERT, DELETE)
2. Vérifiez que le bucket est **public**
3. Reconnectez-vous à Supabase (parfois les permissions prennent du temps)

**Politique INSERT correcte** :
```sql
bucket_id = 'jenia-videos'
```

---

### ❌ "Invalid credentials" ou "Connection refused"

**Cause** : Clés API incorrectes ou URL invalide.

**Solutions** :
1. Vérifiez `SUPABASE_URL` dans `.env` (doit être `https://xxxxx.supabase.co`)
2. Vérifiez `SUPABASE_SERVICE_ROLE_KEY` (pas d'espace avant/après)
3. Re-copiez les clés depuis le Dashboard (Settings > API)

---

### ❌ La vidéo ne s'affiche pas sur le site

**Cause** : Multiple possibles.

**Diagnostic** :
1. Ouvrez la console du navigateur (F12)
2. Regardez les erreurs réseau
3. Testez l'URL de la vidéo directement

**Solutions** :
- **404 Not Found** : Le fichier n'existe pas dans Supabase
- **403 Forbidden** : Politiques RLS incorrectes ou bucket privé
- **CORS Error** : Rare avec Supabase, vérifiez le bucket public

---

### ❌ "File too large"

**Cause** : Fichier dépasse la limite configurée.

**Solutions** :
1. Compressez la vidéo avec FFmpeg
2. Augmentez la limite dans `server/upload.ts` :
   ```typescript
   limits: {
     fileSize: 2000 * 1024 * 1024, // 2GB
   }
   ```
3. Augmentez la limite dans Supabase (Settings du bucket)

---

## Performance

### Les vidéos sont lentes à charger

**Causes** :
- Vidéos trop lourdes
- Connexion internet lente
- Pas d'optimisation

**Solutions** :
1. **Compressez vos vidéos** (voir section Upload)
2. **Utilisez des miniatures** pour précharger
3. **Ajoutez un loader** pendant le chargement
4. **Optez pour des durées courtes** (15-30 secondes)

**Tailles recommandées** :
- 10-15 MB : Chargement rapide (3-5 secondes en 4G)
- 20-30 MB : Acceptable (5-10 secondes en 4G)
- 50+ MB : Lent (10-20+ secondes en 4G)

---

### Le CDN Supabase est-il vraiment rapide ?

**Réponse :**

**OUI**, Supabase utilise un CDN global.

**Avantages** :
- Cache automatique
- Edge locations dans le monde entier
- Compression intelligente
- Range requests (streaming)

**Test** :
- France → Europe West → ~100-200ms
- USA → Réplication automatique → ~200-400ms
- Asie → Réplication automatique → ~300-600ms

**Note** : Le premier chargement est plus lent (pas encore en cache), les suivants sont très rapides.

---

### Puis-je utiliser un CDN externe ?

**Réponse :**

**Pas nécessaire**. Supabase inclut déjà un CDN.

Si vraiment besoin :
- CloudFlare
- AWS CloudFront

Mais vous perdez en simplicité pour un gain marginal.

---

## Sécurité

### Mes clés API sont-elles sécurisées ?

**Réponse :**

**SUPABASE_ANON_KEY** :
- ✅ Peut être exposée au frontend
- ✅ Limitée par les politiques RLS
- ✅ Pas de danger si elle fuit

**SUPABASE_SERVICE_ROLE_KEY** :
- ❌ NE JAMAIS exposer au frontend
- ❌ NE JAMAIS committer sur Git
- ✅ Utilisée uniquement côté serveur
- ⚠️ Accès complet si compromise

**Protection** :
- Fichier `.env` dans `.gitignore` ✅
- Utilisé uniquement côté backend ✅

---

### Quelqu'un peut-il uploader des fichiers sur mon bucket ?

**Réponse :**

**Dépend de vos politiques RLS**.

Dans votre configuration actuelle :
- **Lecture** : Oui, tout le monde (c'est voulu)
- **Upload/Suppression** : Dépend de comment vous avez configuré

**Recommandation** :
Si vous voulez protéger l'upload :
1. Créez une policy INSERT stricte
2. Ajoutez une authentification dans votre admin
3. Utilisez `SUPABASE_SERVICE_ROLE_KEY` côté serveur

**Actuellement** :
Votre endpoint `/upload` est accessible sans auth.

**Pour sécuriser** (à faire plus tard) :
- Ajoutez un middleware d'authentification
- Vérifiez un token JWT
- Limitez les IPs autorisées

---

### Est-ce que Supabase peut voir mes vidéos ?

**Réponse :**

**Techniquement, oui**. Supabase héberge vos fichiers.

**En pratique** :
- Politiques de confidentialité strictes
- Conformité RGPD
- Entreprise sérieuse et réputée

**Alternative si besoin** :
- Chiffrer les fichiers avant upload
- Utiliser votre propre serveur
- Utiliser un cloud privé

**Pour un portfolio public, ce n'est pas un problème**.

---

## Coûts et Limites

### Le plan gratuit est-il vraiment gratuit ?

**Réponse :**

**OUI, à 100%**.

**Inclus** :
- 1 GB de stockage
- 2 GB de bande passante par mois
- Aucune carte bancaire requise
- Pas de durée limitée

**Après dépassement** :
- Supabase vous prévient
- Vous pouvez upgrader au plan Pro
- Ou supprimer des fichiers pour revenir sous la limite

---

### 1 GB, c'est suffisant ?

**Réponse :**

**Dépend du nombre et de la taille de vos vidéos**.

**Exemples** :
- Vidéos de 10 MB → 100 vidéos
- Vidéos de 15 MB → 66 vidéos
- Vidéos de 25 MB → 40 vidéos
- Vidéos de 50 MB → 20 vidéos

**Pour un portfolio** : 10-20 vidéos suffisent largement.

**Solution si dépassement** :
1. Compressez mieux vos vidéos
2. Passez au plan Pro ($25/mois = 100 GB)

---

### Qu'est-ce que la "bande passante" ?

**Réponse :**

**Bande passante** = Quantité de données téléchargées par vos visiteurs.

**Exemple** :
- Vidéo de 20 MB
- 100 visiteurs regardent la vidéo
- Bande passante utilisée : 100 × 20 MB = 2 GB

**Plan gratuit** : 2 GB/mois

**Si dépassement** :
- 100-200 visiteurs/mois → OK
- 500+ visiteurs/mois → Risque de dépassement
- Solution : Compresser les vidéos ou passer au Pro

---

### Comment surveiller ma consommation ?

**Réponse :**

**Dashboard Supabase** :
1. Allez sur votre projet
2. **Settings** > **Usage**
3. Vous verrez :
   - Stockage utilisé
   - Bande passante utilisée
   - Graphiques mensuels

**Alertes** :
Supabase envoie un email à 80% et 100% d'utilisation.

---

## Déploiement

### Dois-je reconfigurer Supabase pour la production ?

**Réponse :**

**NON !** Utilisez les mêmes credentials.

**Pourquoi** :
- Même bucket
- Mêmes vidéos
- Plus simple

**Sur Vercel** :
1. Ajoutez les mêmes variables d'environnement
2. Copiez-collez depuis `.env` local

---

### Les URLs des vidéos changent en production ?

**Réponse :**

**NON**. Les URLs Supabase restent identiques.

Exemple :
```
https://xxxxx.supabase.co/storage/v1/object/public/jenia-videos/video.mp4
```

Cette URL est la même en :
- Développement local
- Production sur Vercel

---

### Puis-je utiliser un nom de domaine personnalisé ?

**Réponse :**

**Pour votre site** : Oui (via Vercel)

**Pour les URLs Supabase** : Oui, mais avancé.

**Configuration avancée** :
1. Custom domain dans Supabase (Plan Pro)
2. Configuration DNS
3. Certificat SSL

**Recommandé** : Gardez les URLs Supabase standard (plus simple).

---

## Personnalisation

### Comment changer le nom du bucket ?

**Réponse :**

**Si pas encore de vidéos** :
1. Créez un nouveau bucket avec le nouveau nom
2. Changez `SUPABASE_BUCKET_NAME` dans `.env`

**Si déjà des vidéos** :
1. Pas possible de renommer un bucket
2. Solution : Créer un nouveau bucket et migrer les fichiers
3. Ou garder le nom actuel (pas visible pour les utilisateurs)

---

### Puis-je organiser les vidéos dans des dossiers ?

**Réponse :**

**OUI !**

Dans `server/upload.ts`, vous pouvez modifier :
```typescript
const fileKey = `videos/${timestamp}-${randomSuffix}-${cleanFilename}`;
```

Par exemple, organiser par catégorie :
```typescript
const category = req.body.category || 'general';
const fileKey = `videos/${category}/${timestamp}-${cleanFilename}`;
```

---

### Comment ajouter des métadonnées personnalisées ?

**Réponse :**

**Méthode 1** : Dans la base de données MySQL

Ajoutez des colonnes dans `drizzle/schema.ts` :
```typescript
export const videos = mysqlTable("videos", {
  // ... colonnes existantes
  category: varchar("category", { length: 100 }),
  tags: text("tags"), // JSON array
  views: int("views").default(0),
});
```

**Méthode 2** : Métadonnées Supabase

Dans `server/supabase-storage.ts` :
```typescript
await supabase.storage
  .from(bucketName)
  .upload(key, data, {
    contentType,
    metadata: {
      category: 'demo',
      author: 'Studio Jenia'
    }
  });
```

---

## 💬 Questions non couvertes ?

### Vous ne trouvez pas votre question ?

**Consultez** :
1. `GUIDE_CONFIGURATION_SUPABASE.md` (section dépannage)
2. `ARCHITECTURE_SUPABASE.md` (explications techniques)
3. Documentation Supabase : https://supabase.com/docs
4. Discord Supabase : https://discord.supabase.com

**Contactez-nous** :
- 📧 Email : studio.jenia@gmail.com

---

**Cette FAQ sera mise à jour au fil du temps** 📝


