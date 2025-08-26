import React, { useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketProvider';

const TestHooks = ({ restaurantId }) => {

    const echo = useWebSocket();

    useEffect(() => {
      if (!restaurantId) return;
  
      const channel = echo.channel(`restaurant${restaurantId}`);
      console.log('connect to channel restaurant')
      channel.listen('.App\\Events\\TableUpdatedEvent', (event) => {
        console.log('📩 Event received:', event);
      });
  
      return () => {
        channel.stopListening('.App\\Events\\TableUpdatedEvent');
      };
    }, [restaurantId, echo]);
  
    return (
      <div>Listening...</div>
    );
};

export default TestHooks;
