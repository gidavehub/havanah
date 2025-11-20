'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import styles from './advanced-search.module.css';

interface SearchResult {
  id: string;
  title: string;
  type: 'apartment' | 'house' | 'car';
  relevance: number;
  matchedFields: string[];
}

interface SearchFilters {
  query: string;
  type?: 'apartment' | 'house' | 'car';
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  amenities?: string[];
}

interface ListingData {
  id: string;
  title: string;
  description: string;
  type: 'apartment' | 'house' | 'car';
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  amenities?: string[];
  brand?: string;
  model?: string;
  year?: number;
  tags: string[];
}

// Mock data - Replace with Firestore
const mockListings: ListingData[] = [
  {
    id: '1',
    title: 'Luxury Penthouse in Downtown',
    description: 'Beautiful penthouse with city views, modern kitchen, smart home automation',
    type: 'apartment',
    price: 5000,
    bedrooms: 3,
    bathrooms: 2,
    area: 2500,
    amenities: ['gym', 'pool', 'parking', 'security', 'balcony'],
    tags: ['luxury', 'downtown', 'penthouse', 'modern', 'smart'],
  },
  {
    id: '2',
    title: 'Cozy Studio Apartment',
    description: 'Perfect starter apartment with great location near transit',
    type: 'apartment',
    price: 1200,
    bedrooms: 0,
    bathrooms: 1,
    area: 450,
    amenities: ['parking', 'furnished'],
    tags: ['studio', 'affordable', 'transit', 'furnished'],
  },
  {
    id: '3',
    title: 'Family House with Garden',
    description: 'Spacious family home with backyard, perfect for kids',
    type: 'house',
    price: 3000,
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    amenities: ['garden', 'patio', 'garage', 'pool'],
    tags: ['family', 'spacious', 'garden', 'backyard'],
  },
  {
    id: '4',
    title: 'BMW M5 Luxury Sports Car',
    description: 'High-performance luxury sedan, perfect for special occasions',
    type: 'car',
    price: 250,
    brand: 'BMW',
    model: 'M5',
    year: 2023,
    amenities: ['leather', 'navigation', 'premium-sound'],
    tags: ['luxury', 'sports', 'bmw', 'performance', 'high-end'],
  },
];

// Scoring algorithm
const calculateRelevance = (listing: ListingData, filters: SearchFilters): number => {
  let score = 0;

  // Query matching (40% weight)
  if (filters.query) {
    const query = filters.query.toLowerCase();
    const titleMatch = listing.title.toLowerCase().includes(query) ? 10 : 0;
    const descMatch = listing.description.toLowerCase().includes(query) ? 5 : 0;
    const tagsMatch = listing.tags.some((tag) => tag.includes(query)) ? 8 : 0;
    score += titleMatch + descMatch + tagsMatch;
  }

  // Type matching (15% weight)
  if (filters.type && listing.type === filters.type) {
    score += 15;
  }

  // Price range matching (20% weight)
  if (filters.priceMin && filters.priceMax) {
    const midPrice = (filters.priceMin + filters.priceMax) / 2;
    const priceDiff = Math.abs(listing.price - midPrice);
    const priceRange = filters.priceMax - filters.priceMin;
    if (priceDiff <= priceRange / 2) {
      score += 20 - (priceDiff / priceRange) * 20;
    }
  } else if (filters.priceMin && listing.price >= filters.priceMin) {
    score += 10;
  } else if (filters.priceMax && listing.price <= filters.priceMax) {
    score += 10;
  }

  // Amenities matching (15% weight)
  if (filters.amenities && listing.amenities) {
    const matchedAmenities = filters.amenities.filter((a) =>
      listing.amenities?.includes(a)
    ).length;
    score += (matchedAmenities / filters.amenities.length) * 15;
  }

  // Property-specific matching (10% weight)
  if (listing.type === 'apartment' || listing.type === 'house') {
    if (filters.bedrooms && listing.bedrooms === filters.bedrooms) {
      score += 5;
    }
    if (filters.bathrooms && listing.bathrooms === filters.bathrooms) {
      score += 5;
    }
    if (filters.area && listing.area) {
      const areaDiff = Math.abs(listing.area - filters.area);
      if (areaDiff < listing.area * 0.2) {
        score += 5;
      }
    }
  }

  return Math.min(100, Math.max(0, score));
};

const getMatchedFields = (listing: ListingData, filters: SearchFilters): string[] => {
  const fields: string[] = [];

  if (filters.query && listing.title.toLowerCase().includes(filters.query.toLowerCase())) {
    fields.push('title');
  }
  if (filters.type && listing.type === filters.type) {
    fields.push('type');
  }
  if (filters.priceMin && filters.priceMax) {
    if (listing.price >= filters.priceMin && listing.price <= filters.priceMax) {
      fields.push('price');
    }
  }

  return fields;
};

export default function AdvancedSearch() {
  const [filters, setFilters] = useState<SearchFilters>({ query: '' });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search
  const performSearch = useCallback((searchFilters: SearchFilters) => {
    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      let searchResults = mockListings
        .map((listing) => ({
          id: listing.id,
          title: listing.title,
          type: listing.type,
          relevance: calculateRelevance(listing, searchFilters),
          matchedFields: getMatchedFields(listing, searchFilters),
        }))
        .filter((r) => r.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance);

      setResults(searchResults);
      setIsSearching(false);
    }, 300);
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.query || filters.type || filters.priceMin || filters.priceMax) {
        performSearch(filters);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, performSearch]);

  // Generate suggestions based on query
  useEffect(() => {
    if (!filters.query) {
      setSuggestions([]);
      return;
    }

    const query = filters.query.toLowerCase();
    const allTags = new Set<string>();

    mockListings.forEach((listing) => {
      listing.tags.forEach((tag) => {
        if (tag.includes(query)) {
          allTags.add(tag);
        }
      });
      if (listing.title.toLowerCase().includes(query)) {
        allTags.add(listing.title);
      }
    });

    setSuggestions(Array.from(allTags).slice(0, 5));
  }, [filters.query]);

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.searchBox}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.searchInputWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search apartments, houses, cars..."
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          />
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <motion.div
            className={styles.suggestionsDropdown}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {suggestions.map((suggestion, idx) => (
              <motion.button
                key={suggestion}
                className={styles.suggestionItem}
                onClick={() => setFilters({ ...filters, query: suggestion })}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Filter Controls */}
      <motion.div
        className={styles.filterControls}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className={styles.filterGroup}>
          <label>Type</label>
          <select
            value={filters.type || ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                type: (e.target.value as any) || undefined,
              })
            }
            className={styles.select}
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="car">Car</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Price Range</label>
          <div className={styles.rangeInputs}>
            <input
              type="number"
              placeholder="Min"
              value={filters.priceMin || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priceMin: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className={styles.numberInput}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceMax || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priceMax: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className={styles.numberInput}
            />
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label>Bedrooms</label>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="Any"
            value={filters.bedrooms || ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                bedrooms: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            className={styles.numberInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Bathrooms</label>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="Any"
            value={filters.bathrooms || ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                bathrooms: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            className={styles.numberInput}
          />
        </div>

        <motion.button
          className={styles.clearBtn}
          onClick={() => setFilters({ query: '' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Clear Filters
        </motion.button>
      </motion.div>

      {/* Results */}
      <div className={styles.results}>
        {isSearching && (
          <motion.div
            className={styles.loading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={styles.spinner} />
            <p>Searching...</p>
          </motion.div>
        )}

        {!isSearching && results.length === 0 && filters.query && (
          <motion.div
            className={styles.noResults}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className={styles.emptyIcon}>🔍</span>
            <p>No listings found. Try different keywords.</p>
          </motion.div>
        )}

        {!isSearching && results.length > 0 && (
          <motion.div
            className={styles.resultsList}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className={styles.resultCount}>
              Found {results.length} {results.length === 1 ? 'result' : 'results'}
            </p>
            {results.map((result, idx) => (
              <motion.div
                key={result.id}
                className={styles.resultItem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ x: 4 }}
              >
                <div className={styles.resultContent}>
                  <h3 className={styles.resultTitle}>{result.title}</h3>
                  <div className={styles.resultMeta}>
                    <span className={styles.typeBadge}>{result.type}</span>
                    <span className={styles.relevanceScore}>
                      {Math.round(result.relevance)}% match
                    </span>
                  </div>
                </div>
                <motion.button
                  className={styles.viewBtn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
