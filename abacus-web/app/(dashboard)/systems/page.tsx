import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import SystemTable from '@/components/systems/SystemTable';

// Données de démo
const demoSystems = [
  {
    id: 'demo-sys-1',
    user_id: 'demo-user',
    name: 'ERP Source',
    description: 'Système ERP source pour la migration',
    project_id: 'demo-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-sys-2',
    user_id: 'demo-user',
    name: 'ERP Cible',
    description: 'Nouveau système ERP cible',
    project_id: 'demo-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-sys-3',
    user_id: 'demo-user',
    name: 'Système Transactionnel',
    description: 'Système transactionnel source de données',
    project_id: 'demo-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-sys-4',
    user_id: 'demo-user',
    name: 'Data Warehouse',
    description: 'Entrepôt de données pour la Business Intelligence',
    project_id: 'demo-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const demoFlows = [
  {
    id: 'demo-flow-1',
    name: 'Migration Données Clients',
    estimated_days: 15,
    flows_systems: [{ system_id: 'demo-sys-1' }, { system_id: 'demo-sys-2' }],
  },
  {
    id: 'demo-flow-2',
    name: 'Extraction Données Ventes',
    estimated_days: 8,
    flows_systems: [{ system_id: 'demo-sys-3' }, { system_id: 'demo-sys-4' }],
  },
];

export default async function SystemsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDemo = !user;
  
  let systems = null;
  let flows = null;
  
  if (!isDemo) {
    const { data: userSystems } = await supabase
      .from('systems')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    systems = userSystems;

    const { data: userFlows } = await supabase
      .from('flows')
      .select(`
        *,
        flows_systems (
          system_id
        )
      `)
      .eq('user_id', user.id);
    flows = userFlows;
  } else {
    systems = demoSystems;
    flows = demoFlows;
  }

  return (
    <div>
      {isDemo && (
        <div className="mb-6 bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-foreground">
            <strong>Mode démo :</strong> Vous visualisez des données d'exemple. 
            <Link href="/signup" className="ml-1 text-primary hover:underline font-medium">
              Inscrivez-vous
            </Link>
            {' '}pour créer vos propres systèmes.
          </p>
        </div>
      )}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Gestion des systèmes</h2>
        <p className="text-muted-foreground">Organisez vos systèmes par projet</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
        {!isDemo && (
          <div className="flex justify-end mb-6">
            <Link
              href="/systems/new"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
            >
              + Nouveau système
            </Link>
          </div>
        )}

        <SystemTable systems={systems || []} flows={flows || []} isDemo={isDemo} />
      </div>
    </div>
  );
}

