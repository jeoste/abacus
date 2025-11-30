'use client';

import { useEffect, useState } from 'react';
import { HiSun, HiMoon } from 'react-icons/hi2';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Récupérer la préférence sauvegardée ou utiliser la préférence système
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) {
    // Éviter le flash de contenu non stylé
    return (
      <button
        className="w-10 h-10 rounded-lg border border-input bg-background flex items-center justify-center hover:bg-accent transition-colors"
        aria-label="Changer le thème"
      >
        <HiMoon className="w-5 h-5 text-muted-foreground" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-lg border border-input bg-background flex items-center justify-center hover:bg-accent hover:scale-105 transition-all duration-200"
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      title={isDark ? 'Mode sombre' : 'Mode clair'}
    >
      {isDark ? (
        <HiSun className="w-5 h-5 text-foreground transition-transform duration-300 hover:rotate-180" />
      ) : (
        <HiMoon className="w-5 h-5 text-foreground transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}

