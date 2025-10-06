import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/messages': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/upload': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/users': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/stats': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
