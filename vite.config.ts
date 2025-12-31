import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-icon-512.png'],
      manifest: {
        name: 'El tiempo en la montaña',
        short_name: 'Tiempo Montaña',
        description: 'Predicción meteorológica de montaña directa de AEMET',
        theme_color: '#020617',
        background_color: '#020617',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/opendata': {
        target: 'https://opendata.aemet.es',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
