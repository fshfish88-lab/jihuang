<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <p class="footer-kicker">THE CONSTANT / FIELD NOTES</p>
        <h2>火灭了，还能再点。</h2>
        <p>从第一团火开始，活过每一个季节。</p>
      </div>
      <div>
        <h3>可靠资料</h3>
        <ul>
          <li><a href="https://www.klei.com/games/dont-starve-together" target="_blank" rel="noopener">Klei 官方游戏页</a></li>
          <li><a href="https://store.steampowered.com/app/322330/" target="_blank" rel="noopener">Steam 商店页</a></li>
          <li><a href="https://dontstarve.wiki.gg/zh/" target="_blank" rel="noopener">饥荒中文 Wiki</a></li>
          <li><a href="https://support.klei.com/hc/en-us/articles/360029880791-Player-Creation-Guidelines" target="_blank" rel="noopener">Klei 玩家创作指南</a></li>
        </ul>
      </div>
    </div>
    <div class="container disclaimer">
      <p>本站为玩家制作的非官方、非商业《饥荒联机版》资料站，与 Klei Entertainment 无官方关联。游戏名称、角色、图片及相关素材版权归其权利人所有。</p>
      <p>内容版本：2026.07 · <NuxtLink to="/about">关于本站与资料来源</NuxtLink></p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 4rem 0 2rem;
  color: var(--paper-1);
  background: var(--ink);
  border-top: 4px solid var(--blood);
}
.footer-grid { display: grid; grid-template-columns: 1.2fr .8fr; gap: 4rem; }
.footer-kicker { color: var(--blood-light); font: 800 .7rem/1 var(--font-sans); letter-spacing: .18em; }
h2 { margin: .8rem 0; font-size: clamp(2.2rem, 4vw, 4rem); }
h3 { margin-top: 0; }
ul { padding: 0; margin: 0; list-style: none; }
li + li { margin-top: .45rem; }
a { color: var(--paper-2); }
.disclaimer {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(227,216,182,.2);
  color: var(--paper-3);
  font: .72rem/1.7 var(--font-sans);
}
.disclaimer p { max-width: 52rem; margin: 0; }
@media (max-width: 760px) {
  .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
  .disclaimer { flex-direction: column; gap: .5rem; }
}
</style>
