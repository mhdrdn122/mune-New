// src/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'pusher',
  key: 'bqfkpognxb0xxeax5bjc', // Your app key
  cluster: 'mt1', 
  wsHost: '192.168.1.102',
  wsPort: 8080,
  forceTLS: false,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
});

export default echo;
