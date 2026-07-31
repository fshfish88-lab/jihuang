<script setup lang="ts">
import { getEntry } from '~/data/content'
const route = useRoute()
const slug = String(route.params.slug)
const meta = getEntry('boss', slug)
if (!meta) throw createError({ statusCode: 404, statusMessage: '没有找到该 Boss' })
const { data: entry } = await useAsyncData(`boss-${slug}`, () => queryCollection('bosses').path(`/bosses/${slug}`).first())
if (!entry.value) throw createError({ statusCode: 404, statusMessage: '没有找到该 Boss' })
</script>
<template><ContentDetail :entry="entry!" :meta="meta!" /></template>

