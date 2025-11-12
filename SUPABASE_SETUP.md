# Configuration Supabase pour Jenia Portfolio

Ce guide vous aide à configurer Supabase Storage pour héberger vos vidéos.

## Étape 1 : Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte (gratuit) ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez les informations :
   - **Name**: jenia-portfolio
   - **Database Password**: (générez un mot de passe fort)
   - **Region**: Choisissez le plus proche de vous
5. Attendez que le projet soit créé (2-3 minutes)

## Étape 2 : Créer le bucket de stockage

1. Dans votre projet Supabase, allez dans **Storage** (menu latéral gauche)
2. Cliquez sur **Create a new bucket**
3. Configurez le bucket :
   - **Name**: `jenia-videos`
   - **Public bucket**: ✅ Cochez cette case (important!)
   - **File size limit**: 1000 MB
   - **Allowed MIME types**: Laissez vide pour tout autoriser
4. Cliquez sur **Create bucket**

## Étape 3 : Configurer les politiques de sécurité (RLS)

Pour permettre l'upload et l'affichage des vidéos, vous devez configurer les politiques :

1. Dans **Storage**, cliquez sur votre bucket `jenia-videos`
2. Allez dans l'onglet **Policies**
3. Créez deux politiques :

### Politique 1 : Lecture publique (SELECT)
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'jenia-videos' );
```

### Politique 2 : Upload (INSERT) - Seulement pour les admins
```sql
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'jenia-videos' );
```

### Politique 3 : Suppression (DELETE) - Seulement pour les admins
```sql
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'jenia-videos' );
```

**OU** plus simplement, via l'interface Supabase :
1. Cliquez sur **New Policy**
2. Sélectionnez **"Enable read access for all users"** pour la lecture
3. Créez une autre politique pour l'upload sans restrictions (vous gérerez les droits dans votre code admin)

## Étape 4 : Récupérer vos clés API

1. Allez dans **Settings** > **API** (dans le menu)
2. Vous verrez deux sections importantes :

### URL du projet
```
https://xxxxxxxxxxxxx.supabase.co
```
Copiez cette URL, c'est votre `SUPABASE_URL`

### API Keys
- **anon / public**: C'est votre `SUPABASE_ANON_KEY`
- **service_role**: C'est votre `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Gardez-la secrète!

## Étape 5 : Configurer votre fichier .env

Ouvrez le fichier `.env` à la racine du projet et remplissez :

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Storage Bucket
SUPABASE_BUCKET_NAME=jenia-videos
```

⚠️ **Important** : Ne commitez JAMAIS votre fichier `.env` sur Git! Il est déjà dans le `.gitignore`.

## Étape 6 : Tester la configuration

1. Installez les dépendances :
```bash
pnpm install
```

2. Lancez le serveur en développement :
```bash
pnpm dev
```

3. Allez sur `http://localhost:5000/admin`
4. Essayez d'uploader une vidéo de test
5. Vérifiez dans votre dashboard Supabase que le fichier apparaît dans **Storage** > **jenia-videos**

## Optimisations pour les vidéos de qualité

### Formats recommandés
- **Format**: MP4 (H.264)
- **Résolution**: 1920x1080 (Full HD) ou 3840x2160 (4K)
- **Bitrate**: 8-12 Mbps pour FHD, 35-50 Mbps pour 4K
- **Codec audio**: AAC, 128-192 kbps

### Compression recommandée
Pour optimiser vos vidéos avant upload, utilisez FFmpeg :

```bash
# Compression optimale pour le web (Full HD)
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 20 -c:a aac -b:a 128k -vf scale=1920:1080 output.mp4

# Pour 4K
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 192k -vf scale=3840:2160 output.mp4
```

### Limites Supabase
- **Plan gratuit**: 1 GB de stockage
- **Plan Pro ($25/mois)**: 100 GB de stockage
- **Taille max par fichier**: 5 GB (configurable dans le bucket)

## Dépannage

### ❌ Erreur "Bucket not found"
→ Vérifiez que `SUPABASE_BUCKET_NAME` correspond exactement au nom de votre bucket

### ❌ Erreur "Upload failed"
→ Vérifiez vos clés API dans le fichier `.env`
→ Assurez-vous que les politiques RLS sont bien configurées

### ❌ Vidéo ne s'affiche pas
→ Vérifiez que votre bucket est **public**
→ Testez l'URL directement dans votre navigateur

### ❌ "Row Level Security policy violation"
→ Vos politiques RLS sont trop restrictives
→ Ajoutez les politiques mentionnées ci-dessus

## Support

En cas de problème :
- [Documentation Supabase Storage](https://supabase.com/docs/guides/storage)
- [Supabase Discord](https://discord.supabase.com/)
