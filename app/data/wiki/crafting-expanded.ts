import type { WikiEntry } from '~/types/wiki'
import { acquire, amount, craft, simpleEntry } from './shared'

export const craftingExpandedEntries: WikiEntry[] = [
  simpleEntry({
    slug: 'razor', prefab: 'razor', title: '剃刀', english: 'Razor', category: '工具', stage: '第一周',
    summary: '剃刀用于剃掉角色胡须或夜间熟睡皮弗娄牛的毛，是取得牛毛的低风险工具。',
    crafting: craft([amount('twigs', '树枝', 2), amount('flint', '燧石', 2)], '科学机器及以上科技', '工具', 1, ['首次制作需解锁科学一级配方。']),
    acquisition: [acquire('制作', '在科学机器旁制作剃刀', '准备 2 个树枝和 2 个燧石。', '靠近科学机器，在“工具”筛选中制作 1 把剃刀。')],
    facts: [{ label: '主要功能', value: '剃须与夜间剃牛毛' }], uses: ['收集皮弗娄牛毛。', '处理部分角色的胡须。'],
    tips: ['等牛群睡着后从边缘开始剃毛，并预留照明和撤退路线。'], mistakes: ['白天或牛群发情时贴近剃毛，容易引来整群攻击。'],
    related: ['twigs', 'flint', 'beefalo-wool']
  }),
  simpleEntry({
    slug: 'pitchfork', prefab: 'pitchfork', title: '草叉', english: 'Pitchfork', aliases: ['草叉', '干草叉', 'Pitchfork'], category: '工具', stage: '第一周',
    summary: '草叉可挖起整块地皮，用于基地铺地、移除可燃地皮或规划农场。',
    crafting: craft([amount('twigs', '树枝', 2), amount('flint', '燧石', 2)], '科学机器及以上科技', '工具', 1, ['首次制作需解锁科学一级配方。']),
    acquisition: [acquire('制作', '在科学机器旁制作草叉', '准备 2 个树枝和 2 个燧石。', '靠近科学机器，在“工具”筛选中制作 1 把草叉。')],
    facts: [{ label: '功能', value: '挖取一格地皮' }], uses: ['基地铺路与地形整理。'],
    tips: ['先规划范围再连续挖地，避免把自然地皮切得零碎。'], mistakes: ['把草叉当作园艺锄；它挖地皮，不能在农田上耕出种植穴。'],
    related: ['twigs', 'flint', 'garden-hoe']
  }),
  simpleEntry({
    slug: 'garden-hoe', prefab: 'farm_hoe', title: '园艺锄', english: 'Garden Hoe', aliases: ['园艺锄', '锄头', 'Garden Hoe'], category: '工具', stage: '建立农田后',
    summary: '园艺锄在农场土壤上耕出土堆，供普通种子和作物种子播种。',
    crafting: craft([amount('twigs', '树枝', 2), amount('flint', '燧石', 2)], '科学机器及以上科技', '工具', 1, ['首次制作需解锁科学一级配方。']),
    acquisition: [acquire('制作', '在科学机器旁制作园艺锄', '准备 2 个树枝和 2 个燧石。', '靠近科学机器，在“工具”筛选中制作 1 把园艺锄。')],
    facts: [{ label: '耐久用途', value: '用于耕作农场土壤' }], uses: ['为农作物种子准备种植穴。'],
    tips: ['先用耕地机铺出农场土壤，再用园艺锄整齐耕作。'], mistakes: ['在普通地皮上反复尝试；园艺锄需要农场土壤。'],
    related: ['twigs', 'flint', 'watering-can']
  }),
  simpleEntry({
    slug: 'watering-can', prefab: 'wateringcan', title: '浇水壶', english: 'Watering Can', aliases: ['浇水壶', '水壶', 'Watering Can'], category: '工具', stage: '建立农田后',
    summary: '浇水壶从池塘等水源补水，用于保持农场土壤湿润并减少作物压力。',
    crafting: craft([amount('boards', '木板', 2), amount('rope', '绳子', 1)], '科学机器及以上科技', '园艺', 1, ['首次制作需解锁科学一级配方。']),
    acquisition: [acquire('制作', '在科学机器旁制作浇水壶', '准备 2 块木板和 1 根绳子。', '靠近科学机器，在“园艺”筛选中制作 1 个浇水壶。', '带到池塘等可用水源旁装水后再浇灌农田。')],
    facts: [{ label: '功能', value: '为农场土壤补充湿度，可重新装水' }], uses: ['照料普通作物和巨型作物。'],
    tips: ['每个生长阶段检查一次土壤湿度，比无计划连续浇水更省时间。'], mistakes: ['空壶直接对农田使用，忽略先去水源补水。'],
    related: ['boards', 'rope', 'garden-hoe']
  }),
  simpleEntry({
    slug: 'golden-axe', prefab: 'goldenaxe', title: '黄金斧头', english: 'Luxury Axe', aliases: ['黄金斧头', '金斧头', 'Luxury Axe'], category: '工具', stage: '炼金科技',
    summary: '黄金斧头用金块换取远高于普通斧头的耐久，适合大规模伐木。',
    crafting: craft([amount('twigs', '树枝', 4), amount('gold-nugget', '金块', 2)], '炼金引擎', '工具', 1, ['首次制作需在炼金引擎旁原型。']),
    acquisition: [acquire('制作', '在炼金引擎旁制作黄金斧头', '准备 4 个树枝和 2 个金块。', '靠近炼金引擎，在“工具”筛选中制作 1 把。')],
    facts: [{ label: '定位', value: '高耐久伐木工具' }], uses: ['批量砍伐树木。'],
    tips: ['金块来源稳定后再用它替代普通斧头，开局先保留金块建科技。'], mistakes: ['科技尚未建成就把仅有金块全部做成工具。'], related: ['axe', 'gold-nugget', 'twigs']
  }),
  simpleEntry({
    slug: 'golden-pickaxe', prefab: 'goldenpickaxe', title: '黄金镐', english: 'Opulent Pickaxe', aliases: ['黄金镐', '金镐', 'Opulent Pickaxe'], category: '工具', stage: '炼金科技',
    summary: '黄金镐是高耐久采矿工具，适合长距离矿区、洞穴和月岛开采。',
    crafting: craft([amount('twigs', '树枝', 4), amount('gold-nugget', '金块', 2)], '炼金引擎', '工具', 1, ['首次制作需在炼金引擎旁原型。']),
    acquisition: [acquire('制作', '在炼金引擎旁制作黄金镐', '准备 4 个树枝和 2 个金块。', '靠近炼金引擎，在“工具”筛选中制作 1 把。')],
    facts: [{ label: '定位', value: '高耐久采矿工具' }], uses: ['连续开采岩石与矿脉。'],
    tips: ['远征前仍应留少量树枝，避免工具耗尽后无法现场补充。'], mistakes: ['只带一把工具深入洞穴，却没有任何返程照明和备用材料。'], related: ['pickaxe', 'gold-nugget', 'twigs']
  }),
  simpleEntry({
    slug: 'golden-shovel', prefab: 'goldenshovel', title: '黄金铲子', english: 'Regal Shovel', aliases: ['黄金铲子', '金铲子', 'Regal Shovel'], category: '工具', stage: '炼金科技',
    summary: '黄金铲子耐久更高，适合集中移植草、树苗、浆果丛和挖取树桩。',
    crafting: craft([amount('twigs', '树枝', 4), amount('gold-nugget', '金块', 2)], '炼金引擎', '工具', 1, ['首次制作需在炼金引擎旁原型。']),
    acquisition: [acquire('制作', '在炼金引擎旁制作黄金铲子', '准备 4 个树枝和 2 个金块。', '靠近炼金引擎，在“工具”筛选中制作 1 把。')],
    facts: [{ label: '定位', value: '高耐久挖掘与移植工具' }], uses: ['批量移植资源点。'],
    tips: ['移植物集中运回基地后及时种下并按需施肥。'], mistakes: ['只挖不种，让可再生资源长期躺在地上或枯萎。'], related: ['shovel', 'gold-nugget', 'berry-bush']
  }),
  simpleEntry({
    slug: 'compass', prefab: 'compass', title: '指南针', english: 'Compass', category: '工具', stage: '第一周',
    summary: '指南针提供稳定方向参照，在旋转镜头或多人远行时帮助统一方位描述。',
    crafting: craft([amount('gold-nugget', '金块', 1), amount('papyrus', '莎草纸', 1)], '科学机器及以上科技', '工具', 1, ['首次制作需解锁科学一级配方。']),
    acquisition: [acquire('制作', '在科学机器旁制作指南针', '准备 1 个金块和 1 张莎草纸。', '靠近科学机器，在“工具”筛选中制作 1 个指南针。')],
    facts: [{ label: '功能', value: '提供不受镜头旋转干扰的方向参照' }], uses: ['多人报点和远行辨向。'],
    tips: ['队伍事先约定按指南针方位报点，减少“屏幕左边”这类歧义。'], mistakes: ['把镜头方向当作固定北方，旋转镜头后继续按屏幕方位交流。'], related: ['gold-nugget', 'papyrus']
  }),
  simpleEntry({
    slug: 'boomerang', prefab: 'boomerang', title: '回旋镖', english: 'Boomerang', category: '装备', stage: '炼金科技',
    summary: '回旋镖是可重复使用的远程武器，适合猎鸟和拉取目标，但回旋时需要及时接住。',
    crafting: craft([amount('boards', '木板', 1), amount('silk', '蜘蛛丝', 1), amount('charcoal', '木炭', 1)], '炼金引擎', '武器', 1, ['首次制作需在炼金引擎旁原型。']),
    acquisition: [acquire('制作', '在炼金引擎旁制作回旋镖', '准备 1 块木板、1 个蜘蛛丝和 1 个木炭。', '靠近炼金引擎，在“武器”筛选中制作 1 个回旋镖。')],
    facts: [{ label: '使用方式', value: '投出后回旋，需按动作键接住' }], uses: ['猎取落地鸟类。', '远程吸引单个目标。'],
    tips: ['投出后盯住回旋时机，提前准备动作键接取。'], mistakes: ['投掷后立刻切换注意力，漏接回旋镖并被它击中。'], related: ['boards', 'silk', 'charcoal']
  }),
  simpleEntry({
    slug: 'blow-dart', prefab: 'blowdart_pipe', title: '攻击吹箭', english: 'Blow Dart', aliases: ['攻击吹箭', '吹箭', 'Blow Dart'], category: '装备', stage: '第一周远程战',
    summary: '攻击吹箭是单次使用的高伤害远程武器，季节性蓝色羽毛会限制批量制作。',
    crafting: craft([amount('cut-reeds', '芦苇', 2), amount('hound-tooth', '犬牙', 1), amount('azure-feather', '蓝色羽毛', 1)], '科学机器及以上科技', '武器', 1, ['首次制作需解锁科学一级配方。']),
    acquisition: [acquire('制作', '在科学机器旁制作攻击吹箭', '准备 2 个芦苇、1 个犬牙和 1 根蓝色羽毛。', '靠近科学机器，在“武器”筛选中制作 1 支攻击吹箭。')],
    facts: [{ label: '特点', value: '单次使用的远程直接伤害' }], uses: ['远程处理危险目标。'],
    tips: ['把它留给需要快速击杀或不宜近战的目标。'], mistakes: ['用昂贵的单发吹箭处理可安全近战的小型生物。'], related: ['cut-reeds', 'hound-tooth', 'azure-feather']
  }),
  simpleEntry({
    slug: 'sleep-dart', prefab: 'blowdart_sleep', title: '催眠吹箭', english: 'Sleep Dart', aliases: ['催眠吹箭', '睡眠吹箭', 'Sleep Dart'], category: '装备', stage: '第一周控场',
    summary: '催眠吹箭用于远程让多数生物入睡，但强敌可能需要多发，部分目标免疫睡眠。',
    crafting: craft([amount('cut-reeds', '芦苇', 2), amount('stinger', '蜂刺', 1), amount('jet-feather', '黑色羽毛', 1)], '科学机器及以上科技', '武器', 1, ['首次制作需解锁科学一级配方。']),
    acquisition: [acquire('制作', '在科学机器旁制作催眠吹箭', '准备 2 个芦苇、1 个蜂刺和 1 根黑色羽毛。', '靠近科学机器，在“武器”筛选中制作 1 支催眠吹箭。')],
    facts: [{ label: '特点', value: '单次使用；施加睡眠积累' }], uses: ['控场、脱离战斗或创造处理目标的窗口。'],
    tips: ['面对大型目标先确认所需发数，并准备足量吹箭和后续行动。'], mistakes: ['默认所有 Boss 都能被一发催眠；睡眠免疫或高抗性会让投入落空。'], related: ['cut-reeds', 'stinger', 'jet-feather']
  }),
  simpleEntry({
    slug: 'fire-dart', prefab: 'blowdart_fire', title: '火焰吹箭', english: 'Fire Dart', aliases: ['火焰吹箭', '燃烧吹箭', 'Fire Dart'], category: '装备', stage: '第一周特殊战术',
    summary: '火焰吹箭会远程点燃目标并引发恐慌；火势可能蔓延到战利品、建筑和自然资源。',
    crafting: craft([amount('cut-reeds', '芦苇', 2), amount('charcoal', '木炭', 1), amount('crimson-feather', '红色羽毛', 1)], '科学机器及以上科技', '武器', 1, ['首次制作需解锁科学一级配方。']),
    acquisition: [acquire('制作', '在科学机器旁制作火焰吹箭', '准备 2 个芦苇、1 个木炭和 1 根红色羽毛。', '靠近科学机器，在“武器”筛选中制作 1 支火焰吹箭。')],
    facts: [{ label: '特点', value: '单次使用；点燃目标及邻近可燃物' }], uses: ['远程点燃目标并制造恐慌。'],
    tips: ['只在远离基地、森林和重要掉落物的空地使用，并准备灭火手段。'], mistakes: ['在可燃资源密集区试射，导致火势烧毁战利品或基地。'], related: ['cut-reeds', 'charcoal', 'crimson-feather']
  }),
  simpleEntry({
    slug: 'electric-dart', prefab: 'blowdart_yellow', title: '电击吹箭', english: 'Electric Dart', aliases: ['电击吹箭', '带电吹箭', 'Electric Dart'], category: '装备', stage: '前中期远程战',
    summary: '电击吹箭是单次使用的电属性远程武器，对潮湿目标更有效；当前配方使用黄色羽毛和金块。',
    crafting: craft([amount('cut-reeds', '芦苇', 2), amount('gold-nugget', '金块', 1), amount('saffron-feather', '黄色羽毛', 1)], '科学机器及以上科技', '武器', 1, ['首次制作需解锁科学一级配方。']),
    acquisition: [acquire('制作', '在科学机器旁制作电击吹箭', '准备 2 个芦苇、1 个金块和 1 根黄色羽毛。', '靠近科学机器，在“武器”筛选中制作 1 支电击吹箭。')],
    facts: [{ label: '特点', value: '单次使用；电属性伤害受目标潮湿影响' }], uses: ['在雨天或目标潮湿时进行远程爆发。'],
    tips: ['优先对潮湿且不免疫电击的高价值目标使用。'], mistakes: ['沿用旧印象把伏特羊角写进配方；当前 DST 配方是金块和黄色羽毛。'], related: ['cut-reeds', 'gold-nugget', 'saffron-feather']
  }),
  simpleEntry({
    slug: 'morning-star', prefab: 'nightstick', title: '晨星锤', english: 'Morning Star', aliases: ['晨星锤', '晨星', 'Morning Star'], category: '装备', stage: '炼金科技与沙漠资源',
    summary: '晨星锤会发光并造成电属性伤害，潮湿目标承受更多伤害，耐久按装备时间消耗。',
    crafting: craft([amount('volt-goat-horn', '伏特羊角', 1), amount('electrical-doodad', '电子元件', 2), amount('nitre', '硝石', 2)], '炼金引擎', '武器', 1, ['首次制作需在炼金引擎旁原型。']),
    acquisition: [acquire('制作', '在炼金引擎旁制作晨星锤', '准备 1 个伏特羊角、2 个电子元件和 2 个硝石。', '靠近炼金引擎，在“武器”筛选中制作 1 把晨星锤。')],
    facts: [{ label: '特点', value: '手持发光；对潮湿目标的电击更强' }], uses: ['雨季、洞穴和潮湿目标战斗。'],
    tips: ['接敌前再装备，移动和整理物资时收起，减少按时间流失的耐久。'], mistakes: ['把它长时间当普通提灯握在手里，白白消耗稀有羊角制成的装备。'], related: ['volt-goat-horn', 'electrical-doodad', 'nitre']
  }),
  simpleEntry({
    slug: 'fire-staff', prefab: 'firestaff', title: '火魔杖', english: 'Fire Staff', aliases: ['火魔杖', '火焰法杖', 'Fire Staff'], category: '装备', stage: '暗影魔法科技',
    summary: '火魔杖远程点燃生物和可燃物，每次施法消耗理智；昂贵的红宝石和噩梦燃料应换取明确收益。',
    crafting: craft([amount('spear', '长矛', 1), amount('red-gem', '红宝石', 1), amount('nightmare-fuel', '噩梦燃料', 2)], '暗影操控器', '魔法', 1, ['首次制作需在暗影操控器旁原型。']),
    acquisition: [acquire('制作', '在暗影操控器旁制作火魔杖', '准备 1 把长矛、1 颗红宝石和 2 个噩梦燃料。', '靠近暗影操控器，在“魔法”筛选中制作 1 根火魔杖。')],
    facts: [{ label: '施法代价', value: '每次使用降低 1 点理智，并消耗一次耐久' }], uses: ['远程点火、制造生物恐慌和处理特定目标。'],
    tips: ['先把目标引到空地再施法，确认燃烧不会波及建筑和关键掉落。'], mistakes: ['忽略红宝石与噩梦燃料成本，或在基地附近施法引发连锁火灾。'], related: ['spear', 'red-gem', 'nightmare-fuel']
  }),
  simpleEntry({
    slug: 'ice-staff', prefab: 'icestaff', title: '冰魔杖', english: 'Ice Staff', aliases: ['冰魔杖', '冰杖', 'Ice Staff'], category: '装备', stage: '基础魔法科技',
    summary: '冰魔杖通过多次命中冻结目标，每次施法消耗理智；大型目标通常需要更多次积累。',
    crafting: craft([amount('spear', '长矛', 1), amount('blue-gem', '蓝宝石', 1)], '灵子分解器', '魔法', 1, ['首次制作需在灵子分解器旁原型。']),
    acquisition: [acquire('制作', '在灵子分解器旁制作冰魔杖', '准备 1 把长矛和 1 颗蓝宝石。', '靠近灵子分解器，在“魔法”筛选中制作 1 根冰魔杖。')],
    facts: [{ label: '施法代价', value: '每次使用降低 1 点理智，并积累冻结效果' }], uses: ['冻结威胁、打断行动或创造撤退窗口。'],
    tips: ['先估计目标的冻结抗性，确保蓝宝石和魔杖耐久不会只换来不完整的控制。'], mistakes: ['以为所有大型敌人一发即冻，浪费昂贵魔法资源后仍被追击。'], related: ['spear', 'blue-gem']
  }),
  simpleEntry({
    slug: 'grass-suit', prefab: 'armorgrass', title: '草甲', english: 'Grass Suit', aliases: ['草甲', '草制护甲', 'Grass Suit'], category: '装备', stage: '第 1 天',
    summary: '草甲是无需科技的廉价身体护甲，适合开局应急，但防护和耐久都不适合长期硬抗。',
    crafting: craft([amount('cut-grass', '草', 10), amount('twigs', '树枝', 2)], '徒手制作', '护甲'),
    acquisition: [acquire('制作', '徒手制作草甲', '准备 10 个草和 2 个树枝。', '打开“护甲”筛选，直接制作 1 件草甲。')],
    facts: [{ label: '定位', value: '开局应急身体护甲' }], uses: ['猎犬来袭或意外遭遇时降低伤害。'],
    tips: ['没有木甲前可以随身留够材料临时制作。'], mistakes: ['穿着草甲持续站撸高伤害敌人，忽略其只是过渡护甲。'], related: ['cut-grass', 'twigs', 'log-suit']
  }),
  simpleEntry({
    slug: 'beekeeper-hat', prefab: 'beehat', title: '养蜂帽', english: 'Beekeeper Hat', aliases: ['养蜂帽', '蜂帽', 'Beekeeper Hat'], category: '装备', stage: '炼金科技',
    summary: '养蜂帽专门吸收蜜蜂类敌人的大部分伤害，不是面对所有生物都生效的通用护甲。',
    crafting: craft([amount('silk', '蜘蛛丝', 8), amount('rope', '绳子', 1)], '炼金引擎', '护甲', 1, ['首次制作需在炼金引擎旁原型。']),
    acquisition: [acquire('制作', '在炼金引擎旁制作养蜂帽', '准备 8 个蜘蛛丝和 1 根绳子。', '靠近炼金引擎，在“护甲”筛选中制作 1 顶养蜂帽。')],
    facts: [{ label: '专属防护', value: '吸收 80% 蜜蜂类伤害' }], uses: ['采蜂箱、拆蜂巢和准备蜂后战。'],
    tips: ['对付蜂群时佩戴，转战其他生物前换回通用护甲。'], mistakes: ['把养蜂帽当作普通头甲对付猎犬或 Boss；它的高防护只针对蜜蜂类。'], related: ['silk', 'rope', 'honey']
  }),
  simpleEntry({
    slug: 'rabbit-earmuffs', prefab: 'earmuffshat', title: '兔耳罩', english: 'Rabbit Earmuffs', aliases: ['兔耳罩', '兔毛耳罩', 'Rabbit Earmuffs'], category: '装备', stage: '入冬前',
    summary: '兔耳罩是科学一级的基础保暖帽，成本低但保暖有限，适合作为第一年冬装过渡。',
    crafting: craft([amount('rabbit', '兔子', 2), amount('twigs', '树枝', 1)], '科学机器及以上科技', '服装', 1, ['首次制作需解锁科学一级配方。']),
    acquisition: [acquire('制作', '在科学机器旁制作兔耳罩', '活捉 2 只兔子并准备 1 个树枝。', '靠近科学机器，在“服装”筛选中制作 1 副兔耳罩。')],
    facts: [{ label: '保暖', value: '60' }], uses: ['初冬短途保暖。'],
    tips: ['配合暖石和沿途火源使用，不要只靠耳罩进行长途冬季远征。'], mistakes: ['把兔耳罩当成高级冬装，离开火源太久后才发现保暖不足。'], related: ['rabbit', 'twigs', 'thermal-stone']
  }),
  simpleEntry({
    slug: 'bush-hat', prefab: 'bushhat', title: '灌木丛帽', english: 'Bush Hat', aliases: ['灌木丛帽', '灌木帽', 'Bush Hat'], category: '装备', stage: '炼金科技',
    summary: '灌木丛帽可让玩家原地伪装成灌木，用于观察或规避部分仇恨，但移动会结束伪装。',
    crafting: craft([amount('straw-hat', '草帽', 1), amount('rope', '绳子', 1), amount('berry-bush', '浆果丛', 2)], '炼金引擎', '服装', 1, ['首次制作需在炼金引擎旁原型。']),
    acquisition: [acquire('制作', '在炼金引擎旁制作灌木丛帽', '准备 1 顶草帽、1 根绳子和 2 个挖起的浆果丛。', '靠近炼金引擎，在“服装”筛选中制作 1 顶灌木丛帽。')],
    facts: [{ label: '主动效果', value: '原地伪装；移动时解除' }], uses: ['隐蔽观察和部分生物规避。'],
    tips: ['在敌人尚未锁定前使用更可靠，并预留解除后的撤退路线。'], mistakes: ['已经被强敌锁定后才伪装，误以为它能无条件清除所有仇恨。'], related: ['straw-hat', 'rope', 'berry-bush']
  }),
  simpleEntry({
    slug: 'garland', prefab: 'flowerhat', title: '花环', english: 'Garland', category: '装备', stage: '第 1 天',
    summary: '花环是无需科技的早期头部装备，提供缓慢理智恢复，但会随时间腐败。',
    crafting: craft([amount('petals', '花瓣', 12)], '徒手制作', '服装'),
    acquisition: [acquire('制作', '徒手编织花环', '采集 12 个花瓣。', '打开“服装”筛选，直接制作 1 个花环。')],
    facts: [{ label: '效果', value: '佩戴时缓慢恢复理智' }], uses: ['缓解开局的少量理智损失。'],
    tips: ['沿探索路线自然收集即可，不必为它延误找金块和建基地。'], mistakes: ['把花环当成强力理智装备，忽略其恢复较慢且会腐败。'], related: ['petals']
  }),
  simpleEntry({
    slug: 'honey-poultice', prefab: 'bandage', title: '蜂蜜药膏', english: 'Honey Poultice', aliases: ['蜂蜜药膏', '蜂蜜绷带', 'Honey Poultice'], category: '装备', stage: '炼金科技',
    summary: '蜂蜜药膏是稳定的中量治疗品，适合战前批量准备和队伍分发。',
    crafting: craft([amount('honey', '蜂蜜', 2), amount('papyrus', '莎草纸', 1)], '炼金引擎', '治疗', 1, ['首次制作需在炼金引擎旁原型。']),
    acquisition: [acquire('制作', '在炼金引擎旁制作蜂蜜药膏', '准备 2 个蜂蜜和 1 张莎草纸。', '靠近炼金引擎，在“治疗”筛选中制作 1 份蜂蜜药膏。')],
    facts: [{ label: '生命恢复', value: '30' }], uses: ['战斗间隙治疗玩家，也可治疗多数友方生物。'],
    tips: ['把蜂蜜与芦苇纸供应一起规划，避免只囤蜂蜜却缺莎草纸。'], mistakes: ['等到 Boss 战现场才发现治疗品材料尚未精炼成莎草纸。'], related: ['honey', 'papyrus', 'healing-salve']
  }),
  simpleEntry({
    slug: 'straw-roll', prefab: 'bedroll_straw', title: '草席卷', english: 'Straw Roll', aliases: ['草席卷', '草席', 'Straw Roll'], category: '装备', stage: '第一周',
    summary: '草席卷让玩家在黄昏或夜晚睡到白天，以饥饿和时间推进换取理智恢复，使用后会消耗。',
    crafting: craft([amount('cut-grass', '草', 6), amount('rope', '绳子', 1)], '科学机器及以上科技', '生存', 1, ['首次制作需解锁科学一级配方。']),
    acquisition: [acquire('制作', '在科学机器旁制作草席卷', '准备 6 个草和 1 根绳子。', '靠近科学机器，在“生存”筛选中制作 1 个草席卷。')],
    facts: [{ label: '睡眠代价', value: '推进到白天并持续消耗饥饿；一次性使用' }], uses: ['跳过危险夜晚并恢复理智。', '作为毛皮铺盖材料。'],
    tips: ['睡前准备足够饱食度和安全环境；睡眠推进时间，作物、火源和威胁也会继续变化。'], mistakes: ['低饥饿时入睡，或把睡眠当成暂停世界而漏掉猎犬、火源和季节进度。'], related: ['cut-grass', 'rope', 'fur-roll']
  }),
  simpleEntry({
    slug: 'fur-roll', prefab: 'bedroll_furry', title: '毛皮铺盖', english: 'Fur Roll', aliases: ['毛皮铺盖', '毛皮卷', 'Fur Roll'], category: '装备', stage: '洞穴与炼金科技',
    summary: '毛皮铺盖可重复睡眠三次，睡眠期间以饥饿和时间推进换取生命、理智与升温。',
    crafting: craft([amount('straw-roll', '草席卷', 1), amount('bunny-puff', '兔绒', 2)], '炼金引擎', '治疗', 1, ['首次制作需在炼金引擎旁原型。']),
    acquisition: [acquire('制作', '在炼金引擎旁制作毛皮铺盖', '准备 1 个草席卷和 2 个兔绒。', '靠近炼金引擎，在“治疗”筛选中制作 1 个毛皮铺盖。')],
    facts: [{ label: '使用次数', value: '3 次；睡眠时每秒消耗饥饿并恢复生命、理智' }], uses: ['安全地点夜间恢复生命、理智并升温。'],
    tips: ['先清理周围敌人并补足饱食；受攻击会打断睡眠，世界时间也不会停止。'], mistakes: ['在猎犬来袭、低饥饿或夏季过热风险下睡眠，反而把自己置于危险中。'], related: ['straw-roll', 'bunny-puff', 'bunnyman']
  }),
  simpleEntry({
    slug: 'feather-hat', prefab: 'featherhat', title: '羽毛帽', english: 'Feather Hat', category: '装备', stage: '炼金科技与沼泽资源',
    summary: '羽毛帽缓慢恢复理智，并显著提高佩戴者附近鸟类落地的频率。',
    crafting: craft([amount('crimson-feather', '红色羽毛', 2), amount('jet-feather', '黑色羽毛', 3), amount('tentacle-spots', '触手皮', 2)], '炼金引擎', '服装', 1, ['首次制作需在炼金引擎旁原型。']),
    acquisition: [acquire('制作', '在炼金引擎旁制作羽毛帽', '准备 2 根红色羽毛、3 根黑色羽毛和 2 张触手皮。', '靠近炼金引擎，在“服装”筛选中制作 1 顶羽毛帽。')],
    facts: [{ label: '效果', value: '恢复理智并提高附近鸟类刷新与落地频率' }], uses: ['配合捕鸟器或远程武器收集鸟类资源。'],
    tips: ['在开阔、安全且已布置捕鸟器的区域使用，才能把吸引鸟类的效果转化为稳定收益。'], mistakes: ['戴着羽毛帽直接追鸟；靠近仍会把鸟惊飞。'], related: ['crimson-feather', 'jet-feather', 'tentacle-spots']
  }),
  simpleEntry({
    slug: 'brush', prefab: 'brush', title: '刷子', english: 'Brush', category: '工具', stage: '驯牛中期',
    summary: '刷子每天首次用于目标皮弗娄牛时可提高服从与驯化，并取得牛毛；核心材料来自钢羊和海象。',
    crafting: craft([amount('steel-wool', '钢羊毛', 1), amount('walrus-tusk', '海象牙', 1), amount('gold-nugget', '金块', 2)], '炼金引擎', '工具', 1, ['首次制作需在炼金引擎旁原型。']),
    acquisition: [acquire('制作', '在炼金引擎旁制作刷子', '准备 1 个钢羊毛、1 个海象牙和 2 个金块。', '靠近炼金引擎，在“工具”筛选中制作 1 把刷子。')],
    facts: [{ label: '驯化规则', value: '同一头牛每天只有首次梳刷提供驯化收益' }], uses: ['加快驯牛并取得牛毛。'],
    tips: ['固定每天给目标牛梳刷一次，多刷不会重复增加当天驯化收益。'], mistakes: ['同一天反复刷同一头牛，浪费耐久却没有额外驯化收益。'], related: ['steel-wool', 'walrus-tusk', 'beefalo-wool']
  }),
  simpleEntry({
    slug: 'saddle', prefab: 'saddle_basic', title: '牛鞍', english: 'Saddle', aliases: ['牛鞍', '普通鞍', 'Saddle'], category: '装备', stage: '驯牛中期',
    summary: '普通牛鞍提供均衡的骑乘速度，是开始皮弗娄牛骑乘路线的基础选择。',
    crafting: craft([amount('beefalo-wool', '牛毛', 4), amount('pig-skin', '猪皮', 4), amount('gold-nugget', '金块', 4)], '炼金引擎', '骑乘', 1, ['首次制作需在炼金引擎旁原型。']),
    acquisition: [acquire('制作', '在炼金引擎旁制作牛鞍', '准备 4 个牛毛、4 块猪皮和 4 个金块。', '靠近炼金引擎，在“骑乘”筛选中制作 1 个牛鞍。')],
    facts: [{ label: '骑乘加速', value: '相对牛基础速度提高 40%' }], uses: ['为服从度足够的皮弗娄牛装鞍并骑乘。'],
    tips: ['普通鞍成本与速度均衡，先用它熟悉服从、骑乘和脱鞍流程。'], mistakes: ['忽略服从度强行装鞍；牛会拒绝、攻击或很快把鞍甩掉。'], related: ['beefalo-wool', 'pig-skin', 'saddlehorn']
  }),
  simpleEntry({
    slug: 'war-saddle', prefab: 'saddle_war', title: '战争牛鞍', english: 'War Saddle', aliases: ['战争牛鞍', '战斗鞍', 'War Saddle'], category: '装备', stage: '战斗型驯牛',
    summary: '战争牛鞍牺牲一部分速度专精骑乘攻击，适合战斗型皮弗娄牛而非纯赶路。',
    crafting: craft([amount('steel-wool', '钢羊毛', 4), amount('pig-skin', '猪皮', 4), amount('gold-nugget', '金块', 4)], '炼金引擎', '骑乘', 1, ['首次制作需在炼金引擎旁原型。']),
    acquisition: [acquire('制作', '在炼金引擎旁制作战争牛鞍', '准备 4 个钢羊毛、4 块猪皮和 4 个金块。', '靠近炼金引擎，在“骑乘”筛选中制作 1 个战争牛鞍。')],
    facts: [{ label: '专精', value: '提高骑乘攻击伤害，速度低于普通牛鞍' }], uses: ['强化战斗型皮弗娄牛的骑乘输出。'],
    tips: ['与高攻击倾向的战斗型牛搭配，才能充分利用伤害加成。'], mistakes: ['为了赶路制作战争牛鞍；它的优势是伤害，不是最高移动速度。'], related: ['steel-wool', 'pig-skin', 'saddle']
  }),
  simpleEntry({
    slug: 'glossamer-saddle', prefab: 'saddle_race', title: '薄纱牛鞍', english: 'Glossamer Saddle', aliases: ['薄纱牛鞍', '轻盈鞍', 'Glossamer Saddle'], category: '装备', stage: '高速驯牛后期',
    summary: '薄纱牛鞍专精最高骑乘速度，但 68 个蝴蝶翅膀使它成为高投入的赶路装备。',
    crafting: craft([amount('butterfly-wings', '蝴蝶翅膀', 68), amount('silk', '蜘蛛丝', 4), amount('living-log', '活木', 2)], '炼金引擎', '骑乘', 1, ['首次制作需在炼金引擎旁原型。']),
    acquisition: [acquire('制作', '在炼金引擎旁制作薄纱牛鞍', '准备 68 个蝴蝶翅膀、4 个蜘蛛丝和 2 个活木。', '靠近炼金引擎，在“骑乘”筛选中制作 1 个薄纱牛鞍。')],
    facts: [{ label: '骑乘加速', value: '相对牛基础速度提高 55%' }], uses: ['长途运输、探索和依靠移速走位。'],
    tips: ['先解决蝴蝶翅膀保鲜与批量捕捉，再开始集中制作；它适合速度专精。'], mistakes: ['把它当作战斗增伤鞍，或在没有保鲜方案时让大量翅膀腐坏。'], related: ['butterfly-wings', 'silk', 'living-log']
  }),
  simpleEntry({
    slug: 'saddlehorn', prefab: 'saddlehorn', title: '鞍具脱卸器', english: 'Saddlehorn', aliases: ['鞍具脱卸器', '鞍角', 'Saddlehorn'], category: '工具', stage: '驯牛中期',
    summary: '鞍具脱卸器能安全卸下皮弗娄牛身上的鞍，并保留鞍具耐久，便于切换骑乘专精。',
    crafting: craft([amount('twigs', '树枝', 2), amount('bone-shards', '骨片', 2), amount('jet-feather', '黑色羽毛', 1)], '炼金引擎', '工具', 1, ['首次制作需在炼金引擎旁原型。']),
    acquisition: [acquire('制作', '在炼金引擎旁制作鞍具脱卸器', '准备 2 个树枝、2 个骨片和 1 根黑色羽毛。', '靠近炼金引擎，在“工具”筛选中制作 1 个鞍具脱卸器。')],
    facts: [{ label: '功能', value: '无损卸下牛鞍；使用会消耗工具耐久' }], uses: ['在普通、战争和薄纱牛鞍之间安全切换。'],
    tips: ['更换骑乘用途时主动卸鞍，不必等低服从牛把鞍甩落损耗耐久。'], mistakes: ['靠降低服从度让牛甩鞍，白白消耗昂贵鞍具的耐久。'], related: ['twigs', 'bone-shards', 'jet-feather']
  })
]
