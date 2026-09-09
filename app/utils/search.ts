import Fuse from 'fuse.js'
import type { GuideEntry } from '~/types/content'

export function normalizeSearchQuery(value: string): string {
  const text = value.normalize('NFKC').trim().toLowerCase().replace(/[？?！!。]+$/g, '')
  const questions: Record<string, string> = {
    怎么复活: '复活', 如何复活: '复活', 死了怎么办: '复活',
    怎么过冬: '保暖', 如何过冬: '保暖', 冬天怎么办: '保暖',
    怎么回血: '回血', 如何回血: '回血', 怎么回理智: '理智',
    怎么建家: '建家', 如何建家: '建家'
  }
  return questions[text] || text
}

export function buildSearchIndex(entries: GuideEntry[]) {
  return new Fuse(entries, {
    includeScore: true, ignoreLocation: true, minMatchCharLength: 1, threshold: 0.38,
    keys: [
      { name: 'title', weight: 0.4 }, { name: 'aliases', weight: 0.3 },
      { name: 'tags', weight: 0.15 }, { name: 'description', weight: 0.1 },
      { name: 'english', weight: 0.05 }
    ]
  })
}

export function searchEntries(index: Fuse<GuideEntry>, raw: string): GuideEntry[] {
  const query = normalizeSearchQuery(raw)
  if (!query) return []
  const exact = (entry: GuideEntry) => [entry.title, entry.english || '', ...entry.aliases]
    .some(value => value.toLowerCase() === query)
  return index.search(query)
    .sort((a, b) => Number(exact(b.item)) - Number(exact(a.item)) || (a.score || 0) - (b.score || 0))
    .map(result => result.item)
}
