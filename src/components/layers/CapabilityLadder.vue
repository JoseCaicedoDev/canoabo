<script setup lang="ts">
import { computed } from 'vue'
import { CAPABILITY_LADDER } from '@/config/landCapabilityClasses'
import CapabilityRungButton from './CapabilityRungButton.vue'

const props = defineProps<{
  /** Fracción de superficie por clase; vacío mientras la capa carga. */
  shares: Readonly<Record<string, number>> | undefined
  focused: string | null
}>()
const emit = defineEmits<{ focus: [capabilityClass: string] }>()

/** El embalse no es un grado de limitación: va aparte de la escalera I → VIII. */
const NON_CLASS_VALUES = new Set(['EMB'])
const percentFormat = new Intl.NumberFormat('es-VE', { style: 'percent', maximumFractionDigits: 1 })

/** Solo las clases presentes en la cuenca, en el orden de la escalera. */
const present = computed(() =>
  CAPABILITY_LADDER.filter((rung) => !props.shares || (props.shares[rung.value] ?? 0) > 0),
)
const classRungs = computed(() => present.value.filter((rung) => !NON_CLASS_VALUES.has(rung.value)))
const otherRungs = computed(() => present.value.filter((rung) => NON_CLASS_VALUES.has(rung.value)))

function shareOf(value: string): string {
  const share = props.shares?.[value]
  return share === undefined ? '—' : percentFormat.format(share)
}
</script>

<template>
  <section aria-labelledby="ladder-title">
    <h2 id="ladder-title" class="text-[15px] font-bold">Capacidad de uso</h2>
    <p class="mt-1 mb-3 text-[13px] text-ink-soft">
      De menor a mayor limitación. Toca una clase para verla en el mapa.
    </p>
    <div
      class="grid grid-cols-[1.5rem_3.25rem_minmax(0,1fr)_3.5rem] pb-1.5 text-[12px] font-semibold text-ink-soft"
      aria-hidden="true"
    >
      <span />
      <span class="pl-2.5">Clase</span>
      <span>Limitación / uso</span>
      <span class="pr-3 text-right">Sup.</span>
    </div>
    <ol class="overflow-hidden rounded-md border border-gley-line bg-paper">
      <li v-for="rung in classRungs" :key="rung.value" class="border-b border-gley-rule last:border-b-0">
        <CapabilityRungButton
          :rung="rung"
          :share="shareOf(rung.value)"
          :focused="focused === rung.value"
          @focus="emit('focus', rung.value)"
        />
      </li>
    </ol>
    <ul v-if="otherRungs.length > 0" class="mt-3 overflow-hidden rounded-md border border-gley-line bg-paper">
      <li v-for="rung in otherRungs" :key="rung.value">
        <CapabilityRungButton
          :rung="rung"
          :share="shareOf(rung.value)"
          :focused="focused === rung.value"
          @focus="emit('focus', rung.value)"
        />
      </li>
    </ul>
  </section>
</template>
