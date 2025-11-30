import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { HiUser, HiChartBar, HiDocumentText, HiFolder, HiServer, HiPlus, HiEye } from 'react-icons/hi2';
import DeleteAccountButton from '@/components/profile/DeleteAccountButton';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: flows } = await supabase
    .from('flows')
    .select('*')
    .eq('user_id', user.id);

  const { data: systems } = await supabase
    .from('systems')
    .select('*')
    .eq('user_id', user.id);

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id);

  const totalDays = flows?.reduce((sum, flow) => sum + (flow.estimated_days || 0), 0) || 0;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Mon profil</h2>
        <p className="text-muted-foreground">Gérez vos informations et consultez vos statistiques</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informations du compte */}
        <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <HiUser className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Informations du compte</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
              <p className="text-foreground mt-1">
                {user.user_metadata?.full_name || 'Non renseigné'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-foreground mt-1">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Date d'inscription</label>
              <p className="text-foreground mt-1">
                {new Date(user.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <HiChartBar className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Statistiques</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <HiFolder className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Projets</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{projects?.length || 0}</p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <HiServer className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Systèmes</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{systems?.length || 0}</p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <HiDocumentText className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Flux</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{flows?.length || 0}</p>
            </div>
            <div className="bg-secondary rounded-lg p-4 col-span-3">
              <div className="flex items-center space-x-2 mb-2">
                <HiChartBar className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Jours estimés total</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalDays} j</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-6 bg-card rounded-xl shadow-sm p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Actions rapides</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Projets */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Projets</h4>
            <div className="flex gap-2">
              <Link
                href="/projects/new"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-action text-action-foreground rounded-lg hover:bg-action/90 transition-all duration-200 shadow-sm font-medium text-sm"
              >
                <HiPlus className="w-4 h-4" />
                Créer
              </Link>
              <Link
                href="/projects"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-input bg-background text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200 font-medium text-sm"
              >
                <HiEye className="w-4 h-4" />
                Voir
              </Link>
            </div>
          </div>

          {/* Systèmes */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Systèmes</h4>
            <div className="flex gap-2">
              <Link
                href="/systems/new"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-action text-action-foreground rounded-lg hover:bg-action/90 transition-all duration-200 shadow-sm font-medium text-sm"
              >
                <HiPlus className="w-4 h-4" />
                Créer
              </Link>
              <Link
                href="/systems"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-input bg-background text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200 font-medium text-sm"
              >
                <HiEye className="w-4 h-4" />
                Voir
              </Link>
            </div>
          </div>

          {/* Flux */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Flux</h4>
            <div className="flex gap-2">
              <Link
                href="/flows/new"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-action text-action-foreground rounded-lg hover:bg-action/90 transition-all duration-200 shadow-sm font-medium text-sm"
              >
                <HiPlus className="w-4 h-4" />
                Créer
              </Link>
              <Link
                href="/flows"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-input bg-background text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200 font-medium text-sm"
              >
                <HiEye className="w-4 h-4" />
                Voir
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de danger */}
      <div className="mt-6 bg-card rounded-xl shadow-sm p-6 border border-destructive/50">
        <h3 className="text-lg font-semibold text-destructive mb-2">Zone de danger</h3>
        <p className="text-sm text-muted-foreground mb-4">
          La suppression de votre compte est irréversible. Toutes vos données seront définitivement supprimées.
        </p>
        <DeleteAccountButton />
      </div>
    </div>
  );
}

