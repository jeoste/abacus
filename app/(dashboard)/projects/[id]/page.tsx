import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { HiFolder, HiPlus, HiPencil, HiArrowLeft } from 'react-icons/hi2';

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (!project) {
    notFound();
  }

  const { data: systems } = await supabase
    .from('systems')
    .select('*')
    .eq('project_id', params.id)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const { data: flows } = await supabase
    .from('flows')
    .select(`
      *,
      flows_systems (
        system_id,
        systems (*)
      )
    `)
    .eq('user_id', user.id);

  // Filtrer les flux qui sont associés à au moins un système de ce projet
  const projectSystemIds = systems?.map((s) => s.id) || [];
  const projectFlows =
    flows?.filter((flow) => {
      const flowSystemIds = (flow.flows_systems as any[])?.map((fs: any) => fs.system_id) || [];
      return flowSystemIds.some((id) => projectSystemIds.includes(id));
    }) || [];

  const totalDays = projectFlows.reduce((sum, flow) => sum + (flow.estimated_days || 0), 0);

  return (
    <div>
      <div className="mb-8">
        <div className="mb-4">
          <Link
            href="/projects"
            className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span>Retour à la liste des projets</span>
          </Link>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{project.name}</h2>
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>
          <Link
            href={`/projects/${project.id}/edit`}
            className="px-4 py-2 border border-input bg-background text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-medium flex items-center space-x-2"
          >
            <HiPencil className="w-4 h-4" />
            <span>Modifier</span>
          </Link>
        </div>
        <div className="flex space-x-6 text-sm text-muted-foreground">
          <span>
            <strong className="text-foreground">{systems?.length || 0}</strong> système
            {systems && systems.length > 1 ? 's' : ''}
          </span>
          <span>
            <strong className="text-foreground">{projectFlows.length}</strong> flux
          </span>
          <span>
            <strong className="text-foreground">{totalDays}</strong> jours estimés
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Systèmes */}
        <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">Systèmes</h3>
            <Link
              href={`/systems/new?project_id=${project.id}`}
              className="px-4 py-2 bg-action text-action-foreground rounded-lg hover:bg-action/90 transition-colors shadow-sm font-medium flex items-center space-x-2 text-sm"
            >
              <HiPlus className="w-4 h-4" />
              <span>Ajouter</span>
            </Link>
          </div>
          {systems && systems.length > 0 ? (
            <div className="space-y-3">
              {systems.map((system) => (
                <Link
                  key={system.id}
                  href={`/systems/${system.id}`}
                  className="block p-4 bg-secondary rounded-lg hover:bg-accent transition-colors"
                >
                  <h4 className="font-medium text-foreground">{system.name}</h4>
                  {system.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {system.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun système dans ce projet</p>
            </div>
          )}
        </div>

        {/* Flux associés */}
        <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">Flux associés</h3>
            <Link
              href={`/flows/new?project_id=${project.id}`}
              className="px-4 py-2 bg-action text-action-foreground rounded-lg hover:bg-action/90 transition-colors shadow-sm font-medium flex items-center space-x-2 text-sm"
            >
              <HiPlus className="w-4 h-4" />
              <span>Créer</span>
            </Link>
          </div>
          {projectFlows.length > 0 ? (
            <div className="space-y-3">
              {projectFlows.map((flow) => {
                const flowSystems =
                  (flow.flows_systems as any[])?.map((fs: any) => fs.systems) || [];
                return (
                  <Link
                    key={flow.id}
                    href={`/flows/${flow.id}`}
                    className="block p-4 bg-secondary rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{flow.name}</h4>
                      {flow.estimated_days && (
                        <span className="text-sm font-semibold text-primary">
                          {flow.estimated_days}j
                        </span>
                      )}
                    </div>
                    {flowSystems.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Systèmes: {flowSystems.map((s: any) => s.name).join(', ')}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun flux associé à ce projet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

