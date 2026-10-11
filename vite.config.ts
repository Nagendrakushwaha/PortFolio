import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('plotly')) {
            return 'plotly-vendor'
          }
          if (id.includes('three') || id.includes('gsap')) {
            return 'three-vendor'
          }
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor'
          }
        },
      },
    },
    chunkSizeWarningLimit: 3500,
  },
})
