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
                name: 'QuizGame',
                exports: 'named',
                format: 'es'
            }
        }
    },
    server: {
        port: 5003 // Development port
    }
})
