import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // 確保 GitHub Pages 部署時路徑正確
    assetsDir: 'assets',
  },
  // GitHub Pages 部署設定 - 根據您的儲存庫名稱調整
  base: process.env.NODE_ENV === 'production' ? '/無障礙廁所GO-V2/' : '/',
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
})
