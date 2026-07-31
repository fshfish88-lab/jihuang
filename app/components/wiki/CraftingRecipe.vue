<script setup lang="ts">
import type { CraftingInfo } from '~/types/wiki'

defineProps<{ crafting: CraftingInfo }>()
</script>

<template>
  <section class="wiki-section paper-card" aria-labelledby="crafting-title">
    <header class="wiki-section__header">
      <div>
        <p class="eyebrow">Crafting</p>
        <h2 id="crafting-title">制作方法</h2>
      </div>
      <span class="wiki-section__badge">{{ crafting.craftable ? '可制作' : '不可直接制作' }}</span>
    </header>

    <template v-if="crafting.craftable">
      <div class="recipe-route">
        <div class="recipe-route__ingredients">
          <WikiIngredientChip
            v-for="ingredient in crafting.ingredients"
            :key="ingredient.slug"
            :ingredient="ingredient"
          />
        </div>
        <span class="recipe-route__arrow" aria-hidden="true">→</span>
        <dl class="recipe-result">
          <div>
            <dt>科技站</dt>
            <dd>{{ crafting.station }}</dd>
          </div>
          <div>
            <dt>制作分类</dt>
            <dd>{{ crafting.filter }}</dd>
          </div>
          <div>
            <dt>产出</dt>
            <dd>{{ crafting.yield }} 个</dd>
          </div>
        </dl>
      </div>
      <ul v-if="crafting.requirements?.length" class="wiki-note-list">
        <li v-for="requirement in crafting.requirements" :key="requirement">{{ requirement }}</li>
      </ul>
    </template>

    <p v-else class="wiki-callout">
      {{ crafting.requirements?.[0] || '该条目不能从制作栏直接制造，请按下方获取方式取得。' }}
    </p>
  </section>
</template>
