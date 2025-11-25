import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getAuthInstance } from '@/lib/firebase';
import { createUserProfile, getUserProfile } from '@/lib/firestore-service';

export type UserRole = 'user' | 'agent';

export interface AuthUser {
  id: string;
  email: string | null;
  role: UserRole;
  displayName?: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  register: (email: string, password: string, role: UserRole, displayName?: string, phoneNumber?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  setError: (error: string | null) => void;
  initializeAuth: () => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,

  register: async (email: string, password: string, role: UserRole, displayName?: string, phoneNumber?: string) => {
    try {
      set({ error: null, loading: true });
      const auth = getAuthInstance();
      const result = await createUserWithEmailAndPassword(auth, email, password);

      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      try {
        // Create Firestore user profile
        await createUserProfile({
          uid: result.user.uid,
          email: result.user.email || email,
          displayName: displayName || result.user.displayName || 'New User',
          phoneNumber: phoneNumber || undefined,
          role,
          profileImage: result.user.photoURL || undefined,
        });
        console.log('✅ Signup profile created in Firestore');
      } catch (firestoreError: any) {
        console.error('Error creating Firestore profile during signup:', firestoreError);
        throw new Error(`Failed to create user profile: ${firestoreError?.message}`);
      }

      // onAuthStateChanged listener will handle setting user state
      set({ loading: false });
    } catch (error: any) {
      set({ error: error?.message || 'Registration failed', loading: false });
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ error: null, loading: true });
      const auth = getAuthInstance();
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle the rest
      set({ loading: false });
    } catch (error: any) {
      set({ error: error?.message || 'Login failed', loading: false });
      throw error;
    }
  },

  loginWithGoogle: async (role: UserRole) => {
    try {
      set({ error: null, loading: true });
      const auth = getAuthInstance();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      try {
        // Check if Firestore profile exists
        const existing = await getUserProfile(result.user.uid);

        // If profile doesn't exist, create it
        if (!existing) {
          await createUserProfile({
            uid: result.user.uid,
            email: result.user.email || '',
            displayName: result.user.displayName || 'Google User',
            phoneNumber: result.user.phoneNumber || undefined,
            role,
            profileImage: result.user.photoURL || undefined,
          });
          console.log('✅ Google user profile created in Firestore');
        } else {
          console.log('✅ Google user profile already exists');
        }
      } catch (firestoreError: any) {
        console.error('Error managing Firestore profile during Google login:', firestoreError);
        throw new Error(`Profile creation failed: ${firestoreError?.message}`);
      }

      // onAuthStateChanged will handle setting the user state
      set({ loading: false });
    } catch (error: any) {
      set({ error: error?.message || 'Google login failed', loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ error: null });
      const auth = getAuthInstance();
      await signOut(auth);
      set({ user: null });
    } catch (error: any) {
      set({ error: error?.message || 'Logout failed' });
      throw error;
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  initializeAuth: () => {
    const auth = getAuthInstance();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      try {
        if (!firebaseUser) {
          set({ user: null, loading: false });
          return;
        }

        // Load or create Firestore profile
        let profile = await getUserProfile(firebaseUser.uid);

        // Ensure profile exists (fallback for users who signed up before this fix)
        if (!profile) {
          console.log('Profile not found, creating fallback profile for:', firebaseUser.uid);
          try {
            await createUserProfile({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'New User',
              phoneNumber: firebaseUser.phoneNumber || undefined,
              role: 'user',
              profileImage: firebaseUser.photoURL || undefined,
            });
            // Fetch the newly created profile
            profile = await getUserProfile(firebaseUser.uid);
            console.log('✅ Fallback profile created successfully');
          } catch (createError: any) {
            console.error('Error creating fallback profile:', createError);
          }
        }

        const userObj: AuthUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          role: profile?.role || 'user',
          displayName: firebaseUser.displayName,
          phoneNumber: firebaseUser.phoneNumber,
          photoURL: firebaseUser.photoURL,
        };

        console.log('✅ Auth state updated with user:', userObj);
        set({ user: userObj, loading: false });
      } catch (error: any) {
        console.error('Error in onAuthStateChanged:', error);
        set({ error: error?.message || 'Auth initialization failed', loading: false });
      }
    });

    // Return unsubscribe function for cleanup
    return unsubscribe;
  },
}));