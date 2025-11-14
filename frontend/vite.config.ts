import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: 5173,
    strictPort: false,
    allowedHosts: [
      'mil-os.up.railway.app',
      '.railway.app', // Allow all Railway subdomains
    ],
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
  },
})
