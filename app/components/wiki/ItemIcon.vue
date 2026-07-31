<script setup lang="ts">
import type { ImageCredit } from '~/types/wiki'

const props = withDefaults(defineProps<{
  image: ImageCredit
  size?: 'small' | 'large'
}>(), {
  size: 'large'
})

const assetPath = useAssetPath()
</script>

<template>
  <figure class="wiki-icon" :class="`wiki-icon--${props.size}`">
    <span class="wiki-icon__frame">
      <img
        :src="assetPath(image.path)"
        :alt="image.alt"
        :width="props.size === 'large' ? 240 : 72"
        :height="props.size === 'large' ? 240 : 72"
      >
    </span>
  </figure>
</template>
