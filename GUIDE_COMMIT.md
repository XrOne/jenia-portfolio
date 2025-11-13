# 🚀 Guide de Commit - Jenia Portfolio

## Situation actuelle

Votre projet `I:\jenia-portfolio` est déjà connecté à GitHub :
- **Repository** : `https://github.com/XrOne/jenia-portfolio.git`
- **Branch** : `main`

## 📋 Fichiers à commiter

Tous les nouveaux fichiers créés lors de la migration Supabase :
- `.env.example`
- `server/supabase-storage.ts`
- `scripts/test-supabase.ts`
- Documentation complète (10+ fichiers .md)
- Modifications dans `server/upload.ts`, `server/_core/env.ts`, `package.json`

## 🎯 Commiter les changements

### Option 1 : Via Terminal (Recommandé)

Ouvrez un terminal dans `I:\jenia-portfolio` et exécutez :

```bash
# 1. Voir l'état actuel
git status

# 2. Ajouter TOUS les nouveaux fichiers (sauf .env qui est dans .gitignore)
git add .

# 3. Voir ce qui va être commité
git status

# 4. Créer le commit
git commit -m "feat: Migration vers Supabase Storage

- Ajout module Supabase Storage (supabase-storage.ts)
- Remplacement système Manus/Forge par Supabase
- Upload de vidéos jusqu'à 1GB
- Script de test automatisé (pnpm test:supabase)
- Documentation complète (10+ guides)
- Configuration Vercel pour déploiement
- Optimisations performance et gestion erreurs

Breaking changes:
- Nécessite configuration Supabase
- Variables d'environnement modifiées

Voir MIGRATION_SUPABASE.md pour les instructions complètes"

# 5. Pousser vers GitHub
git push origin main
```

### Option 2 : Via VS Code / Cursor

1. Ouvrez le dossier `I:\jenia-portfolio` dans VS Code/Cursor
2. Allez dans l'onglet **Source Control** (Ctrl+Shift+G)
3. Vérifiez les fichiers à commiter
4. Ajoutez un message de commit (voir ci-dessus)
5. Cliquez sur **Commit**
6. Cliquez sur **Sync** ou **Push**

## ⚠️ Vérifications avant de commiter

### 1. Vérifier que .env n'est PAS dans le commit

```bash
git status | findstr .env
```

Vous devriez voir SEULEMENT `.env.example`, PAS `.env`

Si `.env` apparaît :
```bash
git restore --staged .env
```

### 2. Vérifier .gitignore

Le fichier `.gitignore` doit contenir :
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 3. Vérifier node_modules

```bash
git status | findstr node_modules
```

Si `node_modules` apparaît, c'est un problème ! Ajoutez-le au `.gitignore`.

## 📊 Comparaison avec dossier Cursor

Pour comparer les deux dossiers, exécutez :

### Dans le dossier Cursor
```bash
cd C:\Users\User\.cursor\worktrees\jenia-portfolio
git status
git log --oneline -5
```

### Dans le dossier I:\
```bash
cd I:\jenia-portfolio
git status
git log --oneline -5
```

### Comparer les fichiers
```bash
# Voir les différences
git diff C:\Users\User\.cursor\worktrees\jenia-portfolio I:\jenia-portfolio
```

## 🔍 Quel dossier utiliser ?

Utilisez `I:\jenia-portfolio` si :
- ✅ Il contient tous les nouveaux fichiers de migration Supabase
- ✅ Il a tous les guides de documentation
- ✅ Le fichier `package.json` inclut `@supabase/supabase-js`
- ✅ `pnpm install` fonctionne sans erreur

Utilisez le dossier Cursor si :
- ❌ Le dossier I:\ est corrompu ou incomplet
- ❌ Il manque des fichiers importants

## 🎬 Après le commit

Une fois que vous avez pushé sur GitHub :

1. Allez sur https://github.com/XrOne/jenia-portfolio
2. Vérifiez que tous les fichiers sont présents
3. Vérifiez que `.env` n'est PAS visible (sécurité)
4. Vérifiez que le README.md s'affiche correctement
5. Prêt pour Vercel ! 🚀

## 🆘 En cas de problème

### Commit rejeté (rejected)
```bash
# Récupérer les dernières modifications
git pull origin main

# Réessayer le push
git push origin main
```

### Conflit de merge
```bash
# Voir les fichiers en conflit
git status

# Résoudre manuellement les conflits
# Puis :
git add .
git commit -m "Résolution des conflits"
git push origin main
```

### Annuler le dernier commit (si erreur)
```bash
# Annuler mais garder les modifications
git reset --soft HEAD~1

# Annuler ET supprimer les modifications
git reset --hard HEAD~1
```

## 📝 Message de commit recommandé

```
feat: Migration vers Supabase Storage + Documentation complète

🎉 Changements majeurs :
- Migration complète vers Supabase Storage
- Module supabase-storage.ts pour la gestion des fichiers
- Upload optimisé jusqu'à 1GB par fichier
- Script de test automatisé (pnpm test:supabase)

📚 Documentation :
- 10+ guides complets en français
- START_HERE.md pour démarrage rapide
- MIGRATION_SUPABASE.md avec instructions détaillées
- DEPLOYMENT.md pour mise en production Vercel

🔧 Modifications techniques :
- server/upload.ts : Utilise Supabase
- server/_core/env.ts : Variables Supabase
- package.json : Ajout @supabase/supabase-js
- vercel.json : Configuration déploiement

⚠️ Breaking changes :
- Nécessite compte Supabase (gratuit)
- Nouvelles variables d'environnement requises
- Migration depuis Manus/Forge

📖 Pour démarrer : voir MIGRATION_SUPABASE.md
```

## ✅ Checklist finale

Avant de push :
- [ ] `.env` n'est PAS dans le commit
- [ ] `node_modules` n'est PAS dans le commit
- [ ] `pnpm-lock.yaml` est commité
- [ ] Tous les fichiers .md sont inclus
- [ ] `package.json` contient `@supabase/supabase-js`
- [ ] Message de commit est clair et détaillé

Après le push :
- [ ] Vérifier sur GitHub que tout est là
- [ ] Cloner dans un nouveau dossier pour tester
- [ ] Prêt à déployer sur Vercel !

---

**Bon courage ! 🚀**
