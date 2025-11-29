import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import SystemTable from '@/components/systems/SystemTable';
import { HiServer } from 'react-icons/hi2';

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
      {/* Section Tutoriel pour mode démo */}
      {isDemo && (
        <div className="mb-8 bg-card rounded-xl shadow-sm p-8 border border-border">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <HiServer className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">2. Systèmes</h2>
              <p className="text-muted-foreground">Gérez vos systèmes sources et cibles</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6 border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">Tutoriel : Comment créer et utiliser un système</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Créer un système</h4>
                    <p className="text-muted-foreground">
                      Cliquez sur "+ Nouveau système" et renseignez les informations : nom, type (source ou cible),
                      technologie utilisée, et optionnellement le projet auquel il appartient.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Associer à un projet</h4>
                    <p className="text-muted-foreground">
                      Lors de la création, vous pouvez associer le système à un projet existant.
                      Cela permet de regrouper tous les systèmes d'un même projet.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Utiliser dans les flux</h4>
                    <p className="text-muted-foreground">
                      Une fois créés, vos systèmes pourront être sélectionnés lors de la création de flux.
                      Un flux peut avoir plusieurs systèmes sources et plusieurs systèmes cibles.
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
                {' '}pour créer vos propres systèmes.
              </span>
            </div>
          </div>
        </div>
      )}

      {!isDemo && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Gestion des systèmes</h2>
          <p className="text-muted-foreground">Organisez vos systèmes par projet</p>
        </div>
      )}

      {/* Section des données de démo ou systèmes utilisateur */}
      {isDemo && systems && systems.length > 0 && (
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-4">Exemples de systèmes</h3>
        </div>
      )}

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

