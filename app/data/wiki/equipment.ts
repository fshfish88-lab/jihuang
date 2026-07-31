import type { WikiEntry } from '~/types/wiki'
import { acquire, amount, craft, noCraft, simpleEntry } from './shared'

export const equipmentEntries: WikiEntry[] = [
  simpleEntry({
    slug: 'axe', title: '斧头', english: 'Axe', category: '工具', stage: '第 1 天',
    summary: '开局砍树的基础工具，耐久不足时提前留出下一把的材料。',
    crafting: craft([amount('twigs', '树枝', 1), amount('flint', '燧石', 1)], '徒手制作', '工具'),
    acquisition: [acquire('制作', '徒手制作斧头', '收集 1 个树枝和 1 个燧石。', '打开“工具”分类制作 1 把斧头。')],
    facts: [{ label: '耐久', value: '100 次砍击' }], uses: ['砍树取得木头。']
  }),
  simpleEntry({
    slug: 'pickaxe', title: '镐', english: 'Pickaxe', aliases: ['镐', '镐子', 'Pickaxe'], category: '工具', stage: '第 1 天',
    summary: '采矿的基础工具，矿区远行至少准备一把并留备用燧石。',
    crafting: craft([amount('twigs', '树枝', 2), amount('flint', '燧石', 2)], '徒手制作', '工具'),
    acquisition: [acquire('制作', '徒手制作镐', '收集 2 个树枝和 2 个燧石。', '打开“工具”分类制作 1 把镐。')],
    facts: [{ label: '耐久', value: '33 次开采' }], uses: ['开采岩石、矿脉和月岛资源。']
  }),
  simpleEntry({
    slug: 'shovel', title: '铲子', english: 'Shovel', category: '工具', stage: '第一周',
    summary: '用于移植资源和挖掘树桩；先建立科技原型，再外出整理资源点。',
    crafting: craft([amount('twigs', '树枝', 2), amount('flint', '燧石', 2)], '科学机器及以上科技', '工具'),
    acquisition: [acquire('制作', '在科学机器旁制作', '准备 2 个树枝和 2 个燧石。', '靠近科学机器，在“工具”分类制作。')],
    facts: [{ label: '耐久', value: '25 次挖掘' }], uses: ['移植草、树苗和浆果丛；挖树桩。']
  }),
  simpleEntry({
    slug: 'hammer', title: '锤子', english: 'Hammer', category: '工具', stage: '第一周',
    summary: '拆除建筑并返还部分材料；敲之前确认目标，避免误拆核心设施。',
    crafting: craft([amount('twigs', '树枝', 3), amount('rocks', '石头', 3), amount('cut-grass', '草', 6)], '科学机器及以上科技', '工具'),
    acquisition: [acquire('制作', '在科学机器旁制作', '准备 3 个树枝、3 个石头和 6 个草。', '靠近科学机器制作 1 把锤子。')],
    facts: [{ label: '耐久', value: '75 次敲击' }], uses: ['拆建筑、猪屋、兔屋和世界资源。']
  }),
  simpleEntry({
    slug: 'torch', title: '火把', english: 'Torch', category: '工具', stage: '第 1 天',
    summary: '最便宜的移动光源；随身留材料比提前做很多支更节省耐久。',
    crafting: craft([amount('cut-grass', '草', 2), amount('twigs', '树枝', 2)], '徒手制作', '照明'),
    acquisition: [acquire('制作', '徒手制作火把', '收集 2 个草和 2 个树枝。', '在“照明”分类制作 1 支火把。')],
    facts: [{ label: '燃烧时间', value: '75 秒' }], uses: ['移动照明、点燃树木和紧急避开查理。']
  }),
  simpleEntry({
    slug: 'spear', title: '长矛', english: 'Spear', category: '装备', stage: '第一周',
    summary: '前期通用武器；伤害不高，但材料稳定且能处理大多数小型威胁。',
    crafting: craft([amount('twigs', '树枝', 2), amount('rope', '绳子', 1), amount('flint', '燧石', 1)], '科学机器及以上科技', '武器'),
    acquisition: [acquire('制作', '制作长矛', '先用 3 个草精炼 1 根绳子。', '准备 2 个树枝、1 根绳子和 1 个燧石，在科学机器旁制作。')],
    facts: [{ label: '伤害', value: '34' }, { label: '耐久', value: '150 次攻击' }], uses: ['前期战斗和应急防身。']
  }),
  simpleEntry({
    slug: 'log-suit', prefab: 'armorwood', title: '木甲', english: 'Log Suit', category: '装备', stage: '第一周',
    summary: '材料直接的身体护甲，正式战斗前至少准备一件。',
    crafting: craft([amount('log', '木头', 8), amount('rope', '绳子', 2)], '科学机器及以上科技', '护甲'),
    acquisition: [acquire('制作', '制作木甲', '准备 8 个木头和 2 根绳子。', '在科学机器旁的“护甲”分类制作。')],
    facts: [{ label: '减伤', value: '80%' }, { label: '耐久', value: '450' }], uses: ['猎犬、蜘蛛和多数前期战斗。']
  }),
  simpleEntry({
    slug: 'football-helmet', prefab: 'footballhat', title: '橄榄球头盔', english: 'Football Helmet', aliases: ['猪皮帽', '橄榄球头盔'], category: '装备', stage: '前中期',
    summary: '占用头栏的高性价比护甲，能保留背包栏，是常备战斗装备。',
    crafting: craft([amount('pig-skin', '猪皮', 1), amount('rope', '绳子', 1)], '炼金引擎', '护甲'),
    acquisition: [acquire('制作', '在炼金引擎旁制作', '准备 1 块猪皮和 1 根绳子。', '靠近炼金引擎，在“护甲”分类制作 1 顶。')],
    facts: [{ label: '减伤', value: '80%' }, { label: '耐久', value: '315' }], uses: ['通用战斗护甲。'],
    tips: ['正式 Boss 战准备多顶备用。']
  }),
  simpleEntry({
    slug: 'hambat', title: '火腿棒', english: 'Ham Bat', aliases: ['火腿棒', '火腿棍'], category: '装备', stage: '前中期',
    summary: '不消耗耐久，但伤害随新鲜度下降；适合连续战斗窗口。',
    crafting: craft([amount('pig-skin', '猪皮', 1), amount('twigs', '树枝', 2), amount('meat', '大肉', 2)], '炼金引擎', '武器'),
    acquisition: [acquire('制作', '在炼金引擎旁制作', '准备 1 块猪皮、2 个树枝和 2 块大肉。', '在“武器”分类制作，尽量临战再做。')],
    facts: [{ label: '最高伤害', value: '59.5' }, { label: '保质期', value: '10 天' }], uses: ['Boss 战和长时间清怪。']
  }),
  simpleEntry({
    slug: 'thermal-stone', prefab: 'heatrock', title: '暖石', english: 'Thermal Stone', aliases: ['暖石', '热能石'], category: '装备', stage: '冬季前',
    summary: '储存环境温度的随身物品，必须配合保暖装备和重新加热。',
    crafting: craft([amount('rocks', '石头', 10), amount('pickaxe', '镐', 1), amount('flint', '燧石', 3)], '炼金引擎', '生存'),
    acquisition: [acquire('制作', '在炼金引擎旁制作', '准备 10 个石头、1 把镐和 3 个燧石。', '制作后放在火源附近加热；不要丢进火里。')],
    facts: [{ label: '耐久', value: '8 次温度循环，可用缝纫包修复' }], uses: ['冬季保暖和夏季降温。']
  }),
  simpleEntry({
    slug: 'beefalo-hat', prefab: 'beefalohat', title: '牛帽', english: 'Beefalo Hat', aliases: ['牛帽', '牛角帽'], category: '装备', stage: '冬季前',
    summary: '高保暖冬帽，同时让发情牛保持中立。',
    crafting: craft([amount('beefalo-wool', '牛毛', 8), amount('beefalo-horn', '牛角', 1)], '炼金引擎', '冬季物品'),
    acquisition: [acquire('制作', '在炼金引擎旁制作', '夜间刮取 8 个牛毛，并取得 1 个牛角。', '在“冬季物品”分类制作。')],
    facts: [{ label: '保暖', value: '240' }, { label: '耐久', value: '10 天' }], uses: ['严冬保暖和穿越发情牛群。']
  }),
  simpleEntry({
    slug: 'straw-hat', prefab: 'strawhat', title: '草帽', english: 'Straw Hat', category: '装备', stage: '前期',
    summary: '廉价头部装备，主要作为雨帽和矿工帽的制作材料。',
    crafting: craft([amount('cut-grass', '草', 12)], '徒手制作', '服装'),
    acquisition: [acquire('制作', '徒手编织草帽', '收集 12 个草。', '打开“服装”分类制作。')],
    facts: [{ label: '防水', value: '20%' }], uses: ['制作矿工帽、雨帽和短时防雨。']
  }),
  simpleEntry({
    slug: 'top-hat', prefab: 'tophat', title: '高礼帽', english: 'Top Hat', category: '装备', stage: '前中期',
    summary: '提供持续理智恢复，也是暗影操控器的重要材料。',
    crafting: craft([amount('silk', '蜘蛛丝', 6)], '科学机器及以上科技', '服装'),
    acquisition: [acquire('制作', '用蜘蛛丝制作', '准备 6 个蜘蛛丝。', '在科学机器旁的“服装”分类制作。')],
    facts: [{ label: '理智', value: '+3.3/分钟' }, { label: '耐久', value: '8 天' }], uses: ['恢复理智和制作暗影操控器。']
  }),
  simpleEntry({
    slug: 'rain-hat', prefab: 'rainhat', title: '雨帽', english: 'Rain Hat', category: '装备', stage: '春季前',
    summary: '头部防雨装备，和雨衣或雨伞组合能稳定控制潮湿。',
    crafting: craft([amount('moleworm', '鼹鼠', 2), amount('straw-hat', '草帽', 1), amount('bone-shards', '骨片', 1)], '炼金引擎', '雨具'),
    acquisition: [acquire('制作', '制作雨帽', '活捉 2 只鼹鼠，准备 1 顶草帽和 1 个骨片。', '在炼金引擎旁制作。')],
    facts: [{ label: '防水', value: '70%' }, { label: '耐久', value: '10 天' }], uses: ['春季探索和防止武器打滑。']
  }),
  simpleEntry({
    slug: 'umbrella', title: '雨伞', english: 'Umbrella', category: '装备', stage: '春季前',
    summary: '手持防雨装备，材料比眼球伞容易取得，但会占用手栏。',
    crafting: craft([amount('twigs', '树枝', 6), amount('pig-skin', '猪皮', 1), amount('silk', '蜘蛛丝', 2)], '科学机器及以上科技', '雨具'),
    acquisition: [acquire('制作', '制作雨伞', '准备 6 个树枝、1 块猪皮和 2 个蜘蛛丝。', '在科学机器旁制作。')],
    facts: [{ label: '防水', value: '90%' }, { label: '耐久', value: '10 天' }], uses: ['春季防雨和夏季少量隔热。']
  }),
  simpleEntry({
    slug: 'backpack', title: '背包', english: 'Backpack', category: '装备', stage: '第 1—3 天',
    summary: '增加八格物品栏，是前期探索的第一件容量装备。',
    crafting: craft([amount('cut-grass', '草', 4), amount('twigs', '树枝', 4)], '科学机器及以上科技', '容器'),
    acquisition: [acquire('制作', '制作背包', '准备 4 个草和 4 个树枝。', '在科学机器旁原型制作，之后可随时制造。')],
    facts: [{ label: '容量', value: '8 格' }], uses: ['探索和搬运。']
  }),
  simpleEntry({
    slug: 'piggyback', title: '猪皮包', english: 'Piggyback', category: '装备', stage: '中期',
    summary: '容量更大的背包，但会降低移动速度。',
    crafting: craft([amount('pig-skin', '猪皮', 4), amount('silk', '蜘蛛丝', 6), amount('rope', '绳子', 2)], '炼金引擎', '容器'),
    acquisition: [acquire('制作', '制作猪皮包', '准备 4 块猪皮、6 个蜘蛛丝和 2 根绳子。', '在炼金引擎旁制作。')],
    facts: [{ label: '容量', value: '12 格' }, { label: '移速', value: '-10%' }], uses: ['基地搬运和短距离采集。']
  }),
  simpleEntry({
    slug: 'bug-net', prefab: 'bugnet', title: '捕虫网', english: 'Bug Net', category: '工具', stage: '第一周',
    summary: '捕捉蜜蜂、蝴蝶、萤火虫等小型生物。',
    crafting: craft([amount('twigs', '树枝', 4), amount('silk', '蜘蛛丝', 2), amount('rope', '绳子', 1)], '科学机器及以上科技', '工具'),
    acquisition: [acquire('制作', '制作捕虫网', '准备 4 个树枝、2 个蜘蛛丝和 1 根绳子。', '在科学机器旁制作。')],
    facts: [{ label: '耐久', value: '10 次捕捉' }], uses: ['建设蜂箱、捕萤火虫和移植蝴蝶花。']
  }),
  simpleEntry({
    slug: 'fishing-rod', prefab: 'fishingrod', title: '钓竿', english: 'Fishing Rod', category: '工具', stage: '第一周',
    summary: '在池塘钓取淡水鱼；海钓使用另一套工具。',
    crafting: craft([amount('twigs', '树枝', 2), amount('silk', '蜘蛛丝', 2)], '科学机器及以上科技', '工具'),
    acquisition: [acquire('制作', '制作钓竿', '准备 2 个树枝和 2 个蜘蛛丝。', '在科学机器旁制作。')],
    facts: [{ label: '耐久', value: '9 次成功钓鱼' }], uses: ['池塘钓鱼。']
  }),
  simpleEntry({
    slug: 'bird-trap', prefab: 'birdtrap', title: '捕鸟陷阱', english: 'Bird Trap', category: '工具', stage: '第一周',
    summary: '捕获鸟类放入鸟笼，建立肉换蛋和作物种子循环。',
    crafting: craft([amount('twigs', '树枝', 3), amount('silk', '蜘蛛丝', 4)], '科学机器及以上科技', '生存'),
    acquisition: [acquire('制作', '制作捕鸟陷阱', '准备 3 个树枝和 4 个蜘蛛丝。', '在科学机器旁制作，放置后用种子提高效率。')],
    facts: [{ label: '耐久', value: '8 次捕获' }], uses: ['捕鸟并建立鸟笼循环。']
  }),
  simpleEntry({
    slug: 'trap', title: '陷阱', english: 'Trap', category: '工具', stage: '第 1 天',
    summary: '无需科技的地面陷阱，适合抓兔子和无伤处理蜘蛛。',
    crafting: craft([amount('cut-grass', '草', 6), amount('twigs', '树枝', 2)], '徒手制作', '生存'),
    acquisition: [acquire('制作', '徒手制作陷阱', '准备 6 个草和 2 个树枝。', '在“生存”分类制作，放在兔洞或蜘蛛路径上。')],
    facts: [{ label: '耐久', value: '8 次捕获' }], uses: ['捕兔和诱捕蜘蛛。']
  }),
  simpleEntry({
    slug: 'healing-salve', prefab: 'healingsalve', title: '治疗药膏', english: 'Healing Salve', category: '装备', stage: '第一周',
    summary: '材料稳定的应急治疗品，适合远行时分散携带。',
    crafting: craft([amount('ash', '灰烬', 2), amount('rocks', '石头', 1), amount('spider-gland', '蜘蛛腺', 1)], '科学机器及以上科技', '治疗'),
    acquisition: [acquire('制作', '制作治疗药膏', '准备 2 个灰烬、1 个石头和 1 个蜘蛛腺。', '在科学机器旁制作。')],
    facts: [{ label: '生命恢复', value: '+20' }], uses: ['战后恢复和远行补给。']
  }),
  simpleEntry({
    slug: 'booster-shot', prefab: 'lifeinjector', title: '强心针', english: 'Booster Shot', category: '装备', stage: '中期',
    summary: '恢复复活造成的最大生命惩罚，不是普通即时回血药。',
    crafting: craft([amount('rot', '腐烂物', 8), amount('nitre', '硝石', 2), amount('stinger', '蜂刺', 1)], '炼金引擎', '治疗'),
    acquisition: [acquire('制作', '制作强心针', '准备 8 个腐烂物、2 个硝石和 1 个蜂刺。', '在炼金引擎旁制作。')],
    facts: [{ label: '效果', value: '恢复 25 点最大生命上限' }], uses: ['消除复活惩罚。']
  }),
  simpleEntry({
    slug: 'tell-tale-heart', prefab: 'reviver', title: '告密的心', english: 'Telltale Heart', aliases: ['复活心', '心', '告密的心'], category: '装备', stage: '多人开局',
    summary: '联机版常见玩家复活道具，制作者会立即损失生命。',
    crafting: craft([amount('cut-grass', '草', 3), amount('spider-gland', '蜘蛛腺', 1)], '徒手制作', '治疗', 1, ['制作时消耗制作者 40 点生命。']),
    acquisition: [acquire('制作', '徒手制作告密的心', '准备 3 个草和 1 个蜘蛛腺，并确保生命值高于 40。', '在“治疗”分类制作；对玩家鬼魂使用完成复活。')],
    facts: [{ label: '制作代价', value: '-40 生命' }, { label: '复活惩罚', value: '目标最大生命 -25%' }], uses: ['复活其他玩家。']
  }),
  simpleEntry({
    slug: 'lantern', title: '提灯', english: 'Lantern', aliases: ['提灯', '灯笼'], category: '装备', stage: '洞穴准备',
    summary: '可充能并能放在地上照明，是洞穴探索的核心光源。',
    crafting: craft([amount('twigs', '树枝', 3), amount('rope', '绳子', 2), amount('light-bulb', '荧光果', 2)], '炼金引擎', '照明'),
    acquisition: [acquire('制作', '制作提灯', '从洞穴带回 2 个荧光果，再准备 3 个树枝和 2 根绳子。', '在炼金引擎旁制作；用荧光果重新充能。')],
    facts: [{ label: '照明时间', value: '8 分钟' }], uses: ['洞穴照明和固定战斗光源。']
  }),
  simpleEntry({
    slug: 'miner-hat', prefab: 'minerhat', title: '矿工帽', english: 'Miner Hat', aliases: ['矿工帽', '矿灯帽'], category: '装备', stage: '洞穴准备',
    summary: '头部照明让双手保持可用，适合采矿和需要武器的探索。',
    crafting: craft([amount('straw-hat', '草帽', 1), amount('gold-nugget', '金块', 1), amount('fireflies', '萤火虫', 1)], '炼金引擎', '照明'),
    acquisition: [acquire('制作', '制作矿工帽', '用捕虫网捕获 1 只萤火虫，准备 1 顶草帽和 1 个金块。', '在炼金引擎旁制作；可用萤火虫或荧光果充能。')],
    facts: [{ label: '照明时间', value: '8 分钟' }], uses: ['洞穴采矿和夜间战斗。']
  }),
  simpleEntry({
    slug: 'walking-cane', prefab: 'cane', title: '步行手杖', english: 'Walking Cane', aliases: ['手杖', '步行手杖'], category: '装备', stage: '冬季',
    summary: '常驻移速装备，来自冬季海象爸爸的稀有掉落。',
    crafting: noCraft('不可制作；必须从海象爸爸处取得。'),
    acquisition: [acquire('掉落', '击杀海象爸爸', '冬季找到海象营地。', '清理冰猎犬并击杀海象爸爸。', '海象爸爸有概率掉落步行手杖；营地会刷新，可反复挑战。')],
    facts: [{ label: '移速', value: '+25%' }, { label: '耐久', value: '无限' }], uses: ['探索、走位和搬运。']
  }),
  simpleEntry({
    slug: 'sewing-kit', prefab: 'sewing_kit', title: '缝纫包', english: 'Sewing Kit', category: '工具', stage: '前中期',
    summary: '修复有耐久的衣物和保暖装备，适合延长稀有帽子的使用周期。',
    crafting: craft([amount('log', '木头', 1), amount('silk', '蜘蛛丝', 8), amount('hound-tooth', '犬牙', 2)], '炼金引擎', '工具'),
    acquisition: [acquire('制作', '制作缝纫包', '准备 1 个木头、8 个蜘蛛丝和 2 个犬牙。', '在炼金引擎旁制作。')],
    facts: [{ label: '耐久', value: '5 次使用' }], uses: ['修复牛帽、冬帽、雨具等衣物。']
  }),
  simpleEntry({
    slug: 'life-giving-amulet', prefab: 'amulet', title: '重生护符', english: 'Life Giving Amulet', aliases: ['重生护符', '生命护符', '红护符'], category: '装备', stage: '魔法科技',
    summary: '佩戴时提供缓慢治疗，死亡后可由鬼魂作祟实现复活。',
    crafting: craft([amount('gold-nugget', '金块', 3), amount('nightmare-fuel', '噩梦燃料', 2), amount('red-gem', '红宝石', 1)], '灵子分解器', '魔法'),
    acquisition: [acquire('制作', '在灵子分解器旁制作', '准备 3 个金块、2 个噩梦燃料和 1 颗红宝石。', '在“魔法”分类制作。')],
    facts: [{ label: '耐久', value: '20 次治疗触发' }], uses: ['持续治疗和复活保险。']
  }),
  simpleEntry({
    slug: 'dark-sword', prefab: 'nightsword', title: '暗影剑', english: 'Dark Sword', aliases: ['暗影剑', '影刀'], category: '装备', stage: '魔法科技',
    summary: '高伤害通用武器，但装备时会持续降低理智。',
    crafting: craft([amount('nightmare-fuel', '噩梦燃料', 5), amount('living-log', '活木', 1)], '暗影操控器', '魔法'),
    acquisition: [acquire('制作', '在暗影操控器旁制作', '准备 5 个噩梦燃料和 1 个活木。', '在“魔法”分类制作。')],
    facts: [{ label: '伤害', value: '68' }, { label: '耐久', value: '100 次攻击' }, { label: '理智', value: '-20/分钟' }], uses: ['Boss 战和高威胁目标。']
  })
]
