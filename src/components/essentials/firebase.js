// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDaKcX2flj4dccXkbqWXPsjY_KZq5x5Mzs",
  authDomain: "finalyear-7d80d.firebaseapp.com",
  projectId: "finalyear-7d80d",
  storageBucket: "finalyear-7d80d.appspot.com",
  messagingSenderId: "1015012666511",
  appId: "1:1015012666511:web:4439e1315f7ea561c554fa",
  measurementId: "G-TWEYGD5X8Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);
const messaging = getMessaging(app);

// Export Modules
export const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        "BJ8Oy6zK1cFDYhMVDbi1IykSJlAy9nllbT3MNX_zLbNki4iAHCMtBQGR9SUZ7YEClYa04Hqv_ltwvnM92TE565A", // Replace with your provided VAPID key
    });
    console.log("FCM Token:", token);
  }
};

onMessage(messaging, (payload) => {
  console.log("New Notification:", payload);
});

export {
  app,
  auth,
  db,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  collection,
  addDoc,
  getDoc,
  getDocs,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  updateProfile,
  storage,
};