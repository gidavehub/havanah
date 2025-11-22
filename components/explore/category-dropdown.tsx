'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdArrowDropDown, MdCheck } from 'react-icons/md';
import styles from './category-dropdown.module.css';

interface CategoryDropdownProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

const categories = [
  { value: '', label: 'All' },
  { value: 'rent', label: 'For Rent' },
  { value: 'sale', label: 'For Sale' },
];

export default function CategoryDropdown({ value, onChange }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = categories.find(cat => cat.value === value)?.label || 'All';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (categoryValue: string | undefined) => {
    onChange(categoryValue);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button
        className={styles.dropdownButton}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className={styles.dropdownLabel}>Category</span>
        <span className={styles.dropdownValue}>{selectedLabel}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={styles.dropdownIcon}
        >
          <MdArrowDropDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdownMenu}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {categories.map((category) => (
              <motion.button
                key={category.value}
                className={`${styles.dropdownItem} ${
                  value === category.value ? styles.activeItem : ''
                }`}
                onClick={() => handleSelect(category.value || undefined)}
                type="button"
                whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={styles.itemLabel}>{category.label}</span>
                {value === category.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={styles.checkmark}
                  >
                    <MdCheck size={18} />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
