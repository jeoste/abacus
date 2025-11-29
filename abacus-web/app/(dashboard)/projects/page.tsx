import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { HiFolder, HiPlus } from 'react-icons/hi2';
import ProjectCard from '@/components/projects/ProjectCard';

// Données de démo basées sur les exemples de la landing page
const demoProjects = [
  {
    id: 'demo-1',
    name: 'modernisation du SI',
    description: 'Projet de modernisation du système d\'information avec intégration de nouveaux systèmes',
    systems: [{ id: 'demo-sys-1', name: 'CRM Salesforce' }, { id: 'demo-sys-2', name: 'ERP SAP' }],
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
      {/* Section Tutoriel pour mode démo */}
      {isDemo && (
        <div className="mb-8 bg-card rounded-xl shadow-sm p-8 border border-border">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <HiFolder className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">1. Projets</h2>
              <p className="text-muted-foreground">Organisez vos systèmes et flux par projet</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-muted/50 rounded-lg p-6 md:p-8 border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-6">Fonctionnement d'un projet</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1"></h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Les projets servent de conteneurs pour organiser vos systèmes et flux.
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
                      Chaque projet peut contenir un ou plusieurs systèmes et autant de flux que nécessaire.
                      <br />Par exemple : création d'un projet "modernisation du SI".
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground bg-primary/5 rounded-lg p-4 border border-primary/10">
              <span className="text-lg">💡</span>
              <span>Connectez-vous pour accéder à la page Projets et commencer à créer vos projets</span>
            </div>
          </div>
        </div>
      )}

      {!isDemo && (
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Mes projets</h2>
            <p className="text-muted-foreground">Organisez vos systèmes et flux par projet</p>
          </div>
          <Link
            href="/projects/new"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium flex items-center space-x-2"
          >
            <HiPlus className="w-5 h-5" />
            <span>Nouveau projet</span>
          </Link>
        </div>
      )}

      {/* Section des données de démo ou projets utilisateur */}
      {isDemo && projects && projects.length > 0 && (
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-4">Exemples de projets</h3>
        </div>
      )}

      {projects && projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            if (isDemo) {
              const systemsCount = project.systems?.length || 0;
              return (
                <div key={project.id} className="bg-card rounded-xl shadow-sm p-6 border border-border">
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
            }
            
            return <ProjectCard key={project.id} project={project} />;
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

