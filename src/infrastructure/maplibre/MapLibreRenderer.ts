import type { FeatureCollection as GeoJsonFeatureCollection } from 'geojson'
import { Map as MapLibreMap, ScaleControl, setWorkerUrl, type MapMouseEvent } from 'maplibre-gl'
// MapLibre v6 procesa los datos en un worker aparte; Vite lo empaqueta y publica junto al sitio.
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { BoundingBox, FeatureCollection, FeatureProperties } from '@/domain/geojson'
import type { BasemapDefinition, LayerDefinition } from '@/domain/layer'
import { isQueryable } from '@/domain/layer'
import type { FeatureHit, MapRenderer, MapRendererFactory } from '@/services/ports'
import {
  NO_FEATURE_FILTER,
  UNFOCUSED_OPACITY,
  featureFilter,
  focusOpacity,
  translateLayer,
} from './styleTranslator'

setWorkerUrl(maplibreWorkerUrl)

/** Las expresiones de estilo se construyen como datos; MapLibre las valida al aplicarlas. */
function asStyleValue<T>(expression: unknown): T {
  return expression as T
}

const GROUND_ID = 'ground'
const GROUND_COLOR = '#dce1da'
const BASEMAP_ID = 'basemap'
const TILE_SIZE = 256
const FIT_PADDING = 32
const REVEAL_DURATION_MS = 500
/** Zoom máximo al acercarse a un elemento: un punto no debe llenar la pantalla. */
const FOCUS_MAX_ZOOM = 15
const FOCUS_PADDING = 80

/** Propiedad de opacidad de cada tipo de subcapa, para el velo de enfoque. */
const OPACITY_PROPERTIES: Readonly<Record<string, readonly string[]>> = {
  fill: ['fill-opacity'],
  line: ['line-opacity'],
  circle: ['circle-opacity', 'circle-stroke-opacity'],
}

/** Adaptador de MapLibre GL al contrato MapRenderer. */
export class MapLibreRenderer implements MapRenderer {
  private readonly map: MapLibreMap
  private readonly ready: Promise<void>
  private readonly sublayersByLayer = new Map<string, readonly string[]>()
  private readonly selectionLayerByLayer = new Map<string, string>()
  private readonly interactiveLayerIds: string[] = []
  /** Opacidades originales guardadas mientras el velo está activo. */
  private readonly veiledOpacities = new Map<string, unknown>()
  private selection: FeatureHit | null = null

  constructor(container: HTMLElement, initialBounds: BoundingBox) {
    this.map = new MapLibreMap({
      container,
      style: {
        version: 8,
        sources: {},
        layers: [{ id: GROUND_ID, type: 'background', paint: { 'background-color': GROUND_COLOR } }],
      },
      bounds: [...initialBounds],
      fitBoundsOptions: { padding: FIT_PADDING },
      attributionControl: { compact: true },
    })
    this.map.addControl(new ScaleControl({ unit: 'metric' }), 'bottom-left')
    this.ready = new Promise((resolve) => this.map.once('load', () => resolve()))
  }

  whenReady(): Promise<void> {
    return this.ready
  }

  setBasemap(basemap: BasemapDefinition): void {
    if (this.map.getLayer(BASEMAP_ID)) this.map.removeLayer(BASEMAP_ID)
    if (this.map.getSource(BASEMAP_ID)) this.map.removeSource(BASEMAP_ID)
    this.map.addSource(BASEMAP_ID, {
      type: 'raster',
      tiles: [...basemap.tileUrls],
      tileSize: TILE_SIZE,
      maxzoom: basemap.maxZoom,
      attribution: basemap.attribution,
    })
    const firstOverlay = this.map
      .getStyle()
      .layers.find((layer) => layer.id !== BASEMAP_ID && layer.id !== GROUND_ID)
    this.map.addLayer(
      { id: BASEMAP_ID, type: 'raster', source: BASEMAP_ID, paint: { 'raster-opacity': basemap.opacity } },
      firstOverlay?.id,
    )
  }

  addLayer(layer: LayerDefinition, data: FeatureCollection): void {
    this.map.addSource(layer.id, { type: 'geojson', data: data as GeoJsonFeatureCollection })
    const translated = translateLayer(layer)
    translated.layers.forEach((sublayer) => this.map.addLayer(sublayer))
    this.sublayersByLayer.set(
      layer.id,
      translated.layers.map((sublayer) => sublayer.id),
    )
    if (translated.selectionLayerId) this.selectionLayerByLayer.set(layer.id, translated.selectionLayerId)
    if (isQueryable(layer)) this.registerInteractive(translated.interactiveLayerIds)
  }

  setLayerVisibility(layerId: string, visible: boolean): void {
    const visibility = visible ? 'visible' : 'none'
    this.sublayersByLayer
      .get(layerId)
      ?.forEach((id) => this.map.setLayoutProperty(id, 'visibility', visibility))
  }

  setSelection(hit: FeatureHit | null): void {
    this.applySelection(this.selection, false)
    this.selection = hit
    this.applySelection(hit, true)
  }

  setFocus(layer: LayerDefinition, value: string | null): void {
    const { style, focus } = layer
    if (!focus || (style.kind !== 'fill' && style.kind !== 'categorized-fill')) return
    const fillId = `${layer.id}:fill`
    if (!this.map.getLayer(fillId)) return
    this.map.setPaintProperty(fillId, 'fill-opacity', asStyleValue(focusOpacity(focus.property, value, style.opacity)))
    this.map.setPaintProperty(`${layer.id}:outline`, 'line-opacity', asStyleValue(focusOpacity(focus.property, value, 1)))
    this.veilOtherLayers(layer.id, value !== null)
  }

  fitBounds(bounds: BoundingBox): void {
    this.map.fitBounds([...bounds], { padding: FIT_PADDING })
  }

  focusBounds(bounds: BoundingBox): void {
    this.map.fitBounds([...bounds], { padding: FOCUS_PADDING, maxZoom: FOCUS_MAX_ZOOM, duration: REVEAL_DURATION_MS })
  }

  zoomIn(): void {
    this.map.zoomIn()
  }

  zoomOut(): void {
    this.map.zoomOut()
  }

  revealPoint(lngLat: readonly [number, number], bottomInsetPx: number): void {
    const point = this.map.project([...lngLat])
    const visibleBottom = this.map.getContainer().clientHeight - bottomInsetPx
    if (point.y > FIT_PADDING && point.y < visibleBottom - FIT_PADDING) return
    // Centra el punto en la franja visible por encima de la hoja inferior.
    this.map.easeTo({ center: [...lngLat], offset: [0, -bottomInsetPx / 2], duration: REVEAL_DURATION_MS })
  }

  onFeatureClick(handler: (hit: FeatureHit | null) => void): void {
    this.map.on('click', (event) => handler(this.hitAt(event)))
  }

  destroy(): void {
    this.map.remove()
  }

  private registerInteractive(layerIds: readonly string[]): void {
    this.interactiveLayerIds.push(...layerIds)
    layerIds.forEach((id) => {
      this.map.on('mouseenter', id, () => this.setCursor('pointer'))
      this.map.on('mouseleave', id, () => this.setCursor(''))
    })
  }

  private setCursor(cursor: string): void {
    this.map.getCanvas().style.cursor = cursor
  }

  private hitAt(event: MapMouseEvent): FeatureHit | null {
    const visibleIds = this.interactiveLayerIds.filter(
      (id) => this.map.getLayoutProperty(id, 'visibility') !== 'none',
    )
    // queryRenderedFeatures devuelve primero el elemento dibujado encima.
    const [feature] = this.map.queryRenderedFeatures(event.point, { layers: visibleIds })
    if (!feature) return null
    return {
      layerId: feature.source,
      featureId: feature.id,
      properties: feature.properties as FeatureProperties,
      lngLat: [event.lngLat.lng, event.lngLat.lat],
    }
  }

  private applySelection(hit: FeatureHit | null, selected: boolean): void {
    if (hit?.featureId === undefined) return
    if (!this.map.getSource(hit.layerId)) return
    this.map.setFeatureState({ source: hit.layerId, id: hit.featureId }, { selected })
    const selectionLayerId = this.selectionLayerByLayer.get(hit.layerId)
    if (selectionLayerId) {
      const filter = selected ? featureFilter(hit.featureId) : NO_FEATURE_FILTER
      this.map.setFilter(selectionLayerId, asStyleValue(filter))
    }
  }

  /** Baja la opacidad de las demás capas mientras una clase está enfocada, y la restaura después. */
  private veilOtherLayers(focusedLayerId: string, veiled: boolean): void {
    for (const [layerId, sublayerIds] of this.sublayersByLayer) {
      if (layerId === focusedLayerId) continue
      for (const sublayerId of sublayerIds) {
        if (this.selectionLayerByLayer.get(layerId) === sublayerId) continue
        const type = this.map.getLayer(sublayerId)?.type ?? ''
        for (const property of OPACITY_PROPERTIES[type] ?? []) this.veilProperty(sublayerId, property, veiled)
      }
    }
  }

  private veilProperty(sublayerId: string, property: string, veiled: boolean): void {
    const key = `${sublayerId}|${property}`
    const name = asStyleValue<'fill-opacity'>(property)
    if (veiled && !this.veiledOpacities.has(key)) {
      this.veiledOpacities.set(key, this.map.getPaintProperty(sublayerId, name) ?? 1)
      this.map.setPaintProperty(sublayerId, name, UNFOCUSED_OPACITY * 2)
    } else if (!veiled && this.veiledOpacities.has(key)) {
      this.map.setPaintProperty(sublayerId, name, asStyleValue(this.veiledOpacities.get(key)))
      this.veiledOpacities.delete(key)
    }
  }
}

export const createMapLibreRenderer: MapRendererFactory = async (container, initialBounds) =>
  new MapLibreRenderer(container, initialBounds)
