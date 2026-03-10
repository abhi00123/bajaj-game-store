import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// LMS API base URLs per build mode
const LMS_URLS = {
    production: "https://sales.bajajlife.com/BalicLmsUtil",
    preprod: "https://bajajuat2.bajajlife.com/BalicLmsUtil",
    uat: "https://bjuat.bajajlife.com/BalicLmsUtil",
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    base: './',
    plugins: [react()],
    define: {
        __LMS_BASE_URL__: JSON.stringify(LMS_URLS[mode as keyof typeof LMS_URLS] || LMS_URLS.uat),
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: 'index.js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
                name: 'LifeSnakesLaddersGame',
                exports: 'named',
                format: 'es',
            },
        },
    },
    server: {
        port: 5175,
        host: true,
    },
}));
