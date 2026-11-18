import { defineStore } from 'pinia'
import { computed, markRaw, ref, shallowRef } from 'vue'
import type { FeatureCollection } from '@/domain/geojson'
import { BASEMAPS } from '@/config/basemaps'
import { LAYER_CATALOG } from '@/config/layerCatalog'
import type { LayerDefinition } from '@/domain/layer'
import type { FeatureHit } from '@/services/ports'

export type LayerStatus = 'loading' | 'ready' | 'error'

function initialVisibility(layers: readonly LayerDefinition[]): Record<string, boolean> {
  return Object.fromEntries(layers.map((layer) => [layer.id, layer.visibleByDefault]))
}

export const useLayerStore = defineStore('layers', () => {
  const layers = LAYER_CATALOG
  const visibility = ref<Record<string, boolean>>(initialVisibility(layers))
  const status = ref<Record<string, LayerStatus>>({})
  const selection = ref<FeatureHit | null>(null)
  /** Datos cargados por capa. Sin reactividad profunda: miles de elementos que no cambian. */
  const layerData = shallowRef<Readonly<Record<string, FeatureCollection>>>({})
  /** Capa cuya tabla de atributos está abierta. */
  const tableLayerId = ref<string | null>(null)
  const tableLayer = computed(() => layers.find((layer) => layer.id === tableLayerId.value))
  const basemapId = ref(BASEMAPS[0]?.id ?? '')
  /** Valor enfocado por capa (p. ej. clase de capacidad de uso «VI»). */
  const focus = ref<Record<string, string | null>>({})
  /** Fracción de superficie por valor enfocable, calculada al cargar la capa. */
  const areaShares = ref<Record<string, Readonly<Record<string, number>>>>({})

  const selectedLayer = computed(() =>
    layers.find((layer) => layer.id === selection.value?.layerId),
  )
  const basemap = computed(() => BASEMAPS.find((item) => item.id === basemapId.value))

  function isVisible(layerId: string): boolean {
    return visibility.value[layerId] ?? false
  }

  function setVisible(layerId: string, visible: boolean): void {
    visibility.value = { ...visibility.value, [layerId]: visible }
    if (!visible && selection.value?.layerId === layerId) selection.value = null
  }

  function setStatus(layerId: string, value: LayerStatus): void {
    status.value = { ...status.value, [layerId]: value }
  }

  function select(hit: FeatureHit | null): void {
    selection.value = hit
  }

  function toggleFocus(layerId: string, value: string): void {
    const next = focus.value[layerId] === value ? null : value
    focus.value = { ...focus.value, [layerId]: next }
    if (next !== null) setVisible(layerId, true)
  }

  function setAreaShares(layerId: string, shares: Readonly<Record<string, number>>): void {
    areaShares.value = { ...areaShares.value, [layerId]: shares }
  }

  /** Hay algo que limpiar: un elemento seleccionado o una clase enfocada. */
  const hasActiveSelection = computed(
    () => selection.value !== null || Object.values(focus.value).some((value) => value !== null),
  )

  /** Quita la selección y todos los focos de clase, sin recargar la página. */
  function clearSelection(): void {
    selection.value = null
    focus.value = Object.fromEntries(Object.keys(focus.value).map((layerId) => [layerId, null]))
  }

  function setLayerData(layerId: string, data: FeatureCollection): void {
    layerData.value = { ...layerData.value, [layerId]: markRaw(data) }
  }

  /** Abre la tabla de la capa, o la cierra si ya estaba abierta. */
  function toggleTable(layerId: string): void {
    tableLayerId.value = tableLayerId.value === layerId ? null : layerId
  }

  function closeTable(): void {
    tableLayerId.value = null
  }

  function selectBasemap(id: string): void {
    basemapId.value = id
  }

  return {
    layers,
    visibility,
    status,
    selection,
    selectedLayer,
    basemapId,
    basemap,
    focus,
    areaShares,
    toggleFocus,
    setAreaShares,
    isVisible,
    setVisible,
    setStatus,
    select,
    selectBasemap,
    layerData,
    tableLayerId,
    tableLayer,
    setLayerData,
    hasActiveSelection,
    clearSelection,
    toggleTable,
    closeTable,
  }
})
