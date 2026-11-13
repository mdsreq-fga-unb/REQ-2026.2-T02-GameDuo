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
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/components/coinBalance/**',
        'src/components/modal/**',
        'src/components/orderSummary/**',
        'src/pages/paginaCarteira/**',
        'src/pages/paginaComprarMoedas/**',
        'src/pages/paginaPagamento/**',
        'src/utils/moedas.js',
        'src/utils/useContagem.js',
      ],
      exclude: ['**/*.test.jsx', '**/*.test.js', '**/*.css'],
      thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 },
    },
  },
})
