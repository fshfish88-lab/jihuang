<script setup lang="ts">
useSeoMeta({
  title: '关于本站与资料来源',
  description: '火堆边百科的定位、内容原则、版权声明与外部资料来源。'
})
</script>

<template>
  <div class="page-shell">
    <div class="container about-layout">
      <article class="prose">
        <p class="eyebrow">About This Archive</p>
        <h1>关于火堆边百科</h1>
        <blockquote><p>从第一团火开始，活过每一个季节。</p></blockquote>

        <h2>本站做什么</h2>
        <p>火堆边百科是一份面向《饥荒联机版》新手的非官方、非商业攻略手册。我们按玩家成长顺序组织内容，优先解释当前目标、准备内容、操作顺序、完成标志和下一步。</p>

        <h2>内容原则</h2>
        <ul>
          <li>不复制其他 Wiki 或攻略的整篇正文；</li>
          <li>不把某一种玩法写成唯一正确答案；</li>
          <li>不确定或可能随版本变化的精确数值，不凭印象编造；</li>
          <li>每篇攻略标注内容版本与更新时间；</li>
          <li>角色、Boss、世界路线与百科互相链接。</li>
        </ul>

        <h2>资料与外部链接</h2>
        <ul>
          <li><a href="https://www.klei.com/games/dont-starve-together" target="_blank" rel="noopener">Klei 官方《饥荒联机版》页面</a></li>
          <li><a href="https://store.steampowered.com/app/322330/" target="_blank" rel="noopener">Steam 商店页面</a></li>
          <li><a href="https://dontstarve.wiki.gg/zh/" target="_blank" rel="noopener">饥荒中文 Wiki</a></li>
          <li><a href="https://support.klei.com/hc/en-us/articles/360029880791-Player-Creation-Guidelines" target="_blank" rel="noopener">Klei 玩家创作指南</a></li>
        </ul>

        <h2>版权声明</h2>
        <p>本站与 Klei Entertainment 无官方关联。游戏名称、角色、图片及相关素材版权归其权利人所有。官方游戏画面仅用于非商业攻略说明与玩家交流。</p>
      </article>
      <aside class="paper-card source-card">
        <span class="stamp">Version</span>
        <h2>2026.07</h2>
        <p>首版包含 39 份攻略与百科手记。</p>
        <NuxtLink class="text-link" to="/search">搜索全部内容</NuxtLink>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.about-layout { display: grid; grid-template-columns: 1fr 18rem; gap: 4rem; align-items: start; }
.source-card { position: sticky; top: 7rem; padding: 1.25rem; }
.source-card h2 { margin: 1.5rem 0 .5rem; }
.source-card p { color: var(--ash); }
@media (max-width: 800px) {
  .about-layout { grid-template-columns: 1fr; }
  .source-card { position: static; }
}
</style>

