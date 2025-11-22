'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MdFavoriteBorder, MdFavorite, MdLocationOn, MdBed, MdBathtub, MdElectricCar } from 'react-icons/md';
import styles from './listing-card.module.css';

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    price: number;
    location: string;
    images: string[];
    type: 'house' | 'car';
    category: 'rent' | 'sale';
    bedrooms?: number;
    bathrooms?: number;
    brand?: string;
    model?: string;
    year?: number;
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const imageUrl = listing.images?.[0] || '/placeholder.png';

  const isHouse = listing.type === 'house';
  const isRent = listing.category === 'rent';

  return (
    <Link href={`/explore/${listing.id}`}>
      <motion.div
        className={styles.card}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image Container */}
        <div className={styles.imageContainer}>
          <img 
            src={imageUrl} 
            alt={listing.title}
            className={styles.image}
            onError={(e) => {
              e.currentTarget.src = '/placeholder.png';
            }}
          />
          <div className={styles.overlay} />
          
          {/* Category Badge */}
          <div className={styles.categoryBadge}>
            {isRent ? 'For Rent' : 'For Sale'}
          </div>

          {/* Favorite Button */}
          <motion.button
            className={styles.favoriteBtn}
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isFavorite ? 
              <MdFavorite className="w-5 h-5 text-red-500" /> :
              <MdFavoriteBorder className="w-5 h-5 text-white" />
            }
          </motion.button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <h3 className={styles.title}>{listing.title}</h3>
          
          <div className={styles.location}>
            <MdLocationOn className="w-4 h-4" />
            <span>{listing.location}</span>
          </div>

          {/* Features */}
          <div className={styles.features}>
            {isHouse ? (
              <>
                {listing.bedrooms && (
                  <div className={styles.feature}>
                    <MdBed className="w-4 h-4" />
                    <span>{listing.bedrooms} Bed</span>
                  </div>
                )}
                {listing.bathrooms && (
                  <div className={styles.feature}>
                    <MdBathtub className="w-4 h-4" />
                    <span>{listing.bathrooms} Bath</span>
                  </div>
                )}
              </>
            ) : (
              <>
                {listing.brand && (
                  <div className={styles.feature}>
                    <MdElectricCar className="w-4 h-4" />
                    <span>{listing.brand} {listing.model}</span>
                  </div>
                )}
                {listing.year && (
                  <div className={styles.feature}>
                    <span>{listing.year}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Price Footer */}
          <div className={styles.footer}>
            <div className={styles.price}>
              <span className={styles.amount}>${listing.price}</span>
              <span className={styles.unit}>{isRent ? '/month' : 'total'}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
