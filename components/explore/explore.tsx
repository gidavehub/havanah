'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/navbar/navbar';
import { 
  MdSearch, 
  MdFilterList, 
  MdClose, 
  MdFavoriteBorder, 
  MdDirectionsCar, 
  MdHome, 
  MdBed, 
  MdBathtub, 
  MdAspectRatio,
  MdCalendarToday,
  MdArrowForward
} from 'react-icons/md';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import { advancedSearchListings, createInquiry, Listing } from '@/lib/firestore-service';
import { useInquiryNotification } from '@/lib/notification-hooks';
import { sendNotification } from '@/lib/realtime-service';
import styles from './explore.module.css';

// Types based on Firestore schema
interface SearchFilters {
  query: string;
  type?: 'house' | 'car';
  category?: 'rent' | 'sale';
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
}

interface SearchResult extends Listing {
  relevance?: number;
}

export default function ExplorePage() {
  const { user } = useAuth();
  const toast = useToast();
  
  // Listen for incoming inquiries (if user is an agent)
  useInquiryNotification();

  // State
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Inquiry Modal State
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  
  // Search Suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filters
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: undefined,
    category: undefined,
    priceMin: undefined,
    priceMax: undefined,
  });

  // Debounced Search Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  const performSearch = async () => {
    try {
      setLoading(true);
      // Real Firestore search algorithm
      const searchResults = await advancedSearchListings(filters.query, filters);
      setResults(searchResults);
      
      // Generate unique suggestions from real data
      if (filters.query) {
        const uniqueTitles = Array.from(new Set(searchResults.map(r => r.title)));
        setSuggestions(uniqueTitles.slice(0, 5));
      }
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Search failed', 'Could not retrieve listings.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
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
      toast.error('Login Required', 'Please log in to send an inquiry.');
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
        inquiryMessage || `I am interested in this ${selectedListing.type}.`,
        user.phoneNumber
      );

      // Send Realtime Notification to Agent
      await sendNotification(selectedListing.agentId, {
        userId: selectedListing.agentId,
        type: 'inquiry',
        title: 'New Inquiry Received',
        message: `${user.displayName || 'A user'} is interested in "${selectedListing.title}"`,
        data: {
          inquiryId,
          listingId: selectedListing.id,
          userId: user.id,
        },
        read: false,
      });

      toast.success('Sent!', 'Your inquiry has been sent to the agent.');
      setShowInquiryModal(false);
      setInquiryMessage('');
      setSelectedListing(null);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed', 'Could not submit inquiry. Try again later.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Explore Havanah</h1>
        <p className={styles.pageSubtitle}>Find your dream home or perfect drive.</p>
      </div>

      {/* Sticky Filter Bar */}
      <motion.div 
        className={styles.filterBar}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <div className={styles.searchIconWrapper}>
              <MdSearch className={styles.searchIcon} />
            </div>
            <input
              type="text"
              placeholder="Search apartments, cars, models..."
              value={filters.query}
              onChange={handleQueryChange}
              onFocus={() => setShowSuggestions(true)}
              className={styles.searchInput}
            />
          </div>
          
          {/* Quick Filter Toggles */}
          <div className={styles.filterChips}>
            <button 
              className={`${styles.filterChip} ${filters.type === 'house' ? styles.activeChip : ''}`}
              onClick={() => handleFilterChange('type', filters.type === 'house' ? undefined : 'house')}
            >
              <MdHome /> Homes
            </button>
            <button 
              className={`${styles.filterChip} ${filters.type === 'car' ? styles.activeChip : ''}`}
              onClick={() => handleFilterChange('type', filters.type === 'car' ? undefined : 'car')}
            >
              <MdDirectionsCar /> Cars
            </button>
            
            {/* Mobile/Expanded Filter Toggle */}
            <button 
              className={styles.filterChip}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <MdFilterList /> Filters
            </button>

            {Object.values(filters).some(v => v !== undefined && v !== '') && (
              <button className={styles.applyBtn} onClick={handleClearFilters}>
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              className={styles.suggestionsDropdown}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
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
                  <MdSearch style={{ marginRight: 8, color: '#89cff0' }} />
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded Filters Area */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              className={styles.expandedFilters}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className={styles.filterGrid}>
                <div className={styles.filterGroup}>
                  <label>Category</label>
                  <select
                    value={filters.category || ''}
                    onChange={e => handleFilterChange('category', e.target.value || undefined)}
                    className={styles.filterSelect}
                  >
                    <option value="">All</option>
                    <option value="rent">For Rent</option>
                    <option value="sale">For Sale</option>
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <label>Min Price</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    className={styles.filterInput}
                    value={filters.priceMin || ''}
                    onChange={e => handleFilterChange('priceMin', Number(e.target.value) || undefined)}
                  />
                </div>
                <div className={styles.filterGroup}>
                  <label>Max Price</label>
                  <input 
                    type="number" 
                    placeholder="Any" 
                    className={styles.filterInput}
                    value={filters.priceMax || ''}
                    onChange={e => handleFilterChange('priceMax', Number(e.target.value) || undefined)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {loading ? 'Searching...' : `${results.length} Results Found`}
        </h2>
      </div>

      {/* Results Grid */}
      <div className={styles.grid}>
        {loading ? (
           // Simple Loading State
           Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`${styles.card} ${styles.loadingCard}`}>
              <div className={styles.cardImagePlaceholder} style={{ opacity: 0.5, animation: 'pulse 1.5s infinite' }} />
              <div className={styles.cardContent}>
                <div style={{ height: 20, background: 'rgba(0,0,0,0.05)', marginBottom: 10, borderRadius: 4 }} />
                <div style={{ height: 15, width: '60%', background: 'rgba(0,0,0,0.05)', borderRadius: 4 }} />
              </div>
            </div>
          ))
        ) : results.length === 0 ? (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <MdSearch size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
            <p>No listings found matching your criteria.</p>
            <button className={styles.applyBtn} onClick={handleClearFilters} style={{ marginTop: 16 }}>
              Clear all filters
            </button>
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
              <div className={styles.cardImageWrapper}>
                {listing.images?.[0] ? (
                  <div 
                    className={styles.cardImage}
                    style={{ backgroundImage: `url(${listing.images[0]})` }}
                  />
                ) : (
                  <div className={styles.cardImagePlaceholder} />
                )}
                
                <button className={styles.favoriteBtn}>
                  <MdFavoriteBorder />
                </button>

                <div className={styles.badgesContainer}>
                  <span className={`${styles.badge} ${styles[`badge--${listing.type}`]}`}>
                    {listing.type === 'car' ? <MdDirectionsCar /> : <MdHome />}
                    {listing.type === 'car' ? 'Car' : 'Home'}
                  </span>
                </div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{listing.title}</h3>
                  <p className={styles.cardMeta}>{listing.location || 'Location available on request'}</p>
                </div>

                {/* Conditional Details based on Type */}
                <div className={styles.featuresRow}>
                  {listing.type === 'house' && (
                    <>
                      {listing.bedrooms && (
                        <span className={styles.feature}>
                          <MdBed /> {listing.bedrooms}
                        </span>
                      )}
                      {listing.bathrooms && (
                        <span className={styles.feature}>
                          <MdBathtub /> {listing.bathrooms}
                        </span>
                      )}
                      {listing.squareFeet && (
                        <span className={styles.feature}>
                          <MdAspectRatio /> {listing.squareFeet}sqft
                        </span>
                      )}
                    </>
                  )}
                  {listing.type === 'car' && (
                    <>
                      {listing.year && (
                        <span className={styles.feature}>
                          <MdCalendarToday /> {listing.year}
                        </span>
                      )}
                      {listing.brand && (
                        <span className={styles.feature}>
                          {listing.brand}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.priceWrapper}>
                    <span className={styles.cardPrice}>${listing.price.toLocaleString()}</span>
                    {listing.category === 'rent' && <span className={styles.period}>/mo</span>}
                  </div>
                  
                  <motion.button
                    className={styles.viewDetailsBtn}
                    onClick={() => {
                      setSelectedListing(listing);
                      setShowInquiryModal(true);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View <MdArrowForward />
                  </motion.button>
                </div>
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
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h2 className={styles.modalTitle}>Send Inquiry</h2>
                  <p className={styles.modalSubtitle}>
                    Contact agent about <strong>{selectedListing.title}</strong>
                  </p>
                </div>
                <button className={styles.closeBtn} onClick={() => setShowInquiryModal(false)}>
                  <MdClose />
                </button>
              </div>

              <textarea
                className={styles.inquiryInput}
                placeholder="Hi, I am interested in this listing. Is it still available?"
                value={inquiryMessage}
                onChange={e => setInquiryMessage(e.target.value)}
                rows={5}
                disabled={submittingInquiry}
              />

              <div className={styles.modalActions}>
                <motion.button
                  className={styles.btnSend}
                  onClick={handleInquiry}
                  disabled={submittingInquiry}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {submittingInquiry ? (
                    'Sending...' 
                  ) : (
                    <>Send Inquiry <MdArrowForward /></>
                  )}
                </motion.button>
                <button
                  className={styles.btnCancel}
                  onClick={() => setShowInquiryModal(false)}
                  disabled={submittingInquiry}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </>
  );
}