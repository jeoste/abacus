import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Rediriger vers la page d'accueil après confirmation
      redirect('/');
    }
  }

  // Rediriger vers la page de connexion en cas d'erreur
  redirect('/login?error=Erreur lors de la confirmation de l\'email');
}

