<script setup lang="ts">
const route = useRoute()
const menuOpen = ref(false)

watch(() => route.fullPath, () => {
  menuOpen.value = false
})

const nav = [
  { label: '萌新入门', to: '/beginner' },
  { label: '角色攻略', to: '/characters' },
  { label: 'Boss 攻略', to: '/bosses' },
  { label: '世界主线', to: '/progression' },
  { label: '百科资料', to: '/wiki' }
]
</script>

<template>
  <a class="skip-link" href="#main-content">跳到正文</a>
  <header class="site-header">
    <div class="site-header__inner container">
      <NuxtLink class="site-brand" to="/" aria-label="火堆边百科首页">
        <span class="site-brand__mark" aria-hidden="true">火</span>
        <span>
          <strong>火堆边百科</strong>
          <small>荒野生存手记</small>
        </span>
      </NuxtLink>

      <nav class="desktop-nav" aria-label="主导航">
        <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="header-actions">
        <NuxtLink class="search-shortcut" to="/search">
          <span>搜索攻略</span><kbd>/</kbd>
        </NuxtLink>
        <button
          class="menu-button"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          @click="menuOpen = !menuOpen"
        >
          <span class="sr-only">切换导航</span>
          <i /><i />
        </button>
      </div>
    </div>

    <div v-if="menuOpen" id="mobile-menu" class="mobile-menu container">
      <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">
        {{ item.label }}
      </NuxtLink>
      <NuxtLink to="/tools/progression-checklist">主线任务清单</NuxtLink>
    </div>
  </header>
</template>

<style scoped>
.skip-link {
  position: fixed;
  top: .5rem;
  left: .5rem;
  z-index: 100;
  padding: .6rem 1rem;
  color: var(--paper-0);
  background: var(--blood);
  transform: translateY(-150%);
}
.skip-link:focus { transform: translateY(0); }
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  color: var(--paper-0);
  background: rgba(23, 23, 20, .96);
  border-bottom: 1px solid rgba(227,216,182,.22);
  backdrop-filter: blur(12px);
}
.site-header__inner {
  display: flex;
  min-height: 4.6rem;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
}
.site-brand {
  display: flex;
  align-items: center;
  gap: .7rem;
  color: inherit;
  text-decoration: none;
}
.site-brand:hover { color: var(--paper-0); }
.site-brand__mark {
  display: grid;
  width: 2.45rem;
  height: 2.45rem;
  place-items: center;
  border: 2px solid var(--paper-1);
  border-radius: 46% 54% 45% 55%;
  color: var(--paper-0);
  background: var(--blood);
  box-shadow: 2px 2px 0 var(--paper-2);
  font-family: var(--font-display);
  font-weight: 900;
  transform: rotate(-3deg);
}
.site-brand strong,
.site-brand small { display: block; }
.site-brand strong { font-family: var(--font-display); font-size: 1.1rem; line-height: 1; }
.site-brand small { margin-top: .25rem; color: var(--paper-2); font: 600 .6rem/1 var(--font-sans); letter-spacing: .13em; }
.desktop-nav { display: flex; align-items: center; gap: 1.4rem; }
.desktop-nav a {
  position: relative;
  min-height: 2.75rem;
  display: grid;
  place-items: center;
  color: var(--paper-1);
  font: 700 .8rem/1 var(--font-sans);
  text-decoration: none;
}
.desktop-nav a::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: .35rem;
  left: 0;
  height: 2px;
  background: var(--blood-light);
  transform: scaleX(0) rotate(-1deg);
  transition: transform 160ms var(--ease-paper);
}
.desktop-nav a:hover::after,
.desktop-nav a.router-link-active::after { transform: scaleX(1) rotate(-1deg); }
.header-actions { display: flex; align-items: center; gap: .7rem; }
.search-shortcut {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  gap: .8rem;
  padding: .35rem .65rem .35rem .9rem;
  border: 1px solid rgba(227,216,182,.4);
  color: var(--paper-1);
  font: 600 .75rem/1 var(--font-sans);
  text-decoration: none;
}
.search-shortcut kbd { padding: .3rem .42rem; color: var(--ink); background: var(--paper-2); font-family: var(--font-mono); }
.menu-button {
  display: none;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid rgba(227,216,182,.4);
  background: transparent;
  cursor: pointer;
}
.menu-button i { display: block; width: 1.25rem; height: 2px; margin: .3rem auto; background: var(--paper-1); }
.mobile-menu { display: grid; padding-block: .6rem 1rem; }
.mobile-menu a { padding: .85rem 0; border-bottom: 1px dashed rgba(227,216,182,.25); color: var(--paper-1); text-decoration: none; }
@media (max-width: 980px) {
  .desktop-nav { display: none; }
  .menu-button { display: block; }
}
@media (max-width: 520px) {
  .search-shortcut span { display: none; }
  .site-brand small { display: none; }
}
</style>

