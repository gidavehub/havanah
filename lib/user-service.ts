import { 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  collection, 
  query, 
  where, 
  getDocs,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { getFirestoreInstance } from '@/lib/firebase';

export interface PublicProfile {
  uid: string;
  displayName: string;
  email: string; // Maybe hide this if not connected?
  photoURL: string;
  role: 'user' | 'agent';
  bio?: string;
  location?: string;
  phoneNumber?: string;
  createdAt: any;
  connections?: string[]; // Array of UIDs
}

/**
 * Get a user's profile by ID (Public read)
 */
export const getProfileById = async (uid: string): Promise<PublicProfile | null> => {
  try {
    const db = getFirestoreInstance();
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { uid: docSnap.id, ...docSnap.data() } as PublicProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

/**
 * Connect with another user (Agent or User)
 */
export const toggleConnection = async (currentUserId: string, targetUserId: string, isConnected: boolean) => {
  try {
    const db = getFirestoreInstance();
    const currentUserRef = doc(db, 'users', currentUserId);
    const targetUserRef = doc(db, 'users', targetUserId);

    // We update both users to show the connection
    if (isConnected) {
      // Disconnect
      await updateDoc(currentUserRef, {
        connections: arrayRemove(targetUserId)
      });
      await updateDoc(targetUserRef, {
        connections: arrayRemove(currentUserId)
      });
    } else {
      // Connect
      await updateDoc(currentUserRef, {
        connections: arrayUnion(targetUserId)
      });
      await updateDoc(targetUserRef, {
        connections: arrayUnion(currentUserId)
      });
      
      // Create a notification for the target user
      const notifRef = doc(collection(db, `notifications/${targetUserId}/items`));
      await setDoc(notifRef, {
        type: 'connection',
        title: 'New Connection',
        message: 'Someone added you to their network.',
        senderId: currentUserId,
        read: false,
        timestamp: serverTimestamp()
      });
    }
    return !isConnected;
  } catch (error) {
    console.error('Error toggling connection:', error);
    throw error;
  }
};

/**
 * Check if two users are connected
 */
export const checkConnectionStatus = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
  try {
    const db = getFirestoreInstance();
    const docRef = doc(db, 'users', currentUserId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.connections?.includes(targetUserId) || false;
    }
    return false;
  } catch (error) {
    return false;
  }
};

/**
 * Get Agent's active listings for their profile page
 */
export const getAgentPublicListings = async (agentId: string) => {
  try {
    const db = getFirestoreInstance();
    const q = query(
      collection(db, 'listings'),
      where('agentId', '==', agentId),
      where('status', '==', 'active')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting agent listings:', error);
    return [];
  }
};