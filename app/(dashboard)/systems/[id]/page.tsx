import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import SystemForm from '@/components/systems/SystemForm';

export default async function EditSystemPage({
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

  const { data: system } = await supabase
    .from('systems')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (!system) {
    notFound();
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Modifier le système</h2>
        <p className="text-muted-foreground">Modifiez les paramètres de votre système</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
        <SystemForm system={system} projects={projects || []} />
      </div>
    </div>
  );
}

