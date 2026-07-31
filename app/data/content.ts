import type { ContentKind, GuideEntry } from '~/types/content'

import { wikiEntries } from './wiki'

const common = {
  updatedAt: '2026-07-31',
  version: '2026.07'
}

const legacyGuideEntries: GuideEntry[] = [
  {
    ...common,
    slug: 'first-day',
    title: '第一天生存路线',
    kind: 'beginner',
    description: '从出生到点燃第一堆火，按顺序完成最重要的四件事。',
    stage: '第 1 天',
    tags: ['新手', '开局', '探索'],
    aliases: ['第一天', '开局', '新手开荒'],
    image: '/images/official/hero.jpg',
    imageAlt: '饥荒联机版荒野中的角色与环境'
  },
  {
    ...common,
    slug: 'first-week',
    title: '第一周发展路线',
    kind: 'beginner',
    description: '先探索，再建家，用七天建立稳定食物与基础科技。',
    stage: '第 1—7 天',
    tags: ['新手', '科技', '探索'],
    aliases: ['第一周', '七天攻略', '前期发展'],
    image: '/images/official/wx-farm.jpg',
    imageAlt: 'WX-78 在农场区域活动'
  },
  {
    ...common,
    slug: 'base-location',
    title: '建家选址不踩坑',
    kind: 'beginner',
    description: '用资源半径和交通成本判断基地位置，而不是只看地面是否漂亮。',
    stage: '第 5—10 天',
    tags: ['新手', '建家', '资源'],
    aliases: ['建家', '基地选址', '家建哪里'],
    image: '/images/official/wx-farm.jpg',
    imageAlt: '饥荒联机版农场与基地环境'
  },
  {
    ...common,
    slug: 'first-winter',
    title: '第一个冬季准备',
    kind: 'beginner',
    description: '保暖、食物、燃料和巨鹿预案四项齐备，冬天就不再是倒计时。',
    stage: '第 11—20 天',
    tags: ['冬季', '保暖', 'Boss'],
    aliases: ['冬天', '过冬', '第一个冬季'],
    image: '/images/official/hero.jpg',
    imageAlt: '饥荒联机版荒野场景'
  },
  {
    ...common,
    slug: 'common-mistakes',
    title: '新手常见误区',
    kind: 'beginner',
    description: '不急着永久建家、不囤腐烂食物、不在基地硬接季节 Boss。',
    stage: '随时复查',
    tags: ['新手', '避坑', '复活'],
    aliases: ['新手误区', '避坑', '为什么总死'],
    image: '/images/official/shadow.jpg',
    imageAlt: '麦斯威尔与暗影生物'
  },
  {
    ...common,
    slug: 'wilson',
    title: '威尔逊',
    english: 'Wilson',
    kind: 'character',
    description: '机制直观、没有致命短板，适合用来学习世界本身。',
    stage: '新手入门',
    difficulty: 1,
    tags: ['新手友好', '通用', '单人', '多人'],
    aliases: ['wilson', '科学家', '威尔逊'],
    image: '/images/official/hero.jpg',
    imageAlt: '官方画面中的威尔逊'
  },
  {
    ...common,
    slug: 'wendy',
    title: '温蒂',
    english: 'Wendy',
    kind: 'character',
    description: '阿比盖尔能高效处理群怪，是容错很高的新手角色。',
    stage: '新手入门',
    difficulty: 1,
    tags: ['新手友好', '辅助', '群体战斗', '多人'],
    aliases: ['wendy', '温蒂', '妹妹', '阿比盖尔'],
    image: '/images/official/hero.jpg',
    imageAlt: '饥荒联机版角色与荒野'
  },
  {
    ...common,
    slug: 'wolfgang',
    title: '沃尔夫冈',
    english: 'Wolfgang',
    kind: 'character',
    description: '依靠力量值获得直接战斗收益，适合愿意练习走位的玩家。',
    stage: '战斗进阶',
    difficulty: 3,
    tags: ['战斗', '单人', 'Boss'],
    aliases: ['wolfgang', '沃尔夫冈', '大力士', '大力'],
    image: '/images/official/toad-battle.jpg',
    imageAlt: '饥荒联机版 Boss 战斗'
  },
  {
    ...common,
    slug: 'wigfrid',
    title: '薇格弗德',
    english: 'Wigfrid',
    kind: 'character',
    description: '战斗恢复和团队头盔让她很稳，但需要围绕肉食安排补给。',
    stage: '战斗入门',
    difficulty: 2,
    tags: ['战斗', '团队', '多人', 'Boss'],
    aliases: ['wigfrid', '薇格弗德', '女武神'],
    image: '/images/official/toad-battle.jpg',
    imageAlt: '饥荒联机版战斗场景'
  },
  {
    ...common,
    slug: 'wx-78',
    title: 'WX-78',
    english: 'WX-78',
    kind: 'character',
    description: '通过电路成长并适应不同任务，强大但需要理解模块组合。',
    stage: '机制进阶',
    difficulty: 3,
    tags: ['成长', '资源', '单人', '复杂机制'],
    aliases: ['wx', 'wx78', '机器人', '铁皮人'],
    image: '/images/official/wx-farm.jpg',
    imageAlt: 'WX-78 在农场中的官方画面'
  },
  {
    ...common,
    slug: 'deerclops',
    title: '独眼巨鹿',
    english: 'Deerclops',
    kind: 'boss',
    description: '第一个冬季最常见的基地威胁；把它引离建筑，再决定打或拖。',
    stage: '第一个冬季',
    difficulty: 3,
    tags: ['地表', '季节 Boss', '可选', '单人'],
    aliases: ['巨鹿', '冬季boss', 'deerclops', 'dl'],
    image: '/images/official/hero.jpg',
    imageAlt: '饥荒联机版荒野威胁'
  },
  {
    ...common,
    slug: 'bearger',
    title: '熊獾',
    english: 'Bearger',
    kind: 'boss',
    description: '秋季出现的拆家高手，也能被利用来砍树和清理资源区。',
    stage: '第二个秋季起',
    difficulty: 3,
    tags: ['地表', '季节 Boss', '可选', '单人'],
    aliases: ['熊大', '秋季boss', 'bearger', '熊獾'],
    image: '/images/official/hero.jpg',
    imageAlt: '饥荒联机版荒野场景'
  },
  {
    ...common,
    slug: 'bee-queen',
    title: '蜂后',
    english: 'Bee Queen',
    kind: 'boss',
    description: '高压群怪战，准备减速、护甲和持续恢复比追求爆发更重要。',
    stage: '稳定基地后',
    difficulty: 5,
    tags: ['地表', '团队推荐', '可选', '群怪'],
    aliases: ['蜂后', 'bee queen', 'bq'],
    image: '/images/official/toad-battle.jpg',
    imageAlt: '饥荒联机版大型 Boss 战斗'
  },
  {
    ...common,
    slug: 'klaus',
    title: '克劳斯',
    english: 'Klaus',
    kind: 'boss',
    description: '冬季战利品 Boss；先找无眼鹿与赃物袋，再按阶段处理召唤物。',
    stage: '稳定过冬后',
    difficulty: 4,
    tags: ['地表', '冬季', '可选', '多人'],
    aliases: ['克劳斯', 'klaus', '袋子boss'],
    image: '/images/official/hero.jpg',
    imageAlt: '饥荒联机版冬季荒野'
  },
  {
    ...common,
    slug: 'ancient-guardian',
    title: '远古守护者',
    english: 'Ancient Guardian',
    kind: 'boss',
    description: '遗迹迷宫中的冲撞 Boss；清场、照明和可靠的卡位空间决定容错。',
    stage: '遗迹探索',
    difficulty: 4,
    tags: ['洞穴', '遗迹', '路线 Boss', '单人'],
    aliases: ['远古守护者', '犀牛', 'ancient guardian', 'ag'],
    image: '/images/official/toad-battle.jpg',
    imageAlt: '饥荒联机版洞穴 Boss 战斗'
  },
  {
    ...common,
    slug: 'basic-survival',
    title: '基础生存线',
    kind: 'progression',
    description: '从出生、科技、基地到四季循环，建立可以长期运转的世界。',
    stage: '开局至稳定基地',
    tags: ['主线', '新手', '地表'],
    aliases: ['基础生存', '开荒路线', '主线第一步'],
    image: '/images/official/hero.jpg',
    imageAlt: '饥荒联机版荒野探索'
  },
  {
    ...common,
    slug: 'caves-ruins',
    title: '洞穴与遗迹线',
    kind: 'progression',
    description: '建立地下补给点，寻找远古遗迹并取得铥矿科技。',
    stage: '稳定基地后',
    tags: ['主线', '洞穴', '遗迹'],
    aliases: ['洞穴', '遗迹', '铥矿路线'],
    image: '/images/official/toad-battle.jpg',
    imageAlt: '饥荒联机版洞穴战斗'
  },
  {
    ...common,
    slug: 'lunar-island',
    title: '月岛与天体线',
    kind: 'progression',
    description: '从造船出海到月岛科技，为天体方向的后期内容打基础。',
    stage: '航海与中后期',
    tags: ['主线', '航海', '月岛'],
    aliases: ['月岛', '天体线', '航海主线'],
    image: '/images/official/boat.jpg',
    imageAlt: '饥荒联机版角色乘船航海'
  },
  {
    ...common,
    slug: 'torch',
    title: '火把',
    english: 'Torch',
    kind: 'wiki',
    description: '最便宜的移动光源；开局随身留一份材料，比提前做一堆更灵活。',
    stage: '第 1 天',
    tags: ['物品', '照明', '开局'],
    aliases: ['火把', 'torch', '移动光源'],
    image: '/images/official/hero.jpg',
    imageAlt: '饥荒联机版荒野夜色'
  },
  {
    ...common,
    slug: 'campfire',
    title: '营火',
    english: 'Campfire',
    kind: 'wiki',
    description: '提供夜间照明和烹饪；临时探索时够用，不等于永久基地。',
    stage: '第 1 天',
    tags: ['建筑', '照明', '开局'],
    aliases: ['营火', '篝火', 'campfire'],
    image: '/images/official/hero.jpg',
    imageAlt: '饥荒联机版荒野营地'
  },
  {
    ...common,
    slug: 'science-machine',
    title: '科学机器',
    english: 'Science Machine',
    kind: 'wiki',
    description: '解锁第一层科技；原型制作后即可继续探索，不必把它当永久基地。',
    stage: '第 1—3 天',
    tags: ['建筑', '科技', '开局'],
    aliases: ['科学机器', '一本', 'science machine'],
    image: '/images/official/wx-farm.jpg',
    imageAlt: '饥荒联机版科技与农场环境'
  },
  {
    ...common,
    slug: 'alchemy-engine',
    title: '炼金引擎',
    english: 'Alchemy Engine',
    kind: 'wiki',
    description: '稳定基地的核心科技站，解锁大部分前中期工具与装备。',
    stage: '第 5—10 天',
    tags: ['建筑', '科技', '基地'],
    aliases: ['炼金引擎', '二本', 'alchemy engine'],
    image: '/images/official/wx-farm.jpg',
    imageAlt: '饥荒联机版科技区域'
  },
  {
    ...common,
    slug: 'crock-pot',
    title: '烹饪锅',
    english: 'Crock Pot',
    kind: 'wiki',
    description: '把零散食材转化为稳定料理，是第一周最值得建设的食物设施。',
    stage: '第一周',
    tags: ['建筑', '料理', '基地'],
    aliases: ['烹饪锅', '锅', 'crock pot'],
    image: '/images/official/wx-farm.jpg',
    imageAlt: '饥荒联机版农场与食物设施'
  },
  {
    ...common,
    slug: 'ice-box',
    title: '冰箱',
    english: 'Ice Box',
    kind: 'wiki',
    description: '延长多数食物保质期；齿轮有限时优先服务稳定食物循环。',
    stage: '第一周',
    tags: ['建筑', '食物', '基地'],
    aliases: ['冰箱', 'ice box', '保鲜'],
    image: '/images/official/wx-farm.jpg',
    imageAlt: '饥荒联机版农场区域'
  },
  {
    ...common,
    slug: 'football-helmet',
    title: '橄榄球头盔',
    english: 'Football Helmet',
    kind: 'wiki',
    description: '耐用且通用的头部护甲，是新手练习走位时最可靠的保险。',
    stage: '前中期',
    tags: ['装备', '护甲', '战斗'],
    aliases: ['猪皮帽', '橄榄球头盔', 'football helmet'],
    image: '/images/official/toad-battle.jpg',
    imageAlt: '饥荒联机版战斗画面'
  },
  {
    ...common,
    slug: 'log-suit',
    title: '木甲',
    english: 'Log Suit',
    kind: 'wiki',
    description: '材料直接、适合紧急战斗；会占用身体栏，准备背包切换意识。',
    stage: '前期',
    tags: ['装备', '护甲', '战斗'],
    aliases: ['木甲', '木头盔甲', 'log suit'],
    image: '/images/official/toad-battle.jpg',
    imageAlt: '饥荒联机版战斗场景'
  },
  {
    ...common,
    slug: 'hambat',
    title: '火腿棒',
    english: 'Ham Bat',
    kind: 'wiki',
    description: '不消耗耐久但会随新鲜度降低伤害，适合连续战斗窗口。',
    stage: '中期战斗',
    tags: ['武器', '战斗', 'Boss'],
    aliases: ['火腿棒', '火腿棍', 'hambat'],
    image: '/images/official/toad-battle.jpg',
    imageAlt: '饥荒联机版 Boss 战'
  },
  {
    ...common,
    slug: 'thermal-stone',
    title: '暖石',
    english: 'Thermal Stone',
    kind: 'wiki',
    description: '帮助管理温度，但不是无限热源；搭配保暖装备和定期加热更稳。',
    stage: '冬季前',
    tags: ['物品', '保暖', '冬季'],
    aliases: ['暖石', '热能石', 'thermal stone'],
    image: '/images/official/hero.jpg',
    imageAlt: '饥荒联机版荒野场景'
  },
  {
    ...common,
    slug: 'beefalo-hat',
    title: '牛帽',
    english: 'Beefalo Hat',
    kind: 'wiki',
    description: '优秀的冬季保暖帽，制作前需要规划牛毛与牛角来源。',
    stage: '冬季前',
    tags: ['装备', '保暖', '冬季'],
    aliases: ['牛帽', '牛角帽', 'beefalo hat'],
    image: '/images/official/hero.jpg',
    imageAlt: '饥荒联机版荒野生物环境'
  },
  {
    ...common,
    slug: 'meatballs',
    title: '肉丸',
    english: 'Meatballs',
    kind: 'wiki',
    description: '配方宽松的饱食料理，适合把少量肉和便宜填充物变成稳定口粮。',
    stage: '第一周',
    tags: ['食物', '料理', '新手'],
    aliases: ['肉丸', 'meatballs', '丸子'],
    image: '/images/official/wx-farm.jpg',
    imageAlt: '饥荒联机版农场与食物'
  },
  {
    ...common,
    slug: 'pierogi',
    title: '波兰水饺',
    english: 'Pierogi',
    kind: 'wiki',
    description: '常用战斗恢复料理；提前备好蛋、肉和蔬菜比临战找食材可靠。',
    stage: '中期',
    tags: ['食物', '恢复', '战斗'],
    aliases: ['饺子', '波兰水饺', 'pierogi'],
    image: '/images/official/wx-farm.jpg',
    imageAlt: '饥荒联机版农场场景'
  },
  {
    ...common,
    slug: 'healing-salve',
    title: '治疗药膏',
    english: 'Healing Salve',
    kind: 'wiki',
    description: '材料直观的应急恢复，适合洞穴或远行时分散携带。',
    stage: '前中期',
    tags: ['物品', '恢复', '远行'],
    aliases: ['治疗药膏', '药膏', 'healing salve'],
    image: '/images/official/hero.jpg',
    imageAlt: '饥荒联机版探索环境'
  },
  {
    ...common,
    slug: 'lantern',
    title: '提灯',
    english: 'Lantern',
    kind: 'wiki',
    description: '洞穴核心可充能光源；放在地上也能照明，解放手部装备栏。',
    stage: '洞穴准备',
    tags: ['物品', '照明', '洞穴'],
    aliases: ['提灯', '灯笼', 'lantern'],
    image: '/images/official/toad-battle.jpg',
    imageAlt: '饥荒联机版洞穴场景'
  },
  {
    ...common,
    slug: 'miner-hat',
    title: '矿工帽',
    english: 'Miner Hat',
    kind: 'wiki',
    description: '头部照明让双手保持可用，探索洞穴和夜间采集很方便。',
    stage: '洞穴准备',
    tags: ['装备', '照明', '洞穴'],
    aliases: ['矿灯帽', '矿工帽', 'miner hat'],
    image: '/images/official/toad-battle.jpg',
    imageAlt: '饥荒联机版洞穴画面'
  },
  {
    ...common,
    slug: 'boat-kit',
    title: '船套装',
    english: 'Boat Kit',
    kind: 'wiki',
    description: '航海平台的起点；下水前先准备船桨、锚和照明，不要只带一块船板。',
    stage: '航海准备',
    tags: ['物品', '航海', '月岛'],
    aliases: ['船套装', '船', 'boat kit'],
    image: '/images/official/boat.jpg',
    imageAlt: '饥荒联机版航海官方画面'
  },
  {
    ...common,
    slug: 'tell-tale-heart',
    title: '告密的心',
    english: 'Telltale Heart',
    kind: 'wiki',
    description: '多人模式的常见救援手段；复活会带来代价，救起后要继续恢复状态。',
    stage: '多人开局',
    tags: ['物品', '复活', '多人'],
    aliases: ['心', '复活心', '告密的心', 'telltale heart'],
    image: '/images/official/hero.jpg',
    imageAlt: '饥荒联机版多人荒野'
  },
  {
    ...common,
    slug: 'touch-stone',
    title: '试金石',
    english: 'Touch Stone',
    kind: 'wiki',
    description: '探索时激活并标记位置，为单人和团队保留一次重要的复活选择。',
    stage: '探索期',
    tags: ['建筑', '复活', '探索'],
    aliases: ['试金石', '复活台', 'touch stone'],
    image: '/images/official/hero.jpg',
    imageAlt: '饥荒联机版地图探索'
  },
  {
    ...common,
    slug: 'pig-king',
    title: '猪王',
    english: 'Pig King',
    kind: 'wiki',
    description: '用特定物品换取金块的重要资源点，前期探索发现后应标记。',
    stage: '探索期',
    tags: ['生物', '资源', '地表'],
    aliases: ['猪王', 'pig king', '换金子'],
    image: '/images/official/hero.jpg',
    imageAlt: '饥荒联机版地表环境'
  },
  {
    ...common,
    slug: 'beefalo',
    title: '皮弗娄牛',
    english: 'Beefalo',
    kind: 'wiki',
    description: '提供粪肥、牛毛与牛角相关资源；发情期需要保持距离。',
    stage: '探索期',
    tags: ['生物', '资源', '地表'],
    aliases: ['牛', '皮弗娄牛', 'beefalo'],
    image: '/images/official/hero.jpg',
    imageAlt: '饥荒联机版草原环境'
  }
]

export const guideEntries: GuideEntry[] = [
  ...legacyGuideEntries.filter(entry => entry.kind !== 'wiki'),
  ...wikiEntries.map(entry => ({
    slug: entry.slug,
    title: entry.title,
    english: entry.english,
    kind: 'wiki' as const,
    description: entry.summary,
    stage: entry.stage,
    tags: [
      entry.category,
      ...entry.tags.filter(tag => tag !== entry.category),
      ...(entry.dish ? ['四格食谱', '烹饪锅'] : [])
    ],
    aliases: entry.aliases,
    image: entry.image.path,
    imageAlt: entry.image.alt,
    updatedAt: entry.verifiedAt,
    version: entry.version
  }))
]

export const kindLabels: Record<ContentKind, string> = {
  beginner: '萌新入门',
  character: '角色攻略',
  boss: 'Boss 攻略',
  progression: '世界主线',
  wiki: '百科资料'
}

export function entryPath(entry: GuideEntry): string {
  const segments: Record<ContentKind, string> = {
    beginner: 'beginner',
    character: 'characters',
    boss: 'bosses',
    progression: 'progression',
    wiki: 'wiki'
  }
  return `/${segments[entry.kind]}/${entry.slug}`
}

export function getEntries(kind: ContentKind): GuideEntry[] {
  return guideEntries.filter(entry => entry.kind === kind)
}

export function getEntry(kind: ContentKind, slug: string): GuideEntry | undefined {
  return guideEntries.find(entry => entry.kind === kind && entry.slug === slug)
}

export function getEntryBySlug(slug: string): GuideEntry | undefined {
  return guideEntries.find(entry => entry.slug === slug)
}


