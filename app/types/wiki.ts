export type WikiCategory = '资源' | '工具' | '装备' | '建筑' | '料理' | '生物' | '季节与探索'

export type WikiRoute =
  | '四季生存'
  | '洞穴遗迹'
  | '航海月岛'
  | 'Boss战备'
  | '天体裂隙'
  | '暗影圣所'

export interface SourceLink {
  label: string
  url: string
  kind: 'official' | 'wiki' | 'cross-check'
}

export interface ImageCredit {
  path: string
  alt: string
  sourceUrl: string
  sourcePage: string
  owner: string
  verifiedAt: string
}

export interface IngredientAmount {
  slug?: string
  name: string
  amount: number
}

export interface CraftingInfo {
  craftable: boolean
  ingredients: IngredientAmount[]
  station: string
  filter: string
  yield: number
  requirements?: string[]
}

export interface AcquisitionMethod {
  type: '制作' | '采集' | '掉落' | '交易' | '世界生成' | '烹饪'
  title: string
  steps: string[]
}

export interface FactValue {
  label: string
  value: string
}

export interface DishExample {
  label: string
  ingredients: IngredientAmount[]
  note?: string
}

export interface DishInfo {
  health: number
  hunger: number
  sanity: number
  perishDays: number | null
  cookTimeSeconds: number
  priority: number
  rules: string[]
  forbidden: string[]
  conflicts: string[]
  examples: DishExample[]
}

export interface DropInfo {
  slug?: string
  name: string
  amount: string
  note?: string
}

export interface CombatInfo {
  spawn: string[]
  preparation: string[]
  steps: string[]
  retreat: string[]
  drops: DropInfo[]
}

export interface WikiEntry {
  slug: string
  title: string
  english: string
  aliases: string[]
  category: WikiCategory
  tags: string[]
  stage: string
  summary: string
  image: ImageCredit
  facts: FactValue[]
  crafting: CraftingInfo
  acquisition: AcquisitionMethod[]
  uses: string[]
  tips: string[]
  mistakes: string[]
  related: string[]
  version: string
  verifiedAt: string
  sources: SourceLink[]
  dish?: DishInfo
  route?: WikiRoute
  routeGuide?: string
  combat?: CombatInfo
}
