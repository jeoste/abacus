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
      .from('projects')
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
        { error: 'Non autorisé. Vous devez être connecté pour créer un projet.' },
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

    // S'assurer que user_id n'est pas fourni dans le body (sécurité)
    const { user_id, ...safeBody } = body;

    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...safeBody,
        user_id: user.id, // Toujours utiliser l'ID de l'utilisateur authentifié
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

