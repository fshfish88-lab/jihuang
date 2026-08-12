import type { WikiEntry, WikiRoute } from '~/types/wiki'
import { bossCombatEntries } from './boss-combat'
import { advancedCaveEntries } from './caves-advanced'
import { creatureEntries } from './creatures'
import { craftingExpandedEntries } from './crafting-expanded'
import { dishEntries } from './dishes'
import { expandedDishEntries } from './dishes-expanded'
import { equipmentEntries } from './equipment'
import { explorationEntries } from './exploration'
import { materialEntries } from './materials'
import { expandedMaterialEntries } from './materials-expanded'
import { lunarRiftEntries } from './lunar-rift'
import { oceanLunarEntries } from './ocean-lunar'
import { seasonalEntries } from './seasonal'
import { shadowSanctumEntries } from './shadow-sanctum'
import { structureEntries } from './structures'

export const wikiEntries: WikiEntry[] = [
  ...materialEntries,
  ...expandedMaterialEntries,
  ...craftingExpandedEntries,
  ...equipmentEntries,
  ...structureEntries,
  ...dishEntries,
  ...expandedDishEntries,
  ...creatureEntries,
  ...explorationEntries,
  ...seasonalEntries,
  ...advancedCaveEntries,
  ...oceanLunarEntries,
  ...bossCombatEntries,
  ...lunarRiftEntries,
  ...shadowSanctumEntries
]

export function getWikiEntry(slug: string): WikiEntry | undefined {
  return wikiEntries.find(entry => entry.slug === slug)
}

export function getWikiEntriesByCategory(category: WikiEntry['category']): WikiEntry[] {
  return wikiEntries.filter(entry => entry.category === category)
}

export function getWikiEntriesByRoute(route: WikiRoute): WikiEntry[] {
  return wikiEntries.filter(entry => entry.route === route)
}
