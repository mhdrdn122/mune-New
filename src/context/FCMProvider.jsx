import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import notify from '../utils/useNotification';
 
// Initialize Firebase once outside the component
// const firebaseConfig = {
//     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//     appId: import.meta.env.VITE_FIREBASE_APP_ID,
//     measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyDs9QbuAuJUXMGFoxlM4ejs6--CZaOfw4Q",

  authDomain: "menu-admin-new.firebaseapp.com",

  projectId: "menu-admin-new",

  storageBucket: "menu-admin-new.firebasestorage.app",

  messagingSenderId: "772757852538",

  appId: "1:772757852538:web:6f66d51b788a743b3ac6c3",

  measurementId: "G-P41FPNJDLR",
};

// const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

const vapidKey = "BKORvUdCTNo8PnMfhuSvyGnb-11j1S1_knc-11zOPJXu54C5Yv30Xu3Fwzi3Dgt5yHJ0u_TH9g4ZZqgZFMpyhSo";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Create the Context
const FCMContext = createContext();

// Create the Context Provider component
export const FCMProvider = ({ children }) => {
    const [fcmToken, setFcmToken] = useState("");
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState("Loading...");

    console.log(fcmToken)
    useEffect(() => {
        // Request notification permission and get the token
        const requestPermissionAndGetToken = async () => {
            try {
                setStatus("Requesting notification permission...");
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    console.log('Permission granted!');
                    setStatus("Permission granted. Getting token...");
                    const currentToken = await getToken(messaging, { vapidKey });
                    if (currentToken) {
                        setFcmToken(currentToken);
                        setStatus("Token obtained successfully.");
                        console.log("FCM Token:", currentToken);
                    } else {
                        console.log("No registration token available.");
                        setStatus("Failed to get token. Check Firebase settings.");
                    }
                } else {
                    console.log('Permission not granted!');
                    setStatus("Permission not granted. Notifications will not be received.");
                }
            } catch (err) {
                console.error("Error getting FCM token:", err);
                setStatus("An error occurred while getting the token.");
            }
        };

        requestPermissionAndGetToken();

        // Set up the listener for incoming messages
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Foreground message received:', payload);

            const newNotification = {
                title: payload.notification?.title || 'New Notification',
                body: payload.notification?.body || 'Empty message',
                data: payload.data,
            };
            if(newNotification)
            notify(newNotification?.title, "success")
            // Use a functional update to avoid stale state issues
            setMessages(prevMessages => [...prevMessages, newNotification]);
            setStatus("New notification received!");
        });

        // Cleanup function for the listener
        return () => unsubscribe();
    }, []); // Empty dependency array ensures this effect runs only once

    const value = {
        fcmToken,
        messages,
        status 
         
    };

    return <FCMContext.Provider value={value}>
        <div>
                 {children}
        {/* <ToastContainer /> */}
        </div>
   
    </FCMContext.Provider>;
};

// A custom hook to access FCM data from any component without importing createContext
export const useNotificationFromFirebase = () => {
    return useContext(FCMContext);
};