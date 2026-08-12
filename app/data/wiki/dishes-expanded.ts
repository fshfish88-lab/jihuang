import type { DishInfo, IngredientAmount, WikiEntry } from '~/types/wiki'
import { acquire, amount, createEntry, EXPANSION_VERIFIED_AT, noCraft } from './shared'

interface ExpandedDishSeed {
  slug: string
  prefab: string
  title: string
  english: string
  aliases: string[]
  stage: string
  summary: string
  health: number
  hunger: number
  sanity: number
  perishDays: number
  cookTimeSeconds: number
  priority: number
  rules: string[]
  forbidden: string[]
  conflicts: string[]
  example: IngredientAmount[]
  note: string
  warlyExclusive?: boolean
}

function dish(seed: ExpandedDishSeed): WikiEntry {
  const dishInfo: DishInfo = {
    health: seed.health,
    hunger: seed.hunger,
    sanity: seed.sanity,
    perishDays: seed.perishDays,
    cookTimeSeconds: seed.cookTimeSeconds,
    priority: seed.priority,
    rules: seed.rules,
    forbidden: seed.forbidden,
    conflicts: seed.conflicts,
    examples: [{
      label: seed.warlyExclusive ? '沃利便携烹饪锅四格配方' : '推荐四格配方',
      ingredients: seed.example,
      note: seed.note
    }]
  }

  const cooker = seed.warlyExclusive ? '沃利的便携烹饪锅' : '烹饪锅'
  return createEntry({
    slug: seed.slug,
    prefab: seed.prefab,
    title: seed.title,
    english: seed.english,
    aliases: seed.aliases,
    category: '料理',
    tags: ['料理', seed.warlyExclusive ? '沃利专属' : seed.health >= 40 ? '回血' : seed.sanity >= 30 ? '回理智' : '日常'],
    stage: seed.stage,
    summary: seed.summary,
    facts: [
      { label: '生命', value: `${seed.health >= 0 ? '+' : ''}${seed.health}` },
      { label: '饥饿', value: `+${seed.hunger}` },
      { label: '理智', value: `${seed.sanity >= 0 ? '+' : ''}${seed.sanity}` },
      { label: '保质期', value: `${seed.perishDays} 天` },
      { label: '烹饪限制', value: seed.warlyExclusive ? '仅沃利可用便携烹饪锅制作' : '所有幸存者可制作' }
    ],
    crafting: noCraft(`不是制作栏物品；必须使用${cooker}烹饪。`),
    acquisition: [acquire('烹饪', `使用${cooker}`, '逐格放入示例中的四份食材。', '检查禁用食材与高优先级冲突料理。', '开始烹饪并等待完成。')],
    uses: [seed.summary],
    tips: [seed.warlyExclusive ? '必须由沃利用便携烹饪锅制作，普通烹饪锅不会产出这道料理。' : '先按示例配方制作，再根据食材度替换同类填充物。'],
    mistakes: seed.conflicts,
    related: ['crock-pot'],
    dish: dishInfo,
    contentVerifiedAt: EXPANSION_VERIFIED_AT
  })
}

export const expandedDishEntries: WikiEntry[] = [
  dish({
    slug: 'mandrake-soup', prefab: 'mandrakesoup', title: '曼德拉草汤', english: 'Mandrake Soup',
    aliases: ['曼德拉草汤', '曼德拉汤', 'Mandrake Soup'], stage: '探索期',
    summary: '把稀有曼德拉草转成 100 生命与 150 饥饿的高额一次性补给。',
    health: 100, hunger: 150, sanity: 5, perishDays: 6, cookTimeSeconds: 60, priority: 10,
    rules: ['至少放入 1 个生曼德拉草；熟曼德拉草不满足该预制体条件。'],
    forbidden: ['无额外食材度禁用条件，但示例避免放入会触发更高优先级料理的稀有食材。'],
    conflicts: ['曼德拉草极其稀有，误把熟曼德拉草当核心食材会无法得到本料理。'],
    example: [amount('mandrake', '曼德拉草', 1), amount('ice', '冰', 3)],
    note: '冰只作安全填充；曼德拉草数量有限，确认确实需要高额即时恢复再下锅。'
  }),
  dish({
    slug: 'pumpkin-cookies', prefab: 'pumpkincookie', title: '南瓜饼干', english: 'Pumpkin Cookies',
    aliases: ['南瓜饼干', '南瓜曲奇', 'Pumpkin Cookies'], stage: '农耕后',
    summary: '用南瓜与两点甜味度制作的 15 理智甜点，适合处理稳定南瓜收成。',
    health: 0, hunger: 37.5, sanity: 15, perishDays: 10, cookTimeSeconds: 40, priority: 10,
    rules: ['至少 1 个南瓜或烤南瓜。', '甜味度 ≥ 2。'],
    forbidden: ['配方脚本没有肉类禁用条件，但加入高优先级食材可能改出其他料理。'],
    conflicts: ['只有 1 份蜂蜜时甜味度不足；蜂蜜达到 3 又可能更适合直接制作太妃糖。'],
    example: [amount('pumpkin', '南瓜', 1), amount('honey', '蜂蜜', 2), amount('berries', '浆果', 1)],
    note: '两份蜂蜜恰好提供 2 点甜味度。'
  }),
  dish({
    slug: 'fruit-medley', prefab: 'fruitmedley', title: '水果圣代', english: 'Fruit Medley',
    aliases: ['水果圣代', '水果拼盘', '果杂烩', 'Fruit Medley'], stage: '农耕后',
    summary: '用三点水果度制作的降温甜品，恢复 20 生命但饱食收益一般。',
    health: 20, hunger: 25, sanity: 5, perishDays: 6, cookTimeSeconds: 10, priority: 0,
    rules: ['水果度 ≥ 3。'], forbidden: ['不可含肉度。', '不可含蔬菜度。'],
    conflicts: ['冰等可食用填充会让配方与同为优先级 0 的果酱冲突；火龙果则会优先触发火龙果派。'],
    example: [amount('watermelon', '西瓜', 3), amount('twigs', '树枝', 1)],
    note: '三颗西瓜提供 3 点水果度；树枝带不可食用度，可排除不接受树枝的果酱。'
  }),
  dish({
    slug: 'fish-tacos', prefab: 'fishtacos', title: '鱼肉玉米卷', english: 'Fish Tacos',
    aliases: ['鱼肉玉米卷', '鱼肉塔可', 'Fish Tacos'], stage: '农耕/钓鱼后',
    summary: '鱼与玉米组成的 20 生命基础鱼料理，适合玉米和池塘鱼都有余量时制作。',
    health: 20, hunger: 37.5, sanity: 5, perishDays: 6, cookTimeSeconds: 10, priority: 10,
    rules: ['鱼度 > 0。', '至少 1 个玉米、烤玉米或玉米鳕鱼。'],
    forbidden: ['没有固定禁用食材，但示例不放树枝，以免同时满足鱼排。'],
    conflicts: ['加入树枝会同时满足鱼排且两者优先级相同，结果不再稳定。'],
    example: [amount('freshwater-fish', '淡水鱼', 1), amount('corn', '玉米', 1), amount('ice', '冰', 2)],
    note: '不用树枝，避免与鱼排同优先级冲突。'
  }),
  dish({
    slug: 'unagi', prefab: 'unagi', title: '鳗鱼寿司', english: 'Unagi',
    aliases: ['鳗鱼寿司', '鳗鱼料理', 'Unagi'], stage: '洞穴探索',
    summary: '把鳗鱼与苔藓或海带组合成 20 生命的小份洞穴料理。',
    health: 20, hunger: 18.75, sanity: 5, perishDays: 10, cookTimeSeconds: 10, priority: 20,
    rules: ['至少 1 条鳗鱼或烤鳗鱼。', '至少 1 份苔藓、海带叶、烤海带叶或干海带叶。'],
    forbidden: ['无额外食材度禁用条件。'],
    conflicts: ['海带恰好达到 2 且总鱼度达到 1 时也满足加州卷；两者优先级相同，避免放第二份海带。'],
    example: [amount('eel', '鳗鱼', 1), amount('kelp-fronds', '海带叶', 1), amount('ice', '冰', 2)],
    note: '只放一份海带，避开加州卷的“恰好两份海带”条件。'
  }),
  dish({
    slug: 'banana-pop', prefab: 'bananapop', title: '香蕉冰棒', english: 'Banana Pop',
    aliases: ['香蕉冰棒', '香蕉冻', 'Banana Pop'], stage: '洞穴探索',
    summary: '香蕉、冰和树枝锁定的 33 理智降温甜点，适合夏季洞穴补给。',
    health: 20, hunger: 12.5, sanity: 33, perishDays: 3, cookTimeSeconds: 10, priority: 20,
    rules: ['至少 1 个香蕉或烤香蕉。', '冰度 > 0。', '至少 1 根树枝。'],
    forbidden: ['不可含肉度。', '不可含鱼度。'],
    conflicts: ['漏放树枝会得到优先级较低的冰香蕉鸡尾酒；成品仅保质 3 天。'],
    example: [amount('banana', '香蕉', 1), amount('ice', '冰', 2), amount('twigs', '树枝', 1)],
    note: '当前食谱卡示例：香蕉 1、冰 2、树枝 1。'
  }),
  dish({
    slug: 'asparagus-soup', prefab: 'asparagussoup', title: '芦笋汤', english: 'Asparagus Soup',
    aliases: ['芦笋汤', 'Asparagus Soup'], stage: '农耕后',
    summary: '以芦笋和大于 2 点蔬菜度换取 20 生命的小份蔬菜汤。',
    health: 20, hunger: 18.75, sanity: 5, perishDays: 15, cookTimeSeconds: 10, priority: 10,
    rules: ['至少 1 个芦笋或烤芦笋。', '总蔬菜度 > 2。'],
    forbidden: ['不可含肉度。', '不可含不可食用度。'],
    conflicts: ['总蔬菜度只有 2 时不会成立；加冰会让符合条件的组合转向更高优先级蔬菜鸡尾酒。'],
    example: [amount('asparagus', '芦笋', 2), amount('potato', '土豆', 1), amount('onion', '洋葱', 1)],
    note: '四份作物合计 4 点蔬菜度，不放冰。'
  }),
  dish({
    slug: 'stuffed-pepper-poppers', prefab: 'pepperpopper', title: '酿辣椒', english: 'Stuffed Pepper Poppers',
    aliases: ['酿辣椒', '辣椒爆米花', 'Stuffed Pepper Poppers', 'Pepper Poppers'], stage: '农耕后',
    summary: '辣椒配低肉度食材制成的保暖料理，恢复 30 生命但损失 5 理智。',
    health: 30, hunger: 25, sanity: -5, perishDays: 15, cookTimeSeconds: 40, priority: 20,
    rules: ['至少 1 个辣椒或烤辣椒。', '肉度 > 0 且 ≤ 1.5。'],
    forbidden: ['不可含不可食用度。'],
    conflicts: ['肉度超过 1.5 不会得到酿辣椒；树枝会带来不可食用度而直接破坏配方。'],
    example: [amount('pepper', '辣椒', 1), amount('morsel', '小肉', 2), amount('potato', '土豆', 1)],
    note: '两份小肉合计 1 点肉度，处于允许范围。'
  }),
  dish({
    slug: 'potato-souffle', prefab: 'potatosouffle', title: '蓬松土豆蛋奶酥', english: 'Puffed Potato Soufflé',
    aliases: ['蓬松土豆蛋奶酥', '土豆舒芙蕾', '土豆蛋奶酥', 'Puffed Potato Soufflé'], stage: '沃利农耕后',
    summary: '沃利专属的土豆蛋料理，以两颗土豆换取 20 生命、37.5 饥饿和 15 理智。',
    health: 20, hunger: 37.5, sanity: 15, perishDays: 10, cookTimeSeconds: 40, priority: 30,
    rules: ['必须由沃利用便携烹饪锅制作。', '土豆或烤土豆合计至少 2 个。', '蛋度 > 0。'],
    forbidden: ['不可含肉度。', '不可含不可食用度。'],
    conflicts: ['普通烹饪锅不能产出；加入肉会让专属条件失效。'],
    example: [amount('potato', '土豆', 2), amount('egg', '鸟蛋', 1), amount('ice', '冰', 1)],
    note: '仅沃利便携烹饪锅；冰是不会引入禁用食材度的填充。', warlyExclusive: true
  }),
  dish({
    slug: 'volt-goat-chaud-froid', prefab: 'voltgoatjelly', title: '伏特羊肉冻', english: 'Volt Goat Chaud-Froid',
    aliases: ['伏特羊肉冻', '电羊果冻', 'Volt Goat Chaud-Froid', 'Volt Goat Jelly'], stage: '沃利沙漠探索后',
    summary: '沃利专属战斗料理，食用后让攻击在约 5 分钟内附带电击效果。',
    health: 3, hunger: 37.5, sanity: 10, perishDays: 10, cookTimeSeconds: 40, priority: 30,
    rules: ['必须由沃利用便携烹饪锅制作。', '至少 1 个伏特羊角。', '甜味度 ≥ 2。'],
    forbidden: ['不可含肉度。'],
    conflicts: ['普通烹饪锅只会得到其他料理或湿腻焦糊；把羊角误当电羊奶不能满足条件。'],
    example: [amount('volt-goat-horn', '伏特羊角', 1), amount('honey', '蜂蜜', 2), amount('ice', '冰', 1)],
    note: '仅沃利便携烹饪锅；两份蜂蜜提供恰好 2 点甜味度。', warlyExclusive: true
  }),
  dish({
    slug: 'lobster-dinner', prefab: 'lobsterdinner', title: '龙虾正餐', english: 'Lobster Dinner',
    aliases: ['龙虾正餐', '龙虾大餐', 'Lobster Dinner', 'Wobster Dinner'], stage: '航海后',
    summary: '活龙虾与黄油组成的高价值料理，同时恢复 60 生命和 50 理智。',
    health: 60, hunger: 37.5, sanity: 50, perishDays: 15, cookTimeSeconds: 20, priority: 25,
    rules: ['至少 1 只可入锅的活龙虾。', '至少 1 份黄油。', '总肉度 ≥ 1 且鱼度 ≥ 1；活龙虾本身可满足。'],
    forbidden: ['不可含冰度。'],
    conflicts: ['放入冰会优先得到龙虾汤；黄油稀有，确认不是把电羊奶误当黄油。'],
    example: [amount('wobster', '龙虾', 1), amount('butter', '黄油', 1), amount('berries', '浆果', 2)],
    note: '活龙虾提供所需鱼度和肉度；浆果不引入冰度。'
  }),
  dish({
    slug: 'lobster-bisque', prefab: 'lobsterbisque', title: '龙虾汤', english: 'Lobster Bisque',
    aliases: ['龙虾汤', '龙虾浓汤', 'Lobster Bisque', 'Wobster Bisque'], stage: '航海后',
    summary: '一只活龙虾配冰即可锁定的 60 生命料理，填充物选择宽松。',
    health: 60, hunger: 25, sanity: 10, perishDays: 10, cookTimeSeconds: 10, priority: 30,
    rules: ['至少 1 只可入锅的活龙虾。', '冰度 > 0。'],
    forbidden: ['没有其他固定禁用食材，但示例不放黄油，避免误解为龙虾正餐。'],
    conflicts: ['漏放冰不会成立；活龙虾、黄油且无冰时会得到龙虾正餐。'],
    example: [amount('wobster', '龙虾', 1), amount('ice', '冰', 1), amount('berries', '浆果', 2)],
    note: '一份冰已满足条件；两份浆果作普通填充。'
  }),
  dish({
    slug: 'california-roll', prefab: 'californiaroll', title: '加州卷', english: 'California Roll',
    aliases: ['加州卷', '海带寿司', 'California Roll'], stage: '航海后',
    summary: '恰好两份海带搭配鱼度的稳定航海料理，恢复 20 生命与 10 理智。',
    health: 20, hunger: 37.5, sanity: 10, perishDays: 10, cookTimeSeconds: 10, priority: 20,
    rules: ['生、熟或干海带叶合计必须恰好 2 份。', '鱼度 ≥ 1。'],
    forbidden: ['不能放第 3 份海带；数量不是“至少 2”，而是“恰好 2”。'],
    conflicts: ['用活龙虾作鱼度并加入冰会变成龙虾汤；鳗鱼加一份海带又可能与鳗鱼寿司冲突。'],
    example: [amount('kelp-fronds', '海带叶', 2), amount('freshwater-fish', '淡水鱼', 2)],
    note: '当前食谱卡的稳定四格组合：海带 2、淡水鱼 2。'
  }),
  dish({
    slug: 'barnacle-linguine', prefab: 'barnaclinguine', title: '藤壶意面', english: 'Barnacle Linguine',
    aliases: ['藤壶意面', '藤壶扁面', 'Barnacle Linguine'], stage: '航海后',
    summary: '两份藤壶与两点蔬菜度换取 75 饥饿和 20 理智的航海主食。',
    health: 30, hunger: 75, sanity: 20, perishDays: 6, cookTimeSeconds: 40, priority: 30,
    rules: ['生藤壶和熟藤壶合计至少 2 份。', '蔬菜度 ≥ 2。'],
    forbidden: ['四格锅中两份藤壶已占两格，因此剩余两格都必须提供足够蔬菜度。'],
    conflicts: ['用只有 0.5 蔬菜度的蘑菇填充会导致总蔬菜度不足，可能变成其他藤壶料理。'],
    example: [amount('barnacles', '藤壶', 2), amount('asparagus', '芦笋', 2)],
    note: '两份芦笋提供恰好 2 点蔬菜度。'
  }),
  dish({
    slug: 'stuffed-fish-heads', prefab: 'barnaclestuffedfishhead', title: '酿鱼头', english: 'Stuffed Fish Heads',
    aliases: ['酿鱼头', '填馅鱼头', 'Stuffed Fish Heads'], stage: '航海后',
    summary: '藤壶与至少 1.25 鱼度组成的 75 饥饿料理，保质期只有 3 天。',
    health: 20, hunger: 75, sanity: 0, perishDays: 3, cookTimeSeconds: 40, priority: 26,
    rules: ['至少 1 份生藤壶或熟藤壶。', '总鱼度 ≥ 1.25。'],
    forbidden: ['没有固定食材度禁用条件，但成品极易腐坏，不适合提前大量制作。'],
    conflicts: ['只放藤壶和蔬菜会变成低优先级藤壶皮塔饼；鱼度不足 1.25 时不会成立。'],
    example: [amount('barnacles', '藤壶', 1), amount('freshwater-fish', '淡水鱼', 2), amount('potato', '土豆', 1)],
    note: '沿用当前食谱卡思路：藤壶 1、两份鱼、蔬菜填充 1。'
  }),
  dish({
    slug: 'barnacle-nigiri', prefab: 'barnaclesushi', title: '藤壶握寿司', english: 'Barnacle Nigiri',
    aliases: ['藤壶握寿司', '藤壶寿司', 'Barnacle Nigiri'], stage: '航海/鸟笼后',
    summary: '藤壶、海带和蛋组成的稳定 40 生命航海料理。',
    health: 40, hunger: 37.5, sanity: 15, perishDays: 10, cookTimeSeconds: 10, priority: 30,
    rules: ['至少 1 份生藤壶或熟藤壶。', '至少 1 份生海带叶或烤海带叶。', '蛋度 ≥ 1。'],
    forbidden: ['干海带不满足本料理的海带预制体条件。'],
    conflicts: ['漏放蛋会转成其他藤壶料理；使用干海带看似同类但不会满足条件。'],
    example: [amount('barnacles', '藤壶', 1), amount('kelp-fronds', '海带叶', 2), amount('egg', '鸟蛋', 1)],
    note: '当前食谱卡的四格组合；使用生海带叶。'
  }),
  dish({
    slug: 'leafy-meatloaf', prefab: 'leafloaf', title: '叶肉糕', english: 'Leafy Meatloaf',
    aliases: ['叶肉糕', '叶肉卷', 'Leafy Meatloaf'], stage: '食人花稳定后',
    summary: '两份叶肉即可锁定的长保质期料理，数值普通但适合回收多余叶肉。',
    health: 8, hunger: 37.5, sanity: 5, perishDays: 20, cookTimeSeconds: 40, priority: 25,
    rules: ['生叶肉和熟叶肉合计至少 2 份。'],
    forbidden: ['无额外禁用食材；但高价值填充物通常不值得投入这道普通料理。'],
    conflicts: ['叶肉不足 2 份时不会成立；加入两点甜味度会被更高优先级果冻沙拉截走。'],
    example: [amount('leafy-meat', '叶肉', 2), amount('ice', '冰', 2)],
    note: '两份冰只作廉价填充，保留叶肉糕的低成本定位。'
  }),
  dish({
    slug: 'beefy-greens', prefab: 'meatysalad', title: '牛肉绿叶菜', english: 'Beefy Greens',
    aliases: ['牛肉绿叶菜', '肉味沙拉', 'Beefy Greens'], stage: '食人花/农耕后',
    summary: '一份叶肉配三点蔬菜度，换取 40 生命和 75 饥饿的综合主食。',
    health: 40, hunger: 75, sanity: 5, perishDays: 6, cookTimeSeconds: 40, priority: 25,
    rules: ['至少 1 份生叶肉或熟叶肉。', '蔬菜度 ≥ 3。'],
    forbidden: ['剩余三格必须凑够 3 点蔬菜度，0.5 蔬菜度食材无法单独完成。'],
    conflicts: ['使用蘑菇等低蔬菜度填充会达不到 3 点，容易变成其他叶肉料理。'],
    example: [amount('leafy-meat', '叶肉', 1), amount('tomato', '番茄', 2), amount('carrot', '胡萝卜', 1)],
    note: '当前食谱卡组合，三份作物合计 3 点蔬菜度。'
  }),
  dish({
    slug: 'jelly-salad', prefab: 'leafymeatsouffle', title: '果冻沙拉', english: 'Jelly Salad',
    aliases: ['果冻沙拉', '叶肉果冻', 'Jelly Salad'], stage: '食人花/养蜂后',
    summary: '两份叶肉和两点甜味度制成的 50 理智料理，适合团队战前恢复。',
    health: 0, hunger: 37.5, sanity: 50, perishDays: 6, cookTimeSeconds: 40, priority: 50,
    rules: ['生叶肉和熟叶肉合计至少 2 份。', '甜味度 ≥ 2。'],
    forbidden: ['四格配方已被两份叶肉和两点甜味度占满，不能再用额外填充替代核心食材。'],
    conflicts: ['只有一份蜂蜜时甜味度不足，会得到叶肉糕等其他料理。'],
    example: [amount('leafy-meat', '叶肉', 2), amount('honey', '蜂蜜', 2)],
    note: '四格完全固定：叶肉 2、蜂蜜 2。'
  }),
  dish({
    slug: 'frozen-banana-daiquiri', prefab: 'frozenbananadaiquiri', title: '冰香蕉鸡尾酒', english: 'Frozen Banana Daiquiri',
    aliases: ['冰香蕉鸡尾酒', '冰香蕉冻唇蜜', 'Frozen Banana Daiquiri'], stage: '洞穴/冬季后',
    summary: '香蕉配至少一点冰度的长效降温料理，恢复 30 生命与 15 理智。',
    health: 30, hunger: 18.75, sanity: 15, perishDays: 15, cookTimeSeconds: 20, priority: 2,
    rules: ['至少 1 个香蕉或烤香蕉。', '冰度 ≥ 1。'],
    forbidden: ['不可含肉度。', '不可含鱼度。'],
    conflicts: ['加入树枝会满足优先级 20 的香蕉冰棒并覆盖本料理；香蕉达到 2 又可能触发香蕉奶昔。'],
    example: [amount('banana', '香蕉', 1), amount('ice', '冰', 1), amount('berries', '浆果', 2)],
    note: '不放树枝，确保不被更高优先级香蕉冰棒覆盖。'
  })
]
