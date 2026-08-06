import { io } from 'socket.io-client';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const baseUrl = (config.public.apiBase as string || '').replace('/api', '') || 'http://localhost:3005';
  
  const socket = io(baseUrl);

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  return {
    provide: {
      socket
    }
  };
});
