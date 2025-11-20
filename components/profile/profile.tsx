'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  MdEdit, 
  MdSave, 
  MdCameraAlt, 
  MdPersonAdd, 
  MdPersonRemove,
  MdMessage,
  MdVerified,
  MdLocationOn,
  MdCalendarToday,
  MdWork,
  MdGridOn,
  MdInfo,
  MdCheck
} from 'react-icons/md';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import { 
  getProfileById, 
  toggleConnection, 
  checkConnectionStatus, 
  getAgentPublicListings,
  PublicProfile 
} from '@/lib/user-service';
import { updateUserProfile } from '@/lib/firestore-service';
import { getOrCreateConversation } from '@/lib/realtime-service';
import { getStorageInstance } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './profile.module.css';

interface UnifiedProfileProps {
  profileId?: string; // If undefined, shows logged-in user's profile
}

export default function UnifiedProfile({ profileId }: UnifiedProfileProps) {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- State ---
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [agentListings, setAgentListings] = useState<any[]>([]);
  
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'listings'>('about');
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    location: '',
    phoneNumber: '',
  });

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Determine Target ID
      const targetId = profileId || user?.id;
      
      if (!targetId) {
        setIsLoading(false);
        return; // No user logged in and no ID provided
      }

      const isOwn = user?.id === targetId;
      setIsOwnProfile(isOwn);

      try {
        // 1. Get Profile Data
        const profileData = await getProfileById(targetId);
        
        if (!profileData) {
          toast.error('Error', 'User not found');
          router.push('/explore'); // Redirect if invalid
          return;
        }

        setProfile(profileData);
        setEditForm({
          displayName: profileData.displayName,
          bio: profileData.bio || '',
          location: profileData.location || '',
          phoneNumber: profileData.phoneNumber || '',
        });

        // 2. If Agent, Get Listings
        if (profileData.role === 'agent') {
          const listings = await getAgentPublicListings(targetId);
          setAgentListings(listings);
          setActiveTab('listings'); // Default to listings for agents
        }

        // 3. If viewing others, check connection status
        if (!isOwn && user?.id) {
          const status = await checkConnectionStatus(user.id, targetId);
          setIsConnected(status);
        }

      } catch (error) {
        console.error(error);
        toast.error('Error', 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [profileId, user?.id]);

  // --- Actions ---

  const handleConnect = async () => {
    if (!user?.id || !profile) return;
    
    const originalState = isConnected;
    setIsConnected(!isConnected); // Optimistic update

    try {
      await toggleConnection(user.id, profile.uid, originalState);
      toast.success(
        originalState ? 'Disconnected' : 'Connected', 
        originalState ? `You removed ${profile.displayName}` : `You are now connected with ${profile.displayName}`
      );
    } catch (error) {
      setIsConnected(originalState); // Revert
      toast.error('Error', 'Failed to update connection');
    }
  };

  const handleMessage = async () => {
    if (!user?.id || !profile) return;
    
    try {
      const convId = await getOrCreateConversation(
        user.id, 
        profile.uid, 
        user.displayName || 'User', 
        profile.displayName
      );
      // In a real app, use Next.js router params, here we assume the messaging page reads URL or state
      // For this demo, we navigate and ideally pass state, but URL param is safest
      router.push(`/messaging?id=${convId}`); 
    } catch (error) {
      toast.error('Error', 'Could not start chat');
    }
  };

  const handleSaveChanges = async () => {
    if (!user?.id) return;
    const loadingId = toast.loading('Saving', 'Updating your profile...');
    
    try {
      await updateUserProfile(user.id, {
        displayName: editForm.displayName,
        bio: editForm.bio,
        location: editForm.location,
        phoneNumber: editForm.phoneNumber
      });
      
      setProfile(prev => prev ? ({ ...prev, ...editForm }) : null);
      setIsEditing(false);
      toast.remove(loadingId);
      toast.success('Success', 'Profile updated');
    } catch (error) {
      toast.remove(loadingId);
      toast.error('Error', 'Failed to save changes');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user?.id) return;
    const file = e.target.files[0];
    const toastId = toast.loading("Uploading", "Updating avatar...");

    try {
      const storage = getStorageInstance();
      const storageRef = ref(storage, `avatars/${user.id}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      await updateUserProfile(user.id, { profileImage: url });
      setProfile(prev => prev ? ({ ...prev, photoURL: url }) : null);
      
      toast.remove(toastId);
      toast.success("Success", "Avatar updated");
    } catch (error) {
      toast.remove(toastId);
      toast.error("Error", "Upload failed");
    }
  };

  if (isLoading) return <div className={styles.loadingContainer}><div className={styles.spinner}></div></div>;
  if (!profile) return null;

  return (
    <div className={styles.container}>
      
      {/* Profile Header Card */}
      <motion.div 
        className={styles.headerCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.coverPhoto}></div>
        
        <div className={styles.headerContent}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              <img 
                src={profile.photoURL || 'https://via.placeholder.com/150'} 
                alt={profile.displayName} 
                className={styles.avatar}
              />
              {isOwnProfile && (
                <>
                  <button className={styles.cameraBtn} onClick={() => fileInputRef.current?.click()}>
                    <MdCameraAlt />
                  </button>
                  <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </>
              )}
            </div>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.identityRow}>
              <div className={styles.nameGroup}>
                <h1>
                  {isEditing ? (
                    <input 
                      className={styles.editNameInput}
                      value={editForm.displayName}
                      onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                    />
                  ) : profile.displayName}
                </h1>
                <div className={styles.badges}>
                  {profile.role === 'agent' && (
                    <span className={styles.agentBadge}><MdVerified /> Agent</span>
                  )}
                  {profile.location && (
                    <span className={styles.locationBadge}><MdLocationOn /> {profile.location}</span>
                  )}
                </div>
              </div>

              <div className={styles.actionButtons}>
                {isOwnProfile ? (
                  !isEditing ? (
                    <button className={styles.btnSecondary} onClick={() => setIsEditing(true)}>
                      <MdEdit /> Edit Profile
                    </button>
                  ) : (
                    <button className={styles.btnPrimary} onClick={handleSaveChanges}>
                      <MdSave /> Save
                    </button>
                  )
                ) : (
                  <>
                    <button 
                      className={isConnected ? styles.btnConnected : styles.btnPrimary}
                      onClick={handleConnect}
                    >
                      {isConnected ? <><MdCheck /> Connected</> : <><MdPersonAdd /> Connect</>}
                    </button>
                    <button className={styles.btnSecondary} onClick={handleMessage}>
                      <MdMessage /> Message
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabBar}>
              {profile.role === 'agent' && (
                <button 
                  className={`${styles.tab} ${activeTab === 'listings' ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab('listings')}
                >
                  <MdGridOn /> Listings ({agentListings.length})
                </button>
              )}
              <button 
                className={`${styles.tab} ${activeTab === 'about' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('about')}
              >
                <MdInfo /> About
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      <div className={styles.contentGrid}>
        
        {/* Left Sidebar: Quick Info */}
        <motion.aside 
          className={styles.sidebar}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.infoCard}>
            <h3>Intro</h3>
            {isEditing ? (
              <textarea 
                className={styles.editBioInput}
                value={editForm.bio}
                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                placeholder="Write a short bio..."
                rows={4}
              />
            ) : (
              <p className={styles.bioText}>{profile.bio || "No bio available yet."}</p>
            )}
            
            <div className={styles.detailList}>
              <div className={styles.detailItem}>
                <MdCalendarToday />
                <span>Joined {new Date(profile.createdAt?.seconds * 1000 || Date.now()).getFullYear()}</span>
              </div>
              {profile.role === 'agent' && (
                <div className={styles.detailItem}>
                  <MdWork />
                  <span>Havanah Verified Agent</span>
                </div>
              )}
              {(isOwnProfile || isConnected) && profile.email && (
                <div className={styles.detailItem}>
                  <span>✉️ {profile.email}</span>
                </div>
              )}
            </div>
          </div>
        </motion.aside>

        {/* Main Feed */}
        <motion.main 
          className={styles.mainFeed}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            
            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <motion.div 
                key="listings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.listingsGrid}
              >
                {agentListings.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>No active listings found.</p>
                  </div>
                ) : (
                  agentListings.map(listing => (
                    <div key={listing.id} className={styles.listingCard}>
                      <img src={listing.images[0]} alt={listing.title} />
                      <div className={styles.listingInfo}>
                        <h4>{listing.title}</h4>
                        <p className={styles.price}>${listing.price.toLocaleString()}</p>
                        <div className={styles.listingMeta}>
                          <span>{listing.type}</span>
                          <span>•</span>
                          <span>{listing.status}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <motion.div 
                key="about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.aboutSection}
              >
                {/* Additional details could go here */}
                <div className={styles.placeholderCard}>
                   <h3>Statistics & Reviews</h3>
                   <div className={styles.statsRow}>
                     <div className={styles.statBox}>
                       <span className={styles.statNum}>0</span>
                       <span className={styles.statLabel}>Reviews</span>
                     </div>
                     <div className={styles.statBox}>
                       <span className={styles.statNum}>5.0</span>
                       <span className={styles.statLabel}>Rating</span>
                     </div>
                     {profile.role === 'agent' && (
                       <div className={styles.statBox}>
                         <span className={styles.statNum}>{agentListings.length}</span>
                         <span className={styles.statLabel}>Listings</span>
                       </div>
                     )}
                   </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
}