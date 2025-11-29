'use client';

import Link from 'next/link';
import { HiCalculator, HiChartBar, HiDocumentText, HiShieldCheck, HiFolder, HiServer, HiArrowRight } from 'react-icons/hi2';

interface LandingPageProps {
  isAuthenticated: boolean;
}

export default function LandingPage({ isAuthenticated }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-muted/10">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Ave Abacus !
            <span className="block text-3xl mt-2 text-muted-foreground">
              Création d'abaques pour flux de données
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Estimez la charge de vos flux de données avec des abaques tirés du monde professionnel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg font-medium text-lg"
            >
              Découvrir l'outil
            </Link>
            <Link
              href="/signup"
              className="px-8 py-4 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium text-lg"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </section>


      {/* Projets Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-card rounded-xl shadow-sm p-8 border border-border">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <HiFolder className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">1. Projets</h2>
              <p className="text-muted-foreground">Organisez vos systèmes et flux par projet</p>
            </div>
          </div>
          
          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Les projets vous permettent de regrouper vos systèmes et flux de données pour une meilleure organisation.
                Créez un projet pour commencer à structurer vos estimations.
              </p>
              <Link
                href="/projects"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
              >
                <span>Accéder aux projets</span>
                <HiArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6 border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Tutoriel : Comment créer et utiliser un projet</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Créer un projet</h4>
                      <p className="text-muted-foreground">
                        Cliquez sur "Nouveau projet" et renseignez le nom et la description de votre projet.
                        Les projets servent de conteneurs pour organiser vos systèmes et flux.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Organiser vos systèmes</h4>
                      <p className="text-muted-foreground">
                        Une fois votre projet créé, vous pourrez y associer des systèmes. Chaque système
                        représente une application ou un service source ou cible de vos flux de données.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Associer des flux</h4>
                      <p className="text-muted-foreground">
                        Les flux de données peuvent être associés à un ou plusieurs systèmes d'un projet.
                        Cela permet de visualiser l'ensemble des flux liés à un projet.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>💡</span>
                <span>Connectez-vous pour accéder à la page Projets et commencer à créer vos projets</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Systèmes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-card rounded-xl shadow-sm p-8 border border-border">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <HiServer className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">2. Systèmes</h2>
              <p className="text-muted-foreground">Gérez vos systèmes sources et cibles</p>
            </div>
          </div>
          
          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Les systèmes représentent les applications ou services qui sont sources ou cibles de vos flux de données.
                Créez et gérez vos systèmes pour les associer à vos flux.
              </p>
              <Link
                href="/systems"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
              >
                <span>Accéder aux systèmes</span>
                <HiArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6 border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Tutoriel : Comment créer et utiliser un système</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Créer un système</h4>
                      <p className="text-muted-foreground">
                        Cliquez sur "+ Nouveau système" et renseignez les informations : nom, type (source ou cible),
                        technologie utilisée, et optionnellement le projet auquel il appartient.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Associer à un projet</h4>
                      <p className="text-muted-foreground">
                        Lors de la création, vous pouvez associer le système à un projet existant.
                        Cela permet de regrouper tous les systèmes d'un même projet.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Utiliser dans les flux</h4>
                      <p className="text-muted-foreground">
                        Une fois créés, vos systèmes pourront être sélectionnés lors de la création de flux.
                        Un flux peut avoir plusieurs systèmes sources et plusieurs systèmes cibles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>💡</span>
                <span>Connectez-vous pour accéder à la page Systèmes et commencer à créer vos systèmes</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Flux Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-card rounded-xl shadow-sm p-8 border border-border">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <HiCalculator className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">3. Flux</h2>
              <p className="text-muted-foreground">Calculez la charge de vos flux de données</p>
            </div>
          </div>
          
          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Les flux représentent vos transformations de données ETL. Créez un flux, renseignez ses paramètres
                (technologie, complexité, volumes, etc.) et obtenez une estimation en jours-homme.
              </p>
              <Link
                href="/flows"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
              >
                <span>Accéder aux flux</span>
                <HiArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6 border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Tutoriel : Comment créer et utiliser un flux</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Créer un flux</h4>
                      <p className="text-muted-foreground">
                        Cliquez sur "+ Nouveau flux" et renseignez les informations de base : nom, description,
                        technologie (Talend ou Blueway), et les systèmes sources et cibles associés.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Configurer les paramètres</h4>
                      <p className="text-muted-foreground">
                        Définissez la complexité du flux, le nombre de sources et cibles, les volumes de données,
                        la fréquence d'exécution, et autres paramètres qui influencent l'estimation.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Obtenir l'estimation</h4>
                      <p className="text-muted-foreground">
                        L'algorithme calcule automatiquement l'estimation en jours-homme avec une répartition
                        par phase : développement, tests, déploiement et maintenance.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Sauvegarder et exporter</h4>
                      <p className="text-muted-foreground">
                        Enregistrez votre flux et exportez vos estimations en PDF ou CSV pour vos rapports
                        et présentations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>💡</span>
                <span>Connectez-vous pour accéder à la page Flux et commencer à créer vos flux</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-card border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Pourquoi utiliser Abacus ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Rapide et précis</h3>
              <p className="text-muted-foreground">
                Obtenez une estimation fiable en quelques minutes grâce à des abaques éprouvés basés
                sur des années d'expérience.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Multi-technologies</h3>
              <p className="text-muted-foreground">
                Support de Talend et Blueway avec des paramètres spécifiques à chaque technologie
                pour des estimations adaptées.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Organisation flexible</h3>
              <p className="text-muted-foreground">
                Groupez vos flux par interfaces ou projets, suivez vos estimations et exportez vos
                données facilement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-primary/10 rounded-2xl p-12 text-center border border-primary/20">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Créez votre premier abaque en quelques clics
          </p>
          <Link
            href="/flows/new"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg font-medium text-lg"
          >
            Créer mes abaques
          </Link>
        </div>
      </section>
    </div>
  );
}

