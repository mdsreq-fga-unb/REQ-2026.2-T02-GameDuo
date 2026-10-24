import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Repassa as chamadas /api para o Laravel (php artisan serve), sem precisar de CORS.
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
})
