# Plan de Développement : Abaque Desktop v3.0 (Tauri Edition)

## Vue d'ensemble du projet

### Objectif
Créer un outil de chiffrage professionnel sous forme d'**application de bureau** pour automatiser l'estimation de complexité et de charge des flux de données (Talend et extensions futures), en se basant sur la logique de l'abaque fourni.

### Philosophie du plan v3.0 (Tauri)
Ce plan s'articule autour de :
- **La performance et la sécurité** de Rust et Tauri.
- **La simplicité et la légèreté** d'une interface en Vanilla TypeScript.
- **Une approche desktop-first** native et optimisée.

---

## 1. Stack Technique Recommandée

### Architecture
**Tauri + Rust + Vanilla TypeScript**

**Justification :**
- **Tauri** : Framework moderne pour applications de bureau. Utilise le webview natif du système d'exploitation, résultant en des binaires plus petits et une consommation de mémoire réduite par rapport à Electron.
- **Rust** : Le backend de Tauri est en Rust, offrant des performances de premier ordre, une sécurité mémoire garantie et un écosystème robuste pour la logique métier.
- **TypeScript (Vanilla)** : Assure un frontend typé et maintenable sans la complexité d'un framework lourd comme React ou Vue. Parfait pour une interface simple et réactive.
- **Vite** : Outil de build frontend ultra-rapide, utilisé par défaut dans les projets Tauri.

**Technologies complémentaires :**
- **UI Framework** : **Tailwind CSS** pour un design "utility-first" rapide et personnalisable.
- **Composants UI** : Création de composants sur mesure ou utilisation de bibliothèques compatibles vanilla-js comme **Flowbite** ou **DaisyUI**.
- **Gestion d'état (Frontend)** : Une simple classe TypeScript (singleton) ou une micro-librairie comme `valtio` (utilisable sans React).
- **Formulaires** : Utilisation des API DOM standard avec une librairie de validation comme **Zod**.
- **Graphiques** : **Chart.js** ou **ApexCharts.js** (légers et puissants).
- **Notifications** : Utilisation de l'API de notifications native de Tauri (`@tauri-apps/api/notification`).
- **Tables** : Composant sur-mesure ou une librairie comme **Grid.js**.
- **Icônes** : **Lucide** (version vanilla) ou **Heroicons** (SVG).

### Base de Données
**SQLite + SQLx (en Rust)**

**Avantages :**
- **SQLite** : Fichier unique, portable, idéal pour une application desktop.
- **SQLx** : Toolkit SQL asynchrone pour Rust. Offre une vérification des requêtes à la compilation pour une sécurité et une robustesse accrues. Alternative populaire : `Diesel`.

---

## 2. Architecture Logicielle

### Structure de projet Tauri

La structure d'un projet Tauri sépare clairement le backend Rust du frontend web.

```
abacus-desktop/
├── src/                      # Frontend (Vite + TypeScript)
│   ├── main.ts               # Point d'entrée du frontend
│   ├── index.html            # Fichier HTML principal
│   ├── styles.css            # Fichier de styles global (Tailwind)
│   ├── lib/                  # Modules TS (ex: state, api, components)
│   │   ├── state.ts          # Gestion d'état
│   │   ├── api.ts            # Appels aux commandes Tauri
│   │   └── ui/               # Composants UI (ex: Button.ts, Card.ts)
│   └── assets/               # Ressources statiques
├── src-tauri/                # Backend (Rust)
│   ├── build.rs              # Script de build Rust
│   ├── Cargo.toml            # Dépendances Rust (crates)
│   ├── tauri.conf.json       # Configuration de l'application Tauri
│   └── src/                  # Code source Rust
│       ├── main.rs           # Point d'entrée du backend
│       ├── lib.rs            # Module principal (si nécessaire)
│       ├── commands.rs       # Commandes Tauri exposées au frontend
│       ├── database.rs       # Logique de la base de données (SQLx)
│       ├── models.rs         # Structs de données (ex: Project, Estimation)
│       └── scoring.rs        # Algorithmes de calcul de chiffrage
└── ...
```

### Communication Frontend-Backend
La communication se fait via des **commandes Tauri** asynchrones. Le backend Rust expose des fonctions (marquées `#[tauri::command]`) que le frontend TypeScript peut appeler directement, avec une sérialisation/désérialisation automatique des données (JSON).

---

## 3. Fonctionnalités Clés

Les phases de développement restent globalement les mêmes, mais les tâches techniques sont adaptées à la nouvelle stack.

### Phase 1 : Fondations (3 semaines)
- [ ] Configuration de l'environnement Tauri + Vite + TypeScript + Tailwind CSS.
- [ ] Définition de l'architecture Rust dans `src-tauri`.
- [ ] Mise en place de la communication de base avec les commandes Tauri.
- [ ] Base de données SQLite avec **SQLx** et migrations (avec `sqlx-cli`).
- [ ] Implémentation du layout principal (HTML/CSS/TS).
- [ ] Formulaire de saisie des paramètres (basé sur l'abaque).
- [ ] Algorithme de scoring initial en **Rust** (basé sur l'abaque).
- [ ] Affichage des résultats.

### Phases 2, 3, 4
Les objectifs fonctionnels restent les mêmes (Dashboard, historique, export, etc.). L'implémentation sera réalisée avec la stack Tauri. L'export PDF/Excel, par exemple, sera géré par des *crates* Rust.

---

## 4. Modèle de Données (SQLite + SQLx)

Le schéma Prisma est remplacé par des déclarations `CREATE TABLE` en SQL et des `structs` Rust.

### Schéma SQL

```sql
-- projects.sql

CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updatedAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    isArchived BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS estimations (
    id TEXT PRIMARY KEY NOT NULL,
    projectId TEXT NOT NULL,
    -- ... autres champs (platform, complexity, parameters, score, etc.)
    parameters TEXT, -- JSON stocké en TEXTE
    score REAL,
    estimatedDays REAL,
    createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updatedAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY(projectId) REFERENCES projects(id)
);

-- Ajouter les autres tables (templates, configs, etc.) sur le même modèle.
```

### Structs Rust (models.rs)

```rust
// src-tauri/src/models.rs
use serde::{Serialize, Deserialize};
use sqlx::FromRow;

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    // sqlx peut gérer la conversion des types DateTime
}

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Estimation {
    pub id: String,
    #[serde(rename = "projectId")]
    pub project_id: String,
    pub parameters: String, // Représente le JSON
    pub score: f64,
    #[serde(rename = "estimatedDays")]
    pub estimated_days: f64,
}
```

---

## 5. Algorithme de Scoring (en Rust)

L'algorithme de calcul, basé sur l'abaque, sera implémenté en Rust pour une performance maximale. Il sera exposé au frontend via une commande Tauri.

### Commande de Scoring (commands.rs)

```rust
// src-tauri/src/commands.rs
use crate::models::{ScoringParams, ScoringResult}; // Définir ces structs

#[tauri::command]
pub async fn calculate_score(params: ScoringParams) -> Result<ScoringResult, String> {
    // 1. Valider les paramètres d'entrée
    if params.sources == 0 {
        return Err("Le nombre de sources ne peut pas être zéro.".into());
    }

    // 2. Implémenter la logique de l'abaque
    // Exemple simplifié basé sur l'image
    let mut days = 0.0;

    // Logique pour Job ETL - Faible
    if params.job_type == "ETL" && params.complexity == "Faible" {
        // ... correspond à la première ligne de l'abaque
        days = 1.5; // RTU flux (en jours)
        // Ajouter les options
        days += 0.25; // Gestion erreurs techniques
        days += 0.25; // Gestion erreurs fonctionnelles
        days += 0.25; // Gestion des logs
    }
    // ... implémenter les autres cas de l'abaque

    let result = ScoringResult {
        total_days: days,
        // ... autres détails du résultat
    };

    Ok(result)
}

// Définir les structs nécessaires pour les paramètres et le résultat
#[derive(serde::Deserialize)]
pub struct ScoringParams {
    pub job_type: String, // "ETL", "Data Service", etc.
    pub complexity: String, // "Faible", "Moyenne", etc.
    pub sources: u32,
    // ... autres paramètres de l'abaque
}

#[derive(serde::Serialize)]
pub struct ScoringResult {
    pub total_days: f64,
    // ...
}
```

---

## 6. Interface Utilisateur (Vanilla TS + Tailwind)

L'interface sera construite avec des fichiers HTML, et rendue dynamique grâce à du TypeScript vanilla pour manipuler le DOM.

### Exemple de composant "Card"

**HTML (dans `index.html` ou injecté par TS)**
```html
<div id="results-container"></div>
```

**TypeScript (pour générer une carte de résultat)**
```typescript
// src/lib/ui/Card.ts
import { invoke } from '@tauri-apps/api/tauri';

interface ScoringResult {
  total_days: number;
}

export function createResultCard(containerId: string, result: ScoringResult) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const cardHTML = `
    <div class="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800">Résultat du Chiffrage</h3>
      <p class="text-3xl font-bold text-indigo-600 mt-2">
        ${result.total_days.toFixed(2)} jours
      </p>
      <p class="text-sm text-gray-500 mt-1">
        Estimation basée sur les paramètres fournis.
      </p>
    </div>
  `;
  container.innerHTML = cardHTML;
}

// Utilisation dans main.ts
// const result = await invoke<ScoringResult>('calculate_score', { ... });
// createResultCard('results-container', result);
```

---

## 7. Tests

### Stratégie de Tests
- **Backend (Rust)** : Tests unitaires et d'intégration avec le framework de test intégré de Rust (`#[cfg(test)]`). Les commandes et la logique métier seront testées de manière exhaustive.
- **Frontend (TypeScript)** : Tests unitaires avec **Vitest**. Pour les composants UI, on peut utiliser `@testing-library/dom` pour s'assurer qu'ils se comportent comme prévu.
- **End-to-End** : Tauri fournit un driver pour **WebdriverIO** ou **Playwright** pour automatiser les tests sur l'application finale.

---

## 8. Déploiement et Distribution

### Build de l'application
Le build est géré par la CLI de Tauri.
```bash
# Pour le développement
npm run tauri dev

# Pour le build final
npm run tauri build
```
Cette commande va :
1. Builder le frontend avec Vite.
2. Compiler le backend Rust.
3. Regrouper le tout dans un installeur natif pour la plateforme cible (MSI sur Windows, .app/.dmg sur macOS, .deb/.AppImage sur Linux).

### Auto-Updater
Tauri intègre un système de mise à jour automatique. La configuration se fait dans `tauri.conf.json`. Il suffit d'activer la fonctionnalité et de fournir une URL vers un fichier JSON qui décrit les nouvelles versions.

---

## Conclusion

Ce plan adapté à Tauri offre le meilleur des deux mondes : un backend **performant, sécurisé et robuste** en Rust, et un frontend **léger et moderne** en TypeScript et Tailwind CSS. Cette approche garantit une application de bureau native de haute qualité, facile à maintenir et à faire évoluer.