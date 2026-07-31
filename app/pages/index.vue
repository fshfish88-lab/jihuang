<script setup lang="ts">
import { entryPath, getEntries } from '~/data/content'
const assetPath = useAssetPath()

useSeoMeta({
  title: '从第一团火开始',
  description: '火堆边百科：面向《饥荒联机版》新手的生存路线、角色、Boss、世界主线与百科手册。'
})

const quickPaths = [
  { no: '01', label: '我是第一次玩', note: '从第 1 天开始', to: '/beginner/first-day' },
  { no: '02', label: '我想学习角色', note: '比较 5 名代表角色', to: '/characters' },
  { no: '03', label: '我准备挑战 Boss', note: '先检查装备与场地', to: '/bosses' },
  { no: '04', label: '我不知道下一步', note: '打开世界进度清单', to: '/tools/progression-checklist' }
]

const timeline = [
  { day: 'DAY 01', title: '点亮第一团火', note: '工具、火源、沿路探图', to: '/beginner/first-day' },
  { day: 'DAY 02—05', title: '认识这个世界', note: '矿区、牛群、猪王、沼泽', to: '/beginner/first-week' },
  { day: 'DAY 06—10', title: '落下第一版基地', note: '科技、烹饪、储物与交通', to: '/beginner/base-location' },
  { day: 'DAY 11—20', title: '准备第一个冬季', note: '保暖、燃料、食物与巨鹿', to: '/beginner/first-winter' },
  { day: 'DAY 21+', title: '选择你的世界路线', note: '洞穴、遗迹、航海与 Boss', to: '/progression' }
]

const characters = getEntries('character')
const bosses = getEntries('boss')
const routes = getEntries('progression')
const wiki = getEntries('wiki').slice(0, 6)
</script>

<template>
  <div class="home">
    <section class="hero">
      <img class="hero__image" :src="assetPath('/images/official/hero.jpg')" alt="《饥荒联机版》官方荒野场景" width="1600" height="900">
      <div class="hero__shade" />
      <div class="container hero__content">
        <div class="hero__copy">
          <span class="hero__label">WILDERNESS FIELD NOTES / 2026.07</span>
          <h1>别让黑夜，<br>吃掉你的<span>第一天。</span></h1>
          <p>告诉你现在处于什么阶段、接下来做什么、需要准备什么，以及完成之后会解锁什么。</p>
        </div>
        <aside class="hero__note">
          <strong>天黑前的四件事</strong>
          <ol>
            <li>捡草、树枝与燧石</li>
            <li>制作斧头与火把</li>
            <li>沿道路或海岸探索</li>
            <li>不要急着永久建家</li>
          </ol>
          <NuxtLink to="/beginner/first-day">展开第一天手记 →</NuxtLink>
        </aside>
      </div>
      <div class="container hero__search">
        <NuxtLink to="/search" class="search-ledger">
          <span>搜索“巨鹿”“怎么复活”“机器人”或玩家俗称……</span>
          <b>翻找手记</b>
        </NuxtLink>
      </div>
    </section>

    <section class="quick-section">
      <div class="container quick-grid">
        <NuxtLink v-for="item in quickPaths" :key="item.no" :to="item.to" class="quick-card">
          <small>{{ item.no }}</small>
          <strong>{{ item.label }}</strong>
          <span>{{ item.note }}</span>
        </NuxtLink>
      </div>
    </section>

    <section class="paper-section timeline-section">
      <div class="container">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Beginner Timeline</p>
            <h2>先活下来，再变强。</h2>
          </div>
          <p>别把所有攻略一次读完。找到你现在所在的阶段，只处理眼前最重要的两三件事。</p>
        </div>
        <div class="timeline">
          <NuxtLink v-for="(item, index) in timeline" :key="item.day" :to="item.to" class="timeline__item">
            <span class="timeline__node">{{ index + 1 }}</span>
            <small>{{ item.day }}</small>
            <strong>{{ item.title }}</strong>
            <p>{{ item.note }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="paper-section roster-section">
      <div class="container">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Survivor Files</p>
            <h2>先找适合你的角色。</h2>
          </div>
          <NuxtLink class="text-link" to="/characters">查看角色档案</NuxtLink>
        </div>
        <div class="content-grid">
          <ContentCard v-for="entry in characters" :key="entry.slug" :entry="entry" />
        </div>
      </div>
    </section>

    <section class="threat-section">
      <div class="container">
        <div class="section-heading section-heading--dark">
          <div>
            <p class="eyebrow">Threat Archive</p>
            <h2>Boss 不是突然开始的。</h2>
          </div>
          <p>出现条件、场地、装备和失败预案都属于战斗。先准备，再输出。</p>
        </div>
        <div class="threat-list">
          <NuxtLink v-for="(entry, index) in bosses" :key="entry.slug" :to="entryPath(entry)" class="threat-row">
            <span>0{{ index + 1 }}</span>
            <img :src="assetPath(entry.image)" :alt="entry.imageAlt" width="240" height="135" loading="lazy">
            <div><strong>{{ entry.title }}</strong><small>{{ entry.stage }}</small></div>
            <p>{{ entry.description }}</p>
            <i>难度 {{ entry.difficulty }}/5</i>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="paper-section route-section">
      <div class="container">
        <div class="section-heading">
          <div>
            <p class="eyebrow">World Routes</p>
            <h2>下一步，写在地图上。</h2>
          </div>
          <NuxtLink class="text-link" to="/tools/progression-checklist">打开可勾选任务清单</NuxtLink>
        </div>
        <div class="route-grid">
          <NuxtLink v-for="(entry, index) in routes" :key="entry.slug" :to="entryPath(entry)" class="route-card paper-card">
            <span class="stamp">Route 0{{ index + 1 }}</span>
            <h3>{{ entry.title }}</h3>
            <p>{{ entry.description }}</p>
            <small>{{ entry.stage }}</small>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="paper-section wiki-section">
      <div class="container">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Quick Index</p>
            <h2>常用资料，随手一翻。</h2>
          </div>
          <NuxtLink class="text-link" to="/wiki">进入百科索引</NuxtLink>
        </div>
        <div class="wiki-grid">
          <NuxtLink v-for="entry in wiki" :key="entry.slug" :to="entryPath(entry)">
            <span>{{ entry.tags[0] }}</span>
            <strong>{{ entry.title }}</strong>
            <p>{{ entry.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home { overflow: hidden; }
.hero {
  position: relative;
  min-height: 46rem;
  display: grid;
  align-content: center;
  color: var(--paper-0);
  background: var(--ink);
}
.hero__image,
.hero__shade { position: absolute; inset: 0; width: 100%; height: 100%; }
.hero__image { object-fit: cover; object-position: center 42%; filter: saturate(.72) contrast(1.08); }
.hero__shade {
  background:
    linear-gradient(90deg, rgba(17,17,14,.94) 0%, rgba(17,17,14,.7) 45%, rgba(17,17,14,.24) 72%),
    linear-gradient(0deg, rgba(17,17,14,.95), transparent 48%);
}
.hero__content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.35fr .65fr;
  gap: 4rem;
  align-items: center;
  padding-block: 7rem 9rem;
}
.hero__label {
  display: inline-block;
  padding: .45rem .7rem;
  color: var(--ink);
  background: var(--paper-1);
  font: 900 .68rem/1 var(--font-sans);
  letter-spacing: .16em;
  transform: rotate(-1deg);
}
.hero h1 { max-width: 51rem; margin: 1.25rem 0; text-shadow: 0 4px 18px rgba(0,0,0,.35); }
.hero h1 span { color: #c45640; border-bottom: .08em solid currentColor; }
.hero__copy p { max-width: 42rem; color: var(--paper-1); font-size: 1.1rem; }
.hero__note {
  padding: 1.4rem;
  color: var(--ink);
  background: rgba(203,191,155,.94);
  border: 1px solid var(--ink);
  box-shadow: 7px 8px 0 rgba(0,0,0,.5);
  transform: rotate(1.5deg);
}
.hero__note strong { font-family: var(--font-display); font-size: 1.35rem; }
.hero__note ol { padding-left: 1.3rem; }
.hero__note a { font: 800 .78rem/1 var(--font-sans); }
.hero__search { position: absolute; z-index: 2; right: 0; bottom: 2.4rem; left: 0; }
.search-ledger {
  display: grid;
  grid-template-columns: 1fr auto;
  border: 2px solid var(--paper-1);
  color: var(--paper-1);
  background: rgba(23,23,20,.88);
  box-shadow: 5px 5px 0 var(--paper-2);
  text-decoration: none;
}
.search-ledger span { padding: 1rem 1.2rem; color: var(--paper-2); }
.search-ledger b { display: grid; place-items: center; padding: 0 1.25rem; color: var(--ink); background: var(--paper-1); font: 800 .8rem/1 var(--font-sans); }
.quick-section { color: var(--paper-0); background: var(--ink); }
.quick-grid { display: grid; grid-template-columns: repeat(4, 1fr); border-inline: 1px solid rgba(227,216,182,.2); }
.quick-card { min-height: 9rem; padding: 1.2rem; border-right: 1px solid rgba(227,216,182,.2); color: inherit; text-decoration: none; transition: background 180ms var(--ease-paper); }
.quick-card:hover { color: var(--paper-0); background: var(--blood); }
.quick-card small, .quick-card strong, .quick-card span { display: block; }
.quick-card small { color: var(--blood-light); font: 900 .7rem/1 var(--font-mono); }
.quick-card:hover small { color: var(--paper-1); }
.quick-card strong { margin: 1rem 0 .5rem; font-family: var(--font-display); font-size: 1.2rem; }
.quick-card span { color: var(--paper-3); font-size: .78rem; }
.paper-section { padding-block: 6rem; background: var(--paper-1); }
.timeline-section { background: var(--paper-2); }
.timeline { display: grid; grid-template-columns: repeat(5, 1fr); margin-top: 3rem; }
.timeline__item { position: relative; padding: 2rem 1rem 1rem; border-top: 2px solid var(--ink); color: inherit; text-decoration: none; }
.timeline__node { position: absolute; top: 0; left: 1rem; display: grid; width: 2rem; height: 2rem; place-items: center; border: 2px solid var(--ink); border-radius: 50%; color: var(--paper-0); background: var(--blood); transform: translateY(-52%); font: 900 .7rem/1 var(--font-mono); }
.timeline__item small, .timeline__item strong { display: block; }
.timeline__item small { color: var(--blood); font: 900 .66rem/1 var(--font-sans); letter-spacing: .1em; }
.timeline__item strong { margin: .8rem 0 .35rem; font-family: var(--font-display); }
.timeline__item p { margin: 0; color: var(--ash); font-size: .78rem; line-height: 1.55; }
.threat-section { padding-block: 6rem; color: var(--paper-1); background: var(--ink); }
.section-heading--dark p { color: var(--paper-3); }
.threat-list { border-top: 1px solid rgba(227,216,182,.25); }
.threat-row { display: grid; grid-template-columns: 2rem 7rem 11rem 1fr auto; gap: 1rem; align-items: center; padding: .85rem 0; border-bottom: 1px solid rgba(227,216,182,.2); color: inherit; text-decoration: none; }
.threat-row:hover { color: var(--paper-0); background: rgba(123,39,29,.16); }
.threat-row > span { color: var(--blood-light); font: 900 .7rem/1 var(--font-mono); }
.threat-row img { width: 7rem; aspect-ratio: 16/9; object-fit: cover; filter: saturate(.65); }
.threat-row strong, .threat-row small { display: block; }
.threat-row strong { font-family: var(--font-display); font-size: 1.1rem; }
.threat-row small { color: var(--paper-3); font-size: .7rem; }
.threat-row p { margin: 0; color: var(--paper-3); font-size: .8rem; line-height: 1.5; }
.threat-row i { font: normal 700 .7rem/1 var(--font-sans); }
.route-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
.route-card { min-height: 17rem; padding: 1.5rem; color: inherit; text-decoration: none; }
.route-card:nth-child(2) { transform: translateY(1.4rem) rotate(.4deg); }
.route-card h3 { margin: 2rem 0 .7rem; font-size: 1.65rem; }
.route-card p { color: var(--ash); }
.route-card small { color: var(--blood); font: 800 .7rem/1 var(--font-sans); }
.wiki-section { padding-top: 4rem; background: var(--paper-0); }
.wiki-grid { display: grid; grid-template-columns: repeat(2, 1fr); border: 2px solid var(--ink); }
.wiki-grid a { display: grid; grid-template-columns: 5rem 8rem 1fr; gap: 1rem; align-items: start; padding: 1rem; border-right: 1px solid var(--ink); border-bottom: 1px solid var(--ink); color: inherit; text-decoration: none; }
.wiki-grid a:nth-child(2n) { border-right: 0; }
.wiki-grid a:nth-last-child(-n+2) { border-bottom: 0; }
.wiki-grid a:hover { background: var(--paper-2); }
.wiki-grid span { color: var(--blood); font: 800 .68rem/1.5 var(--font-sans); }
.wiki-grid strong { font-family: var(--font-display); }
.wiki-grid p { margin: 0; color: var(--ash); font-size: .78rem; line-height: 1.5; }
@media (max-width: 900px) {
  .hero__content { grid-template-columns: 1fr; }
  .hero__note { display: none; }
  .quick-grid { grid-template-columns: 1fr 1fr; }
  .timeline { grid-template-columns: 1fr; }
  .timeline__item { border-top: 0; border-left: 2px solid var(--ink); padding: .4rem 1rem 1.4rem 2.2rem; }
  .timeline__node { top: .1rem; left: 0; transform: translateX(-52%); }
  .threat-row { grid-template-columns: 2rem 6rem 1fr auto; }
  .threat-row p { display: none; }
  .route-grid { grid-template-columns: 1fr; }
  .route-card:nth-child(2) { transform: none; }
}
@media (max-width: 620px) {
  .hero { min-height: 42rem; }
  .hero__content { padding-top: 5.5rem; }
  .hero__shade { background: linear-gradient(90deg, rgba(17,17,14,.9), rgba(17,17,14,.45)), linear-gradient(0deg, rgba(17,17,14,.98), transparent 65%); }
  .hero__search { bottom: 1rem; }
  .search-ledger b { padding-inline: .8rem; }
  .search-ledger span { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .quick-grid { width: 100%; }
  .quick-card { min-height: 8rem; }
  .paper-section, .threat-section { padding-block: 4rem; }
  .threat-row { grid-template-columns: 1.5rem 4.8rem 1fr; }
  .threat-row i { display: none; }
  .wiki-grid { grid-template-columns: 1fr; }
  .wiki-grid a { grid-template-columns: 4rem 6.5rem 1fr; border-right: 0; }
  .wiki-grid a:nth-last-child(-n+2) { border-bottom: 1px solid var(--ink); }
  .wiki-grid a:last-child { border-bottom: 0; }
}
</style>
