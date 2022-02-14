import { initializeApp } from "firebase/app";
import { onAuthStateChanged, signInWithEmailAndPassword, getAuth, signOut } from "firebase/auth";
import { ref as sRef, set as sSet, onValue, getDatabase } from "firebase/database";

const dbSettings = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
}

//firebase
const appDB = initializeApp(dbSettings);
export const database = getDatabase(appDB);
export const auth = getAuth(appDB);
export const eventsRefDB = sRef(database, 'events');
export { onValue, onAuthStateChanged, signInWithEmailAndPassword, signOut, sSet };