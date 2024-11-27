// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export {app, firestore};

// Custom hook for Firestore operations
export function useFirestore() {
    const firestore = getFirestore(); // Assuming you're using the new modular API

    return { firestore };
}