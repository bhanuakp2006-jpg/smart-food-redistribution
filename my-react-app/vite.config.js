import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['leaflet', 'react-leaflet']
  }
})
