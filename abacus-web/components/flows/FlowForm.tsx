'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Flow, Interface, Tech, Complexity, UserLevel, Frequency, Environment, FlowType, TypeFlux } from '@/lib/types';

interface FlowFormProps {
  flow?: Flow;
  interfaces: Interface[];
}

export default function FlowForm({ flow, interfaces }: FlowFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: flow?.name || '',
    client: flow?.client || '',
    tech: (flow?.tech || 'Talend') as Tech,
    interface_id: flow?.interface_id || '',
    sources: flow?.sources || 1,
    targets: flow?.targets || 1,
    transformations: flow?.transformations || 0,
    complexity: (flow?.complexity || 'modérée') as Complexity,
    user_level: (flow?.user_level || 'confirmé') as UserLevel,
    data_volume: flow?.data_volume || 100,
    frequency: (flow?.frequency || 'quotidien') as Frequency,
    environment: (flow?.environment || 'prod') as Environment,
    type_flux: (flow?.type_flux || 'job ETL') as TypeFlux,
    flow_type: (flow?.flow_type || 'synchrone') as FlowType,
    max_transcodifications: flow?.max_transcodifications || 0,
    max_sources: flow?.max_sources || 1,
    max_targets: flow?.max_targets || 1,
    max_rules: flow?.max_rules || 0,
    architecture_pivot: flow?.architecture_pivot || false,
    messaging_queue: flow?.messaging_queue || false,
    gestion_erreurs_techniques: flow?.gestion_erreurs_techniques || false,
    gestion_erreurs_fonctionnelles: flow?.gestion_erreurs_fonctionnelles || false,
    gestion_logs: flow?.gestion_logs || false,
    contract_completeness: flow?.contract_completeness || 100,
    comments: flow?.comments || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = flow ? `/api/flows/${flow.id}` : '/api/flows';
      const method = flow ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      router.push('/flows');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations principales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tech" className="block text-sm font-medium text-gray-700 mb-2">
              Technologie *
            </label>
            <select
              id="tech"
              value={formData.tech}
              onChange={(e) => setFormData({ ...formData, tech: e.target.value as Tech })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Talend">Talend</option>
              <option value="Blueway">Blueway</option>
            </select>
          </div>

          <div>
            <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">
              Client
            </label>
            <input
              id="client"
              type="text"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ex: Meta, Amazon, etc."
            />
          </div>

          <div>
            <label htmlFor="interface_id" className="block text-sm font-medium text-gray-700 mb-2">
              Interface parente
            </label>
            <select
              id="interface_id"
              value={formData.interface_id}
              onChange={(e) => setFormData({ ...formData, interface_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Aucune</option>
              {interfaces.map((int) => (
                <option key={int.id} value={int.id}>
                  {int.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom du flux *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ex: Salesforce vers Base de données"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Caractéristiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sources" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de sources *
            </label>
            <input
              id="sources"
              type="number"
              min="1"
              max="20"
              value={formData.sources}
              onChange={(e) => setFormData({ ...formData, sources: parseInt(e.target.value) || 1 })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="targets" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de cibles *
            </label>
            <input
              id="targets"
              type="number"
              min="1"
              max="20"
              value={formData.targets}
              onChange={(e) => setFormData({ ...formData, targets: parseInt(e.target.value) || 1 })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="transformations" className="block text-sm font-medium text-gray-700 mb-2">
              Transformations
            </label>
            <input
              id="transformations"
              type="number"
              min="0"
              max="50"
              value={formData.transformations}
              onChange={(e) => setFormData({ ...formData, transformations: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="complexity" className="block text-sm font-medium text-gray-700 mb-2">
              Complexité
            </label>
            <select
              id="complexity"
              value={formData.complexity}
              onChange={(e) => setFormData({ ...formData, complexity: e.target.value as Complexity })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="simple">Simple</option>
              <option value="modérée">Modérée</option>
              <option value="complexe">Complexe</option>
            </select>
          </div>

          <div>
            <label htmlFor="user_level" className="block text-sm font-medium text-gray-700 mb-2">
              Niveau d'expertise
            </label>
            <select
              id="user_level"
              value={formData.user_level}
              onChange={(e) => setFormData({ ...formData, user_level: e.target.value as UserLevel })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="junior">Junior (0-2 ans)</option>
              <option value="confirmé">Confirmé (2-5 ans)</option>
              <option value="expert">Expert (5+ ans)</option>
            </select>
          </div>

          <div>
            <label htmlFor="type_flux" className="block text-sm font-medium text-gray-700 mb-2">
              Type de flux
            </label>
            <select
              id="type_flux"
              value={formData.type_flux}
              onChange={(e) => setFormData({ ...formData, type_flux: e.target.value as TypeFlux })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="job ETL">Job ETL</option>
              <option value="route">Route</option>
              <option value="data service">Data service</option>
              <option value="joblet">Joblet</option>
            </select>
          </div>

          <div>
            <label htmlFor="flow_type" className="block text-sm font-medium text-gray-700 mb-2">
              Opération
            </label>
            <select
              id="flow_type"
              value={formData.flow_type}
              onChange={(e) => setFormData({ ...formData, flow_type: e.target.value as FlowType })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="synchrone">Synchrone (S)</option>
              <option value="asynchrone">Asynchrone (A)</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Options avancées</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="data_volume" className="block text-sm font-medium text-gray-700 mb-2">
              Volume de données (MB)
            </label>
            <input
              id="data_volume"
              type="number"
              min="1"
              value={formData.data_volume}
              onChange={(e) => setFormData({ ...formData, data_volume: parseInt(e.target.value) || 100 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
              Fréquence
            </label>
            <select
              id="frequency"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as Frequency })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="unique">Unique</option>
              <option value="quotidien">Quotidien</option>
              <option value="hebdomadaire">Hebdomadaire</option>
              <option value="mensuel">Mensuel</option>
            </select>
          </div>

          <div>
            <label htmlFor="environment" className="block text-sm font-medium text-gray-700 mb-2">
              Environnement
            </label>
            <select
              id="environment"
              value={formData.environment}
              onChange={(e) => setFormData({ ...formData, environment: e.target.value as Environment })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="dev">Développement</option>
              <option value="test">Test</option>
              <option value="prod">Production</option>
            </select>
          </div>

          <div>
            <label htmlFor="contract_completeness" className="block text-sm font-medium text-gray-700 mb-2">
              Complétude du contrat d'interface (%)
            </label>
            <input
              id="contract_completeness"
              type="number"
              min="0"
              max="100"
              value={formData.contract_completeness}
              onChange={(e) => setFormData({ ...formData, contract_completeness: parseInt(e.target.value) || 0 })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">Indiquez le pourcentage de complétude (0 à 100)</p>
          </div>

          <div>
            <label htmlFor="max_transcodifications" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre maximum de transcodifications
            </label>
            <input
              id="max_transcodifications"
              type="number"
              min="0"
              max="100"
              value={formData.max_transcodifications}
              onChange={(e) => setFormData({ ...formData, max_transcodifications: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="max_sources" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre maximum de source(s)
            </label>
            <input
              id="max_sources"
              type="number"
              min="1"
              max="50"
              value={formData.max_sources}
              onChange={(e) => setFormData({ ...formData, max_sources: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="max_targets" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre maximum de cible(s)
            </label>
            <input
              id="max_targets"
              type="number"
              min="1"
              max="50"
              value={formData.max_targets}
              onChange={(e) => setFormData({ ...formData, max_targets: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="max_rules" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre maximum de règles (gestion/métier)
            </label>
            <input
              id="max_rules"
              type="number"
              min="0"
              max="100"
              value={formData.max_rules}
              onChange={(e) => setFormData({ ...formData, max_rules: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Options</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.architecture_pivot}
              onChange={(e) => setFormData({ ...formData, architecture_pivot: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Architecture pivot</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.messaging_queue}
              onChange={(e) => setFormData({ ...formData, messaging_queue: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Messaging queue</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.gestion_erreurs_techniques}
              onChange={(e) => setFormData({ ...formData, gestion_erreurs_techniques: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Gestion des erreurs techniques</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.gestion_erreurs_fonctionnelles}
              onChange={(e) => setFormData({ ...formData, gestion_erreurs_fonctionnelles: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Gestion des erreurs fonctionnelles</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.gestion_logs}
              onChange={(e) => setFormData({ ...formData, gestion_logs: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Gestion des logs</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
          Commentaires détaillés
        </label>
        <textarea
          id="comments"
          rows={6}
          value={formData.comments}
          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Ajoutez ici vos remarques, hypothèses, justifications, etc."
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enregistrement...' : flow ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
}

