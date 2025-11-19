'use client';

import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType, duration = 3000) => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
      <style jsx>{`
        .toast-container {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 99;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .toast-container {
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

function Toast({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const getColors = (type: ToastType) => {
    switch (type) {
      case 'success':
        return { bg: '#10b981', icon: 'check_circle' };
      case 'error':
        return { bg: '#ef4444', icon: 'error' };
      case 'warning':
        return { bg: '#f59e0b', icon: 'warning' };
      case 'info':
      default:
        return { bg: '#3b82f6', icon: 'info' };
    }
  };

  const colors = getColors(toast.type);

  return (
    <div className="toast" style={{ animation: 'slideInRight 0.3s ease-out' }}>
      <div
        className="toast-icon"
        style={{ background: colors.bg }}
      >
        <span className="material-symbols-outlined">{colors.icon}</span>
      </div>
      <div className="toast-content">
        <p>{toast.message}</p>
      </div>
      <button className="toast-close" onClick={onRemove}>
        <span className="material-symbols-outlined">close</span>
      </button>

      <style jsx>{`
        .toast {
          background: var(--surface-light);
          border: 1px solid var(--border-light);
          border-radius: 0.75rem;
          padding: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 300px;
          pointer-events: auto;
          animation: slideInRight 0.3s ease-out;
        }

        :global(.dark-mode) .toast {
          background: var(--surface-dark);
          border-color: var(--border-dark);
        }

        .toast-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          color: white;
          flex-shrink: 0;
        }

        .toast-icon :global(.material-symbols-outlined) {
          font-size: 1.25rem;
        }

        .toast-content {
          flex: 1;
        }

        .toast-content p {
          color: var(--text-light);
          font-size: 0.875rem;
          margin: 0;
        }

        :global(.dark-mode) .toast-content p {
          color: var(--text-dark);
        }

        .toast-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted-light);
          transition: color var(--transition-fast);
          flex-shrink: 0;
        }

        .toast-close:hover {
          color: var(--primary);
        }

        .toast-close :global(.material-symbols-outlined) {
          font-size: 1.25rem;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 768px) {
          .toast {
            min-width: auto;
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
