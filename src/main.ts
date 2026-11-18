import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { GEO_DATA_SOURCE, MAP_RENDERER_FACTORY } from './app/dependencies'
import { router } from './app/router'
import { FetchGeoDataSource } from './infrastructure/fetchGeoDataSource'
import type { MapRendererFactory } from './services/ports'
import './styles/main.css'

// Raíz de composición: el único lugar que conoce las implementaciones concretas.
// MapLibre (~1 MB) se descarga aparte, para que la interfaz aparezca antes que el mapa.
const createMapRenderer: MapRendererFactory = async (container, bounds) => {
  const { createMapLibreRenderer } = await import('./infrastructure/maplibre/MapLibreRenderer')
  return createMapLibreRenderer(container, bounds)
}

const siteBaseUrl = new URL(import.meta.env.BASE_URL, window.location.href).href

createApp(App)
  .use(createPinia())
  .use(router)
  .provide(GEO_DATA_SOURCE, new FetchGeoDataSource(siteBaseUrl))
  .provide(MAP_RENDERER_FACTORY, createMapRenderer)
  .mount('#app')
