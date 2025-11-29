'use client';

import { useEffect } from 'react';
import { HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiXMark } from 'react-icons/hi2';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export function ToastComponent({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onClose]);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <HiCheckCircle className="w-5 h-5" />;
      case 'error':
        return <HiExclamationCircle className="w-5 h-5" />;
      case 'info':
        return <HiInformationCircle className="w-5 h-5" />;
    }
  };

  const styles = {
    success: 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400',
    error: 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400',
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm
        ${styles[toast.type]}
      `}
      style={{
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <div className="flex-shrink-0">{getIcon(toast.type)}</div>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 text-current/60 hover:text-current transition-colors"
        aria-label="Fermer"
      >
        <HiXMark className="w-4 h-4" />
      </button>
    </div>
  );
}

