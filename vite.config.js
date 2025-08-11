import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://hrm.adsells.biz/FMAppApi',
        changeOrigin: true,
        secure: false, // allow self-signed SSL if needed
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
