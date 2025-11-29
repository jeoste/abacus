# Configuration Vercel - Branches main et dev

Ce guide détaille la configuration spécifique pour déployer automatiquement :
- **Branche `main`** → Production
- **Branche `dev`** → Preview

## 📋 Prérequis

- ✅ Projet sur GitHub/GitLab/Bitbucket
- ✅ Compte Vercel créé
- ✅ Projet Supabase configuré

## 🚀 Étape 1 : Créer le projet sur Vercel

### 1.1 Importer le projet

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Add New..."** > **"Project"**
3. Sélectionnez votre dépôt `abacus`
4. Cliquez sur **"Import"**

### 1.2 Configuration du projet

Dans la page de configuration, configurez :

#### **Project Name**
```
abacus
```
(ou le nom de votre choix)

#### **Root Directory**
```
(laisser vide ou "/")
```
✅ **Le projet est à la racine du dépôt** : Aucun Root Directory n'est nécessaire.

#### **Framework Preset**
```
Next.js
```
(Détecté automatiquement)

#### **Build & Development Settings**

Ces valeurs sont déjà dans `vercel.json`, mais vous pouvez les vérifier :

- **Build Command** : `npm run build`
- **Output Directory** : `.next` (par défaut)
- **Install Command** : `npm install`
- **Development Command** : `npm run dev`

#### **Node.js Version**

Vercel détectera automatiquement la version depuis `package.json` (Node.js 20+ requis).

## 🔧 Étape 2 : Configuration des branches

### 2.1 Configuration des branches de déploiement

Dans **Settings** > **Git** :

1. **Production Branch**
   - Définissez `main` comme branche de production
   - ✅ Chaque push sur `main` déclenchera un déploiement en production

2. **Preview Branches**
   - Vercel créera automatiquement des previews pour toutes les autres branches
   - ✅ La branche `dev` créera automatiquement des previews

### 2.2 Vérification

Après configuration, vous devriez voir :
- ✅ **Production** : Déploiements automatiques depuis `main`
- ✅ **Preview** : Déploiements automatiques depuis `dev` et autres branches

## 🔐 Étape 3 : Variables d'environnement

### 3.1 Accéder aux variables

Dans **Settings** > **Environment Variables**

### 3.2 Variables requises

Ajoutez ces **4 variables d'environnement** :

| Variable | Description | Environnements |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de votre projet Supabase | ✅ Production, ✅ Preview, ✅ Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase (anon) | ✅ Production, ✅ Preview, ✅ Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé secrète Supabase (service_role) | ✅ Production, ✅ Preview, ✅ Development |
| `NEXT_PUBLIC_SITE_URL` | URL de votre site (optionnel, pour les redirections) | ✅ Production, ✅ Preview, ✅ Development |

### 3.3 Comment ajouter une variable

Pour chaque variable :

1. Cliquez sur **"Add New"**
2. **Key** : Entrez le nom (ex: `NEXT_PUBLIC_SUPABASE_URL`)
3. **Value** : Collez la valeur depuis votre `.env.local`
4. **Environments** : Cochez **TOUTES** les cases :
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
└─ Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
└─ Environments: ☑ Production ☑ Preview ☑ Development

SUPABASE_SERVICE_ROLE_KEY
└─ Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
└─ Environments: ☑ Production ☑ Preview ☑ Development

NEXT_PUBLIC_SITE_URL
└─ Value: https://abacus.vercel.app (pour production)
└─ Environments: ☑ Production ☑ Preview ☑ Development
```

**Note pour `NEXT_PUBLIC_SITE_URL`** :
- **Production** : URL de production (ex: `https://abacus.vercel.app`)
- **Preview** : Vercel génère automatiquement une URL unique par déploiement
- **Development** : `http://localhost:3000`

### 3.5 Variables différentes par environnement (optionnel)

Si vous avez des projets Supabase différents pour dev/prod :

1. Créez des variables avec le même nom
2. Cochez uniquement l'environnement concerné
3. Vercel utilisera automatiquement la bonne variable

**Exemple** :
```
NEXT_PUBLIC_SUPABASE_URL (Production)
└─ Value: https://prod-project.supabase.co
└─ Environments: ☑ Production

NEXT_PUBLIC_SUPABASE_URL (Preview)
└─ Value: https://dev-project.supabase.co
└─ Environments: ☑ Preview ☑ Development
```

## 🎯 Étape 4 : Déploiement

### 4.1 Premier déploiement

1. Cliquez sur **"Deploy"** dans la page de configuration
2. Vercel va :
   - Cloner votre dépôt
   - Installer les dépendances (`npm install`)
   - Builder l'application (`npm run build`)
   - Déployer

### 4.2 Déploiements automatiques

Après configuration, les déploiements sont automatiques :

#### **Branche `main`** → Production
```bash
git checkout main
git push origin main
```
✅ Déploie automatiquement en production

#### **Branche `dev`** → Preview
```bash
git checkout dev
git push origin dev
```
✅ Crée automatiquement une preview avec une URL unique

### 4.3 URLs générées

- **Production** : `https://abacus.vercel.app` (ou votre domaine personnalisé)
- **Preview (dev)** : `https://abacus-git-dev-username.vercel.app` (URL unique par commit)

## 📊 Étape 5 : Vérification

### 5.1 Vérifier les déploiements

Dans le dashboard Vercel :
- **Production** : Affiche les déploiements depuis `main`
- **Preview** : Affiche les déploiements depuis `dev` et autres branches

### 5.2 Tester l'application

1. Ouvrez l'URL de production ou preview
2. Testez :
   - ✅ La page d'accueil s'affiche
   - ✅ La page de login fonctionne
   - ✅ Vous pouvez créer un compte
   - ✅ Les fonctionnalités principales fonctionnent

## ⚙️ Configuration avancée

### Configuration dans `vercel.json`

Le fichier `vercel.json` contient déjà la configuration de base :

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["cdg1"]
}
```

### Région de déploiement

Le projet est configuré pour déployer dans la région `cdg1` (Paris, France).

Pour changer la région, modifiez `vercel.json` :
```json
"regions": ["iad1"]  // Virginie, USA
```

Régions disponibles : [vercel.com/docs/concepts/edge-network/regions](https://vercel.com/docs/concepts/edge-network/regions)

## 🔍 Dépannage

### Erreur : "Build failed"

**Vérifiez :**
1. ✅ Les variables d'environnement sont bien configurées
2. ✅ Le Root Directory est vide ou "/" (projet à la racine)
3. ✅ Les dépendances sont installées
4. ✅ Le build fonctionne localement (`npm run build`)

**Solution :**
- Regardez les logs de build dans Vercel
- Vérifiez que `package.json` contient tous les scripts

### Erreur : "Environment variables not found"

**Solution :**
- Vérifiez que les variables sont bien ajoutées dans Vercel
- Vérifiez que les 3 environnements sont cochés (Production, Preview, Development)
- Redéployez après avoir ajouté les variables

### Les déploiements ne se déclenchent pas automatiquement

**Vérifiez :**
1. ✅ Les branches sont bien configurées dans **Settings** > **Git**
2. ✅ La branche `main` est définie comme Production Branch
3. ✅ Les webhooks GitHub sont bien configurés

**Solution :**
- Allez dans **Settings** > **Git**
- Vérifiez la configuration des branches
- Reconnectez le dépôt si nécessaire

### L'application fonctionne mais Supabase ne répond pas

**Vérifiez :**
1. ✅ Les variables d'environnement sont correctes
2. ✅ Votre projet Supabase est actif
3. ✅ Les clés API sont valides
4. ✅ Le schéma SQL a été exécuté dans Supabase

## 📝 Checklist de configuration

Avant de déployer, vérifiez :

- [ ] Code poussé sur Git (branches `main` et `dev`)
- [ ] Projet Vercel créé
- [ ] Root Directory laissé vide (projet à la racine)
- [ ] Branche `main` définie comme Production Branch
- [ ] Variables d'environnement ajoutées (4 variables)
- [ ] Toutes les variables cochées pour Production, Preview et Development
- [ ] Build fonctionne localement (`npm run build`)
- [ ] `.env.local` dans `.gitignore`

## 🎉 Résumé de la configuration

### Configuration principale dans Vercel

1. **Root Directory** : `abacus-web`
2. **Production Branch** : `main`
3. **Preview Branches** : `dev` (et autres branches)

### Variables d'environnement

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL (optionnel)
```

Toutes les variables doivent être cochées pour :
- ✅ Production
- ✅ Preview
- ✅ Development

### Comportement automatique

- **Push sur `main`** → Déploiement en production
- **Push sur `dev`** → Création d'une preview
- **Pull Request** → Création d'une preview

## 📚 Ressources

- Documentation Vercel : [vercel.com/docs](https://vercel.com/docs)
- Documentation Next.js sur Vercel : [vercel.com/docs/frameworks/nextjs](https://vercel.com/docs/frameworks/nextjs)
- Documentation Supabase : [supabase.com/docs](https://supabase.com/docs)

