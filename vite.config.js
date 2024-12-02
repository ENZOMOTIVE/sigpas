import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Add historyApiFallback for React Router
    historyApiFallback: true,
  },
  css: {
    postcss: './postcss.config.js'
  },
  optimizeDeps: {
    include: ['ethers', 'react-router-dom', 'react-hot-toast'],
    exclude: ['lucid-react'],
  },
})

