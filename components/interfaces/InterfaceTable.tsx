'use client';

import Link from 'next/link';
import { useToast } from '@/components/ui/Toaster';
import type { Interface, Flow } from '@/lib/types';

interface InterfaceTableProps {
  interfaces: Interface[];
  flows: Flow[];
}

export default function InterfaceTable({ interfaces, flows }: InterfaceTableProps) {
  const { showSuccess, showError } = useToast();

  const getFlowCount = (interfaceId: string) => {
    return flows.filter((flow) => flow.interface_id === interfaceId).length;
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette interface ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/interfaces/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showSuccess('Interface supprimée avec succès');
        window.location.reload();
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  if (interfaces.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Aucune interface créée</p>
        <Link
          href="/interfaces/new"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Créer votre première interface
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
              Nom
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre de flux
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {interfaces.map((interfaceItem) => (
            <tr key={interfaceItem.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {interfaceItem.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {interfaceItem.description || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getFlowCount(interfaceItem.id)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Link
                    href={`/interfaces/${interfaceItem.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(interfaceItem.id)}
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

