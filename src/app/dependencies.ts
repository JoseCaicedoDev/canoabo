import type { InjectionKey } from 'vue'
import { inject } from 'vue'
import type { GeoDataSource, MapRendererFactory } from '@/services/ports'

export const GEO_DATA_SOURCE: InjectionKey<GeoDataSource> = Symbol('GeoDataSource')
export const MAP_RENDERER_FACTORY: InjectionKey<MapRendererFactory> = Symbol('MapRendererFactory')

/** inject() que falla con un mensaje claro si la dependencia no se registró en src/main.ts. */
export function injectStrict<T>(key: InjectionKey<T>): T {
  const value = inject(key)
  if (value === undefined) throw new Error(`Dependencia no registrada: ${String(key.description)}`)
  return value
}
