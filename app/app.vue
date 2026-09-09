<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const absoluteAsset = useAbsoluteAsset()
const canonical = computed(() => absoluteAsset(route.path === '/' ? '/' : `${route.path.replace(/\/$/, '')}/`))
useHead(() => ({ link: [{ rel: 'canonical', href: canonical.value }] }))
useSeoMeta({
  ogSiteName: '火堆边百科', ogLocale: 'zh_CN', ogType: 'website',
  ogImage: absoluteAsset('/images/official/hero.jpg'),
  ogUrl: () => canonical.value,
  robots: () => route.path === '/search' || Object.keys(route.query).length ? 'noindex, follow' : 'index, follow'
})
</script>
<template>
  <NuxtLoadingIndicator color="#7b271d" :height="3" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

