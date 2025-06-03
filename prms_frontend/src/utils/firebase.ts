import { FirebaseOptions, initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_WEB_API_KEY,
  // authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

console.log("HEYYYY 1111", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,  firebaseConfig)

const firebaseApp  = initializeApp(firebaseConfig)
const firebaseDb = getFirestore(firebaseApp);

export { firebaseDb }