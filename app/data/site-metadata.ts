import { guideEntries } from './content'

export const SITE_VERSION = '2026.08'
export const SITE_UPDATED_AT = '2026-08-13'

interface SiteStats {
  totalEntries: number
  wikiEntries: number
  dishEntries: number
  progressionEntries: number
}

export const siteStats = guideEntries.reduce<SiteStats>((stats, entry) => {
  stats.totalEntries += 1
  if (entry.kind === 'wiki') stats.wikiEntries += 1
  if (entry.kind === 'wiki' && entry.tags.includes('四格食谱')) stats.dishEntries += 1
  if (entry.kind === 'progression') stats.progressionEntries += 1
  return stats
}, {
  totalEntries: 0,
  wikiEntries: 0,
  dishEntries: 0,
  progressionEntries: 0
})

export const wikiDescription = `${siteStats.wikiEntries} 份《饥荒联机版》核心档案，其中包含 ${siteStats.dishEntries} 道四格食谱；制作材料、获取步骤与关键数据一次查清。`
