'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import UserInfo from '@/components/UserInfo';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Logo size={28} showText={false} />
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight text-foreground hidden sm:inline-block">
                Abacus
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline-block">
                v1.0.0
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = item.isActive(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <div className="h-6 w-px bg-border/50 hidden sm:block" />

          <UserInfo email={email} fullName={fullName} />

          <form action="/auth/signout" method="post">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hidden sm:inline-flex"
            >
              Déconnexion
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
