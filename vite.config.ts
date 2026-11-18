import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

// base relativa: el sitio funciona en GitHub Pages bajo /<repo>/ sin depender del nombre (CLAUDE.md §12).
export default defineConfig({
  base: './',
  // MapLibre ocupa ~1 MB por sí solo y ya se carga en un chunk aparte (src/main.ts).
  build: { chunkSizeWarningLimit: 1100 },
  // Puerto propio: en 5173 quedó el service worker de otro proyecto (PWA) que intercepta la página.
  server: { port: 5280 },
  preview: { port: 5281 },
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
  },
})
