# Guide : Corriger les politiques RLS Supabase pour l'upload de vidéos

## Problème
L'erreur "new row violates row-level security policy" empêche l'upload de vidéos car Supabase bloque les insertions dans le bucket `videos` par défaut.

## Solution : Configurer les politiques RLS via le Dashboard

### Étape 1 : Accéder au Dashboard Supabase
1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet **"site internet Jenia"**

### Étape 2 : Accéder à la configuration Storage
1. Dans le menu latéral gauche, cliquez sur **"Storage"**
2. Vous verrez votre bucket **"videos"**

### Étape 3 : Configurer les politiques RLS

#### Option A : Désactiver RLS (Simple, moins sécurisé)
1. Cliquez sur le bucket **"videos"**
2. Allez dans l'onglet **"Policies"**
3. Cliquez sur **"Disable RLS"** (bouton en haut à droite)
4. Confirmez

✅ **C'est tout !** L'upload devrait fonctionner immédiatement.

#### Option B : Créer des politiques RLS (Plus sécurisé)
1. Cliquez sur le bucket **"videos"**
2. Allez dans l'onglet **"Policies"**
3. Cliquez sur **"New Policy"**
4. Sélectionnez **"Create a policy from scratch"**
5. Créez 4 politiques :

**Politique 1 : Allow public uploads**
```sql
CREATE POLICY "Allow public uploads to videos bucket"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'videos');
```

**Politique 2 : Allow public reads**
```sql
CREATE POLICY "Allow public read access to videos bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'videos');
```

**Politique 3 : Allow public updates**
```sql
CREATE POLICY "Allow public updates to videos bucket"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'videos');
```

**Politique 4 : Allow public deletes**
```sql
CREATE POLICY "Allow public deletes to videos bucket"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'videos');
```

### Étape 4 : Tester l'upload
1. Retournez sur votre site Jenia
2. Allez dans **Admin**
3. Cliquez sur **"Ajouter une vidéo"**
4. Uploadez une vidéo

✅ **L'upload devrait maintenant fonctionner !**

## Alternative : Via SQL Editor

Si vous préférez utiliser le SQL Editor :

1. Allez dans **SQL Editor** dans le menu latéral
2. Collez ce script SQL :

```sql
-- Option 1 : Désactiver RLS (simple)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- OU Option 2 : Créer des politiques (plus sécurisé)
-- Activer RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Créer les politiques
CREATE POLICY "Allow public uploads to videos bucket"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Allow public read access to videos bucket"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'videos');

CREATE POLICY "Allow public updates to videos bucket"
ON storage.objects FOR UPDATE TO public
USING (bucket_id = 'videos');

CREATE POLICY "Allow public deletes to videos bucket"
ON storage.objects FOR DELETE TO public
USING (bucket_id = 'videos');
```

3. Cliquez sur **"Run"**

## Recommandation

Pour un site de portfolio comme Jenia, **l'Option A (désactiver RLS)** est suffisante car :
- Le bucket est déjà public
- Seuls les admins peuvent uploader (authentification côté app)
- Simplifie la configuration

Si vous voulez plus de sécurité, utilisez **l'Option B** avec des politiques qui vérifient l'authentification de l'utilisateur.
