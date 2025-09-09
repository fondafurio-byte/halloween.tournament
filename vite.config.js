import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'LeoSì Halloween Tournament',
        short_name: 'LeoSì Tournament',
        start_url: '.',
        display: 'standalone',
        background_color: '#18181b',
        theme_color: '#18181b',
        description: 'Classifica e partite del torneo LeoSì Halloween, sempre aggiornate!',
        icons: [
          {
            src: '/logo.ico',
            sizes: '48x48 72x72 96x96 128x128 256x256 512x512',
            type: 'image/x-icon'
          }
        ]
      }
    })
  ],
})
