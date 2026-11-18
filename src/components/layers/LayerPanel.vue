<script setup lang="ts">
import { computed } from 'vue'
import { useLayerStore } from '@/stores/layerStore'
import CapabilityLadder from './CapabilityLadder.vue'
import LayerToggle from './LayerToggle.vue'

const store = useLayerStore()

/** Capa que alimenta la escalera (la que declara un atributo de foco). */
const focusLayer = computed(() => store.layers.find((layer) => layer.focus))
/** Capas en orden de lectura: lo que se dibuja encima va primero. */
const layersTopFirst = computed(() => [...store.layers].reverse())
</script>

<template>
  <div class="flex flex-col gap-7">
    <section aria-labelledby="layers-title">
      <h2 id="layers-title" class="text-[15px] font-bold">Capas</h2>
      <ul class="mt-1">
        <LayerToggle
          v-for="layer in layersTopFirst"
          :key="layer.id"
          :layer="layer"
          :visible="store.isVisible(layer.id)"
          :status="store.status[layer.id]"
          :table-open="store.tableLayerId === layer.id"
          @change="store.setVisible(layer.id, $event)"
          @toggle-table="store.toggleTable(layer.id)"
        />
      </ul>
    </section>
    <CapabilityLadder
      v-if="focusLayer"
      :shares="store.areaShares[focusLayer.id]"
      :focused="store.focus[focusLayer.id] ?? null"
      @focus="store.toggleFocus(focusLayer.id, $event)"
    />
  </div>
</template>
