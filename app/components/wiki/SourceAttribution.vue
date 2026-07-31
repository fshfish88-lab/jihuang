<script setup lang="ts">
import type { ImageCredit, SourceLink } from '~/types/wiki'

defineProps<{
  sources: SourceLink[]
  image: ImageCredit
  verifiedAt: string
}>()
</script>

<template>
  <footer class="wiki-sources">
    <h2>资料来源与图片署名</h2>
    <p>
      内容按《饥荒联机版》整理，核对日期 {{ verifiedAt }}。图片版权归
      {{ image.owner }} 所有；本站为免费、非官方玩家攻略站。
    </p>
    <ul>
      <li v-for="source in sources" :key="source.url">
        <a :href="source.url" target="_blank" rel="noopener noreferrer">{{ source.label }}</a>
        <small>{{ source.kind === 'official' ? '官方' : source.kind === 'wiki' ? 'Wiki 核对' : '交叉核对' }}</small>
      </li>
      <li>
        <a :href="image.sourcePage" target="_blank" rel="noopener noreferrer">本页对应图片来源</a>
        <small>图像署名</small>
      </li>
    </ul>
  </footer>
</template>
