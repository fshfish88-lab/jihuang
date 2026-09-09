<script setup lang="ts">
import { wikiEntries } from '~/data/wiki'
import { getEntries } from '~/data/content'
import { wikiDescription } from '~/data/site-metadata'
import { buildSearchIndex, searchEntries } from '~/utils/search'

useSeoMeta({ title: '百科资料', description: wikiDescription })
const query = useQueryValue('q')
const category = useQueryValue('category')
const routeFilter = useQueryValue('route')
const benefit = useQueryValue('benefit')
const ingredient = useQueryValue('ingredient')
const pageValue = useQueryValue('page', false)
const route = useRoute()
const assetPath = useAssetPath()
const categories = ['资源', '工具', '装备', '建筑', '料理', '生物', '季节与探索']
const routeOptions = [...new Set(wikiEntries.flatMap(entry => entry.route ? [entry.route] : []))]
const ingredientOptions = [...new Set(wikiEntries.flatMap(entry => entry.dish?.examples.flatMap(example => example.ingredients.map(item => item.name)) || []))].sort((a, b) => a.localeCompare(b, 'zh-CN'))
const index = buildSearchIndex(getEntries('wiki'))
const filtered = computed(() => {
  const matches = query.value.trim() ? new Set(searchEntries(index, query.value).map(entry => entry.slug)) : null
  return wikiEntries.filter(entry =>
    (!matches || matches.has(entry.slug)) &&
    (!category.value || entry.category === category.value) &&
    (!routeFilter.value || entry.route === routeFilter.value) &&
    (category.value !== '料理' || !benefit.value || (entry.dish && (
      benefit.value === 'health' ? entry.dish.health >= 20 :
        benefit.value === 'sanity' ? entry.dish.sanity >= 15 : entry.dish.hunger >= 75
    ))) &&
    (category.value !== '料理' || !ingredient.value || entry.dish?.examples.some(example => example.ingredients.some(item => item.name === ingredient.value)))
  )
})
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / 24)))
const page = computed(() => Math.min(totalPages.value, Math.max(1, Math.floor(Number(pageValue.value) || 1))))
const visible = computed(() => filtered.value.slice((page.value - 1) * 24, page.value * 24))
const pageLink = (value: number) => ({ path: '/wiki', query: { ...route.query, page: value === 1 ? undefined : String(value) }, hash: '#wiki-results' })
</script>

<template>
  <div class="page-shell">
    <div class="container">
      <header class="index-hero wiki-index-head">
        <p class="eyebrow">Field Index</p><h1>百科资料</h1>
        <p>{{ wikiDescription }}</p>
      </header>
      <div class="catalog-controls paper-card">
        <label class="catalog-search">查找百科<input v-model="query" type="search" placeholder="名称、俗称或问题，例如怎么复活"></label>
        <label>进阶路线<select v-model="routeFilter"><option value="">全部路线</option><option v-for="item in routeOptions" :key="item">{{ item }}</option></select></label>
      </div>
      <FilterBar :options="categories" :active="category" @change="category = $event" />
      <div v-if="category === '料理'" class="catalog-controls dish-filters">
        <label>料理用途<select v-model="benefit"><option value="">全部用途</option><option value="health">回血 ≥ 20</option><option value="sanity">回理智 ≥ 15</option><option value="hunger">饱食 ≥ 75</option></select></label>
        <label>示例食材<select v-model="ingredient"><option value="">全部食材</option><option v-for="item in ingredientOptions" :key="item">{{ item }}</option></select></label>
        <p>按已收录的配方示例筛选；可替换材料与禁忌请查看详情。</p>
      </div>
      <div id="wiki-results" class="catalog-summary" aria-live="polite">
        <strong>{{ category || '全部百科' }} · {{ filtered.length }} 条</strong><span>全站 {{ wikiEntries.length }} 条 · 第 {{ page }} / {{ totalPages }} 页</span>
      </div>
      <div class="wiki-catalog">
        <NuxtLink v-for="entry in visible" :key="entry.slug" :to="`/wiki/${entry.slug}`" class="wiki-catalog-item paper-card">
          <img :src="assetPath(entry.image.path)" :alt="entry.image.alt" width="72" height="72" loading="lazy">
          <div><small>{{ entry.category }} · {{ entry.stage }}</small><h2>{{ entry.title }}</h2><p>{{ entry.summary }}</p>
            <span v-if="entry.dish" class="dish-quick-stats">生命 {{ entry.dish.health }} · 饱食 {{ entry.dish.hunger }} · 理智 {{ entry.dish.sanity }}</span>
          </div>
        </NuxtLink>
      </div>
      <div v-if="!filtered.length" class="empty-state"><h2>没有匹配的档案</h2><p>试试减少筛选条件，或换一个短词。</p><NuxtLink class="filter-button" to="/wiki">清除全部筛选</NuxtLink></div>
      <nav v-if="totalPages > 1" class="list-pagination" aria-label="百科分页">
        <NuxtLink v-if="page > 1" class="filter-button" :to="pageLink(page - 1)">上一页</NuxtLink>
        <span>{{ page }} / {{ totalPages }}</span>
        <NuxtLink v-if="page < totalPages" class="filter-button" :to="pageLink(page + 1)">下一页</NuxtLink>
      </nav>
    </div>
  </div>
</template>
