'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MdVerified, 
  MdTimer, 
  MdStar, 
  MdTrendingUp,
  MdApartment,
  MdDirectionsCar,
  MdArrowForward
} from 'react-icons/md';
import Navbar from '@/components/layout/navbar/navbar';
import { getAllListings } from '@/lib/firestore-service';
import styles from './landing.module.css';
import ListingCard from '@/components/landing/listing-card';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <MdVerified className={styles.featureIconLarge} />,
    title: 'Verified Listings',
    description: 'All properties and vehicles are verified for your safety',
  },
  {
    icon: <MdTimer className={styles.featureIconLarge} />,
    title: 'Instant Booking',
    description: 'Book apartments and cars in just a few clicks',
  },
  {
    icon: <MdStar className={styles.featureIconLarge} />,
    title: 'Quality Service',
    description: 'Top-rated hosts and car owners with excellent reviews',
  },
  {
    icon: <MdTrendingUp className={styles.featureIconLarge} />,
    title: 'Best Prices',
    description: 'Competitive rates with transparent pricing',
  },
];

export default function LandingPage() {
  const [apartments, setApartments] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const allListings = await getAllListings();
        
        const apartmentListings = allListings.filter(l => l.type === 'house').slice(0, 3);
        const carListings = allListings.filter(l => l.type === 'car').slice(0, 3);
        
        setApartments(apartmentListings);
        setCars(carListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className={styles.wrapper}>
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        className={styles.heroSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className={styles.heroTextContainer}
          >
            <h1 className={styles.heroTitle}>Where Living Meets Moving</h1>
            <p className={styles.heroSubtitle}>
              Find your perfect apartment or rent the ideal car
            </p>
            <div className={styles.heroCTA}>
              <Link href="/explore?type=house" className={styles.btnPrimary}>
                <MdApartment className="w-5 h-5" />
                Find an Apartment
              </Link>
              <Link href="/explore?type=car" className={styles.btnSecondary}>
                <MdDirectionsCar className="w-5 h-5" />
                Rent a Car
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={styles.sectionHeader}
          >
            <h2 className={styles.sectionTitle}>Why Choose HAVANA?</h2>
          </motion.div>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className={styles.featureCard}
              >
                <div className={styles.featureIcon}>
                  {feature.icon}
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Apartments */}
      <section className={styles.trendingSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Trending Apartments</h2>
              <p className={styles.sectionSubtitle}>Discover the most popular apartment listings</p>
            </div>
            <Link href="/explore?type=house" className={styles.viewAllLink}>
              View All <MdArrowForward className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className={styles.loadingGrid}>
              {[1, 2, 3].map(i => (
                <div key={i} className={styles.skeletonCard} />
              ))}
            </div>
          ) : apartments.length > 0 ? (
            <div className={styles.listingsGrid}>
              {apartments.map((apartment, index) => (
                <motion.div
                  key={apartment.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <ListingCard listing={apartment} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No apartments available at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Cars */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Featured Cars</h2>
              <p className={styles.sectionSubtitle}>Browse our exclusive car collection</p>
            </div>
            <Link href="/explore?type=car" className={styles.viewAllLink}>
              View All <MdArrowForward className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className={styles.loadingGrid}>
              {[1, 2, 3].map(i => (
                <div key={i} className={styles.skeletonCard} />
              ))}
            </div>
          ) : cars.length > 0 ? (
            <div className={styles.listingsGrid}>
              {cars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <ListingCard listing={car} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No cars available at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={styles.ctaContent}
          >
            <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
            <p className={styles.ctaSubtitle}>
              Join thousands of happy customers who found their perfect apartment or car
            </p>
            <Link href="/auth/" className={styles.ctaButton}>
              Sign Up Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h4>About HAVANA</h4>
              <p>
                Premium platform for renting and selling properties and vehicles with ease and confidence.
              </p>
            </div>
            <div className={styles.footerSection}>
              <h4>Quick Links</h4>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/explore">Explore</Link></li>
                <li><Link href="/explore?type=house">Apartments</Link></li>
                <li><Link href="/explore?type=car">Cars</Link></li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2024 HAVANA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
