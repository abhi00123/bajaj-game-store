import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        name: 'RetirementReadinessJourney',
        exports: 'named',
        format: 'es'
      }
    }
  },
  server: {
    port: 5005 // Development port
  }
})
