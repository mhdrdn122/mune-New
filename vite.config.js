import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'assets')
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false, // ⬅️ مهم لـ Vercel
    rollupOptions: {
      input: {
        main: './index.html'
        // احذف service worker إذا لم يكن ضرورياً
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    } ,
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg']

  },

   
})
  