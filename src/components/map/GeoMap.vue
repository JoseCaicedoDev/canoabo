<script setup lang="ts">
import { ref } from 'vue'
import { BASEMAPS } from '@/config/basemaps'
import { useGeoMap } from '@/composables/useGeoMap'
import { useLayerStore } from '@/stores/layerStore'
import BasemapSwitcher from './BasemapSwitcher.vue'
import MapControls from './MapControls.vue'

const store = useLayerStore()
const container = ref<HTMLElement | null>(null)
const { resetView, zoomIn, zoomOut } = useGeoMap(container)
</script>

<template>
  <div class="relative size-full bg-gley">
    <!-- MapLibre impone position: relative al contenedor: se dimensiona con size-full, no con inset. -->
    <div ref="container" class="size-full" />
    <div class="absolute top-2.5 left-2.5">
      <BasemapSwitcher :basemaps="BASEMAPS" :selected-id="store.basemapId" @select="store.selectBasemap" />
    </div>
    <div class="absolute top-2.5 right-2.5">
      <MapControls
        :can-clear="store.hasActiveSelection"
        @zoom-in="zoomIn"
        @zoom-out="zoomOut"
        @reset="resetView"
        @clear="store.clearSelection"
      />
    </div>
  </div>
</template>
