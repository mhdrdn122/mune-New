importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_-w7vJ2Ne5ViQ6vA7ebLZvaig6H3svhM",
  authDomain: "portofolio-69ada.firebaseapp.com",
  projectId: "portofolio-69ada",
  storageBucket: "portofolio-69ada.firebasestorage.app",
  messagingSenderId: "1028040176666",
  appId: "1:1028040176666:web:f1ebad59eea49fdca5cda3"
};

// Initialize the Firebase app in the service worker
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
console.log(messaging)
// Listen for messages in the background
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});