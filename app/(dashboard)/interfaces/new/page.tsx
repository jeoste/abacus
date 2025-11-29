import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import InterfaceForm from '@/components/interfaces/InterfaceForm';

export default async function NewInterfacePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Nouvelle interface</h2>
        <p className="text-muted-foreground">Créez une nouvelle interface</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
        <InterfaceForm />
      </div>
    </div>
  );
}

