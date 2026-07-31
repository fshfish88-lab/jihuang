<script setup lang="ts">
import { entryPath, getEntries, kindLabels } from '~/data/content'

useSeoMeta({
  title: '搜索攻略',
  description: '按中文名、英文名、玩家俗称和标签搜索火堆边百科。'
})

const { query, results } = useSearchIndex()
const assetPath = useAssetPath()
const input = ref<HTMLInputElement | null>(null)
const popular = [
  ...getEntries('beginner').slice(0, 2),
  ...getEntries('boss').slice(0, 2),
  ...getEntries('wiki').filter(item => ['torch', 'pierogi'].includes(item.slug))
]

onMounted(() => input.value?.focus())
</script>

<template>
  <div class="page-shell search-page">
    <div class="container">
      <header class="search-head">
        <p class="eyebrow">Field Index</p>
        <h1>你要找什么？</h1>
        <p>支持中文名、英文名、简称、俗称和标签，例如“巨鹿”“dl”“机器人”“复活”。</p>
      </header>

      <label class="search-box paper-card">
        <span class="sr-only">搜索条目</span>
        <input
          ref="input"
          v-model="query"
          type="search"
          autocomplete="off"
          placeholder="输入角色、Boss、物品或问题……"
        >
        <button v-if="query" type="button" @click="query = ''">清除</button>
        <span v-else>SEARCH</span>
      </label>

      <section v-if="query.trim()" aria-live="polite">
        <div class="result-count">
          <strong>{{ results.length }}</strong>
          <span>份相关手记</span>
        </div>
        <div v-if="results.length" class="search-results">
          <NuxtLink v-for="entry in results" :key="entry.slug" :to="entryPath(entry)" class="search-result">
            <img :src="assetPath(entry.image)" :alt="entry.imageAlt" width="240" height="135">
            <div>
              <small>{{ kindLabels[entry.kind] }} · {{ entry.stage }}</small>
              <h2>{{ entry.title }}</h2>
              <p>{{ entry.description }}</p>
              <ul class="tag-list">
                <li v-for="tag in entry.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</li>
              </ul>
            </div>
            <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>
        <div v-else class="empty-state">
          <h2>手记里暂时没有这个词</h2>
          <p>试试更短的关键词、角色中文名，或改用常见俗称。</p>
        </div>
      </section>

      <section v-else>
        <div class="section-heading">
          <div>
            <p class="eyebrow">Most Needed</p>
            <h2>新手最常翻的几页</h2>
          </div>
        </div>
        <div class="content-grid">
          <ContentCard v-for="entry in popular" :key="entry.slug" :entry="entry" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.search-head { max-width: 48rem; padding: 2rem 0; }
.search-head h1 { margin: .25rem 0 1rem; }
.search-head > p:last-child { color: var(--ash); }
.search-box {
  display: grid;
  grid-template-columns: 1fr auto;
  margin-bottom: 3rem;
}
.search-box input {
  min-width: 0;
  min-height: 4.2rem;
  padding: .8rem 1.2rem;
  border: 0;
  color: var(--ink);
  background: transparent;
  font-size: 1.1rem;
  outline: none;
}
.search-box > button,
.search-box > span {
  min-width: 5.5rem;
  border: 0;
  color: var(--paper-0);
  background: var(--ink);
  font: 800 .72rem/1 var(--font-sans);
  letter-spacing: .1em;
  cursor: pointer;
}
.search-box > span { display: grid; place-items: center; }
.result-count { display: flex; align-items: baseline; gap: .5rem; margin-bottom: 1rem; }
.result-count strong { color: var(--blood); font: 900 2.2rem/1 var(--font-display); }
.result-count span { color: var(--ash); }
.search-results { border-top: 2px solid var(--ink); }
.search-result {
  display: grid;
  grid-template-columns: 10rem 1fr auto;
  gap: 1.2rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--line);
  color: inherit;
  text-decoration: none;
}
.search-result:hover { color: inherit; background: rgba(203,191,155,.35); }
.search-result img { width: 10rem; aspect-ratio: 16/9; object-fit: cover; filter: sepia(.15) saturate(.8); }
.search-result small { color: var(--blood); font: 800 .68rem/1 var(--font-sans); }
.search-result h2 { margin: .35rem 0; font-size: 1.35rem; }
.search-result p { margin: 0 0 .6rem; color: var(--ash); font-size: .85rem; line-height: 1.55; }
.search-result > span { padding: 1rem; font-size: 1.5rem; }
@media (max-width: 620px) {
  .search-result { grid-template-columns: 6rem 1fr; }
  .search-result img { width: 6rem; }
  .search-result > span { display: none; }
}
</style>
