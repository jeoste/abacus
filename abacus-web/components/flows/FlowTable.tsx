'use client';

import Link from 'next/link';
import type { Flow, Interface } from '@/lib/types';

interface FlowTableProps {
  flows: Flow[];
  interfaces: Interface[];
}

export default function FlowTable({ flows, interfaces }: FlowTableProps) {
  const getInterfaceName = (interfaceId: string | null | undefined) => {
    if (!interfaceId) return '-';
    const interfaceItem = interfaces.find((i) => i.id === interfaceId);
    return interfaceItem?.name || '-';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce flux ?')) {
      return;
    }

    const response = await fetch(`/api/flows/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      window.location.reload();
    } else {
      alert('Erreur lors de la suppression');
    }
  };

  if (flows.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Aucun flux créé</p>
        <Link
          href="/flows/new"
          className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
        >
          Créer votre premier flux
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Technologie
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Interface
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Nom
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Sources
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Cibles
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Complexité
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Estimation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {flows.map((flow) => (
            <tr key={flow.id} className="hover:bg-muted/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {flow.tech}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {flow.client || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {getInterfaceName(flow.interface_id)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                {flow.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {flow.sources}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {flow.targets}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    flow.complexity === 'simple'
                      ? 'bg-secondary text-foreground'
                      : flow.complexity === 'modérée'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {flow.complexity}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                {flow.estimated_days ? `${flow.estimated_days}j` : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Link
                    href={`/flows/${flow.id}`}
                    className="text-primary hover:text-primary/90 transition-colors"
                  >
                    Modifier
                  </Link>
                  <a
                    href={`/api/exports/pdf?flowId=${flow.id}`}
                    className="text-primary hover:text-primary/90 transition-colors"
                    download
                  >
                    PDF
                  </a>
                  <button
                    onClick={() => handleDelete(flow.id)}
                    className="text-destructive hover:text-destructive/90 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

