/**
 * Havanah Application Type Definitions
 * All TypeScript interfaces for Firestore collections
 */

// ============ USER TYPES ============

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  role: 'user' | 'agent'; // customer or service provider
  createdAt: Date;
  updatedAt: Date;
  bio?: string;
  location?: string;
  verified: boolean;
  rating?: number;
  totalReviews?: number;
}

export interface AgentProfile extends UserProfile {
  role: 'agent';
  businessName: string;
  businessCategory: string; // e.g., "plumbing", "cleaning", "tutoring"
  yearsExperience: number;
  serviceRadius?: number; // in km
  hourlyRate: number; // in GMD
  verified: boolean;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  documents?: string[]; // URLs to verification documents
  licenseNumber?: string;
  totalEarnings: number;
  totalBookings: number;
  activeListings: number;
}

export interface UserProfile_Customer extends UserProfile {
  role: 'user';
  savedItems: string[]; // listing IDs
  bookingHistory: string[]; // booking IDs
  totalSpent: number; // in GMD
  preferredServiceCategories: string[];
}

// ============ LISTING/SERVICE TYPES ============

export interface ServiceListing {
  id: string;
  agentId: string;
  agentName: string;
  title: string;
  description: string;
  category: string;
  price: number; // in GMD
  duration: number; // in minutes
  images: string[]; // URLs
  tags: string[];
  rating: number;
  totalReviews: number;
  availability: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  views: number;
}

export interface ServiceReview {
  id: string;
  listingId: string;
  bookingId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  agentId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
  helpful: number;
  verified: boolean;
}

// ============ BOOKING TYPES ============

export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'dispute';

export interface Booking {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  agentId: string;
  agentName: string;
  agentPhone: string;
  serviceTitle: string;
  price: number; // in GMD
  duration: number; // in minutes
  status: BookingStatus;
  scheduledDate: Date;
  scheduledTime: string; // HH:mm format
  location: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  cancellationReason?: string;
  cancelledBy?: 'user' | 'agent'; // who cancelled
  payment?: {
    method: 'modem-pay' | 'bank-transfer' | 'cash';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    amount: number;
    reference?: string;
  };
  feedback?: {
    rating: number;
    comment: string;
    createdAt: Date;
  };
}

// ============ PAYMENT TYPES ============

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  agentId: string;
  amount: number; // in GMD
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'modem-pay' | 'bank-transfer' | 'cash';
  transactionId?: string;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  receiptUrl?: string;
}

// ============ MESSAGE TYPES ============

export interface Conversation {
  id: string;
  participantIds: [string, string]; // [userId, agentId]
  lastMessage?: string;
  lastMessageTime?: Date;
  lastMessageSenderId?: string;
  unreadCount: { [userId: string]: number };
  createdAt: Date;
  updatedAt: Date;
  archived: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  receiverId: string;
  text: string;
  images?: string[];
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

// ============ ANALYTICS TYPES ============

export interface UserActivity {
  id: string;
  userId: string;
  action: 'viewed_listing' | 'bookmarked' | 'contacted_agent' | 'completed_booking' | 'left_review' | 'login' | 'logout';
  listingId?: string;
  bookingId?: string;
  metadata?: {
    category?: string;
    price?: number;
    rating?: number;
  };
  timestamp: Date;
}

export interface AgentAnalytics {
  id: string;
  agentId: string;
  period: string; // YYYY-MM
  views: number;
  clicks: number;
  bookings: number;
  revenue: number; // in GMD
  averageRating: number;
  completedBookings: number;
  cancelledBookings: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============ SUPPORT TYPES ============

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: 'booking' | 'payment' | 'agent-behavior' | 'technical' | 'other';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolution?: string;
  supportAgentId?: string;
}

// ============ SETTINGS TYPES ============

export interface AppSettings {
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  commissionsRate: number; // platform commission percentage
  minimumBookingPrice: number; // in GMD
  maximumBookingPrice: number; // in GMD
  verificationRequired: boolean;
  autoCompletionDays: number;
  cancellationDeadlineHours: number;
  lastUpdated: Date;
}

// ============ API RESPONSE TYPES ============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============ FILTER/SEARCH TYPES ============

export interface ServiceSearchFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  location?: string;
  availability?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular';
}

export interface BookingFilters {
  status?: BookingStatus;
  startDate?: Date;
  endDate?: Date;
  sortBy?: 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc';
}
