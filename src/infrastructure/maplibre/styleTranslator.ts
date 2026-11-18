import type { AddLayerObject } from 'maplibre-gl'
import type { LayerDefinition, LayerStyle } from '@/domain/layer'

/**
 * Selección en el mapa: rojo vivo sobre un halo blanco, legible sobre satélite y sobre cualquier
 * clase (más saturado que la clase III, #d4473a). Token --color-selection en src/styles/main.css.
 */
export const SELECTION_COLOR = '#ff1a1a'
export const SELECTION_HALO_COLOR = '#ffffff'
const SELECTION_HALO_WIDTH = 7
/** Opacidad de los elementos fuera de foco. */
export const UNFOCUSED_OPACITY = 0.12
const BASE_OUTLINE_WIDTH = 0.5
const SELECTED_OUTLINE_WIDTH = 3.5
const SELECTED_EXTRA_WIDTH = 3
const CASING_EXTRA_WIDTH = 2
const SELECTED_RING_WIDTH = 4
const SELECTED_RADIUS_EXTRA = 4

type FillStyle = Extract<LayerStyle, { kind: 'fill' | 'categorized-fill' }>
type LineStyle = Extract<LayerStyle, { kind: 'line' }>
type CircleStyle = Extract<LayerStyle, { kind: 'circle' }>

export interface TranslatedLayer {
  readonly layers: readonly AddLayerObject[]
  /** Subcapas que responden al clic. */
  readonly interactiveLayerIds: readonly string[]
  /** Subcapa que dibuja solo el elemento seleccionado, encima del resto (filtrada por id). */
  readonly selectionLayerId?: string
}

/** Filtro que no coincide con ningún elemento: la subcapa de selección empieza vacía. */
export const NO_FEATURE_FILTER = ['==', ['id'], '__ninguno__']

export function featureFilter(featureId: string | number): unknown[] {
  return ['==', ['id'], featureId]
}

/** Grosor de línea según el zoom: finas a escala de cuenca, plenas al acercarse. */
// MapLibre solo admite ['zoom'] en un interpolate de primer nivel: la selección va dentro de cada parada.
function widthByZoom(width: number, selectedExtra = 0): unknown[] {
  const stop = (factor: number) =>
    selectedExtra > 0 ? whenSelected(width * factor, width * factor + selectedExtra) : width * factor
  return ['interpolate', ['linear'], ['zoom'], 11, stop(0.45), 14, stop(1), 17, stop(2.2)]
}

const IS_SELECTED = ['boolean', ['feature-state', 'selected'], false]

function whenSelected(normal: unknown, selected: unknown): unknown[] {
  return ['case', IS_SELECTED, selected, normal]
}

function fillColor(style: FillStyle): unknown {
  if (style.kind === 'fill') return style.color
  const pairs = style.categories.flatMap((category) => [category.value, category.color])
  return ['match', ['to-string', ['get', style.property]], ...pairs, style.fallbackColor]
}

function translateFill(layer: LayerDefinition, style: FillStyle): TranslatedLayer {
  const fillId = `${layer.id}:fill`
  const layers = [
    {
      id: fillId,
      type: 'fill',
      source: layer.id,
      paint: { 'fill-color': fillColor(style), 'fill-opacity': style.opacity },
    },
    {
      id: `${layer.id}:halo`,
      type: 'line',
      source: layer.id,
      paint: {
        'line-color': SELECTION_HALO_COLOR,
        'line-width': whenSelected(0, SELECTION_HALO_WIDTH),
      },
    },
    {
      id: `${layer.id}:outline`,
      type: 'line',
      source: layer.id,
      paint: {
        'line-color': whenSelected(style.outlineColor, SELECTION_COLOR),
        'line-width': whenSelected(BASE_OUTLINE_WIDTH, SELECTED_OUTLINE_WIDTH),
      },
    },
  ]
  return { layers: layers as AddLayerObject[], interactiveLayerIds: [fillId] }
}

function translateLine(layer: LayerDefinition, style: LineStyle): TranslatedLayer {
  const lineId = `${layer.id}:line`
  const casing = style.casingColor
    ? [
        {
          id: `${layer.id}:casing`,
          type: 'line',
          source: layer.id,
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': style.casingColor, 'line-width': widthByZoom(style.width + CASING_EXTRA_WIDTH) },
        },
      ]
    : []
  const layers = [
    ...casing,
    {
      id: lineId,
      type: 'line',
      source: layer.id,
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': whenSelected(style.color, SELECTION_COLOR),
        'line-width': widthByZoom(style.width, SELECTED_EXTRA_WIDTH),
        'line-opacity': whenSelected(style.opacity ?? 1, 1),
      },
    },
  ]
  return { layers: layers as AddLayerObject[], interactiveLayerIds: [lineId] }
}

function translateCircle(layer: LayerDefinition, style: CircleStyle): TranslatedLayer {
  const circleId = `${layer.id}:circle`
  const selectionId = `${layer.id}:selected`
  const layers = [
    {
      id: circleId,
      type: 'circle',
      source: layer.id,
      paint: {
        'circle-color': style.color,
        'circle-radius': style.radius,
        'circle-stroke-color': style.strokeColor,
        'circle-stroke-width': 1,
      },
    },
    {
      id: selectionId,
      type: 'circle',
      source: layer.id,
      filter: NO_FEATURE_FILTER,
      paint: {
        'circle-color': style.color,
        'circle-radius': style.radius + SELECTED_RADIUS_EXTRA,
        'circle-stroke-color': SELECTION_COLOR,
        'circle-stroke-width': SELECTED_RING_WIDTH,
      },
    },
  ]
  return {
    layers: layers as AddLayerObject[],
    interactiveLayerIds: [circleId],
    selectionLayerId: selectionId,
  }
}

/** Traduce la definición declarativa de una capa a subcapas de MapLibre (fuente = id de la capa). */
export function translateLayer(layer: LayerDefinition): TranslatedLayer {
  const { style } = layer
  switch (style.kind) {
    case 'fill':
    case 'categorized-fill':
      return translateFill(layer, style)
    case 'line':
      return translateLine(layer, style)
    case 'circle':
      return translateCircle(layer, style)
  }
}

/** Expresión de opacidad que mantiene `baseOpacity` en los elementos enfocados y vela el resto. */
export function focusOpacity(property: string, value: string | null, baseOpacity: number): unknown {
  if (value === null) return baseOpacity
  return ['case', ['==', ['to-string', ['get', property]], value], baseOpacity, UNFOCUSED_OPACITY]
}
