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
export const IMAGE_VERIFIED_AT = '2026-08-13'

export type EntrySeed = Omit<WikiEntry, 'image' | 'version' | 'verifiedAt' | 'sources'> & {
  prefab: string
  sourceLinks?: SourceLink[]
}

const imageSourceOverrides: Record<string, string> = {
  'bee-queen': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Bee_Queen.png',
  'malbatross': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Malbatross.png',
  'crab-king': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Crab_King.png',
  'twins-of-terror': 'https://dontstarve.wiki.gg/images/Retinazor.png?6e12b3',
  'cave-entrance': 'https://dontstarve.wiki.gg/images/Sinkhole.png?ef9ea5',
  'klaus': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Klaus.png',
  'toadstool': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Toadstool.png',
  'ancient-fuelweaver': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Ancient_Fuelweaver.png',
  'eye-of-terror': 'https://dontstarve.wiki.gg/images/Eye_of_Terror_Phase_1.png?1e50f7',
  'ruins': 'https://dontstarve.wiki.gg/images/Ruins_Entrance.png?4b188f',
  'depth-worm': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Depths_Worm.png',
  'bunnyman': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Bunnyman.png',
  'splumonkey': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Splumonkey.png',
  'ancient-guardian': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Ancient_Guardian.png',
  'ancient-pseudoscience-station': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Ancient_Pseudoscience_Station.png',
  'celestial-portal': 'https://dontstarve.wiki.gg/images/Celestial_Portal.png?b13281',
  'celestial-altar': 'https://dontstarve.wiki.gg/images/Celestial_Altar.png?6223d1',
  'deadly-brightshade': 'https://dontstarve.wiki.gg/images/Deadly_Brightshade.png?7e4470',
  'grazer': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Grazer.png',
  'lunar-rift': 'https://dontstarve.wiki.gg/images/Lunar_Rift_Phase_3.png?2baa26',
  'celestial-champion': 'https://dontstarve.wiki.gg/images/Celestial_Champion_Phase_3.png?18cdc3',
  'lunar-island': 'https://dontstarve.wiki.gg/images/Lunar_Island.png?a901f4',
  'cookie-cutter': 'https://dontstarve.wiki.gg/images/Cookie_Cutter.png?725d8d',
  'deerclops': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Deerclops.png',
  'antlion': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Antlion.png',
  'bearger': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Bearger.png',
  'dragonfly': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Dragonfly.png',
  'shadow-rift': 'https://dontstarve.wiki.gg/images/Shadow_Rift_Phase_3.png?55d45c',
  'moose-goose': 'https://dontstarve.wiki.gg/images/Goose.png?6fad68',
  'waymark-compass': 'https://dontstarve.wiki.gg/images/Waymark_Compass.png?ffd7f3',
  'sanctum': 'https://dontstarve.wiki.gg/images/Sanctum_Icon.png?c3d611',
  'ancient-guard-tower': 'https://dontstarve.wiki.gg/images/Ancient_Guard_Tower.png?c3ea50',
  'geothermite': 'https://dontstarve.wiki.gg/images/Geothermite.png?a79ca6',
  'keystone': 'https://dontstarve.wiki.gg/images/Keystone.png?efda91',
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
      verifiedAt: IMAGE_VERIFIED_AT
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

export function amount(slug: string | undefined, name: string, count: number): IngredientAmount {
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
