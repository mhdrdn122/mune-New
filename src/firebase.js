// import {initializeApp} from "firebase/app"
// import {getMessaging,getToken,onMessage} from "firebase/messaging"

// const firebaseConfig = {
//     apiKey: "AIzaSyCbwKtnIlHD45RVvrZct9aNtFFEh8SnvEk",
//     authDomain: "menu-new-version.firebaseapp.com",
//     projectId: "menu-new-version",
//     storageBucket: "menu-new-version.firebasestorage.app",
//     messagingSenderId: "942258237966",
//     appId: "1:942258237966:web:1d2ce3d8dd373e8b72425f"
//   };
  

// //Initialize Firebase 
// const app = initializeApp(firebaseConfig)
// const messaging = getMessaging(app)


// const vapidKey="BCfPW7sPQCYWyrRVgHvIza1JbkUa9RDNyt2uFbuacd0nLCz4283R8GJKbChKMp7oxVP4ZVRNWSHvjgvq5BDqvms";

// export const requestFCMToken=async()=>{
//     return Notification.requestPermission()
//     .then((permission)=>{
//         if(permission==="granted"){
//             console.log('notification is granted')
//             return getToken(messaging,{vapidKey})
//         } else{
//             throw new Error("Notification not granted");
//         }
//     })
//     .catch((err)=>{
//         console.log('Error getting FCM Token : ',err)
//         throw err;
//     })
// }

// // Request notification permission and get the token
// export const requestPermission = async () => {
//     console.log("Requesting permission...");
//     try {
//         const status = await Notification.requestPermission();
//         if (status === "granted") {
//             const token = await getToken(messaging, {
//                 vapidKey: 
//                 "BCfPW7sPQCYWyrRVgHvIza1JbkUa9RDNyt2uFbuacd0nLCz4283R8GJKbChKMp7oxVP4ZVRNWSHvjgvq5BDqvms",
//             });
//             if (token) {
//                 console.log("FCM Token:", token);
//                 return token; // Send this token to your backend (Laravel)
//             } else {
//                 console.log("No registration token available.");
//             }
//         } else {
//             console.log("Permission not granted.");
//         }
//     } catch (err) {
//         console.error("Error requesting permission or fetching token:", err);
//     }
// };

// // Listener for foreground messages
// export const onMessageListener = () =>
//     new Promise((resolve) => {
//         // onMessage(messaging, (payload) => {
//         //     console.log("Foreground message received:", payload);
//         //     resolve(payload);
//         // });
//     });
