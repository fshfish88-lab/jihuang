<script setup lang="ts">
const props = defineProps<{
  options: string[]
  active: string
}>()

const emit = defineEmits<{
  change: [value: string]
}>()
</script>

<template>
  <div class="filter-bar" aria-label="筛选内容">
    <button
      type="button"
      class="filter-button"
      :aria-pressed="props.active === ''"
      @click="emit('change', '')"
    >
      全部
    </button>
    <button
      v-for="option in options"
      :key="option"
      type="button"
      class="filter-button"
      :aria-pressed="props.active === option"
      @click="emit('change', props.active === option ? '' : option)"
    >
      {{ option }}
    </button>
  </div>
</template>

