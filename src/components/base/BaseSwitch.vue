<script setup lang="ts">
defineProps<{ checked: boolean; label: string; disabled?: boolean }>()
const emit = defineEmits<{ change: [checked: boolean] }>()
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="checked"
    :aria-label="label"
    :disabled="disabled"
    class="relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-out-expo disabled:cursor-not-allowed disabled:opacity-50"
    :class="checked ? 'bg-humus' : 'bg-gley-line'"
    @click="emit('change', !checked)"
  >
    <span
      class="absolute top-1 size-4 rounded-full bg-on-humus shadow-[0_1px_2px_rgb(28_26_23/0.35)] transition-[left] duration-200 ease-out-expo"
      :class="checked ? 'left-5' : 'left-1'"
    />
  </button>
</template>
