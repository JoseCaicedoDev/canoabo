<script setup lang="ts">
import { Layers, X } from '@lucide/vue'
import { computed, ref, watch } from 'vue'
import FeatureSheet from '@/components/features/FeatureSheet.vue'
import LayerPanel from '@/components/layers/LayerPanel.vue'
import GeoMap from '@/components/map/GeoMap.vue'
import AttributeTable from '@/components/table/AttributeTable.vue'
import { useLayerStore } from '@/stores/layerStore'

const store = useLayerStore()
/** Solo en pantallas pequeñas: el panel de capas se abre como hoja inferior. */
const isPanelOpen = ref(false)
const hasSelection = computed(() => store.selection !== null)
const isTableOpen = computed(() => store.tableLayerId !== null)

// En móvil, al abrir una tabla se cierra la hoja de capas para dejar ver el mapa y la tabla.
watch(isTableOpen, (open) => {
  if (open) isPanelOpen.value = false
})

// max-h-[55dvh] debe coincidir con MOBILE_SHEET_HEIGHT_RATIO (src/app/layout.ts).
const SHEET_CLASSES =
  'fixed inset-x-0 bottom-0 z-20 max-h-[55dvh] overflow-y-auto rounded-t-xl border-t border-gley-line px-5 pt-4 pb-6 shadow-[0_-6px_24px_rgb(28_26_23/0.18)] lg:static lg:z-auto lg:max-h-none lg:rounded-none lg:border-t-0 lg:shadow-none'
</script>

<template>
  <div class="flex h-dvh flex-col">
    <header class="flex h-14 shrink-0 items-center gap-4 bg-humus px-4 text-on-humus lg:px-6">
      <h1 class="text-[22px] font-extrabold tracking-[-0.01em]">Canoabo</h1>
      <p class="hidden truncate text-[14px] text-on-humus-soft sm:block">Cuenca del río Canoabo · Carabobo</p>
      <button
        type="button"
        class="ml-auto flex min-h-10 cursor-pointer items-center gap-2 rounded-md bg-humus-raised px-3 text-[14px] font-semibold lg:hidden"
        :aria-expanded="isPanelOpen"
        aria-controls="layer-panel"
        @click="isPanelOpen = !isPanelOpen"
      >
        <component :is="isPanelOpen ? X : Layers" class="size-4" aria-hidden="true" />
        {{ isPanelOpen ? 'Cerrar' : 'Capas' }}
      </button>
    </header>

    <main class="relative grid min-h-0 flex-1 lg:grid-cols-[340px_minmax(0,1fr)_380px]">
      <aside
        id="layer-panel"
        aria-label="Capas y leyenda"
        class="bg-gley lg:overflow-y-auto lg:border-r lg:border-gley-line lg:p-5"
        :class="[SHEET_CLASSES, isPanelOpen ? 'block' : 'hidden lg:block']"
      >
        <LayerPanel />
      </aside>

      <!-- min-w-0: una tabla ancha no debe ensanchar la columna del mapa más allá de la pantalla. -->
      <section aria-label="Mapa" class="flex min-h-0 min-w-0 flex-col">
        <div class="min-h-0 flex-1">
          <GeoMap />
        </div>
        <div v-if="isTableOpen" class="h-[42%] min-h-56 shrink-0">
          <AttributeTable />
        </div>
      </section>

      <aside
        aria-label="Ficha del elemento seleccionado"
        class="bg-paper lg:overflow-y-auto lg:border-l lg:border-gley-line lg:px-6 lg:py-5"
        :class="[SHEET_CLASSES, hasSelection && !isPanelOpen ? 'block' : 'hidden lg:block']"
      >
        <FeatureSheet />
      </aside>
    </main>
  </div>
</template>
