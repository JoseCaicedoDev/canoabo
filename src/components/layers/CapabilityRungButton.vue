<script setup lang="ts">
import type { CapabilityRung } from '@/config/landCapabilityClasses'

defineProps<{
  rung: CapabilityRung
  share: string
  focused: boolean
}>()
const emit = defineEmits<{ focus: [] }>()
</script>

<template>
  <button
    type="button"
    class="grid h-10 w-full cursor-pointer grid-cols-[1.5rem_3.25rem_minmax(0,1fr)_3.5rem] items-stretch text-left transition-colors duration-150 hover:bg-gley/60"
    :class="focused ? 'bg-ochre-wash shadow-[inset_0_0_0_2px_var(--color-ochre)]' : ''"
    :aria-pressed="focused"
    @click="emit('focus')"
  >
    <span class="block" :style="{ backgroundColor: rung.color }" aria-hidden="true" />
    <span class="self-center pl-2.5 text-[16px] font-extrabold tracking-tight">{{ rung.label }}</span>
    <span class="self-center truncate pr-2 text-[14px]">{{ rung.description }}</span>
    <span class="self-center pr-3 text-right text-[14px] text-ink-soft">{{ share }}</span>
  </button>
</template>
