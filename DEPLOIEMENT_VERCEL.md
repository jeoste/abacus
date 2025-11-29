# Déploiement sur Vercel - Guide Complet

## Vue d'ensemble

Ce guide vous explique comment déployer l'application Abacus sur Vercel.

## Prérequis

- Un compte Vercel (gratuit) : [vercel.com](https://vercel.com)
- Un compte Supabase configuré (voir `CONFIGURATION_SUPABASE.md`)
- Votre projet sur GitHub, GitLab ou Bitbucket

## Étape 1 : Préparer le projet

### 1.1 Vérifier les fichiers nécessaires

Assurez-vous que ces fichiers existent :
- ✅ `package.json` (avec les scripts de build)
- ✅ `next.config.js`
- ✅ `.gitignore` (pour exclure `.env.local`)

### 1.2 Pousser le code sur Git

```bash
git add .
git commit -m "Préparation pour déploiement Vercel"
git push origin dev  # ou votre branche principale
```

## Étape 2 : Créer un projet sur Vercel

1. **Connecter votre compte**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec GitHub/GitLab/Bitbucket
   - Autorisez Vercel à accéder à vos dépôts

2. **Importer le projet**
   - Cliquez sur **"Add New..."** > **"Project"**
   - Sélectionnez votre dépôt `abacus`
   - Vercel détectera automatiquement Next.js

3. **Configurer le projet**
   - **Project Name** : `abacus` (ou le nom de votre choix)
   - **Root Directory** : *(laisser vide - projet à la racine)* ✅
   - **Framework Preset** : Next.js (détecté automatiquement)
   - **Build Command** : `npm run build` (par défaut)
   - **Output Directory** : `.next` (par défaut)
   - **Install Command** : `npm install` (par défaut)

## Étape 3 : Configurer les variables d'environnement

⚠️ **CRITIQUE** : Ces variables doivent être configurées avant le premier déploiement.

### 3.1 Accéder aux variables d'environnement

Dans la page de configuration du projet Vercel :
1. Allez dans **Settings**
2. Cliquez sur **Environment Variables** dans le menu de gauche

### 3.2 Ajouter les variables

Ajoutez ces **3 variables d'environnement** :

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://votre-projet.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Votre clé anon public | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Votre clé service_role | Production, Preview, Development |

### 3.3 Comment ajouter une variable

1. Cliquez sur **"Add New"**
2. **Key** : Entrez le nom de la variable (ex: `NEXT_PUBLIC_SUPABASE_URL`)
3. **Value** : Collez la valeur depuis votre `.env.local`
4. **Environments** : Cochez les 3 cases :
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Cliquez sur **"Save"**

### 3.4 Exemple de configuration

```
NEXT_PUBLIC_SUPABASE_URL
└─ Value: https://abcdefghijklmnop.supabase.co
└─ Environments: ☑ Production ☑ Preview ☑ Development

NEXT_PUBLIC_SUPABASE_ANON_KEY
└─ Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
└─ Environments: ☑ Production ☑ Preview ☑ Development

SUPABASE_SERVICE_ROLE_KEY
└─ Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
└─ Environments: ☑ Production ☑ Preview ☑ Development
```

## Étape 4 : Configuration avancée (optionnel)

### 4.1 Configuration du build

Dans **Settings** > **General** > **Build & Development Settings** :

Le projet étant à la racine du dépôt, utilisez les valeurs par défaut :

- **Root Directory** : *(laisser vide)*
- **Build Command** : `npm run build` (par défaut)
- **Output Directory** : `.next` (par défaut)
- **Install Command** : `npm install` (par défaut)

### 4.2 Variables d'environnement par environnement

Si vous avez des projets Supabase différents pour dev/prod :

1. Créez des variables avec le même nom
2. Cochez uniquement l'environnement concerné
3. Vercel utilisera automatiquement la bonne variable selon l'environnement

## Étape 5 : Déployer

1. **Déployer maintenant**
   - Cliquez sur **"Deploy"** dans la page de configuration
   - Vercel va :
     - Cloner votre dépôt
     - Installer les dépendances
     - Builder l'application
     - Déployer

2. **Suivre le déploiement**
   - Vous verrez les logs en temps réel
   - Le déploiement prend généralement 2-5 minutes

3. **Vérifier le déploiement**
   - Si tout va bien, vous verrez "Ready"
   - Cliquez sur le lien pour ouvrir votre application

## Étape 6 : Configuration post-déploiement

### 6.1 Vérifier que tout fonctionne

1. Ouvrez l'URL de votre application (ex: `https://abacus.vercel.app`)
2. Testez :
   - ✅ La page de login s'affiche
   - ✅ Vous pouvez créer un compte
   - ✅ Vous pouvez créer des flux
   - ✅ Les calculs fonctionnent

### 6.2 Configurer le domaine personnalisé (optionnel)

1. Dans **Settings** > **Domains**
2. Ajoutez votre domaine
3. Suivez les instructions DNS

### 6.3 Activer les déploiements automatiques

Par défaut, Vercel déploie automatiquement :
- ✅ Chaque push sur la branche principale → Production
- ✅ Chaque pull request → Preview

Pour modifier cela : **Settings** > **Git**

## Configuration Vercel - Résumé

### Variables d'environnement à configurer

```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role
```

### Paramètres de build recommandés

Le projet étant à la racine du dépôt :

- **Root Directory** : *(laisser vide)*
- **Build Command** : `npm run build` (par défaut)
- **Output Directory** : `.next` (par défaut)
- **Install Command** : `npm install` (par défaut)

### Node.js Version

Vercel utilise automatiquement Node.js 18.x ou 20.x selon votre configuration.
Notre projet fonctionne avec Node.js 18.17.0+, donc pas de problème.

## Dépannage

### Erreur : "Build failed"

**Vérifiez :**
1. Les variables d'environnement sont bien configurées
2. Le Root Directory est vide (projet à la racine)
3. Les dépendances sont installées (`npm install` fonctionne)

**Solution :**
- Regardez les logs de build dans Vercel
- Vérifiez que `package.json` contient bien tous les scripts

### Erreur : "Environment variables not found"

**Solution :**
- Vérifiez que les variables sont bien ajoutées dans Vercel
- Vérifiez que les 3 environnements sont cochés (Production, Preview, Development)
- Redéployez après avoir ajouté les variables

### Erreur : "Module not found"

**Solution :**
- Vérifiez que `node_modules` n'est pas dans `.gitignore` (il ne doit pas l'être)
- Vérifiez que toutes les dépendances sont dans `package.json`
- Vercel installera automatiquement les dépendances

### L'application fonctionne mais Supabase ne répond pas

**Vérifiez :**
1. Les variables d'environnement sont correctes
2. Votre projet Supabase est actif
3. Les clés API sont valides
4. Le schéma SQL a été exécuté dans Supabase

## Commandes utiles

### Déployer depuis la ligne de commande

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer (depuis la racine du projet)
vercel

# Déployer en production
vercel --prod
```

### Vérifier la configuration locale

```bash
# Depuis la racine du projet
npm run build
```

Si le build fonctionne localement, il fonctionnera sur Vercel.

## Sécurité

⚠️ **IMPORTANT** :
- Ne commitez JAMAIS le fichier `.env.local` dans Git
- Les variables d'environnement dans Vercel sont chiffrées
- La clé `SUPABASE_SERVICE_ROLE_KEY` ne sera jamais exposée au client (Next.js la garde côté serveur)
- Utilisez des clés différentes pour dev/prod si possible

## Checklist de déploiement

Avant de déployer, vérifiez :

- [ ] Code poussé sur Git
- [ ] Projet Supabase créé et configuré
- [ ] Schéma SQL exécuté dans Supabase
- [ ] Variables d'environnement ajoutées dans Vercel
- [ ] Root Directory laissé vide (projet à la racine)
- [ ] Build fonctionne localement (`npm run build`)
- [ ] `.env.local` dans `.gitignore`

## Support

- Documentation Vercel : [vercel.com/docs](https://vercel.com/docs)
- Documentation Supabase : [supabase.com/docs](https://supabase.com/docs)
- Support Vercel : [vercel.com/support](https://vercel.com/support)

