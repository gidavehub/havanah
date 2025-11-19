# 🚀 Firebase & ModemPay Complete Integration Guide

## ✅ What's Been Set Up

### 1. Firebase Configuration ✅
- **Firebase Project**: havanah-478715
- **Authentication**: Email/Password, OAuth ready
- **Firestore Database**: Connected and initialized
- **Cloud Storage**: Ready for image uploads
- **Analytics**: Configured for event tracking

### 2. ModemPay Payment Integration ✅
- **Public Key**: Configured
- **Secret Key**: Configured
- **Merchant ID**: 2486308984
- **Payment Processing**: Complete
- **Webhook Handler**: Ready for notifications

### 3. Firestore Collections
All collections are ready for real-time data sync:

```
/users/{uid}
  - User profiles
  - Agent profiles with business info
  - Banking details (agents)

/listings/{id}
  - Service listings
  - Pricing in GMD
  - Availability schedules
  - Images and tags

/bookings/{id}
  - Service bookings
  - Status tracking
  - Payment info
  - Feedback

/payments/{id}
  - Payment records
  - Transaction tracking
  - Receipt URLs

/conversations/{id}/messages/{msgId}
  - Real-time messaging
  - User-to-agent communication
  - Read receipts

/reviews/{id}
  - Service reviews
  - Ratings (1-5 stars)
  - Verification status
```

### 4. API Routes Created

#### POST `/api/checkout`
Initialize payment for a booking
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "booking_123",
    "userId": "user_456",
    "agentId": "agent_789",
    "amount": 2500,
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+22266123456",
    "description": "Plumbing Service"
  }'
```

#### POST `/api/verify-payment`
Verify payment completion
```bash
curl -X POST http://localhost:3000/api/verify-payment \
  -H "Content-Type: application/json" \
  -d '{"reference": "BKG_booking_123_xyz"}'
```

#### POST `/api/webhooks/modem-pay`
Receives payment notifications from ModemPay

---

## 📖 Usage Examples

### 1. Create a Listing

```typescript
import { listingService } from '@/lib/services/firestore';

const listingId = await listingService.create('agent_id_123', {
  title: 'Professional Plumbing Service',
  description: 'Professional plumbing repairs and installations',
  category: 'plumbing',
  price: 2500, // GMD
  duration: 60, // minutes
  images: ['url1', 'url2'],
  tags: ['repairs', 'installation', 'emergency'],
  rating: 4.5,
  totalReviews: 42,
  availability: {
    monday: { start: '08:00', end: '17:00', available: true },
    // ... other days
  },
  active: true,
});
```

### 2. Create a Booking

```typescript
import { bookingService } from '@/lib/services/firestore';

const bookingId = await bookingService.create({
  listingId: 'listing_123',
  userId: 'user_456',
  userName: 'John Doe',
  userEmail: 'john@example.com',
  userPhone: '+22266123456',
  agentId: 'agent_789',
  agentName: 'Ahmed Plumbing',
  agentPhone: '+22266789012',
  serviceTitle: 'Professional Plumbing Service',
  price: 2500,
  duration: 60,
  status: 'pending',
  scheduledDate: new Date('2025-12-20'),
  scheduledTime: '10:00',
  location: 'Banjul, Gambia',
  notes: 'Leaking kitchen tap',
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

### 3. Process Payment

```typescript
import { modemPayService } from '@/lib/services/modem-pay';

// Initialize payment
const paymentResult = await modemPayService.initializePayment({
  amount: 2500,
  currency: 'GMD',
  reference: 'BKG_booking_123_xyz',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '+22266123456',
  description: 'Booking #booking_123 - Plumbing Service',
  metadata: { bookingId: 'booking_123' },
});

if (paymentResult.success) {
  // Redirect user to payment authorization URL
  window.location.href = paymentResult.data.authorizationUrl;
}

// Verify payment (after user returns)
const verifyResult = await modemPayService.verifyPayment(reference);
if (verifyResult.success) {
  console.log('Payment verified!', verifyResult.data);
}
```

### 4. Real-time Bookings Hook

```typescript
'use client';
import { useUserBookings } from '@/hooks/useFirestore';

export function MyBookings() {
  const { bookings, loading, error } = useUserBookings('user_456');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {bookings.map((booking) => (
        <div key={booking.id}>
          <h3>{booking.serviceTitle}</h3>
          <p>Status: {booking.status}</p>
          <p>Price: {booking.price} GMD</p>
          <p>Scheduled: {booking.scheduledDate.toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
```

### 5. Send Message

```typescript
import { messageService } from '@/lib/services/firestore';

// Get or create conversation
const conversationId = await messageService.getOrCreateConversation('user_456', 'agent_789');

// Send message
const messageId = await messageService.sendMessage(conversationId, {
  conversationId,
  senderId: 'user_456',
  senderName: 'John Doe',
  receiverId: 'agent_789',
  text: 'Hi, I need a plumbing service',
  read: false,
  createdAt: new Date(),
});
```

### 6. Real-time Messages Hook

```typescript
'use client';
import { useMessages } from '@/hooks/useFirestore';

export function ChatBox({ conversationId }: { conversationId: string }) {
  const { messages, loading } = useMessages(conversationId);

  if (loading) return <div>Loading messages...</div>;

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id} className={msg.senderId === 'current_user' ? 'sent' : 'received'}>
          <p>{msg.senderName}</p>
          <p>{msg.text}</p>
          <small>{msg.createdAt.toLocaleTimeString()}</small>
        </div>
      ))}
    </div>
  );
}
```

### 7. Create Review

```typescript
import { reviewService } from '@/lib/services/firestore';

const reviewId = await reviewService.create({
  listingId: 'listing_123',
  bookingId: 'booking_123',
  userId: 'user_456',
  userName: 'John Doe',
  agentId: 'agent_789',
  rating: 5,
  comment: 'Excellent service! Very professional and quick.',
  verified: true,
});
```

### 8. Get Featured Listings

```typescript
'use client';
import { useFeaturedListings } from '@/hooks/useFirestore';

export function FeaturedServices() {
  const { listings, loading } = useFeaturedListings(12);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid">
      {listings.map((listing) => (
        <div key={listing.id}>
          <h3>{listing.title}</h3>
          <p className="price">{listing.price} GMD</p>
          <p className="rating">⭐ {listing.rating}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔐 Firebase Security Rules

### Recommended Firestore Rules

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own profile
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }

    // Allow anyone to read public listings
    match /listings/{listingId} {
      allow read: if true;
      allow create, update: if request.auth != null && request.auth.uid == resource.data.agentId;
      allow delete: if request.auth.uid == resource.data.agentId;
    }

    // Allow users to read/write their own bookings
    match /bookings/{bookingId} {
      allow read: if request.auth.uid == resource.data.userId || request.auth.uid == resource.data.agentId;
      allow create: if request.auth.uid == request.resource.data.userId;
      allow update: if request.auth.uid == resource.data.userId || request.auth.uid == resource.data.agentId;
    }

    // Allow users to read/write their own payments
    match /payments/{paymentId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }

    // Allow users to read/write their conversations
    match /conversations/{conversationId} {
      allow read, write: if request.auth.uid in resource.data.participantIds;
      
      match /messages/{messageId} {
        allow read, write: if request.auth.uid in get(/databases/$(database)/documents/conversations/$(conversationId)).data.participantIds;
      }
    }

    // Allow users to read reviews
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 🔑 Environment Variables Checklist

```env
✅ NEXT_PUBLIC_FIREBASE_API_KEY=
✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID=
✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
✅ NEXT_PUBLIC_FIREBASE_APP_ID=
✅ NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

✅ NEXT_PUBLIC_MODEM_PAY_PUBLIC_KEY=
✅ MODEM_PAY_SECRET_KEY=
✅ NEXT_PUBLIC_MODEM_PAY_MERCHANT_ID=

✅ NEXT_PUBLIC_APP_NAME=Havanah
✅ NEXT_PUBLIC_APP_URL=http://localhost:3000
✅ NODE_ENV=development
```

---

## 🧪 Testing Payment Flow

### Step 1: Create Test Booking
1. Navigate to agent dashboard
2. Create a service listing
3. Switch to customer and browse listings
4. Create a booking

### Step 2: Initiate Payment
```typescript
// In your checkout component
const response = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    bookingId: 'test_booking_123',
    userId: 'test_user',
    agentId: 'test_agent',
    amount: 100, // Test amount: 100 GMD
    customerName: 'Test User',
    customerEmail: 'test@example.com',
    customerPhone: '+22266123456',
  }),
});

const data = await response.json();
// Redirect to payment authorization URL
window.location.href = data.data.authorizationUrl;
```

### Step 3: Verify Payment
```typescript
const response = await fetch('/api/verify-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ reference: 'BKG_test_booking_123_xyz' }),
});

const result = await response.json();
console.log('Payment verified:', result.data);
```

---

## 📊 Monitoring & Analytics

### Track User Actions
```typescript
import { userActivityService } from '@/lib/services/firestore';

// Log when user views a listing
await db.collection('activities').add({
  userId: 'user_456',
  action: 'viewed_listing',
  listingId: 'listing_123',
  category: 'plumbing',
  timestamp: new Date(),
});
```

### Get Agent Earnings
```typescript
// Get agent's total earnings
const agentBookings = await bookingService.getByAgent('agent_789');
const totalEarnings = agentBookings
  .filter(b => b.status === 'completed')
  .reduce((sum, b) => sum + b.price, 0);
```

---

## 🐛 Troubleshooting

### Firebase Connection Issues
- Check `.env.local` has all Firebase credentials
- Verify Firebase project is active in Google Cloud Console
- Check firestore database is created and not in maintenance

### ModemPay Payment Errors
- Verify merchant ID matches your ModemPay dashboard
- Check API keys are correct in `.env.local`
- Ensure customer phone has proper format (+2226...)
- Test with ModemPay sandbox first

### Real-time Updates Not Working
- Check browser console for auth errors
- Verify Firestore security rules allow read access
- Check network tab for Firestore calls
- Ensure user is authenticated

---

## 🚀 Next Steps

1. **Set up Firestore Security Rules** (Copy from above)
2. **Test Authentication Flow** (Login/Signup with Firebase)
3. **Create Test Bookings** (Agent -> Customer flow)
4. **Test Payment Processing** (Full checkout flow)
5. **Deploy to Vercel** (Add env vars to production)
6. **Monitor Webhook Events** (Track payment notifications)

---

## 📞 Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [ModemPay API Docs](https://www.modeempay.com/api)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

**🎉 Everything is set up and ready to go!**

Run `npm install && npm run dev` to start developing with real Firebase and ModemPay integration!
