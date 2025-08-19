import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vitejs.dev/config/

/* the first one  */
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig({
  plugins: [react(),tailwindcss()],
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