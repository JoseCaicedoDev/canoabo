<script setup lang="ts">
import { X } from '@lucide/vue'
import { computed, type Component } from 'vue'
import { CAPABILITY_ATTRIBUTE_KEYS, CAPABILITY_LADDER } from '@/config/landCapabilityClasses'
import { featureTitle, toAttributeRows } from '@/domain/featureAttributes'
import type { FeatureProperties } from '@/domain/geojson'
import { mainCapabilityClass } from '@/domain/landCapability'
import type { DetailView, LayerDefinition } from '@/domain/layer'
import { useLayerStore } from '@/stores/layerStore'
import AttributeList from './AttributeList.vue'
import SoilMonolith from './SoilMonolith.vue'

/** Vistas especializadas por tipo de detalle (abierto a nuevas vistas sin tocar esta ficha). */
const DETAIL_VIEWS: Record<DetailView, Component> = { 'soil-profile': SoilMonolith }

const store = useLayerStore()

function subtitleOf(layer: LayerDefinition, properties: FeatureProperties): string {
  const code = layer.subtitleField ? properties[layer.subtitleField] : null
  return code === null || code === undefined || code === '' ? layer.itemLabel : `${layer.itemLabel} · ${code}`
}

/** Muestra de la escalera junto a los atributos de capacidad de uso (código ↔ lugar). */
function capabilitySwatches(properties: FeatureProperties): Record<string, string> {
  return Object.fromEntries(
    CAPABILITY_ATTRIBUTE_KEYS.flatMap((key) => {
      const rung = CAPABILITY_LADDER.find((item) => item.value === mainCapabilityClass(properties[key]))
      return rung ? [[key, rung.color]] : []
    }),
  )
}

const sheet = computed(() => {
  const hit = store.selection
  const layer = store.selectedLayer
  if (!hit || !layer) return null
  return {
    title: featureTitle(hit.properties, layer.titleField, layer.itemLabel),
    subtitle: subtitleOf(layer, hit.properties),
    rows: toAttributeRows(hit.properties, layer.fields),
    swatches: capabilitySwatches(hit.properties),
    detail: layer.detailView ? DETAIL_VIEWS[layer.detailView] : null,
    properties: hit.properties,
  }
})
</script>

<template>
  <article v-if="sheet" aria-live="polite" class="flex flex-col">
    <header class="flex items-start gap-3">
      <div class="min-w-0 flex-1">
        <h2 class="text-[28px] leading-[1.05] font-extrabold tracking-[-0.01em] text-balance">
          {{ sheet.title }}
        </h2>
        <p class="mt-1.5 text-[14px] text-ink-soft">{{ sheet.subtitle }}</p>
      </div>
      <button
        type="button"
        class="-mt-1 -mr-2 grid size-11 shrink-0 cursor-pointer place-items-center rounded-md text-ink-soft hover:bg-gley hover:text-ink"
        aria-label="Cerrar ficha"
        @click="store.select(null)"
      >
        <X class="size-5" aria-hidden="true" />
      </button>
    </header>
    <component :is="sheet.detail" v-if="sheet.detail" :properties="sheet.properties" />
    <div :class="sheet.detail ? '' : 'mt-5'">
      <AttributeList :rows="sheet.rows" :swatches="sheet.swatches" />
    </div>
  </article>
  <div v-else class="flex h-full flex-col justify-center gap-2 py-10">
    <h2 class="text-[20px] leading-tight font-bold text-balance">Ningún elemento seleccionado</h2>
    <p class="max-w-[30ch] text-[15px] leading-relaxed text-ink-soft">
      Toca una unidad de suelo, un río, el embalse o un perfil en el mapa para leer sus datos.
    </p>
  </div>
</template>
