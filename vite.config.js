import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'


export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        sw: './public/firebase-messaging-sw.js',
      },
    },
    // ⬇️ أضف هذا
    assetsInlineLimit: 4096 // 4kb
  },

  server: {
    host: true,
    port: 5173,
  },
})