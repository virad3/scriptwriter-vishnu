import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// NOTE: For production, you must replace these with your actual Firebase project keys.
// In this demo environment, the app will gracefully fallback to a Mock User if these keys are invalid.
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
  authDomain: "writeroom-demo.firebaseapp.com",
  projectId: "writeroom-demo",
  storageBucket: "writeroom-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;