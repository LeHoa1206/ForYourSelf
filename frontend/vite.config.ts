import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      overlay: true
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'react-spring',
      'react-use-gesture',
      'react-intersection-observer',
      'react-countup',
      'react-hook-form',
      'react-chartjs-2',
      'chart.js',
      'react-helmet-async',
      'react-error-boundary',
      'react-lazy-load-image-component',
      'react-infinite-scroll-component',
      'react-use',
      'react-use-measure',
      'react-transition-group',
      'axios',
      'zustand',
      '@tanstack/react-query',
      '@headlessui/react',
      'react-hot-toast',
      'clsx',
      'tailwind-merge'
    ]
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          animation: ['framer-motion', 'react-spring', 'react-use-gesture'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          ui: ['@headlessui/react', 'lucide-react'],
          utils: ['axios', 'clsx', 'tailwind-merge'],
          charts: ['react-chartjs-2', 'chart.js'],
          forms: ['react-hook-form'],
          effects: ['react-countup', 'react-lazy-load-image-component']
        }
      }
    }
  },
  define: {
    global: 'globalThis',
  }
})