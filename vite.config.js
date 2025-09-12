// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  //base: '/juegos/ruleta/',      // <-- ruta final en producción
  server: { 
    port: 3000, 
    open: true,
    allowedHosts: [
      'a27aca74a3db.ngrok-free.app'
    ] 
}
})