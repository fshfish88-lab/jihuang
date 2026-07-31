import type { WikiEntry } from '~/types/wiki'
import { creatureEntries } from './creatures'
import { dishEntries } from './dishes'
import { equipmentEntries } from './equipment'
import { explorationEntries } from './exploration'
import { materialEntries } from './materials'
import { structureEntries } from './structures'

export const wikiEntries: WikiEntry[] = [
  ...materialEntries,
  ...equipmentEntries,
  ...structureEntries,
  ...dishEntries,
  ...creatureEntries,
  ...explorationEntries
]

export function getWikiEntry(slug: string): WikiEntry | undefined {
  return wikiEntries.find(entry => entry.slug === slug)
}

export function getWikiEntriesByCategory(category: WikiEntry['category']): WikiEntry[] {
  return wikiEntries.filter(entry => entry.category === category)
}
