import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseReady } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signInAsGuest: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Mock User for Demo Mode when Firebase is not configured
const MOCK_USER = {
  uid: 'demo-user-123',
  displayName: 'Screenwriter One',
  email: 'writer@writeroom.ai',
  photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({} as any),
  reload: async () => {},
  toJSON: () => ({}),
  phoneNumber: null,
  providerId: 'google.com'
} as unknown as User;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // If Firebase isn't configured, skip initialization to avoid errors
    if (!isFirebaseReady) {
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!isDemoMode) {
        setUser(currentUser);
      }
      setLoading(false);
    }, (error) => {
      console.warn("Auth state error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isDemoMode]);

  const signInWithGoogle = async () => {
    if (!isFirebaseReady) {
        console.log("Firebase not configured. Using Guest Mode.");
        await signInAsGuest();
        return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
      setIsDemoMode(false);
    } catch (error: any) {
      console.error("Firebase login failed. Falling back to demo mode.", error);
      await signInAsGuest();
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
      if (!isFirebaseReady) {
          await signInAsGuest();
          return;
      }
      try {
          await signInWithEmailAndPassword(auth, email, pass);
          setIsDemoMode(false);
      } catch (error: any) {
          throw error;
      }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
      if (!isFirebaseReady) {
          await signInAsGuest();
          // Mock display name update
          setUser(prev => prev ? ({...prev, displayName: name} as User) : MOCK_USER);
          return;
      }
      try {
          const result = await createUserWithEmailAndPassword(auth, email, pass);
          await updateProfile(result.user, { displayName: name });
          setIsDemoMode(false);
          setUser({ ...result.user, displayName: name });
      } catch (error: any) {
          throw error;
      }
  };

  const signInAsGuest = async () => {
      setIsDemoMode(true);
      setUser(MOCK_USER);
      setLoading(false);
  };

  const signOut = async () => {
    try {
      setUser(null);
      setIsDemoMode(false);
      if (isFirebaseReady) {
        await firebaseSignOut(auth).catch(() => {}); 
      }
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signInAsGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};