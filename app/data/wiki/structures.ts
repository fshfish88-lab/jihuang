import type { WikiEntry } from '~/types/wiki'
import { acquire, amount, craft, simpleEntry } from './shared'

export const structureEntries: WikiEntry[] = [
  simpleEntry({
    slug: 'campfire', title: '营火', english: 'Campfire', aliases: ['营火', '篝火'], category: '建筑', stage: '第 1 天',
    summary: '临时照明和烹饪火源，燃尽后消失，不适合作为永久基地中心。',
    crafting: craft([amount('cut-grass', '草', 3), amount('log', '木头', 2)], '徒手制作', '照明'),
    acquisition: [acquire('制作', '放置营火', '准备 3 个草和 2 个木头。', '在安全空地选择“营火”并放置。', '继续添加木头、草等燃料可延长燃烧。')],
    facts: [{ label: '用途', value: '照明、烤制食物、取暖' }], uses: ['临时过夜和远行补给。']
  }),
  simpleEntry({
    slug: 'fire-pit', prefab: 'firepit', title: '火坑', english: 'Fire Pit', aliases: ['火坑', '石头火堆'], category: '建筑', stage: '建家期',
    summary: '可反复添加燃料的固定火源，是基地常用照明点。',
    crafting: craft([amount('log', '木头', 2), amount('rocks', '石头', 12)], '徒手制作', '照明'),
    acquisition: [acquire('制作', '放置火坑', '准备 2 个木头和 12 个石头。', '在基地安全区域放置，周围预留烹饪和通行空间。')],
    facts: [{ label: '用途', value: '永久火源底座' }], uses: ['基地照明、烹饪和取暖。']
  }),
  simpleEntry({
    slug: 'science-machine', prefab: 'researchlab', title: '科学机器', english: 'Science Machine', aliases: ['科学机器', '一本'], category: '建筑', stage: '第 1—3 天',
    summary: '第一层科技站；原型关键物品后可以拆除或留作临时科技点。',
    crafting: craft([amount('gold-nugget', '金块', 1), amount('log', '木头', 4), amount('rocks', '石头', 4)], '徒手制作', '科学'),
    acquisition: [acquire('制作', '建造科学机器', '准备 1 个金块、4 个木头和 4 个石头。', '在“科学”分类选择科学机器并放置。')],
    facts: [{ label: '科技等级', value: '科学 1' }], uses: ['原型背包、长矛、木甲等前期物品。']
  }),
  simpleEntry({
    slug: 'alchemy-engine', prefab: 'researchlab2', title: '炼金引擎', english: 'Alchemy Engine', aliases: ['炼金引擎', '二本'], category: '建筑', stage: '建家期',
    summary: '基地核心科技站，解锁大部分前中期工具、装备和建筑。',
    crafting: craft([amount('boards', '木板', 4), amount('cut-stone', '石砖', 2), amount('electrical-doodad', '电器元件', 2)], '科学机器', '科学'),
    acquisition: [acquire('制作', '建造炼金引擎', '先在科学机器旁制作 4 块木板、2 块石砖和 2 个电器元件。', '在“科学”分类放置炼金引擎。')],
    facts: [{ label: '科技等级', value: '科学 2' }], uses: ['解锁橄榄球头盔、提灯、保暖装备等。']
  }),
  simpleEntry({
    slug: 'crock-pot', prefab: 'cookpot', title: '烹饪锅', english: 'Crock Pot', aliases: ['烹饪锅', '锅'], category: '建筑', stage: '第一周',
    summary: '把四格食材转化为料理，是稳定食物循环的核心建筑。',
    crafting: craft([amount('cut-stone', '石砖', 3), amount('charcoal', '木炭', 6), amount('twigs', '树枝', 6)], '科学机器及以上科技', '食物'),
    acquisition: [acquire('制作', '建造烹饪锅', '准备 3 块石砖、6 个木炭和 6 个树枝。', '在科学机器旁原型并放在基地厨房区域。')],
    facts: [{ label: '槽位', value: '4 格食材' }], uses: ['制作肉丸、波兰水饺等锅料理。']
  }),
  simpleEntry({
    slug: 'ice-box', prefab: 'icebox', title: '冰箱', english: 'Ice Box', category: '建筑', stage: '第一周',
    summary: '使多数食物的腐败速度降为一半，前期齿轮通常优先用于冰箱。',
    crafting: craft([amount('gold-nugget', '金块', 2), amount('gears', '齿轮', 1), amount('boards', '木板', 1)], '炼金引擎', '食物'),
    acquisition: [acquire('制作', '建造冰箱', '准备 2 个金块、1 个齿轮和 1 块木板。', '在炼金引擎旁制作并放在烹饪锅附近。')],
    facts: [{ label: '容量', value: '9 格' }, { label: '保鲜', value: '腐败速度 ×0.5' }], uses: ['储存食材和料理。']
  }),
  simpleEntry({
    slug: 'chest', title: '箱子', english: 'Chest', category: '建筑', stage: '第一周',
    summary: '基础九格储藏建筑；按资源类别分箱比无序堆放更节省时间。',
    crafting: craft([amount('boards', '木板', 3)], '科学机器及以上科技', '容器'),
    acquisition: [acquire('制作', '建造箱子', '准备 3 块木板。', '在科学机器旁原型，放在不会阻挡通道的位置。')],
    facts: [{ label: '容量', value: '9 格' }], uses: ['基地分类储藏。']
  }),
  simpleEntry({
    slug: 'drying-rack', prefab: 'meatrack', title: '晾肉架', english: 'Drying Rack', category: '建筑', stage: '第一周',
    summary: '把肉类晾成保质期更长、理智收益更好的肉干。',
    crafting: craft([amount('twigs', '树枝', 3), amount('charcoal', '木炭', 2), amount('rope', '绳子', 3)], '科学机器及以上科技', '食物'),
    acquisition: [acquire('制作', '建造晾肉架', '准备 3 个树枝、2 个木炭和 3 根绳子。', '在科学机器旁制作，放在基地厨房附近。')],
    facts: [{ label: '大肉晾晒', value: '2 天' }, { label: '小肉晾晒', value: '1 天' }], uses: ['制作肉干并延长储存。']
  }),
  simpleEntry({
    slug: 'tent', title: '帐篷', english: 'Tent', category: '建筑', stage: '前中期',
    summary: '消耗饥饿和时间恢复生命与理智，不应在缺粮时强行睡觉。',
    crafting: craft([amount('silk', '蜘蛛丝', 6), amount('twigs', '树枝', 4), amount('rope', '绳子', 3)], '炼金引擎', '生存'),
    acquisition: [acquire('制作', '搭建帐篷', '准备 6 个蜘蛛丝、4 个树枝和 3 根绳子。', '在炼金引擎旁制作并放置。')],
    facts: [{ label: '耐久', value: '6 次使用' }], uses: ['夜间恢复生命和理智。']
  }),
  simpleEntry({
    slug: 'birdcage', title: '鸟笼', english: 'Birdcage', aliases: ['鸟笼', '鸟笼子'], category: '建筑', stage: '第一周',
    summary: '把肉转成蛋、把作物转成专属种子，是基地食物循环的重要节点。',
    crafting: craft([amount('papyrus', '莎草纸', 2), amount('gold-nugget', '金块', 6), amount('seeds', '种子', 2)], '炼金引擎', '建筑'),
    acquisition: [acquire('制作', '建造并放入鸟', '准备 2 张莎草纸、6 个金块和 2 个种子。', '在炼金引擎旁建造鸟笼。', '用捕鸟陷阱抓一只鸟，再把鸟放入鸟笼。')],
    facts: [{ label: '核心循环', value: '肉 → 蛋；作物 → 种子' }], uses: ['稳定获得蛋和作物种子。']
  }),
  simpleEntry({
    slug: 'lightning-rod', prefab: 'lightning_rod', title: '避雷针', english: 'Lightning Rod', category: '建筑', stage: '春季前',
    summary: '保护附近可燃建筑免受雷击，基地进入春季前应完成覆盖。',
    crafting: craft([amount('gold-nugget', '金块', 4), amount('cut-stone', '石砖', 1)], '科学机器及以上科技', '建筑'),
    acquisition: [acquire('制作', '建造避雷针', '准备 4 个金块和 1 块石砖。', '在科学机器旁制作，放在基地中央并确认覆盖范围。')],
    facts: [{ label: '保护半径', value: '约 2.5 个地皮' }], uses: ['吸引雷击并保护基地。']
  }),
  simpleEntry({
    slug: 'ice-flingomatic', prefab: 'firesuppressor', title: '雪球发射器', english: 'Ice Flingomatic', aliases: ['雪球发射器', '灭火器'], category: '建筑', stage: '夏季前',
    summary: '自动扑灭范围内闷烧和火焰，是夏季基地防火核心。',
    crafting: craft([amount('gears', '齿轮', 2), amount('ice', '冰', 15), amount('electrical-doodad', '电器元件', 2)], '炼金引擎', '建筑'),
    acquisition: [acquire('制作', '建造雪球发射器', '准备 2 个齿轮、15 个冰和 2 个电器元件。', '在炼金引擎旁制作。', '放置后用燃料启动，并检查覆盖范围。')],
    facts: [{ label: '燃料上限', value: '15 天' }], uses: ['夏季灭火和保护作物。']
  }),
  simpleEntry({
    slug: 'bee-box', prefab: 'beebox', title: '蜂箱', english: 'Bee Box', category: '建筑', stage: '基地稳定后',
    summary: '建立可再生蜂蜜来源；周围种花能提高产蜜效率。',
    crafting: craft([amount('boards', '木板', 2), amount('honeycomb', '蜂巢', 1), amount('bee', '蜜蜂', 4)], '科学机器及以上科技', '食物'),
    acquisition: [acquire('制作', '建造蜂箱', '用捕虫网抓 4 只蜜蜂，并拆野生蜂巢取得 1 个蜂巢。', '准备 2 块木板，在科学机器旁建造。', '在附近种植蝴蝶形成的花。')],
    facts: [{ label: '储量', value: '最多 6 个蜂蜜' }], uses: ['稳定生产蜂蜜。']
  }),
  simpleEntry({
    slug: 'pig-house', prefab: 'pighouse', title: '猪屋', english: 'Pig House', category: '建筑', stage: '中期',
    summary: '生成猪人，可提供劳动力、猪皮和大肉，但月圆会变疯猪。',
    crafting: craft([amount('boards', '木板', 4), amount('cut-stone', '石砖', 3), amount('pig-skin', '猪皮', 4)], '炼金引擎', '建筑'),
    acquisition: [acquire('制作', '建造猪屋', '准备 4 块木板、3 块石砖和 4 块猪皮。', '在炼金引擎旁制作，放在与主基地保持安全距离的位置。')],
    facts: [{ label: '刷新', value: '猪人死亡后约 4 天' }], uses: ['招募砍树、建立猪皮与大肉来源。']
  }),
  simpleEntry({
    slug: 'boat-kit', prefab: 'boat_item', title: '船套装', english: 'Boat Kit', aliases: ['船套装', '船'], category: '建筑', stage: '航海准备',
    summary: '部署后形成航海平台；下水前还要准备船桨、锚、船灯和修船材料。',
    crafting: craft([amount('boards', '木板', 4), amount('twigs', '树枝', 4)], '科学机器及以上科技', '航海'),
    acquisition: [acquire('制作', '制作并部署船套装', '准备 4 块木板和 4 个树枝。', '在科学机器旁制作船套装。', '站在海岸边把船套装部署到可到达的水面。')],
    facts: [{ label: '耐久', value: '200' }], uses: ['航海、寻找月岛和海上资源。']
  })
]
