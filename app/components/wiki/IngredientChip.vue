<script setup lang="ts">
import type { IngredientAmount } from '~/types/wiki'

defineProps<{
  ingredient: IngredientAmount
  compact?: boolean
}>()

const assetPath = useAssetPath()
</script>

<template>
  <NuxtLink
    class="ingredient-chip"
    :class="{ 'ingredient-chip--compact': compact }"
    :to="`/wiki/${ingredient.slug}`"
    :aria-label="`${ingredient.name}，数量 ${ingredient.amount}`"
  >
    <span class="ingredient-chip__icon">
      <img
        :src="assetPath(`/images/wiki/${ingredient.slug}.png`)"
        :alt="ingredient.name"
        width="64"
        height="64"
        loading="lazy"
      >
    </span>
    <span class="ingredient-chip__name">{{ ingredient.name }}</span>
    <strong class="ingredient-chip__amount">× {{ ingredient.amount }}</strong>
  </NuxtLink>
</template>
