'use client';

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  QueryConstraint,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  UserProfile,
  AgentProfile,
  ServiceListing,
  Booking,
  Message,
  Conversation,
  ServiceReview,
  Payment,
  SupportTicket,
  ApiResponse,
  PaginatedResponse,
} from './types';

// ============ USER OPERATIONS ============

/**
 * Create a new user profile in Firestore
 */
export async function createUserProfile(
  uid: string,
  email: string,
  displayName: string,
  role: 'user' | 'agent',
  additionalData?: any
): Promise<ApiResponse<UserProfile>> {
  try {
    const userRef = doc(db, 'users', uid);
    
    const userData: UserProfile = {
      uid,
      email,
      displayName,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      verified: false,
      rating: 5,
      totalReviews: 0,
      ...additionalData,
    };

    await setDoc(userRef, userData);

    return {
      success: true,
      data: userData,
      message: 'User profile created successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create user profile',
    };
  }
}

/**
 * Get user profile by UID
 */
export async function getUserProfile(uid: string): Promise<ApiResponse<UserProfile>> {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return {
        success: false,
        error: 'User profile not found',
      };
    }

    return {
      success: true,
      data: userSnap.data() as UserProfile,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch user profile',
    };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>
): Promise<ApiResponse<UserProfile>> {
  try {
    const userRef = doc(db, 'users', uid);
    
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    await updateDoc(userRef, updateData);

    const updated = await getUserProfile(uid);
    return updated;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update user profile',
    };
  }
}

/**
 * Create agent profile with extended data
 */
export async function createAgentProfile(
  uid: string,
  email: string,
  displayName: string,
  businessName: string,
  businessCategory: string,
  yearsExperience: number,
  hourlyRate: number
): Promise<ApiResponse<AgentProfile>> {
  try {
    const agentRef = doc(db, 'users', uid);
    
    const agentData: AgentProfile = {
      uid,
      email,
      displayName,
      role: 'agent',
      businessName,
      businessCategory,
      yearsExperience,
      hourlyRate,
      createdAt: new Date(),
      updatedAt: new Date(),
      verified: false,
      rating: 5,
      totalReviews: 0,
      totalEarnings: 0,
      totalBookings: 0,
      activeListings: 0,
    };

    await setDoc(agentRef, agentData);

    return {
      success: true,
      data: agentData,
      message: 'Agent profile created successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create agent profile',
    };
  }
}

// ============ SERVICE LISTING OPERATIONS ============

/**
 * Create a new service listing
 */
export async function createServiceListing(
  agentId: string,
  agentName: string,
  listingData: Omit<ServiceListing, 'id' | 'agentId' | 'agentName' | 'createdAt' | 'updatedAt' | 'views'>
): Promise<ApiResponse<ServiceListing>> {
  try {
    const listingsRef = collection(db, 'listings');
    
    const newListing = {
      ...listingData,
      agentId,
      agentName,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
    };

    const docRef = await addDoc(listingsRef, newListing);

    return {
      success: true,
      data: { id: docRef.id, ...newListing } as ServiceListing,
      message: 'Service listing created successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create service listing',
    };
  }
}

/**
 * Get service listing by ID
 */
export async function getServiceListing(listingId: string): Promise<ApiResponse<ServiceListing>> {
  try {
    const listingRef = doc(db, 'listings', listingId);
    const listingSnap = await getDoc(listingRef);

    if (!listingSnap.exists()) {
      return {
        success: false,
        error: 'Service listing not found',
      };
    }

    return {
      success: true,
      data: { id: listingSnap.id, ...listingSnap.data() } as ServiceListing,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch service listing',
    };
  }
}

/**
 * Get all listings by agent
 */
export async function getAgentListings(agentId: string): Promise<ApiResponse<ServiceListing[]>> {
  try {
    const listingsRef = collection(db, 'listings');
    const q = query(
      listingsRef,
      where('agentId', '==', agentId),
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const listings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as ServiceListing));

    return {
      success: true,
      data: listings,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch agent listings',
    };
  }
}

/**
 * Search listings by category
 */
export async function searchListingsByCategory(
  category: string,
  limitResults: number = 20
): Promise<ApiResponse<ServiceListing[]>> {
  try {
    const listingsRef = collection(db, 'listings');
    const q = query(
      listingsRef,
      where('category', '==', category),
      where('active', '==', true),
      orderBy('rating', 'desc'),
      limit(limitResults)
    );

    const querySnapshot = await getDocs(q);
    const listings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as ServiceListing));

    return {
      success: true,
      data: listings,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to search listings',
    };
  }
}

/**
 * Update service listing
 */
export async function updateServiceListing(
  listingId: string,
  updates: Partial<ServiceListing>
): Promise<ApiResponse<ServiceListing>> {
  try {
    const listingRef = doc(db, 'listings', listingId);
    
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    await updateDoc(listingRef, updateData);

    const updated = await getServiceListing(listingId);
    return updated;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update service listing',
    };
  }
}

/**
 * Delete service listing
 */
export async function deleteServiceListing(listingId: string): Promise<ApiResponse<null>> {
  try {
    const listingRef = doc(db, 'listings', listingId);
    await deleteDoc(listingRef);

    return {
      success: true,
      message: 'Service listing deleted successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete service listing',
    };
  }
}

// ============ BOOKING OPERATIONS ============

/**
 * Create a new booking
 */
export async function createBooking(
  bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Booking>> {
  try {
    const bookingsRef = collection(db, 'bookings');
    
    const newBooking = {
      ...bookingData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(bookingsRef, newBooking);

    return {
      success: true,
      data: { id: docRef.id, ...newBooking } as Booking,
      message: 'Booking created successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create booking',
    };
  }
}

/**
 * Get user bookings
 */
export async function getUserBookings(userId: string): Promise<ApiResponse<Booking[]>> {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('userId', '==', userId),
      orderBy('scheduledDate', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const bookings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Booking));

    return {
      success: true,
      data: bookings,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch user bookings',
    };
  }
}

/**
 * Get agent bookings
 */
export async function getAgentBookings(agentId: string): Promise<ApiResponse<Booking[]>> {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('agentId', '==', agentId),
      orderBy('scheduledDate', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const bookings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Booking));

    return {
      success: true,
      data: bookings,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch agent bookings',
    };
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  bookingId: string,
  status: string,
  additionalUpdates?: any
): Promise<ApiResponse<Booking>> {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    
    const updateData = {
      status,
      updatedAt: new Date(),
      ...additionalUpdates,
    };

    await updateDoc(bookingRef, updateData);

    const updated = doc(db, 'bookings', bookingId);
    const snap = await getDoc(updated);

    return {
      success: true,
      data: { id: snap.id, ...snap.data() } as Booking,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update booking',
    };
  }
}

// ============ MESSAGING OPERATIONS ============

/**
 * Create or get conversation
 */
export async function getOrCreateConversation(
  userId: string,
  agentId: string
): Promise<ApiResponse<Conversation>> {
  try {
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participantIds', 'array-contains', userId)
    );

    const querySnapshot = await getDocs(q);
    
    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      if (data.participantIds.includes(agentId)) {
        return {
          success: true,
          data: { id: docSnap.id, ...data } as Conversation,
        };
      }
    }

    // Create new conversation
    const newConversation = {
      participantIds: [userId, agentId],
      unreadCount: { [userId]: 0, [agentId]: 0 },
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(conversationsRef, newConversation);

    return {
      success: true,
      data: { id: docRef.id, ...newConversation } as Conversation,
      message: 'Conversation created successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create/get conversation',
    };
  }
}

/**
 * Send message
 */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  receiverId: string,
  text: string,
  images?: string[]
): Promise<ApiResponse<Message>> {
  try {
    const messagesRef = collection(db, `conversations/${conversationId}/messages`);
    
    const newMessage = {
      senderId,
      senderName,
      receiverId,
      text,
      images: images || [],
      read: false,
      createdAt: new Date(),
    };

    const docRef = await addDoc(messagesRef, newMessage);

    // Update conversation last message
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      lastMessage: text,
      lastMessageTime: new Date(),
      lastMessageSenderId: senderId,
      updatedAt: new Date(),
    });

    return {
      success: true,
      data: { id: docRef.id, conversationId, ...newMessage } as Message,
      message: 'Message sent successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to send message',
    };
  }
}

/**
 * Get conversation messages
 */
export async function getConversationMessages(
  conversationId: string,
  limitResults: number = 50
): Promise<ApiResponse<Message[]>> {
  try {
    const messagesRef = collection(db, `conversations/${conversationId}/messages`);
    const q = query(
      messagesRef,
      orderBy('createdAt', 'desc'),
      limit(limitResults)
    );

    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      conversationId,
      ...doc.data(),
    } as Message));

    return {
      success: true,
      data: messages.reverse(),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch messages',
    };
  }
}

/**
 * Get user conversations
 */
export async function getUserConversations(userId: string): Promise<ApiResponse<Conversation[]>> {
  try {
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participantIds', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const conversations = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Conversation));

    return {
      success: true,
      data: conversations,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch conversations',
    };
  }
}

// ============ REVIEW OPERATIONS ============

/**
 * Create service review
 */
export async function createReview(
  listingId: string,
  bookingId: string,
  userId: string,
  userName: string,
  agentId: string,
  rating: number,
  comment: string
): Promise<ApiResponse<ServiceReview>> {
  try {
    const reviewsRef = collection(db, 'reviews');
    
    const newReview = {
      listingId,
      bookingId,
      userId,
      userName,
      agentId,
      rating,
      comment,
      createdAt: new Date(),
      helpful: 0,
      verified: true,
    };

    const docRef = await addDoc(reviewsRef, newReview);

    // Update listing average rating
    await updateListingRating(listingId);

    return {
      success: true,
      data: { id: docRef.id, ...newReview } as ServiceReview,
      message: 'Review created successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create review',
    };
  }
}

/**
 * Get listing reviews
 */
export async function getListingReviews(listingId: string): Promise<ApiResponse<ServiceReview[]>> {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('listingId', '==', listingId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as ServiceReview));

    return {
      success: true,
      data: reviews,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch reviews',
    };
  }
}

/**
 * Update listing rating based on reviews
 */
async function updateListingRating(listingId: string): Promise<void> {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('listingId', '==', listingId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return;

    const reviews = querySnapshot.docs.map((doc) => doc.data());
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    const listingRef = doc(db, 'listings', listingId);
    await updateDoc(listingRef, {
      rating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error('Failed to update listing rating:', error);
  }
}

// ============ PAYMENT OPERATIONS ============

/**
 * Create payment record
 */
export async function createPayment(
  bookingId: string,
  userId: string,
  agentId: string,
  amount: number,
  method: 'modem-pay' | 'bank-transfer' | 'cash'
): Promise<ApiResponse<Payment>> {
  try {
    const paymentsRef = collection(db, 'payments');
    
    const newPayment = {
      bookingId,
      userId,
      agentId,
      amount,
      method,
      status: 'pending' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(paymentsRef, newPayment);

    return {
      success: true,
      data: { id: docRef.id, ...newPayment } as Payment,
      message: 'Payment record created',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create payment record',
    };
  }
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  paymentId: string,
  status: string,
  transactionId?: string
): Promise<ApiResponse<Payment>> {
  try {
    const paymentRef = doc(db, 'payments', paymentId);
    
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (transactionId) {
      updateData.transactionId = transactionId;
    }

    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    await updateDoc(paymentRef, updateData);

    const updated = await getDoc(paymentRef);
    return {
      success: true,
      data: { id: updated.id, ...updated.data() } as Payment,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update payment status',
    };
  }
}

/**
 * Get user payments
 */
export async function getUserPayments(userId: string): Promise<ApiResponse<Payment[]>> {
  try {
    const paymentsRef = collection(db, 'payments');
    const q = query(
      paymentsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const payments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Payment));

    return {
      success: true,
      data: payments,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch user payments',
    };
  }
}

// ============ UTILITY FUNCTIONS ============

/**
 * Get featured/recommended listings
 */
export async function getFeaturedListings(limit: number = 6): Promise<ApiResponse<ServiceListing[]>> {
  try {
    const listingsRef = collection(db, 'listings');
    const q = query(
      listingsRef,
      where('active', '==', true),
      orderBy('rating', 'desc'),
      limit(limit)
    );

    const querySnapshot = await getDocs(q);
    const listings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as ServiceListing));

    return {
      success: true,
      data: listings,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch featured listings',
    };
  }
}

/**
 * Search listings with multiple filters
 */
export async function searchListings(
  category?: string,
  priceMin?: number,
  priceMax?: number,
  minRating?: number
): Promise<ApiResponse<ServiceListing[]>> {
  try {
    const listingsRef = collection(db, 'listings');
    const constraints: QueryConstraint[] = [
      where('active', '==', true),
    ];

    if (category) {
      constraints.push(where('category', '==', category));
    }

    if (priceMin !== undefined) {
      constraints.push(where('price', '>=', priceMin));
    }

    if (priceMax !== undefined) {
      constraints.push(where('price', '<=', priceMax));
    }

    if (minRating !== undefined) {
      constraints.push(where('rating', '>=', minRating));
    }

    constraints.push(orderBy('rating', 'desc'));
    constraints.push(limit(50));

    const q = query(listingsRef, ...constraints);
    const querySnapshot = await getDocs(q);
    const listings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as ServiceListing));

    return {
      success: true,
      data: listings,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to search listings',
    };
  }
}
