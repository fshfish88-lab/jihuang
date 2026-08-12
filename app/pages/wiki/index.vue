<script setup lang="ts">
import { getEntries } from '~/data/content'

const wikiEntries = getEntries('wiki')
const dishCount = wikiEntries.filter(entry => entry.tags.includes('四格食谱')).length
const wikiDescription = `${wikiEntries.length} 份《饥荒联机版》核心档案，其中包含 ${dishCount} 道四格食谱；制作材料、获取步骤与关键数据一次查清。`
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

