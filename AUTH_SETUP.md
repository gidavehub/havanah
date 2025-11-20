# Authentication Setup Guide

## Overview
The Havanah platform uses Firebase Authentication with email/password, optional phone numbers, and Google Sign-In for both users and agents.

## Features
✅ Email & Password Authentication
✅ Optional Phone Number Support
✅ Google Sign-In Integration
✅ Role-based Access (User/Agent)
✅ Real-time Toast Notifications
✅ Secure Credential Storage

## Authentication Flow

### User Registration (Sign Up)
1. **User Type Selection**: Choose between "User" or "Agent"
2. **Fill Form**:
   - Full Name (required)
   - Email (required)
   - Phone Number (optional)
   - Password (min 6 characters)
   - Confirm Password
3. **Agree to Terms**
4. **Account Created**: User is redirected to Explore page (users) or Agent Dashboard (agents)

### User Login
1. **Email**: Enter email address
2. **Password**: Enter password
3. **Remember Me**: Optional checkbox for device memory
4. **Sign In**: Redirects to Explore page
5. **Or Google**: Click "Sign in with Google" for quick login

### Agent Login
Similar to user login but includes:
- Dedicated agent portal
- Agent plan pricing display (Basic, Pro, Premium)
- Redirects to Agent Dashboard instead of Explore

## Firebase Configuration

### Required Environment Variables
```env
# Firebase Configuration (from your Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
```

### Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (havanah)
3. Enable Authentication methods:
   - **Email/Password**: Authentication → Sign-in method → Email/Password → Enable
   - **Google**: Authentication → Sign-in method → Google → Enable
4. Add authorized redirect URIs:
   - `http://localhost:3000`
   - Your production domain

## Implementation Details

### Authentication Store (lib/auth-store.ts)
Uses Zustand for state management with the following methods:

```typescript
const { 
  user,           // Current logged-in user
  loading,        // Loading state
  error,          // Error messages
  login,          // Email/password login
  loginWithGoogle, // Google sign-in
  register,       // Email/password registration
  logout,         // Sign out
  setError,       // Set custom error
  initializeAuth  // Initialize auth listener
} = useAuth();
```

### Supported Methods

#### Email/Password Login
```typescript
await login(email, password);
```

#### Email/Password Registration
```typescript
await register(email, password, role, displayName?, phoneNumber?);
```

#### Google Sign-In
```typescript
await loginWithGoogle(role); // role: 'user' | 'agent'
```

#### Logout
```typescript
await logout();
```

## User Data Structure
```typescript
interface AuthUser {
  id: string;              // Firebase UID
  email: string | null;    // User email
  role: 'user' | 'agent';  // User role
  displayName?: string;    // Full name
  phoneNumber?: string;    // Phone (optional)
}
```

## Toast Notifications

Authentication components use the new Liquid Glass Toast system:

```typescript
import { useToast } from '@/components/toast/toast';

const toast = useToast();

// Success
toast.success('Success!', 'Account created successfully');

// Error
toast.error('Error!', 'Email already in use');

// Warning
toast.warning('Warning!', 'Please fill in all fields');

// Info
toast.info('Info', 'New feature available');

// Loading
const id = toast.loading('Processing', 'Please wait...');
toast.remove(id);
```

## Security Best Practices

1. **Never expose Firebase private keys** in client-side code
2. **Use environment variables** for sensitive credentials
3. **Enable CORS** only for authorized domains
4. **Implement Firebase Security Rules** for Firestore/Database access
5. **Use HTTPS** in production
6. **Enable email verification** for new registrations (optional)
7. **Implement rate limiting** on authentication endpoints

## Troubleshooting

### Google Sign-In Not Working
- Verify Google OAuth is enabled in Firebase Console
- Check redirect URIs are correctly configured
- Ensure Google Cloud API is enabled
- Verify web client credentials

### "Invalid Email" Error
- Check email format is valid
- Ensure email is not already registered
- Firebase may have temporary restrictions

### "Password Too Weak" Error
- Password must be at least 6 characters
- Consider stronger password requirements

### CORS Errors
- Configure authorized domains in Firebase Console
- Update `.firebaserc` for correct project
- Clear browser cache and try again

## File Structure
```
app/
├── auth/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── agent-login/page.tsx
components/
├── auth/
│   ├── login/
│   │   ├── login.tsx
│   │   └── login.module.css
│   ├── signup/
│   │   ├── signup.tsx
│   │   └── signup.module.css
│   └── agent-login/
│       ├── agent-login.tsx
│       └── agent-login.module.css
lib/
├── firebase.ts          # Firebase initialization
├── auth-store.ts        # Zustand auth store
└── theme.ts             # Design tokens
```

## Next Steps

1. Configure Firebase credentials in `.env.local`
2. Test email/password authentication
3. Test Google Sign-In
4. Implement user profile completion after signup (optional)
5. Add email verification flow (optional)
6. Implement password reset (optional)
7. Add social login providers (Facebook, GitHub, etc.)
8. Set up Firestore database for user profiles
