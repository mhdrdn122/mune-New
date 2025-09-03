import React from 'react';
import { useNotificationFromFirebase } from './context/FCMProvider';
 
const NotificationManager = () => {
  const { fcmToken, messages, status } = useNotificationFromFirebase();

  return (
    <>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">{status}</p>

      {fcmToken && (
        <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-4 rounded-lg mb-6 break-all">
          <h2 className="text-lg font-semibold mb-2">توكن الجهاز (FCM Token)</h2>
          <p className="font-mono text-sm">{fcmToken}</p>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">الإشعارات المستلمة</h2>
      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
              <h3 className="font-bold text-lg mb-1">{msg.title}</h3>
              <p className="text-sm text-gray-800 dark:text-gray-200">{msg.body}</p>
              {msg.data && (
                <pre className="mt-2 text-xs bg-gray-300 dark:bg-gray-600 p-2 rounded-md overflow-auto">
                  {JSON.stringify(msg.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center">لا توجد إشعارات مستلمة بعد.</p>
      )}
    </>
  );
};

export default NotificationManager;
