<script setup lang="ts">
import type { CombatInfo } from '~/types/wiki'

defineProps<{ combat: CombatInfo }>()
</script>

<template>
  <section class="wiki-section combat-guide paper-card">
    <header class="wiki-section__header">
      <div>
        <p class="eyebrow">Combat File</p>
        <h2>战斗与处理方法</h2>
      </div>
      <span class="wiki-section__badge">撤退优先</span>
    </header>

    <div class="combat-guide__grid">
      <div>
        <h3>出现条件</h3>
        <ol><li v-for="item in combat.spawn" :key="item">{{ item }}</li></ol>
      </div>
      <div>
        <h3>准备清单</h3>
        <ul><li v-for="item in combat.preparation" :key="item">{{ item }}</li></ul>
      </div>
      <div>
        <h3>处理步骤</h3>
        <ol><li v-for="item in combat.steps" :key="item">{{ item }}</li></ol>
      </div>
      <div class="combat-guide__retreat">
        <h3>撤退信号</h3>
        <ul><li v-for="item in combat.retreat" :key="item">{{ item }}</li></ul>
      </div>
    </div>

    <h3 class="combat-guide__drop-title">主要掉落</h3>
    <ul class="combat-guide__drops">
      <li v-for="drop in combat.drops" :key="`${drop.name}-${drop.amount}`">
        <NuxtLink v-if="drop.slug" :to="`/wiki/${drop.slug}`">{{ drop.name }}</NuxtLink>
        <span v-else>{{ drop.name }}</span>
        <strong>{{ drop.amount }}</strong>
        <small v-if="drop.note">{{ drop.note }}</small>
      </li>
    </ul>
  </section>
</template>
