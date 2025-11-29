'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { System, Project } from '@/lib/types';

interface SystemFormProps {
  system?: System;
  projects: Project[];
}

export default function SystemForm({ system, projects }: SystemFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectIdParam = searchParams.get('project_id');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: system?.name || '',
    description: system?.description || '',
    project_id: system?.project_id || projectIdParam || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // project_id est maintenant optionnel, pas besoin de vérification

    try {
      const url = system ? `/api/systems/${system.id}` : '/api/systems';
      const method = system ? 'PUT' : 'POST';

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

      router.push('/systems');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="project_id" className="block text-sm font-medium text-foreground mb-2">
          Projet (optionnel)
        </label>
        <select
          id="project_id"
          value={formData.project_id}
          onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
          disabled={!!system || !!projectIdParam}
          className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground disabled:opacity-50"
        >
          <option value="">Aucun projet (système indépendant)</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-sm text-muted-foreground">
          Vous pouvez créer un système sans le lier à un projet
        </p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
          Nom du système *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
          placeholder="ex: Interface Sage"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
          placeholder="Description du système et de ses objectifs"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-input bg-background text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : system ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
}

