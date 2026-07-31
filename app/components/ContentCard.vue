<script setup lang="ts">
import { entryPath, kindLabels } from '~/data/content'
import type { GuideEntry } from '~/types/content'

defineProps<{ entry: GuideEntry }>()
const assetPath = useAssetPath()
</script>

<template>
  <NuxtLink class="content-card paper-card" :to="entryPath(entry)">
    <div class="content-card__image" :class="{ 'content-card__image--icon': entry.kind === 'wiki' }">
      <img :src="assetPath(entry.image)" :alt="entry.imageAlt" loading="lazy" width="900" height="506">
    </div>
    <div class="content-card__body">
      <div class="content-card__meta">
        <span>{{ kindLabels[entry.kind] }}</span>
        <span>{{ entry.stage }}</span>
      </div>
      <h3>{{ entry.title }}</h3>
      <p>{{ entry.description }}</p>
      <ul class="tag-list" aria-label="标签">
        <li v-for="tag in entry.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</li>
      </ul>
    </div>
  </NuxtLink>
</template>
