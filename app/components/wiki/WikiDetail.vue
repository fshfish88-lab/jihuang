<script setup lang="ts">
import { getWikiEntry } from '~/data/wiki'
import type { WikiEntry } from '~/types/wiki'

const props = defineProps<{ entry: WikiEntry }>()
const assetPath = useAssetPath()
const absoluteAsset = useAbsoluteAsset()

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
  ogImage: absoluteAsset(props.entry.image.path)
})
</script>

<template>
  <article class="page-shell wiki-detail">
    <div class="container">
      <NuxtLink class="wiki-back-link" to="/wiki">← 返回百科索引</NuxtLink>

      <nav class="detail-jumps" aria-label="档案章节">
        <a :href="entry.dish ? '#dish-title' : '#crafting-title'">{{ entry.dish ? '配方' : '制作' }}</a>
        <a href="#acquisition-title">获取</a><a v-if="entry.combat" href="#combat">战斗</a><a href="#uses">用途与提示</a><a href="#sources">资料来源</a>
      </nav>
      <header id="article-top" class="wiki-dossier paper-card">
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
        <div class="wiki-detail__main">
          <WikiDishRecipePanel v-if="entry.dish" :dish="entry.dish" />
          <WikiCraftingRecipe v-else :crafting="entry.crafting" />
          <WikiAcquisitionList :methods="entry.acquisition" />
          <WikiCombatGuidePanel v-if="entry.combat" :combat="entry.combat" />

          <NuxtLink
            v-if="entry.routeGuide"
            class="wiki-route-link paper-card"
            :to="`/progression/${entry.routeGuide}`"
          >
            <span>
              <small>{{ entry.route }}路线</small>
              查看本条目所在的完整进阶攻略
            </span>
            <strong aria-hidden="true">→</strong>
          </NuxtLink>

          <section id="uses" class="wiki-section wiki-brief paper-card">
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
        </div>

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
      <a class="back-to-top text-link" href="#article-top">返回本页顶部 ↑</a>
    </div>
  </article>
</template>
<style scoped>
@media (max-width: 620px) {
  .wiki-dossier { grid-template-columns: 4rem minmax(0, 1fr); gap: .8rem; padding: .9rem; }
  .wiki-dossier :deep(.wiki-icon__frame) { width: 4rem; height: 4rem; box-shadow: 2px 2px 0 rgba(23,23,20,.2); }
  .wiki-dossier :deep(.wiki-icon img) { width: 3rem; height: 3rem; }
  .wiki-dossier__topline { margin-bottom: .5rem; }
  .wiki-dossier__topline > span:last-child { display: none; }
  .wiki-dossier h1 { font-size: 2rem; }
  .wiki-dossier__english { font-size: .7rem; overflow-wrap: anywhere; }
  .wiki-dossier__summary { font-size: .9rem; line-height: 1.7; }
  .wiki-dossier :deep(.wiki-facts) { grid-column: 1 / -1; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .4rem; }
  .wiki-dossier :deep(.wiki-facts > div) { min-width: 0; flex-wrap: wrap; gap: .2rem; padding: .5rem; }
  .wiki-dossier :deep(.wiki-facts__item) { display: block; }
  .wiki-dossier :deep(.wiki-facts dt) { font-size: .65rem; }
  .wiki-dossier :deep(.wiki-facts dd) { margin: .3rem 0 0; font-size: .85rem; line-height: 1.5; text-align: left; overflow-wrap: anywhere; }
}
</style>
