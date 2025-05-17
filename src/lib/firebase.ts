import { initializeApp } from 'firebase/app';
import { getFirestore }  from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// 1️⃣  paste your own config here — keep the keys, change the values
const firebaseConfig = {
  apiKey: "AIzaSyDzbajlvZ69f-qjM8IV_JiQo_kEGpp7sAI",
  authDomain: "resistance-app-970fb.firebaseapp.com",
  projectId: "resistance-app-970fb",
  storageBucket: "resistance-app-970fb.firebasestorage.app",
  messagingSenderId: "252089312753",
  appId: "1:252089312753:web:0c78988195718d67bc1050",
  measurementId: "G-MZQNFKK0TW"
};

const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

// Anonymous login as soon as any React component imports this file
signInAnonymously(auth).catch(console.error);
