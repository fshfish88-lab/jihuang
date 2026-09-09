<script setup lang="ts">
import { getEntryBySlug, entryPath } from '~/data/content'
import type { GuideEntry } from '~/types/content'
import { getWikiEntry } from '~/data/wiki'

const props = defineProps<{
  entry: Record<string, any>
  meta: GuideEntry
}>()
const assetPath = useAssetPath()
const absoluteAsset = useAbsoluteAsset()
const toc = computed(() => (props.entry.body?.toc?.links || []) as { id: string; text: string }[])
const dossier = computed(() => props.meta.kind === 'boss' ? getWikiEntry(props.meta.slug) : undefined)
const sourceEntries = computed(() => {
  const slugs = [props.meta.slug, ...(props.entry.related || [])]
  return slugs.flatMap((slug: string) => getWikiEntry(slug)?.sources || [])
    .filter((source: { url: string }, index: number, all: { url: string }[]) => all.findIndex(item => item.url === source.url) === index)
    .slice(0, 8)
})
const characterSource = computed(() => props.meta.kind === 'character' && props.meta.english
  ? `https://dontstarve.wiki.gg/wiki/${encodeURIComponent(props.meta.english.replaceAll(' ', '_'))}/DST` : '')

const relatedEntries = computed(() =>
  (props.entry.related || [])
    .map((slug: string) => getEntryBySlug(slug))
    .filter(Boolean) as GuideEntry[]
)

useSeoMeta({
  title: props.meta.title,
  description: props.meta.description,
  ogTitle: `${props.meta.title}｜火堆边百科`,
  ogDescription: props.meta.description,
  ogImage: absoluteAsset(props.meta.image)
})
</script>

<template>
  <article class="page-shell">
    <div class="container">
      <header id="article-top" class="detail-hero">
        <div class="detail-hero__copy">
          <p class="eyebrow">{{ meta.stage }} / {{ meta.version }}</p>
          <h1>{{ meta.title }}</h1>
          <p class="detail-hero__lead">{{ meta.description }}</p>
          <ul class="tag-list">
            <li v-for="tag in meta.tags" :key="tag" class="tag">{{ tag }}</li>
          </ul>
        </div>
        <figure class="detail-hero__image paper-card">
          <img :src="assetPath(meta.image)" :alt="meta.imageAlt" width="900" height="506">
          <figcaption>版本 {{ meta.version }} · 更新于 {{ meta.updatedAt }}</figcaption>
        </figure>
      </header>

      <details v-if="toc.length" class="article-toc paper-card">
        <summary>本页目录 · {{ toc.length }} 个章节</summary>
        <nav aria-label="文章章节"><a v-for="item in toc" :key="item.id" :href="`#${item.id}`">{{ item.text }}</a></nav>
      </details>
      <NuxtLink v-if="dossier" class="wiki-route-link paper-card" :to="`/wiki/${dossier.slug}#combat`"><span><small>战斗档案</small>查看 {{ dossier.title }} 的战前准备、具体步骤与掉落用途</span><strong aria-hidden="true">→</strong></NuxtLink>
      <div class="prose-shell">
        <div class="prose">
          <ContentRenderer :value="entry" />
        </div>
        <aside class="side-note paper-card">
          <span class="stamp">下一页索引</span>
          <h3>相关手记</h3>
          <ul class="related-list">
            <li v-for="item in relatedEntries" :key="item.slug">
              <NuxtLink :to="entryPath(item)">
                {{ item.title }}
                <small>{{ item.stage }}</small>
              </NuxtLink>
            </li>
          </ul>
          <NuxtLink class="text-link" to="/search">搜索更多条目</NuxtLink>
        </aside>
      </div>
      <footer class="wiki-sources">
        <h2>资料与继续核对</h2>
        <p>本篇内容版本 {{ meta.version }}，更新于 {{ meta.updatedAt }}。以下为角色或关联档案的参考入口；具体数值与机制请结合对应条目的核对日期查阅。</p>
        <ul>
          <li v-if="characterSource"><a :href="characterSource" target="_blank" rel="noopener noreferrer">Don't Starve Wiki：{{ meta.english }}</a></li>
          <li v-for="source in sourceEntries" :key="source.url"><a :href="source.url" target="_blank" rel="noopener noreferrer">{{ source.label }}</a></li>
        </ul>
        <NuxtLink class="text-link" to="/about#feedback">发现问题？查看纠错方式</NuxtLink>
      </footer>
      <a class="back-to-top text-link" href="#article-top">返回本页顶部 ↑</a>
    </div>
  </article>
</template>

<style scoped>
.detail-hero {
  display: grid;
  grid-template-columns: 1fr minmax(22rem, .7fr);
  gap: 3rem;
  align-items: center;
  padding: 2.5rem 0 4rem;
}
.detail-hero h1 { margin: .25rem 0 1rem; }
.detail-hero__lead { max-width: 42rem; color: var(--ash); font-size: 1.18rem; }
.detail-hero__image { margin: 0; overflow: hidden; transform: rotate(1deg); }
.detail-hero__image img { width: 100%; aspect-ratio: 16/9; object-fit: cover; filter: sepia(.12) saturate(.85) contrast(1.08); }
.detail-hero__image figcaption { padding: .55rem .8rem; font: .68rem/1.4 var(--font-sans); color: var(--ash); }
.related-list small { display: block; color: var(--ash); font-size: .7rem; }
@media (max-width: 840px) {
  .detail-hero { grid-template-columns: 1fr; gap: 1.5rem; padding-top: 1rem; }
}
</style>
