import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import InterfaceTable from '@/components/interfaces/InterfaceTable';

export default async function InterfacesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: interfaces } = await supabase
    .from('interfaces')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const { data: flows } = await supabase
    .from('flows')
    .select('*')
    .eq('user_id', user.id);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Gestion des interfaces</h2>
        <p className="text-muted-foreground">Organisez vos flux par interfaces</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
        <div className="flex justify-end mb-6">
          <Link
            href="/interfaces/new"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
          >
            + Nouvelle interface
          </Link>
        </div>

        <InterfaceTable interfaces={interfaces || []} flows={flows || []} />
      </div>
    </div>
  );
}

