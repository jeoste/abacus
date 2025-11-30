'use client';

import Link from 'next/link';
import { HiFolder, HiServer, HiCalculator, HiArrowRight } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LandingPageProps {
  isAuthenticated: boolean;
}

export default function LandingPage({ isAuthenticated }: LandingPageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium rounded-full">
              v1.0 Maintenant Disponible
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Maîtrisez vos flux de données avec <span className="text-primary">précision</span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-[42rem]">
              Abacus est l&apos;outil de référence pour estimer, structurer et visualiser la charge de vos systèmes d&apos;information. Conçu pour les architectes exigeants.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/projects">
                  Découvrir l&apos;outil <HiArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                <Link href="/signup">
                  Créer un compte
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 bg-muted/30 border-y border-border/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Projets */}
            <Card className="bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <HiFolder className="w-6 h-6" />
                </div>
                <CardTitle>Projets Structurés</CardTitle>
                <CardDescription>
                  Organisez vos estimations par domaine ou client. Gardez une vue d&apos;ensemble claire de votre portefeuille.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAuthenticated ? (
                  <Button variant="link" asChild className="p-0 h-auto font-semibold text-primary">
                    <Link href="/projects">Accéder aux projets &rarr;</Link>
                  </Button>
                ) : (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Organisation hiérarchique
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Vision globale du SI
                    </li>
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Systèmes */}
            <Card className="bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500">
                  <HiServer className="w-6 h-6" />
                </div>
                <CardTitle>Systèmes & Interfaces</CardTitle>
                <CardDescription>
                  Modélisez vos applications et leurs points d&apos;entrée/sortie. Définissez les contraintes techniques.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Catalogue de systèmes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Définition des interfaces
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Flux */}
            <Card className="bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-500">
                  <HiCalculator className="w-6 h-6" />
                </div>
                <CardTitle>Estimation de Flux</CardTitle>
                <CardDescription>
                  Calculez la charge, le volume et la complexité. Obtenez des métriques précises pour vos dimensionnements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Calcul de charge précis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Abaques pré-configurés
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="bg-primary/5 rounded-3xl p-8 md:p-16 text-center border border-primary/10">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Prêt à optimiser vos architectures ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
              Rejoignez les architectes qui utilisent Abacus pour sécuriser leurs dimensionnements.
            </p>
            <Button asChild size="lg" className="h-12 px-8">
              <Link href="/signup">
                Commencer gratuitement
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}