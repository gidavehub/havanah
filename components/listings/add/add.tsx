'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  MdCloudUpload, 
  MdDelete, 
  MdHome, 
  MdDirectionsCar,
  MdAttachMoney,
  MdDescription,
  MdLocationOn,
  MdSave
} from 'react-icons/md';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { 
  collection, 
  addDoc, 
  Timestamp 
} from 'firebase/firestore';
import { getStorageInstance, getFirestoreInstance } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import styles from './add-listing.module.css';

interface FormData {
  title: string;
  description: string;
  price: string;
  location: string;
  type: 'house' | 'car';
  category: 'rent' | 'sale';
  // House specific
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  // Car specific
  brand: string;
  model: string;
  year: string;
  mileage: string;
}

const INITIAL_DATA: FormData = {
  title: '',
  description: '',
  price: '',
  location: '',
  type: 'house',
  category: 'rent',
  bedrooms: '',
  bathrooms: '',
  sqft: '',
  brand: '',
  model: '',
  year: '',
  mileage: ''
};

export default function AddListingForm() {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type: 'house' | 'car') => {
    setData(prev => ({ ...prev, type }));
  };

  // --- Image Handling ---

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files: File[]) => {
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length + images.length > 5) {
      toast.warning("Limit Reached", "You can only upload up to 5 images.");
      return;
    }

    setImages(prev => [...prev, ...validFiles]);

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      // Revoke URL to avoid memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  // --- Submission ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error("Auth Error", "You must be logged in.");
      return;
    }

    if (!data.title || !data.price || !data.location) {
      toast.error("Validation Error", "Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Uploading", "Creating your listing...");

    try {
      // 1. Upload Images
      const storage = getStorageInstance();
      const imageUrls: string[] = [];

      for (const image of images) {
        const storageRef = ref(storage, `listings/${user.id}/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      // 2. Save to Firestore
      const db = getFirestoreInstance();
      const listingData = {
        agentId: user.id,
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        location: data.location,
        type: data.type,
        category: data.category,
        status: 'active',
        images: imageUrls,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        views: 0,
        // Conditional fields
        ...(data.type === 'house' ? {
          bedrooms: parseInt(data.bedrooms) || 0,
          bathrooms: parseInt(data.bathrooms) || 0,
          squareFeet: parseInt(data.sqft) || 0,
        } : {
          brand: data.brand,
          model: data.model,
          year: parseInt(data.year) || new Date().getFullYear(),
          mileage: parseInt(data.mileage) || 0,
        })
      };

      await addDoc(collection(db, 'listings'), listingData);

      toast.remove(toastId);
      toast.success("Success!", "Listing published successfully.");
      router.push('/agent/dashboard');

    } catch (error) {
      console.error(error);
      toast.remove(toastId);
      toast.error("Error", "Failed to publish listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2>Create New Listing</h2>
          <p>Fill in the details below to publish your property or vehicle.</p>
        </div>

        {/* Type Selection */}
        <div className={styles.typeSelection}>
          <div 
            className={`${styles.typeOption} ${data.type === 'house' ? styles.active : ''}`}
            onClick={() => handleTypeSelect('house')}
          >
            <MdHome className={styles.typeIcon} />
            <span>Real Estate</span>
          </div>
          <div 
            className={`${styles.typeOption} ${data.type === 'car' ? styles.active : ''}`}
            onClick={() => handleTypeSelect('car')}
          >
            <MdDirectionsCar className={styles.typeIcon} />
            <span>Vehicle</span>
          </div>
        </div>

        {/* Image Upload */}
        <div className={styles.section}>
          <label>Photos (Max 5)</label>
          <div 
            className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleImageChange}
              hidden 
            />
            <MdCloudUpload className={styles.uploadIcon} />
            <p>Drag & drop images here, or click to browse</p>
          </div>

          {previews.length > 0 && (
            <div className={styles.previewGrid}>
              {previews.map((url, index) => (
                <motion.div 
                  key={index} 
                  className={styles.previewItem}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <img src={url} alt={`Preview ${index}`} />
                  <button type="button" onClick={() => removeImage(index)}>
                    <MdDelete />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className={styles.gridSection}>
          <div className={styles.inputGroup}>
            <label><MdDescription /> Title</label>
            <input 
              type="text" 
              name="title" 
              placeholder="e.g. Modern Downtown Apartment" 
              value={data.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label><MdAttachMoney /> Price</label>
            <input 
              type="number" 
              name="price" 
              placeholder="0.00" 
              value={data.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label><MdLocationOn /> Location</label>
            <input 
              type="text" 
              name="location" 
              placeholder="City, State or Address" 
              value={data.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Category</label>
            <select name="category" value={data.category} onChange={handleChange}>
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
            </select>
          </div>
        </div>

        {/* Conditional Fields - House */}
        {data.type === 'house' && (
          <div className={styles.gridSection}>
            <div className={styles.inputGroup}>
              <label>Bedrooms</label>
              <input type="number" name="bedrooms" value={data.bedrooms} onChange={handleChange} />
            </div>
            <div className={styles.inputGroup}>
              <label>Bathrooms</label>
              <input type="number" name="bathrooms" value={data.bathrooms} onChange={handleChange} />
            </div>
            <div className={styles.inputGroup}>
              <label>Square Ft</label>
              <input type="number" name="sqft" value={data.sqft} onChange={handleChange} />
            </div>
          </div>
        )}

        {/* Conditional Fields - Car */}
        {data.type === 'car' && (
          <div className={styles.gridSection}>
            <div className={styles.inputGroup}>
              <label>Brand</label>
              <input type="text" name="brand" placeholder="e.g. BMW" value={data.brand} onChange={handleChange} />
            </div>
            <div className={styles.inputGroup}>
              <label>Model</label>
              <input type="text" name="model" placeholder="e.g. M5 Competition" value={data.model} onChange={handleChange} />
            </div>
            <div className={styles.inputGroup}>
              <label>Year</label>
              <input type="number" name="year" placeholder="2024" value={data.year} onChange={handleChange} />
            </div>
            <div className={styles.inputGroup}>
              <label>Mileage</label>
              <input type="number" name="mileage" placeholder="0" value={data.mileage} onChange={handleChange} />
            </div>
          </div>
        )}

        {/* Description */}
        <div className={styles.inputGroup}>
          <label>Description</label>
          <textarea 
            name="description" 
            rows={5} 
            placeholder="Describe the features and condition..."
            value={data.description}
            onChange={handleChange}
          />
        </div>

        {/* Submit */}
        <div className={styles.footer}>
          <button 
            type="button" 
            className={styles.cancelBtn}
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : (
              <>
                <MdSave /> Publish Listing
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
}