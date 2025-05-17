// src/utils/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
// only load analytics in the browser
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey:             process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:         process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId:  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:              process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId:      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
  databaseURL:        process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!,
};

// initializeApp returns the same instance if already called
export const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

// Realtime Database instance
export const db = getDatabase(firebaseApp);

// Analytics only on the client
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(firebaseApp);
}