<script setup lang="ts">
import type { DishInfo } from '~/types/wiki'

defineProps<{ dish: DishInfo }>()
</script>

<template>
  <section class="wiki-section dish-panel paper-card" aria-labelledby="dish-title">
    <header class="wiki-section__header">
      <div>
        <p class="eyebrow">Crock Pot Recipe</p>
        <h2 id="dish-title">烹饪锅食谱</h2>
      </div>
      <span class="wiki-section__badge">四格配方</span>
    </header>

    <div class="dish-stats" aria-label="料理属性">
      <div><span>生命</span><strong :class="{ negative: dish.health < 0 }">{{ dish.health > 0 ? '+' : '' }}{{ dish.health }}</strong></div>
      <div><span>饥饿</span><strong :class="{ negative: dish.hunger < 0 }">{{ dish.hunger > 0 ? '+' : '' }}{{ dish.hunger }}</strong></div>
      <div><span>理智</span><strong :class="{ negative: dish.sanity < 0 }">{{ dish.sanity > 0 ? '+' : '' }}{{ dish.sanity }}</strong></div>
      <div><span>保质期</span><strong>{{ dish.perishDays === null ? '永久' : `${dish.perishDays} 天` }}</strong></div>
      <div><span>烹饪时间</span><strong>{{ dish.cookTimeSeconds }} 秒</strong></div>
      <div><span>优先级</span><strong>{{ dish.priority }}</strong></div>
    </div>

    <article v-for="example in dish.examples" :key="example.label" class="dish-example">
      <h3>{{ example.label }}</h3>
      <div class="dish-slots">
        <WikiIngredientChip
          v-for="ingredient in example.ingredients"
          :key="`${example.label}-${ingredient.slug}`"
          :ingredient="ingredient"
          compact
        />
      </div>
      <p v-if="example.note" class="dish-example__note">{{ example.note }}</p>
    </article>

    <div class="dish-rules">
      <div>
        <h3>必须满足</h3>
        <ul>
          <li v-for="rule in dish.rules" :key="rule">{{ rule }}</li>
        </ul>
      </div>
      <div v-if="dish.forbidden.length">
        <h3>不能放</h3>
        <ul>
          <li v-for="item in dish.forbidden" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div v-if="dish.conflicts.length" class="dish-rules__warning">
        <h3>防串锅提醒</h3>
        <ul>
          <li v-for="conflict in dish.conflicts" :key="conflict">{{ conflict }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
