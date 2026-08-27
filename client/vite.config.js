import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: true, // Docker ke liye zaroori
    port: 5173,
    watch: {
      usePolling: true, // Ye line magic karegi! Ye live sync enable karti hai
      interval: 100,    // Har 100ms me check karega
    }
  }
})
