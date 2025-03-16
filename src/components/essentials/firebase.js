// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaKcX2flj4dccXkbqWXPsjY_KZq5x5Mzs",
  authDomain: "finalyear-7d80d.firebaseapp.com",
  projectId: "finalyear-7d80d",
  storageBucket: "finalyear-7d80d.firebasestorage.app",
  messagingSenderId: "1015012666511",
  appId: "1:1015012666511:web:4439e1315f7ea561c554fa",
  measurementId: "G-TWEYGD5X8Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, serverTimestamp };