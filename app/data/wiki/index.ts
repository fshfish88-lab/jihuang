import type { WikiEntry } from '~/types/wiki'

export const wikiEntries: WikiEntry[] = []

export function getWikiEntry(slug: string): WikiEntry | undefined {
  return wikiEntries.find(entry => entry.slug === slug)
}
