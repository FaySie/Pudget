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
      registerType: 'autoUpdate',
      includeAssets: ['pudding.svg'],
      manifest: {
        name: '記帳布 Pudget',
        short_name: '記帳布',
        description: '隨手記一筆，自動寫進 Google Sheet 記帳本',
        theme_color: '#FFDA1F',
        background_color: '#EEF0F3',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'pudding.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
})
