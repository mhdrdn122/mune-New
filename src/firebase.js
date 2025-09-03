// import {initializeApp} from "firebase/app"
// import {getMessaging,getToken,onMessage} from "firebase/messaging"

 

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyC_-w7vJ2Ne5ViQ6vA7ebLZvaig6H3svhM",
//   authDomain: "portofolio-69ada.firebaseapp.com",
//   projectId: "portofolio-69ada",
//   storageBucket: "portofolio-69ada.firebasestorage.app",
//   messagingSenderId: "1028040176666",
//   appId: "1:1028040176666:web:f1ebad59eea49fdca5cda3"
// };
// const app = initializeApp(firebaseConfig);

// //Initialize Firebase 
 
// const messaging = getMessaging(app)


// const vapidKey="BNd15I9rLt23q7Gm_STjBzD1erClGTI4rxbf5AV0YvV2WTvjBKcGQaXZxqp1Y6OG6xIlKiUEfQaOrctKEzLn86s";

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
//                 "BNd15I9rLt23q7Gm_STjBzD1erClGTI4rxbf5AV0YvV2WTvjBKcGQaXZxqp1Y6OG6xIlKiUEfQaOrctKEzLn86s",
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
//         onMessage(messaging, (payload) => {
//             console.log("Foreground message received:", payload);
//             resolve(payload);
//         });
//     });
