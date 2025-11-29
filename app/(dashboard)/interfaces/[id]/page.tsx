import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import InterfaceForm from '@/components/interfaces/InterfaceForm';

export default async function EditInterfacePage({
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

  const { data: interfaceItem } = await supabase
    .from('interfaces')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (!interfaceItem) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Modifier l&apos;interface</h2>
        <p className="text-muted-foreground">Modifiez les paramètres de votre interface</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
        <InterfaceForm interface={interfaceItem} />
      </div>
    </div>
  );
}

