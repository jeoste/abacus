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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Abacus</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Modifier le flux</h2>
          <p className="text-gray-600">Modifiez les paramètres de votre flux</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <FlowForm flow={flow} interfaces={interfaces || []} />
        </div>
      </main>
    </div>
  );
}

