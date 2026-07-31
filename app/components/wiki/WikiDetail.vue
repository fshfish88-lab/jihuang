<script setup lang="ts">
import { getWikiEntry } from '~/data/wiki'
import type { WikiEntry } from '~/types/wiki'

const props = defineProps<{ entry: WikiEntry }>()
const assetPath = useAssetPath()

const relatedEntries = computed(() =>
  props.entry.related
    .map(slug => getWikiEntry(slug))
    .filter((entry): entry is WikiEntry => Boolean(entry))
)

useSeoMeta({
  title: props.entry.title,
  description: props.entry.summary,
  ogTitle: `${props.entry.title}｜火堆边百科`,
  ogDescription: props.entry.summary,
  ogImage: assetPath(props.entry.image.path)
})
</script>

<template>
  <article class="page-shell wiki-detail">
    <div class="container">
      <NuxtLink class="wiki-back-link" to="/wiki">← 返回百科索引</NuxtLink>

      <header class="wiki-dossier paper-card">
        <WikiItemIcon :image="entry.image" />
        <div class="wiki-dossier__copy">
          <div class="wiki-dossier__topline">
            <span class="stamp">{{ entry.category }}</span>
            <span>档案编号 / {{ entry.slug }}</span>
          </div>
          <p class="eyebrow">{{ entry.stage }} · {{ entry.version }}</p>
          <h1>{{ entry.title }}</h1>
          <p class="wiki-dossier__english">{{ entry.english }}</p>
          <p class="wiki-dossier__summary">{{ entry.summary }}</p>
          <ul class="tag-list" aria-label="标签">
            <li v-for="tag in entry.tags" :key="tag" class="tag">{{ tag }}</li>
          </ul>
        </div>
        <WikiFactsPanel :facts="entry.facts.slice(0, 5)" />
      </header>

      <div class="wiki-detail__layout">
        <main class="wiki-detail__main">
          <WikiDishRecipePanel v-if="entry.dish" :dish="entry.dish" />
          <WikiCraftingRecipe v-else :crafting="entry.crafting" />
          <WikiAcquisitionList :methods="entry.acquisition" />

          <section class="wiki-section wiki-brief paper-card">
            <div>
              <p class="eyebrow">Use Cases</p>
              <h2>用途</h2>
              <ul>
                <li v-for="use in entry.uses" :key="use">{{ use }}</li>
              </ul>
            </div>
            <div>
              <p class="eyebrow">Field Notes</p>
              <h2>实战提示</h2>
              <ul>
                <li v-for="tip in entry.tips" :key="tip">{{ tip }}</li>
              </ul>
            </div>
            <div v-if="entry.mistakes.length" class="wiki-brief__warning">
              <p class="eyebrow">Avoid</p>
              <h2>常见失误</h2>
              <ul>
                <li v-for="mistake in entry.mistakes" :key="mistake">{{ mistake }}</li>
              </ul>
            </div>
          </section>
        </main>

        <aside class="wiki-related paper-card">
          <span class="stamp">关联档案</span>
          <h2>继续查阅</h2>
          <ul>
            <li v-for="related in relatedEntries" :key="related.slug">
              <NuxtLink :to="`/wiki/${related.slug}`">
                <img
                  :src="assetPath(related.image.path)"
                  :alt="related.image.alt"
                  width="48"
                  height="48"
                  loading="lazy"
                >
                <span><strong>{{ related.title }}</strong><small>{{ related.category }} · {{ related.stage }}</small></span>
              </NuxtLink>
            </li>
          </ul>
          <NuxtLink class="text-link" to="/search">搜索更多档案</NuxtLink>
        </aside>
      </div>

      <WikiSourceAttribution
        :sources="entry.sources"
        :image="entry.image"
        :verified-at="entry.verifiedAt"
      />
    </div>
  </article>
</template>
