# Project TODO

## Phase 1: Base de données et authentification
- [x] Créer le schéma de base de données pour les vidéos
- [x] Créer le schéma pour les projets/démos
- [x] Créer le schéma pour les services
- [x] Configurer les procédures tRPC pour les vidéos
- [x] Configurer les procédures tRPC pour les projets
- [x] Configurer les procédures tRPC pour les services

## Phase 2: Interface publique
- [x] Créer la page d'accueil avec vidéo en arrière-plan
- [x] Implémenter le design style kryogen.ai (fond noir, vidéo fullscreen)
- [x] Créer la section Démos avec galerie de vidéos
- [x] Créer la section Processus (storyboard → Lora → workflow → validation → animation)
- [x] Créer la section Services avec les différentes formules
- [x] Ajouter la navigation entre les sections
- [x] Rendre le site responsive

## Phase 3: Interface admin
- [x] Créer la page admin avec interface personnalisée
- [x] Implémenter l'upload de vidéos vers S3
- [x] Créer le formulaire d'ajout/édition de vidéos
- [x] Créer la liste des vidéos avec actions (éditer/supprimer)
- [ ] Créer le formulaire d'ajout/édition de projets (futur)
- [ ] Créer la liste des projets avec actions (futur)
- [ ] Implémenter la gestion des services (futur)

## Phase 4: Tests et déploiement
- [x] Tester l'upload et l'affichage des vidéos
- [x] Tester la navigation et le responsive
- [x] Tester l'interface admin
- [x] Créer un checkpoint
- [x] Préparer les instructions pour l'utilisateur

## Modifications demandées
- [x] Changer le nom du site de "Portfolio Vidéo Générative" à "Jenia"
- [x] Créer une page Services dédiée avec détails des formules
- [x] Ajouter la navigation vers la page Services
- [x] Simplifier le site pour avoir une seule page comme kryogen.ai
- [x] Mettre les vidéos uploadées en arrière-plan plein écran
- [x] Supprimer les sections complexes et garder un design minimaliste
- [x] Supprimer la page Services séparée
- [x] Créer un nouveau repository GitHub pour le projet Jenia
- [x] Optimiser le chargement des vidéos (preload, buffering)
- [x] Ajouter le lien LinkedIn vers https://www.linkedin.com/in/charleshenrimarrauddesgrottes/
- [x] Ajouter le lien contact email vers studio.jenia@gmail.com
- [x] Implémenter le preloading de la vidéo suivante
- [x] Ajouter un loader élégant pendant le chargement initial
- [x] Optimiser la transition entre vidéos avec crossfade
- [ ] Ajouter des métadonnées de cache pour S3
- [x] Corriger l'erreur tRPC sur la page admin (HTML au lieu de JSON)

## Migration Supabase
- [x] Migrer package.json (mysql2 -> postgres)
- [x] Migrer drizzle.config.ts (mysql -> postgresql)
- [x] Migrer drizzle/schema.ts (mysql-core -> pg-core)
- [x] Migrer server/db.ts (mysql2 -> postgres-js)
- [x] Augmenter la limite d'upload à 2Go
- [x] Nettoyer les anciennes migrations MySQL
- [x] Tester pnpm db:push avec PostgreSQL (tables créées via MCP Supabase)
- [ ] Tester l'upload de vidéos volumineuses
- [x] Configurer DATABASE_URL avec l'URL PostgreSQL Supabase fournie
- [x] Tester la connexion à Supabase PostgreSQL
- [x] Installer @supabase/supabase-js
- [x] Remplacer Drizzle ORM par Supabase JS Client dans server/db.ts
- [x] Tester les opérations CRUD avec Supabase
- [x] Corriger le nom du bucket Supabase (videos au lieu de jenia-videos)
