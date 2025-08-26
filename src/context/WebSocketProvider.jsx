// src/context/WebSocketContext.tsx
import React, { createContext, useContext, useEffect, useRef } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const echoRef = useRef(null);

  if (!echoRef.current) {
    window.Pusher = Pusher;

    echoRef.current = new Echo({
      broadcaster: 'pusher',
      key: 'bqfkpognxb0xxeax5bjc', 
      cluster: 'mt1',
      wsPort:6001,
      wsHost: 'tmenuback.addresses.sy',
      forceTLS: false,
      disableStats: true,
      enabledTransports: ['ws','wss'],
    });

    console.log('✅ Echo WebSocket Initialized Globally');
  }

  useEffect(() => {
    return () => {
      console.log('🛑 Cleaning up Echo WebSocket');
      echoRef.current?.disconnect();
    };
  }, []);

  console.log("echoRef" , echoRef.current)
  return (
    <WebSocketContext.Provider value={echoRef.current}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook to use Echo easily
export const useWebSocket = (restaurantId) => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  console.log("echoRef context" , context)

  const channel = context.channel(`restaurant${restaurantId}`)
  console.log(`connect to channel restaurant${restaurantId}`)
  return channel;
  
};
