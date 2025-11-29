import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
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
    .from('interfaces')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Non autorisé. Vous devez être connecté pour sauvegarder une interface.' },
      { status: 401 }
    );
  }

  const body = await request.json();

  // S'assurer que user_id n'est pas fourni dans le body (sécurité)
  const { user_id, ...safeBody } = body;

  const { data, error } = await supabase
    .from('interfaces')
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
}

