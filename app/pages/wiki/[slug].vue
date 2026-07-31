<script setup lang="ts">
import { getWikiEntry } from '~/data/wiki'

const route = useRoute()
const slug = String(route.params.slug)
const entry = getWikiEntry(slug)
if (!entry) throw createError({ statusCode: 404, statusMessage: '没有找到该百科条目' })
</script>
<template><WikiDetail :entry="entry" /></template>

