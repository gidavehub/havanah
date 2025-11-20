'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './toast.module.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

// Create context
export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

// Provider component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after duration (unless it's a loading toast)
    if (newToast.type !== 'loading' && newToast.duration) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const clearAll = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return {
    success: (title: string, message?: string, duration?: number) =>
      context.addToast({ type: 'success', title, message, duration }),
    error: (title: string, message?: string, duration?: number) =>
      context.addToast({ type: 'error', title, message, duration }),
    warning: (title: string, message?: string, duration?: number) =>
      context.addToast({ type: 'warning', title, message, duration }),
    info: (title: string, message?: string, duration?: number) =>
      context.addToast({ type: 'info', title, message, duration }),
    loading: (title: string, message?: string) =>
      context.addToast({ type: 'loading', title, message, duration: 0 }),
    remove: context.removeToast,
    clearAll: context.clearAll,
  };
}

// Toast Icon Component
interface ToastIconProps {
  type: ToastType;
}

function ToastIcon({ type }: ToastIconProps) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
    loading: '⟳',
  };

  return (
    <motion.div
      className={`${styles.icon} ${styles[`icon--${type}`]}`}
      initial={{ scale: 0, rotate: -180 }}
      animate={type === 'loading' ? { rotate: 360 } : { scale: 1, rotate: 0 }}
      transition={
        type === 'loading'
          ? { duration: 2, repeat: Infinity, ease: 'linear' }
          : { duration: 0.5, ease: 'backOut' }
      }
    >
      {icons[type]}
    </motion.div>
  );
}

// Individual Toast Component
interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={styles.toastWrapper}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <motion.div
        className={`${styles.toast} ${styles[`toast--${toast.type}`]}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4 }}
      >
        {/* Background Gradient Animation */}
        <div className={styles.background}>
          <div className={styles.gradientOrb1}></div>
          <div className={styles.gradientOrb2}></div>
        </div>

        {/* Border Animation */}
        <div className={styles.borderAnimation}></div>

        {/* Content */}
        <div className={styles.content}>
          <ToastIcon type={toast.type} />

          <div className={styles.textContent}>
            <h3 className={styles.title}>{toast.title}</h3>
            {toast.message && <p className={styles.message}>{toast.message}</p>}
          </div>

          <div className={styles.actions}>
            {toast.action && (
              <button
                className={styles.actionButton}
                onClick={toast.action.onClick}
              >
                {toast.action.label}
              </button>
            )}

            {toast.type !== 'loading' && (
              <motion.button
                className={styles.closeButton}
                onClick={() => onRemove(toast.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {toast.type !== 'loading' && toast.duration && toast.duration > 0 && (
          <motion.div
            className={styles.progressBar}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: toast.duration / 1000, ease: 'linear' }}
            onAnimationComplete={() => onRemove(toast.id)}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

// Toast Container
interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className={styles.container}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ToastProvider;
