import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SystemForm from '@/components/systems/SystemForm';
import Link from 'next/link';

export default async function NewSystemPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (!projects || projects.length === 0) {
    return (
      <div>
        <div className="bg-card rounded-xl shadow-sm p-12 border border-border text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">Aucun projet</h3>
          <p className="text-muted-foreground mb-6">
            Vous devez créer un projet avant de créer un système
          </p>
          <Link
            href="/projects/new"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
          >
            Créer un projet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Nouveau système</h2>
        <p className="text-muted-foreground">Créez un nouveau système dans un projet</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
        <SystemForm projects={projects} />
      </div>
    </div>
  );
}

