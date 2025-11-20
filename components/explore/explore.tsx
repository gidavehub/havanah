'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import {
  getAllListings,
  createInquiry,
  Listing,
} from '@/lib/firestore-service';
import { useInquiryNotification } from '@/lib/notification-hooks';
import styles from './explore.module.css';

interface FilterOptions {
  type: 'all' | 'house' | 'car';
  category: 'all' | 'rent' | 'sale';
  priceMin: number;
  priceMax: number;
  searchQuery: string;
}

const mockListings: any[] = [
  {
    id: '1',
    title: 'Luxury Penthouse',
    price: 5000,
    priceType: 'month',
    category: 'house',
    listingType: 'rent',
    location: 'Downtown, City',
    image: '/placeholder-house.jpg',
    rating: 4.8,
    reviews: 128,
    details: { bedrooms: 3, bathrooms: 2, area: 2500 },
  },
  {
    id: '2',
    title: 'Modern Apartment',
    price: 2500,
    priceType: 'month',
    category: 'house',
    listingType: 'rent',
    location: 'Midtown, City',
    image: '/placeholder-house.jpg',
    rating: 4.6,
    reviews: 95,
    details: { bedrooms: 2, bathrooms: 1, area: 1200 },
  },
  {
    id: '3',
    title: 'BMW M5',
    price: 150,
    priceType: 'day',
    category: 'car',
    listingType: 'rent',
    location: 'Central Station',
    image: '/placeholder-car.jpg',
    rating: 4.9,
    reviews: 200,
    details: { brand: 'BMW', model: 'M5' },
  },
  {
    id: '4',
    title: 'Tesla Model S',
    price: 120,
    priceType: 'day',
    category: 'car',
    listingType: 'rent',
    location: 'Airport',
    image: '/placeholder-car.jpg',
    rating: 4.7,
    reviews: 180,
    details: { brand: 'Tesla', model: 'Model S' },
  },
  {
    id: '5',
    title: 'Beachfront Villa',
    price: 450000,
    priceType: 'sale',
    category: 'house',
    listingType: 'sale',
    location: 'Beach Area, City',
    image: '/placeholder-house.jpg',
    rating: 4.9,
    reviews: 45,
    details: { bedrooms: 4, bathrooms: 3, area: 3500 },
  },
  {
    id: '6',
    title: 'Range Rover Sport',
    price: 200,
    priceType: 'day',
    category: 'car',
    listingType: 'rent',
    location: 'Downtown',
    image: '/placeholder-car.jpg',
    rating: 4.8,
    reviews: 160,
    details: { brand: 'Range Rover', model: 'Sport' },
  },
];

export default function ExplorePage() {
  const { user } = useAuth();
  const toast = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // Set up inquiry notifications
  useInquiryNotification();

  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    category: 'all',
    priceMin: 0,
    priceMax: 10000000,
    searchQuery: '',
  });

  // Load listings from Firestore
  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        const allListings = await getAllListings();
        setListings(allListings);
        applyFilters(allListings, filters);
      } catch (error) {
        console.error('Error loading listings:', error);
        toast.error('Failed', 'Could not load listings');
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [toast]);

  const applyFilters = (listingsToFilter: Listing[], filterOptions: FilterOptions) => {
    let filtered = listingsToFilter;

    if (filterOptions.type !== 'all') {
      filtered = filtered.filter(l => l.type === filterOptions.type);
    }

    if (filterOptions.category !== 'all') {
      filtered = filtered.filter(l => l.category === filterOptions.category);
    }

    filtered = filtered.filter(
      l => l.price >= filterOptions.priceMin && l.price <= filterOptions.priceMax
    );

    if (filterOptions.searchQuery) {
      const query = filterOptions.searchQuery.toLowerCase();
      filtered = filtered.filter(
        l =>
          l.title.toLowerCase().includes(query) ||
          l.description.toLowerCase().includes(query) ||
          l.location.toLowerCase().includes(query)
      );
    }

    setFilteredListings(filtered);
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    applyFilters(listings, updatedFilters);
  };

  const handleInquiry = async () => {
    if (!user?.id || !user?.email) {
      toast.error('Error', 'Please log in first');
      return;
    }

    if (!selectedListing) return;

    try {
      setSubmittingInquiry(true);
      await createInquiry(
        selectedListing.id,
        selectedListing.agentId,
        selectedListing.title,
        user.id,
        user.name || 'Customer',
        user.email,
        inquiryMessage || 'I am interested in this listing',
        user.phone
      );
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
  }

  return (
    <div className={styles.container}>
      {/* Filters Section */}
      <motion.div
        className={styles.filtersSection}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className={styles.filtersTitle}>Search & Filter</h2>

        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <label>Type</label>
            <select
              value={filters.type}
              onChange={e => handleFilterChange({ type: e.target.value as any })}
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
              value={filters.category}
              onChange={e => handleFilterChange({ category: e.target.value as any })}
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
              value={filters.priceMin}
              onChange={e => handleFilterChange({ priceMin: parseInt(e.target.value) || 0 })}
              className={styles.filterInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Max Price</label>
            <input
              type="number"
              value={filters.priceMax}
              onChange={e => handleFilterChange({ priceMax: parseInt(e.target.value) || 10000000 })}
              className={styles.filterInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Search</label>
            <input
              type="text"
              placeholder="Search by title, location..."
              value={filters.searchQuery}
              onChange={e => handleFilterChange({ searchQuery: e.target.value })}
              className={styles.filterInput}
            />
          </div>
        </div>
      </motion.div>

      {/* Listings Section */}
      <div className={styles.listingsSection}>
        <h2 className={styles.resultCount}>
          {loading ? 'Loading...' : `${filteredListings.length} Results`}
        </h2>

        <div className={styles.grid}>
          {filteredListings.length === 0 ? (
            <motion.div
              className={styles.emptyState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>No listings match your criteria</p>
            </motion.div>
          ) : (
            filteredListings.map((listing, index) => (
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
                      {listing.type === 'car' ? '🚗' : '🏠'}
                    </span>
                  </div>
                )}

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{listing.title}</h3>
                  <p className={styles.location}>📍 {listing.location}</p>

                  <p className={styles.description}>
                    {listing.description.substring(0, 80)}...
                  </p>

                  {listing.type === 'house' && (
                    <div className={styles.details}>
                      {listing.bedrooms && <span>🛏️ {listing.bedrooms}</span>}
                      {listing.bathrooms && <span>🚿 {listing.bathrooms}</span>}
                      {listing.squareFeet && <span>📐 {listing.squareFeet} sqft</span>}
                    </div>
                  )}

                  {listing.type === 'car' && (
                    <div className={styles.details}>
                      {listing.brand && <span>🚗 {listing.brand} {listing.model}</span>}
                      {listing.year && <span>📅 {listing.year}</span>}
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
      {showInquiryModal && selectedListing && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowInquiryModal(false)}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
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
    </div>
  );
}
