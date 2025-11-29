import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { HiFolder, HiPlus } from 'react-icons/hi2';

// Données de démo
const demoProjects = [
  {
    id: 'demo-1',
    name: 'Projet Migration ERP',
    description: 'Migration des données depuis l\'ancien ERP vers le nouveau système',
    systems: [{ id: 'demo-sys-1', name: 'ERP Source' }, { id: 'demo-sys-2', name: 'ERP Cible' }],
  },
  {
    id: 'demo-2',
    name: 'Projet Data Warehouse',
    description: 'Création d\'un entrepôt de données pour la Business Intelligence',
    systems: [{ id: 'demo-sys-3', name: 'Système Transactionnel' }, { id: 'demo-sys-4', name: 'Data Warehouse' }],
  },
  {
    id: 'demo-3',
    name: 'Projet API Integration',
    description: 'Intégration de plusieurs APIs externes avec notre système',
    systems: [{ id: 'demo-sys-5', name: 'API Partenaire 1' }, { id: 'demo-sys-6', name: 'API Partenaire 2' }, { id: 'demo-sys-7', name: 'Système Interne' }],
  },
];

export default async function ProjectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDemo = !user;
  
  let projects = null;
  if (!isDemo) {
    const { data: userProjects } = await supabase
      .from('projects')
      .select(`
        *,
        systems (id, name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    projects = userProjects;
  } else {
    projects = demoProjects;
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
            {' '}pour créer vos propres projets.
          </p>
        </div>
      )}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Mes projets</h2>
          <p className="text-muted-foreground">Organisez vos systèmes et flux par projet</p>
        </div>
        {!isDemo && (
          <Link
            href="/projects/new"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium flex items-center space-x-2"
          >
            <HiPlus className="w-5 h-5" />
            <span>Nouveau projet</span>
          </Link>
        )}
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const systemsCount = project.systems?.length || 0;
            const ProjectCard = (
              <div
                className={`bg-card rounded-xl shadow-sm p-6 border border-border ${isDemo ? '' : 'hover:shadow-md transition-shadow cursor-pointer'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <HiFolder className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>
                    <strong className="text-foreground">{systemsCount}</strong> système
                    {systemsCount > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            );
            
            return isDemo ? (
              <div key={project.id}>{ProjectCard}</div>
            ) : (
              <Link key={project.id} href={`/projects/${project.id}`}>
                {ProjectCard}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-sm p-12 border border-border text-center">
          <HiFolder className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Aucun projet</h3>
          <p className="text-muted-foreground mb-6">
            Créez votre premier projet pour organiser vos systèmes et flux
          </p>
          {!isDemo && (
            <Link
              href="/projects/new"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
            >
              Créer un projet
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

