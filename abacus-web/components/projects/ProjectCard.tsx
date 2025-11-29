'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiFolder, HiTrash } from 'react-icons/hi2';
import { useToast } from '@/components/ui/Toaster';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string | null;
    systems?: { id: string; name: string }[] | null;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Êtes-vous sûr de vouloir supprimer le projet "${project.name}" ?\n\nLes systèmes et flux associés seront déliés du projet mais ne seront pas supprimés.`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Erreur lors de la suppression');
      }

      showSuccess('Projet supprimé avec succès');
      router.refresh();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsDeleting(false);
    }
  };

  const systemsCount = project.systems?.length || 0;

  return (
    <div className="bg-card rounded-xl shadow-sm p-6 border border-border hover:shadow-md transition-shadow relative group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <HiFolder className="w-6 h-6 text-primary" />
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-destructive hover:bg-destructive/10 rounded-lg disabled:opacity-50 z-10 relative"
          aria-label="Supprimer le projet"
          title="Supprimer le projet"
          type="button"
        >
          <HiTrash className="w-4 h-4" />
        </button>
      </div>
      <Link 
        href={`/projects/${project.id}`}
        className="block"
        onClick={(e) => {
          // Si on clique sur le bouton de suppression, ne pas naviguer
          if ((e.target as HTMLElement).closest('button')) {
            e.preventDefault();
          }
        }}
      >
        <h3 className="text-xl font-semibold text-foreground mb-2 hover:text-primary transition-colors">
          {project.name}
        </h3>
        {project.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {project.description}
          </p>
        )}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>
            <strong className="text-foreground">{systemsCount}</strong> système
            {systemsCount > 1 ? 's' : ''}
          </span>
        </div>
      </Link>
    </div>
  );
}

