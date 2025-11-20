import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth';
import { getAuthInstance } from '@/lib/firebase';

export type UserRole = 'user' | 'agent';

export interface AuthUser {
  id: string;
  email: string | null;
  role: UserRole;
  displayName?: string | null;
  phoneNumber?: string | null;
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

export const useAuth = create<AuthState>((set: any) => {
  // Initialize auth listener
  if (typeof window !== 'undefined') {
    const auth = getAuthInstance();
    onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        // In a real app, you'd fetch the role from Firestore
        set({
          user: {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            role: 'user', // Default role, should be fetched from DB
          },
          loading: false,
        });
      } else {
        set({ user: null, loading: false });
      }
    });
  }

  return {
    user: null,
    loading: true,
    error: null,

    register: async (email: string, password: string, role: UserRole, displayName?: string, phoneNumber?: string) => {
      try {
        set({ error: null, loading: true });
        const auth = getAuthInstance();
        const result = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update profile with display name if provided
        if (displayName) {
          await updateProfile(result.user, { displayName });
        }
        
        set({
          user: {
            id: result.user.uid,
            email: result.user.email,
            role,
            displayName: displayName || result.user.displayName,
            phoneNumber,
          },
          loading: false,
        });
      } catch (error: any) {
        set({
          error: error.message || 'Registration failed',
          loading: false,
        });
        throw error;
      }
    },

    login: async (email: string, password: string) => {
      try {
        set({ error: null, loading: true });
        const auth = getAuthInstance();
        const result = await signInWithEmailAndPassword(auth, email, password);
        set({
          user: {
            id: result.user.uid,
            email: result.user.email,
            role: 'user',
            displayName: result.user.displayName,
            phoneNumber: result.user.phoneNumber,
          },
          loading: false,
        });
      } catch (error: any) {
        set({
          error: error.message || 'Login failed',
          loading: false,
        });
        throw error;
      }
    },

    loginWithGoogle: async (role: UserRole) => {
      try {
        set({ error: null, loading: true });
        const auth = getAuthInstance();
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        
        set({
          user: {
            id: result.user.uid,
            email: result.user.email,
            role,
            displayName: result.user.displayName,
            phoneNumber: result.user.phoneNumber,
          },
          loading: false,
        });
      } catch (error: any) {
        set({
          error: error.message || 'Google login failed',
          loading: false,
        });
        throw error;
      }
    },

    logout: async () => {
      try {
        set({ error: null, loading: true });
        const auth = getAuthInstance();
        await signOut(auth);
        set({ user: null, loading: false });
      } catch (error: any) {
        set({
          error: error.message || 'Logout failed',
          loading: false,
        });
        throw error;
      }
    },

    setError: (error: string | null) => {
      set({ error });
    },

    initializeAuth: () => {
      // Auth is initialized in onAuthStateChanged listener above
    },
  };
});
