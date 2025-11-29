import { createClient } from '@/lib/supabase/server';
import FlowTable from '@/components/flows/FlowTable';
import Link from 'next/link';
import { HiCalculator } from 'react-icons/hi2';

// Données de démo basées sur les exemples de la landing page
const demoFlows = [
  {
    id: 'demo-flow-1',
    user_id: 'demo-user',
    name: 'Flux ETL CRM-ERP',
    client: 'Client Démo',
    tech: 'Talend' as const,
    sources: 1,
    targets: 1,
    transformations: 6,
    complexity: 'modérée' as const,
    user_level: 'confirmé' as const,
    data_volume: 150000,
    frequency: 'quotidien' as const,
    environment: 'prod' as const,
    type_flux: 'job ETL' as const,
    flow_type: 'synchrone' as const,
    max_transcodifications: 4,
    max_sources: 1,
    max_targets: 1,
    max_rules: 6,
    architecture_pivot: false,
    messaging_queue: false,
    gestion_erreurs_techniques: true,
    gestion_erreurs_fonctionnelles: true,
    gestion_logs: true,
    contract_completeness: 85,
    comments: 'Flux ETL reliant le CRM "Salesforce" et l\'ERP "SAP"',
    estimated_days: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    flows_systems: [{ system_id: 'demo-sys-1' }, { system_id: 'demo-sys-2' }],
  },
];

const demoSystems = [
  { id: 'demo-sys-1', name: 'CRM Salesforce' },
  { id: 'demo-sys-2', name: 'ERP SAP' },
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
          
          <div className="space-y-8">
            <div className="bg-muted/50 rounded-lg p-6 md:p-8 border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-6">Fonctionnement d'un flux</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1"></h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Les flux de données représentent le code créé pour transformer les données d'un système source vers un système cible. 
                      <br />La forme de chaque flux (ETL, ESB, API, Services) est unique et la granularité est définie au cas par cas.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1"></h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Les flux peuvent être associés à un ou plusieurs systèmes / interfaces d'un projet.
                      <br />Par exemple : un flux ETL reliant le CRM "Salesforce" et l'ERP "SAP", pourra être associé à ces 2 systèmes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground bg-primary/5 rounded-lg p-4 border border-primary/10">
              <span className="text-lg">💡</span>
              <span>Connectez-vous pour accéder à la page Flux et commencer à créer vos flux</span>
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

