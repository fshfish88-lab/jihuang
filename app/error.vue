<script setup lang="ts">
import type { NuxtError } from '#app'
const props = defineProps<{ error: NuxtError }>()
const config = useRuntimeConfig()
const base = config.app.baseURL
useSeoMeta({ title: props.error.statusCode === 404 ? '没有找到这页手记' : '这页手记暂时打不开', robots: 'noindex' })
</script>
<template>
  <main class="error-page">
    <article class="paper-card">
      <p class="eyebrow">Field Notes / {{ error.statusCode }}</p>
      <h1>{{ error.statusCode === 404 ? '这页手记，似乎迷路了。' : '翻阅暂时遇到了问题。' }}</h1>
      <p>{{ error.statusCode === 404 ? '地址可能已变更，也可能少写了几个字。试试搜索，或从第一团火重新出发。' : '请稍后重试，或先回首页查阅其他内容。' }}</p>
      <div class="error-actions"><a class="filter-button" :href="base">回到首页</a><a class="filter-button" :href="`${base}search`">搜索攻略</a><a class="filter-button" :href="`${base}wiki`">百科资料</a></div>
    </article>
  </main>
</template>
<style scoped>
.error-page { min-height: 100vh; display: grid; place-items: center; padding: 1.2rem; background: var(--paper-2); }
.error-page article { max-width: 48rem; padding: clamp(1.2rem, 5vw, 4rem); }
.error-page h1 { font-size: clamp(2.2rem, 5vw, 3.8rem); }
.error-actions { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 2rem; }
</style>
