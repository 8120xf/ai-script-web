import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages: https://8120xf.github.io/ai-script-web/
  base: process.env.GITHUB_ACTIONS ? '/ai-script-web/' : '/',
})
