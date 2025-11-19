/**
 * Firestore Service Layer
 * Complete CRUD operations for all collections
 */

import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  deleteDoc,
  Query,
  QueryConstraint,
  startAfter,
  startAt,
  endAt,
  addDoc,
  arrayUnion,
  arrayRemove,
  increment,
  FieldValue,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import * as Types from '../types';

// ============ USER SERVICE ============

export const userService = {
  /**
   * Create or update user profile
   */
  async createProfile(uid: string, data: Partial<Types.UserProfile>): Promise<void> {
    const userRef = doc(db, 'users', uid);
    const timestamp = Timestamp.now();

    const profileData: any = {
      uid,
      ...data,
      createdAt: data.createdAt || timestamp,
      updatedAt: timestamp,
    };

    await setDoc(userRef, profileData, { merge: true });
  },

  /**
   * Get user profile by ID
   */
  async getProfile(uid: string): Promise<Types.UserProfile | null> {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return null;

    const data = userSnap.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
    } as Types.UserProfile;
  },

  /**
   * Update user profile
   */
  async updateProfile(uid: string, updates: Partial<Types.UserProfile>): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  },

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<Types.UserProfile | null> {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const data = querySnapshot.docs[0].data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
    } as Types.UserProfile;
  },

  /**
   * Get all agents
   */
  async getAgents(
    pageSize: number = 10,
    pageSnapshot?: any
  ): Promise<{ agents: Types.AgentProfile[]; lastDoc: any; hasMore: boolean }> {
    let q = query(
      collection(db, 'users'),
      where('role', '==', 'agent'),
      orderBy('totalEarnings', 'desc'),
      limit(pageSize + 1)
    );

    if (pageSnapshot) {
      q = query(
        collection(db, 'users'),
        where('role', '==', 'agent'),
        orderBy('totalEarnings', 'desc'),
        startAfter(pageSnapshot),
        limit(pageSize + 1)
      );
    }

    const querySnapshot = await getDocs(q);
    const agents: Types.AgentProfile[] = [];
    let lastDoc = null;
    let hasMore = false;

    querySnapshot.docs.forEach((doc, index) => {
      if (index < pageSize) {
        const data = doc.data();
        agents.push({
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
        } as Types.AgentProfile);
      } else {
        hasMore = true;
      }
      lastDoc = doc;
    });

    return { agents, lastDoc, hasMore };
  },

  /**
   * Search users by name or email
   */
  async searchUsers(searchTerm: string): Promise<Types.UserProfile[]> {
    const q = query(
      collection(db, 'users'),
      orderBy('displayName'),
      startAt(searchTerm),
      endAt(searchTerm + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as Types.UserProfile;
    });
  },
};

// ============ SERVICE LISTING SERVICE ============

export const listingService = {
  /**
   * Create a new service listing
   */
  async create(agentId: string, data: Omit<Types.ServiceListing, 'id'>): Promise<string> {
    const listingsRef = collection(db, 'listings');
    const docRef = await addDoc(listingsRef, {
      ...data,
      agentId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      views: 0,
    });

    return docRef.id;
  },

  /**
   * Get listing by ID
   */
  async getById(listingId: string): Promise<Types.ServiceListing | null> {
    const listingRef = doc(db, 'listings', listingId);
    const listingSnap = await getDoc(listingRef);

    if (!listingSnap.exists()) return null;

    const data = listingSnap.data();
    return {
      id: listingId,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
    } as Types.ServiceListing;
  },

  /**
   * Get all listings for an agent
   */
  async getByAgent(agentId: string): Promise<Types.ServiceListing[]> {
    const q = query(collection(db, 'listings'), where('agentId', '==', agentId), where('active', '==', true));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as Types.ServiceListing;
    });
  },

  /**
   * Search listings by category
   */
  async searchByCategory(category: string): Promise<Types.ServiceListing[]> {
    const q = query(collection(db, 'listings'), where('category', '==', category), where('active', '==', true), orderBy('rating', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as Types.ServiceListing;
    });
  },

  /**
   * Get featured listings
   */
  async getFeatured(limit: number = 10): Promise<Types.ServiceListing[]> {
    const q = query(
      collection(db, 'listings'),
      where('active', '==', true),
      orderBy('rating', 'desc'),
      limit(limit)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as Types.ServiceListing;
    });
  },

  /**
   * Update listing
   */
  async update(listingId: string, updates: Partial<Types.ServiceListing>): Promise<void> {
    const listingRef = doc(db, 'listings', listingId);
    await updateDoc(listingRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  },

  /**
   * Increment view count
   */
  async incrementViews(listingId: string): Promise<void> {
    const listingRef = doc(db, 'listings', listingId);
    await updateDoc(listingRef, {
      views: increment(1),
    });
  },

  /**
   * Delete listing
   */
  async delete(listingId: string): Promise<void> {
    const listingRef = doc(db, 'listings', listingId);
    await deleteDoc(listingRef);
  },
};

// ============ BOOKING SERVICE ============

export const bookingService = {
  /**
   * Create a new booking
   */
  async create(data: Omit<Types.Booking, 'id'>): Promise<string> {
    const bookingsRef = collection(db, 'bookings');
    const docRef = await addDoc(bookingsRef, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  },

  /**
   * Get booking by ID
   */
  async getById(bookingId: string): Promise<Types.Booking | null> {
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);

    if (!bookingSnap.exists()) return null;

    const data = bookingSnap.data();
    return {
      id: bookingId,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
      scheduledDate: data.scheduledDate?.toDate?.() || new Date(),
    } as Types.Booking;
  },

  /**
   * Get bookings for a user
   */
  async getByUser(userId: string): Promise<Types.Booking[]> {
    const q = query(collection(db, 'bookings'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        scheduledDate: data.scheduledDate?.toDate?.() || new Date(),
      } as Types.Booking;
    });
  },

  /**
   * Get bookings for an agent
   */
  async getByAgent(agentId: string): Promise<Types.Booking[]> {
    const q = query(collection(db, 'bookings'), where('agentId', '==', agentId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        scheduledDate: data.scheduledDate?.toDate?.() || new Date(),
      } as Types.Booking;
    });
  },

  /**
   * Get bookings by status
   */
  async getByStatus(status: Types.BookingStatus): Promise<Types.Booking[]> {
    const q = query(collection(db, 'bookings'), where('status', '==', status), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        scheduledDate: data.scheduledDate?.toDate?.() || new Date(),
      } as Types.Booking;
    });
  },

  /**
   * Update booking
   */
  async update(bookingId: string, updates: Partial<Types.Booking>): Promise<void> {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  },

  /**
   * Cancel booking
   */
  async cancel(bookingId: string, reason: string, cancelledBy: 'user' | 'agent'): Promise<void> {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status: 'cancelled',
      cancellationReason: reason,
      cancelledBy,
      updatedAt: Timestamp.now(),
    });
  },
};

// ============ PAYMENT SERVICE ============

export const paymentService = {
  /**
   * Create a payment record
   */
  async create(data: Omit<Types.Payment, 'id'>): Promise<string> {
    const paymentsRef = collection(db, 'payments');
    const docRef = await addDoc(paymentsRef, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  },

  /**
   * Get payment by ID
   */
  async getById(paymentId: string): Promise<Types.Payment | null> {
    const paymentRef = doc(db, 'payments', paymentId);
    const paymentSnap = await getDoc(paymentRef);

    if (!paymentSnap.exists()) return null;

    const data = paymentSnap.data();
    return {
      id: paymentId,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
    } as Types.Payment;
  },

  /**
   * Get payment by transaction ID
   */
  async getByTransactionId(transactionId: string): Promise<Types.Payment | null> {
    const q = query(collection(db, 'payments'), where('transactionId', '==', transactionId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const data = querySnapshot.docs[0].data();
    return {
      id: querySnapshot.docs[0].id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
    } as Types.Payment;
  },

  /**
   * Update payment status
   */
  async updateStatus(paymentId: string, status: Types.Payment['status'], transactionId?: string): Promise<void> {
    const paymentRef = doc(db, 'payments', paymentId);
    const updates: any = {
      status,
      updatedAt: Timestamp.now(),
    };

    if (transactionId) {
      updates.transactionId = transactionId;
    }

    if (status === 'completed') {
      updates.completedAt = Timestamp.now();
    }

    await updateDoc(paymentRef, updates);
  },

  /**
   * Get payments for user
   */
  async getByUser(userId: string): Promise<Types.Payment[]> {
    const q = query(collection(db, 'payments'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as Types.Payment;
    });
  },
};

// ============ MESSAGE SERVICE ============

export const messageService = {
  /**
   * Get or create conversation
   */
  async getOrCreateConversation(userId: string, agentId: string): Promise<string> {
    const [id1, id2] = [userId, agentId].sort();
    const conversationId = `${id1}_${id2}`;
    const conversationRef = doc(db, 'conversations', conversationId);
    const conversationSnap = await getDoc(conversationRef);

    if (!conversationSnap.exists()) {
      await setDoc(conversationRef, {
        participantIds: [userId, agentId],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        archived: false,
        unreadCount: {
          [userId]: 0,
          [agentId]: 0,
        },
      });
    }

    return conversationId;
  },

  /**
   * Send message
   */
  async sendMessage(conversationId: string, data: Omit<Types.Message, 'id'>): Promise<string> {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const docRef = await addDoc(messagesRef, {
      ...data,
      createdAt: Timestamp.now(),
    });

    // Update conversation lastMessage
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      lastMessage: data.text,
      lastMessageTime: Timestamp.now(),
      lastMessageSenderId: data.senderId,
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  },

  /**
   * Get messages for conversation
   */
  async getMessages(conversationId: string, pageSize: number = 50): Promise<Types.Message[]> {
    const q = query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          readAt: data.readAt?.toDate?.() || undefined,
        } as Types.Message;
      })
      .reverse();
  },

  /**
   * Mark message as read
   */
  async markMessageAsRead(conversationId: string, messageId: string): Promise<void> {
    const messageRef = doc(db, 'conversations', conversationId, 'messages', messageId);
    await updateDoc(messageRef, {
      read: true,
      readAt: Timestamp.now(),
    });
  },

  /**
   * Get conversations for user
   */
  async getConversations(userId: string): Promise<Types.Conversation[]> {
    const q = query(
      collection(db, 'conversations'),
      where('participantIds', 'array-contains', userId),
      where('archived', '==', false),
      orderBy('updatedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        lastMessageTime: data.lastMessageTime?.toDate?.() || undefined,
      } as Types.Conversation;
    });
  },
};

// ============ REVIEW SERVICE ============

export const reviewService = {
  /**
   * Create a review
   */
  async create(data: Omit<Types.ServiceReview, 'id'>): Promise<string> {
    const reviewsRef = collection(db, 'reviews');
    const docRef = await addDoc(reviewsRef, {
      ...data,
      createdAt: Timestamp.now(),
      helpful: 0,
    });

    return docRef.id;
  },

  /**
   * Get reviews for listing
   */
  async getByListing(listingId: string): Promise<Types.ServiceReview[]> {
    const q = query(collection(db, 'reviews'), where('listingId', '==', listingId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
      } as Types.ServiceReview;
    });
  },

  /**
   * Get reviews for agent
   */
  async getByAgent(agentId: string): Promise<Types.ServiceReview[]> {
    const q = query(collection(db, 'reviews'), where('agentId', '==', agentId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
      } as Types.ServiceReview;
    });
  },

  /**
   * Update review helpfulness
   */
  async updateHelpful(reviewId: string, increment: number = 1): Promise<void> {
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, {
      helpful: increment(increment),
    });
  },
};
