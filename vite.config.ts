import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'pwa-icon.svg'],
      manifest: {
        name: 'PDF-Magic',
        short_name: 'PDF-Magic',
        description: 'Free PDF tools right in your browser. Merge, split, extract, and remove pages — all offline.',
        theme_color: '#6366f1',
        background_color: '#f8fafc',
        display: 'standalone',
        scope: '/pdf-magic/',
        start_url: '/pdf-magic/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,json}'],
        runtimeCaching: [
          {
            urlPattern: /\/locales\/.*\.json$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'i18n-cache',
            },
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
  },
  base: '/pdf-magic/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'pdf-lib': ['pdf-lib'],
          'pdfjs': ['pdfjs-dist'],
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
          'dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          'i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector', 'i18next-http-backend'],
        },
      },
    },
  },
});
