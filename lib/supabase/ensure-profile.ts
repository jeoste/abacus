import { SupabaseClient } from '@supabase/supabase-js';
import { User } from '@supabase/supabase-js';

/**
 * S'assure que le profil de l'utilisateur existe dans public.profiles
 * Le crée s'il n'existe pas
 */
export async function ensureUserProfile(
  supabase: SupabaseClient,
  user: User
): Promise<{ error: string | null }> {
  // Vérifier si le profil existe
  const { data: profile, error: selectError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    // PGRST116 = no rows returned, ce qui est normal si le profil n'existe pas
    return { error: `Erreur lors de la vérification du profil: ${selectError.message}` };
  }

  // Si le profil n'existe pas, le créer
  if (!profile) {
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email || null,
        full_name: user.user_metadata?.full_name || null,
      });

    if (insertError) {
      return { error: `Erreur lors de la création du profil: ${insertError.message}` };
    }
  }

  return { error: null };
}

