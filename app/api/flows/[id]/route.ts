import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { CostCalculator } from '@/lib/calculator/costCalculator';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // ... (unchanged)
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Non autorisé. Vous devez être connecté.' },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from('flows')
    .select(`
        *,
        flows_systems (
          system_id,
          systems (*)
        )
      `)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Non autorisé. Vous devez être connecté.' },
      { status: 401 }
    );
  }

  const body = await request.json();
  const calculator = new CostCalculator();

  // Extraire system_ids du body
  const { user_id, system_ids, interface_id, ...safeBody } = body;

  // Gérer la compatibilité : si interface_id est fourni, le convertir en system_ids
  let systemsToLink: string[] = [];
  if (system_ids && Array.isArray(system_ids)) {
    systemsToLink = system_ids;
  } else if (interface_id) {
    systemsToLink = [interface_id];
  }

  // Vérifier que tous les systèmes appartiennent à l'utilisateur
  if (systemsToLink.length > 0) {
    const { data: userSystems } = await supabase
      .from('systems')
      .select('id')
      .eq('user_id', user.id)
      .in('id', systemsToLink);

    if (!userSystems || userSystems.length !== systemsToLink.length) {
      return NextResponse.json(
        { error: 'Un ou plusieurs systèmes ne sont pas autorisés.' },
        { status: 403 }
      );
    }
  }

  // Recalculer l'estimation
  const calculation = calculator.calculateCost({ ...safeBody, user_id: user.id } as any);
  safeBody.estimated_days = calculation.totalCost;

  // Mettre à jour le flux
  const { data, error } = await supabase
    .from('flows')
    .update(safeBody)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Mettre à jour les relations flows_systems
  if (systemsToLink.length >= 0) {
    // Supprimer les anciennes relations
    await supabase
      .from('flows_systems')
      .delete()
      .eq('flow_id', params.id);

    // Créer les nouvelles relations
    if (systemsToLink.length > 0) {
      const flowsSystemsData = systemsToLink.map((systemId: string) => ({
        flow_id: params.id,
        system_id: systemId,
      }));

      const { error: linkError } = await supabase
        .from('flows_systems')
        .insert(flowsSystemsData);

      if (linkError) {
        return NextResponse.json(
          { error: `Erreur lors de la mise à jour des systèmes: ${linkError.message}` },
          { status: 500 }
        );
      }
    }
  }

  // Récupérer le flux avec ses systèmes
  const { data: flowWithSystems } = await supabase
    .from('flows')
    .select(`
      *,
      flows_systems (
        system_id,
        systems (*)
      )
    `)
    .eq('id', params.id)
    .single();

  revalidatePath('/flows');
  return NextResponse.json(flowWithSystems || data);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Non autorisé. Vous devez être connecté.' },
      { status: 401 }
    );
  }

  const { error } = await supabase
    .from('flows')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath('/flows');
  return NextResponse.json({ success: true });
}

