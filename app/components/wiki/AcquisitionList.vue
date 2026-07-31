<script setup lang="ts">
import type { AcquisitionMethod } from '~/types/wiki'

defineProps<{ methods: AcquisitionMethod[] }>()
</script>

<template>
  <section class="wiki-section paper-card" aria-labelledby="acquisition-title">
    <header class="wiki-section__header">
      <div>
        <p class="eyebrow">Acquisition</p>
        <h2 id="acquisition-title">怎么获得</h2>
      </div>
    </header>

    <div class="acquisition-grid">
      <article v-for="method in methods" :key="`${method.type}-${method.title}`" class="acquisition-card">
        <span class="acquisition-card__type">{{ method.type }}</span>
        <h3>{{ method.title }}</h3>
        <ol>
          <li v-for="step in method.steps" :key="step">{{ step }}</li>
        </ol>
      </article>
    </div>
  </section>
</template>
