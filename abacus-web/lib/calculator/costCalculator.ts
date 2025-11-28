import type { Flow, CalculationResult } from '@/lib/types';

export class CostCalculator {
  private complexityMultipliers = {
    simple: 0.8,
    modérée: 1.0,
    complexe: 1.4
  };

  private environmentMultipliers = {
    dev: 0.9,
    test: 1.0,
    prod: 1.1
  };

  private frequencyMultipliers = {
    unique: 1.0,
    quotidien: 1.1,
    hebdomadaire: 1.05,
    mensuel: 1.02
  };

  private userLevelMultipliers = {
    junior: 1.5,    // +50% de temps (0-2 ans)
    confirmé: 1.0,  // Temps de référence (2-5 ans)
    expert: 0.8    // -20% de temps (5+ ans)
  };

  private flowTypeMultipliers = {
    synchrone: 1.0,    // Temps de référence
    asynchrone: 1.2    // +20% de temps pour la complexité asynchrone
  };

  calculateCost(flow: Flow): CalculationResult {
    // Calcul de base en jours - formule plus réaliste
    const baseDays = 2; // Jours de base minimum

    // Calcul des composants en jours (valeurs réduites)
    const sourceDays = flow.sources * 0.8; // 0.8 jour par source
    const targetDays = flow.targets * 1.2; // 1.2 jour par cible
    const transformationDays = flow.transformations * 0.3; // 0.3 jour par transformation
    
    // Nouveaux paramètres de configuration
    const transcodificationDays = flow.max_transcodifications * 0.5; // 0.5 jour par transcodification
    const rulesDays = flow.max_rules * 0.25; // 0.25 jour par règle métier
    
    // Bonus/malus pour les options spéciales
    const architecturePivotBonus = flow.architecture_pivot ? 1.5 : 0; // +1.5 jours pour architecture pivot
    const messagingQueueBonus = flow.messaging_queue ? 1.0 : 0; // +1 jour pour messaging queue
    
    // Gestion des erreurs et logs
    const gestionErreursTechniquesBonus = flow.gestion_erreurs_techniques ? 0.5 : 0; // +0.5 jour pour gestion erreurs techniques
    const gestionErreursFonctionnellesBonus = flow.gestion_erreurs_fonctionnelles ? 0.5 : 0; // +0.5 jour pour gestion erreurs fonctionnelles
    const gestionLogsBonus = flow.gestion_logs ? 0.5 : 0; // +0.5 jour pour gestion des logs
    
    // Volume de données - impact limité
    const volumeImpact = Math.min(Math.log10(flow.data_volume / 100 + 1), 2); // Max 2 jours d'impact

    // Application des multiplicateurs (réduits)
    const complexityMultiplier = this.complexityMultipliers[flow.complexity];
    const environmentMultiplier = this.environmentMultipliers[flow.environment];
    const frequencyMultiplier = this.frequencyMultipliers[flow.frequency];
    const userLevelMultiplier = this.userLevelMultipliers[flow.user_level];
    const flowTypeMultiplier = this.flowTypeMultipliers[flow.flow_type];

    // Calcul total en jours
    const rawDays = baseDays + sourceDays + targetDays + transformationDays + transcodificationDays + rulesDays + architecturePivotBonus + messagingQueueBonus + gestionErreursTechniquesBonus + gestionErreursFonctionnellesBonus + gestionLogsBonus + volumeImpact;
    let totalDays = rawDays * complexityMultiplier * environmentMultiplier * frequencyMultiplier * userLevelMultiplier * flowTypeMultiplier;
    
    // Arrondir et limiter entre 1 et 100 jours
    totalDays = Math.max(1, Math.min(100, Math.round(totalDays)));

    // Répartition des jours par phase
    const development = Math.ceil(totalDays * 0.45);
    const testing = Math.ceil(totalDays * 0.25);
    const deployment = Math.ceil(totalDays * 0.15);
    const maintenance = Math.ceil(totalDays * 0.15);

    // Estimation de temps formatée
    const weeks = Math.ceil(totalDays / 5);
    const timeEstimate = `${totalDays}j (${weeks} sem.)`;

    // Recommandations
    const recommendations = this.generateRecommendations(flow, totalDays);

    return {
      totalCost: totalDays, // On retourne les jours dans totalCost pour compatibilité
      breakdown: { development, testing, deployment, maintenance },
      timeEstimate,
      complexity: flow.complexity,
      recommendations
    };
  }

  private generateRecommendations(flow: Flow, totalDays: number): string[] {
    const recommendations: string[] = [];

    if (flow.sources > 5) {
      recommendations.push('Considérez la consolidation des sources de données');
    }

    if (flow.transformations > 20) {
      recommendations.push('Évaluez la possibilité de simplifier les transformations');
    }

    if (flow.complexity === 'complexe' && totalDays > 25) {
      recommendations.push('Envisagez un découpage en phases pour réduire les risques');
    }

    if (flow.frequency === 'quotidien' && flow.data_volume > 1000) {
      recommendations.push('Optimisez les performances pour les gros volumes quotidiens');
    }

    if (flow.user_level === 'junior' && flow.complexity === 'complexe') {
      recommendations.push('Prévoyez un accompagnement senior pour ce développeur junior');
    }

    if (flow.user_level === 'expert' && flow.complexity === 'simple') {
      recommendations.push('Ce développeur expert pourrait optimiser davantage ce flux simple');
    }

    if (recommendations.length === 0) {
      recommendations.push('Configuration optimale détectée');
    }

    return recommendations;
  }
}

