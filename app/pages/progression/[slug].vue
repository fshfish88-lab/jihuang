<script setup lang="ts">
import { getEntry } from '~/data/content'
const route = useRoute()
const slug = String(route.params.slug)
const meta = getEntry('progression', slug)
if (!meta) throw createError({ statusCode: 404, statusMessage: '没有找到该路线' })
const { data: entry } = await useAsyncData(`progression-${slug}`, () => queryCollection('progression').path(`/progression/${slug}`).first())
if (!entry.value) throw createError({ statusCode: 404, statusMessage: '没有找到该路线' })
</script>
<template><ContentDetail :entry="entry!" :meta="meta!" /></template>

