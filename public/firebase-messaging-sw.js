importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDs9QbuAuJUXMGFoxlM4ejs6--CZaOfw4Q",
  authDomain: "menu-admin-new.firebaseapp.com",
  projectId: "menu-admin-new",
  storageBucket: "menu-admin-new.firebasestorage.app",
  messagingSenderId: "772757852538",
  appId: "1:772757852538:web:6f66d51b788a743b3ac6c3",
  measurementId: "G-P41FPNJDLR",
};

// Initialize the Firebase app in the service worker
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
console.log(messaging);

// Listen for messages in the background
messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification.title;
  
   const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png", 
    image: "/food.jpg",  
    badge: "/badge.png",  
    actions: [
      {
        action: "view",
        title: "عرض التفاصيل",
      },
      {
        action: "dismiss",
        title: "إغلاق",
      },
    ],
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});