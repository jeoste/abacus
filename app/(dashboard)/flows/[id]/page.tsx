import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import FlowForm from '@/components/flows/FlowForm';

export default async function EditFlowPage({
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

  const { data: flow } = await supabase
    .from('flows')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (!flow) {
    notFound();
  }

  const { data: interfaces } = await supabase
    .from('interfaces')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Modifier le flux</h2>
        <p className="text-muted-foreground">Modifiez les paramètres de votre flux</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
        <FlowForm flow={flow} interfaces={interfaces || []} />
      </div>
    </div>
  );
}

