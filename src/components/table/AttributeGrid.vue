<script setup lang="ts">
import { ArrowDown, ArrowUp, ArrowUpDown } from '@lucide/vue'
import type { TableColumn, TableSort } from '@/domain/attributeTable'
import type { AttributeValue, Feature } from '@/domain/geojson'
import { toFiniteNumber } from '@/domain/numbers'

defineProps<{
  columns: readonly TableColumn[]
  rows: readonly Feature[]
  sort: TableSort | null
  selectedId: string | number | undefined
}>()
const emit = defineEmits<{ sort: [key: string]; select: [feature: Feature] }>()

const EMPTY_CELL = '—'
const numberFormat = new Intl.NumberFormat('es-VE', { maximumFractionDigits: 3 })

function cellText(value: AttributeValue | undefined, numeric: boolean): string {
  if (value === null || value === undefined || value === '') return EMPTY_CELL
  const amount = numeric ? toFiniteNumber(value) : null
  return amount === null ? String(value) : numberFormat.format(amount)
}

function ariaSort(column: TableColumn, sort: TableSort | null): 'ascending' | 'descending' | 'none' {
  if (sort?.key !== column.key) return 'none'
  return sort.direction === 'asc' ? 'ascending' : 'descending'
}
</script>

<template>
  <table class="w-max min-w-full border-collapse text-[13px]">
    <thead class="sticky top-0 z-10 bg-gley">
      <tr>
        <th
          v-for="column in columns"
          :key="column.key"
          scope="col"
          :aria-sort="ariaSort(column, sort)"
          class="border-b-2 border-ink p-0 font-semibold whitespace-nowrap"
        >
          <button
            type="button"
            class="flex min-h-10 w-full cursor-pointer items-center gap-1.5 px-3 hover:bg-gley-rule"
            :class="column.numeric ? 'justify-end' : 'justify-start'"
            @click="emit('sort', column.key)"
          >
            {{ column.label }}
            <ArrowUp v-if="sort?.key === column.key && sort.direction === 'asc'" class="size-3.5" aria-hidden="true" />
            <ArrowDown v-else-if="sort?.key === column.key" class="size-3.5" aria-hidden="true" />
            <ArrowUpDown v-else class="size-3.5 text-ink-soft/60" aria-hidden="true" />
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in rows"
        :key="String(row.id)"
        class="cursor-pointer border-b border-gley-rule hover:bg-gley/60"
        :class="row.id === selectedId ? 'bg-ochre-wash font-semibold' : ''"
        :aria-selected="row.id === selectedId"
        tabindex="0"
        @click="emit('select', row)"
        @keydown.enter="emit('select', row)"
      >
        <td
          v-for="column in columns"
          :key="column.key"
          class="max-w-[18rem] truncate px-3 py-1.5"
          :class="column.numeric ? 'text-right' : 'text-left'"
          :title="cellText(row.properties[column.key], false)"
        >
          {{ cellText(row.properties[column.key], column.numeric) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
