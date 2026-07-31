<script setup lang="ts">
import { getEntry } from '~/data/content'
const route = useRoute()
const slug = String(route.params.slug)
const meta = getEntry('wiki', slug)
if (!meta) throw createError({ statusCode: 404, statusMessage: '没有找到该百科条目' })
const { data: entry } = await useAsyncData(`wiki-${slug}`, () => queryCollection('wiki').path(`/wiki/${slug}`).first())
if (!entry.value) throw createError({ statusCode: 404, statusMessage: '没有找到该百科条目' })
</script>
<template><ContentDetail :entry="entry!" :meta="meta!" /></template>

