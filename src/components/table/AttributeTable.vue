<script setup lang="ts">
import { ChevronLeft, ChevronRight, Search, X } from '@lucide/vue'
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useAttributeTable } from '@/composables/useAttributeTable'
import { boundsOf } from '@/domain/attributeTable'
import type { Feature } from '@/domain/geojson'
import { useLayerStore } from '@/stores/layerStore'
import AttributeGrid from './AttributeGrid.vue'

const store = useLayerStore()
const layer = computed(() => store.tableLayer)
const data = computed(() => (layer.value ? store.layerData[layer.value.id] : undefined))
const table = useAttributeTable(layer, data)
const countFormat = new Intl.NumberFormat('es-VE')

const countLabel = computed(() => {
  const total = countFormat.format(table.total.value)
  if (table.query.value.trim() === '') return `${total} elementos`
  return `${countFormat.format(table.matchingCount.value)} de ${total} elementos`
})
const selectedId = computed(() =>
  store.selection?.layerId === layer.value?.id ? store.selection?.featureId : undefined,
)

/** Fila → elemento seleccionado en el mapa, con la capa visible y el mapa acercado a él. */
function selectRow(feature: Feature): void {
  if (!layer.value) return
  store.setVisible(layer.value.id, true)
  store.select({
    layerId: layer.value.id,
    featureId: feature.id,
    properties: feature.properties,
    zoomTo: boundsOf(feature) ?? undefined,
  })
}

function closeOnEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape') store.closeTable()
}
onMounted(() => window.addEventListener('keydown', closeOnEscape))
onBeforeUnmount(() => window.removeEventListener('keydown', closeOnEscape))
</script>

<template>
  <section
    v-if="layer"
    aria-labelledby="table-title"
    class="flex h-full flex-col border-t border-gley-line bg-paper shadow-[0_-6px_24px_rgb(28_26_23/0.14)]"
  >
    <header
      class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 border-b border-gley-line px-4 py-2.5 sm:grid-cols-[minmax(0,1fr)_16rem_auto]"
    >
      <div class="min-w-0">
        <h2 id="table-title" class="truncate text-[15px] font-bold">Tabla de atributos · {{ layer.title }}</h2>
        <p class="text-[13px] text-ink-soft">{{ countLabel }}</p>
      </div>
      <label
        class="order-last col-span-2 flex min-h-9 items-center gap-2 rounded-md border border-gley-line bg-white px-2.5 sm:order-none sm:col-span-1"
      >
        <Search class="size-4 shrink-0 text-ink-soft" aria-hidden="true" />
        <span class="sr-only">Buscar en la tabla</span>
        <input
          v-model="table.query.value"
          type="search"
          placeholder="Buscar en la tabla"
          class="w-full bg-transparent text-[14px] outline-none placeholder:text-ink-soft"
        />
      </label>
      <button
        type="button"
        class="grid size-9 shrink-0 cursor-pointer place-items-center rounded-md text-ink-soft hover:bg-gley hover:text-ink"
        aria-label="Cerrar tabla de atributos"
        @click="store.closeTable()"
      >
        <X class="size-5" aria-hidden="true" />
      </button>
    </header>

    <div class="min-h-0 flex-1 overflow-auto">
      <p v-if="!data" class="p-4 text-[14px] text-ink-soft">Cargando datos de la capa…</p>
      <p v-else-if="table.current.value.items.length === 0" class="p-4 text-[14px] text-ink-soft">
        Ningún elemento coincide con «{{ table.query.value }}».
      </p>
      <AttributeGrid
        v-else
        :columns="table.columns.value"
        :rows="table.current.value.items"
        :sort="table.sort.value"
        :selected-id="selectedId"
        @sort="table.toggleSort"
        @select="selectRow"
      />
    </div>

    <footer
      v-if="table.current.value.pageCount > 1"
      class="flex items-center justify-end gap-2 border-t border-gley-line px-4 py-1.5 text-[13px]"
    >
      <span class="text-ink-soft">Página {{ table.current.value.page }} de {{ table.current.value.pageCount }}</span>
      <button
        type="button"
        class="grid size-9 cursor-pointer place-items-center rounded-md hover:bg-gley disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Página anterior"
        :disabled="table.current.value.page <= 1"
        @click="table.goToPage(table.current.value.page - 1)"
      >
        <ChevronLeft class="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        class="grid size-9 cursor-pointer place-items-center rounded-md hover:bg-gley disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Página siguiente"
        :disabled="table.current.value.page >= table.current.value.pageCount"
        @click="table.goToPage(table.current.value.page + 1)"
      >
        <ChevronRight class="size-4" aria-hidden="true" />
      </button>
    </footer>
  </section>
</template>
