<script setup lang="ts">
import { Map as MapIcon, Mountain, Satellite } from '@lucide/vue'
import type { Component } from 'vue'
import type { BasemapDefinition } from '@/domain/layer'

defineProps<{ basemaps: readonly BasemapDefinition[]; selectedId: string }>()
const emit = defineEmits<{ select: [id: string] }>()

const ICONS: Record<string, Component> = { satelite: Satellite, relieve: Mountain }
</script>

<template>
  <div
    role="radiogroup"
    aria-label="Mapa base"
    class="flex rounded-md border border-gley-line bg-paper p-0.5 shadow-[0_1px_3px_rgb(28_26_23/0.18)]"
  >
    <button
      v-for="basemap in basemaps"
      :key="basemap.id"
      type="button"
      role="radio"
      :aria-checked="basemap.id === selectedId"
      class="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-[5px] px-3 text-[14px] transition-colors duration-150"
      :class="basemap.id === selectedId ? 'bg-humus text-on-humus' : 'text-ink hover:bg-gley'"
      @click="emit('select', basemap.id)"
    >
      <component :is="ICONS[basemap.id] ?? MapIcon" class="size-4" aria-hidden="true" />
      {{ basemap.title }}
    </button>
  </div>
</template>
