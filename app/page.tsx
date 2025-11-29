'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import UserInfo from '@/components/UserInfo';
import LandingPage from '@/components/landing/LandingPage';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  {
    href: '/projects',
    label: 'Projets',
    isActive: (pathname: string) => pathname.startsWith('/projects'),
  },
  {
    href: '/systems',
    label: 'Systèmes',
    isActive: (pathname: string) => pathname.startsWith('/systems'),
  },
  {
    href: '/flows',
    label: 'Flux',
    isActive: (pathname: string) => pathname.startsWith('/flows'),
  },
];

export default function HomePage() {
  const [user, setUser] = useState<{ email?: string; fullName?: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        setUser({
          email: authUser.email || undefined,
          fullName: authUser.user_metadata?.full_name || undefined,
        });
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-muted/10">
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
                {navItems.map((item) => {
                  const active = item.isActive(pathname);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        'px-3 py-2 rounded-lg transition-colors',
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                      ].join(' ')}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              {user ? (
                <>
                  <UserInfo email={user.email} fullName={user.fullName} />
                  <form action="/auth/signout" method="post">
                    <button
                      type="submit"
                      className="hidden sm:inline-flex px-3 py-2 border border-input bg-background text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
                    >
                      Déconnexion
                    </button>
                  </form>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <LandingPage isAuthenticated={!!user} />
    </div>
  );
}
