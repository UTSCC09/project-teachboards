// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDjwwn1vo3g1KUV7p3stN2uq3_Vy6EKHZ8",
  authDomain: "teachboards.firebaseapp.com",
  projectId: "teachboards",
  storageBucket: "teachboards.firebasestorage.app",
  messagingSenderId: "592752228990",
  appId: "1:592752228990:web:c666b6733e5ff8d1ccb62f",
  measurementId: "G-7Z7449S4Z5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);
const db = getFirestore(app);
export {app, firestore, auth, db};
export { createUserWithEmailAndPassword, signInWithEmailAndPassword };