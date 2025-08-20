import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  build: {
    // ⬇️ احذف rollupOptions إذا لم تكن ضرورية
    assetsInlineLimit: 4096
  },

  server: {
    host: true,
    port: 5173,
  },
})