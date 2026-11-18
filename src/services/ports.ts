import type { BoundingBox, FeatureCollection, FeatureProperties } from '@/domain/geojson'
import type { BasemapDefinition, LayerDefinition } from '@/domain/layer'

/** Fuente de datos geográficos estáticos. */
export interface GeoDataSource {
  load(path: string): Promise<FeatureCollection>
}

export interface FeatureHit {
  readonly layerId: string
  readonly featureId: string | number | undefined
  readonly properties: FeatureProperties
  /** Punto [lon, lat] donde se tocó el mapa (o la posición del elemento de ejemplo). */
  readonly lngLat?: readonly [number, number]
  /** Selección automática de muestra, no hecha por el visitante. */
  readonly isExample?: boolean
  /** Extensión a la que acercar el mapa (selección desde la tabla de atributos). */
  readonly zoomTo?: BoundingBox
}

/** Motor de mapa. La UI depende de este contrato, no de la librería concreta. */
export interface MapRenderer {
  whenReady(): Promise<void>
  setBasemap(basemap: BasemapDefinition): void
  addLayer(layer: LayerDefinition, data: FeatureCollection): void
  setLayerVisibility(layerId: string, visible: boolean): void
  setSelection(hit: FeatureHit | null): void
  /** Resalta los elementos con `property === value` y vela el resto; `null` quita el foco. */
  setFocus(layer: LayerDefinition, value: string | null): void
  fitBounds(bounds: BoundingBox): void
  /** Acerca el mapa a un elemento, sin pasar de un zoom de detalle. */
  focusBounds(bounds: BoundingBox): void
  zoomIn(): void
  zoomOut(): void
  /** Centra `lngLat` en la parte del mapa que queda visible sobre una hoja inferior de `bottomInsetPx`. */
  revealPoint(lngLat: readonly [number, number], bottomInsetPx: number): void
  onFeatureClick(handler: (hit: FeatureHit | null) => void): void
  destroy(): void
}

/** Asíncrona: permite cargar la librería de mapas bajo demanda. */
export type MapRendererFactory = (
  container: HTMLElement,
  initialBounds: BoundingBox,
) => Promise<MapRenderer>
