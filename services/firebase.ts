import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';

// NOTE: For production, you must replace these with your actual Firebase project keys.
const firebaseConfig = {
  apiKey: "AIzaSyAJCXKYy18pQlNqOG-YgPjs61iODGcE48E",
  authDomain: "writeroom-d7374.firebaseapp.com",
  projectId: "writeroom-d7374",
  storageBucket: "writeroom-d7374.firebasestorage.app",
  messagingSenderId: "819720519948",
  appId: "1:819720519948:web:3e743bd4203c102631c929",
  measurementId: "G-RPP8CXZF6N"
};

// Check if the API key is still the placeholder
export const isFirebaseReady = firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";

let app;
let auth: Auth;
let googleProvider: GoogleAuthProvider;

if (isFirebaseReady) {
  // Only initialize if we have a (presumably) valid key
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} else {
  // Export mock/empty objects so imports don't fail, but they shouldn't be used
  // because AuthContext checks isFirebaseReady
  app = {} as any;
  auth = {} as Auth;
  googleProvider = {} as GoogleAuthProvider;
}

export { auth, googleProvider };
export default app;