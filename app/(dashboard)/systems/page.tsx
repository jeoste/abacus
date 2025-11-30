import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import SystemTable from '@/components/systems/SystemTable';
import { HiServer } from 'react-icons/hi2';

// Données de démo basées sur les exemples de la landing page
const demoSystems = [
  {
    id: 'demo-sys-1',
    user_id: 'demo-user',
    name: 'CRM Salesforce',
    description: 'Système CRM Salesforce pour la gestion de la relation client',
    project_id: 'demo-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-sys-2',
    user_id: 'demo-user',
    name: 'ERP SAP',
    description: 'Système ERP SAP pour la gestion des ressources de l\'entreprise',
    project_id: 'demo-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const demoFlows = [
  {
    id: 'demo-flow-1',
    name: 'Flux ETL CRM-ERP',
    estimated_days: 12,
    flows_systems: [{ system_id: 'demo-sys-1' }, { system_id: 'demo-sys-2' }],
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

  let projects = null;

  if (!isDemo) {
    const { data: userSystems } = await supabase
      .from('systems')
      .select(`
        *,
        projects (id, name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Normaliser les résultats (Supabase peut retourner projects comme tableau ou objet)
    systems = (userSystems || []).map((sys: any) => ({
      ...sys,
      projects: Array.isArray(sys.projects) ? sys.projects[0] || null : sys.projects || null,
    }));

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

    const { data: userProjects } = await supabase
      .from('projects')
      .select('id, name')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    projects = userProjects;
  } else {
    systems = demoSystems;
    flows = demoFlows;
    projects = [{ id: 'demo-1', name: 'modernisation du SI' }];
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

          <div className="space-y-8">
            <div className="bg-muted/50 rounded-lg p-6 md:p-8 border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-6">Fonctionnement d'un système</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1"></h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Les systèmes représentent les applications ou services qui sont sources ou cibles de vos flux de données.
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
                      Les systèmes peuvent être associés à un ou plusieurs projets.
                      Cela permet de visualiser l'ensemble des systèmes liés à un projet.
                      <br />Par exemple : un système CRM "Salesforce" et un système ERP "SAP", pourront être associés au projet "modernisation du SI".
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground bg-primary/5 rounded-lg p-4 border border-primary/10">
              <span className="text-lg">💡</span>
              <span>Connectez-vous pour accéder à la page Systèmes et commencer à créer vos systèmes</span>
            </div>
          </div>
        </div>
      )}

      {!isDemo && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Gestion des systèmes</h2>
          <p className="text-muted-foreground">
            Organisez vos systèmes par projet ou créez des systèmes indépendants
          </p>
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
              className="px-4 py-2 bg-action text-action-foreground rounded-lg hover:bg-action/90 transition-all duration-200 shadow-sm font-medium"
            >
              + Nouveau système
            </Link>
          </div>
        )}

        <SystemTable systems={systems || []} flows={flows || []} projects={projects || []} isDemo={isDemo} />
      </div>
    </div>
  );
}

