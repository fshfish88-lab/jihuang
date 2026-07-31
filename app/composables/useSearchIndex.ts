import Fuse from 'fuse.js'
import { guideEntries } from '~/data/content'
import type { GuideEntry } from '~/types/content'

export function createSearchIndex(entries: GuideEntry[] = guideEntries) {
  return new Fuse(entries, {
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 1,
    threshold: 0.38,
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'aliases', weight: 0.3 },
      { name: 'tags', weight: 0.15 },
      { name: 'description', weight: 0.1 },
      { name: 'english', weight: 0.05 }
    ]
  })
}

export function useSearchIndex() {
  const query = ref('')
  const fuse = createSearchIndex()
  const results = computed(() => {
    const value = query.value.trim()
    if (!value) return []
    return fuse.search(value, { limit: 12 }).map(result => result.item)
  })
  return { query, results }
}

