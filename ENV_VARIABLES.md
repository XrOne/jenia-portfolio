# Variables d'Environnement pour Railway

Ce fichier liste toutes les variables d'environnement nécessaires pour déployer votre site Jenia sur Railway.

## Variables Obligatoires

Ces variables DOIVENT être configurées pour que le site fonctionne correctement.

### Supabase Backend

```
SUPABASE_URL=https://dmqffcyiclqxqzfkdijy.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<votre-clé-service-role>
SUPABASE_ANON_KEY=<votre-clé-anon>
DATABASE_URL=postgresql://postgres:<password>@db.dmqffcyiclqxqzfkdijy.supabase.co:5432/postgres
```

**Où trouver ces valeurs ?**
1. Connectez-vous à [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet "site internet Jenia"
3. Allez dans Settings → API
   - `SUPABASE_URL` = Project URL
   - `SUPABASE_ANON_KEY` = anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role secret key
4. Pour `DATABASE_URL` : Settings → Database → Connection string (mode "URI")

### Supabase Frontend

```
VITE_SUPABASE_URL=https://dmqffcyiclqxqzfkdijy.supabase.co
VITE_SUPABASE_ANON_KEY=<votre-clé-anon>
```

**Note** : Ces variables sont identiques à celles du backend, mais avec le préfixe `VITE_` pour être accessibles côté client.

### Configuration Application

```
VITE_APP_TITLE=Jenia
VITE_APP_LOGO=/logo.svg
```

Ces variables définissent le titre et le logo de votre application.

## Variables Optionnelles

Ces variables sont nécessaires uniquement si vous voulez conserver l'authentification Manus OAuth.

### Authentification Manus (Optionnel)

```
JWT_SECRET=<votre-secret-jwt>
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
OWNER_OPEN_ID=<votre-open-id-manus>
OWNER_NAME=Charles-Henri Marraud des Grottes
```

**Si vous ne configurez pas ces variables**, l'authentification admin ne fonctionnera pas. Vous pouvez soit :
- Les configurer pour garder l'authentification Manus
- Désactiver l'authentification dans le code (modifier `server/routers.ts`)

### Analytics (Optionnel)

```
VITE_ANALYTICS_ENDPOINT=<votre-endpoint-analytics>
VITE_ANALYTICS_WEBSITE_ID=<votre-website-id>
```

Ces variables sont pour le suivi analytique. Si vous ne les configurez pas, le site fonctionnera normalement sans analytics.

## Comment configurer sur Railway

1. Allez sur [railway.app](https://railway.app) et ouvrez votre projet
2. Cliquez sur l'onglet **"Variables"**
3. Cliquez sur **"New Variable"**
4. Copiez-collez chaque variable (nom et valeur)
5. Cliquez sur **"Deploy"** pour redémarrer avec la nouvelle configuration

## Vérification

Après avoir configuré toutes les variables, vérifiez que le site fonctionne :

1. Ouvrez l'URL Railway de votre site
2. La page d'accueil devrait afficher "Jenia" avec une vidéo en arrière-plan
3. Cliquez sur "Admin" pour tester l'authentification (si configurée)
4. Essayez d'uploader une vidéo pour vérifier que Supabase fonctionne

Si quelque chose ne fonctionne pas, consultez les logs Railway pour voir quelle variable manque ou est incorrecte.
