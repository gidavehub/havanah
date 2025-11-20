'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import { advancedSearchListings, createInquiry, Listing } from '@/lib/firestore-service';
import { useInquiryNotification } from '@/lib/notification-hooks';
import { sendNotification } from '@/lib/realtime-service';
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
    const timer = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(timer);
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
      {/* Search Section */}
      <motion.div
        className={styles.filtersSection}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className={styles.filtersTitle}>Explore Listings</h2>

        {/* Search Box */}
        <div className={styles.searchWrapper}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search properties, cars, locations..."
              value={filters.query}
              onChange={handleQueryChange}
              className={styles.searchInput}
            />
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
        </div>

        {/* Filter Grid */}
        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <label>Type</label>
            <select
              value={filters.type || 'all'}
              onChange={e => handleFilterChange('type', e.target.value === 'all' ? undefined : e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Types</option>
              <option value="house">Houses</option>
              <option value="car">Cars</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Category</label>
            <select
              value={filters.category || 'all'}
              onChange={e => handleFilterChange('category', e.target.value === 'all' ? undefined : e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Categories</option>
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Min Price</label>
            <input
              type="number"
              value={filters.priceMin || ''}
              onChange={e => handleFilterChange('priceMin', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="0"
              className={styles.filterInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Max Price</label>
            <input
              type="number"
              value={filters.priceMax || ''}
              onChange={e => handleFilterChange('priceMax', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="1,000,000"
              className={styles.filterInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Bedrooms</label>
            <input
              type="number"
              value={filters.bedrooms || ''}
              onChange={e => handleFilterChange('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Any"
              className={styles.filterInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Bathrooms</label>
            <input
              type="number"
              value={filters.bathrooms || ''}
              onChange={e => handleFilterChange('bathrooms', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Any"
              className={styles.filterInput}
            />
          </div>

          <motion.button
            className={styles.clearBtn}
            onClick={handleClearFilters}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Filters
          </motion.button>
        </div>
      </motion.div>

      {/* Results Section */}
      <div className={styles.listingsSection}>
        <h2 className={styles.resultCount}>
          {loading ? 'Searching...' : `${results.length} Results Found`}
        </h2>

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
                whileHover={{ y: -8 }}
              >
                {listing.images?.[0] && (
                  <div className={styles.cardImage}>
                    <img src={listing.images[0]} alt={listing.title} />
                    <span className={`${styles.badge} ${styles[`badge--${listing.type}`]}`}>
                      {listing.type === 'car' ? 'Car' : 'Home'}
                    </span>
                    <div className={styles.relevanceBadge}>
                      {Math.round(listing.relevance)}% match
                    </div>
                  </div>
                )}

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{listing.title}</h3>
                  <p className={styles.location}>{listing.location}</p>

                  <p className={styles.description}>
                    {listing.description.substring(0, 80)}...
                  </p>

                  {listing.type === 'house' && (
                    <div className={styles.details}>
                      {listing.bedrooms && <span>{listing.bedrooms} Bed</span>}
                      {listing.bathrooms && <span>{listing.bathrooms} Bath</span>}
                      {listing.squareFeet && <span>{listing.squareFeet} sqft</span>}
                    </div>
                  )}

                  {listing.type === 'car' && (
                    <div className={styles.details}>
                      {listing.brand && <span>{listing.brand} {listing.model}</span>}
                      {listing.year && <span>{listing.year}</span>}
                    </div>
                  )}

                  <div className={styles.cardFooter}>
                    <span className={styles.price}>${listing.price.toLocaleString()}</span>
                    <span className={`${styles.categoryBadge} ${styles[`cat--${listing.category}`]}`}>
                      {listing.category === 'rent' ? 'Rent' : 'Sale'}
                    </span>
                  </div>

                  <motion.button
                    className={styles.inquireBtn}
                    onClick={() => {
                      setSelectedListing(listing);
                      setShowInquiryModal(true);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Send Inquiry
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>
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
