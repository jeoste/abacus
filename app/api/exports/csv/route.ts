import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { data: flows, error } = await supabase
    .from('flows')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Générer le CSV
  const headers = [
    'ID',
    'Nom',
    'Client',
    'Technologie',
    'Interface ID',
    'Sources',
    'Cibles',
    'Transformations',
    'Complexité',
    'Niveau utilisateur',
    'Volume de données',
    'Fréquence',
    'Environnement',
    'Type de flux',
    'Type opération',
    'Max transcodifications',
    'Max sources',
    'Max cibles',
    'Max règles',
    'Architecture pivot',
    'Messaging queue',
    'Gestion erreurs techniques',
    'Gestion erreurs fonctionnelles',
    'Gestion logs',
    'Complétude contrat',
    'Commentaires',
    'Estimation (jours)',
    'Date de création',
    'Date de mise à jour',
  ];

  const rows = flows.map((flow) => [
    flow.id,
    flow.name,
    flow.client || '',
    flow.tech,
    flow.interface_id || '',
    flow.sources,
    flow.targets,
    flow.transformations,
    flow.complexity,
    flow.user_level,
    flow.data_volume,
    flow.frequency,
    flow.environment,
    flow.type_flux || '',
    flow.flow_type,
    flow.max_transcodifications,
    flow.max_sources,
    flow.max_targets,
    flow.max_rules,
    flow.architecture_pivot ? 'Oui' : 'Non',
    flow.messaging_queue ? 'Oui' : 'Non',
    flow.gestion_erreurs_techniques ? 'Oui' : 'Non',
    flow.gestion_erreurs_fonctionnelles ? 'Oui' : 'Non',
    flow.gestion_logs ? 'Oui' : 'Non',
    flow.contract_completeness,
    flow.comments || '',
    flow.estimated_days || '',
    flow.created_at,
    flow.updated_at,
  ]);

  // Fonction pour échapper les valeurs CSV
  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="abaques-flux-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}

