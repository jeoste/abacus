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
   - À la racine du projet, créez un fichier nommé `.env.local`
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

### Je ne reçois pas les emails de confirmation ⚠️

**Causes possibles et solutions :**

1. **SMTP non configuré (cause la plus fréquente)**
   - Par défaut, Supabase n'envoie pas d'emails si aucun SMTP n'est configuré
   - **Solution** : Configurez un SMTP personnalisé (voir Étape 6.1 - Option A)
   - Allez dans **Settings** > **Authentication** > **SMTP Settings**
   - Activez **Enable Custom SMTP** et configurez un service (Gmail, SendGrid, etc.)

2. **Emails dans les spams**
   - Vérifiez votre dossier spam/courrier indésirable
   - Ajoutez l'expéditeur à vos contacts

3. **Confirmation d'email désactivée**
   - Vérifiez que **Enable email confirmations** est activé dans **Settings** > **Authentication** > **Email Auth**

4. **URL de redirection incorrecte**
   - Vérifiez que `http://localhost:3000/auth/callback` est dans **Redirect URLs**
   - Pour la production, ajoutez votre URL de production

5. **Test de l'envoi d'email**
   - Dans **Settings** > **Authentication** > **SMTP Settings**
   - Cliquez sur **Send test email** pour vérifier que la configuration fonctionne

6. **En développement : Solution temporaire**
   - Si vous testez localement, vous pouvez temporairement désactiver la confirmation (voir Étape 6.1 - Option B)
   - ⚠️ Réactivez-la avant la production !

## Sécurité

⚠️ **IMPORTANT** :
- Ne partagez JAMAIS votre `SUPABASE_SERVICE_ROLE_KEY`
- Ne commitez JAMAIS le fichier `.env.local` dans Git
- La clé `anon public` peut être visible côté client (c'est normal)
- La clé `service_role` doit rester secrète et n'être utilisée que côté serveur

## Étape 6 : Configuration de l'authentification (IMPORTANT)

### 6.1. Configuration de l'envoi d'emails

⚠️ **PROBLÈME COURANT** : Par défaut, Supabase utilise un service d'email limité qui peut ne pas envoyer d'emails. Vous devez configurer un service d'email SMTP.

#### Option A : Configuration SMTP personnalisée (RECOMMANDÉ)

1. **Aller dans les paramètres d'email**
   - Dans votre projet Supabase, allez dans **Settings** > **Authentication**
   - Cliquez sur **SMTP Settings** dans le menu de gauche

2. **Configurer un service SMTP**
   
   **Option 1 : Utiliser Gmail (pour le développement)**
   - **Enable Custom SMTP** : Activez cette option
   - **Sender email** : Votre adresse Gmail (ex: `votre-email@gmail.com`)
   - **Sender name** : Nom d'affichage (ex: "Abacus")
   - **Host** : `smtp.gmail.com`
   - **Port** : `587`
   - **Username** : Votre adresse Gmail complète
   - **Password** : ⚠️ **Utilisez un "Mot de passe d'application" Gmail** (pas votre mot de passe normal)
     - Pour créer un mot de passe d'application :
       1. Allez sur [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
       2. Sélectionnez "Mail" et "Autre (nom personnalisé)"
       3. Entrez "Supabase" comme nom
       4. Copiez le mot de passe généré (16 caractères)
       5. Utilisez ce mot de passe dans Supabase

   **Option 2 : Utiliser SendGrid (pour la production)**
   - Créez un compte sur [SendGrid](https://sendgrid.com) (plan gratuit disponible)
   - Générez une clé API dans SendGrid
   - **Host** : `smtp.sendgrid.net`
   - **Port** : `587`
   - **Username** : `apikey`
   - **Password** : Votre clé API SendGrid

   **Option 3 : Utiliser Mailgun (pour la production)**
   - Créez un compte sur [Mailgun](https://www.mailgun.com) (plan gratuit disponible)
   - **Host** : `smtp.mailgun.org`
   - **Port** : `587`
   - **Username** : Votre nom d'utilisateur Mailgun
   - **Password** : Votre mot de passe Mailgun

3. **Tester la configuration**
   - Cliquez sur **Send test email** pour vérifier que l'envoi fonctionne
   - Vérifiez votre boîte de réception (et les spams)

#### Option B : Désactiver la confirmation d'email (RECOMMANDÉ POUR LE DÉVELOPPEMENT)

⚠️ **IMPORTANT** : 
- Pour le développement local, vous pouvez désactiver la vérification d'email
- Pour la production, il est recommandé de l'activer avec un SMTP configuré

1. **Désactiver la confirmation d'email**
   - Dans votre projet Supabase, allez dans **Settings** > **Authentication**
   - Cliquez sur **Email Auth** dans le menu de gauche
   - Décochez **Enable email confirmations**
   - ⚠️ Les utilisateurs pourront se connecter immédiatement après l'inscription, sans valider leur email
   - Sauvegardez les modifications

2. **Pour la production (optionnel)**
   - Si vous souhaitez activer la vérification d'email en production :
     - Cochez **Enable email confirmations**
     - Configurez un SMTP personnalisé (voir Option A ci-dessus)

### 6.2. Activer la confirmation d'email

1. **Activer la confirmation d'email**
   - Dans votre projet Supabase, allez dans **Settings** > **Authentication**
   - Dans la section **Email Auth**, assurez-vous que :
     - ✅ **Enable email confirmations** est activé
     - ✅ **Confirm email** est coché
   - Dans **Email Templates**, vous pouvez personnaliser le message de confirmation

### 6.3. Configurer l'URL de redirection

1. **Configurer les URLs**
   - Dans **Authentication** > **URL Configuration**
   - **Site URL** : `http://localhost:3000` (pour le développement)
   - **Redirect URLs** : Ajoutez `http://localhost:3000/auth/callback`

2. **Pour la production**
   - Remplacez `http://localhost:3000` par votre URL de production
   - Exemple : `https://votre-domaine.com`
   - Ajoutez aussi `https://votre-domaine.com/auth/callback` dans **Redirect URLs**

## Prochaines étapes

Une fois Supabase configuré :
1. Créez un compte utilisateur via `/signup`
2. **Vérifiez votre email** et cliquez sur le lien de confirmation
3. Connectez-vous avec vos identifiants
4. Créez votre premier projet
5. Créez votre premier système
6. Créez votre premier flux de données
7. Testez les exports CSV et PDF

