# Guide de démarrage local - Abacus Web

## Prérequis

- Node.js 18.17.0 ou supérieur (recommandé : 18.20.8+)
- Un compte Supabase (gratuit)
- npm ou yarn

> **Note** : L'application utilise Next.js 14 qui est compatible avec Node.js 18.17.0+

## Étapes de configuration

### 1. Configuration Supabase

1. **Créer un projet Supabase**
   - Allez sur [https://supabase.com](https://supabase.com)
   - Créez un compte ou connectez-vous
   - Cliquez sur "New Project"
   - Choisissez un nom, un mot de passe pour la base de données, et une région
   - Attendez que le projet soit créé (2-3 minutes)

2. **Exécuter le schéma SQL**
   - Dans votre projet Supabase, allez dans "SQL Editor"
   - Ouvrez le fichier `supabase-schema.sql` de ce projet
   - Copiez tout le contenu et collez-le dans l'éditeur SQL
   - Cliquez sur "Run" pour exécuter le script
   - Vérifiez qu'il n'y a pas d'erreurs

3. **Récupérer les clés API**
   - Dans votre projet Supabase, allez dans "Settings" > "API"
   - Copiez les valeurs suivantes :
     - **Project URL** (ex: `https://xxxxx.supabase.co`)
     - **anon public key** (clé publique)
     - **service_role key** (clé secrète - à garder confidentielle)

### 2. Configuration des variables d'environnement

1. **Créer le fichier `.env.local`**
   - À la racine du projet `abacus-web/`
   - Créez un fichier nommé `.env.local`

2. **Ajouter les variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici
   SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role_ici
   ```

   ⚠️ **Important** : Remplacez les valeurs par celles de votre projet Supabase

### 3. Installation des dépendances

Si ce n'est pas déjà fait :

```bash
cd abacus-web
npm install
```

### 4. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:3000**

### 5. Tester l'application

1. **Créer un compte**
   - Allez sur http://localhost:3000
   - Vous serez redirigé vers `/login`
   - Cliquez sur "S'inscrire" pour créer un compte
   - Remplissez le formulaire (email, mot de passe, nom complet)

2. **Créer une interface** (optionnel)
   - Cliquez sur "Interfaces" dans le menu
   - Cliquez sur "+ Nouvelle interface"
   - Remplissez le formulaire

3. **Créer un flux**
   - Cliquez sur "Flux" dans le menu
   - Cliquez sur "+ Nouveau flux"
   - Remplissez tous les champs du formulaire
   - L'estimation sera calculée automatiquement à la sauvegarde

4. **Tester les exports**
   - Sur la page des flux, cliquez sur "Export CSV" pour télécharger tous les flux
   - Cliquez sur "PDF" à côté d'un flux pour télécharger son rapport PDF

## Dépannage

### Erreur : "Non autorisé" ou problèmes d'authentification
- Vérifiez que les variables d'environnement sont correctes
- Vérifiez que le schéma SQL a bien été exécuté dans Supabase
- Vérifiez que RLS (Row Level Security) est activé dans Supabase

### Erreur : "Module not found"
- Exécutez `npm install` pour installer toutes les dépendances

### Erreur : Port 3000 déjà utilisé
- Changez le port : `npm run dev -- -p 3001`

### Problème avec Node.js version
Si vous avez une version de Node.js inférieure à 18.17.0 :
- Utilisez [nvm](https://github.com/nvm-sh/nvm) pour gérer plusieurs versions de Node.js
- Ou mettez à jour Node.js depuis [nodejs.org](https://nodejs.org/)
- Node.js 18.20.8+ est recommandé pour de meilleures performances

## Vérification de la configuration

Pour vérifier que tout est bien configuré, vous pouvez :

1. Vérifier les variables d'environnement :
   ```bash
   # Dans PowerShell
   Get-Content .env.local
   ```

2. Vérifier la connexion à Supabase :
   - Ouvrez la console du navigateur (F12)
   - Allez sur la page de login
   - Vérifiez qu'il n'y a pas d'erreurs dans la console

3. Vérifier les tables dans Supabase :
   - Dans Supabase, allez dans "Table Editor"
   - Vous devriez voir les tables : `profiles`, `interfaces`, `flows`

## Commandes utiles

```bash
# Lancer en mode développement
npm run dev

# Build pour la production
npm run build

# Lancer la version de production
npm start

# Vérifier les erreurs de linting
npm run lint
```

