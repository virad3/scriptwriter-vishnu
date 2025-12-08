import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
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
    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!isDemoMode) {
        setUser(currentUser);
      }
      setLoading(false);
    }, (error) => {
      // If Firebase fails to init (e.g. invalid config), just stop loading
      console.warn("Auth state change error (expected in demo):", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isDemoMode]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsDemoMode(false);
    } catch (error: any) {
      console.error("Firebase login failed (likely missing config). Falling back to demo mode.", error);
      // Fallback: If actual auth fails (e.g. invalid API key), log in as mock user
      signInAsGuest();
    }
  };

  const signInAsGuest = async () => {
      setIsDemoMode(true);
      setUser(MOCK_USER);
      setLoading(false);
  };

  const signOut = async () => {
    try {
      if (isDemoMode) {
          setUser(null);
          setIsDemoMode(false);
      } else {
          await firebaseSignOut(auth);
      }
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInAsGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};