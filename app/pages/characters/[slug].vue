<script setup lang="ts">
import { getEntry } from '~/data/content'
const route = useRoute()
const slug = String(route.params.slug)
const meta = getEntry('character', slug)
if (!meta) throw createError({ statusCode: 404, statusMessage: '没有找到该角色' })
const { data: entry } = await useAsyncData(`character-${slug}`, () => queryCollection('characters').path(`/characters/${slug}`).first())
if (!entry.value) throw createError({ statusCode: 404, statusMessage: '没有找到该角色' })
</script>
<template><ContentDetail :entry="entry!" :meta="meta!" /></template>

