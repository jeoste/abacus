'use client';

import Link from 'next/link';
import type { System, Flow } from '@/lib/types';

interface SystemTableProps {
  systems: System[];
  flows: Flow[];
  isDemo?: boolean;
}

export default function SystemTable({ systems, flows, isDemo = false }: SystemTableProps) {
  const getFlowCount = (systemId: string) => {
    // Compter les flux qui ont ce système dans flows_systems
    return flows.filter((flow: any) => {
      const flowSystems = flow.flows_systems || [];
      return flowSystems.some((fs: any) => fs.system_id === systemId);
    }).length;
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce système ?')) {
      return;
    }

    const response = await fetch(`/api/systems/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      window.location.reload();
    } else {
      alert('Erreur lors de la suppression');
    }
  };

  if (systems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Aucun système créé</p>
        <Link
          href="/systems/new"
          className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
        >
          Créer votre premier système
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-secondary">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              Nom
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              Nombre de flux
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {systems.map((system) => (
            <tr key={system.id} className="hover:bg-accent/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                {system.name}
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {system.description || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {getFlowCount(system.id)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {isDemo ? (
                  <span className="text-muted-foreground">Mode démo</span>
                ) : (
                  <div className="flex space-x-2">
                    <Link
                      href={`/systems/${system.id}`}
                      className="text-primary hover:text-primary/80"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(system.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

