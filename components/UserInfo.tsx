'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface UserInfoProps {
  email?: string;
  fullName?: string;
}

export default function UserInfo({ email, fullName }: UserInfoProps) {
  const [userEmail, setUserEmail] = useState<string | null>(email || null);
  const [userName, setUserName] = useState<string | null>(fullName || null);
  const [loading, setLoading] = useState(!email);

  useEffect(() => {
    if (!email) {
      // Récupérer les infos utilisateur côté client si non fournies
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setUserEmail(user.email || null);
          setUserName(user.user_metadata?.full_name || null);
        }
        setLoading(false);
      });
    }
  }, [email]);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted/50">
        <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userEmail) {
    return null;
  }

  const displayName = userName || userEmail.split('@')[0];
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2) || userEmail[0]?.toUpperCase() || '?';

  return (
    <Link
      href="/profile"
      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary font-semibold border border-border hover:bg-primary/20 transition-colors"
      aria-label="Voir le profil"
      title={displayName}
    >
      <span>{initials}</span>
    </Link>
  );
}

