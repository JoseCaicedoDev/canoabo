import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue'
import { GEO_DATA_SOURCE, MAP_RENDERER_FACTORY, injectStrict } from '@/app/dependencies'
import { MOBILE_SHEET_HEIGHT_RATIO, isWideLayout } from '@/app/layout'
import { INITIAL_BOUNDS } from '@/config/basemaps'
import type { FeatureCollection } from '@/domain/geojson'
import type { LayerDefinition } from '@/domain/layer'
import { areaShareByValue } from '@/domain/landCapability'
import { loadLayersInOrder } from '@/services/layerLoading'
import type { FeatureHit, MapRenderer } from '@/services/ports'
import { useLayerStore } from '@/stores/layerStore'

/** Primer elemento puntual de una capa con vista de detalle, mostrado como ejemplo al abrir. */
function exampleHit(layer: LayerDefinition, data: FeatureCollection): FeatureHit | null {
  const feature = data.features[0]
  const coordinates = feature?.geometry?.type === 'Point' ? (feature.geometry.coordinates as number[]) : null
  if (!feature || !coordinates || coordinates.length < 2) return null
  return {
    layerId: layer.id,
    featureId: feature.id,
    properties: feature.properties,
    lngLat: [coordinates[0] ?? 0, coordinates[1] ?? 0],
    isExample: true,
  }
}

/** Monta el mapa en `container` y lo mantiene sincronizado con el store de capas. */
export function useGeoMap(container: Ref<HTMLElement | null>) {
  const store = useLayerStore()
  const dataSource = injectStrict(GEO_DATA_SOURCE)
  const createRenderer = injectStrict(MAP_RENDERER_FACTORY)
  let renderer: MapRenderer | null = null
  let isUnmounted = false

  async function initialize(element: HTMLElement): Promise<void> {
    const map = await createRenderer(element, INITIAL_BOUNDS)
    if (isUnmounted) {
      map.destroy()
      return
    }
    renderer = map
    await map.whenReady()
    if (store.basemap) map.setBasemap(store.basemap)
    map.onFeatureClick((hit) => store.select(hit))
    store.layers.forEach((layer) => store.setStatus(layer.id, 'loading'))
    await loadLayersInOrder(store.layers, dataSource, {
      onLoaded(layer, data) {
        map.addLayer(layer, data)
        store.setLayerData(layer.id, data)
        map.setLayerVisibility(layer.id, store.isVisible(layer.id))
        if (layer.focus) {
          store.setAreaShares(layer.id, areaShareByValue(data, layer.focus.property, layer.focus.areaProperty))
        }
        store.setStatus(layer.id, 'ready')
        // En escritorio la ficha abre con un perfil real de ejemplo; en móvil taparía el mapa.
        if (layer.detailView && !store.selection && isWideLayout()) store.select(exampleHit(layer, data))
      },
      onFailed(layer, error) {
        console.error(`No se pudo cargar la capa «${layer.title}»`, error)
        store.setStatus(layer.id, 'error')
      },
    })
  }

  onMounted(() => {
    if (container.value) void initialize(container.value)
  })

  watch(
    () => store.visibility,
    (visibility) => Object.entries(visibility).forEach(([id, visible]) => renderer?.setLayerVisibility(id, visible)),
  )
  watch(
    () => store.selection,
    (hit) => {
      renderer?.setSelection(hit)
      if (hit?.zoomTo) {
        renderer?.focusBounds(hit.zoomTo)
        return
      }
      if (hit?.lngLat && !hit.isExample && !isWideLayout()) {
        renderer?.revealPoint(hit.lngLat, window.innerHeight * MOBILE_SHEET_HEIGHT_RATIO)
      }
    },
  )
  watch(
    () => store.focus,
    (focus) =>
      store.layers.forEach((layer) => layer.focus && renderer?.setFocus(layer, focus[layer.id] ?? null)),
  )
  watch(() => store.basemap, (basemap) => basemap && renderer?.setBasemap(basemap))

  onBeforeUnmount(() => {
    isUnmounted = true
    renderer?.destroy()
    renderer = null
  })

  return {
    resetView: () => renderer?.fitBounds(INITIAL_BOUNDS),
    zoomIn: () => renderer?.zoomIn(),
    zoomOut: () => renderer?.zoomOut(),
  }
}
