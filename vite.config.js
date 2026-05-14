import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3003,
    strictPort: true, // Ne jamais changer de port automatiquement — toujours localhost:3003
    // Proxy DEV uniquement : permet d'utiliser le mode "direct" (cles dans le bundle).
    // En production, deployer le backend Express et utiliser VITE_API_BASE.
    proxy: {
      '/api/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
      },
      '/api/elevenlabs': {
        target: 'https://api.elevenlabs.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/elevenlabs/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals:     true,
    include:     ['src/**/*.{test,spec}.{js,jsx}'],
    setupFiles:  ['./src/test/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude:  ['node_modules', 'dist', 'src/data/recipeBank.js', 'src/test/**'],
    },
  },
})
