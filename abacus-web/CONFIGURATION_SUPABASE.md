# Configuration Supabase - Guide Complet

## Étape 1 : Créer un projet Supabase

1. **Aller sur Supabase**
   - Ouvrez [https://supabase.com](https://supabase.com)
   - Cliquez sur "Start your project" ou "Sign in" si vous avez déjà un compte
   - Créez un compte gratuit si nécessaire

2. **Créer un nouveau projet**
   - Cliquez sur "New Project"
   - Remplissez les informations :
     - **Organization** : Sélectionnez ou créez une organisation
     - **Name** : Donnez un nom à votre projet (ex: "abacus")
     - **Database Password** : Choisissez un mot de passe fort (⚠️ **SAVEZ-LE**, vous en aurez besoin)
     - **Region** : Choisissez la région la plus proche (ex: "West Europe (Paris)")
   - Cliquez sur "Create new project"
   - ⏳ Attendez 2-3 minutes que le projet soit créé

## Étape 2 : Récupérer les clés API

1. **Accéder aux paramètres API**
   - Dans votre projet Supabase, allez dans **Settings** (icône d'engrenage en bas à gauche)
   - Cliquez sur **API** dans le menu de gauche

2. **Copier les valeurs nécessaires**
   Vous verrez plusieurs sections. Copiez ces valeurs :

   **Section "Project URL"**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   → C'est votre `NEXT_PUBLIC_SUPABASE_URL`

   **Section "Project API keys"**
   - **anon public** (clé publique, visible dans le navigateur)
     → C'est votre `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   
   - **service_role** (clé secrète, ⚠️ **NE JAMAIS EXPOSER AU CLIENT**)
     → C'est votre `SUPABASE_SERVICE_ROLE_KEY`
     - Cliquez sur "Reveal" pour la voir
     - ⚠️ Cette clé donne un accès complet à votre base de données, gardez-la secrète !

## Étape 3 : Créer le fichier .env.local

1. **Créer le fichier**
   - Dans le dossier `abacus-web/`, créez un fichier nommé `.env.local`
   - ⚠️ Le fichier doit commencer par un point (`.`)

2. **Ajouter les variables**
   Ouvrez `.env.local` et ajoutez :

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici
   SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role_ici
   ```

   **Remplacez** :
   - `https://xxxxxxxxxxxxx.supabase.co` par votre Project URL
   - `votre_cle_anon_ici` par votre clé "anon public"
   - `votre_cle_service_role_ici` par votre clé "service_role"

   **Exemple complet** :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
   ```

3. **Sauvegarder le fichier**
   - Enregistrez le fichier `.env.local`
   - ⚠️ **Important** : Ce fichier ne doit JAMAIS être commité dans Git (il est déjà dans `.gitignore`)

## Étape 4 : Exécuter le schéma SQL

1. **Ouvrir l'éditeur SQL**
   - Dans votre projet Supabase, cliquez sur **SQL Editor** dans le menu de gauche
   - Cliquez sur **New query**

2. **Copier le schéma**
   - Ouvrez le fichier `supabase-schema.sql` de ce projet
   - Copiez TOUT le contenu (Ctrl+A puis Ctrl+C)

3. **Coller et exécuter**
   - Collez le contenu dans l'éditeur SQL de Supabase
   - Cliquez sur **Run** (ou appuyez sur Ctrl+Enter)
   - ⏳ Attendez quelques secondes

4. **Vérifier que ça a fonctionné**
   - Vous devriez voir "Success. No rows returned"
   - Allez dans **Table Editor** dans le menu de gauche
   - Vous devriez voir 3 tables :
     - `profiles`
     - `interfaces`
     - `flows`

## Étape 5 : Redémarrer l'application

1. **Arrêter le serveur**
   - Dans votre terminal, appuyez sur `Ctrl+C` pour arrêter le serveur

2. **Relancer**
   ```bash
   npm run dev
   ```

3. **Tester**
   - Ouvrez [http://localhost:3000](http://localhost:3000)
   - Vous devriez être redirigé vers `/login`
   - L'erreur devrait avoir disparu !

## Vérification rapide

Pour vérifier que tout est bien configuré :

```bash
npm run check-env
```

Vous devriez voir :
- ✅ Fichier .env.local trouvé
- ✅ Variables d'environnement configurées

## Dépannage

### Erreur : "Invalid API key"
- Vérifiez que vous avez bien copié les clés complètes (elles sont très longues)
- Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs
- Vérifiez que vous n'avez pas mis de guillemets autour des valeurs

### Erreur : "relation does not exist"
- Le schéma SQL n'a pas été exécuté correctement
- Retournez dans SQL Editor et réexécutez le script

### L'application ne se recharge pas après modification de .env.local
- Redémarrez le serveur (Ctrl+C puis `npm run dev`)
- Next.js ne recharge pas automatiquement les variables d'environnement

### Je ne trouve pas les clés API
- Assurez-vous d'être dans **Settings** > **API**
- Pour la clé service_role, cliquez sur "Reveal" pour la voir
- Si vous ne la voyez toujours pas, vous pouvez la régénérer (mais cela invalidera l'ancienne)

## Sécurité

⚠️ **IMPORTANT** :
- Ne partagez JAMAIS votre `SUPABASE_SERVICE_ROLE_KEY`
- Ne commitez JAMAIS le fichier `.env.local` dans Git
- La clé `anon public` peut être visible côté client (c'est normal)
- La clé `service_role` doit rester secrète et n'être utilisée que côté serveur

## Prochaines étapes

Une fois Supabase configuré :
1. Créez un compte utilisateur via `/signup`
2. Créez votre première interface
3. Créez votre premier flux de données
4. Testez les exports CSV et PDF

