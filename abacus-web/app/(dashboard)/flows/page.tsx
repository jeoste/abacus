import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import FlowTable from '@/components/flows/FlowTable';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default async function FlowsPage() {
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
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const { data: interfaces } = await supabase
    .from('interfaces')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-muted/10">
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Abacus</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link
                href="/interfaces"
                className="px-4 py-2 text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                Interfaces
              </Link>
              <a
                href="/api/exports/csv"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
                download
              >
                Export CSV
              </a>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="px-4 py-2 border border-input bg-background text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Gestion des flux</h2>
          <p className="text-muted-foreground">Calculez la charge de vos flux de données</p>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <span className="text-sm text-muted-foreground">
                <strong className="text-foreground">{flows?.length || 0}</strong> flux
              </span>
              <span className="text-sm text-muted-foreground">
                <strong className="text-foreground">{interfaces?.length || 0}</strong> interfaces
              </span>
              <span className="text-sm text-muted-foreground">
                <strong className="text-foreground">
                  {flows?.reduce((sum, flow) => sum + (flow.estimated_days || 0), 0) || 0}
                </strong> jours estimés
              </span>
            </div>
            <Link
              href="/flows/new"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
            >
              + Nouveau flux
            </Link>
          </div>

          <FlowTable flows={flows || []} interfaces={interfaces || []} />
        </div>
      </main>
    </div>
  );
}

