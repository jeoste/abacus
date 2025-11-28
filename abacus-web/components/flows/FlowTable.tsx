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
        <p className="text-gray-500 mb-4">Aucun flux créé</p>
        <Link
          href="/flows/new"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Créer votre premier flux
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Technologie
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Interface
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sources
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cibles
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Complexité
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estimation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {flows.map((flow) => (
            <tr key={flow.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {flow.tech}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {flow.client || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getInterfaceName(flow.interface_id)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {flow.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {flow.sources}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {flow.targets}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    flow.complexity === 'simple'
                      ? 'bg-green-100 text-green-800'
                      : flow.complexity === 'modérée'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {flow.complexity}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {flow.estimated_days ? `${flow.estimated_days}j` : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Link
                    href={`/flows/${flow.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Modifier
                  </Link>
                  <a
                    href={`/api/exports/pdf?flowId=${flow.id}`}
                    className="text-green-600 hover:text-green-900"
                    download
                  >
                    PDF
                  </a>
                  <button
                    onClick={() => handleDelete(flow.id)}
                    className="text-red-600 hover:text-red-900"
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

