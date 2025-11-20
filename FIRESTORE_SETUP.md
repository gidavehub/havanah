# Firestore & Realtime Database Integration - Complete Setup

## Overview

The Havanah platform now has full Firestore and Realtime Database integration with real-time notifications. This document covers all the components, services, and workflows.

## System Architecture

### Database Services

#### 1. **Firestore Service** (`lib/firestore-service.ts`)
Handles persistent data for listings, inquiries, and user profiles.

**Key Functions:**

**Listings:**
```typescript
createListing(agentId, listingData) - Create a new property/vehicle listing
getAgentListings(agentId) - Get all listings for an agent
getAllListings() - Get all active listings
getListing(listingId) - Get single listing details
updateListing(listingId, updates) - Update listing information
deleteListing(listingId) - Delete a listing
incrementListingViews(listingId) - Track viewing statistics
```

**Inquiries/Applications:**
```typescript
createInquiry(listingId, agentId, title, userId, userName, email, message, phone?) - Submit inquiry
getAgentInquiries(agentId) - Get all inquiries for an agent
getUserApplications(userId) - Get all applications submitted by user
updateInquiryStatus(inquiryId, status) - Accept/reject inquiries
```

**User Profiles:**
```typescript
createUserProfile(userId, userData) - Create user profile
getUserProfile(userId) - Get user profile
updateUserProfile(userId, updates) - Update profile
getAgentProfile(agentId) - Get agent details for listing display
```

#### 2. **Realtime Database Service** (`lib/realtime-service.ts`)
Handles real-time messaging, conversations, and notifications.

**Key Functions:**

**Messaging:**
```typescript
sendMessage(conversationId, senderId, senderName, text) - Send message
listenToMessages(conversationId, callback) - Listen for messages in real-time
getOrCreateConversation(userId, agentId) - Get/create conversation
markMessagesAsRead(conversationId, userId) - Mark messages as read
```

**Notifications:**
```typescript
sendNotification(userId, notification) - Send notification
listenToNotifications(userId, callback) - Listen for notifications
markNotificationAsRead(notificationId) - Mark notification as read
```

### React Hooks (`lib/notification-hooks.ts`)

Connect Firebase real-time events to the toast notification system.

```typescript
useNotificationListener() - Global notification listener
useUnreadMessagesCount(userId) - Monitor unread messages
useConversationMessages(conversationId, userId) - Listen to conversation
useInquiryNotification() - Setup inquiry notifications
useMessageNotification(conversationId, userId) - Setup message notifications
```

## Components

### Agent Dashboard Components

#### 1. **Agent Listings** (`components/agent/agent-listings.tsx`)
Agents manage their property and vehicle listings.

**Features:**
- View all personal listings
- Create new listings (houses or cars)
- Edit existing listings
- Delete listings
- Real-time view and inquiry counts
- Type-specific fields (bedrooms for houses, mileage for cars)

**Usage:**
```tsx
import AgentListings from '@/components/agent/agent-listings';

<AgentListings />
```

#### 2. **Agent Inquiries** (`components/agent/agent-inquiries.tsx`)
Agents manage inquiries from interested customers.

**Features:**
- View all inquiries for their listings
- Filter by status (pending, accepted, rejected)
- See customer contact information
- Customer messages about listings
- Accept/reject inquiries
- Real-time toast notifications when inquiries arrive
- Statistics dashboard

**Usage:**
```tsx
import AgentInquiries from '@/components/agent/agent-inquiries';

<AgentInquiries />
```

### Customer Components

#### 1. **Explore Page** (`components/explore/explore.tsx`)
Browse and filter available listings.

**Features:**
- View all active listings from all agents
- Filter by type (house/car) and category (rent/sale)
- Price range filtering
- Search by title, description, or location
- Send inquiries to agents
- Inquiry modal with message
- Real-time updates

**Usage:**
```tsx
import ExplorePage from '@/components/explore/explore';

<ExplorePage />
```

#### 2. **Live Messaging** (`components/messaging/messaging-live.tsx`)
Real-time peer-to-peer messaging between agents and customers.

**Features:**
- Real-time message synchronization
- Conversation list with unread badges
- Search conversations
- Toast notifications on new messages
- Mark messages as read
- Auto-scroll to latest messages

**Usage:**
```tsx
import MessagingLive from '@/components/messaging/messaging-live';

<MessagingLive />
```

## Data Models

### Firestore Collections

#### listings
```typescript
{
  id: string;
  agentId: string;
  type: 'house' | 'car';
  category: 'rent' | 'sale';
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: 'active' | 'inactive';
  views: number;
  inquiries: number;
  // House specific
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  // Car specific
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### inquiries
```typescript
{
  id: string;
  listingId: string;
  agentId: string;
  userId: string;
  listingTitle: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;
}
```

#### userProfiles
```typescript
{
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'agent' | 'customer';
  agentTier?: 'basic' | 'premium' | 'elite';
  agentSince?: Timestamp;
  rating?: number;
  totalListings?: number;
  totalInquiries?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Realtime Database Structure

#### conversations/{conversationId}
```
{
  conversationId: string (userId-agentId)
  participants: {
    userId: string,
    agentId: string
  }
  lastMessage: string
  lastMessageTime: number (timestamp)
  unreadCount: {
    [userId]: number,
    [agentId]: number
  }
  messages: {
    [messageId]: {
      senderId: string,
      senderName: string,
      text: string,
      timestamp: number,
      read: boolean,
      type: 'text' | 'system'
    }
  }
}
```

#### notifications/{userId}
```
{
  notificationId: {
    type: 'inquiry' | 'message' | 'application' | 'system',
    title: string,
    message: string,
    read: boolean,
    timestamp: number,
    data?: {
      listingId?: string,
      inquiryId?: string,
      conversationId?: string
    }
  }
}
```

## Real-Time Features

### 1. Inquiry Notifications
When a customer submits an inquiry:
1. Inquiry is saved to Firestore
2. Notification is sent to agent via Realtime DB
3. Toast appears: "💼 New Inquiry - Customer Name: Sample message..."
4. Agent can accept/reject the inquiry
5. Customer notification is sent

### 2. Message Notifications
When a message is sent:
1. Message is saved to Realtime DB
2. Real-time listener triggers
3. Toast shows: "💬 Sender Name: message preview"
4. Conversation unread count updates
5. Badge appears on messaging icon

### 3. Application Notifications
When a customer applies to a listing:
1. Similar to inquiry flow
2. Toast for agent: "📋 New Application - Property Name"
3. Agent can view details and respond

## Workflow Examples

### Customer Workflow

1. **Browse Listings**
   ```tsx
   // ExplorePage component
   const listings = await getAllListings();
   // Filter and display
   ```

2. **Send Inquiry**
   ```tsx
   await createInquiry(
     listing.id,
     listing.agentId,
     listing.title,
     user.id,
     user.name,
     user.email,
     "I'm interested in this property",
     user.phone
   );
   // Toast shows success
   // Agent receives real-time notification toast
   ```

3. **Message Agent**
   ```tsx
   await sendMessage(
     conversationId,
     userId,
     userName,
     "When can I view it?"
   );
   // Message appears immediately in agent's app (if viewing)
   // Agent gets toast notification
   ```

### Agent Workflow

1. **Create Listing**
   ```tsx
   // AgentListings component
   await createListing(agentId, {
     title: "Luxury Penthouse",
     type: "house",
     category: "rent",
     price: 5000,
     // ... other fields
   });
   // Listing appears in explore page immediately
   ```

2. **Receive Inquiry**
   ```tsx
   // Real-time notification via useInquiryNotification()
   // Toast: "💼 New Inquiry - Customer Name: Short message..."
   // Agent can view in AgentInquiries component
   ```

3. **Accept/Reject Inquiry**
   ```tsx
   // AgentInquiries component
   await updateInquiryStatus(inquiryId, 'accepted');
   // Toast confirms action
   // Customer notification sent
   ```

4. **Message Customer**
   ```tsx
   await sendMessage(conversationId, agentId, agentName, message);
   // Real-time update in customer's messaging
   // Customer gets notification toast
   ```

## Integration Points

### In Your App Layout

```tsx
// app/layout.tsx or your main app file
import { useNotificationListener } from '@/lib/notification-hooks';

export default function RootLayout() {
  // Set up global notification listener
  useNotificationListener();
  
  return (
    <html>
      <body>
        {/* Your app components */}
      </body>
    </html>
  );
}
```

### In Your Routes

```tsx
// app/dashboard/agent/listings/page.tsx
import AgentListings from '@/components/agent/agent-listings';
export default function ListingsPage() {
  return <AgentListings />;
}

// app/dashboard/agent/inquiries/page.tsx
import AgentInquiries from '@/components/agent/agent-inquiries';
export default function InquiriesPage() {
  return <AgentInquiries />;
}

// app/explore/page.tsx
import ExplorePage from '@/components/explore/explore';
export default function Page() {
  return <ExplorePage />;
}

// app/messaging/page.tsx
import MessagingLive from '@/components/messaging/messaging-live';
export default function MessagingPage() {
  return <MessagingLive />;
}
```

## Firebase Security Rules

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Listings - readable by all, writable by agent only
    match /listings/{document=**} {
      allow read: if true;
      allow create, update, delete: if request.auth.uid == resource.data.agentId;
    }

    // Inquiries - agents can read their own, users can create
    match /inquiries/{document=**} {
      allow read: if request.auth.uid == resource.data.agentId || 
                     request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
      allow update: if request.auth.uid == resource.data.agentId;
    }

    // User Profiles - readable by self, writable by self
    match /userProfiles/{document=**} {
      allow read, write: if request.auth.uid == document;
    }
  }
}
```

### Realtime Database Rules

```json
{
  "rules": {
    "conversations": {
      "$conversationId": {
        ".read": "root.child('conversations').child($conversationId).child('participants').child(auth.uid).exists()",
        ".write": "root.child('conversations').child($conversationId).child('participants').child(auth.uid).exists()",
        "messages": {
          ".indexOn": ["timestamp", "read"]
        }
      }
    },
    "notifications": {
      "$userId": {
        ".read": "auth.uid == $userId",
        ".write": "auth.uid == $userId",
        "$notificationId": {
          ".read": true,
          ".write": false
        }
      }
    }
  }
}
```

## Troubleshooting

### Real-time listeners not working?
1. Check Firebase credentials in `.env.local`
2. Ensure Realtime Database is enabled in Firebase Console
3. Verify Security Rules allow access
4. Check browser console for errors

### Toast notifications not showing?
1. Verify `useNotificationListener()` is called in your root layout
2. Check that `ToastProvider` wraps your app
3. Inspect Redux state for notification events

### Inquiries not appearing?
1. Check Firestore for "inquiries" collection
2. Verify `agentId` is correct
3. Check browser network tab for API errors
4. Ensure user is authenticated

### Real-time messages not syncing?
1. Check Realtime Database in Firebase Console
2. Verify conversation ID format (userId-agentId)
3. Check participant UIDs match
4. Verify message listener cleanup on unmount

## Next Steps

1. **Deploy Security Rules** to Firebase Console
2. **Add image uploads** to Firebase Storage
3. **Implement email notifications** alongside toasts
4. **Set up Stripe** for payment processing
5. **Create user profile completion** flow post-signup
6. **Add advanced search** with Firestore indexes
7. **Implement rating/review system** after transactions

## Files Reference

- `lib/firestore-service.ts` - Firestore CRUD operations
- `lib/realtime-service.ts` - Realtime messaging & notifications
- `lib/notification-hooks.ts` - React hooks for notifications
- `components/agent/agent-listings.tsx` - Agent listing management
- `components/agent/agent-inquiries.tsx` - Inquiry management
- `components/explore/explore.tsx` - Browse listings
- `components/messaging/messaging-live.tsx` - Real-time messaging
- `lib/auth-store.ts` - User authentication state (updated)

All components use TypeScript for full type safety and include Framer Motion animations with the liquid glass effect design system.
