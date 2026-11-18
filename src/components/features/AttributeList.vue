<script setup lang="ts">
import type { AttributeRow } from '@/domain/featureAttributes'

defineProps<{
  rows: readonly AttributeRow[]
  /** Color de muestra por clave de atributo (p. ej. la clase de capacidad de uso). */
  swatches?: Readonly<Record<string, string>>
}>()
</script>

<template>
  <dl v-if="rows.length > 0" class="grid grid-cols-[minmax(0,1fr)_auto] border-t-2 border-ink">
    <template v-for="row in rows" :key="row.key">
      <dt class="border-b border-gley-rule py-2 pr-3 text-[14px] text-ink-soft">{{ row.label }}</dt>
      <dd
        class="flex max-w-[14rem] items-center justify-end gap-2 border-b border-gley-rule py-2 text-right text-[14px] font-semibold break-words"
      >
        <span
          v-if="swatches?.[row.key]"
          class="inline-block h-4 w-6 shrink-0 rounded-[2px] border border-ink/30"
          :style="{ backgroundColor: swatches[row.key] }"
          aria-hidden="true"
        />
        {{ row.value }}
      </dd>
    </template>
  </dl>
  <p v-else class="text-[14px] text-ink-soft">Este elemento no tiene atributos registrados.</p>
</template>
