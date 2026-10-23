import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Local API (npm run dev:api). In production /api is served by the Vercel Function.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
