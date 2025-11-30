import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const supabase = await createClient();

        // Vérifier l'authentification
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        // Supprimer toutes les données de l'utilisateur
        // Les suppressions en cascade sont gérées par la base de données (RLS policies)

        // Supprimer les flux
        await supabase.from('flows').delete().eq('user_id', user.id);

        // Supprimer les interfaces
        await supabase.from('interfaces').delete().eq('user_id', user.id);

        // Supprimer les systèmes
        await supabase.from('systems').delete().eq('user_id', user.id);

        // Supprimer les projets
        await supabase.from('projects').delete().eq('user_id', user.id);

        // Supprimer le compte utilisateur via Supabase Auth
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

        if (deleteError) {
            console.error('Erreur lors de la suppression du compte:', deleteError);
            return NextResponse.json(
                { error: 'Erreur lors de la suppression du compte' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur lors de la suppression du compte:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue lors de la suppression du compte' },
            { status: 500 }
        );
    }
}
