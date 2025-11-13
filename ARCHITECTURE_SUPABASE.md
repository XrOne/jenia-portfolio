# 🏗️ Architecture - Intégration Supabase

## 📐 Vue d'ensemble de l'architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      JENIA PORTFOLIO                             │
│                   (Application Full-Stack)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌─────────┐         ┌──────────┐         ┌─────────────┐
   │ FRONTEND│         │  BACKEND │         │  SUPABASE   │
   │ (React) │◄────────┤ (Express)│◄────────┤  STORAGE    │
   └─────────┘         └──────────┘         └─────────────┘
        │                     │                     │
        │                     ▼                     │
        │              ┌──────────┐                │
        │              │   MySQL  │                │
        │              │ Database │                │
        │              └──────────┘                │
        │                                          │
        └──────────────────────────────────────────┘
                   (URLs publiques des vidéos)
```

---

## 🔄 Flux d'upload d'une vidéo

```
┌──────────┐
│  ADMIN   │
│   PAGE   │  1. Sélectionne une vidéo MP4
└────┬─────┘
     │
     │ 2. Upload via formulaire
     │
     ▼
┌──────────────────┐
│  Upload Router   │  3. Reçoit le fichier (Multer)
│ server/upload.ts │     - Taille: jusqu'à 1GB
└────┬─────────────┘     - Type: video/* ou image/*
     │
     │ 4. Appelle storagePut()
     │
     ▼
┌──────────────────────────┐
│  Supabase Storage Module │  5. Upload vers Supabase
│ server/supabase-storage.ts│    - createClient()
└────┬─────────────────────┘    - storage.upload()
     │
     │ 6. Requête HTTP vers Supabase
     │
     ▼
┌─────────────────────┐
│  SUPABASE STORAGE   │  7. Stocke le fichier
│  Bucket: jenia-videos│    - Vérification RLS
└────┬────────────────┘    - Génération URL publique
     │
     │ 8. Retourne l'URL publique
     │    https://xxxxx.supabase.co/storage/v1/object/public/jenia-videos/...
     │
     ▼
┌──────────────────┐
│  Upload Router   │  9. Enregistre dans MySQL
│                  │     - videoUrl
│                  │     - fileKey
└────┬─────────────┘     - metadata
     │
     │ 10. Retourne le résultat au frontend
     │
     ▼
┌──────────┐
│  ADMIN   │  11. Affiche un message de succès
│   PAGE   │      "Vidéo uploadée avec succès!"
└──────────┘
```

---

## 📂 Structure des fichiers clés

```
jenia-portfolio/
│
├── 📁 server/
│   │
│   ├── 📄 supabase-storage.ts        [MODULE PRINCIPAL SUPABASE]
│   │   ├── createClient()             → Initialise le client Supabase
│   │   ├── storagePut()               → Upload un fichier
│   │   ├── storageGet()               → Récupère l'URL d'un fichier
│   │   ├── storageDelete()            → Supprime un fichier
│   │   └── storageList()              → Liste les fichiers
│   │
│   ├── 📄 upload.ts                   [GESTION DES UPLOADS]
│   │   ├── multer.memoryStorage()     → Stocke en mémoire
│   │   ├── POST /upload               → Route d'upload
│   │   └── Appelle storagePut()       → Envoie à Supabase
│   │
│   ├── 📄 db.ts                       [BASE DE DONNÉES]
│   │   ├── getAllVideos()             → Liste toutes les vidéos
│   │   ├── createVideo()              → Crée une vidéo en BDD
│   │   ├── updateVideo()              → Met à jour une vidéo
│   │   └── deleteVideo()              → Supprime une vidéo
│   │
│   └── 📁 _core/
│       └── 📄 env.ts                  [VARIABLES D'ENVIRONNEMENT]
│           ├── supabaseUrl            → URL du projet
│           ├── supabaseAnonKey        → Clé publique
│           ├── supabaseServiceRoleKey → Clé secrète
│           └── supabaseBucketName     → Nom du bucket
│
├── 📁 client/
│   └── 📁 src/
│       └── 📁 pages/
│           ├── 📄 Admin.tsx           [INTERFACE ADMIN]
│           │   ├── Formulaire upload
│           │   ├── Liste des vidéos
│           │   └── Gestion CRUD
│           │
│           └── 📄 Home.tsx            [PAGE D'ACCUEIL]
│               ├── Affichage vidéo background
│               └── Lecture automatique
│
├── 📁 drizzle/
│   └── 📄 schema.ts                   [SCHÉMA BASE DE DONNÉES]
│       └── videos table
│           ├── id (int, primary key)
│           ├── title (varchar)
│           ├── videoUrl (text)        → URL Supabase
│           ├── fileKey (varchar)      → Clé dans Supabase
│           └── isActive (boolean)
│
├── 📁 scripts/
│   └── 📄 test-supabase.ts            [SCRIPT DE TEST]
│       ├── Test connexion
│       ├── Test upload
│       ├── Test récupération URL
│       └── Test suppression
│
├── 📄 .env                            [CONFIGURATION]
│   ├── SUPABASE_URL
│   ├── SUPABASE_ANON_KEY
│   ├── SUPABASE_SERVICE_ROLE_KEY
│   ├── SUPABASE_BUCKET_NAME
│   ├── DATABASE_URL
│   └── JWT_SECRET
│
└── 📄 package.json                    [DÉPENDANCES]
    └── @supabase/supabase-js          → SDK officiel
```

---

## 🔐 Sécurité et authentification

### Niveaux de sécurité

```
┌─────────────────────────────────────────────────┐
│              NIVEAU 1 : CLIENT                  │
│  ┌─────────────────────────────────────┐        │
│  │  SUPABASE_ANON_KEY                  │        │
│  │  - Clé publique                     │        │
│  │  - Peut être exposée au frontend    │        │
│  │  - Limitée par les politiques RLS   │        │
│  └─────────────────────────────────────┘        │
└─────────────────────────────────────────────────┘
                     │
                     │ RLS Policies
                     ▼
┌─────────────────────────────────────────────────┐
│         NIVEAU 2 : POLITIQUES RLS               │
│  ┌─────────────────────────────────────┐        │
│  │  SELECT (lecture publique)          │        │
│  │  - Tout le monde peut lire          │        │
│  │                                     │        │
│  │  INSERT (upload admin)              │        │
│  │  - Authentifié ou anon              │        │
│  │                                     │        │
│  │  DELETE (suppression admin)         │        │
│  │  - Authentifié ou anon              │        │
│  └─────────────────────────────────────┘        │
└─────────────────────────────────────────────────┘
                     │
                     │ Bypass RLS
                     ▼
┌─────────────────────────────────────────────────┐
│         NIVEAU 3 : SERVER (Backend)             │
│  ┌─────────────────────────────────────┐        │
│  │  SUPABASE_SERVICE_ROLE_KEY          │        │
│  │  - Clé secrète                      │        │
│  │  - JAMAIS exposée au frontend       │        │
│  │  - Bypass les politiques RLS        │        │
│  │  - Accès complet                    │        │
│  └─────────────────────────────────────┘        │
└─────────────────────────────────────────────────┘
```

---

## 🌊 Flux de lecture d'une vidéo

```
┌──────────┐
│  USER    │  1. Visite la page d'accueil
│ (Visiteur)│
└────┬─────┘
     │
     │ 2. React charge le composant Home
     │
     ▼
┌──────────────────┐
│   Home.tsx       │  3. Appelle tRPC pour récupérer les vidéos
│  (Frontend)      │     getActiveVideos()
└────┬─────────────┘
     │
     │ 4. Requête tRPC
     │
     ▼
┌──────────────────┐
│   Backend        │  5. Query MySQL
│  (server/db.ts)  │     SELECT * FROM videos WHERE isActive = true
└────┬─────────────┘
     │
     │ 6. Retourne les données
     │    [{ id: 1, videoUrl: "https://xxxxx.supabase.co/...", ... }]
     │
     ▼
┌──────────────────┐
│   Home.tsx       │  7. Reçoit la liste des vidéos
│                  │     - Crée un élément <video>
└────┬─────────────┘     - src = videoUrl (URL Supabase)
     │
     │ 8. Navigateur télécharge la vidéo
     │
     ▼
┌─────────────────────┐
│  SUPABASE STORAGE   │  9. Sert le fichier vidéo
│                     │     - Vérification des politiques RLS (SELECT)
└────┬────────────────┘     - Streaming du fichier
     │
     │ 10. Stream de la vidéo
     │
     ▼
┌──────────┐
│  USER    │  11. La vidéo se lit en arrière-plan
└──────────┘       (autoplay, loop, muted)
```

---

## 🗂️ Schéma de la base de données

```sql
┌─────────────────────────────────────────┐
│              TABLE: videos              │
├─────────────────────────────────────────┤
│ id              INT (PK, AUTO_INCREMENT)│
│ title           VARCHAR(255)            │
│ description     TEXT                    │
│ videoUrl        TEXT ◄──────────────────┼─── URL Supabase Storage
│ thumbnailUrl    TEXT                    │
│ fileKey         VARCHAR(512) ◄──────────┼─── Clé dans Supabase
│ duration        INT                     │
│ isActive        BOOLEAN (default: true) │
│ displayOrder    INT (default: 0)        │
│ createdAt       TIMESTAMP               │
│ updatedAt       TIMESTAMP               │
└─────────────────────────────────────────┘
                    │
                    │ Relations futures possibles
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
  ┌──────────┐          ┌──────────┐
  │ projects │          │ services │
  └──────────┘          └──────────┘
```

---

## 🎯 Politiques RLS Supabase

```sql
-- Politique 1 : Lecture publique
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'jenia-videos');

-- Permet à TOUT LE MONDE de voir les vidéos
-- Nécessaire pour que le site public fonctionne


-- Politique 2 : Upload
CREATE POLICY "Allow Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'jenia-videos');

-- Permet l'upload de nouvelles vidéos
-- Dans votre cas, géré par le backend avec SERVICE_ROLE_KEY


-- Politique 3 : Suppression
CREATE POLICY "Allow Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'jenia-videos');

-- Permet la suppression de vidéos
-- Également géré par le backend
```

---

## 📊 Comparaison : Avant vs Après Supabase

### Avant (Manus/Forge)

```
┌──────────┐      ┌─────────────┐      ┌──────────────┐
│  CLIENT  │─────>│   BACKEND   │─────>│  MANUS FORGE │
└──────────┘      └─────────────┘      └──────────────┘
                         │                     │
                         │              ┌──────┘
                         │              │
                         ▼              ▼
                  ┌─────────────────────────┐
                  │    Système complexe     │
                  │  - Configuration custom │
                  │  - Dépendances Manus    │
                  └─────────────────────────┘
```

**Problèmes** :
- ❌ Dépendance au système Manus
- ❌ Configuration complexe
- ❌ Pas adapté pour portfolio simple
- ❌ Difficile à maintenir

### Après (Supabase)

```
┌──────────┐      ┌─────────────┐      ┌──────────────┐
│  CLIENT  │─────>│   BACKEND   │─────>│   SUPABASE   │
└──────────┘      └─────────────┘      └──────────────┘
                                               │
                                        Bucket public
                                        "jenia-videos"
                                               │
                         ┌─────────────────────┘
                         ▼
                  ┌─────────────────────────┐
                  │   Hébergement cloud     │
                  │  - Setup en 5 minutes   │
                  │  - Gratuit (1GB)        │
                  │  - URLs publiques       │
                  │  - CDN intégré          │
                  └─────────────────────────┘
```

**Avantages** :
- ✅ Simple et rapide
- ✅ Gratuit jusqu'à 1GB
- ✅ CDN intégré (rapide partout dans le monde)
- ✅ Facile à déployer
- ✅ Documentation excellente
- ✅ Dashboard visuel

---

## 🚀 Performance

### Optimisations automatiques

```
┌─────────────────────────────────────────┐
│          SUPABASE STORAGE               │
│  ┌───────────────────────────────┐      │
│  │  CDN Mondial                  │      │
│  │  - Cache automatique          │      │
│  │  - Edge locations             │      │
│  │  - Compression intelligente   │      │
│  └───────────────────────────────┘      │
│                 │                        │
│                 ▼                        │
│  ┌───────────────────────────────┐      │
│  │  Votre bucket "jenia-videos"  │      │
│  │  - Videos en 1080p            │      │
│  │  - Streaming optimisé         │      │
│  │  - Range requests supportés   │      │
│  └───────────────────────────────┘      │
└─────────────────────────────────────────┘
```

### Temps de chargement typiques

| Taille vidéo | Connexion | Temps de chargement |
|--------------|-----------|---------------------|
| 10 MB        | 4G        | ~2-3 secondes       |
| 50 MB        | 4G        | ~8-10 secondes      |
| 100 MB       | 4G        | ~15-20 secondes     |
| 10 MB        | Fiber     | <1 seconde          |
| 50 MB        | Fiber     | ~2-3 secondes       |
| 100 MB       | Fiber     | ~4-6 secondes       |

---

## 💰 Limites et coûts

### Plan gratuit (Free tier)

```
┌──────────────────────────────────────┐
│  Supabase Free Plan                  │
├──────────────────────────────────────┤
│  ✅ 1 GB de stockage                 │
│  ✅ 2 GB de bande passante/mois      │
│  ✅ Bucket public                    │
│  ✅ CDN inclus                       │
│  ✅ 500 MB upload max par fichier    │
│     (configurable jusqu'à 5GB)       │
└──────────────────────────────────────┘
```

### Plan Pro ($25/mois)

```
┌──────────────────────────────────────┐
│  Supabase Pro Plan                   │
├──────────────────────────────────────┤
│  ✅ 100 GB de stockage               │
│  ✅ 200 GB de bande passante/mois    │
│  ✅ Support prioritaire              │
│  ✅ Backups automatiques             │
└──────────────────────────────────────┘
```

### Estimation pour votre portfolio

```
Scénario : 20 vidéos de démo de 30 secondes chacune

Taille par vidéo (optimisée) : 25 MB
Total : 20 × 25 MB = 500 MB

✅ RENTRE DANS LE PLAN GRATUIT !

Bande passante :
- 100 visiteurs/mois × 3 vidéos vues = 300 vues
- 300 × 25 MB = 7.5 GB de bande passante

⚠️ Dépassement du plan gratuit (2 GB/mois)
→ Solution : Optimiser les vidéos (10-15 MB) ou passer au plan Pro
```

---

## 🔄 Workflow de développement

```
┌──────────────────────────────────────────────────┐
│              DÉVELOPPEMENT LOCAL                  │
├──────────────────────────────────────────────────┤
│  1. Modifier le code                             │
│  2. pnpm dev                                     │
│  3. Tester sur http://localhost:5000            │
│  4. Upload test via /admin                       │
│  5. Vérifier dans Supabase Dashboard            │
└──────────────────────────────────────────────────┘
                      │
                      │ Git push
                      ▼
┌──────────────────────────────────────────────────┐
│                   GITHUB                          │
├──────────────────────────────────────────────────┤
│  - Code source versionné                         │
│  - Trigger automatique Vercel                    │
└──────────────────────────────────────────────────┘
                      │
                      │ Auto deploy
                      ▼
┌──────────────────────────────────────────────────┐
│                   VERCEL                          │
├──────────────────────────────────────────────────┤
│  1. Build automatique                            │
│  2. Deploy sur CDN                               │
│  3. Variables d'env configurées                  │
│  4. Site live en 2 minutes                       │
└──────────────────────────────────────────────────┘
                      │
                      │ Utilise
                      ▼
┌──────────────────────────────────────────────────┐
│                 SUPABASE                          │
├──────────────────────────────────────────────────┤
│  - Même bucket "jenia-videos"                    │
│  - Même credentials                              │
│  - URLs publiques identiques                     │
└──────────────────────────────────────────────────┘
```

---

## ✅ Checklist d'architecture

Pour vérifier que tout est bien configuré :

```
FRONTEND
☐ Page Admin fonctionnelle
☐ Formulaire d'upload
☐ Affichage vidéos background

BACKEND
☐ Module supabase-storage.ts
☐ Route /upload configurée
☐ Variables d'environnement chargées
☐ Connexion MySQL (optionnel)

SUPABASE
☐ Projet créé
☐ Bucket "jenia-videos" public
☐ Politiques RLS configurées
☐ Clés API récupérées

BASE DE DONNÉES
☐ Table "videos" créée
☐ Migration exécutée (pnpm db:push)

TESTS
☐ pnpm test:supabase passe
☐ Upload test fonctionne
☐ Vidéo s'affiche sur le site

PRODUCTION
☐ Déployé sur Vercel
☐ Variables d'env configurées
☐ Site accessible publiquement
```

---

## 📚 Ressources

- **Supabase Docs** : https://supabase.com/docs/guides/storage
- **SDK JS** : https://supabase.com/docs/reference/javascript/storage
- **RLS Policies** : https://supabase.com/docs/guides/auth/row-level-security

---

**Votre architecture est maintenant claire !** 🎉


