import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@mui/material', '@emotion/react', '@emotion/styled']
        }
      },
      external: ['@vercel/analytics/react', '@vercel/speed-insights/react']
    },
    target: 'esnext',
    modulePreload: {
      polyfill: true
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@mui/material', '@vercel/analytics', '@vercel/speed-insights']
  }
})
