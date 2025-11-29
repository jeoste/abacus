export const TYPE_FLUX_LIST = ['job ETL', 'route', 'data service', 'joblet'] as const;
export type TypeFlux = typeof TYPE_FLUX_LIST[number];

export type Complexity = 'simple' | 'modérée' | 'complexe';
export type UserLevel = 'junior' | 'confirmé' | 'expert';
export type Frequency = 'unique' | 'quotidien' | 'hebdomadaire' | 'mensuel';
export type Environment = 'dev' | 'test' | 'prod';
export type Tech = 'Talend' | 'Blueway';
export type FlowType = 'synchrone' | 'asynchrone';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface System {
  id: string;
  user_id: string;
  project_id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

// Alias pour compatibilité temporaire
export type Interface = System;

export interface Flow {
  id: string;
  user_id: string;
  name: string;
  client?: string | null;
  tech: Tech;
  sources: number;
  targets: number;
  transformations: number;
  complexity: Complexity;
  user_level: UserLevel;
  data_volume: number;
  frequency: Frequency;
  environment: Environment;
  type_flux?: TypeFlux | null;
  flow_type: FlowType;
  max_transcodifications: number;
  max_sources: number;
  max_targets: number;
  max_rules: number;
  architecture_pivot: boolean;
  messaging_queue: boolean;
  gestion_erreurs_techniques: boolean;
  gestion_erreurs_fonctionnelles: boolean;
  gestion_logs: boolean;
  contract_completeness: number;
  comments?: string | null;
  estimated_days?: number | null;
  created_at: string;
  updated_at: string;
}

export interface CalculationResult {
  totalCost: number; // En jours
  breakdown: {
    development: number;
    testing: number;
    deployment: number;
    maintenance: number;
  };
  timeEstimate: string;
  complexity: string;
  recommendations: string[];
}

export interface FlowSystem {
  flow_id: string;
  system_id: string;
}

