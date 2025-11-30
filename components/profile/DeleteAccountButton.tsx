'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiExclamationTriangle } from 'react-icons/hi2';

export default function DeleteAccountButton() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        if (confirmText !== 'SUPPRIMER') {
            setError('Veuillez taper "SUPPRIMER" pour confirmer');
            return;
        }

        setIsDeleting(true);
        setError('');

        try {
            const response = await fetch('/api/account/delete', {
                method: 'POST',
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || 'Erreur lors de la suppression du compte');
            }

            // Redirection vers la page d'accueil
            router.push('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all duration-200 shadow-sm font-medium text-sm"
            >
                Supprimer mon compte
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-xl shadow-lg max-w-md w-full p-6 border border-border">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                                <HiExclamationTriangle className="w-6 h-6 text-destructive" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">Supprimer le compte</h3>
                        </div>

                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                Cette action est <strong className="text-destructive">irréversible</strong>. Toutes vos données
                                (projets, systèmes, flux) seront définitivement supprimées.
                            </p>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Tapez <strong>SUPPRIMER</strong> pour confirmer
                                </label>
                                <input
                                    type="text"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="SUPPRIMER"
                                    disabled={isDeleting}
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                    <p className="text-sm text-destructive">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setConfirmText('');
                                        setError('');
                                    }}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2 border border-input bg-background text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-medium disabled:opacity-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting || confirmText !== 'SUPPRIMER'}
                                    className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium disabled:opacity-50"
                                >
                                    {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
