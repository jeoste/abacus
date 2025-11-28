# Abacus Web - Application d'abaques pour flux de données

Application web Next.js pour estimer les charges des flux de données (Talend et Blueway).

## Stack Technique

- **Frontend**: Next.js 14+ (App Router) avec TypeScript
- **Base de données & Auth**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS
- **Export PDF**: pdf-lib
- **Hébergement**: Vercel

## Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role_supabase
```

### 2. Configuration Supabase

1. Créez un projet sur [Supabase](https://supabase.com)
2. Exécutez le script SQL fourni dans `supabase-schema.sql` dans l'éditeur SQL de Supabase
3. Récupérez votre URL et vos clés API depuis les paramètres du projet

### 3. Installation et lancement

```bash
# Installation des dépendances
npm install

# Lancement en mode développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Déploiement sur Vercel

1. Connectez votre dépôt GitHub à Vercel
2. Configurez les variables d'environnement dans les paramètres du projet Vercel
3. Déployez !

## Fonctionnalités

- ✅ Authentification utilisateur (Supabase Auth)
- ✅ Gestion des interfaces
- ✅ Gestion des flux de données
- ✅ Calcul automatique des estimations basé sur les paramètres
- ✅ Export CSV (format technique)
- ✅ Export PDF (format professionnel)
- ✅ Support Talend et Blueway
- ✅ Gestion des profils utilisateur (junior/confirmé/expert)

## Structure du projet

```
abacus-web/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Routes d'authentification
│   ├── (dashboard)/       # Routes protégées
│   └── api/               # API Routes
├── components/            # Composants React
├── lib/                   # Utilitaires et logique métier
│   ├── calculator/        # Logique de calcul
│   ├── supabase/          # Clients Supabase
│   └── types/             # Types TypeScript
└── supabase-schema.sql    # Schéma de base de données
```

## Notes

- Les estimations sont calculées automatiquement lors de la création/modification d'un flux
- Les utilisateurs ne peuvent voir et modifier que leurs propres données (RLS activé)
- Les exports CSV et PDF sont disponibles depuis les routes API
