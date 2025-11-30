import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { CostCalculator } from '@/lib/calculator/costCalculator';
import { ensureUserProfile } from '@/lib/supabase/ensure-profile';

export async function GET() {
  try {
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
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la récupération' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Vérifier l'authentification de manière stricte
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Vérifier explicitement si l'utilisateur est null ou si il y a une erreur d'authentification
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorisé. Vous devez être connecté pour sauvegarder un flux.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const calculator = new CostCalculator();

    // Calculer l'estimation
    const calculation = calculator.calculateCost(body as any);
    body.estimated_days = calculation.totalCost;

    // Extraire system_ids du body (peut être un tableau ou un seul ID pour compatibilité)
    const { user_id, system_ids, interface_id, ...safeBody } = body;

    // Gérer la compatibilité : si interface_id est fourni, le convertir en system_ids
    let systemsToLink: string[] = [];
    if (system_ids && Array.isArray(system_ids)) {
      systemsToLink = system_ids;
    } else if (interface_id) {
      // Compatibilité avec l'ancien format
      systemsToLink = [interface_id];
    }

    // S'assurer que le profil existe dans public.profiles
    const { error: profileError } = await ensureUserProfile(supabase, user);
    if (profileError) {
      return NextResponse.json(
        { error: profileError },
        { status: 500 }
      );
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

    // Insérer le flux
    const { data: flow, error } = await supabase
      .from('flows')
      .insert({
        ...safeBody,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Créer les relations flows_systems
    if (systemsToLink.length > 0) {
      const flowsSystemsData = systemsToLink.map((systemId: string) => ({
        flow_id: flow.id,
        system_id: systemId,
      }));

      const { error: linkError } = await supabase
        .from('flows_systems')
        .insert(flowsSystemsData);

      if (linkError) {
        // Supprimer le flux créé si la liaison échoue
        await supabase.from('flows').delete().eq('id', flow.id);
        return NextResponse.json(
          { error: `Erreur lors de la liaison avec les systèmes: ${linkError.message}` },
          { status: 500 }
        );
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
      .eq('id', flow.id)
      .single();

    revalidatePath('/flows');
    return NextResponse.json(flowWithSystems || flow);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la sauvegarde' },
      { status: 500 }
    );
  }
}

