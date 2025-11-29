'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type {
  Tech,
  Complexity,
  UserLevel,
  Frequency,
  Environment,
  FlowType,
  TypeFlux,
  Flow,
  CalculationResult,
} from '@/lib/types';
import { CostCalculator } from '@/lib/calculator/costCalculator';
import ThemeToggle from '@/components/ThemeToggle';

const calculator = new CostCalculator();

export default function HomePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: 'Flux sans nom',
    client: '',
    tech: 'Talend' as Tech,
    sources: 1,
    targets: 1,
    transformations: 0,
    complexity: 'modérée' as Complexity,
    user_level: 'confirmé' as UserLevel,
    data_volume: 100,
    frequency: 'quotidien' as Frequency,
    environment: 'prod' as Environment,
    type_flux: 'job ETL' as TypeFlux,
    flow_type: 'synchrone' as FlowType,
    max_transcodifications: 0,
    max_rules: 0,
    architecture_pivot: false,
    messaging_queue: false,
    gestion_erreurs_techniques: false,
    gestion_erreurs_fonctionnelles: false,
    gestion_logs: false,
    comments: '',
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Récupérer le flux en attente au chargement
  useEffect(() => {
    const pendingFlow = localStorage.getItem('pending_flow');
    if (pendingFlow) {
      try {
        const flowData = JSON.parse(pendingFlow);
        setFormData(flowData);
        
        // Calculer l'estimation pour l'afficher
        const pseudoFlow: Flow = {
          ...flowData,
          id: 'temp',
          user_id: 'temp',
          interface_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setResult(calculator.calculateCost(pseudoFlow));

        // Tenter de sauvegarder automatiquement si on est connecté
        // Note: On ne peut pas vérifier facilement la session ici sans faire un appel API
        // On le fait donc via un fetch
        fetch('/api/flows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(flowData),
        }).then(async (response) => {
          if (response.ok) {
            localStorage.removeItem('pending_flow');
            setSaveMessage('Votre flux en attente a été sauvegardé avec succès !');
            setTimeout(() => {
              router.push('/flows');
            }, 2000);
          }
        }).catch(() => {
          // Ignorer l'erreur, l'utilisateur devra sauvegarder manuellement
        });
      } catch (e) {
        console.error('Erreur lors de la récupération du flux en attente', e);
        localStorage.removeItem('pending_flow');
      }
    }
  }, [router]);

  const handleEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage(null);

    const pseudoFlow: Flow = {
      id: 'temp',
      user_id: 'temp',
      interface_id: null,
      name: formData.name || 'Flux sans nom',
      client: formData.client || null,
      tech: formData.tech,
      sources: formData.sources,
      targets: formData.targets,
      transformations: formData.transformations,
      complexity: formData.complexity,
      user_level: formData.user_level,
      data_volume: formData.data_volume,
      frequency: formData.frequency,
      environment: formData.environment,
      type_flux: formData.type_flux,
      flow_type: formData.flow_type,
      max_transcodifications: formData.max_transcodifications,
      max_sources: formData.sources,
      max_targets: formData.targets,
      max_rules: formData.max_rules,
      architecture_pivot: formData.architecture_pivot,
      messaging_queue: formData.messaging_queue,
      gestion_erreurs_techniques: formData.gestion_erreurs_techniques,
      gestion_erreurs_fonctionnelles: formData.gestion_erreurs_fonctionnelles,
      gestion_logs: formData.gestion_logs,
      contract_completeness: 100,
      comments: formData.comments || null,
      estimated_days: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const calculation = calculator.calculateCost(pseudoFlow);
    setResult(calculation);
  };

  const handleSave = async () => {
    setSaveMessage(null);

    if (!result) {
      setSaveMessage('Calculez d’abord une estimation avant de sauvegarder.');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/flows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      if (response.status === 401) {
        // Sauvegarder dans le localStorage avant redirection
        localStorage.setItem('pending_flow', JSON.stringify(formData));
        
        setSaveMessage(
          'Vous devez vous connecter ou vous inscrire pour sauvegarder ce chiffrage. Redirection en cours...',
        );
        setTimeout(() => {
          const returnTo = encodeURIComponent('/');
          router.push(`/login?returnTo=${returnTo}`);
        }, 1500);
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      setSaveMessage('Chiffrage sauvegardé dans votre espace. Vous pouvez le retrouver dans vos flux.');
    } catch (error) {
      setSaveMessage(
        error instanceof Error ? error.message : 'Une erreur est survenue lors de la sauvegarde.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/10">
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-foreground">Abacus</span>
          </div>
          <div className="flex items-center space-x-4">
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
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-8 lg:grid-cols-[2fr,1fr]">
        <section className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <h1 className="text-2xl font-bold text-foreground mb-1">Créer un chiffrage</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Remplissez les paramètres ci-dessous pour estimer la charge de votre flux. La
            sauvegarde nécessite un compte, mais le calcul est accessible à tous.
          </p>

          <form onSubmit={handleEstimate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1" htmlFor="name">
                  Nom du flux
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="ex: Export clients quotidien"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1" htmlFor="client">
                  Client
                </label>
                <input
                  id="client"
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="ex: Projet X"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1" htmlFor="tech">
                  Technologie
                </label>
                <select
                  id="tech"
                  value={formData.tech}
                  onChange={(e) => setFormData({ ...formData, tech: e.target.value as Tech })}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
                >
                  <option value="Talend">Talend</option>
                  <option value="Blueway">Blueway</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1" htmlFor="complexity">
                  Complexité
                </label>
                <select
                  id="complexity"
                  value={formData.complexity}
                  onChange={(e) =>
                    setFormData({ ...formData, complexity: e.target.value as Complexity })
                  }
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
                >
                  <option value="simple">Simple</option>
                  <option value="modérée">Modérée</option>
                  <option value="complexe">Complexe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1" htmlFor="user_level">
                  Niveau d'expertise
                </label>
                <select
                  id="user_level"
                  value={formData.user_level}
                  onChange={(e) =>
                    setFormData({ ...formData, user_level: e.target.value as UserLevel })
                  }
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
                >
                  <option value="junior">Junior (0-2 ans)</option>
                  <option value="confirmé">Confirmé (2-5 ans)</option>
                  <option value="expert">Expert (5+ ans)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1" htmlFor="type_flux">
                  Type de flux
                </label>
                <select
                  id="type_flux"
                  value={formData.type_flux}
                  onChange={(e) =>
                    setFormData({ ...formData, type_flux: e.target.value as TypeFlux })
                  }
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
                >
                  <option value="job ETL">Job ETL</option>
                  <option value="route">Route</option>
                  <option value="data service">Data service</option>
                  <option value="joblet">Joblet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1" htmlFor="sources">
                  Nombre de sources
                </label>
                <input
                  id="sources"
                  type="number"
                  min={1}
                  max={20}
                  value={formData.sources}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sources: Number.parseInt(e.target.value || '1', 10),
                    })
                  }
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1" htmlFor="targets">
                  Nombre de cibles
                </label>
                <input
                  id="targets"
                  type="number"
                  min={1}
                  max={20}
                  value={formData.targets}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targets: Number.parseInt(e.target.value || '1', 10),
                    })
                  }
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-foreground mb-1"
                  htmlFor="transformations"
                >
                  Transformations
                </label>
                <input
                  id="transformations"
                  type="number"
                  min={0}
                  max={50}
                  value={formData.transformations}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      transformations: Number.parseInt(e.target.value || '0', 10),
                    })
                  }
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-foreground mb-1"
                  htmlFor="data_volume"
                >
                  Volume de données (MB)
                </label>
                <input
                  id="data_volume"
                  type="number"
                  min={1}
                  value={formData.data_volume}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      data_volume: Number.parseInt(e.target.value || '100', 10),
                    })
                  }
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-foreground mb-1"
                  htmlFor="frequency"
                >
                  Fréquence
                </label>
                <select
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value as Frequency })
                  }
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
                >
                  <option value="unique">Unique</option>
                  <option value="quotidien">Quotidien</option>
                  <option value="hebdomadaire">Hebdomadaire</option>
                  <option value="mensuel">Mensuel</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-foreground mb-1"
                  htmlFor="environment"
                >
                  Environnement
                </label>
                <select
                  id="environment"
                  value={formData.environment}
                  onChange={(e) =>
                    setFormData({ ...formData, environment: e.target.value as Environment })
                  }
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
                >
                  <option value="dev">Développement</option>
                  <option value="test">Test</option>
                  <option value="prod">Production</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1" htmlFor="flow_type">
                  Opération
                </label>
                <select
                  id="flow_type"
                  value={formData.flow_type}
                  onChange={(e) =>
                    setFormData({ ...formData, flow_type: e.target.value as FlowType })
                  }
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
                >
                  <option value="synchrone">Synchrone (S)</option>
                  <option value="asynchrone">Asynchrone (A)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label
                  className="block text-sm font-medium text-foreground mb-1"
                  htmlFor="max_transcodifications"
                >
                  Nombre de transcodifications
                </label>
                <input
                  id="max_transcodifications"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.max_transcodifications}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_transcodifications: Number.parseInt(e.target.value || '0', 10),
                    })
                  }
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
                />
        </div>

              <div>
                <label
                  className="block text-sm font-medium text-foreground mb-1"
                  htmlFor="max_rules"
                >
                  Nombre de règles (gestion / métier)
                </label>
                <input
                  id="max_rules"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.max_rules}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_rules: Number.parseInt(e.target.value || '0', 10),
                    })
                  }
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.architecture_pivot}
                  onChange={(e) =>
                    setFormData({ ...formData, architecture_pivot: e.target.checked })
                  }
                  className="rounded border-input text-primary focus:ring-ring"
                />
                <span className="text-sm text-foreground">Architecture pivot</span>
              </label>

              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.messaging_queue}
                  onChange={(e) =>
                    setFormData({ ...formData, messaging_queue: e.target.checked })
                  }
                  className="rounded border-input text-primary focus:ring-ring"
                />
                <span className="text-sm text-foreground">Messaging queue</span>
              </label>

              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.gestion_erreurs_techniques}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gestion_erreurs_techniques: e.target.checked,
                    })
                  }
                  className="rounded border-input text-primary focus:ring-ring"
                />
                <span className="text-sm text-foreground">Erreurs techniques</span>
              </label>

              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.gestion_erreurs_fonctionnelles}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gestion_erreurs_fonctionnelles: e.target.checked,
                    })
                  }
                  className="rounded border-input text-primary focus:ring-ring"
                />
                <span className="text-sm text-foreground">Erreurs fonctionnelles</span>
              </label>

              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.gestion_logs}
                  onChange={(e) =>
                    setFormData({ ...formData, gestion_logs: e.target.checked })
                  }
                  className="rounded border-input text-primary focus:ring-ring"
                />
                <span className="text-sm text-foreground">Gestion des logs</span>
              </label>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-sm transition-colors font-medium"
              >
                Calculer l'estimation
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 border border-input bg-background text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground disabled:opacity-50 transition-colors font-medium"
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder ce chiffrage'}
              </button>
            </div>

            {saveMessage && (
              <p className="mt-3 text-sm text-muted-foreground">
                {saveMessage}
              </p>
            )}
          </form>
        </section>

        <section className="space-y-4">
          <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Résultat</h2>
            {result ? (
              <div className="space-y-3">
                <p className="text-3xl font-bold text-primary">
                  {result.totalCost} j
                </p>
                <p className="text-sm text-muted-foreground">
                  Soit {result.timeEstimate} pour un profil {formData.user_level} en environnement{' '}
                  {formData.environment}.
                </p>
                <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                  <div className="bg-secondary rounded-md px-3 py-2">
                    <div className="text-xs text-muted-foreground uppercase">Développement</div>
                    <div className="font-semibold text-foreground">{result.breakdown.development} j</div>
                  </div>
                  <div className="bg-secondary rounded-md px-3 py-2">
                    <div className="text-xs text-muted-foreground uppercase">Tests</div>
                    <div className="font-semibold text-foreground">{result.breakdown.testing} j</div>
                  </div>
                  <div className="bg-secondary rounded-md px-3 py-2">
                    <div className="text-xs text-muted-foreground uppercase">Déploiement</div>
                    <div className="font-semibold text-foreground">{result.breakdown.deployment} j</div>
                  </div>
                  <div className="bg-secondary rounded-md px-3 py-2">
                    <div className="text-xs text-muted-foreground uppercase">Maintenance</div>
                    <div className="font-semibold text-foreground">{result.breakdown.maintenance} j</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Lancez un calcul pour voir l'estimation globale et la répartition par phase.
              </p>
            )}
          </div>

          <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-2">Recommandations</h3>
            {result ? (
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Les recommandations apparaîtront ici après le premier calcul.
              </p>
            )}
        </div>
        </section>
      </main>
    </div>
  );
}
