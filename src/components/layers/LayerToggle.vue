<script setup lang="ts">
import { LoaderCircle, Table2, TriangleAlert } from '@lucide/vue'
import BaseSwitch from '@/components/base/BaseSwitch.vue'
import type { LayerDefinition } from '@/domain/layer'
import type { LayerStatus } from '@/stores/layerStore'
import LayerSymbol from './LayerSymbol.vue'

defineProps<{
  layer: LayerDefinition
  visible: boolean
  status: LayerStatus | undefined
  tableOpen: boolean
}>()
const emit = defineEmits<{ change: [visible: boolean]; toggleTable: [] }>()
</script>

<template>
  <li class="flex items-center gap-3 border-b border-gley-rule py-2.5">
    <LayerSymbol :layer-style="layer.style" />
    <div class="min-w-0 flex-1">
      <p class="text-[15px] leading-tight font-semibold">{{ layer.title }}</p>
      <p v-if="status === 'error'" class="mt-0.5 flex items-center gap-1 text-[13px] text-oxide">
        <TriangleAlert class="size-3.5" aria-hidden="true" />
        No se pudo cargar. Recarga la página.
      </p>
      <p v-else-if="status === 'loading'" class="mt-0.5 flex items-center gap-1 text-[13px] text-ink-soft">
        <LoaderCircle class="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
        Cargando…
      </p>
    </div>
    <button
      type="button"
      class="grid size-9 shrink-0 cursor-pointer place-items-center rounded-md transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40"
      :class="tableOpen ? 'bg-humus text-on-humus' : 'text-ink-soft hover:bg-gley-rule hover:text-ink'"
      :aria-label="`Tabla de atributos de ${layer.title}`"
      :title="`Tabla de atributos de ${layer.title}`"
      :aria-pressed="tableOpen"
      :disabled="status !== 'ready'"
      @click="emit('toggleTable')"
    >
      <Table2 class="size-[18px]" aria-hidden="true" />
    </button>
    <BaseSwitch
      :checked="visible"
      :label="`Mostrar ${layer.title}`"
      :disabled="status === 'error'"
      @change="emit('change', $event)"
    />
  </li>
</template>
