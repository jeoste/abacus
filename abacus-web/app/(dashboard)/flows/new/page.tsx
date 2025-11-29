import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import FlowCreationForm from '@/components/flows/FlowCreationForm';

export default async function NewFlowPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: systems } = await supabase
    .from('systems')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Nouveau flux</h2>
        <p className="text-muted-foreground">Créez un nouveau flux de données</p>
      </div>

      <FlowCreationForm systems={systems || []} />
    </div>
  );
}

