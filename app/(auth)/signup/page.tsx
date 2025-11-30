'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { ensureUserProfile } from '@/lib/supabase/ensure-profile';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else if (data.user) {
      // Attendre un peu pour que le trigger SQL s'exécute
      await new Promise(resolve => setTimeout(resolve, 500));

      // Essayer de créer le profil côté client (si la session est établie)
      // Si ça échoue, le trigger SQL devrait l'avoir créé automatiquement
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // La session est établie, on peut essayer de créer le profil
        const { error: profileError } = await ensureUserProfile(supabase, data.user);

        if (profileError) {
          // Si la création échoue, le trigger SQL devrait avoir créé le profil
          // On continue quand même car le profil devrait exister
          console.warn('Erreur lors de la création du profil côté client:', profileError);
          console.warn('Le profil devrait être créé automatiquement par le trigger SQL');
        }
      } else {
        // La session n'est pas encore établie, le trigger SQL créera le profil
        console.log('Session non établie, le profil sera créé par le trigger SQL');
      }

      // Compte créé avec succès
      // Le profil sera créé par le trigger SQL ou par ensureUserProfile
      setSuccess(true);
      setLoading(false);
    } else {
      setError('Erreur lors de la création du compte. Veuillez réessayer.');
      setLoading(false);
    }
  };

  // Redirection automatique après 5 secondes en cas de succès
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success, router]);

  if (success) {
    return (
      <div className="space-y-6">
        <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg">
          <h3 className="font-semibold mb-2">✅ Compte créé avec succès !</h3>
          <p className="text-sm">
            Votre compte a été créé avec l'email <strong>{email}</strong>.
          </p>
          <p className="text-sm mt-2">
            Vous pouvez maintenant vous connecter avec vos identifiants.
          </p>
          <p className="text-sm mt-2 text-muted-foreground">
            Vous serez redirigé vers la page d'accueil dans quelques secondes...
          </p>
        </div>
        <div className="text-center">
          <Link
            href="/"
            className="inline-block w-full bg-action text-action-foreground py-2 px-4 rounded-lg hover:bg-action/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors shadow-sm font-medium text-center"
          >
            Aller à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignup} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
          Nom complet
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
          placeholder="Jean Dupont"
        />
      </div>

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
          minLength={6}
          className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
          placeholder="••••••••"
        />
        <p className="mt-1 text-sm text-muted-foreground">Minimum 6 caractères</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-action text-action-foreground py-2 px-4 rounded-lg hover:bg-action/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium"
      >
        {loading ? 'Inscription...' : "S'inscrire"}
      </button>
    </form>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="bg-card p-8 rounded-xl shadow-lg w-full max-w-md border border-border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Abacus</h1>
          <p className="text-muted-foreground">Créez votre compte</p>
        </div>

        <Suspense fallback={<div>Chargement...</div>}>
          <SignupForm />
        </Suspense>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-primary hover:text-primary/90 font-medium transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

