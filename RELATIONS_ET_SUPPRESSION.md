# Relations entre Projets, Systèmes et Flux

## Structure des relations

### Hiérarchie
```
Projets (1) ──→ (N) Systèmes
Systèmes (N) ←─→ (N) Flux (via flows_systems)
```

### Détails

1. **Projets ↔ Systèmes** : Relation **one-to-many** (optionnelle)
   - Un projet peut contenir **0 à N systèmes**
   - Un système peut être associé à **0 ou 1 projet** (project_id peut être NULL)
   - Un système peut exister **sans projet** (système indépendant)

2. **Systèmes ↔ Flux** : Relation **many-to-many**
   - Un flux peut être associé à **1 à N systèmes**
   - Un système peut être associé à **0 à N flux**
   - La relation est gérée via la table `flows_systems`

3. **Projets ↔ Flux** : Relation **indirecte**
   - Les flux ne sont **jamais directement liés** aux projets
   - Un flux peut être associé à un projet **via les systèmes** du projet
   - Un flux peut être associé à des systèmes de **différents projets** ou **sans projet**

## Comportement lors de la suppression

### Suppression d'un Projet
Quand un projet est supprimé :
- ✅ **Les systèmes associés** : Leur `project_id` est mis à `NULL` (déliés, **non supprimés**)
- ✅ **Les flux associés** : **Aucune modification** (les flux ne sont jamais supprimés)
- ✅ **Les relations flows_systems** : **Aucune modification** (restent intactes)

**Résultat** : Les systèmes deviennent "orphelins" (sans projet) mais restent utilisables. Les flux restent intacts et peuvent toujours être associés à leurs systèmes.

### Suppression d'un Système
Quand un système est supprimé :
- ✅ **Les relations flows_systems** : Supprimées automatiquement (CASCADE)
- ✅ **Les flux associés** : **Non supprimés**, mais perdent la relation avec ce système
- ✅ **Le projet** : **Non affecté**

### Suppression d'un Flux
Quand un flux est supprimé :
- ✅ **Les relations flows_systems** : Supprimées automatiquement (CASCADE)
- ✅ **Les systèmes associés** : **Non affectés**
- ✅ **Le projet** : **Non affecté**

## Cas d'usage

### Systèmes orphelins
Un système devient "orphelin" quand :
- Son projet associé est supprimé
- Il est créé sans projet

Les systèmes orphelins :
- ✅ Restent visibles dans la liste des systèmes
- ✅ Peuvent être associés à un nouveau projet
- ✅ Peuvent être utilisés dans des flux
- ✅ Peuvent être supprimés manuellement

### Flux multi-systèmes
Un flux peut être associé à plusieurs systèmes :
- Exemple : Un flux ETL qui synchronise des données entre 3 systèmes différents
- Les systèmes peuvent appartenir à des projets différents ou être indépendants

### Systèmes multi-projets
⚠️ **IMPORTANT** : Un système ne peut être associé qu'à **un seul projet à la fois**.
- Si vous voulez utiliser un système dans plusieurs projets, vous devez :
  - Soit créer des copies du système pour chaque projet
  - Soit laisser le système sans projet et l'utiliser dans les flux

## Interface utilisateur

### Page Systèmes (`/systems`)
- Affiche **tous les systèmes** (avec ou sans projet)
- Permet de filtrer/voir les systèmes orphelins
- Permet d'associer un système à un projet lors de la création/modification

### Page Projets (`/projects`)
- Affiche les projets avec le nombre de systèmes associés
- La page de détail d'un projet montre uniquement les systèmes **directement associés** au projet

### Page Flux (`/flows`)
- Affiche **tous les flux** (indépendants des projets)
- Montre les systèmes associés à chaque flux
- Permet d'associer un flux à plusieurs systèmes lors de la création/modification

