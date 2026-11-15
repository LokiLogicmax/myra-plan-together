import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative paths, so the build works from any folder (GitHub Pages serves it under /myra-plan-together/).
  base: './',
})
