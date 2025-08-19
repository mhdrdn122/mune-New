import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'  

 export default defineConfig({
  plugins: [react(), tailwindcss()],
  
   resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'assets': resolve(__dirname, 'assets')
    }
  },
  
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        sw: './public/firebase-messaging-sw.js',
      },
    },
     assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg']
  },

  server: {
    host: true,
    port: 5173,
  },
})