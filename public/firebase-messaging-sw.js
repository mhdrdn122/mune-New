// // Import Firebase scripts

// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyCbwKtnIlHD45RVvrZct9aNtFFEh8SnvEk",
//     authDomain: "menu-new-version.firebaseapp.com",
//     projectId: "menu-new-version",
//     storageBucket: "menu-new-version.firebasestorage.app",
//     messagingSenderId: "942258237966",
//     appId: "1:942258237966:web:1d2ce3d8dd373e8b72425f",
// };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

// // Handle background messages
// messaging.onBackgroundMessage((payload) => {
//     console.log("Received background message: ", payload);

//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: payload.notification.icon,
//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
// });
