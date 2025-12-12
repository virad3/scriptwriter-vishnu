import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// ------------------------------------------------------------------
// CONFIGURATION INSTRUCTIONS
// ------------------------------------------------------------------
// To enable real Google Sign-In and database storage:
// 1. Create a project at https://console.firebase.google.com/
// 2. Add a "Web App" to your project.
// 3. Copy the 'firebaseConfig' object below.
// 4. IMPORTANT: Add your current domain to Firebase Console -> Authentication -> Settings -> Authorized Domains.
//    (If you are seeing "auth/unauthorized-domain" error, this is the missing step)
// 5. Replace the values below with your actual credentials.
// ------------------------------------------------------------------

const getEnvVar = (key: string) => {
  try {
    return typeof process !== 'undefined' ? process.env?.[key] : undefined;
  } catch (e) {
    return undefined;
  }
};

const firebaseConfig = {
  apiKey: "AIzaSyAJCXKYy18pQlNqOG-YgPjs61iODGcE48E",
  authDomain: "writeroom-d7374.firebaseapp.com",
  projectId: "writeroom-d7374",
  storageBucket: "writeroom-d7374.firebasestorage.app",
  messagingSenderId: "819720519948",
  appId: "1:819720519948:web:3e743bd4203c102631c929",
  measurementId: "G-RPP8CXZF6N"
};

// Determines if the app is configured with real credentials or running in demo mode
export const isFirebaseReady = firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";

let app;
let auth: Auth;
let googleProvider: GoogleAuthProvider;
let db: Firestore;

if (isFirebaseReady) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
    // Fallback to avoid crash if config is invalid but apiKey was changed
    app = {} as any;
    auth = {} as Auth;
    db = {} as Firestore;
    googleProvider = {} as GoogleAuthProvider;
  }
} else {
  // Mock objects for Demo Mode
  app = {} as any;
  auth = {} as Auth;
  db = {} as Firestore;
  googleProvider = {} as GoogleAuthProvider;
}

export { auth, googleProvider, db };
export default app;