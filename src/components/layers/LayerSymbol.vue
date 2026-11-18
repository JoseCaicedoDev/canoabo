<script setup lang="ts">
import { computed } from 'vue'
import type { LayerStyle } from '@/domain/layer'

const props = defineProps<{ layerStyle: LayerStyle }>()

interface SymbolSpec {
  readonly shape: 'area' | 'ramp' | 'line' | 'point'
  readonly fill: string | readonly string[]
  readonly stroke?: string
}

/** Muestra pequeña de cómo se dibuja la capa: área, línea o punto. */
function symbolFor(style: LayerStyle): SymbolSpec {
  switch (style.kind) {
    case 'fill':
      return { shape: 'area', fill: style.color, stroke: style.outlineColor }
    case 'categorized-fill':
      return { shape: 'ramp', fill: style.categories.map((category) => category.color) }
    case 'line':
      return { shape: 'line', fill: style.color, stroke: style.casingColor }
    case 'circle':
      return { shape: 'point', fill: style.color, stroke: style.strokeColor }
  }
}

const symbol = computed(() => symbolFor(props.layerStyle))
</script>

<template>
  <svg class="size-5 shrink-0" viewBox="0 0 20 20" aria-hidden="true">
    <template v-if="symbol.shape === 'ramp' && Array.isArray(symbol.fill)">
      <rect
        v-for="(color, index) in symbol.fill.slice(0, 4)"
        :key="color"
        :x="2 + index * 4"
        y="3"
        width="4"
        height="14"
        :fill="color"
      />
      <rect x="2" y="3" width="16" height="14" fill="none" stroke="#1c1a17" stroke-width="1" />
    </template>
    <rect
      v-else-if="symbol.shape === 'area'"
      x="2"
      y="3"
      width="16"
      height="14"
      rx="2"
      :fill="String(symbol.fill)"
      :stroke="symbol.stroke"
    />
    <template v-else-if="symbol.shape === 'line'">
      <path v-if="symbol.stroke" d="M2 14 C7 4, 13 16, 18 6" :stroke="symbol.stroke" stroke-width="5" fill="none" stroke-linecap="round" />
      <path d="M2 14 C7 4, 13 16, 18 6" :stroke="String(symbol.fill)" stroke-width="2" fill="none" stroke-linecap="round" />
    </template>
    <circle v-else cx="10" cy="10" r="6" :fill="String(symbol.fill)" stroke="#1c1a17" stroke-width="1.5" />
  </svg>
</template>
