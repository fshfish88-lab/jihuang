import type {
  AcquisitionMethod,
  CombatInfo,
  CraftingInfo,
  FactValue,
  IngredientAmount,
  WikiCategory,
  SourceLink,
  WikiEntry,
  WikiRoute
} from '~/types/wiki'

export const DATA_VERSION = 'DST 2026.08'
export const VERIFIED_AT = '2026-08-08'

export type EntrySeed = Omit<WikiEntry, 'image' | 'version' | 'verifiedAt' | 'sources'> & {
  prefab: string
  sourceLinks?: SourceLink[]
}

const imageSourceOverrides: Record<string, string> = {
  hound: 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Hound.png',
  pigman: 'https://dontstarve.wiki.gg/images/Happy_Pigman_Profile_Icon.png?82354d&20230728040734',
  frog: 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Frog.png',
  'clockwork-knight': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Clockwork_Knight.png',
  'pig-king': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Pig_King.png',
  koalefant: 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Koalefant.png',
  'touch-stone': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Touch_Stone.png',
  onion: 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Onion.png',
  chest: 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Chest.png'
}

function wikiPage(english: string): string {
  return `https://dontstarve.wiki.gg/wiki/${encodeURIComponent(english.replaceAll(' ', '_'))}/DST`
}

export function createEntry(seed: EntrySeed): WikiEntry {
  const { sourceLinks = [], ...entry } = seed
  const sourceUrl = imageSourceOverrides[seed.slug]
    || `https://raw.githubusercontent.com/fankimm/dst-craft/main/public/images/game-items/${seed.prefab}.png`
  return {
    ...entry,
    image: {
      path: `/images/wiki/${seed.slug}.png`,
      alt: `《饥荒联机版》${seed.title}物品图标`,
      sourceUrl,
      sourcePage: imageSourceOverrides[seed.slug]
        || `https://github.com/fankimm/dst-craft/blob/main/public/images/game-items/${seed.prefab}.png`,
      owner: 'Klei Entertainment',
      verifiedAt: VERIFIED_AT
    },
    version: DATA_VERSION,
    verifiedAt: VERIFIED_AT,
    sources: [
      {
        label: `Don't Starve Wiki：${seed.english}（DST）`,
        url: wikiPage(seed.english),
        kind: 'wiki'
      },
      ...sourceLinks
    ]
  }
}

export function amount(slug: string, name: string, count: number): IngredientAmount {
  return { slug, name, amount: count }
}

export function noCraft(reason = '该物品不能由玩家直接制作。'): CraftingInfo {
  return {
    craftable: false,
    ingredients: [],
    station: reason,
    filter: '不可制作',
    yield: 0
  }
}

export function craft(
  ingredients: IngredientAmount[],
  station: string,
  filter: string,
  yieldCount = 1,
  requirements: string[] = []
): CraftingInfo {
  return {
    craftable: true,
    ingredients,
    station,
    filter,
    yield: yieldCount,
    requirements
  }
}

export function acquire(
  type: AcquisitionMethod['type'],
  title: string,
  ...steps: string[]
): AcquisitionMethod {
  return { type, title, steps }
}

interface SimpleSeed {
  slug: string
  prefab?: string
  title: string
  english: string
  aliases?: string[]
  category: WikiCategory
  stage: string
  summary: string
  acquisition: AcquisitionMethod[]
  facts?: FactValue[]
  crafting?: CraftingInfo
  uses?: string[]
  tips?: string[]
  mistakes?: string[]
  related?: string[]
  tags?: string[]
  route?: WikiRoute
  routeGuide?: string
  combat?: CombatInfo
  sources?: SourceLink[]
}

export function simpleEntry(seed: SimpleSeed): WikiEntry {
  return createEntry({
    slug: seed.slug,
    prefab: seed.prefab || seed.slug,
    title: seed.title,
    english: seed.english,
    aliases: seed.aliases || [seed.title, seed.english],
    category: seed.category,
    tags: seed.tags || [seed.category],
    stage: seed.stage,
    summary: seed.summary,
    facts: seed.facts || [],
    crafting: seed.crafting || noCraft(),
    acquisition: seed.acquisition,
    uses: seed.uses || [],
    tips: seed.tips || [],
    mistakes: seed.mistakes || [],
    related: seed.related || [],
    route: seed.route,
    routeGuide: seed.routeGuide,
    combat: seed.combat,
    sourceLinks: seed.sources
  })
}
