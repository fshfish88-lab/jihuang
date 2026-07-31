<script setup lang="ts">
import { progressNodes, routeLabels, routeOrder } from '~/data/progression'
import { entryPath, getEntryBySlug } from '~/data/content'

useSeoMeta({
  title: '世界主线任务清单',
  description: '勾选《饥荒联机版》世界进程节点，自动保存到当前浏览器并显示下一步建议。'
})

const store = useProgressStore()
const showReset = ref(false)

onMounted(() => store.hydrate())

const routes = routeOrder.map(id => ({
  id,
  label: routeLabels[id],
  nodes: progressNodes.filter(node => node.route === id)
}))

function linkFor(slug: string) {
  const entry = getEntryBySlug(slug)
  return entry ? entryPath(entry) : '/'
}
</script>

<template>
  <div class="page-shell">
    <div class="container">
      <header class="progress-hero">
        <div>
          <p class="eyebrow">Progress Ledger</p>
          <h1>世界主线任务清单</h1>
          <p>每完成一个节点就打勾。进度只保存在当前浏览器，不会上传任何个人数据。</p>
        </div>
        <div class="progress-seal" :style="{ '--progress': `${store.completion}%` }">
          <strong>{{ store.completion }}%</strong>
          <span>已完成</span>
        </div>
      </header>

      <div v-if="!store.storageAvailable" class="storage-warning">
        当前浏览器无法保存进度，本页仍可使用，但刷新后勾选可能丢失。
      </div>

      <section v-if="store.nextNode" class="next-step paper-card">
        <span class="stamp">Next Step</span>
        <div>
          <small>{{ store.nextNode.stage }}</small>
          <h2>下一步：{{ store.nextNode.title }}</h2>
          <p>{{ store.nextNode.summary }}</p>
        </div>
      </section>
      <section v-else class="next-step paper-card">
        <span class="stamp">Complete</span>
        <div>
          <h2>首版路线已全部完成</h2>
          <p>你已经具备继续探索裂隙与终局内容的基础。</p>
        </div>
      </section>

      <section v-for="route in routes" :key="route.id" class="route-checklist">
        <div class="route-checklist__head">
          <span>{{ String(routeOrder.indexOf(route.id) + 1).padStart(2, '0') }}</span>
          <h2>{{ route.label }}</h2>
          <NuxtLink :to="`/progression/${route.id}`">阅读路线总览 →</NuxtLink>
        </div>

        <ol>
          <li
            v-for="node in route.nodes"
            :key="node.id"
            :class="{ completed: store.completed.includes(node.id) }"
          >
            <button
              type="button"
              :aria-pressed="store.completed.includes(node.id)"
              @click="store.toggle(node.id)"
            >
              <span class="checkmark" aria-hidden="true">{{ store.completed.includes(node.id) ? '✓' : '' }}</span>
              <span class="node-copy">
                <small>{{ node.stage }}</small>
                <strong>{{ node.title }}</strong>
                <p>{{ node.summary }}</p>
                <em>完成标志：{{ node.completion }}</em>
              </span>
            </button>
            <div class="node-links">
              <NuxtLink v-for="slug in node.related.slice(0, 3)" :key="slug" :to="linkFor(slug)">
                {{ getEntryBySlug(slug)?.title || slug }}
              </NuxtLink>
            </div>
          </li>
        </ol>
      </section>

      <div class="reset-zone">
        <button v-if="!showReset" type="button" class="filter-button" @click="showReset = true">重置全部进度</button>
        <div v-else class="reset-confirm">
          <span>确定清空所有勾选？</span>
          <button type="button" @click="store.reset(); showReset = false">确定重置</button>
          <button type="button" @click="showReset = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-hero { display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: center; padding: 2.5rem 0 3rem; }
.progress-hero h1 { margin: .3rem 0 1rem; }
.progress-hero p { max-width: 48rem; color: var(--ash); }
.progress-seal {
  --progress: 0%;
  display: grid;
  width: 9rem;
  aspect-ratio: 1;
  place-content: center;
  border-radius: 50%;
  color: var(--blood);
  background: conic-gradient(var(--blood) var(--progress), rgba(123,39,29,.12) 0);
  box-shadow: inset 0 0 0 1.2rem var(--paper-1);
  text-align: center;
}
.progress-seal strong, .progress-seal span { display: block; }
.progress-seal strong { font: 900 2rem/1 var(--font-display); }
.progress-seal span { font: 700 .68rem/1.5 var(--font-sans); }
.storage-warning { padding: .8rem 1rem; margin-bottom: 1rem; color: var(--paper-0); background: var(--blood); }
.next-step { display: grid; grid-template-columns: auto 1fr; gap: 2rem; align-items: center; margin-bottom: 4rem; padding: 1.5rem; }
.next-step h2 { margin: .2rem 0; font-size: 1.75rem; }
.next-step small { color: var(--blood); font: 800 .68rem/1 var(--font-sans); }
.next-step p { margin: 0; color: var(--ash); }
.route-checklist { margin: 4rem 0; }
.route-checklist__head { display: grid; grid-template-columns: 3rem 1fr auto; gap: 1rem; align-items: end; padding-bottom: 1rem; border-bottom: 3px solid var(--ink); }
.route-checklist__head > span { color: var(--blood); font: 900 1.7rem/1 var(--font-mono); }
.route-checklist__head h2 { margin: 0; }
.route-checklist__head a { font: 700 .78rem/1.6 var(--font-sans); }
.route-checklist ol { padding: 0; margin: 0; list-style: none; }
.route-checklist li { display: grid; grid-template-columns: 1fr 18rem; gap: 1rem; padding: 1.2rem 0; border-bottom: 1px solid var(--line); transition: opacity 160ms ease; }
.route-checklist li.completed { opacity: .58; }
.route-checklist li > button { display: grid; grid-template-columns: 2.8rem 1fr; gap: 1rem; padding: 0; border: 0; text-align: left; background: transparent; cursor: pointer; }
.checkmark { display: grid; width: 2.6rem; height: 2.6rem; place-items: center; border: 2px solid var(--ink); color: var(--paper-0); background: transparent; font-weight: 900; }
.completed .checkmark { background: var(--moss); }
.node-copy small, .node-copy strong, .node-copy em { display: block; }
.node-copy small { color: var(--blood); font: 800 .67rem/1 var(--font-sans); }
.node-copy strong { margin: .4rem 0; font: 800 1.2rem/1.2 var(--font-display); }
.node-copy p { margin: 0; color: var(--ash); font-size: .86rem; line-height: 1.55; }
.node-copy em { margin-top: .5rem; font-size: .72rem; font-style: normal; }
.node-links { display: flex; flex-wrap: wrap; align-content: center; gap: .45rem; }
.node-links a { padding: .3rem .55rem; border: 1px solid var(--line); border-radius: var(--radius-pill); font: 700 .67rem/1.3 var(--font-sans); text-decoration: none; }
.reset-zone { display: flex; justify-content: center; padding-top: 2rem; border-top: 1px dashed var(--line); }
.reset-confirm { display: flex; align-items: center; gap: .6rem; }
.reset-confirm button { min-height: 2.75rem; padding: .4rem .8rem; border: 1px solid var(--ink); background: var(--paper-0); cursor: pointer; }
@media (max-width: 760px) {
  .progress-hero { grid-template-columns: 1fr; }
  .progress-seal { width: 7.5rem; }
  .next-step { grid-template-columns: 1fr; gap: 1rem; }
  .route-checklist__head { grid-template-columns: 2rem 1fr; }
  .route-checklist__head a { grid-column: 2; }
  .route-checklist li { grid-template-columns: 1fr; }
}
</style>

