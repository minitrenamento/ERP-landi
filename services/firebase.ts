
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDf2Z4J_a_2Em5K2Aq5SZ6ns1HNcKzNzy0",
  authDomain: "landi-consultores-erp.firebaseapp.com",
  projectId: "landi-consultores-erp",
  storageBucket: "landi-consultores-erp.firebasestorage.app",
  messagingSenderId: "408643116444",
  appId: "1:408643116444:web:594ce5ee8b24f565c43c59",
  measurementId: "G-9GZGDBEQ3F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
