'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Gérer les erreurs de connexion
      // Note: Si la vérification d'email est désactivée dans Supabase, 
      // les erreurs liées à la confirmation seront ignorées
      if (error.message.includes('Invalid login credentials') ||
        error.message.includes('Invalid credentials')) {
        setError('Email ou mot de passe incorrect. Vérifiez vos identifiants ou créez un compte.');
      } else if (error.message.includes('Email not confirmed') ||
        (error.message.includes('email') && error.message.includes('confirm'))) {
        // Si la vérification d'email est requise par Supabase, on affiche un message
        // Sinon, cette erreur ne devrait pas apparaître si la vérification est désactivée
        setError('Votre email n\'a pas encore été validé. Si la vérification d\'email est désactivée, contactez le support.');
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    // Vérifier que l'utilisateur existe et a un profil
    if (!data.user) {
      setError('Erreur lors de la connexion. Veuillez réessayer.');
      setLoading(false);
      return;
    }

    // Vérifier que le profil existe dans la table profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      // Le profil n'existe pas, déconnecter l'utilisateur
      await supabase.auth.signOut();
      setError('Ce compte n\'existe pas. Veuillez créer un compte avant de vous connecter.');
      setLoading(false);
      return;
    }

    // Note: La vérification de l'email est optionnelle
    // Si vous avez désactivé "Enable email confirmations" dans Supabase,
    // les utilisateurs peuvent se connecter sans vérifier leur email
    // La vérification de email_confirmed_at n'est donc pas nécessaire ici

    // Connexion réussie, rediriger
    const returnTo = searchParams.get('returnTo') || '/flows';
    router.push(returnTo);
    router.refresh();
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
          placeholder="votre@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-action text-action-foreground py-2 px-4 rounded-lg hover:bg-action/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="bg-card p-8 rounded-xl shadow-lg w-full max-w-md border border-border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Abacus</h1>
          <p className="text-muted-foreground">Connectez-vous à votre compte</p>
        </div>

        <Suspense fallback={<div>Chargement...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link href="/signup" className="text-primary hover:text-primary/90 font-medium transition-colors">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

