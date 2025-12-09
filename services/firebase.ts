import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// NOTE: For production, you must replace these with your actual Firebase project keys.
// In this demo environment, the app will gracefully fallback to a Mock User if these keys are invalid.
const firebaseConfig = {
  apiKey: "AIzaSyAJCXKYy18pQlNqOG-YgPjs61iODGcE48E",
  authDomain: "writeroom-d7374.firebaseapp.com",
  projectId: "writeroom-d7374",
  storageBucket: "writeroom-d7374.firebasestorage.app",
  messagingSenderId: "819720519948",
  appId: "1:819720519948:web:3e743bd4203c102631c929",
  measurementId: "G-RPP8CXZF6N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;