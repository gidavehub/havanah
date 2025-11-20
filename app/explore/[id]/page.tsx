'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MdLocationOn, MdHome, MdDirectionsCar, MdCheck, MdMessage, MdPerson, MdArrowBack
} from 'react-icons/md';
import { doc, getDoc } from 'firebase/firestore';
import { getFirestoreInstance } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import { getOrCreateConversation } from '@/lib/realtime-service';
import { getProfileById } from '@/lib/user-service';
import styles from './listing-details.module.css';

export default function ListingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  
  const [listing, setListing] = useState<any>(null);
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      if (!params.id) return;
      try {
        const db = getFirestoreInstance();
        const docRef = doc(db, 'listings', params.id as string);
        const snap = await getDoc(docRef);
        
        if (snap.exists()) {
          const data = snap.data();
          setListing({ id: snap.id, ...data });
          
          // Fetch Agent Info
          if (data.agentId) {
            const agentData = await getProfileById(data.agentId);
            setAgent(agentData);
          }
        } else {
          toast.error('Not Found', 'Listing does not exist');
          router.push('/explore');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.id]);

  const handleMessageAgent = async () => {
    if (!user) {
      toast.error('Login Required', 'Please log in to contact the agent');
      router.push('/auth/login');
      return;
    }

    if (!agent) return;

    try {
      const convId = await getOrCreateConversation(
        user.id,
        agent.uid,
        user.displayName || 'User',
        agent.displayName
      );
      // Redirect to messaging with this ID pre-selected
      router.push(`/messaging?id=${convId}`);
    } catch (error) {
      toast.error('Error', 'Could not start conversation');
    }
  };

  const handleViewProfile = () => {
    if (agent?.uid) {
      router.push(`/profile/${agent.uid}`);
    }
  };

  if (loading) return <div className={styles.loading}>Loading listing...</div>;
  if (!listing) return null;

  return (
    <main className={styles.container}>
      <button className={styles.backBtn} onClick={() => router.back()}>
        <MdArrowBack /> Back
      </button>

      <div className={styles.grid}>
        {/* Left: Images & Description */}
        <div className={styles.mainContent}>
          <div className={styles.imageGallery}>
            <div className={styles.mainImageFrame}>
              <img src={listing.images[activeImage]} alt={listing.title} className={styles.mainImage} />
            </div>
            <div className={styles.thumbnails}>
              {listing.images.map((img: string, i: number) => (
                <div 
                  key={i} 
                  className={`${styles.thumb} ${i === activeImage ? styles.activeThumb : ''}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.details}>
            <h1>{listing.title}</h1>
            <div className={styles.location}>
              <MdLocationOn /> {listing.location}
            </div>
            
            <div className={styles.specs}>
              {listing.type === 'house' ? (
                <>
                  <span>{listing.bedrooms} Beds</span> • <span>{listing.bathrooms} Baths</span> • <span>{listing.sqft} sqft</span>
                </>
              ) : (
                <>
                  <span>{listing.brand}</span> • <span>{listing.model}</span> • <span>{listing.year}</span>
                </>
              )}
            </div>

            <div className={styles.description}>
              <h3>Description</h3>
              <p>{listing.description}</p>
            </div>
          </div>
        </div>

        {/* Right: Agent Card & Action */}
        <aside className={styles.sidebar}>
          <div className={styles.priceCard}>
            <span className={styles.priceLabel}>{listing.category === 'rent' ? 'Rent' : 'Price'}</span>
            <h2 className={styles.price}>${listing.price.toLocaleString()} {listing.category === 'rent' ? '/mo' : ''}</h2>
            <button className={styles.primaryBtn} onClick={handleMessageAgent}>
              Contact Agent
            </button>
          </div>

          {agent && (
            <div className={styles.agentCard}>
              <h3>Listing Agent</h3>
              <div className={styles.agentInfo}>
                <img src={agent.photoURL || 'https://via.placeholder.com/50'} alt={agent.displayName} className={styles.agentAvatar} />
                <div>
                  <h4>{agent.displayName}</h4>
                  <p>{agent.role === 'agent' ? 'Verified Agent' : 'User'}</p>
                </div>
              </div>
              <div className={styles.agentActions}>
                <button className={styles.secondaryBtn} onClick={handleMessageAgent}>
                  <MdMessage /> Message
                </button>
                <button className={styles.secondaryBtn} onClick={handleViewProfile}>
                  <MdPerson /> View Profile
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}