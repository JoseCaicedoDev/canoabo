import type { FeatureCollection } from '@/domain/geojson'
import type { LayerDefinition } from '@/domain/layer'
import type { GeoDataSource } from './ports'

export interface LayerLoadCallbacks {
  onLoaded(layer: LayerDefinition, data: FeatureCollection): void
  onFailed(layer: LayerDefinition, error: Error): void
}

/**
 * Carga todas las capas en paralelo. Cada resultado se entrega en el orden del catálogo,
 * para respetar el orden de dibujo; una capa que falla no impide cargar las demás.
 * Los datos se entregan ya transformados por `layer.enrich`, si la capa lo define.
 */
export async function loadLayersInOrder(
  layers: readonly LayerDefinition[],
  source: GeoDataSource,
  callbacks: LayerLoadCallbacks,
): Promise<void> {
  const results = await Promise.allSettled(layers.map((layer) => source.load(layer.dataPath)))
  results.forEach((result, index) => {
    const layer = layers[index]
    if (!layer) return
    if (result.status === 'fulfilled') callbacks.onLoaded(layer, layer.enrich?.(result.value) ?? result.value)
    else callbacks.onFailed(layer, toError(result.reason))
  })
}

function toError(reason: unknown): Error {
  return reason instanceof Error ? reason : new Error(String(reason))
}
