import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Configuração moderna para Vite + React
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
