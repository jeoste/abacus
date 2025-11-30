'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import UserInfo from '@/components/UserInfo';

interface DashboardHeaderProps {
  email?: string;
  fullName?: string;
}

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

export default function DashboardHeader({ email, fullName }: DashboardHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 min-w-0">
            <Link href="/" className="flex items-center space-x-3 shrink-0 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
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
                      'px-3 py-2 rounded-lg transition-all duration-200',
                      active
                        ? 'bg-primary/15 text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle thème à gauche du compte */}
            <ThemeToggle />

            {/* Icône de compte en haut à droite */}
            <UserInfo email={email} fullName={fullName} />

            {/* Déconnexion */}
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="hidden sm:inline-flex px-3 py-2 border border-input bg-background text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20 transition-all duration-200 text-sm font-medium"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}


