import { io } from 'socket.io-client';

export default defineNuxtPlugin(() => {
  const socket = io('http://127.0.0.1:3001');

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  return {
    provide: {
      socket
    }
  };
});
