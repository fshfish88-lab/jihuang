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
    v-if="ingredient.slug"
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
  <div
    v-else
    class="ingredient-chip ingredient-chip--text-only"
    :aria-label="`${ingredient.name}，数量 ${ingredient.amount}；暂未建立独立百科`"
  >
    <span class="ingredient-chip__name">{{ ingredient.name }}</span>
    <strong class="ingredient-chip__amount">× {{ ingredient.amount }}</strong>
    <small class="ingredient-chip__note">未单独建档</small>
  </div>
</template>
