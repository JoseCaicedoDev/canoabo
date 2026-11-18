<script setup lang="ts">
import { Eraser, House, Minus, Plus } from '@lucide/vue'
import { computed } from 'vue'

const props = defineProps<{ canClear: boolean }>()
const emit = defineEmits<{ zoomIn: []; zoomOut: []; reset: []; clear: [] }>()

const controls = computed(() => [
  { id: 'zoom-in', label: 'Acercar', icon: Plus, disabled: false, run: () => emit('zoomIn') },
  { id: 'zoom-out', label: 'Alejar', icon: Minus, disabled: false, run: () => emit('zoomOut') },
  { id: 'reset', label: 'Ver toda la cuenca', icon: House, disabled: false, run: () => emit('reset') },
  {
    id: 'clear',
    label: 'Quitar selección',
    icon: Eraser,
    disabled: !props.canClear,
    run: () => emit('clear'),
  },
])
</script>

<template>
  <div
    role="group"
    aria-label="Navegación del mapa"
    class="flex flex-col overflow-hidden rounded-md border border-gley-line bg-paper shadow-[0_1px_3px_rgb(28_26_23/0.18)]"
  >
    <button
      v-for="control in controls"
      :key="control.id"
      type="button"
      class="grid size-10 cursor-pointer place-items-center border-b border-gley-rule text-ink last:border-b-0 hover:bg-gley disabled:cursor-not-allowed disabled:text-ink-soft/40 disabled:hover:bg-transparent"
      :aria-label="control.label"
      :title="control.label"
      :disabled="control.disabled"
      @click="control.run"
    >
      <component :is="control.icon" class="size-[18px]" aria-hidden="true" />
    </button>
  </div>
</template>
