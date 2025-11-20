'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import { advancedSearchListings, createInquiry, Listing } from '@/lib/firestore-service';
import { useInquiryNotification } from '@/lib/notification-hooks';
import { sendNotification } from '@/lib/realtime-service';
import { MdSearch, MdFavoriteBorder, MdFavorite, MdExpandMore, MdCheckCircle, MdHome, MdDirectionsCar } from 'react-icons/md';
import styles from './explore.module.css';

interface SearchFilters {
  query: string;
  type?: 'house' | 'car';
  category?: 'rent' | 'sale';
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

interface SearchResult extends Listing {
  relevance: number;
}

export default function ExplorePage() {
  const { user } = useAuth();
  const toast = useToast();
  
  // Set up inquiry notifications for agents
  useInquiryNotification();

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: undefined,
    category: undefined,
    priceMin: undefined,
    priceMax: undefined,
  });

  // Debounced search
  useEffect(() => {
    const timer = window.setTimeout(() => {
      performSearch();
    }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [filters]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const searchResults = await advancedSearchListings(filters.query, filters);
      setResults(searchResults);
      
      // Generate suggestions from results
      if (filters.query) {
        const uniqueTitles = [...new Set(searchResults.map(r => r.title))];
        setSuggestions(uniqueTitles.slice(0, 5));
      }
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Search failed', 'Could not search listings');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, query: value }));
    setShowSuggestions(value.length > 0);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      query: '',
      type: undefined,
      category: undefined,
      priceMin: undefined,
      priceMax: undefined,
    });
    setResults([]);
    setSuggestions([]);
  };

  const handleInquiry = async () => {
    if (!user?.id || !user?.email) {
      toast.error('Error', 'Please log in first');
      return;
    }

    if (!selectedListing) return;

    try {
      setSubmittingInquiry(true);
      
      const inquiryId = await createInquiry(
        selectedListing.id,
        selectedListing.agentId,
        selectedListing.title,
        user.id,
        user.displayName || 'Customer',
        user.email,
        inquiryMessage || 'I am interested in this listing',
        user.phoneNumber
      );

      // Send notification to agent via Realtime Database
      await sendNotification(selectedListing.agentId, {
        userId: selectedListing.agentId,
        type: 'inquiry',
        title: 'New Inquiry!',
        message: `${user.displayName || 'A user'} is interested in "${selectedListing.title}"`,
        data: {
          inquiryId,
          listingId: selectedListing.id,
          userId: user.id,
        },
        read: false,
      });

      toast.success('Success', 'Your inquiry has been sent!');
      setShowInquiryModal(false);
      setInquiryMessage('');
      setSelectedListing(null);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed', 'Could not submit inquiry');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Page Heading */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Explore Havanah</h1>
        <p className={styles.pageSubtitle}>Search apartments, cars, and more...</p>
      </div>

      {/* Floating Search and Filter Bar */}
      <motion.div
        className={styles.filterBar}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.searchContainer}>
          {/* Search Input */}
          <div className={styles.searchBox}>
            <div className={styles.searchIconWrapper}>
              <MdSearch className={styles.searchIcon} />
            </div>
            <input
              type="text"
              placeholder="Search apartments, cars, and more..."
              value={filters.query}
              onChange={handleQueryChange}
              className={styles.searchInput}
            />
          </div>

          {/* Filter Buttons */}
          <div className={styles.filterChips}>
            <button className={styles.filterChip}>
              <span>Category</span>
              <MdExpandMore />
            </button>
            <button className={styles.filterChip}>
              <span>Location</span>
              <MdExpandMore />
            </button>
            <button className={styles.filterChip}>
              <span>Price</span>
              <MdExpandMore />
            </button>
            <button className={styles.filterChip}>
              <span>Brand</span>
              <MdExpandMore />
            </button>
            <button className={styles.applyBtn}>Apply</button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            className={styles.suggestionsDropdown}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className={styles.suggestionItem}
                onClick={() => {
                  handleFilterChange('query', suggestion);
                  setShowSuggestions(false);
                }}
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Discover Today</h2>
      </div>

      {/* Results Grid */}
      <div className={styles.grid}>
        {loading ? (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>Searching for listings...</p>
          </motion.div>
        ) : results.length === 0 ? (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>No listings match your search criteria</p>
          </motion.div>
        ) : (
          results.map((listing, index) => (
            <motion.div
              key={listing.id}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              {/* Card Image */}
              {listing.images?.[0] ? (
                <div className={styles.cardImageWrapper}>
                  <div 
                    className={styles.cardImage}
                    style={{ backgroundImage: `url(${listing.images[0]})` }}
                  />
                  <motion.button
                    className={styles.favoriteBtn}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <MdFavoriteBorder />
                  </motion.button>
                </div>
              ) : (
                <div className={styles.cardImagePlaceholder} />
              )}

              {/* Card Content */}
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{listing.title}</h3>
                <p className={styles.cardMeta}>
                  {listing.type === 'house' 
                    ? `${listing.bedrooms || 0} Bed, ${listing.bathrooms || 0} Bath`
                    : `${listing.brand || 'Vehicle'} ${listing.model || ''}`
                  }
                </p>
                <p className={styles.cardPrice}>
                  ${listing.price.toLocaleString()}
                  {listing.category === 'rent' && <span className={styles.period}>/month</span>}
                </p>

                <motion.button
                  className={styles.viewDetailsBtn}
                  onClick={() => {
                    setSelectedListing(listing);
                    setShowInquiryModal(true);
                  }}
                  whileHover={{ opacity: 1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {showInquiryModal && selectedListing && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInquiryModal(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h2 className={styles.modalTitle}>Send Inquiry</h2>
              <p className={styles.modalSubtitle}>
                Interested in <strong>{selectedListing.title}</strong>?
              </p>

              <textarea
                className={styles.inquiryInput}
                placeholder="Tell the agent why you're interested... (optional)"
                value={inquiryMessage}
                onChange={e => setInquiryMessage(e.target.value)}
                rows={5}
              />

              <div className={styles.modalActions}>
                <motion.button
                  className={styles.btnSend}
                  onClick={handleInquiry}
                  disabled={submittingInquiry}
                  whileHover={{ scale: 1.05 }}
                >
                  {submittingInquiry ? 'Sending...' : 'Send Inquiry'}
                </motion.button>
                <motion.button
                  className={styles.btnCancel}
                  onClick={() => setShowInquiryModal(false)}
                  whileHover={{ scale: 1.05 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
