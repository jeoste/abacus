import { createClient } from '@/lib/supabase/server';
import FlowTable from '@/components/flows/FlowTable';
import Link from 'next/link';
import { HiCalculator } from 'react-icons/hi2';

// Données de démo
const demoFlows = [
  {
    id: 'demo-flow-1',
    user_id: 'demo-user',
    name: 'Migration Données Clients',
    client: 'Client ABC',
    tech: 'Talend' as const,
    sources: 1,
    targets: 1,
    transformations: 5,
    complexity: 'modérée' as const,
    user_level: 'confirmé' as const,
    data_volume: 100000,
    frequency: 'unique' as const,
    environment: 'prod' as const,
    type_flux: 'job ETL' as const,
    flow_type: 'synchrone' as const,
    max_transcodifications: 3,
    max_sources: 1,
    max_targets: 1,
    max_rules: 5,
    architecture_pivot: false,
    messaging_queue: false,
    gestion_erreurs_techniques: true,
    gestion_erreurs_fonctionnelles: true,
    gestion_logs: true,
    contract_completeness: 80,
    comments: 'Migration des données clients depuis l\'ancien ERP vers le nouveau',
    estimated_days: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    flows_systems: [{ system_id: 'demo-sys-1' }, { system_id: 'demo-sys-2' }],
  },
  {
    id: 'demo-flow-2',
    user_id: 'demo-user',
    name: 'Extraction Données Ventes',
    client: 'Client XYZ',
    tech: 'Blueway' as const,
    sources: 1,
    targets: 1,
    transformations: 3,
    complexity: 'simple' as const,
    user_level: 'junior' as const,
    data_volume: 50000,
    frequency: 'quotidien' as const,
    environment: 'prod' as const,
    type_flux: 'job ETL' as const,
    flow_type: 'asynchrone' as const,
    max_transcodifications: 1,
    max_sources: 1,
    max_targets: 1,
    max_rules: 2,
    architecture_pivot: false,
    messaging_queue: true,
    gestion_erreurs_techniques: true,
    gestion_erreurs_fonctionnelles: false,
    gestion_logs: true,
    contract_completeness: 70,
    comments: 'Extraction quotidienne des données de ventes vers le Data Warehouse',
    estimated_days: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    flows_systems: [{ system_id: 'demo-sys-3' }, { system_id: 'demo-sys-4' }],
  },
  {
    id: 'demo-flow-3',
    user_id: 'demo-user',
    name: 'Synchronisation Produits',
    client: 'Client DEF',
    tech: 'Talend' as const,
    sources: 2,
    targets: 1,
    transformations: 8,
    complexity: 'complexe' as const,
    user_level: 'expert' as const,
    data_volume: 200000,
    frequency: 'hebdomadaire' as const,
    environment: 'prod' as const,
    type_flux: 'data service' as const,
    flow_type: 'synchrone' as const,
    max_transcodifications: 5,
    max_sources: 2,
    max_targets: 1,
    max_rules: 10,
    architecture_pivot: true,
    messaging_queue: true,
    gestion_erreurs_techniques: true,
    gestion_erreurs_fonctionnelles: true,
    gestion_logs: true,
    contract_completeness: 90,
    comments: 'Synchronisation des données produits entre les systèmes partenaires',
    estimated_days: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    flows_systems: [{ system_id: 'demo-sys-5' }, { system_id: 'demo-sys-6' }, { system_id: 'demo-sys-7' }],
  },
];

const demoSystems = [
  { id: 'demo-sys-1', name: 'ERP Source' },
  { id: 'demo-sys-2', name: 'ERP Cible' },
  { id: 'demo-sys-3', name: 'Système Transactionnel' },
  { id: 'demo-sys-4', name: 'Data Warehouse' },
  { id: 'demo-sys-5', name: 'API Partenaire 1' },
  { id: 'demo-sys-6', name: 'API Partenaire 2' },
  { id: 'demo-sys-7', name: 'Système Interne' },
];

export default async function FlowsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDemo = !user;
  
  let flows = null;
  let systems = null;
  
  if (!isDemo) {
    const { data: userFlows } = await supabase
      .from('flows')
      .select(`
        *,
        flows_systems (
          system_id
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    flows = userFlows;

    const { data: userSystems } = await supabase
      .from('systems')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    systems = userSystems;
  } else {
    flows = demoFlows;
    systems = demoSystems;
  }

  const totalDays = flows?.reduce((sum: number, flow: any) => sum + (flow.estimated_days || 0), 0) || 0;

  return (
    <div>
      {/* Section Tutoriel pour mode démo */}
      {isDemo && (
        <div className="mb-8 bg-card rounded-xl shadow-sm p-8 border border-border">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <HiCalculator className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">3. Flux</h2>
              <p className="text-muted-foreground">Calculez la charge de vos flux de données</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6 border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">Tutoriel : Comment créer et utiliser un flux</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Créer un flux</h4>
                    <p className="text-muted-foreground">
                      Cliquez sur "+ Nouveau flux" et renseignez les informations de base : nom, description,
                      technologie (Talend ou Blueway), et les systèmes sources et cibles associés.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Configurer les paramètres</h4>
                    <p className="text-muted-foreground">
                      Définissez la complexité du flux, le nombre de sources et cibles, les volumes de données,
                      la fréquence d'exécution, et autres paramètres qui influencent l'estimation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Obtenir l'estimation</h4>
                    <p className="text-muted-foreground">
                      L'algorithme calcule automatiquement l'estimation en jours-homme avec une répartition
                      par phase : développement, tests, déploiement et maintenance.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Sauvegarder et exporter</h4>
                    <p className="text-muted-foreground">
                      Enregistrez votre flux et exportez vos estimations en PDF ou CSV pour vos rapports
                      et présentations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>💡</span>
              <span>
                Mode démo : Vous visualisez des données d'exemple. 
                <Link href="/signup" className="ml-1 text-primary hover:underline font-medium">
                  Inscrivez-vous
                </Link>
                {' '}pour créer vos propres flux.
              </span>
            </div>
          </div>
        </div>
      )}

      {!isDemo && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Gestion des flux</h2>
          <p className="text-muted-foreground">Calculez la charge de vos flux de données</p>
        </div>
      )}

      {/* Section des données de démo ou flux utilisateur */}
      {isDemo && flows && flows.length > 0 && (
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-4">Exemples de flux</h3>
        </div>
      )}

      <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">{flows?.length || 0}</strong> flux
            </span>
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">{systems?.length || 0}</strong> systèmes
            </span>
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">{totalDays}</strong> jours estimés
            </span>
          </div>
          {!isDemo && (
            <div className="flex items-center gap-3">
              <Link
                href="/api/exports/csv"
                className="px-4 py-2 border border-input bg-background text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm font-medium text-sm"
              >
                Export CSV
              </Link>
              <Link
                href="/flows/new"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
              >
                + Nouveau flux
              </Link>
            </div>
          )}
        </div>

        <FlowTable flows={flows || []} systems={systems || []} isDemo={isDemo} />
      </div>
    </div>
  );
}

