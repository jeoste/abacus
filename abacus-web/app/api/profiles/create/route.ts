import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Route API pour créer un profil utilisateur
 * Utilisée après l'inscription pour s'assurer que le profil existe
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Essayer d'abord avec getUser()
    let user = null;
    const {
      data: { user: getUserResult },
      error: userError,
    } = await supabase.auth.getUser();

    if (!userError && getUserResult) {
      user = getUserResult;
    } else {
      // Si getUser() échoue, essayer avec getSession()
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (session && session.user) {
        user = session.user;
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier si le profil existe déjà
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      // Le profil existe déjà
      return NextResponse.json(
        { message: 'Profil déjà existant', profile: existingProfile },
        { status: 200 }
      );
    }

    // Créer le profil
    const { data: profile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email || null,
        full_name: user.user_metadata?.full_name || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Erreur lors de la création du profil:', insertError);
      return NextResponse.json(
        { error: `Erreur lors de la création du profil: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Profil créé avec succès', profile },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

