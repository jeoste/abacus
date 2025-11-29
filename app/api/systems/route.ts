import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
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
      .from('systems')
      .select('*')
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
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorisé. Vous devez être connecté pour créer un système.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // S'assurer que le profil existe dans public.profiles
    const { error: profileError } = await ensureUserProfile(supabase, user);
    if (profileError) {
      return NextResponse.json(
        { error: profileError },
        { status: 500 }
      );
    }

    // S'assurer que user_id et project_id sont valides
    const { user_id, project_id, ...safeBody } = body;

    // Vérifier que le projet appartient à l'utilisateur si project_id est fourni
    if (project_id) {
      const { data: project } = await supabase
        .from('projects')
        .select('id')
        .eq('id', project_id)
        .eq('user_id', user.id)
        .single();

      if (!project) {
        return NextResponse.json(
          { error: 'Projet non trouvé ou non autorisé.' },
          { status: 404 }
        );
      }
    }

    const { data, error } = await supabase
      .from('systems')
      .insert({
        ...safeBody,
        user_id: user.id,
        project_id: project_id || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la création' },
      { status: 500 }
    );
  }
}

