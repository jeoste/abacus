import { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import DashboardHeader from '@/components/DashboardHeader';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import UserInfo from '@/components/UserInfo';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Permettre l'accès en mode démo pour les pages publiques
  const isPublicPage = typeof window === 'undefined' 
    ? false 
    : false; // On vérifiera dans les pages individuelles

  return (
    <div className="min-h-screen bg-muted/10">
      {user ? (
        <DashboardHeader
          email={user.email || undefined}
          fullName={user.user_metadata?.full_name || undefined}
        />
      ) : (
        <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-8 min-w-0">
                <Link href="/" className="flex items-center space-x-3 shrink-0">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">A</span>
                  </div>
                  <span className="text-xl font-bold text-foreground hidden sm:inline">
                    Abacus
                  </span>
                </Link>

                <nav className="flex items-center gap-2 text-sm font-medium">
                  <Link
                    href="/projects"
                    className="px-3 py-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    Projets
                  </Link>
                  <Link
                    href="/systems"
                    className="px-3 py-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    Systèmes
                  </Link>
                  <Link
                    href="/flows"
                    className="px-3 py-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    Flux
                  </Link>
                </nav>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Se connecter
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                  S'inscrire
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}


