import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages 專案站台會部署在 https://<user>.github.io/Pudget/
// 因此 base 設為 '/Pudget/'。若之後改用自訂網域或 user page，改成 '/'。
export default defineConfig({
  base: '/Pudget/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['pudget_favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Pudget 記帳布',
        short_name: 'Pudget 記帳布',
        description: '隨手記一筆，自動寫進 Google Sheet 記帳本',
        theme_color: '#FFDA1F',
        background_color: '#EEF0F3',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
})
