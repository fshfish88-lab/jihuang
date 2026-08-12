import { buildRouteEntries, fight } from './advanced-shared'

export const oceanLunarEntries = buildRouteEntries('航海月岛', 'ocean-lunar-expedition', [
  {
    slug: 'boat-patch', prefab: 'boatpatch', title: '船补丁', english: 'Boat Patch', category: '工具', stage: '出海前',
    summary: '修复船体受损部位的消耗品，远航至少随身携带两份。',
    materials: [['boards', '木板', 1]], station: '科学机器', filter: '航海', yield: 3,
    requirements: ['另需蜂刺 ×2；配方每次产出 3 个船补丁。'], obtain: ['击杀蜜蜂收集蜂刺。', '在科学机器旁投入木板 ×1、蜂刺 ×2，制作 3 个。', '船体出现漏点时手持补丁对破损处使用。'], facts: [['产量', '3'], ['用途', '修复船体漏点']], related: ['boards', 'stinger', 'boat-kit']
  },
  {
    slug: 'mast', prefab: 'mast_item', title: '桅杆', english: 'Mast Kit', category: '建筑', stage: '基础航行',
    summary: '放置在船上的风帆动力装置，展开后利用风向提高航速。',
    materials: [['boards', '木板', 3], ['rope', '绳子', 3], ['silk', '蜘蛛丝', 8]], station: '智囊团', filter: '航海',
    obtain: ['先在船上放置智囊团解锁航海配方。', '投入木板 ×3、绳子 ×3、蜘蛛丝 ×8制作桅杆套装。', '放到船中央附近，避免阻挡舵轮和锚。'], facts: [['动力', '风帆'], ['操作', '升帆/降帆']], related: ['boards', 'rope', 'silk']
  },
  {
    slug: 'steering-wheel', prefab: 'steeringwheel_item', title: '舵轮', english: 'Steering Wheel Kit', category: '建筑', stage: '基础航行',
    summary: '控制船舶转向的船载建筑，需搭配桅杆或划桨产生推进。',
    materials: [['boards', '木板', 2], ['rope', '绳子', 1]], station: '智囊团', filter: '航海',
    obtain: ['在智囊团旁投入木板 ×2、绳子 ×1。', '放在视野开阔且靠近驾驶位置的船面。', '操舵时提前转向，避免高速撞礁。'], facts: [['用途', '控制转向'], ['动力', '自身不提供推进']], related: ['mast', 'oar', 'anchor']
  },
  {
    slug: 'anchor', prefab: 'anchor_item', title: '锚', english: 'Anchor Kit', category: '建筑', stage: '安全停船',
    summary: '抛锚后让船快速减速并固定，适合靠岸、钓鱼和风浪应急。',
    materials: [['boards', '木板', 2], ['cut-stone', '石砖', 3], ['rope', '绳子', 3]], station: '智囊团', filter: '航海',
    obtain: ['在智囊团旁投入木板 ×2、石砖 ×3、绳子 ×3。', '放在不影响驾驶动线的船缘。', '靠近目标前提前降帆并抛锚。'], facts: [['用途', '制动与固定'], ['操作', '升锚/抛锚']], related: ['steering-wheel', 'mast', 'cut-stone']
  },
  {
    slug: 'oar', prefab: 'oar', title: '船桨', english: 'Oar', category: '工具', stage: '应急航行',
    summary: '手动推动和转向木船的基础工具，适合短途与帆具损坏后的返程。',
    materials: [['log', '木头', 1]], station: '科学机器', filter: '航海',
    obtain: ['在科学机器旁用木头 ×1制作。', '站在船缘对水面划动，向反方向推动船体。', '远航准备备用船桨，避免桅杆损坏后失去动力。'], facts: [['耐久', '500 次划动'], ['用途', '手动推进']], related: ['log', 'mast', 'steering-wheel']
  },
  {
    slug: 'boat-lantern', prefab: 'mastupgrade_lamp_item', title: '甲板照明灯', english: 'Deck Illuminator', aliases: ['船灯'], category: '建筑', stage: '夜间航行',
    summary: '安装在桅杆或翼帆上的可添燃料照明附件，夜航时能腾出手持栏。',
    materials: [['boards', '木板', 1], ['rope', '绳子', 2], ['flint', '燧石', 4]], station: '智囊团', filter: '航海',
    requirements: ['只能安装在桅杆或翼帆上，且不能与避雷导线同时安装。'], obtain: ['在智囊团旁投入木板 ×1、绳子 ×2、燧石 ×4制作。', '把套件部署到桅杆或翼帆上。', '使用可燃物补充燃料，满燃料可持续照明约 6 分钟。'], facts: [['照明时长', '满燃料约 6 分钟'], ['安装位置', '桅杆或翼帆']], related: ['boards', 'rope', 'flint', 'mast']
  },
  {
    slug: 'salt-box', prefab: 'saltbox', title: '盐盒', english: 'Salt Box', category: '建筑', stage: '月岛补给',
    summary: '专门储存食材并显著减缓腐败，不能存放非食物物品。',
    materials: [['cut-stone', '石砖', 2], ['blue-gem', '蓝宝石', 1]], station: '炼金引擎', filter: '食物与园艺',
    requirements: ['另需盐晶 ×10。'], obtain: ['在海上盐堆开采盐晶。', '在炼金引擎旁投入盐晶 ×10、石砖 ×2、蓝宝石 ×1。', '放在烹饪区，按食材类型分类。'], facts: [['容量', '9 格'], ['保鲜', '腐败速度 ×0.25']], related: ['salt-crystals', 'cut-stone', 'ice-box']
  },
  {
    slug: 'salt-crystals', prefab: 'saltrock', title: '盐晶', english: 'Salt Crystals', aliases: ['盐块'], category: '资源', stage: '海上采集',
    summary: '从海上盐堆开采的航海资源，用于盐盒和部分海洋配方。', obtainType: '采集', obtain: ['在深色海域寻找盐堆。', '乘船靠近后用镐反复开采。', '留意船体位置，避免开采时被浪推离。'], facts: [['来源', '海上盐堆'], ['工具', '镐']], uses: ['制作盐盒和海洋相关物品。'], related: ['pickaxe', 'salt-box']
  },
  {
    slug: 'cookie-cutter', prefab: 'cookiecutter', title: '饼干切割机', english: 'Cookie Cutter', aliases: ['饼干鲨'], category: '生物', stage: '海上危险',
    summary: '会咬船底形成漏点的海洋生物；航行中听到咬船声要立即检查。', obtainType: '掉落', obtain: ['在盐堆等海域附近航行时遭遇。', '击杀后取得饼干切割机壳，可用于航海制作。'], facts: [['生命', '100'], ['威胁', '攻击船体']],
    combat: fight(['盐堆附近海域生成，会从船下攻击。'], ['船补丁至少 2 个', '近战武器', '降低船速'], ['听到咬船声立即降帆。', '靠船缘攻击冒头个体。', '战后先修复漏点再继续航行。'], ['同时出现多个漏点。', '船体耐久接近一半。'], [{ name: '饼干切割机壳', amount: '1' }, { slug: 'monster-meat', name: '怪物肉', amount: '1' }]), related: ['boat-patch', 'monster-meat']
  },
  {
    slug: 'lunar-island', prefab: 'moon_altar_rock_idol', title: '月岛', english: 'Lunar Island', category: '季节与探索', stage: '航海中期',
    summary: '位于主大陆外海的启蒙生态岛屿，拥有石果、海带、月蛾和天体祭坛组件。', obtain: ['沿主大陆海岸勘测轮廓，寻找地图边缘明显缺口。', '携带桅杆、舵轮、锚、船补丁和返程补给出海。', '登岛后先记录海岸位置，再寻找三组天体祭坛部件。'], facts: [['理智机制', '启蒙值取代理智'], ['核心资源', '月岩、石果、海带']], related: ['boat-kit', 'stone-fruit', 'kelp-stalk', 'celestial-altar']
  },
  {
    slug: 'stone-fruit', prefab: 'rock_avocado_fruit', title: '石果', english: 'Stone Fruit', category: '资源', stage: '月岛采集',
    summary: '石果灌木产出的带壳食材，开壳后可烹饪或继续移植种植。', obtainType: '采集', obtain: ['在月岛寻找成熟石果灌木并采集。', '把带壳石果放在地面，用镐开壳。', '挖取灌木移植后需施肥，才能在基地继续生产。'], facts: [['工具', '镐开壳'], ['用途', '蔬菜食材']], related: ['pickaxe', 'manure']
  },
  {
    slug: 'kelp-stalk', prefab: 'kelp', title: '海带茎', english: 'Kelp Stalk', aliases: ['公牛海带茎'], category: '资源', stage: '月岛移植',
    summary: '可种入近岸海水并持续产出海带叶，是稳定蔬菜与理智食材来源。', obtainType: '采集', obtain: ['在月岛海滩捡取搁浅的海带茎。', '带回基地附近的海岸，站在岸边种入海水。', '成熟后定期采集海带叶，根茎保留继续生长。'], facts: [['种植', '近岸海水'], ['产物', '海带叶']], related: ['kelp-fronds', 'lunar-island']
  },
  {
    slug: 'moon-moth', prefab: 'moonbutterfly', title: '月蛾', english: 'Moon Moth', category: '生物', stage: '月岛生态',
    summary: '月岛特有飞虫，可用于种植月树并提供启蒙生态资源。', obtainType: '采集', obtain: ['白天在月岛月树附近寻找。', '用捕虫网捕捉；也可让其落地后种植为月树苗。'], facts: [['工具', '捕虫网'], ['用途', '种植月树']],
    combat: fight(['白天在月树附近生成。'], ['捕虫网', '背包空位'], ['靠近后预判飞行路线。', '挥网捕捉，不要用武器误杀。'], ['捕虫网耐久不足。'], [{ name: '月蛾', amount: '活体 1' }, { name: '月蛾翅膀', amount: '击杀后 1' }]), related: ['bug-net', 'lunar-island']
  },
  {
    slug: 'glass-cutter', prefab: 'glasscutter', title: '玻璃刀', english: 'Glass Cutter', category: '装备', stage: '月岛科技',
    summary: '由月亮碎片打造的高伤近战武器，攻击暗影生物时耐久消耗更慢。',
    materials: [['boards', '木板', 1], ['moon-shard', '月亮碎片', 6]], station: '天体祭坛', filter: '天体',
    obtain: ['在月岛组装天体祭坛。', '开采月岩或月亮玻璃取得碎片。', '在祭坛旁投入木板 ×1、月亮碎片 ×6。'], facts: [['伤害', '68'], ['耐久', '75 次；对暗影目标更省耐久']], related: ['moon-shard', 'celestial-altar', 'dark-sword']
  },
  {
    slug: 'moon-dial', prefab: 'moondial', title: '月晷', english: 'Moon Dial', category: '建筑', stage: '月相观测',
    summary: '显示月相并在满月时盛满月光水，是天体路线的观测建筑。',
    materials: [['moon-rock', '月岩', 2], ['blue-gem', '蓝宝石', 2], ['cut-stone', '石砖', 2]], station: '魔法科技', filter: '魔法',
    obtain: ['准备月岩 ×2、蓝宝石 ×2、石砖 ×2。', '在灵子分解器旁原型并放置在无遮挡区域。', '根据水面高度判断月相，满月时靠近观察。'], facts: [['用途', '显示月相'], ['满月', '水面充盈']], related: ['moon-rock', 'blue-gem', 'lunar-island']
  }
])
