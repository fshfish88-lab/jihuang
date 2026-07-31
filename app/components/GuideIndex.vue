<script setup lang="ts">
import { getEntries } from '~/data/content'
import type { ContentKind } from '~/types/content'

const props = defineProps<{
  kind: ContentKind
  eyebrow: string
  title: string
  description: string
  filters?: string[]
}>()

const activeFilter = ref('')
const entries = computed(() => getEntries(props.kind))
const filtered = computed(() => {
  if (!activeFilter.value) return entries.value
  return entries.value.filter(entry => entry.tags.includes(activeFilter.value))
})

useSeoMeta({
  title: props.title,
  description: props.description
})
</script>

<template>
  <div class="page-shell">
    <div class="container">
      <header class="index-hero">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
        <span class="stamp">共 {{ entries.length }} 份手记</span>
      </header>

      <FilterBar
        v-if="filters?.length"
        :options="filters"
        :active="activeFilter"
        @change="activeFilter = $event"
      />

      <div class="content-grid">
        <ContentCard v-for="entry in filtered" :key="entry.slug" :entry="entry" />
        <div v-if="filtered.length === 0" class="empty-state">
          <h2>这组筛选还没有条目</h2>
          <p>换一个标签，或者回到“全部”。</p>
          <button type="button" class="filter-button" @click="activeFilter = ''">清除筛选</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.index-hero {
  position: relative;
  max-width: 58rem;
  padding: 3rem 0 2rem;
}
.index-hero h1 { margin: 0 0 1rem; }
.index-hero > p:last-of-type { max-width: 42rem; color: var(--ash); }
.stamp { position: absolute; right: 0; bottom: 2rem; }
@media (max-width: 680px) {
  .index-hero { padding-top: 1rem; }
  .stamp { position: static; margin-top: .75rem; }
}
</style>

