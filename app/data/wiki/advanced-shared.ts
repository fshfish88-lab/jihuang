import type {
  AcquisitionMethod,
  CombatInfo,
  SourceLink,
  WikiCategory,
  WikiEntry,
  WikiRoute
} from '~/types/wiki'
import { acquire, amount, craft, noCraft, simpleEntry } from './shared'

type MaterialSeed = [slug: string | undefined, name: string, amount: number]
type FactSeed = [label: string, value: string]

export interface AdvancedSeed {
  slug: string
  prefab?: string
  title: string
  english: string
  aliases?: string[]
  category: WikiCategory
  stage: string
  summary: string
  obtainType?: AcquisitionMethod['type']
  obtain: string[]
  materials?: MaterialSeed[]
  station?: string
  filter?: string
  yield?: number
  requirements?: string[]
  facts?: FactSeed[]
  uses?: string[]
  tips?: string[]
  mistakes?: string[]
  related?: string[]
  combat?: CombatInfo
  sources?: SourceLink[]
}

export function buildRouteEntries(
  route: WikiRoute,
  routeGuide: string,
  seeds: AdvancedSeed[]
): WikiEntry[] {
  return seeds.map(seed => {
    const craftable = Boolean(seed.materials?.length)
    return simpleEntry({
      slug: seed.slug,
      prefab: seed.prefab,
      title: seed.title,
      english: seed.english,
      aliases: seed.aliases,
      category: seed.category,
      stage: seed.stage,
      summary: seed.summary,
      route,
      routeGuide,
      tags: [route, seed.stage, seed.category],
      facts: (seed.facts || []).map(([label, value]) => ({ label, value })),
      crafting: craftable
        ? craft(
            seed.materials!.map(([slug, name, count]) => amount(slug, name, count)),
            seed.station || '无需科技站',
            seed.filter || '生存',
            seed.yield || 1,
            seed.requirements || []
          )
        : noCraft('该条目不能由玩家直接制作，请按下方获取步骤取得。'),
      acquisition: [
        acquire(
          craftable ? '制作' : (seed.obtainType || '世界生成'),
          craftable ? '制作与取得' : '获取方法',
          ...seed.obtain
        )
      ],
      uses: seed.uses || [`用于推进“${route}”路线。`],
      tips: seed.tips || ['出发前确认背包、照明和返程路线。'],
      mistakes: seed.mistakes || ['不要在没有撤退路线时一次投入全部稀有材料。'],
      related: seed.related || [],
      combat: seed.combat,
      sources: seed.sources
    })
  })
}

export function fight(
  spawn: string[],
  preparation: string[],
  steps: string[],
  retreat: string[],
  drops: CombatInfo['drops']
): CombatInfo {
  return { spawn, preparation, steps, retreat, drops }
}

export const cursedConfrontationSource: SourceLink = {
  label: 'Klei：Cursed Confrontation Part 1 更新说明',
  url: 'https://forums.kleientertainment.com/game-updates/dst/736805-r2749/',
  kind: 'official'
}

export const roadmap2026Source: SourceLink = {
  label: 'Klei：《饥荒联机版》2026 年路线图',
  url: 'https://forums.kleientertainment.com/forums/topic/170917-dont-starve-together-2026-roadmap/',
  kind: 'official'
}
