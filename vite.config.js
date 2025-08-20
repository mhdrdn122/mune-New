import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

 

export default defineConfig({
  plugins: [react()],
  build: {
      rollupOptions: {
          input: {
              main: './index.html',
              sw: './public/firebase-messaging-sw.js',
          },
      },
  },

  server: {
      host: true,
      port: 5173,
  },
});