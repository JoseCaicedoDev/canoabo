import type { FeatureCollection } from '@/domain/geojson'
import type { GeoDataSource } from '@/services/ports'

export class GeoDataError extends Error {
  constructor(message: string, readonly path: string) {
    super(`${message} (${path})`)
    this.name = 'GeoDataError'
  }
}

function isFeatureCollection(value: unknown): value is FeatureCollection {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as { type?: unknown; features?: unknown }
  return candidate.type === 'FeatureCollection' && Array.isArray(candidate.features)
}

/** Carga GeoJSON estático relativo a la URL base del sitio (sirve bajo /<repo>/ en GitHub Pages). */
export class FetchGeoDataSource implements GeoDataSource {
  constructor(
    private readonly baseUrl: string,
    private readonly fetchFn: typeof fetch = (...args) => fetch(...args),
  ) {}

  async load(path: string): Promise<FeatureCollection> {
    const response = await this.fetchFn(new URL(path, this.baseUrl))
    if (!response.ok) throw new GeoDataError(`Error HTTP ${response.status}`, path)
    const body: unknown = await response.json()
    if (!isFeatureCollection(body)) throw new GeoDataError('El archivo no es un FeatureCollection', path)
    return body
  }
}
