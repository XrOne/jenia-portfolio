# 🎯 TODO - Prochaines Actions

## ⚡ Actions Immédiates (15 minutes)

### 1. Installer les dépendances
```bash
pnpm install
```

### 2. Configurer Supabase
👉 **Suivez le guide** : [MIGRATION_SUPABASE.md](./MIGRATION_SUPABASE.md)

Étapes rapides :
1. Créer compte sur supabase.com
2. Créer projet + bucket public "jenia-videos"
3. Récupérer les clés API
4. Remplir le fichier `.env`

### 3. Tester la config
```bash
pnpm test:supabase
```
Si tous les tests passent ✅, vous êtes prêt !

### 4. Lancer le serveur
```bash
pnpm dev
```
Visitez : http://localhost:5000

### 5. Premier upload
1. Allez sur `/admin`
2. Uploadez une vidéo test
3. Vérifiez qu'elle apparaît sur la page d'accueil

---

## 📚 Guides disponibles

| Guide | Quand l'utiliser |
|-------|------------------|
| [MIGRATION_SUPABASE.md](./MIGRATION_SUPABASE.md) | **COMMENCEZ ICI** - Migration vers Supabase |
| [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) | Guide détaillé Supabase |
| [README.md](./README.md) | Documentation complète du projet |
| [QUICKSTART.md](./QUICKSTART.md) | Démarrage ultra-rapide (5 min) |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Déployer sur Vercel |

---

## ✅ Checklist Déploiement

### Phase 1 : Configuration locale
- [ ] `pnpm install` exécuté
- [ ] Supabase configuré (compte + projet + bucket)
- [ ] Fichier `.env` rempli avec vos credentials
- [ ] `pnpm test:supabase` passe tous les tests ✅
- [ ] `pnpm dev` lance le serveur sans erreur
- [ ] Upload de vidéo fonctionne en local
- [ ] Vidéo s'affiche en arrière-plan

### Phase 2 : Optimisation
- [ ] Vidéos compressées (FFmpeg)
- [ ] Formats optimisés (MP4 H.264, 1920x1080)
- [ ] Plusieurs vidéos uploadées
- [ ] Page Services vérifiée
- [ ] Liens sociaux à jour (LinkedIn + Email)
- [ ] Responsive testé (mobile/tablette/desktop)

### Phase 3 : Déploiement
- [ ] Code pushé sur GitHub
- [ ] Compte Vercel créé
- [ ] Projet importé sur Vercel
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Déploiement réussi ✅
- [ ] Site en ligne testé
- [ ] Domaine personnalisé configuré (optionnel)

---

## 🆘 Besoin d'aide ?

### Problème avec Supabase ?
→ Consultez [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) section "Dépannage"

### Problème avec le déploiement ?
→ Consultez [DEPLOYMENT.md](./DEPLOYMENT.md) section "Résolution de problèmes"

### Autre problème ?
→ Consultez [README.md](./README.md) section "Dépannage"

---

## 📧 Contact

Email : studio.jenia@gmail.com
LinkedIn : [Charles Henri Marraud des Grottes](https://www.linkedin.com/in/charleshenrimarrauddesgrottes/)

---

**🎬 Bon courage pour Declics Saison 2 !**
