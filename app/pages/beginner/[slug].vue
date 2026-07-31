<script setup lang="ts">
import { getEntry } from '~/data/content'
const route = useRoute()
const slug = String(route.params.slug)
const meta = getEntry('beginner', slug)
if (!meta) throw createError({ statusCode: 404, statusMessage: '没有找到这份手记' })
const { data: entry } = await useAsyncData(`beginner-${slug}`, () => queryCollection('beginner').path(`/beginner/${slug}`).first())
if (!entry.value) throw createError({ statusCode: 404, statusMessage: '没有找到这份手记' })
</script>
<template><ContentDetail :entry="entry!" :meta="meta!" /></template>

