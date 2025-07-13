# Plan de Développement Consolidé : Abaque Desktop v3.0

## Vue d'ensemble du projet

### Objectif
Créer un outil de chiffrage professionnel sous forme d'**application de bureau** pour automatiser l'estimation de complexité et de charge des flux de données (Qlik Talend et extensions futures).

### Philosophie du plan v3.0
Ce plan combine :
- **La robustesse architecturale** du plan 1 (structure modulaire, extensibilité)
- **La simplicité pragmatique** du plan 2 (implémentation directe, facilité de maintenance)
- **Une approche desktop-first** optimisée pour les contraintes et avantages d'une application native

---

## 1. Stack Technique Recommandée

### Architecture Frontend
**Electron + React + TypeScript**

**Justification :**
- **Electron** : Standard de facto pour les applications desktop multiplateformes
- **React** : Écosystème mature, excellent pour les interfaces complexes
- **TypeScript** : Sécurité de type, maintenabilité, excellent tooling

**Technologies complémentaires :**
- **UI Framework** : Tailwind CSS + shadcn/ui
- **Gestion d'état** : Zustand (léger et simple)
- **Formulaires** : React Hook Form + Zod
- **Graphiques** : Recharts
- **Notifications** : React Toast
- **Tables** : TanStack Table
- **Icônes** : Lucide React

### Architecture Backend (Main Process)
**Node.js + TypeScript intégré**

**Justification :**
- Cohérence technologique avec le frontend
- Accès direct aux API système
- Facilité d'intégration avec Electron
- Pas besoin de serveur externe

**Services principaux :**
- **Calcul de scoring** : Algorithmes de complexité en TypeScript
- **Gestion des données** : SQLite + Prisma ORM
- **Export/Import** : Génération PDF, Excel
- **Configuration** : Paramètres utilisateur et app

### Base de Données
**SQLite + Prisma**

**Avantages :**
- Fichier unique, portable
- Pas de configuration serveur
- Excellent support TypeScript avec Prisma
- Performances optimales pour applications desktop
- Sauvegarde facile (simple copie de fichier)

---

## 2. Architecture Logicielle

### Structure modulaire simplifiée

```
abacus-desktop/
├── src/
│   ├── main/                    # Processus principal Electron
│   │   ├── main.ts             # Point d'entrée
│   │   ├── services/           # Logique métier
│   │   │   ├── scoring.ts      # Algorithmes de calcul
│   │   │   ├── database.ts     # Couche données
│   │   │   ├── export.ts       # Export PDF/Excel
│   │   │   └── config.ts       # Configuration
│   │   └── ipc/                # Communication IPC
│   ├── renderer/               # Interface utilisateur
│   │   ├── components/         # Composants réutilisables
│   │   │   ├── ui/            # Composants UI de base
│   │   │   ├── forms/         # Formulaires spécialisés
│   │   │   └── charts/        # Graphiques
│   │   ├── pages/             # Pages principales
│   │   ├── hooks/             # Hooks personnalisés
│   │   ├── stores/            # Gestion d'état Zustand
│   │   └── utils/             # Utilitaires
│   ├── shared/                 # Types et constantes partagées
│   └── preload/               # Scripts de préchargement
├── prisma/                     # Schéma base de données
├── assets/                     # Ressources (icônes, etc.)
├── build/                      # Configuration build
└── docs/                       # Documentation
```

### Modules fonctionnels

1. **Module Core** : Logique de scoring et calcul
2. **Module Data** : Gestion SQLite et persistance
3. **Module Export** : Génération de rapports
4. **Module Config** : Paramètres et préférences
5. **Module History** : Historique et templates
6. **Module UI** : Interface et composants

---

## 3. Fonctionnalités Clés

### Phase 1 : Fondations (3 semaines)
**Objectif :** Application fonctionnelle de base

- [ ] Configuration environnement Electron + React + TypeScript
- [ ] Installation et configuration Tailwind CSS + shadcn/ui
- [ ] Installation des composants de référence (sidebar-03, dashboard-01)
- [ ] Architecture main/renderer avec IPC
- [ ] Base de données SQLite + Prisma
- [ ] Implémentation du layout principal avec AppSidebar (sidebar-03)
- [ ] Navigation de base entre les pages
- [ ] Interface utilisateur de base avec composants shadcn/ui
- [ ] Formulaire de saisie paramètres
- [ ] Algorithme de scoring initial (Qlik Talend)
- [ ] Affichage des résultats avec tableau d'abaque

### Phase 2 : Fonctionnalités Cœur (4 semaines)
**Objectif :** Outil pleinement utilisable

- [ ] Implémentation du dashboard principal (dashboard-01)
- [ ] Cartes de métriques avec EstimationCard
- [ ] Graphiques de répartition avec EstimationChart
- [ ] Sauvegarde et chargement des chiffrages
- [ ] Historique des estimations
- [ ] Templates de projets
- [ ] Export PDF basique
- [ ] Validation des données
- [ ] Gestion des erreurs
- [ ] Interface utilisateur soignée avec design cohérent
- [ ] Gestion des profils utilisateur (junior/intermédiaire/senior)
- [ ] Système de règles métiers de base
- [ ] Composants obligatoires/optionnels

### Phase 3 : Fonctionnalités Avancées (3 semaines)
**Objectif :** Outil professionnel complet

- [ ] Dashboard et analytics avancés avec tableaux de bord personnalisés
- [ ] Perfectionnement de la sidebar avec recherche et favoris
- [ ] Export Excel détaillé
- [ ] Comparaison de chiffrages
- [ ] Recherche et filtrage avancés dans la sidebar
- [ ] Graphiques et visualisations enrichies
- [ ] Configuration avancée des règles métiers
- [ ] Validation et test des règles métiers
- [ ] Système de recommandations intelligent
- [ ] Analyse de confiance et risques
- [ ] Import/export des configurations
- [ ] Sauvegarde/restauration complète

### Phase 4 : Finition et Déploiement (2 semaines)
**Objectif :** Application prête pour distribution

- [ ] Tests complets (unitaires + e2e)
- [ ] Optimisation performances
- [ ] Packaging multi-plateforme
- [ ] Auto-updater
- [ ] Documentation utilisateur
- [ ] Guide d'installation

---

## 4. Spécificités Desktop

### Avantages exploités
- **Sécurité** : Données locales, pas de transmission réseau
- **Performance** : Accès direct aux ressources système
- **Offline** : Fonctionnement sans connexion
- **Intégration OS** : Menus natifs, raccourcis, notifications
- **Stockage** : Pas de limites de stockage local

### Fonctionnalités desktop natives
- **Drag & Drop** : Import de fichiers de configuration
- **Menus contextuels** : Actions rapides
- **Raccourcis clavier** : Productivité
- **Notifications système** : Alertes et confirmations
- **Intégration fichiers** : Sauvegarde automatique

---

## 5. Modèle de Données

### Schéma SQLite (Prisma)

```typescript
// Projet principal
model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  estimations Estimation[]
}

// Estimation de flux
model Estimation {
  id          String   @id @default(cuid())
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id])
  
  // Profil utilisateur
  userProfileId String?
  userProfile   UserProfile? @relation(fields: [userProfileId], references: [id])
  
  // Paramètres du flux
  platform    String   // "qlik_talend", "future_platform"
  complexity  String   // "simple", "moyen", "complexe"
  parameters  Json     // Paramètres spécifiques
  
  // Règles métiers appliquées
  appliedRules Json    // IDs des règles appliquées et leurs impacts
  
  // Composants sélectionnés
  components  Json     // Composants techniques choisis
  
  // Résultats
  score       Float
  estimatedDays Float
  baseEstimation Float // estimation sans facteur utilisateur
  userMultiplier Float // facteur appliqué selon le profil
  confidence  Float
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Templates réutilisables
model Template {
  id        String   @id @default(cuid())
  name      String
  platform  String
  parameters Json
  createdAt DateTime @default(now())
}

// Configuration utilisateur
model Config {
  id    String @id @default(cuid())
  key   String @unique
  value Json
}

// Profil utilisateur
model UserProfile {
  id              String   @id @default(cuid())
  name            String
  level           String   // 'junior', 'intermediaire', 'senior'
  experience      Int      // années d'expérience
  specializations String[] // spécialisations techniques
  certifications  String[] // certifications obtenues
  multiplier      Float    // facteur d'ajustement
  preferences     Json     // préférences utilisateur
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  estimations     Estimation[]
}

// Règles métiers (lecture seule, définies dans le code)
model BusinessRule {
  id          String   @id @default(cuid())
  name        String
  category    String   // 'transcodification', 'architecture', 'monitoring'
  description String?
  mandatory   Boolean  // obligatoire ou optionnel
  isActive    Boolean  @default(true)
  
  // Note: Les coefficients et impacts sont définis dans le code source
  // et ne sont pas stockés en base de données
}

// Composants techniques (lecture seule, définis dans le code)
model Component {
  id          String   @id @default(cuid())
  name        String
  type        String   // 'messageQueue', 'errorHandling', 'logging', 'monitoring'
  level       String   // 'basic', 'advanced', 'expert'
  mandatory   Boolean  @default(false)
  description String?
  isActive    Boolean  @default(true)
  
  // Note: Les impacts sur complexité/jours sont définis dans le code source
  // et ne sont pas stockés en base de données
}
```

---

## 6. Profils Utilisateurs et Personnalisation

### Profils d'expertise

#### Niveaux de compétence
- **Junior** (0-2 ans d'expérience)
  - Multiplicateur de complexité : x1.5
  - Temps de développement majoré de 50%
  - Assistance et formation requises
  - Supervision renforcée

- **Intermédiaire** (2-5 ans d'expérience)
  - Multiplicateur de complexité : x1.0 (référence)
  - Temps de développement standard
  - Autonomie sur tâches courantes
  - Supervision ponctuelle

- **Senior** (5+ ans d'expérience)
  - Multiplicateur de complexité : x0.8
  - Temps de développement optimisé
  - Autonomie complète
  - Capacité d'optimisation et mentorat

#### Configuration du profil utilisateur
```typescript
interface UserProfile {
  id: string;
  name: string;
  level: 'junior' | 'intermediaire' | 'senior';
  experience: number; // années
  specializations: string[]; // ex: ['qlik', 'talend', 'kafka']
  certifications: string[];
  multiplier: number; // facteur d'ajustement
  preferences: {
    defaultComplexity: string;
    riskTolerance: 'low' | 'medium' | 'high';
    detailLevel: 'basic' | 'advanced' | 'expert';
  };
}
```

### Règles métiers configurables

#### Règles de transcodification
- **Faible complexité** : Maximum 2 transcodifications
- **Moyenne complexité** : Maximum 5 transcodifications
- **Élevée complexité** : Maximum 10 transcodifications
- **Très élevée complexité** : Plus de 10 transcodifications

#### Règles d'architecture
- **Architecture pivot obligatoire** si :
  - Plus de 3 sources différentes
  - Transformations complexes avec jointures
  - Besoins de cache intermédiaire
- **Message queues obligatoires** si :
  - Flux temps réel
  - Volume > 1GB/heure
  - Besoins de résilibrage de charge

#### Règles de gestion des erreurs
- **Logs basiques** : Erreurs système uniquement
- **Logs avancés** : Erreurs + warnings + métriques
- **Logs experts** : Debugging complet + traces détaillées

#### Règles de monitoring
- **Standard** : Métriques de base (débit, erreurs)
- **Avancé** : Métriques détaillées + alertes
- **Expert** : Monitoring complet + prédictif

### Composants obligatoires/optionnels

#### Matrice de décision
```typescript
interface ComponentRules {
  messageQueues: {
    mandatory: boolean;
    condition: (params: FluxParams) => boolean;
    impact: {
      complexity: number;
      days: number;
    };
  };
  errorHandling: {
    level: 'basic' | 'advanced' | 'expert';
    mandatory: boolean;
    impact: {
      complexity: number;
      days: number;
    };
  };
  logging: {
    level: 'basic' | 'advanced' | 'expert';
    mandatory: boolean;
    impact: {
      complexity: number;
      days: number;
    };
  };
  monitoring: {
    level: 'standard' | 'advanced' | 'expert';
    mandatory: boolean;
    impact: {
      complexity: number;
      days: number;
    };
  };
}
```

#### Règles de validation
- **Cohérence technique** : Vérification des prérequis
- **Cohérence métier** : Validation des règles de gestion
- **Cohérence budgétaire** : Respect des contraintes coût/temps

---

## 7. Système de Calcul de Poids (Coefficients)

### Principe de base

Le système de calcul de poids permet d'ajuster automatiquement l'estimation en jours selon le profil d'expérience de l'utilisateur. Chaque paramètre a ses propres coefficients selon le niveau de compétence.

**⚠️ IMPORTANT :** Les coefficients sont **intégrés dans le code source** et ne sont **pas modifiables** par l'utilisateur final via l'interface de l'application. Toute modification nécessite une mise à jour du code et une nouvelle version de l'application.

### Coefficients par profil utilisateur

#### Structure générale des coefficients
```typescript
interface ProfileCoefficients {
  junior: number;      // 0-2 ans d'expérience
  intermediaire: number; // 2-5 ans d'expérience  
  senior: number;      // 5+ ans d'expérience
}
```

#### Coefficients par paramètre technique

**Règles métiers**
```typescript
const businessRulesCoefficients: ProfileCoefficients = {
  junior: 1.0,        // Coefficient de base
  intermediaire: 0.75, // 25% plus efficace
  senior: 0.5         // 50% plus efficace
};
```

**Nombre de sources**
```typescript
const sourcesCoefficients: ProfileCoefficients = {
  junior: 1.2,        // 20% plus de temps (complexité de gestion)
  intermediaire: 1.0,  // Coefficient de référence
  senior: 0.8         // 20% plus efficace
};
```

**Nombre de cibles**
```typescript
const targetsCoefficients: ProfileCoefficients = {
  junior: 1.15,       // 15% plus de temps
  intermediaire: 1.0,  // Coefficient de référence
  senior: 0.85        // 15% plus efficace
};
```

**Transformations de données**
```typescript
const transformationsCoefficients: ProfileCoefficients = {
  junior: 1.5,        // 50% plus de temps (logique complexe)
  intermediaire: 1.0,  // Coefficient de référence
  senior: 0.7         // 30% plus efficace
};
```

**Connecteurs personnalisés**
```typescript
const connectorsCoefficients: ProfileCoefficients = {
  junior: 1.8,        // 80% plus de temps (documentation, debug)
  intermediaire: 1.2,  // 20% plus de temps
  senior: 0.9         // 10% plus efficace
};
```

**Gestion d'erreurs**
```typescript
const errorHandlingCoefficients: ProfileCoefficients = {
  junior: 1.6,        // 60% plus de temps (apprentissage patterns)
  intermediaire: 1.1,  // 10% plus de temps
  senior: 0.8         // 20% plus efficace
};
```

**Architecture et intégration**
```typescript
const architectureCoefficients: ProfileCoefficients = {
  junior: 2.0,        // 100% plus de temps (conception)
  intermediaire: 1.3,  // 30% plus de temps
  senior: 0.75        // 25% plus efficace
};
```

### Formule de calcul

#### Calcul individuel par paramètre
```typescript
function calculateWeightedDays(
  baseValue: number,
  userLevel: 'junior' | 'intermediaire' | 'senior',
  coefficients: ProfileCoefficients
): number {
  const coefficient = coefficients[userLevel];
  return baseValue * coefficient;
}
```

#### Exemple concret : Règles métiers
```typescript
// Exemple : 2 règles métiers à implémenter
const businessRules = 2;
const baseDaysPerRule = 1; // 1 jour par règle en base

// Calcul selon le profil
const juniorDays = calculateWeightedDays(
  businessRules * baseDaysPerRule, 
  'junior', 
  businessRulesCoefficients
);
// Résultat : 2 * 1 * 1.0 = 2 jours

const intermediaireDays = calculateWeightedDays(
  businessRules * baseDaysPerRule,
  'intermediaire',
  businessRulesCoefficients
);
// Résultat : 2 * 1 * 0.75 = 1.5 jours

const seniorDays = calculateWeightedDays(
  businessRules * baseDaysPerRule,
  'senior',
  businessRulesCoefficients
);
// Résultat : 2 * 1 * 0.5 = 1 jour
```

### Matrice complète des coefficients

#### Table de référence
```typescript
const PROFILE_COEFFICIENTS = {
  businessRules: {
    junior: 1.0,
    intermediaire: 0.75,
    senior: 0.5
  },
  sources: {
    junior: 1.2,
    intermediaire: 1.0,
    senior: 0.8
  },
  targets: {
    junior: 1.15,
    intermediaire: 1.0,
    senior: 0.85
  },
  transformations: {
    junior: 1.5,
    intermediaire: 1.0,
    senior: 0.7
  },
  connectors: {
    junior: 1.8,
    intermediaire: 1.2,
    senior: 0.9
  },
  errorHandling: {
    junior: 1.6,
    intermediaire: 1.1,
    senior: 0.8
  },
  architecture: {
    junior: 2.0,
    intermediaire: 1.3,
    senior: 0.75
  },
  dataQuality: {
    junior: 1.4,
    intermediaire: 1.1,
    senior: 0.85
  },
  testing: {
    junior: 1.7,
    intermediaire: 1.2,
    senior: 0.9
  },
  documentation: {
    junior: 1.3,
    intermediaire: 1.0,
    senior: 0.8
  }
};
```

### Calcul global d'estimation

#### Fonction de calcul complète
```typescript
interface EstimationParams {
  businessRules: number;
  sources: number;
  targets: number;
  transformations: number;
  connectorsComplexity: 'standard' | 'custom' | 'specific';
  errorHandlingLevel: 'basic' | 'advanced' | 'expert';
  architectureComplexity: 'simple' | 'medium' | 'complex';
  dataQuality: 'good' | 'medium' | 'poor';
  userProfile: UserProfile;
}

function calculateTotalEstimation(params: EstimationParams): EstimationResult {
  const userLevel = params.userProfile.level;
  let totalDays = 0;
  const breakdown = {};
  
  // 1. Règles métiers
  const businessRulesDays = calculateWeightedDays(
    params.businessRules * 1, // 1 jour par règle de base
    userLevel,
    PROFILE_COEFFICIENTS.businessRules
  );
  totalDays += businessRulesDays;
  breakdown.businessRules = businessRulesDays;
  
  // 2. Sources de données
  const sourcesDays = calculateWeightedDays(
    params.sources * 0.5, // 0.5 jour par source de base
    userLevel,
    PROFILE_COEFFICIENTS.sources
  );
  totalDays += sourcesDays;
  breakdown.sources = sourcesDays;
  
  // 3. Cibles de données
  const targetsDays = calculateWeightedDays(
    params.targets * 0.3, // 0.3 jour par cible de base
    userLevel,
    PROFILE_COEFFICIENTS.targets
  );
  totalDays += targetsDays;
  breakdown.targets = targetsDays;
  
  // 4. Transformations
  const transformationMapping = { simple: 1, medium: 2, complex: 4 };
  const transformationBaseDays = transformationMapping[params.transformations] || 1;
  const transformationsDays = calculateWeightedDays(
    transformationBaseDays,
    userLevel,
    PROFILE_COEFFICIENTS.transformations
  );
  totalDays += transformationsDays;
  breakdown.transformations = transformationsDays;
  
  // 5. Connecteurs
  const connectorMapping = { standard: 0.5, custom: 2, specific: 4 };
  const connectorBaseDays = connectorMapping[params.connectorsComplexity];
  const connectorsDays = calculateWeightedDays(
    connectorBaseDays,
    userLevel,
    PROFILE_COEFFICIENTS.connectors
  );
  totalDays += connectorsDays;
  breakdown.connectors = connectorsDays;
  
  // 6. Gestion d'erreurs
  const errorMapping = { basic: 1, advanced: 2, expert: 3 };
  const errorBaseDays = errorMapping[params.errorHandlingLevel];
  const errorHandlingDays = calculateWeightedDays(
    errorBaseDays,
    userLevel,
    PROFILE_COEFFICIENTS.errorHandling
  );
  totalDays += errorHandlingDays;
  breakdown.errorHandling = errorHandlingDays;
  
  // 7. Facteur d'expérience globale
  const experienceMultiplier = getExperienceMultiplier(params.userProfile);
  const finalEstimation = totalDays * experienceMultiplier;
  
  return {
    baseEstimation: totalDays,
    experienceMultiplier,
    finalEstimation: Math.round(finalEstimation * 10) / 10, // Arrondi à 1 décimale
    breakdown,
    userProfile: params.userProfile
  };
}
```

### Exemples concrets de calcul

#### Exemple 1 : Projet simple
```typescript
const simpleProject: EstimationParams = {
  businessRules: 2,
  sources: 3,
  targets: 1,
  transformations: 'simple',
  connectorsComplexity: 'standard',
  errorHandlingLevel: 'basic',
  architectureComplexity: 'simple',
  dataQuality: 'good',
  userProfile: { level: 'junior', experience: 1 }
};

// Calcul pour Junior :
// - Règles métiers: 2 * 1 * 1.0 = 2.0j
// - Sources: 3 * 0.5 * 1.2 = 1.8j
// - Cibles: 1 * 0.3 * 1.15 = 0.35j
// - Transformations: 1 * 1.5 = 1.5j
// - Connecteurs: 0.5 * 1.8 = 0.9j
// - Gestion erreurs: 1 * 1.6 = 1.6j
// Total base: 8.15j
// Avec facteur expérience (1.2): 8.15 * 1.2 = 9.8j

// Même projet pour Senior :
// - Règles métiers: 2 * 1 * 0.5 = 1.0j
// - Sources: 3 * 0.5 * 0.8 = 1.2j
// - Cibles: 1 * 0.3 * 0.85 = 0.26j
// - Transformations: 1 * 0.7 = 0.7j
// - Connecteurs: 0.5 * 0.9 = 0.45j
// - Gestion erreurs: 1 * 0.8 = 0.8j
// Total base: 4.41j
// Avec facteur expérience (0.8): 4.41 * 0.8 = 3.5j
```

#### Exemple 2 : Projet complexe
```typescript
const complexProject: EstimationParams = {
  businessRules: 8,
  sources: 7,
  targets: 4,
  transformations: 'complex',
  connectorsComplexity: 'specific',
  errorHandlingLevel: 'expert',
  architectureComplexity: 'complex',
  dataQuality: 'poor',
  userProfile: { level: 'junior', experience: 1 }
};

// Calcul pour Junior :
// - Règles métiers: 8 * 1 * 1.0 = 8.0j
// - Sources: 7 * 0.5 * 1.2 = 4.2j
// - Cibles: 4 * 0.3 * 1.15 = 1.38j
// - Transformations: 4 * 1.5 = 6.0j
// - Connecteurs: 4 * 1.8 = 7.2j
// - Gestion erreurs: 3 * 1.6 = 4.8j
// Total base: 31.58j
// Avec facteur expérience (1.2): 31.58 * 1.2 = 37.9j

// Même projet pour Senior :
// - Règles métiers: 8 * 1 * 0.5 = 4.0j
// - Sources: 7 * 0.5 * 0.8 = 2.8j
// - Cibles: 4 * 0.3 * 0.85 = 1.02j
// - Transformations: 4 * 0.7 = 2.8j
// - Connecteurs: 4 * 0.9 = 3.6j
// - Gestion erreurs: 3 * 0.8 = 2.4j
// Total base: 16.62j
// Avec facteur expérience (0.8): 16.62 * 0.8 = 13.3j
```

### Configuration des coefficients (Niveau développeur uniquement)

#### Coefficients codés en dur
Les coefficients sont définis dans le code source et **ne sont pas modifiables** via l'interface utilisateur de l'application. Toute modification nécessite une nouvelle version de l'application.

```typescript
// src/main/services/coefficients.ts
// ⚠️ IMPORTANT : Ces coefficients ne sont modifiables QUE dans le code source

export const PROFILE_COEFFICIENTS = Object.freeze({
  businessRules: Object.freeze({
    junior: 1.0,
    intermediaire: 0.75,
    senior: 0.5
  }),
  sources: Object.freeze({
    junior: 1.2,
    intermediaire: 1.0,
    senior: 0.8
  }),
  targets: Object.freeze({
    junior: 1.15,
    intermediaire: 1.0,
    senior: 0.85
  }),
  transformations: Object.freeze({
    junior: 1.5,
    intermediaire: 1.0,
    senior: 0.7
  }),
  connectors: Object.freeze({
    junior: 1.8,
    intermediaire: 1.2,
    senior: 0.9
  }),
  errorHandling: Object.freeze({
    junior: 1.6,
    intermediaire: 1.1,
    senior: 0.8
  }),
  architecture: Object.freeze({
    junior: 2.0,
    intermediaire: 1.3,
    senior: 0.75
  }),
  dataQuality: Object.freeze({
    junior: 1.4,
    intermediaire: 1.1,
    senior: 0.85
  }),
  testing: Object.freeze({
    junior: 1.7,
    intermediaire: 1.2,
    senior: 0.9
  }),
  documentation: Object.freeze({
    junior: 1.3,
    intermediaire: 1.0,
    senior: 0.8
  })
});

// Configuration des jours de base par paramètre
export const BASE_DAYS_CONFIG = Object.freeze({
  businessRulesPerRule: 1.0,        // 1 jour par règle métier
  sourcesPerSource: 0.5,            // 0.5 jour par source
  targetsPerTarget: 0.3,            // 0.3 jour par cible
  transformations: {                // Jours selon complexité
    simple: 1,
    medium: 2,
    complex: 4
  },
  connectors: {                     // Jours selon type
    standard: 0.5,
    custom: 2,
    specific: 4
  },
  errorHandling: {                  // Jours selon niveau
    basic: 1,
    advanced: 2,
    expert: 3
  },
  architecture: {                   // Jours selon complexité
    simple: 2,
    medium: 4,
    complex: 8
  }
});
```

#### Sécurisation des coefficients
```typescript
// Empêche toute modification accidentelle des coefficients
const coefficients = PROFILE_COEFFICIENTS;
// ❌ coefficients.businessRules.junior = 2.0; // Erreur TypeScript + Runtime

// Validation au démarrage de l'application
function validateCoefficientsIntegrity(): boolean {
  for (const [paramName, coeffs] of Object.entries(PROFILE_COEFFICIENTS)) {
    if (coeffs.senior > coeffs.intermediaire || 
        coeffs.intermediaire > coeffs.junior ||
        coeffs.senior <= 0 ||
        coeffs.junior > 3.0) {
      console.error(`Coefficients invalides pour ${paramName}:`, coeffs);
      return false;
    }
  }
  return true;
}

// Appel au démarrage de l'application
if (!validateCoefficientsIntegrity()) {
  throw new Error('Configuration des coefficients invalide');
}
```

#### Documentation des coefficients pour les développeurs
```typescript
/**
 * Guide de modification des coefficients
 * 
 * RÈGLES À RESPECTER :
 * 1. senior <= intermediaire <= junior
 * 2. Tous les coefficients > 0
 * 3. junior <= 3.0 (éviter les aberrations)
 * 
 * IMPACT DES MODIFICATIONS :
 * - Augmenter un coefficient = plus de temps requis
 * - Diminuer un coefficient = moins de temps requis
 * 
 * TESTING REQUIS :
 * - Tester avec des projets type après modification
 * - Vérifier la cohérence des estimations
 * - Valider avec les experts métier
 * 
 * EXEMPLES DE MODIFICATIONS :
 * 
 * Pour rendre les juniors plus efficaces sur les règles métiers :
 * businessRules: { junior: 0.9, intermediaire: 0.75, senior: 0.5 }
 * 
 * Pour augmenter le temps des connecteurs spécifiques :
 * connectors: { junior: 2.0, intermediaire: 1.4, senior: 1.0 }
 */
```

---

## 8. Algorithme de Scoring

### Approche modulaire enrichie

```typescript
// Interface pour extensibilité
interface PlatformScorer {
  platform: string;
  calculateScore(params: ScoringParams): ScoringResult;
}

// Paramètres de scoring enrichis
interface ScoringParams {
  // Paramètres techniques
  technical: {
    dataVolume: 'small' | 'medium' | 'large';
    sources: number;
    targets: number;
    transformations: 'simple' | 'medium' | 'complex';
    connectors: 'standard' | 'custom' | 'specific';
    dataQuality: 'good' | 'medium' | 'poor';
    timeConstraints: 'batch' | 'realtime' | 'mixed';
  };
  
  // Paramètres métiers
  business: {
    businessRules: number;
    dataValidation: 'basic' | 'advanced' | 'expert';
    reconciliation: boolean;
    historization: boolean;
    security: 'basic' | 'advanced' | 'expert';
  };
  
  // Profil utilisateur
  userProfile: UserProfile;
  
  // Composants sélectionnés
  components: ComponentSelection[];
  
  // Règles métiers applicables
  businessRules: BusinessRule[];
}

// Résultat de scoring enrichi
interface ScoringResult {
  baseScore: number;
  complexity: 'faible' | 'moyenne' | 'elevee' | 'tres-elevee';
  baseEstimation: number;
  userMultiplier: number;
  finalEstimation: number;
  confidence: number;
  breakdown: {
    technical: number;
    business: number;
    components: number;
    userImpact: number;
  };
  recommendations: string[];
  warnings: string[];
}

// Implémentation Qlik Talend enrichie
class QlikTalendScorer implements PlatformScorer {
  platform = "qlik_talend";
  
  calculateScore(params: ScoringParams): ScoringResult {
    // 1. Calcul du score technique de base
    const technicalScore = this.calculateTechnicalScore(params.technical);
    
    // 2. Calcul du score métier
    const businessScore = this.calculateBusinessScore(params.business);
    
    // 3. Impact des composants
    const componentsScore = this.calculateComponentsScore(params.components);
    
    // 4. Score de base total
    const baseScore = technicalScore + businessScore + componentsScore;
    
    // 5. Détermination de la complexité
    const complexity = this.getComplexityLevel(baseScore);
    
    // 6. Estimation de base en jours
    const baseEstimation = this.convertToWorkdays(baseScore, complexity);
    
    // 7. Application du facteur utilisateur
    const userMultiplier = this.getUserMultiplier(params.userProfile);
    const finalEstimation = baseEstimation * userMultiplier;
    
    // 8. Calcul de la confiance
    const confidence = this.calculateConfidence(params);
    
    // 9. Recommandations et warnings
    const recommendations = this.generateRecommendations(params, complexity);
    const warnings = this.generateWarnings(params, baseScore);
    
    return {
      baseScore,
      complexity,
      baseEstimation,
      userMultiplier,
      finalEstimation,
      confidence,
      breakdown: {
        technical: technicalScore,
        business: businessScore,
        components: componentsScore,
        userImpact: (userMultiplier - 1) * baseEstimation
      },
      recommendations,
      warnings
    };
  }
  
  private calculateTechnicalScore(technical: any): number {
    let score = 0;
    
    // Volume de données
    const volumeScores = { small: 1, medium: 3, large: 5 };
    score += volumeScores[technical.dataVolume];
    
    // Nombre de sources/cibles
    score += Math.min(technical.sources * 0.5, 5);
    score += Math.min(technical.targets * 0.3, 3);
    
    // Transformations
    const transformScores = { simple: 1, medium: 3, complex: 5 };
    score += transformScores[technical.transformations];
    
    // Connecteurs
    const connectorScores = { standard: 1, custom: 3, specific: 5 };
    score += connectorScores[technical.connectors];
    
    // Qualité des données
    const qualityScores = { good: 1, medium: 3, poor: 5 };
    score += qualityScores[technical.dataQuality];
    
    // Contraintes temporelles
    const timeScores = { batch: 1, mixed: 3, realtime: 5 };
    score += timeScores[technical.timeConstraints];
    
    return score;
  }
  
  private calculateBusinessScore(business: any): number {
    let score = 0;
    
    // Règles métiers
    score += Math.min(business.businessRules * 0.5, 5);
    
    // Validation de données
    const validationScores = { basic: 1, advanced: 3, expert: 5 };
    score += validationScores[business.dataValidation];
    
    // Réconciliation
    if (business.reconciliation) score += 2;
    
    // Historisation
    if (business.historization) score += 2;
    
    // Sécurité
    const securityScores = { basic: 1, advanced: 3, expert: 5 };
    score += securityScores[business.security];
    
    return score;
  }
  
  private calculateComponentsScore(components: ComponentSelection[]): number {
    return components.reduce((total, comp) => total + comp.complexity, 0);
  }
  
  private getUserMultiplier(userProfile: UserProfile): number {
    const levelMultipliers = {
      junior: 1.5,
      intermediaire: 1.0,
      senior: 0.8
    };
    
    let multiplier = levelMultipliers[userProfile.level];
    
    // Ajustement selon l'expérience
    if (userProfile.experience > 10) multiplier *= 0.9;
    if (userProfile.experience < 1) multiplier *= 1.2;
    
    // Ajustement selon les spécialisations
    const relevantSpecializations = userProfile.specializations.filter(
      spec => ['qlik', 'talend', 'etl'].includes(spec.toLowerCase())
    );
    
    if (relevantSpecializations.length > 0) {
      multiplier *= (1 - relevantSpecializations.length * 0.05);
    }
    
    return Math.max(0.5, Math.min(2.0, multiplier));
  }
  
  private getComplexityLevel(score: number): string {
    if (score <= 10) return 'faible';
    if (score <= 20) return 'moyenne';
    if (score <= 30) return 'elevee';
    return 'tres-elevee';
  }
  
  private convertToWorkdays(score: number, complexity: string): number {
    const baseRates = {
      faible: 0.5,
      moyenne: 1.0,
      elevee: 2.0,
      'tres-elevee': 3.0
    };
    
    return Math.max(0.5, score * baseRates[complexity]);
  }
  
  private calculateConfidence(params: ScoringParams): number {
    let confidence = 0.8; // Base confidence
    
    // Réduction si paramètres incertains
    if (params.business.businessRules > 10) confidence -= 0.1;
    if (params.technical.dataQuality === 'poor') confidence -= 0.1;
    if (params.technical.connectors === 'specific') confidence -= 0.1;
    
    // Augmentation si profil expérimenté
    if (params.userProfile.level === 'senior') confidence += 0.1;
    
    return Math.max(0.3, Math.min(0.95, confidence));
  }
  
  private generateRecommendations(params: ScoringParams, complexity: string): string[] {
    const recommendations = [];
    
    if (complexity === 'tres-elevee') {
      recommendations.push("Considérer la décomposition en sous-flux");
    }
    
    if (params.technical.sources > 5) {
      recommendations.push("Évaluer l'architecture pivot");
    }
    
    if (params.userProfile.level === 'junior' && complexity !== 'faible') {
      recommendations.push("Prévoir un accompagnement senior");
    }
    
    return recommendations;
  }
  
  private generateWarnings(params: ScoringParams, score: number): string[] {
    const warnings = [];
    
    if (score > 35) {
      warnings.push("Complexité très élevée - réviser les requis");
    }
    
    if (params.technical.dataQuality === 'poor' && params.business.businessRules > 5) {
      warnings.push("Risque élevé - qualité données et règles complexes");
    }
    
    return warnings;
  }
}
```

### Paramètres de scoring détaillés

#### Critères techniques fondamentaux
- **Volume de données** : Petit (<1GB) / Moyen (1-10GB) / Grand (>10GB)
- **Nombre de sources** : 1-5 / 5-10 / 10+
- **Nombre de cibles** : 1-3 / 3-5 / 5+
- **Transformations** : Simples/Moyennes/Complexes
- **Connecteurs** : Standards/Personnalisés/Spécifiques
- **Qualité des données** : Bonne/Moyenne/Mauvaise
- **Contraintes temporelles** : Batch/Temps réel/Mixte

#### Critères métiers spécifiques
- **Règles de gestion** : Nombre et complexité des règles métier
- **Validation de données** : Niveau de contrôle requis
- **Réconciliation** : Besoin de rapprochement de données
- **Historisation** : Gestion des versions et historiques
- **Sécurité** : Niveau de chiffrement et masquage requis

#### Paramètres configurables
- **Transcodifications** : Nombre maximum autorisé selon la complexité
- **Architecture pivot** : Obligatoire/Optionnelle selon le contexte
- **Message queues** : Obligatoire/Optionnelle selon l'architecture
- **Logs d'erreur** : Niveau de détail requis (Basic/Avancé/Expert)
- **Monitoring** : Niveau de supervision (Standard/Avancé)

---

## 7. Interface Utilisateur avec Tailwind CSS et shadcn/ui

### Stack UI détaillée

**Tailwind CSS** : Framework CSS utility-first pour un styling rapide et cohérent
- Configuration personnalisée des couleurs et thèmes
- Composants responsive par défaut
- Optimisation automatique (PurgeCSS)
- Design system cohérent

**shadcn/ui** : Collection de composants React réutilisables basés sur Radix UI
- Composants accessibles (ARIA, navigation clavier)
- Thèmes sombre/clair intégrés
- Customisation facile via CSS variables
- Qualité professionnelle

### Exemples de Design de Référence

#### Navigation - Sidebar-03
**Commande d'installation** : `npx shadcn@latest add sidebar-03`

**Caractéristiques de la sidebar-03 :**
- Sidebar collapsible avec navigation hiérarchique
- Groupes de navigation avec icônes
- Indicateurs d'état et badges
- Recherche intégrée
- Gestion des favoris
- Animation fluide d'ouverture/fermeture
- Support des raccourcis clavier

**Adaptation pour Abaque Desktop :**
```typescript
// Structure de navigation adaptée
const navigationItems = [
  {
    title: "Tableau de Bord",
    icon: LayoutDashboard,
    href: "/dashboard",
    badge: null
  },
  {
    title: "Chiffrage",
    icon: Calculator,
    href: "/estimation",
    badge: "Nouveau"
  },
  {
    title: "Projets",
    icon: FolderOpen,
    href: "/projects",
    children: [
      { title: "Mes Projets", href: "/projects/my" },
      { title: "Templates", href: "/projects/templates" },
      { title: "Historique", href: "/projects/history" }
    ]
  },
  {
    title: "Profils",
    icon: User,
    href: "/profiles",
    children: [
      { title: "Mon Profil", href: "/profiles/me" },
      { title: "Équipe", href: "/profiles/team" }
    ]
  },
  {
    title: "Configuration",
    icon: Settings,
    href: "/settings",
    children: [
      { title: "Préférences", href: "/settings/preferences" },
      { title: "Règles Métiers", href: "/settings/business-rules" },
      { title: "Composants", href: "/settings/components" }
    ]
  }
];
```

#### Dashboard - Dashboard-01
**Commande d'installation** : `npx shadcn@latest add dashboard-01`

**Caractéristiques du dashboard-01 :**
- Layout en grille responsive
- Cartes de métriques avec icônes
- Graphiques intégrés (charts)
- Tables de données récentes
- Indicateurs de performance
- Actions rapides
- Filtres et périodes de temps

**Adaptation pour l'affichage du chiffrage :**
```typescript
// Métriques principales du chiffrage
const chiffrageMetrics = [
  {
    title: "Estimation Totale",
    value: "47.5",
    unit: "jours",
    change: "+2.3%",
    trend: "up",
    icon: Clock,
    color: "chart-1"
  },
  {
    title: "Complexité",
    value: "Élevée",
    description: "Score: 23/30",
    icon: TrendingUp,
    color: "chart-2"
  },
  {
    title: "Confiance",
    value: "87%",
    change: "+5%",
    trend: "up",
    icon: Shield,
    color: "chart-3"
  },
  {
    title: "Règles Appliquées",
    value: "12",
    description: "8 obligatoires",
    icon: CheckCircle,
    color: "chart-4"
  }
];

// Graphiques de répartition
const chiffrageCharts = [
  {
    title: "Répartition par Domaine",
    type: "pie",
    data: [
      { name: "Technique", value: 60, color: "chart-1" },
      { name: "Métier", value: 30, color: "chart-2" },
      { name: "Composants", value: 10, color: "chart-3" }
    ]
  },
  {
    title: "Impact du Profil",
    type: "bar",
    data: [
      { name: "Base", value: 32, color: "chart-1" },
      { name: "Avec Profil", value: 47.5, color: "chart-2" }
    ]
  }
];
```

### Implémentation des Composants de Référence

#### Installation et Configuration
```bash
# Installation des composants de référence
npx shadcn@latest add sidebar-03
npx shadcn@latest add dashboard-01

# Composants additionnels nécessaires
npx shadcn@latest add breadcrumb
npx shadcn@latest add command
npx shadcn@latest add navigation-menu
npx shadcn@latest add popover
npx shadcn@latest add scroll-area
npx shadcn@latest add tabs
```

#### Layout Principal avec Sidebar-03
```typescript
// src/renderer/components/layout/app-layout.tsx
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <header className="border-b bg-background px-4 py-3">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Breadcrumb />
            </div>
          </header>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
```

#### Page de Chiffrage avec Dashboard-01
```typescript
// src/renderer/pages/estimation-page.tsx
import { DashboardCards } from "@/components/dashboard/dashboard-cards";
import { EstimationChart } from "@/components/dashboard/estimation-chart";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { AbaqueTable } from "@/components/abaque/abaque-table";

export function EstimationPage() {
  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <DashboardCards metrics={chiffrageMetrics} />
      
      {/* Graphiques et tableau */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EstimationChart data={chiffrageCharts} />
        <RecentProjects />
      </div>
      
      {/* Tableau d'abaque principal */}
      <AbaqueTable />
    </div>
  );
}
```

#### Composant Sidebar Personnalisé
```typescript
// src/renderer/components/layout/app-sidebar.tsx
import { Calendar, Calculator, Settings, User } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Tableau de Bord",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Nouveau Chiffrage",
    url: "/estimation/new",
    icon: Calculator,
  },
  {
    title: "Mes Projets",
    url: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Profils",
    url: "/profiles",
    icon: User,
  },
  {
    title: "Configuration",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-xl font-bold">Abaque Desktop</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-sm text-muted-foreground">
          Version 3.0.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
```

### Écrans principaux

#### 1. Dashboard - Vue d'ensemble
- **Layout** : Sidebar navigation + main content area
- **Composants shadcn/ui** :
  - `Card` : Cartes de statistiques
  - `Badge` : Indicateurs de statut
  - `Button` : Actions rapides
  - `Table` : Liste des projets récents
- **Métriques** : Nombre de chiffrages, projets actifs, estimations moyennes

#### 2. Abaque de Chiffrage - Interface principale
*Basé sur la capture d'écran fournie*

**Structure du tableau d'abaque :**
- **Header principal** : "ABAQUES TALEND" avec branding
- **Colonnes de configuration** :
  - Type de flux (Job ETL, Data Service, Route, Joblet)
  - Complexité (Faible, Moyenne, Élevée, Très élevée)
  - Définition détaillée de chaque niveau
- **Colonnes de paramètres techniques** :
  - Nombre maximum de transcodification(s)
  - Nombre maximum de source(s)
  - Nombre maximum de cible(s)
  - Architecture pivot 1/0
  - Messaging queue 1/0
- **Colonnes d'estimation** :
  - RTU flux (en jours)
  - Gestion erreurs techniques (en jours)
  - Gestion erreurs fonctionnelles (en jours)
  - Gestion des logs (en jours)
  - Total RTU sans options (en jours)
  - Total RTU avec options (en jours)

**Composants shadcn/ui utilisés :**
- `Table` : Structure principale du tableau
- `Input` : Champs de saisie des paramètres
- `Select` : Sélection de complexité
- `Badge` : Indicateurs de type (A, S, O)
- `Tooltip` : Descriptions détaillées
- `Card` : Encadrement des sections

**Codage couleur :**
- **Rouge** : Paramètres critiques/complexes
- **Jaune** : Paramètres moyens
- **Vert** : Paramètres simples
- **Bleu** : Totaux et résultats

#### 3. Formulaire de Chiffrage
- **Composants shadcn/ui** :
  - `Form` : Structure du formulaire
  - `Input` : Champs de saisie
  - `Select` : Sélections multiples
  - `Checkbox` : Options additionnelles
  - `RadioGroup` : Choix exclusifs
  - `Slider` : Ajustements fins
  - `Textarea` : Descriptions longues

#### 4. Résultats et Visualisation
- **Composants shadcn/ui** :
  - `Card` : Affichage des résultats
  - `Progress` : Barres de progression
  - `Separator` : Séparateurs visuels
  - `Alert` : Messages d'information
- **Graphiques** : Recharts intégré avec le thème Tailwind

#### 5. Historique et Templates
- **Composants shadcn/ui** :
  - `DataTable` : Liste paginée avec tri/filtrage
  - `DropdownMenu` : Actions contextuelles
  - `Dialog` : Modales de confirmation
  - `Sheet` : Panneaux coulissants

#### 6. Gestion des Profils Utilisateur
- **Écran de profil** :
  - `Form` : Formulaire de profil utilisateur
  - `Select` : Sélection niveau d'expérience
  - `Input` : Années d'expérience
  - `Badge` : Affichage des spécialisations
  - `Checkbox` : Certifications obtenues
  - `Slider` : Ajustement du facteur multiplicateur
- **Indicateurs visuels** :
  - `Progress` : Barre de progression expérience
  - `Card` : Résumé des compétences
  - `Alert` : Recommandations personnalisées

#### 7. Affichage des Règles Métiers (Lecture seule)
- **Visualisation des règles** :
  - `Table` : Liste des règles appliquées
  - `Badge` : Statut obligatoire/optionnel
  - `Accordion` : Catégories de règles
  - `Tooltip` : Descriptions et impacts
- **Information sur les coefficients** :
  - `Card` : Affichage des coefficients appliqués
  - `Progress` : Impact relatif par niveau
  - `Alert` : Information sur les calculs

#### 8. Composants Techniques
- **Sélecteur de composants** :
  - `CheckboxGroup` : Sélection multiple
  - `RadioGroup` : Niveau de service
  - `Card` : Description détaillée
  - `Tooltip` : Impact sur l'estimation
  - `Badge` : Statut obligatoire/optionnel
- **Visualisation d'impact** :
  - `Chart` : Graphique d'impact
  - `Progress` : Contribution à la complexité
  - `Alert` : Avertissements et recommandations

### Thème et Design System

#### Palette de couleurs personnalisée
```css
/* Couleurs primaires */
--primary: 217 91% 60%;          /* Bleu professionnel */
--primary-foreground: 0 0% 98%;

/* Couleurs secondaires */
--secondary: 210 40% 98%;        /* Gris clair */
--secondary-foreground: 222 47% 11%;

/* Couleurs d'accent */
--accent: 210 40% 96%;
--accent-foreground: 222 47% 11%;

/* Couleurs de statut */
--success: 142 76% 36%;          /* Vert */
--warning: 38 92% 50%;           /* Orange */
--destructive: 0 72% 51%;        /* Rouge */
```

#### Composants personnalisés avec Tailwind v4

**ComplexityBadge** : Badge coloré selon la complexité
```typescript
interface ComplexityBadgeProps {
  complexity: 'faible' | 'moyenne' | 'elevee' | 'tres-elevee';
  children: React.ReactNode;
  variant?: 'default' | 'outline';
}

const ComplexityBadge = ({ complexity, children, variant = 'default' }: ComplexityBadgeProps) => {
  const baseClasses = "complexity-badge";
  const variantClasses = variant === 'outline' ? 'border-2' : '';
  
  return (
    <span className={`${baseClasses} ${complexity} ${variantClasses}`}>
      {children}
    </span>
  );
};
```

**EstimationCard** : Carte d'affichage des résultats
```typescript
interface EstimationCardProps {
  title: string;
  value: number;
  unit: string;
  variant: 'primary' | 'secondary' | 'accent' | 'chart-1' | 'chart-2' | 'chart-3';
  trend?: 'up' | 'down' | 'neutral';
  confidence?: number;
}

const EstimationCard = ({ title, value, unit, variant, trend, confidence }: EstimationCardProps) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary-foreground border-secondary/20',
    accent: 'bg-accent/10 text-accent-foreground border-accent/20',
    'chart-1': 'bg-chart-1/10 text-chart-1 border-chart-1/20',
    'chart-2': 'bg-chart-2/10 text-chart-2 border-chart-2/20',
    'chart-3': 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  };
  
  return (
    <div className={`chart-container p-4 ${colorClasses[variant]}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="chart-title text-sm">{title}</h3>
        {trend && <TrendIndicator trend={trend} />}
      </div>
      <div className="text-2xl font-bold mb-1">
        {value} {unit}
      </div>
      {confidence && (
        <div className="text-xs text-muted-foreground">
          Confiance: {Math.round(confidence * 100)}%
        </div>
      )}
    </div>
  );
};
```

**ExperienceIndicator** : Indicateur de niveau d'expérience
```typescript
interface ExperienceIndicatorProps {
  level: 'junior' | 'intermediaire' | 'senior';
  experience: number;
  multiplier: number;
  className?: string;
}

const ExperienceIndicator = ({ level, experience, multiplier, className }: ExperienceIndicatorProps) => {
  const levelConfig = {
    junior: { 
      icon: '🌱', 
      label: 'Junior', 
      color: 'chart-1' 
    },
    intermediaire: { 
      icon: '⚡', 
      label: 'Intermédiaire', 
      color: 'chart-2' 
    },
    senior: { 
      icon: '🚀', 
      label: 'Senior', 
      color: 'chart-3' 
    }
  };
  
  const config = levelConfig[level];
  
  return (
    <div className={`experience-indicator ${level} ${className}`}>
      <span className="text-lg">{config.icon}</span>
      <div className="flex flex-col">
        <span className="font-medium">{config.label}</span>
        <span className="text-xs opacity-75">
          {experience} ans - x{multiplier}
        </span>
      </div>
    </div>
  );
};
```

**AbaqueTable** : Tableau spécialisé pour l'abaque
```typescript
interface AbaqueTableProps {
  data: AbaqueData[];
  onParameterChange: (id: string, field: string, value: any) => void;
  onComplexityChange: (id: string, complexity: string) => void;
  readonly?: boolean;
}

const AbaqueTable = ({ data, onParameterChange, onComplexityChange, readonly }: AbaqueTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="abaque-table">
        <thead>
          <tr>
            <th className="abaque-header">Type de flux</th>
            <th className="abaque-header">Complexité</th>
            <th className="abaque-header">Définition</th>
            <th className="abaque-header">Transcodifications</th>
            <th className="abaque-header">Sources</th>
            <th className="abaque-header">Cibles</th>
            <th className="abaque-header">Architecture pivot</th>
            <th className="abaque-header">Message queue</th>
            <th className="abaque-header">RTU flux (jours)</th>
            <th className="abaque-header">Total RTU</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <AbaqueRow
              key={row.id}
              data={row}
              onParameterChange={onParameterChange}
              onComplexityChange={onComplexityChange}
              readonly={readonly}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

**ComponentSelector** : Sélecteur de composants techniques
```typescript
interface ComponentSelectorProps {
  components: Component[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  userProfile: UserProfile;
}

const ComponentSelector = ({ components, selected, onSelectionChange, userProfile }: ComponentSelectorProps) => {
  const categorizedComponents = groupBy(components, 'type');
  
  return (
    <div className="space-y-4">
      {Object.entries(categorizedComponents).map(([type, components]) => (
        <div key={type} className="space-y-2">
          <h3 className="text-sm font-medium text-foreground capitalize">{type}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {components.map((component) => (
              <ComponentCard
                key={component.id}
                component={component}
                selected={selected.includes(component.id)}
                onToggle={(id) => {
                  const newSelected = selected.includes(id)
                    ? selected.filter(s => s !== id)
                    : [...selected, id];
                  onSelectionChange(newSelected);
                }}
                userProfile={userProfile}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
```

**RuleViewer** : Affichage des règles métiers (lecture seule)
```typescript
interface RuleViewerProps {
  rules: BusinessRule[];
  appliedRules: string[];
  userProfile: UserProfile;
}

const RuleViewer = ({ rules, appliedRules, userProfile }: RuleViewerProps) => {
  const appliedRulesList = rules.filter(rule => appliedRules.includes(rule.id));
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {appliedRulesList.map((rule) => (
          <Card key={rule.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{rule.name}</h4>
              <div className="flex items-center gap-2">
                <Badge variant={rule.mandatory ? 'destructive' : 'secondary'}>
                  {rule.mandatory ? 'Obligatoire' : 'Optionnel'}
                </Badge>
                <Badge variant="outline">{rule.category}</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {rule.description}
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-chart-1/10 rounded">
                <div className="font-medium">Junior</div>
                <div className="text-muted-foreground">
                  Impact: {calculateRuleImpact(rule, 'junior')}j
                </div>
              </div>
              <div className="text-center p-2 bg-chart-2/10 rounded">
                <div className="font-medium">Intermédiaire</div>
                <div className="text-muted-foreground">
                  Impact: {calculateRuleImpact(rule, 'intermediaire')}j
                </div>
              </div>
              <div className="text-center p-2 bg-chart-3/10 rounded">
                <div className="font-medium">Senior</div>
                <div className="text-muted-foreground">
                  Impact: {calculateRuleImpact(rule, 'senior')}j
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {appliedRulesList.length === 0 && (
        <Alert>
          <AlertDescription>
            Aucune règle métier spécifique appliquée pour ce projet.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
```

### Responsive Design

#### Breakpoints Tailwind
- **Mobile** : < 640px - Interface simplifiée
- **Tablet** : 640px - 1024px - Colonnes adaptatives
- **Desktop** : > 1024px - Interface complète

#### Adaptations mobile
- Tableau horizontal scrollable
- Formulaires en accordéon
- Navigation en hamburger menu
- Touches plus larges

### Accessibilité

#### Standards WCAG 2.1
- **Contraste** : Minimum 4.5:1 pour le texte
- **Navigation clavier** : Tous les éléments accessibles
- **Screen readers** : Labels et descriptions appropriés
- **Focus visible** : Indicateurs de focus clairs

#### Composants accessibles (shadcn/ui)
- Support natif des lecteurs d'écran
- Navigation clavier complète
- Gestion des états (hover, focus, disabled)
- Tooltips et descriptions contextuelles

### Performance et Optimisation

#### Tailwind CSS
- **PurgeCSS** : Suppression du CSS inutilisé
- **JIT Mode** : Compilation à la demande
- **Compression** : Minification automatique

#### Composants
- **Lazy loading** : Chargement à la demande
- **Code splitting** : Séparation des bundles
- **Memoization** : Optimisation des re-renders

### Intégration Desktop

#### Fonctionnalités natives
- **Drag & Drop** : Import de fichiers Excel
- **Raccourcis clavier** : Actions rapides
- **Menus contextuels** : Clics droits
- **Notifications** : Alertes système

#### Thèmes
- **Mode sombre/clair** : Synchronisation avec l'OS
- **Préférences utilisateur** : Persistance des choix
- **Animations** : Transitions fluides

---

## 8. Configuration Technique UI

### Installation Tailwind CSS + shadcn/ui

#### Setup initial
```bash
# Installation des dépendances
npm install -D tailwindcss postcss autoprefixer
npm install @radix-ui/react-icons lucide-react
npm install class-variance-authority clsx tailwind-merge

# Configuration Tailwind
npx tailwindcss init -p

# Installation shadcn/ui
npx shadcn-ui@latest init
```

#### Configuration Tailwind v4 (tailwind.config.js)
```javascript
module.exports = {
  content: [
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
    "./src/shared/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring))",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary))",
          foreground: "oklch(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "oklch(var(--accent))",
          foreground: "oklch(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive))",
          foreground: "oklch(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        
        // Variables pour les graphiques
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        
        // Variables pour la sidebar
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
        
        // Couleurs spécifiques à l'abaque
        complexity: {
          faible: "oklch(var(--complexity-faible))",
          moyenne: "oklch(var(--complexity-moyenne))",
          elevee: "oklch(var(--complexity-elevee))",
          "tres-elevee": "oklch(var(--complexity-tres-elevee))",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "complexity-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "complexity-pulse": "complexity-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

#### Composants shadcn/ui requis
```bash
# Composants de base
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add select
npx shadcn-ui@latest add form
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add toast

# Composants spécifiques pour les exemples de référence
npx shadcn@latest add sidebar-03
npx shadcn@latest add dashboard-01
npx shadcn@latest add breadcrumb
npx shadcn@latest add command
npx shadcn@latest add navigation-menu
npx shadcn@latest add popover
npx shadcn@latest add scroll-area
npx shadcn@latest add tabs
```

### Structure des composants UI

#### Composants personnalisés
```typescript
// src/renderer/components/ui/complexity-badge.tsx
interface ComplexityBadgeProps {
  complexity: 'faible' | 'moyenne' | 'elevee' | 'tres-elevee';
  children: React.ReactNode;
}

// src/renderer/components/ui/abaque-table.tsx
interface AbaqueTableProps {
  data: AbaqueData[];
  onParameterChange: (id: string, value: any) => void;
  onComplexityChange: (id: string, complexity: string) => void;
}

// src/renderer/components/ui/estimation-card.tsx
interface EstimationCardProps {
  title: string;
  value: number;
  unit: string;
  variant: 'primary' | 'secondary' | 'accent';
}
```

#### Thème personnalisé (globals.css) - Tailwind v4
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --radius: 0.65rem;
    --background: oklch(1 0 0);
    --foreground: oklch(0.141 0.005 285.823);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.141 0.005 285.823);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.141 0.005 285.823);
    --primary: oklch(0.723 0.219 149.579);
    --primary-foreground: oklch(0.982 0.018 155.826);
    --secondary: oklch(0.967 0.001 286.375);
    --secondary-foreground: oklch(0.21 0.006 285.885);
    --muted: oklch(0.967 0.001 286.375);
    --muted-foreground: oklch(0.552 0.016 285.938);
    --accent: oklch(0.967 0.001 286.375);
    --accent-foreground: oklch(0.21 0.006 285.885);
    --destructive: oklch(0.577 0.245 27.325);
    --border: oklch(0.92 0.004 286.32);
    --input: oklch(0.92 0.004 286.32);
    --ring: oklch(0.723 0.219 149.579);
    
    /* Variables pour les graphiques */
    --chart-1: oklch(0.646 0.222 41.116);
    --chart-2: oklch(0.6 0.118 184.704);
    --chart-3: oklch(0.398 0.07 227.392);
    --chart-4: oklch(0.828 0.189 84.429);
    --chart-5: oklch(0.769 0.188 70.08);
    
    /* Variables pour sidebar */
    --sidebar: oklch(0.985 0 0);
    --sidebar-foreground: oklch(0.141 0.005 285.823);
    --sidebar-primary: oklch(0.723 0.219 149.579);
    --sidebar-primary-foreground: oklch(0.982 0.018 155.826);
    --sidebar-accent: oklch(0.967 0.001 286.375);
    --sidebar-accent-foreground: oklch(0.21 0.006 285.885);
    --sidebar-border: oklch(0.92 0.004 286.32);
    --sidebar-ring: oklch(0.723 0.219 149.579);
    
    /* Variables personnalisées pour l'abaque */
    --complexity-faible: oklch(0.828 0.189 84.429);      /* Vert */
    --complexity-moyenne: oklch(0.769 0.188 70.08);      /* Orange */
    --complexity-elevee: oklch(0.577 0.245 27.325);      /* Rouge */
    --complexity-tres-elevee: oklch(0.45 0.245 27.325);  /* Rouge foncé */
  }

  .dark {
    --background: oklch(0.141 0.005 285.823);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.21 0.006 285.885);
    --card-foreground: oklch(0.985 0 0);
    --popover: oklch(0.21 0.006 285.885);
    --popover-foreground: oklch(0.985 0 0);
    --primary: oklch(0.696 0.17 162.48);
    --primary-foreground: oklch(0.393 0.095 152.535);
    --secondary: oklch(0.274 0.006 286.033);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.274 0.006 286.033);
    --muted-foreground: oklch(0.705 0.015 286.067);
    --accent: oklch(0.274 0.006 286.033);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.704 0.191 22.216);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
    --ring: oklch(0.527 0.154 150.069);
    
    /* Variables pour les graphiques en mode sombre */
    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
    --chart-3: oklch(0.769 0.188 70.08);
    --chart-4: oklch(0.627 0.265 303.9);
    --chart-5: oklch(0.645 0.246 16.439);
    
    /* Variables pour sidebar en mode sombre */
    --sidebar: oklch(0.21 0.006 285.885);
    --sidebar-foreground: oklch(0.985 0 0);
    --sidebar-primary: oklch(0.696 0.17 162.48);
    --sidebar-primary-foreground: oklch(0.393 0.095 152.535);
    --sidebar-accent: oklch(0.274 0.006 286.033);
    --sidebar-accent-foreground: oklch(0.985 0 0);
    --sidebar-border: oklch(1 0 0 / 10%);
    --sidebar-ring: oklch(0.527 0.154 150.069);
    
    /* Variables personnalisées pour l'abaque en mode sombre */
    --complexity-faible: oklch(0.696 0.17 162.48);       /* Vert sombre */
    --complexity-moyenne: oklch(0.769 0.188 70.08);      /* Orange sombre */
    --complexity-elevee: oklch(0.704 0.191 22.216);      /* Rouge sombre */
    --complexity-tres-elevee: oklch(0.55 0.191 22.216);  /* Rouge très sombre */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Styles spécifiques à l'abaque */
.abaque-table {
  @apply w-full border-collapse;
}

.abaque-header {
  @apply bg-primary text-primary-foreground px-4 py-2 font-semibold;
}

.abaque-cell {
  @apply border border-border px-3 py-2 text-sm;
}

.abaque-cell-complexity-faible {
  background: oklch(var(--complexity-faible) / 0.1);
  border-color: oklch(var(--complexity-faible) / 0.3);
  color: oklch(var(--complexity-faible));
}

.abaque-cell-complexity-moyenne {
  background: oklch(var(--complexity-moyenne) / 0.1);
  border-color: oklch(var(--complexity-moyenne) / 0.3);
  color: oklch(var(--complexity-moyenne));
}

.abaque-cell-complexity-elevee {
  background: oklch(var(--complexity-elevee) / 0.1);
  border-color: oklch(var(--complexity-elevee) / 0.3);
  color: oklch(var(--complexity-elevee));
}

.abaque-cell-complexity-tres-elevee {
  background: oklch(var(--complexity-tres-elevee) / 0.1);
  border-color: oklch(var(--complexity-tres-elevee) / 0.3);
  color: oklch(var(--complexity-tres-elevee));
}

/* Styles pour les graphiques */
.chart-container {
  @apply rounded-lg border bg-card text-card-foreground shadow-sm;
}

.chart-title {
  @apply text-lg font-semibold text-foreground;
}

.chart-description {
  @apply text-sm text-muted-foreground;
}

/* Styles pour la sidebar */
.sidebar-item {
  @apply flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors;
}

.sidebar-item:hover {
  @apply bg-sidebar-accent text-sidebar-accent-foreground;
}

.sidebar-item.active {
  @apply bg-sidebar-primary text-sidebar-primary-foreground;
}

/* Styles pour les badges de complexité */
.complexity-badge {
  @apply inline-flex items-center rounded-full px-2 py-1 text-xs font-medium;
}

.complexity-badge.faible {
  background: oklch(var(--complexity-faible) / 0.1);
  color: oklch(var(--complexity-faible));
}

.complexity-badge.moyenne {
  background: oklch(var(--complexity-moyenne) / 0.1);
  color: oklch(var(--complexity-moyenne));
}

.complexity-badge.elevee {
  background: oklch(var(--complexity-elevee) / 0.1);
  color: oklch(var(--complexity-elevee));
}

.complexity-badge.tres-elevee {
  background: oklch(var(--complexity-tres-elevee) / 0.1);
  color: oklch(var(--complexity-tres-elevee));
}

/* Styles pour les indicateurs d'expérience */
.experience-indicator {
  @apply flex items-center gap-2 px-3 py-2 rounded-lg;
}

.experience-indicator.junior {
  @apply bg-chart-1/10 text-chart-1;
}

.experience-indicator.intermediaire {
  @apply bg-chart-2/10 text-chart-2;
}

.experience-indicator.senior {
  @apply bg-chart-3/10 text-chart-3;
}

/* Animations pour les transitions */
@keyframes complexity-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.complexity-animation {
  animation: complexity-pulse 2s ease-in-out infinite;
}

/* Utilities spécifiques aux graphiques */
.chart-grid {
  @apply grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3;
}

.chart-legend {
  @apply flex items-center gap-2 text-xs text-muted-foreground;
}

.chart-legend-item {
  @apply flex items-center gap-1;
}

.chart-legend-color {
  @apply h-2 w-2 rounded-full;
}
```

---

## 9. Déploiement et Distribution

### Packaging
- **Electron Builder** : Génération des installeurs
- **Multi-plateforme** : Windows (.exe), macOS (.dmg), Linux (.AppImage)
- **Code signing** : Certificats pour éviter les warnings
- **Auto-updater** : Mises à jour automatiques

### Distribution
- **Releases GitHub** : Téléchargement direct
- **Versioning** : Semantic versioning (v1.0.0)
- **Changelog** : Documentation des changements
- **Support** : Documentation et FAQ

---

## 10. Planning et Ressources

### Durée estimée
**Total : 12 semaines** (3 mois)
- Phase 1 : 3 semaines
- Phase 2 : 4 semaines
- Phase 3 : 3 semaines
- Phase 4 : 2 semaines

### Équipe recommandée
- **1 Développeur Full-Stack** (Lead)
- **1 Expert métier** (algorithmes, validation)
- **1 UI/UX Designer** (à temps partiel)

### Coûts
- **Développement** : 12 semaines
- **Certificat code signing** : 300€/an
- **Outils optionnels** : 50€/mois
- **Total** : Développement + 300€/an + 50€/mois

---

## 11. Avantages du Plan v3.0

### Par rapport au Plan 1
- **Simplicité** : Architecture moins complexe mais toujours robuste
- **Développement plus rapide** : Moins de sur-ingénierie
- **Maintenance facilitée** : Code plus direct et compréhensible

### Par rapport au Plan 2
- **Professionnalisme** : Interface et architecture plus abouties
- **Extensibilité** : Facilité d'ajout de nouvelles plateformes
- **Robustesse** : Meilleure gestion des erreurs et des cas limites

### Avantages spécifiques
- **Equilibre parfait** : Robustesse professionnelle + simplicité d'implémentation
- **Desktop-first** : Exploite pleinement les avantages des applications natives
- **Évolutivité** : Architecture permettant l'extension future
- **Sécurité** : Données locales, pas de dépendances cloud
- **Performance** : Optimisé pour les environnements desktop
- **Design professionnel** : Utilisation de composants de référence (sidebar-03, dashboard-01) pour une interface moderne et cohérente
- **Expérience utilisateur optimisée** : Navigation intuitive avec sidebar collapsible et dashboard métrique
- **Consistance UI** : Utilisation de patterns éprouvés de shadcn/ui pour une interface familière

---

## Conclusion

Ce plan v3.0 offre le meilleur équilibre entre professionnalisme et pragmatisme pour créer une application de bureau de chiffrage efficace et évolutive. L'approche desktop-first garantit sécurité, performance et autonomie, while la stack technique choisie assure une développement rapide et une maintenance aisée.

L'application résultante sera un outil professionnel complet, installable localement, fonctionnant hors ligne, et facilement extensible pour de futures plateformes de données.

### Bénéfices des Composants de Référence

L'utilisation des composants **sidebar-03** et **dashboard-01** de shadcn/ui apporte plusieurs avantages concrets :

**Navigation (sidebar-03) :**
- Interface intuitive avec navigation hiérarchique
- Sidebar collapsible pour optimiser l'espace d'affichage
- Recherche intégrée pour accès rapide aux fonctions
- Indicateurs visuels pour le statut des projets
- Expérience utilisateur cohérente avec les standards modernes

**Dashboard (dashboard-01) :**
- Visualisation immédiate des métriques clés du chiffrage
- Graphiques intégrés pour la répartition des estimations
- Cartes de métriques pour l'impact du profil utilisateur
- Layout responsive adapté aux différentes tailles d'écran
- Cohérence visuelle avec l'écosystème shadcn/ui

**Intégration Architecture :**
- Composants prêts à l'emploi, réduisant le temps de développement
- Accessibilité intégrée (WCAG 2.1)
- Thèmes sombre/clair automatiques
- Animations fluides et professionnelles
- Maintenance facilitée grâce aux patterns standardisés 