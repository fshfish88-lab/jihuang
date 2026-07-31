<script setup lang="ts">
import type { FactValue } from '~/types/wiki'

defineProps<{ facts: FactValue[] }>()
</script>

<template>
  <dl class="wiki-facts" aria-label="关键数据">
    <div v-for="fact in facts" :key="fact.label" class="wiki-facts__item">
      <dt>{{ fact.label }}</dt>
      <dd>{{ fact.value }}</dd>
    </div>
  </dl>
</template>
