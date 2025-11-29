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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Ave Abacus !
            <span className="block text-3xl md:text-4xl mt-3 text-muted-foreground">
              Création d'abaques pour flux de données
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="bg-card rounded-xl shadow-sm p-8 md:p-10 border border-border">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <HiFolder className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">1. Projets</h2>
              <p className="text-muted-foreground text-lg">Organisez vos systèmes et flux par projet</p>
            </div>
          </div>
          
          {isAuthenticated ? (
            <div className="space-y-6">
              <p className="text-muted-foreground text-base leading-relaxed">
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
            <div className="space-y-8">
              <div className="bg-muted/50 rounded-lg p-6 md:p-8 border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-6">Fonctionnement d'un projet</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1"></h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Les projets servent de conteneurs pour organiser vos systèmes et flux.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1"></h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Chaque projet peut contenir un ou plusieurs systèmes et autant de flux que nécessaire.
                        <br />Par exemple : création d'un projet "modernisation du SI".
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground bg-primary/5 rounded-lg p-4 border border-primary/10">
                <span className="text-lg">💡</span>
                <span>Connectez-vous pour accéder à la page Projets et commencer à créer vos projets</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Systèmes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="bg-card rounded-xl shadow-sm p-8 md:p-10 border border-border">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <HiServer className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">2. Systèmes</h2>
              <p className="text-muted-foreground text-lg">Gérez vos systèmes sources et cibles</p>
            </div>
          </div>
          
          {isAuthenticated ? (
            <div className="space-y-6">
              <p className="text-muted-foreground text-base leading-relaxed">
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
            <div className="space-y-8">
              <div className="bg-muted/50 rounded-lg p-6 md:p-8 border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-6">Fonctionnement d'un système</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1"></h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Les systèmes représentent les applications ou services qui sont sources ou cibles de vos flux de données.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1"></h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Les systèmes peuvent être associés à un ou plusieurs projets.
                        Cela permet de visualiser l'ensemble des systèmes liés à un projet. 
                        <br />Par exemple : un système CRM "Salesforce" et un système ERP "SAP", pourront être associés au projet "modernisation du SI".
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground bg-primary/5 rounded-lg p-4 border border-primary/10">
                <span className="text-lg">💡</span>
                <span>Connectez-vous pour accéder à la page Systèmes et commencer à créer vos systèmes</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Flux Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="bg-card rounded-xl shadow-sm p-8 md:p-10 border border-border">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <HiCalculator className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">3. Flux</h2>
              <p className="text-muted-foreground text-lg">Calculez la charge de vos flux de données</p>
            </div>
          </div>
          
          {isAuthenticated ? (
            <div className="space-y-6">
              <p className="text-muted-foreground text-base leading-relaxed">
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
            <div className="space-y-8">
              <div className="bg-muted/50 rounded-lg p-6 md:p-8 border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-6">Fonctionnement d'un flux</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1"></h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Les flux de données représentent le code créé pour transformer les données d'un système source vers un système cible. 
                        <br />La forme de chaque flux (ETL, ESB, API, Services) est unique et la granularité est définie au cas par cas.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1"></h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Les flux peuvent être associés à un ou plusieurs systèmes / interfaces d'un projet.
                        <br />Par exemple : un flux ETL reliant le CRM "Salesforce" et l'ERP "SAP", pourra être associé à ces 2 systèmes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground bg-primary/5 rounded-lg p-4 border border-primary/10">
                <span className="text-lg">💡</span>
                <span>Connectez-vous pour accéder à la page Flux et commencer à créer vos flux</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-card border-t border-border py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12 md:mb-16">
            Pourquoi utiliser Abacus ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground">Rapide et précis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Obtenez une estimation fiable grâce à des abaques éprouvés basés sur des années d'expérience.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground">Multi-technologies</h3>
              <p className="text-muted-foreground leading-relaxed">
                Support de Talend et Blueway. Autres technologies à venir...
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground">Organisation flexible</h3>
              <p className="text-muted-foreground leading-relaxed">
                Découpez vos flux par interfaces et projets, suivez vos estimations, réutilisez vos flux et exportez vos
                données.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="bg-primary/10 rounded-2xl p-10 md:p-14 text-center border border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">
            Intriguer ?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 md:mb-10">
            Essayez l'outil en démonstration
          </p>
          <Link
            href="/projects"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg font-medium text-lg"
          >
            Découvrir l'outil
          </Link>
        </div>
      </section>
    </div>
  );
}