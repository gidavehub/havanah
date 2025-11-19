'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Query,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  ServiceListing,
  Booking,
  Message,
  Conversation,
  ServiceReview,
  UserProfile,
} from './types';

interface UseDataState<T> {
  data: T | T[] | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch and listen to real-time user profile
 */
export function useUserProfile(uid: string | null): UseDataState<UserProfile> {
  const [state, setState] = useState<UseDataState<UserProfile>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!uid) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const userRef = doc(db, 'users', uid);
    
    const unsubscribe = onSnapshot(
      userRef,
      (doc) => {
        if (doc.exists()) {
          setState({
            data: { id: doc.id, ...doc.data() } as UserProfile,
            loading: false,
            error: null,
          });
        }
      },
      (error) => {
        setState({
          data: null,
          loading: false,
          error: error.message,
        });
      }
    );

    return unsubscribe;
  }, [uid]);

  return state;
}

/**
 * Hook to fetch and listen to user's bookings in real-time
 */
export function useUserBookings(userId: string | null): UseDataState<Booking[]> {
  const [state, setState] = useState<UseDataState<Booking[]>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!userId) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('userId', '==', userId),
      orderBy('scheduledDate', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const bookings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Booking));

        setState({
          data: bookings,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState({
          data: [],
          loading: false,
          error: error.message,
        });
      }
    );

    return unsubscribe;
  }, [userId]);

  return state;
}

/**
 * Hook to fetch and listen to agent's bookings in real-time
 */
export function useAgentBookings(agentId: string | null): UseDataState<Booking[]> {
  const [state, setState] = useState<UseDataState<Booking[]>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!agentId) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('agentId', '==', agentId),
      orderBy('scheduledDate', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const bookings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Booking));

        setState({
          data: bookings,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState({
          data: [],
          loading: false,
          error: error.message,
        });
      }
    );

    return unsubscribe;
  }, [agentId]);

  return state;
}

/**
 * Hook to fetch and listen to agent's listings in real-time
 */
export function useAgentListings(agentId: string | null): UseDataState<ServiceListing[]> {
  const [state, setState] = useState<UseDataState<ServiceListing[]>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!agentId) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    const listingsRef = collection(db, 'listings');
    const q = query(
      listingsRef,
      where('agentId', '==', agentId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const listings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as ServiceListing));

        setState({
          data: listings,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState({
          data: [],
          loading: false,
          error: error.message,
        });
      }
    );

    return unsubscribe;
  }, [agentId]);

  return state;
}

/**
 * Hook to fetch featured listings in real-time
 */
export function useFeaturedListings(count: number = 6): UseDataState<ServiceListing[]> {
  const [state, setState] = useState<UseDataState<ServiceListing[]>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const listingsRef = collection(db, 'listings');
    const q = query(
      listingsRef,
      where('active', '==', true),
      orderBy('rating', 'desc'),
      limit(count)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const listings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as ServiceListing));

        setState({
          data: listings,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState({
          data: [],
          loading: false,
          error: error.message,
        });
      }
    );

    return unsubscribe;
  }, [count]);

  return state;
}

/**
 * Hook to fetch listings by category in real-time
 */
export function useListingsByCategory(category: string | null): UseDataState<ServiceListing[]> {
  const [state, setState] = useState<UseDataState<ServiceListing[]>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!category) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    const listingsRef = collection(db, 'listings');
    const q = query(
      listingsRef,
      where('category', '==', category),
      where('active', '==', true),
      orderBy('rating', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const listings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as ServiceListing));

        setState({
          data: listings,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState({
          data: [],
          loading: false,
          error: error.message,
        });
      }
    );

    return unsubscribe;
  }, [category]);

  return state;
}

/**
 * Hook to fetch reviews for a listing in real-time
 */
export function useListingReviews(listingId: string | null): UseDataState<ServiceReview[]> {
  const [state, setState] = useState<UseDataState<ServiceReview[]>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!listingId) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('listingId', '==', listingId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reviews = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as ServiceReview));

        setState({
          data: reviews,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState({
          data: [],
          loading: false,
          error: error.message,
        });
      }
    );

    return unsubscribe;
  }, [listingId]);

  return state;
}

/**
 * Hook to fetch user's conversations in real-time
 */
export function useConversations(userId: string | null): UseDataState<Conversation[]> {
  const [state, setState] = useState<UseDataState<Conversation[]>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!userId) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participantIds', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const conversations = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Conversation));

        setState({
          data: conversations,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState({
          data: [],
          loading: false,
          error: error.message,
        });
      }
    );

    return unsubscribe;
  }, [userId]);

  return state;
}

/**
 * Hook to fetch messages from a conversation in real-time
 */
export function useMessages(conversationId: string | null): UseDataState<Message[]> {
  const [state, setState] = useState<UseDataState<Message[]>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!conversationId) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    const messagesRef = collection(db, `conversations/${conversationId}/messages`);
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          conversationId,
          ...doc.data(),
        } as Message));

        setState({
          data: messages,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState({
          data: [],
          loading: false,
          error: error.message,
        });
      }
    );

    return unsubscribe;
  }, [conversationId]);

  return state;
}

/**
 * Hook to fetch a single listing with reviews
 */
export function useListingDetails(
  listingId: string | null
): UseDataState<{ listing: ServiceListing | null; reviews: ServiceReview[] }> {
  const [state, setState] = useState<UseDataState<{ listing: ServiceListing | null; reviews: ServiceReview[] }>>({
    data: { listing: null, reviews: [] },
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!listingId) {
      setState({ data: { listing: null, reviews: [] }, loading: false, error: null });
      return;
    }

    // Subscribe to listing
    const listingRef = doc(db, 'listings', listingId);
    const listingUnsubscribe = onSnapshot(
      listingRef,
      (doc) => {
        if (doc.exists()) {
          setState((prev) => ({
            ...prev,
            data: {
              ...prev.data,
              listing: { id: doc.id, ...doc.data() } as ServiceListing,
            },
            loading: false,
          }));
        }
      }
    );

    // Subscribe to reviews
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('listingId', '==', listingId),
      orderBy('createdAt', 'desc')
    );

    const reviewsUnsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reviews = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as ServiceReview));

        setState((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            reviews,
          },
          loading: false,
        }));
      }
    );

    return () => {
      listingUnsubscribe();
      reviewsUnsubscribe();
    };
  }, [listingId]);

  return state;
}
