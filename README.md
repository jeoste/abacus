# Abacus - Application d'abaques pour flux de données

Application web pour estimer les charges des flux de données (Talend et Blueway).

## Structure du projet

```
abacus/
├── abacus-web/          # Application web Next.js
└── plan.md              # Plan de développement
```

## Démarrage rapide

### Depuis la racine du projet

```bash
# Lancer l'application en développement
npm run dev

# Vérifier la configuration
npm run check-env

# Build pour production
npm run build
```

### Depuis le dossier abacus-web

```bash
cd abacus-web
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Documentation

Pour plus de détails, consultez :
- [abacus-web/README.md](abacus-web/README.md) - Documentation complète
- [abacus-web/SETUP_LOCAL.md](abacus-web/SETUP_LOCAL.md) - Guide de configuration locale
- [abacus-web/QUICK_START.md](abacus-web/QUICK_START.md) - Démarrage rapide

## Configuration requise

- Node.js 18.17.0+ (recommandé : 18.20.8+)
- Un compte Supabase (gratuit)
- Variables d'environnement configurées (voir SETUP_LOCAL.md)

