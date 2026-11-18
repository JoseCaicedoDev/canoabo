<script setup lang="ts">
import { computed } from 'vue'
import type { FeatureProperties } from '@/domain/geojson'
import { drawnBottom, horizonsOf, type Horizon } from '@/domain/soilProfile'
import { horizonTone, isDarkTone } from './horizonTone'

const props = defineProps<{ properties: FeatureProperties }>()

const COLUMN_HEIGHT_PX = 300
const ROW_MIN_GAP_PX = 44
const BAND_LABEL_MIN_PX = 18
const numberFormat = new Intl.NumberFormat('es-VE', { maximumFractionDigits: 2 })

const horizons = computed(() => horizonsOf(props.properties))
const deepest = computed(() => Math.max(...horizons.value.map((horizon) => drawnBottom(horizon.depth)), 1))
const pxPerCm = computed(() => COLUMN_HEIGHT_PX / deepest.value)

interface Band {
  readonly horizon: Horizon
  readonly top: number
  readonly height: number
  readonly rowTop: number
}

/** Bandas a escala real; las filas de valores se empujan hacia abajo si dos horizontes son muy finos. */
const bands = computed<readonly Band[]>(() => {
  let previousRowTop = -ROW_MIN_GAP_PX
  return horizons.value.map((horizon) => {
    const top = horizon.depth.top * pxPerCm.value
    const height = (drawnBottom(horizon.depth) - horizon.depth.top) * pxPerCm.value
    const rowTop = Math.max(top, previousRowTop + ROW_MIN_GAP_PX)
    previousRowTop = rowTop
    return { horizon, top, height, rowTop }
  })
})

/** El último horizonte sin límite inferior medido se dibuja abierto: sin borde y desvanecido. */
const isOpenEnded = computed(() => horizons.value.at(-1)?.depth.bottom === null)
const OPEN_FADE = 'linear-gradient(to bottom, #000 45%, transparent)'

function isOpenBand(index: number): boolean {
  return isOpenEnded.value && index === bands.value.length - 1
}

function bandStyle(band: Band, index: number): Record<string, string> {
  return {
    top: `${band.top}px`,
    height: `${band.height}px`,
    ...(isOpenBand(index) ? { borderBottomWidth: '0' } : {}),
  }
}

/** Solo el relleno se desvanece; la etiqueta del horizonte queda sólida encima. */
function fillStyle(band: Band, index: number): Record<string, string> {
  return {
    backgroundColor: horizonTone(band.horizon.organicMatter),
    ...(isOpenBand(index) ? { maskImage: OPEN_FADE } : {}),
  }
}

/** Etiqueta accesible con la profundidad medida, nunca la extensión gráfica del horizonte abierto. */
const profileLabel = computed(() => {
  const last = horizons.value.at(-1)
  const reach = last?.depth.bottom ?? last?.depth.top ?? 0
  const qualifier = isOpenEnded.value ? 'más de' : 'hasta'
  return `Perfil de ${horizons.value.length} horizontes, ${qualifier} ${reach} cm`
})

const containerHeight = computed(() =>
  Math.max(COLUMN_HEIGHT_PX, (bands.value.at(-1)?.rowTop ?? 0) + ROW_MIN_GAP_PX),
)

function depthLabel({ depth }: Horizon): string {
  return depth.bottom === null ? `> ${depth.top} cm` : `${depth.top}–${depth.bottom} cm`
}

function measure(value: number | null, unit = ''): string {
  return value === null ? 's/d' : `${numberFormat.format(value)}${unit}`
}
</script>

<template>
  <figure v-if="bands.length > 0" class="my-5">
    <div class="relative grid grid-cols-[4.5rem_1fr] gap-x-4" :style="{ height: `${containerHeight}px` }">
      <div
        :key="String(properties.ID)"
        class="horizon-settle relative overflow-hidden border-2 border-ink"
        :class="isOpenEnded ? 'rounded-t-[3px] border-b-0' : 'rounded-[3px]'"
        :style="{ height: `${COLUMN_HEIGHT_PX}px` }"
        role="img"
        :aria-label="profileLabel"
      >
        <div
          v-for="(band, index) in bands"
          :key="band.horizon.name"
          class="absolute inset-x-0 flex items-end justify-center border-b border-ink/40 pb-1 text-[13px] font-bold"
          :class="isDarkTone(band.horizon.organicMatter) ? 'text-on-humus' : 'text-ink'"
          :style="bandStyle(band, index)"
        >
          <span class="absolute inset-0" :style="fillStyle(band, index)" aria-hidden="true" />
          <span v-if="band.height >= BAND_LABEL_MIN_PX" class="relative">{{ band.horizon.name }}</span>
        </div>
      </div>
      <dl class="relative">
        <div
          v-for="band in bands"
          :key="band.horizon.name"
          class="absolute inset-x-0 border-t border-gley-line pt-1.5"
          :style="{ top: `${band.rowTop}px` }"
        >
          <dt class="flex justify-between gap-2 text-[14px] font-semibold">
            <span>{{ band.horizon.name }} · {{ depthLabel(band.horizon) }}</span>
            <span>{{ band.horizon.texture ?? 's/d' }}</span>
          </dt>
          <dd class="flex justify-between gap-2 text-[13px] text-ink-soft">
            <span>pH {{ measure(band.horizon.ph) }}</span>
            <span>MO {{ measure(band.horizon.organicMatter, ' %') }}</span>
          </dd>
        </div>
      </dl>
    </div>
  </figure>
</template>
