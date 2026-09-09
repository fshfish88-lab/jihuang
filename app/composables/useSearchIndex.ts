import { buildSearchIndex, searchEntries } from '~/utils/search'
import { guideEntries } from '~/data/content'
import type { GuideEntry } from '~/types/content'

export function createSearchIndex(entries: GuideEntry[] = guideEntries) {
  return buildSearchIndex(entries)
}

export function useSearchIndex() {
  const query = useQueryValue('q')
  const fuse = createSearchIndex()
  const results = computed(() => {
    return searchEntries(fuse, query.value)
  })
  return { query, results }
}

