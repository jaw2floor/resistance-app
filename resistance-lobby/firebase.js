// Put your real config between the { } braces
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzbajlvZ69f-qjM8IV_JiQo_kEGpp7sAI",
  authDomain: "resistance-app-970fb.firebaseapp.com",
  projectId: "resistance-app-970fb",
  storageBucket: "resistance-app-970fb.firebasestorage.app",
  messagingSenderId: "252089312753",
  appId: "1:252089312753:web:0c78988195718d67bc1050",
  measurementId: "G-MZQNFKK0TW"
};

export const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

// Silent sign-in (kicks off immediately)
signInAnonymously(auth).catch(console.error);
