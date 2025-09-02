// src/context/WebSocketContext.tsx
import React, { createContext, useContext, useEffect, useRef } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const echoRef = useRef(null);

  if (!echoRef.current) {
    window.Pusher = Pusher;

    echoRef.current = new Echo({
      broadcaster: "pusher",
      key: "bqfkpognxb0xxeax5bjc",
      cluster: "mt1",
      // wsPort:6001,
      wsPort: 8080,

      wsHost: 'tmenuback.addresses.sy',
      // wsHost: "192.168.1.38",

      forceTLS: false,
      disableStats: true,
      enabledTransports: ["ws", "wss"],
    });

    console.log("✅ Echo WebSocket Initialized Globally");
  }

  useEffect(() => {
    return () => {
      console.log("🛑 Cleaning up Echo WebSocket");
      echoRef.current?.disconnect();
    };
  }, []);

  console.log("echoRef", echoRef.current);
  return (
    <WebSocketContext.Provider value={echoRef.current}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook to use Echo easily
export const useWebSocket = (channelName) => {
  console.log(channelName);
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }

  const channel = context.channel(channelName);
  console.log(channel);

  return channel;
};
