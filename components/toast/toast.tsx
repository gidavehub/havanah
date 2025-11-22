'use client';

import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdCheckCircle, 
  MdError, 
  MdInfo, 
  MdWarning, 
  MdClose,
  MdLoop
} from 'react-icons/md';
import styles from './toast.module.css';

// --- Types ---

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // in ms
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

// --- Context ---

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// --- Components ---

// 1. Toast Icon Helper
const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case 'success': return <MdCheckCircle className={`${styles.icon} ${styles.success}`} />;
    case 'error': return <MdError className={`${styles.icon} ${styles.error}`} />;
    case 'warning': return <MdWarning className={`${styles.icon} ${styles.warning}`} />;
    case 'loading': return <MdLoop className={`${styles.icon} ${styles.loading} ${styles.spin}`} />;
    case 'info': default: return <MdInfo className={`${styles.icon} ${styles.info}`} />;
  }
};

// 2. Individual Toast Item
const ToastItem = ({ 
  toast, 
  onRemove 
}: { 
  toast: ToastMessage; 
  onRemove: (id: string) => void; 
}) => {
  useEffect(() => {
    if (toast.duration && toast.duration > 0 && toast.type !== 'loading') {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`${styles.toast} ${styles[toast.type]}`}
    >
      {/* Glass/Gradient Background Layers */}
      <div className={styles.background} />
      <div className={styles.borderAnimation} />

      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <ToastIcon type={toast.type} />
        </div>
        
        <div className={styles.textContent}>
          <h4 className={styles.title}>{toast.title}</h4>
          {toast.message && <p className={styles.message}>{toast.message}</p>}
        </div>

        <div className={styles.actions}>
          {toast.action && (
            <button 
              className={styles.actionBtn} 
              onClick={(e) => {
                e.stopPropagation();
                toast.action?.onClick();
                onRemove(toast.id);
              }}
            >
              {toast.action.label}
            </button>
          )}
          
          <button 
            className={styles.closeBtn} 
            onClick={() => onRemove(toast.id)}
            aria-label="Close notification"
          >
            <MdClose />
          </button>
        </div>
      </div>

      {/* Progress Bar for auto-dismissing toasts */}
      {toast.duration && toast.duration > 0 && toast.type !== 'loading' && (
        <motion.div 
          className={styles.progressBar}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
};

// 3. Toast Container
const ToastContainer = ({ toasts, removeToast }: { toasts: ToastMessage[], removeToast: (id: string) => void }) => {
  return (
    <div className={styles.container}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// --- Provider ---

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration !== undefined ? toast.duration : 5000, // Default 5 seconds
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// --- Hook ---

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, clearAll } = context;

  return {
    success: (title: string, message?: string, duration?: number) => 
      addToast({ type: 'success', title, message, duration: duration ?? 5000 }),
    
    error: (title: string, message?: string, duration?: number) => 
      addToast({ type: 'error', title, message, duration: duration ?? 5000 }),
    
    warning: (title: string, message?: string, duration?: number) => 
      addToast({ type: 'warning', title, message, duration: duration ?? 5000 }),
    
    info: (title: string, message?: string, duration?: number) => 
      addToast({ type: 'info', title, message, duration: duration ?? 5000 }),
    
    loading: (title: string, message?: string) => 
      addToast({ type: 'loading', title, message, duration: 0 }), // 0 duration = indeterminate
    
    custom: (options: Omit<ToastMessage, 'id'>) => 
      addToast(options),
    
    remove: removeToast,
    clearAll
  };
}

export default ToastProvider;