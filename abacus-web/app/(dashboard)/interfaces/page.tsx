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
            <div className="flex items-center space-x-4">
              <Link
                href="/flows"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Flux
              </Link>
              <a
                href="/api/exports/csv"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                download
              >
                Export CSV
              </a>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Gestion des interfaces</h2>
          <p className="text-gray-600">Organisez vos flux par interfaces</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-end mb-6">
            <Link
              href="/interfaces/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Nouvelle interface
            </Link>
          </div>

          <InterfaceTable interfaces={interfaces || []} flows={flows || []} />
        </div>
      </main>
    </div>
  );
}

