'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from './toast';
import styles from './toast-demo.module.css';

export default function ToastDemo() {
  const toast = useToast();

  const showSuccessToast = () => {
    toast.success('Success!', 'Your operation completed successfully', 4000);
  };

  const showErrorToast = () => {
    toast.error('Error', 'Something went wrong. Please try again.', 4000);
  };

  const showWarningToast = () => {
    toast.warning('Warning', 'Please review your input before proceeding', 4000);
  };

  const showInfoToast = () => {
    toast.info('Info', 'This is an informational message', 4000);
  };

  const showLoadingToast = () => {
    const toastId = toast.loading('Loading', 'Processing your request...');
    
    // Simulate completion after 3 seconds
    setTimeout(() => {
      toast.remove(toastId);
      toast.success('Complete!', 'Processing finished successfully', 3000);
    }, 3000);
  };

  const showCustomActionToast = () => {
    toast.info(
      'Action Required',
      'Do you want to proceed with this action?',
      6000
    );
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.title}>Toast Notification Demo</h1>
        <p className={styles.subtitle}>
          Click any button below to see different toast notification types
        </p>

        <div className={styles.grid}>
          <motion.button
            className={`${styles.btn} ${styles.btnSuccess}`}
            onClick={showSuccessToast}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={styles.icon}>✓</span>
            Success Toast
          </motion.button>

          <motion.button
            className={`${styles.btn} ${styles.btnError}`}
            onClick={showErrorToast}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={styles.icon}>✕</span>
            Error Toast
          </motion.button>

          <motion.button
            className={`${styles.btn} ${styles.btnWarning}`}
            onClick={showWarningToast}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={styles.icon}>⚠</span>
            Warning Toast
          </motion.button>

          <motion.button
            className={`${styles.btn} ${styles.btnInfo}`}
            onClick={showInfoToast}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={styles.icon}>ℹ</span>
            Info Toast
          </motion.button>

          <motion.button
            className={`${styles.btn} ${styles.btnLoading}`}
            onClick={showLoadingToast}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={styles.icon}>⏳</span>
            Loading Toast
          </motion.button>

          <motion.button
            className={`${styles.btn} ${styles.btnAction}`}
            onClick={showCustomActionToast}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={styles.icon}>🔔</span>
            Custom Action
          </motion.button>
        </div>

        <div className={styles.info}>
          <h2>Features:</h2>
          <ul>
            <li>✨ Liquid Glass 3D animated design</li>
            <li>🎨 Multiple toast types (success, error, warning, info, loading)</li>
            <li>⏱️ Auto-dismiss with configurable duration</li>
            <li>🎯 Optional action buttons with callbacks</li>
            <li>🎭 Smooth animations with Framer Motion</li>
            <li>📱 Responsive and mobile-friendly</li>
            <li>♿ Accessibility support</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
