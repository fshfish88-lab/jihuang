<script setup lang="ts">
import { wikiDescription } from '~/data/site-metadata'
</script>

<template>
  <GuideIndex
    kind="wiki"
    eyebrow="Field Index"
    title="百科资料"
    :description="wikiDescription"
    :filters="['资源', '工具', '装备', '建筑', '料理', '生物', '季节与探索']"
  />
</template>

