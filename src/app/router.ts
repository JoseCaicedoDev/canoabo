import { createRouter, createWebHashHistory } from 'vue-router'

// Historial con hash: GitHub Pages no reescribe URLs (CLAUDE.md §12.5).
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/', name: 'map', component: () => import('@/views/MapView.vue') }],
})
