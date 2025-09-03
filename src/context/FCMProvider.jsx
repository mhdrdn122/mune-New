import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC_-w7vJ2Ne5ViQ6vA7ebLZvaig6H3svhM",
    authDomain: "portofolio-69ada.firebaseapp.com",
    projectId: "portofolio-69ada",
    storageBucket: "portofolio-69ada.firebasestorage.app",
    messagingSenderId: "1028040176666",
    appId: "1:1028040176666:web:f1ebad59eea49fdca5cda3"
};

// VAPID key from your Firebase project
const vapidKey = "BNd15I9rLt23q7Gm_STjBzD1erClGTI4rxbf5AV0YvV2WTvjBKcGQaXZxqp1Y6OG6xIlKiUEfQaOrctKEzLn86s";

// Create the Context
const FCMContext = createContext();
 

// Create the Context Provider component
export const FCMProvider = ({ children }) => {
    const [fcmToken, setFcmToken] = useState(null);
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState("جاري التحميل...");
    const app = initializeApp(firebaseConfig);

    const messaging = getMessaging(app);

    useEffect(() => {
        // Initialize Firebase and Messaging services
        const app = initializeApp(firebaseConfig);
        const messaging = getMessaging(app);
        console.log(messaging)

        const requestPermissionAndGetToken = async () => {
            try {
                setStatus("جاري طلب إذن الإشعارات...");
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    console.log('Permission granted!');
                    setStatus("تم منح الإذن. جاري الحصول على التوكن...");
                    const currentToken = await getToken(messaging, { vapidKey });
                    if (currentToken) {
                        setFcmToken(currentToken);
                        setStatus("تم الحصول على التوكن بنجاح.");
                        console.log("FCM Token:", currentToken);
                    } else {
                        console.log("No registration token available.");
                        setStatus("لم يتم الحصول على توكن. تأكد من إعدادات Firebase.");
                    }
                } else {
                    console.log('Permission not granted!');
                    setStatus("لم يتم منح الإذن. لن يتم استلام إشعارات.");
                }
            } catch (err) {
                console.error("Error getting FCM token:", err);
                setStatus("حدث خطأ أثناء الحصول على التوكن.");
            }
        };

        requestPermissionAndGetToken();

        // Set up the listener for incoming messages
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Foreground message received:', payload);
            const newNotification = {
                title: payload.notification?.title || 'إشعار جديد',
                body: payload.notification?.body || 'رسالة فارغة',
                data: payload.data,
            };
            console.log(messaging)
            setMessages(prevMessages => [...prevMessages, newNotification]);
            setStatus("تم استلام إشعار جديد!");
        });

        // Cleanup function for the listener
        return () => unsubscribe();
    }, []);



    const value = {
        fcmToken,
        messages,
        status
    };

    return <FCMContext.Provider value={value}>{children}</FCMContext.Provider>;
};

// A custom hook to access FCM data from any component without importing createContext
export const useNotificationFromFirebase = () => {

    if (FCMContext) return useContext(FCMContext);
};
