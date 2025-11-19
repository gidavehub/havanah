/**
 * Custom React Hooks for Firestore Data
 * Real-time listeners and data fetching
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  Query,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../firebase';
import * as Types from '../types';
import { listingService, bookingService, userService, messageService, reviewService } from './firestore';

/**
 * Hook for real-time listings
 */
export const useListings = (filters?: { category?: string; minPrice?: number; maxPrice?: number }) => {
  const [listings, setListings] = useState<Types.ServiceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const constraints: QueryConstraint[] = [where('active', '==', true)];

    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }

    constraints.push(orderBy('rating', 'desc'));
    constraints.push(limit(50));

    const q = query(collection(db, 'listings'), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: Types.ServiceListing[] = [];
        querySnapshot.forEach((doc) => {
          const listing = doc.data();
          data.push({
            id: doc.id,
            ...listing,
            createdAt: listing.createdAt?.toDate?.() || new Date(),
            updatedAt: listing.updatedAt?.toDate?.() || new Date(),
          } as Types.ServiceListing);
        });
        setListings(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching listings:', error);
        setError('Failed to load listings');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [filters]);

  return { listings, loading, error };
};

/**
 * Hook for real-time user bookings
 */
export const useUserBookings = (userId: string | null) => {
  const [bookings, setBookings] = useState<Types.Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'bookings'), where('userId', '==', userId), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: Types.Booking[] = [];
        querySnapshot.forEach((doc) => {
          const booking = doc.data();
          data.push({
            id: doc.id,
            ...booking,
            createdAt: booking.createdAt?.toDate?.() || new Date(),
            updatedAt: booking.updatedAt?.toDate?.() || new Date(),
            scheduledDate: booking.scheduledDate?.toDate?.() || new Date(),
          } as Types.Booking);
        });
        setBookings(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { bookings, loading, error };
};

/**
 * Hook for real-time agent bookings
 */
export const useAgentBookings = (agentId: string | null) => {
  const [bookings, setBookings] = useState<Types.Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'bookings'), where('agentId', '==', agentId), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: Types.Booking[] = [];
        querySnapshot.forEach((doc) => {
          const booking = doc.data();
          data.push({
            id: doc.id,
            ...booking,
            createdAt: booking.createdAt?.toDate?.() || new Date(),
            updatedAt: booking.updatedAt?.toDate?.() || new Date(),
            scheduledDate: booking.scheduledDate?.toDate?.() || new Date(),
          } as Types.Booking);
        });
        setBookings(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching agent bookings:', error);
        setError('Failed to load bookings');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [agentId]);

  return { bookings, loading, error };
};

/**
 * Hook for real-time messages
 */
export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Types.Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: Types.Message[] = [];
        querySnapshot.forEach((doc) => {
          const message = doc.data();
          data.push({
            id: doc.id,
            ...message,
            createdAt: message.createdAt?.toDate?.() || new Date(),
            readAt: message.readAt?.toDate?.() || undefined,
          } as Types.Message);
        });
        setMessages(data.reverse());
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [conversationId]);

  return { messages, loading, error };
};

/**
 * Hook for real-time conversations
 */
export const useConversations = (userId: string | null) => {
  const [conversations, setConversations] = useState<Types.Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'conversations'),
      where('participantIds', 'array-contains', userId),
      where('archived', '==', false),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: Types.Conversation[] = [];
        querySnapshot.forEach((doc) => {
          const conversation = doc.data();
          data.push({
            id: doc.id,
            ...conversation,
            createdAt: conversation.createdAt?.toDate?.() || new Date(),
            updatedAt: conversation.updatedAt?.toDate?.() || new Date(),
            lastMessageTime: conversation.lastMessageTime?.toDate?.() || undefined,
          } as Types.Conversation);
        });
        setConversations(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching conversations:', error);
        setError('Failed to load conversations');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { conversations, loading, error };
};

/**
 * Hook for agent listings
 */
export const useAgentListings = (agentId: string | null) => {
  const [listings, setListings] = useState<Types.ServiceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'listings'), where('agentId', '==', agentId), where('active', '==', true));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: Types.ServiceListing[] = [];
        querySnapshot.forEach((doc) => {
          const listing = doc.data();
          data.push({
            id: doc.id,
            ...listing,
            createdAt: listing.createdAt?.toDate?.() || new Date(),
            updatedAt: listing.updatedAt?.toDate?.() || new Date(),
          } as Types.ServiceListing);
        });
        setListings(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching agent listings:', error);
        setError('Failed to load listings');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [agentId]);

  return { listings, loading, error };
};

/**
 * Hook for reviews
 */
export const useReviews = (listingId: string | null) => {
  const [reviews, setReviews] = useState<Types.ServiceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listingId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'reviews'), where('listingId', '==', listingId), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: Types.ServiceReview[] = [];
        querySnapshot.forEach((doc) => {
          const review = doc.data();
          data.push({
            id: doc.id,
            ...review,
            createdAt: review.createdAt?.toDate?.() || new Date(),
          } as Types.ServiceReview);
        });
        setReviews(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [listingId]);

  return { reviews, loading, error };
};

/**
 * Hook for featured listings
 */
export const useFeaturedListings = (count: number = 10) => {
  const [listings, setListings] = useState<Types.ServiceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'listings'), where('active', '==', true), orderBy('rating', 'desc'), limit(count));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: Types.ServiceListing[] = [];
        querySnapshot.forEach((doc) => {
          const listing = doc.data();
          data.push({
            id: doc.id,
            ...listing,
            createdAt: listing.createdAt?.toDate?.() || new Date(),
            updatedAt: listing.updatedAt?.toDate?.() || new Date(),
          } as Types.ServiceListing);
        });
        setListings(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching featured listings:', error);
        setError('Failed to load listings');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [count]);

  return { listings, loading, error };
};

/**
 * Hook for single listing
 */
export const useListing = (listingId: string | null) => {
  const [listing, setListing] = useState<Types.ServiceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listingId) {
      setLoading(false);
      return;
    }

    const fetchListing = async () => {
      try {
        setLoading(true);
        const data = await listingService.getById(listingId);
        setListing(data);
        if (data) {
          // Increment view count
          await listingService.incrementViews(listingId);
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  return { listing, loading, error };
};

/**
 * Hook for agents
 */
export const useAgents = () => {
  const [agents, setAgents] = useState<Types.AgentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const { agents: data } = await userService.getAgents(50);
        setAgents(data);
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError('Failed to load agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return { agents, loading, error };
};
