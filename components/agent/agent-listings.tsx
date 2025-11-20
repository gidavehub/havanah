'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import {
  createListing,
  updateListing,
  deleteListing,
  getAgentListings,
  Listing,
} from '@/lib/firestore-service';
import styles from './agent-listings.module.css';

export default function AgentListings() {
  const { user } = useAuth();
  const toast = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'house' as 'house' | 'car',
    category: 'rent' as 'rent' | 'sale',
    price: 0,
    location: '',
    images: [] as string[],
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 0,
    brand: '',
    model: '',
    year: 0,
    mileage: 0,
  });

  // Load listings
  useEffect(() => {
    if (!user?.id) return;

    const loadListings = async () => {
      try {
        setLoading(true);
        const agentListings = await getAgentListings(user.id);
        setListings(agentListings);
      } catch (error) {
        console.error('Error loading listings:', error);
        toast.error('Failed', 'Could not load your listings');
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [user?.id, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'bedrooms' || name === 'bathrooms' || name === 'squareFeet' || name === 'year' || name === 'mileage'
        ? parseInt(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) return;

    try {
      setLoading(true);

      if (editingId) {
        // Update existing listing
        await updateListing(editingId, {
          ...formData,
          updatedAt: { toDate: () => new Date() } as any,
        });
        toast.success('Success', 'Listing updated successfully');
      } else {
        // Create new listing
        await createListing(user.id, {
          ...formData,
          status: 'active',
          views: 0,
          inquiries: 0,
        } as any);
        toast.success('Success', 'Listing created successfully');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'house',
        category: 'rent',
        price: 0,
        location: '',
        images: [],
        bedrooms: 0,
        bathrooms: 0,
        squareFeet: 0,
        brand: '',
        model: '',
        year: 0,
        mileage: 0,
      });
      setEditingId(null);
      setShowForm(false);

      // Reload listings
      const agentListings = await getAgentListings(user.id);
      setListings(agentListings);
    } catch (error) {
      console.error('Error saving listing:', error);
      toast.error('Failed', 'Could not save listing');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (listing: Listing) => {
    setFormData({
      title: listing.title,
      description: listing.description,
      type: listing.type,
      category: listing.category,
      price: listing.price,
      location: listing.location,
      images: listing.images,
      bedrooms: listing.bedrooms || 0,
      bathrooms: listing.bathrooms || 0,
      squareFeet: listing.squareFeet || 0,
      brand: listing.brand || '',
      model: listing.model || '',
      year: listing.year || 0,
      mileage: listing.mileage || 0,
    });
    setEditingId(listing.id);
    setShowForm(true);
  };

  const handleDelete = async (listingId: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        await deleteListing(listingId);
        setListings(listings.filter(l => l.id !== listingId));
        toast.success('Success', 'Listing deleted');
      } catch (error) {
        console.error('Error deleting listing:', error);
        toast.error('Failed', 'Could not delete listing');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Listings</h1>
        <motion.button
          className={styles.btnCreate}
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + New Listing
        </motion.button>
      </div>

      {showForm && (
        <motion.form
          className={styles.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Luxury Penthouse in Downtown"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="house">House</option>
                <option value="car">Car</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your property or vehicle..."
              rows={4}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Downtown, New York"
              required
            />
          </div>

          {formData.type === 'house' && (
            <>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Square Feet</label>
                  <input
                    type="number"
                    name="squareFeet"
                    value={formData.squareFeet}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </>
          )}

          {formData.type === 'car' && (
            <>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., BMW"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Model</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="e.g., M5"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Mileage</label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </>
          )}

          <div className={styles.formActions}>
            <motion.button
              type="submit"
              className={styles.btnSubmit}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
            >
              {loading ? 'Saving...' : editingId ? 'Update Listing' : 'Create Listing'}
            </motion.button>
            <motion.button
              type="button"
              className={styles.btnCancel}
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              whileHover={{ scale: 1.05 }}
            >
              Cancel
            </motion.button>
          </div>
        </motion.form>
      )}

      <div className={styles.listingsGrid}>
        {listings.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af' }}>No listings yet. Create one to get started!</p>
        ) : (
          listings.map(listing => (
            <motion.div
              key={listing.id}
              className={styles.listingCard}
              whileHover={{ y: -4 }}
            >
              <div className={styles.cardHeader}>
                <h3>{listing.title}</h3>
                <span className={`${styles.badge} ${styles[`badge--${listing.type}`]}`}>
                  {listing.type === 'car' ? '🚗' : '🏠'} {listing.type}
                </span>
              </div>

              <p className={styles.price}>${listing.price.toLocaleString()}</p>
              <p className={styles.location}>📍 {listing.location}</p>

              {listing.type === 'house' && (
                <div className={styles.details}>
                  {listing.bedrooms && <span>{listing.bedrooms} bed</span>}
                  {listing.bathrooms && <span>{listing.bathrooms} bath</span>}
                  {listing.squareFeet && <span>{listing.squareFeet} sqft</span>}
                </div>
              )}

              {listing.type === 'car' && (
                <div className={styles.details}>
                  {listing.brand && <span>{listing.brand} {listing.model}</span>}
                  {listing.year && <span>{listing.year}</span>}
                  {listing.mileage && <span>{listing.mileage} mi</span>}
                </div>
              )}

              <div className={styles.stats}>
                <span>👁️ {listing.views} views</span>
                <span>💬 {listing.inquiries} inquiries</span>
              </div>

              <div className={styles.cardActions}>
                <motion.button
                  className={styles.btnEdit}
                  onClick={() => handleEdit(listing)}
                  whileHover={{ scale: 1.05 }}
                >
                  Edit
                </motion.button>
                <motion.button
                  className={styles.btnDelete}
                  onClick={() => handleDelete(listing.id)}
                  whileHover={{ scale: 1.05 }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
