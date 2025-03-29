importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js'); // Replace with your Firebase version
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js'); // Replace with your Firebase version

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaKcX2flj4dccXkbqWXPsjY_KZq5x5Mzs",
  authDomain: "finalyear-7d80d.firebaseapp.com",
  projectId: "finalyear-7d80d",
  storageBucket: "finalyear-7d80d.firebasestorage.app",
  messagingSenderId: "1015012666511",
  appId: "1:1015012666511:web:4439e1315f7ea561c554fa",
  measurementId: "G-TWEYGD5X8Q"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});