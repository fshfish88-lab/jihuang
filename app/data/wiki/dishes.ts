import type { DishInfo, IngredientAmount, WikiEntry } from '~/types/wiki'
import { acquire, amount, createEntry, noCraft } from './shared'

interface DishSeed {
  slug: string
  prefab?: string
  title: string
  english: string
  aliases?: string[]
  stage: string
  summary: string
  health: number
  hunger: number
  sanity: number
  perishDays: number | null
  cookTimeSeconds: number
  priority: number
  rules: string[]
  forbidden?: string[]
  conflicts?: string[]
  example: IngredientAmount[]
  exampleLabel?: string
  note?: string
}

function dish(seed: DishSeed): WikiEntry {
  const info: DishInfo = {
    health: seed.health,
    hunger: seed.hunger,
    sanity: seed.sanity,
    perishDays: seed.perishDays,
    cookTimeSeconds: seed.cookTimeSeconds,
    priority: seed.priority,
    rules: seed.rules,
    forbidden: seed.forbidden || [],
    conflicts: seed.conflicts || [],
    examples: [{
      label: seed.exampleLabel || '推荐四格配方',
      ingredients: seed.example,
      note: seed.note
    }]
  }

  return createEntry({
    slug: seed.slug,
    prefab: seed.prefab || seed.slug,
    title: seed.title,
    english: seed.english,
    aliases: seed.aliases || [seed.title, seed.english],
    category: '料理',
    tags: ['料理', seed.health >= 40 ? '回血' : seed.hunger >= 60 ? '饱食' : '日常'],
    stage: seed.stage,
    summary: seed.summary,
    facts: [
      { label: '生命', value: `${seed.health >= 0 ? '+' : ''}${seed.health}` },
      { label: '饥饿', value: `${seed.hunger >= 0 ? '+' : ''}${seed.hunger}` },
      { label: '理智', value: `${seed.sanity >= 0 ? '+' : ''}${seed.sanity}` },
      { label: '保质期', value: seed.perishDays === null ? '永久' : `${seed.perishDays} 天` }
    ],
    crafting: noCraft('不是制作栏物品；必须在烹饪锅中放入四格食材烹饪。'),
    acquisition: [acquire('烹饪', '使用烹饪锅', '把下方示例中的四格食材逐格放入烹饪锅。', '确认没有触发更高优先级冲突料理。', '点击烹饪并等待完成。')],
    uses: [seed.summary],
    tips: ['先掌握一套低成本固定配方，再学习食材度规则。'],
    mistakes: seed.conflicts || [],
    related: ['crock-pot'],
    dish: info
  })
}

export const dishEntries: WikiEntry[] = [
  dish({
    slug: 'meatballs', title: '肉丸', english: 'Meatballs', aliases: ['肉丸', '丸子'], stage: '第一周',
    summary: '低成本补饥主食，适合把一份肉和便宜填充物转成 62.5 饥饿。',
    health: 3, hunger: 62.5, sanity: 5, perishDays: 10, cookTimeSeconds: 15, priority: -1,
    rules: ['肉度 > 0。'], forbidden: ['不可放树枝等不可食用度食材。'],
    conflicts: ['放入 2 块怪物肉会优先得到怪物千层饼。'],
    example: [amount('monster-meat', '怪物肉', 1), amount('ice', '冰', 3)],
    note: '冬季后最便宜的稳定做法之一。'
  }),
  dish({
    slug: 'pierogi', prefab: 'perogies', title: '波兰水饺', english: 'Pierogi', aliases: ['波兰水饺', '饺子'], stage: '前中期',
    summary: '常用战斗回血料理，恢复 40 生命且保质期较长。',
    health: 40, hunger: 37.5, sanity: 5, perishDays: 20, cookTimeSeconds: 20, priority: 5,
    rules: ['蛋度 > 0。', '肉度 > 0。', '蔬菜度 ≥ 0.5。'], forbidden: ['不可放树枝。'],
    conflicts: ['蛋度达到 3 时可能触发普通煎蛋；确保同时满足肉和蔬菜条件。'],
    example: [amount('monster-meat', '怪物肉', 1), amount('egg', '鸟蛋', 1), amount('carrot', '胡萝卜', 1), amount('berries', '浆果', 1)]
  }),
  dish({
    slug: 'meaty-stew', prefab: 'bonestew', title: '肉汤', english: 'Meaty Stew', aliases: ['肉汤', '炖肉'], stage: '前中期',
    summary: '一次恢复 150 饥饿，适合高饥饿上限角色或长途准备。',
    health: 12, hunger: 150, sanity: 5, perishDays: 10, cookTimeSeconds: 15, priority: 0,
    rules: ['肉度 ≥ 3。'], forbidden: ['不可放树枝。'],
    conflicts: ['肉度不足会变成肉丸或其他肉料理。'],
    example: [amount('meat', '大肉', 2), amount('monster-meat', '怪物肉', 1), amount('ice', '冰', 1)]
  }),
  dish({
    slug: 'bacon-and-eggs', prefab: 'baconeggs', title: '培根煎蛋', english: 'Bacon and Eggs', aliases: ['培根煎蛋', '培根鸡蛋'], stage: '前中期',
    summary: '高饱食、长保质期料理，适合远行和稳定鸟笼循环。',
    health: 20, hunger: 75, sanity: 5, perishDays: 20, cookTimeSeconds: 40, priority: 10,
    rules: ['蛋度 > 1。', '肉度 > 1。'], forbidden: ['不可放蔬菜。'],
    conflicts: ['蛋度或肉度不够会转成其他低优先级料理。'],
    example: [amount('monster-meat', '怪物肉', 1), amount('morsel', '小肉', 1), amount('egg', '鸟蛋', 2)]
  }),
  dish({
    slug: 'honey-ham', prefab: 'honeyham', title: '蜜汁火腿', english: 'Honey Ham', stage: '中期',
    summary: '恢复 30 生命和 75 饥饿，适合蜂蜜稳定后的综合补给。',
    health: 30, hunger: 75, sanity: 5, perishDays: 15, cookTimeSeconds: 40, priority: 2,
    rules: ['至少 1 个蜂蜜。', '肉度 > 1.5。'], forbidden: ['不可放树枝。'],
    conflicts: ['肉度 ≤ 1.5 会得到蜜汁卤肉。'],
    example: [amount('meat', '大肉', 2), amount('honey', '蜂蜜', 1), amount('berries', '浆果', 1)]
  }),
  dish({
    slug: 'honey-nuggets', prefab: 'honeynuggets', title: '蜜汁卤肉', english: 'Honey Nuggets', aliases: ['蜜汁卤肉', '蜜汁肉'], stage: '中期',
    summary: '低肉度蜂蜜料理，恢复 20 生命，适合小肉和怪物肉。',
    health: 20, hunger: 37.5, sanity: 5, perishDays: 15, cookTimeSeconds: 40, priority: 2,
    rules: ['至少 1 个蜂蜜。', '肉度 ≤ 1.5。'], forbidden: ['不可放树枝。'],
    conflicts: ['肉度超过 1.5 会变成蜜汁火腿。'],
    example: [amount('monster-meat', '怪物肉', 1), amount('honey', '蜂蜜', 1), amount('ice', '冰', 2)]
  }),
  dish({
    slug: 'fishsticks', title: '鱼排', english: 'Fishsticks', aliases: ['鱼排', '鱼条'], stage: '第一周',
    summary: '只需鱼和一根树枝即可恢复 40 生命，是池塘附近的高性价比治疗料理。',
    health: 40, hunger: 37.5, sanity: 5, perishDays: 10, cookTimeSeconds: 40, priority: 10,
    rules: ['鱼度 > 0。', '必须恰好 1 根树枝。', '不可食用度 ≤ 1。'],
    conflicts: ['树枝超过 1 根会失败；鱼度过高可能触发高优先级海鲜料理。'],
    example: [amount('freshwater-fish', '淡水鱼', 1), amount('twigs', '树枝', 1), amount('ice', '冰', 2)]
  }),
  dish({
    slug: 'froggle-bunwich', prefab: 'frogglebunwich', title: '蛙腿三明治', english: 'Froggle Bunwich', aliases: ['蛙腿三明治', '蛙腿汉堡'], stage: '第一周',
    summary: '用一份蛙腿和少量蔬菜稳定恢复 20 生命。',
    health: 20, hunger: 37.5, sanity: 5, perishDays: 15, cookTimeSeconds: 40, priority: 1,
    rules: ['至少 1 个蛙腿。', '蔬菜度 ≥ 0.5。'],
    conflicts: ['加入树枝可能转成烤肉串；怪物度达到 2 会变成怪物千层饼。'],
    example: [amount('frog-legs', '蛙腿', 1), amount('carrot', '胡萝卜', 1), amount('ice', '冰', 2)]
  }),
  dish({
    slug: 'dragonpie', title: '火龙果派', english: 'Dragonpie', aliases: ['火龙果派', '龙派'], stage: '农耕后',
    summary: '一颗火龙果即可锁定的高饱食回血料理。',
    health: 40, hunger: 75, sanity: 5, perishDays: 15, cookTimeSeconds: 40, priority: 1,
    rules: ['至少 1 个火龙果。'], forbidden: ['不可含肉度。'],
    conflicts: ['加入任何肉类都会破坏配方。'],
    example: [amount('dragon-fruit', '火龙果', 1), amount('twigs', '树枝', 3)]
  }),
  dish({
    slug: 'butter-muffin', prefab: 'butterflymuffin', title: '蝴蝶松饼', english: 'Butter Muffin', stage: '前期',
    summary: '蝴蝶翅膀配少量蔬菜即可恢复 20 生命。',
    health: 20, hunger: 37.5, sanity: 5, perishDays: 15, cookTimeSeconds: 40, priority: 1,
    rules: ['至少 1 个蝴蝶翅膀。', '蔬菜度 ≥ 0.5。'], forbidden: ['不可含肉度。'],
    conflicts: ['加入肉会使配方失效。'],
    example: [amount('butterfly-wings', '蝴蝶翅膀', 1), amount('carrot', '胡萝卜', 1), amount('twigs', '树枝', 2)]
  }),
  dish({
    slug: 'ratatouille', title: '蔬菜杂烩', english: 'Ratatouille', aliases: ['蔬菜杂烩', '炖菜'], stage: '第一周',
    summary: '低优先级蔬菜料理，能吃但通常不值得消耗高价值作物。',
    health: 3, hunger: 25, sanity: 5, perishDays: 15, cookTimeSeconds: 20, priority: 0,
    rules: ['蔬菜度 ≥ 0.5。'], forbidden: ['不可含肉度。', '不可放树枝。'],
    conflicts: ['满足其他蔬菜料理条件时会优先生成其他料理。'],
    example: [amount('carrot', '胡萝卜', 1), amount('ice', '冰', 3)]
  }),
  dish({
    slug: 'fist-full-of-jam', prefab: 'jammypreserves', title: '果酱', english: 'Fist Full of Jam', aliases: ['果酱', '一拳果酱'], stage: '第一周',
    summary: '低优先级水果料理，适合处理普通浆果但收益有限。',
    health: 3, hunger: 37.5, sanity: 5, perishDays: 15, cookTimeSeconds: 10, priority: 0,
    rules: ['水果度 > 0。'], forbidden: ['不可含肉度。', '不可含蔬菜度。', '不可放树枝。'],
    conflicts: ['水果度达到 3 可能变成果杂烩。'],
    example: [amount('berries', '浆果', 1), amount('ice', '冰', 3)]
  }),
  dish({
    slug: 'kabobs', title: '肉串', english: 'Kabobs', aliases: ['肉串', '烤肉串'], stage: '第一周',
    summary: '肉配一根树枝的基础料理，饱食收益普通。',
    health: 3, hunger: 37.5, sanity: 5, perishDays: 15, cookTimeSeconds: 40, priority: 5,
    rules: ['肉度 > 0。', '必须恰好 1 根树枝。', '怪物度 ≤ 1。'],
    conflicts: ['有鱼时可能变成鱼排；两块怪物肉会变成怪物千层饼。'],
    example: [amount('monster-meat', '怪物肉', 1), amount('twigs', '树枝', 1), amount('ice', '冰', 2)]
  }),
  dish({
    slug: 'monster-lasagna', prefab: 'monsterlasagna', title: '怪物千层饼', english: 'Monster Lasagna', aliases: ['怪物千层饼', '怪物料理'], stage: '随时',
    summary: '通常是需要避免的惩罚料理，会同时扣生命和理智。',
    health: -20, hunger: 37.5, sanity: -20, perishDays: 6, cookTimeSeconds: 10, priority: 10,
    rules: ['怪物度 ≥ 2。'], forbidden: ['不可放树枝。'],
    conflicts: ['对韦伯以外角色通常是失败结果；锅里最多放 1 块怪物肉更安全。'],
    example: [amount('monster-meat', '怪物肉', 2), amount('ice', '冰', 2)]
  }),
  dish({
    slug: 'taffy', title: '太妃糖', english: 'Taffy', aliases: ['太妃糖', '糖果'], stage: '蜂蜜稳定后',
    summary: '用蜂蜜换取 15 理智，会损失 3 生命。',
    health: -3, hunger: 25, sanity: 15, perishDays: 15, cookTimeSeconds: 40, priority: 10,
    rules: ['甜味度 ≥ 3。'], forbidden: ['不可含肉度。'],
    conflicts: ['蜂蜜不足会变成果酱或湿腻焦糊。'],
    example: [amount('honey', '蜂蜜', 3), amount('ice', '冰', 1)]
  }),
  dish({
    slug: 'trail-mix', prefab: 'trailmix', title: '什锦干果', english: 'Trail Mix', aliases: ['什锦干果', '果仁杂烩'], stage: '秋季',
    summary: '桦栗果和浆果组成的廉价 30 生命料理。',
    health: 30, hunger: 12.5, sanity: 5, perishDays: 15, cookTimeSeconds: 10, priority: 10,
    rules: ['至少 1 个烤桦栗果。', '至少 1 个种子度。', '至少 1 个浆果，水果度 ≥ 1。'],
    forbidden: ['不可含肉、蔬菜、蛋或乳制品。'],
    conflicts: ['桦栗果必须先烤熟；加入蔬菜会使配方失效。'],
    example: [amount('birchnut', '烤桦栗果', 2), amount('berries', '浆果', 2)]
  }),
  dish({
    slug: 'turkey-dinner', prefab: 'turkeydinner', title: '火鸡大餐', english: 'Turkey Dinner', stage: '中期',
    summary: '需要两只鸡腿的高饱食料理，适合处理火鸡和鸟类掉落。',
    health: 20, hunger: 75, sanity: 5, perishDays: 6, cookTimeSeconds: 60, priority: 10,
    rules: ['鸡腿 ×2。', '肉度 > 1。', '至少 0.5 蔬菜度或水果度。'],
    conflicts: ['缺少第二只鸡腿就不会成立。'],
    example: [amount('drumstick', '鸡腿', 2), amount('meat', '大肉', 1), amount('berries', '浆果', 1)]
  }),
  dish({
    slug: 'waffles', title: '华夫饼', english: 'Waffles', aliases: ['华夫饼', '格子饼'], stage: '中期',
    summary: '黄油、浆果和蛋组成的 60 生命料理，但黄油来源不稳定。',
    health: 60, hunger: 37.5, sanity: 5, perishDays: 6, cookTimeSeconds: 10, priority: 10,
    rules: ['黄油 ×1。', '浆果 ×1。', '蛋度 > 0。'],
    conflicts: ['黄油稀有，通常不要把它当日常稳定回血方案。'],
    example: [amount('butter', '黄油', 1), amount('berries', '浆果', 1), amount('egg', '鸟蛋', 1), amount('twigs', '树枝', 1)]
  }),
  dish({
    slug: 'powdercake', prefab: 'powcake', title: '粉末蛋糕', english: 'Powdercake', aliases: ['粉末蛋糕', '火药饼'], stage: '中期',
    summary: '几乎永久保存、不能正常充饥，主要用作诱饵。',
    health: -3, hunger: 0, sanity: 0, perishDays: null, cookTimeSeconds: 10, priority: 10,
    rules: ['玉米 ×1。', '蜂蜜 ×1。', '树枝 ×1 以上。'],
    conflicts: ['不要把它当食物；其价值在于长久诱饵。'],
    example: [amount('corn', '玉米', 1), amount('honey', '蜂蜜', 1), amount('twigs', '树枝', 2)]
  }),
  dish({
    slug: 'stuffed-eggplant', prefab: 'stuffedeggplant', title: '酿茄子', english: 'Stuffed Eggplant', stage: '农耕后',
    summary: '以茄子为核心的普通蔬菜料理，适合处理多余作物。',
    health: 3, hunger: 37.5, sanity: 5, perishDays: 15, cookTimeSeconds: 40, priority: 1,
    rules: ['茄子 ×1。', '蔬菜度 > 1。'],
    conflicts: ['混入肉类可能优先形成其他料理。'],
    example: [amount('eggplant', '茄子', 1), amount('potato', '土豆', 1), amount('onion', '洋葱', 1), amount('garlic', '大蒜', 1)]
  }),
  dish({
    slug: 'guacamole', title: '鳄梨酱', english: 'Guacamole', aliases: ['鳄梨酱', '鼹鼠酱'], stage: '探索期',
    summary: '鼹鼠配仙人掌肉的快速料理，恢复 20 生命。',
    health: 20, hunger: 37.5, sanity: 0, perishDays: 10, cookTimeSeconds: 10, priority: 10,
    rules: ['活鼹鼠 ×1。', '成熟石果或仙人掌肉 ×1。'], forbidden: ['不可含水果度。'],
    conflicts: ['鼹鼠必须以物品形式放入锅中。'],
    example: [amount('moleworm', '鼹鼠', 1), amount('cactus-flesh', '仙人掌肉', 1), amount('ice', '冰', 2)]
  }),
  dish({
    slug: 'spicy-chili', prefab: 'hotchili', title: '辣椒炖肉', english: 'Spicy Chili', aliases: ['辣椒炖肉', '辣椒'], stage: '农耕后',
    summary: '肉度和蔬菜度各 1.5 的保暖料理。',
    health: 20, hunger: 37.5, sanity: 0, perishDays: 10, cookTimeSeconds: 10, priority: 10,
    rules: ['肉度 ≥ 1.5。', '蔬菜度 ≥ 1.5。'],
    conflicts: ['比例不够会转成肉丸或蔬菜杂烩。'],
    example: [amount('meat', '大肉', 2), amount('tomato', '番茄', 1), amount('pepper', '辣椒', 1)]
  }),
  dish({
    slug: 'flower-salad', prefab: 'flowersalad', title: '花沙拉', english: 'Flower Salad', stage: '夏季',
    summary: '夏季仙人掌花料理，恢复 40 生命但材料受季节限制。',
    health: 40, hunger: 12.5, sanity: 5, perishDays: 6, cookTimeSeconds: 10, priority: 10,
    rules: ['仙人掌花 ×1。', '蔬菜度 ≥ 2。'],
    forbidden: ['不可含肉、树枝、蛋、甜味或水果度。'],
    conflicts: ['仙人掌花只在夏季获得，避免用高价值作物做填充。'],
    example: [amount('cactus-flower', '仙人掌花', 1), amount('carrot', '胡萝卜', 2), amount('ice', '冰', 1)]
  }),
  dish({
    slug: 'ice-cream', prefab: 'icecream', title: '冰淇淋', english: 'Ice Cream', stage: '中后期',
    summary: '高理智恢复和短时降温料理，需要稀有乳制品。',
    health: 0, hunger: 25, sanity: 50, perishDays: 3, cookTimeSeconds: 10, priority: 10,
    rules: ['冰度 > 0。', '乳制品度 > 0。', '甜味度 > 0。'],
    forbidden: ['不可含肉、蔬菜、树枝或蛋。'],
    conflicts: ['黄油不等于乳制品；通常使用电羊奶。'],
    example: [amount('electric-milk', '电羊奶', 1), amount('honey', '蜂蜜', 1), amount('ice', '冰', 2)]
  }),
  dish({
    slug: 'surf-n-turf', prefab: 'surfnturf', title: '海鲜牛排', english: "Surf 'n' Turf", aliases: ['海鲜牛排', '海陆大餐'], stage: '洞穴/航海后',
    summary: '恢复 60 生命和 33 理智的高价值肉鱼料理。',
    health: 60, hunger: 37.5, sanity: 33, perishDays: 10, cookTimeSeconds: 20, priority: 30,
    rules: ['肉度 ≥ 2.5。', '鱼度 ≥ 1.5。'], forbidden: ['不可含冰度。'],
    conflicts: ['鱼度或肉度不足会变成海鲜浓汤、鱼排或肉丸。'],
    example: [amount('monster-meat', '怪物肉', 2), amount('freshwater-fish', '淡水鱼', 2)]
  }),
  dish({
    slug: 'creamy-potato-puree', prefab: 'mashedpotatoes', title: '奶油土豆泥', english: 'Creamy Potato Purée', aliases: ['奶油土豆泥', '土豆泥'], stage: '农耕后',
    summary: '恢复 33 理智的农作物料理，适合土豆和大蒜稳定后制作。',
    health: 20, hunger: 37.5, sanity: 33, perishDays: 15, cookTimeSeconds: 20, priority: 20,
    rules: ['土豆 ×2。', '大蒜 ×1。'], forbidden: ['不可含肉或树枝。'],
    conflicts: ['加入肉会使配方失效。'],
    example: [amount('potato', '土豆', 2), amount('garlic', '大蒜', 1), amount('ice', '冰', 1)]
  }),
  dish({
    slug: 'salsa-fresca', prefab: 'salsa', title: '莎莎酱', english: 'Salsa Fresca', aliases: ['莎莎酱', '番茄酱'], stage: '农耕后',
    summary: '番茄和洋葱组成的 33 理智料理。',
    health: 3, hunger: 25, sanity: 33, perishDays: 15, cookTimeSeconds: 10, priority: 20,
    rules: ['番茄 ×1。', '洋葱 ×1。'], forbidden: ['不可含肉、树枝或蛋。'],
    conflicts: ['加入肉会转成其他肉料理。'],
    example: [amount('tomato', '番茄', 1), amount('onion', '洋葱', 1), amount('ice', '冰', 2)]
  }),
  dish({
    slug: 'vegetable-stinger', prefab: 'vegstinger', title: '蔬菜鸡尾酒', english: 'Vegetable Stinger', aliases: ['蔬菜鸡尾酒', '蔬菜饮料'], stage: '农耕后',
    summary: '番茄或芦笋配大量蔬菜和冰制成的 33 理智料理。',
    health: 3, hunger: 25, sanity: 33, perishDays: 15, cookTimeSeconds: 10, priority: 15,
    rules: ['番茄或芦笋 ×1。', '蔬菜度 > 2。', '冰度 > 0。'],
    forbidden: ['不可含肉、树枝或蛋。'],
    conflicts: ['蔬菜度不足会变成莎莎酱或蔬菜杂烩。'],
    example: [amount('tomato', '番茄', 1), amount('carrot', '胡萝卜', 2), amount('ice', '冰', 1)]
  }),
  dish({
    slug: 'seafood-gumbo', prefab: 'seafoodgumbo', title: '海鲜浓汤', english: 'Seafood Gumbo', aliases: ['海鲜浓汤', '海鲜汤'], stage: '航海/钓鱼后',
    summary: '高鱼度料理，恢复 40 生命和 20 理智。',
    health: 40, hunger: 37.5, sanity: 20, perishDays: 10, cookTimeSeconds: 20, priority: 10,
    rules: ['鱼度 > 2。'],
    conflicts: ['同时满足高优先级海鲜料理时会生成其他结果。'],
    example: [amount('freshwater-fish', '淡水鱼', 3), amount('ice', '冰', 1)]
  }),
  dish({
    slug: 'jellybeans', prefab: 'jellybean', title: '彩虹糖豆', english: 'Jellybeans', aliases: ['彩虹糖豆', '糖豆'], stage: '蜂后后',
    summary: '食用后持续恢复生命的 Boss 战补给，一锅产出三颗。',
    health: 2, hunger: 0, sanity: 5, perishDays: null, cookTimeSeconds: 50, priority: 12,
    rules: ['蜂王浆 ×1。'], forbidden: ['不可放树枝或怪物度食材。'],
    conflicts: ['蜂王浆稀有，确认配方无误再开锅。'],
    example: [amount('royal-jelly', '蜂王浆', 1), amount('ice', '冰', 3)],
    note: '一锅产出 3 颗；每颗还会提供持续生命恢复。'
  })
]
