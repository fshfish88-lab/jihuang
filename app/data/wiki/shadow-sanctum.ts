import {
  buildRouteEntries,
  cursedConfrontationSource,
  fight,
  roadmap2026Source
} from './advanced-shared'

const currentSources = [cursedConfrontationSource, roadmap2026Source]

export const shadowSanctumEntries = buildRouteEntries('暗影圣所', 'shadow-sanctum', [
  {
    slug: 'shadow-rift', prefab: 'shadowrift_portal', title: '暗影裂隙', english: 'Shadow Rift', category: '季节与探索', stage: '织影者后',
    summary: '击败远古织影者后可开启的暗影世界状态，会生成绝望石、暗影裂隙生物与虚空科技资源。', obtain: ['击败远古织影者，解锁暗影阵营后期流程。', '按暗影裂隙装置提示投入对应关键物，确认后开启。', '开启前准备位面护甲并远离核心基地测试新敌人。'], facts: [['世界影响', '持续生成暗影阵营裂隙内容'], ['前置', '远古织影者']], related: ['ancient-fuelweaver', 'dreadstone', 'void-cowl'], sources: currentSources
  },
  {
    slug: 'dreadstone-helm', prefab: 'dreadstonehat', title: '绝望石头盔', english: 'Dreadstone Helm', category: '装备', stage: '暗影裂隙',
    summary: '高物理减伤并带位面防御的头盔，理智较高时可逐步恢复耐久。',
    materials: [['dreadstone', '绝望石', 4], ['pure-horror', '纯粹恐惧', 4]], station: '暗影制作站', filter: '暗影制作',
    requirements: ['当前配方第二项为纯粹恐惧 ×4；纯粹恐惧由暗影裂隙生物掉落。'], obtain: ['开启暗影裂隙并开采绝望石。', '在暗影制作站旁投入绝望石 ×4、纯粹恐惧 ×4。', '保持理智以启用耐久恢复；启蒙状态不会恢复。'], facts: [['减伤', '90%'], ['位面防御', '5'], ['耐久', '840，可恢复']], related: ['dreadstone', 'dreadstone-armour'], sources: currentSources
  },
  {
    slug: 'dreadstone-armour', prefab: 'armordreadstone', title: '绝望石盔甲', english: 'Dreadstone Armor', aliases: ['绝望石甲'], category: '装备', stage: '暗影裂隙',
    summary: '可在理智充足时恢复耐久的高减伤身体护甲，适合长期暗影路线。',
    materials: [['dreadstone', '绝望石', 6], ['pure-horror', '纯粹恐惧', 4]], station: '暗影制作站', filter: '暗影制作',
    requirements: ['需要绝望石 ×6、纯粹恐惧 ×4。'], obtain: ['开采暗影裂隙绝望石并收集纯粹恐惧。', '在暗影制作站旁投入绝望石 ×6、纯粹恐惧 ×4。', '离战后恢复理智，让护甲自行修复再入场。'], facts: [['减伤', '90%'], ['位面防御', '5'], ['特点', '理智驱动恢复']], related: ['dreadstone', 'dreadstone-helm'], sources: currentSources
  },
  {
    slug: 'void-cowl', prefab: 'voidclothhat', title: '虚空风帽', english: 'Void Cowl', category: '装备', stage: '暗影制作站',
    summary: '暗影位面头盔，可强化虚空武器并免受瘴气伤害。',
    materials: [['pure-horror', '纯粹恐惧', 4], ['dark-tatters', '暗影碎布', 2]], station: '暗影制作台座', filter: '暗影制作',
    requirements: ['需要纯粹恐惧 ×4、暗影碎布 ×2。'], obtain: ['开启暗影裂隙，击败裂隙生物取得纯粹恐惧和暗影碎布。', '在暗影制作台座旁投入纯粹恐惧 ×4、暗影碎布 ×2。'], facts: [['减伤', '80%'], ['位面防御', '10'], ['耐久', '830']], related: ['void-robe', 'shadow-reaper'], sources: currentSources
  },
  {
    slug: 'void-robe', prefab: 'armor_voidcloth', title: '虚空长袍', english: 'Void Robe', category: '装备', stage: '暗影制作站',
    summary: '暗影位面身体护甲，与虚空风帽组成套装后提高对暗影阵营的防护。',
    materials: [['pure-horror', '纯粹恐惧', 4], ['dark-tatters', '暗影碎布', 2]], station: '暗影制作台座', filter: '暗影制作',
    requirements: ['材料为纯粹恐惧 ×4、暗影碎布 ×2。'], obtain: ['在暗影裂隙收集纯粹恐惧和暗影碎布。', '在暗影制作台座旁投入各自数量制作。', '与虚空风帽配套并准备虚空修理包。'], facts: [['减伤', '80%'], ['位面防御', '10'], ['套装', '提高暗影阵营防护']], related: ['void-cowl', 'shadow-reaper'], sources: currentSources
  },
  {
    slug: 'shadow-reaper', prefab: 'voidcloth_scythe', title: '暗影收割者', english: 'Shadow Reaper', aliases: ['暗影镰刀'], category: '装备', stage: '暗影制作站',
    summary: '虚空近战武器，可随连续命中提高伤害；受击或断连会失去叠层。',
    materials: [['pure-horror', '纯粹恐惧', 3], ['dark-tatters', '暗影碎布', 1]], station: '暗影制作台座', filter: '暗影制作',
    requirements: ['需要纯粹恐惧 ×3、暗影碎布 ×1。'], obtain: ['先制作虚空风帽以获得完整武器增益。', '在暗影制作台座旁投入纯粹恐惧 ×3、暗影碎布 ×1。', '战斗时保持连续命中，受击后重新叠层。'], facts: [['伤害', '38 物理 + 18 位面'], ['机制', '佩戴虚空风帽时连续命中增伤']], related: ['void-cowl', 'void-robe'], sources: currentSources
  },
  {
    slug: 'sanctum', prefab: 'vault_ground_pattern', title: '远古圣所', english: 'Sanctum', category: '季节与探索', stage: '2026 暗影路线',
    summary: '从远古档案巨型漩涡进入的房间式区域，依靠路标传送，最终目标是钥石房。', obtain: ['完成洞穴遗迹与远古织影者前置。', '在远古档案找到巨型漩涡并进入；传送类手段不能直接进入。', '所有队员同时站上圣所路标才能切换房间；沿路搜寻路标罗盘。', '到达钥石房后处理四座远古守卫塔并取得钥石。'], facts: [['入口', '远古档案巨型漩涡'], ['导航', '圣所路标'], ['目标', '钥石']], related: ['waymark-compass', 'ancient-guard-tower', 'keystone'], sources: currentSources
  },
  {
    slug: 'waymark-compass', prefab: 'vault_compass', title: '路标罗盘', english: 'Waymark Compass', category: '工具', stage: '圣所导航',
    summary: '圣所内拾取的导航工具，手持时指向通往钥石房的正确路标并吸引安全脉冲。', obtainType: '世界生成', obtain: ['在圣所的剧目房、国王雕像房或发电机房搜索。', '拾取后手持，观察屏幕方向提示。', '最多可吸引 4 个附近安全脉冲；带到脉冲托架完成守卫塔机制。'], facts: [['生效区域', '仅圣所'], ['导航目标', '钥石房'], ['附加', '吸引最多 4 个安全脉冲']], related: ['sanctum', 'ancient-guard-tower', 'keystone'], sources: currentSources
  },
  {
    slug: 'ancient-guard-tower', prefab: 'vault_pillar_guard', title: '远古守卫塔', english: 'Ancient Guard Tower', category: '生物', stage: '圣所钥石房',
    summary: '钥石房的四座守卫塔，免疫冰冻、催眠和电击；半血时会进入易伤眩晕。', obtainType: '掉落', obtain: ['在钥石房把 4 个安全脉冲送入对应托架，唤醒四座塔。', '逐座击败可取得铥矿、月岩和守卫塔组件。'], facts: [['生命', '每座 6000'], ['攻击', '对玩家 75'], ['免疫', '电击、冰冻、催眠']],
    combat: fight(['钥石房四个脉冲托架全部激活后苏醒。'], ['位面护甲', '分散仇恨的走位空间', '足量恢复'], ['集中攻击一座，避免平均压血。', '躲开击退攻击。', '塔低于半血眩晕 15 秒时全力输出。'], ['两座以上同时贴身。', '补给被击退到房间边缘。'], [{ slug: 'thulecite', name: '铥矿', amount: '2—3/座' }, { slug: 'moon-rock', name: '月岩', amount: '2—3/座' }, { name: '守卫塔组件', amount: '每座 1 件' }]), related: ['waymark-compass', 'keystone', 'thulecite'], sources: currentSources
  },
  {
    slug: 'keystone', prefab: 'vault_key', title: '钥石', english: 'Keystone', category: '资源', stage: '圣所终点',
    summary: '钥石房圣物箱中的主线物品，可交给远古大门旁招引之手以重置圣所。', obtainType: '世界生成', obtain: ['用路标罗盘抵达钥石房。', '激活并击败四座远古守卫塔，解除圣物箱保护。', '从圣物箱取出钥石；它不能带到地表。', '击败织影者后，先交 5 绝望石修复远古大门，再确认是否交付钥石重置圣所。'], facts: [['携带限制', '不能带往地表'], ['用途', '重置圣所']], related: ['sanctum', 'ancient-guard-tower', 'dreadstone'], sources: currentSources
  },
  {
    slug: 'geothermite', prefab: 'mite', title: '地热螨', english: 'Geothermite', category: '生物', stage: '圣所地热区',
    summary: '圣所地热生态中的昆虫敌人，击杀后有机会掉落制作热能工具的热腺体。', obtainType: '掉落', obtain: ['在圣所地热喷口生态房间寻找。', '击杀后检查热腺体掉落；2026 年 6 月补丁将掉率提高到 50%。'], facts: [['掉落率', '热腺体 50%（2026-06 补丁）'], ['环境', '地热喷口区']],
    combat: fight(['圣所地热喷口区域生成。'], ['耐热或火焰防护', '基础护甲', '不要站在喷口上'], ['先引离喷口。', '躲开扑击后反击。', '清场后再拾取热腺体。'], ['体温快速上升。', '多只地热螨和喷口攻击重叠。'], [{ slug: 'heat-gland', name: '热腺体', amount: '50% 概率' }]), related: ['heat-gland', 'thermal-balm'], sources: currentSources
  },
  {
    slug: 'heat-gland', prefab: 'mitegland', title: '热腺体', english: 'Heat Gland', category: '资源', stage: '2026 热能科技',
    summary: '地热螨掉落的可食用热能材料，是炽热斧、炎热镐和热疗药膏的核心原料。', obtainType: '掉落', obtain: ['在圣所地热区击杀地热螨，当前掉落率为 50%。', '生食会在 60 秒内提高体温并以理智为代价恢复属性。', '需要制作时保持生鲜；烤熟后不能用于配方。'], facts: [['掉率', '50%'], ['腐败', '6 天'], ['注意', '烤熟后不能制作']], related: ['geothermite', 'ardent-axe', 'pyretic-pickaxe', 'thermal-balm'], sources: currentSources
  },
  {
    slug: 'ardent-axe', prefab: 'fumaroleaxe', title: '炽热斧', english: 'Ardent Axe', category: '工具', stage: '2026 热能科技',
    summary: '储存温度的高效斧；越热砍伐越快并强化对冻结目标伤害，完全冷却会损坏。',
    materials: [['twigs', '树枝', 4], ['heat-gland', '热腺体', 2], ['nitre', '硝石', 3]], station: '炼金引擎', filter: '工具',
    obtain: ['保持热腺体未烤熟。', '在炼金引擎旁投入树枝 ×4、热腺体 ×2、硝石 ×3。', '靠近热源加热；降到 0°C 以下会损坏，重新加热到 60°C 以上修复。'], facts: [['热时效率', '+50%'], ['耐久', '使用不耗；完全冷却损失 25%'], ['特殊', '对冻结目标额外伤害']], related: ['heat-gland', 'twigs', 'nitre'], sources: currentSources
  },
  {
    slug: 'pyretic-pickaxe', prefab: 'fumarolepickaxe', title: '炎热镐', english: 'Pyretic Pickaxe', category: '工具', stage: '2026 热能科技',
    summary: '温度越高开采越快的热能镐，完全冷却会损坏，可通过重新加热修复工作状态。',
    materials: [['twigs', '树枝', 4], ['heat-gland', '热腺体', 2], ['nitre', '硝石', 3]], station: '炼金引擎', filter: '工具',
    obtain: ['在炼金引擎旁投入树枝 ×4、未烹饪热腺体 ×2、硝石 ×3。', '靠近火源把温度提高到 60°C 以上获得高效率。', '完全冷却后重新加热可恢复可装备状态。'], facts: [['热时效率', '+50%'], ['耐久', '开采不耗；完全冷却损失 25%'], ['伤害', '27.2，热时克制冻结目标']], related: ['heat-gland', 'pickaxe', 'nitre'], sources: currentSources
  },
  {
    slug: 'thermal-balm', prefab: 'healingsalve_fumarole', title: '热疗药膏', english: 'Thermal Balm', aliases: ['隔热药膏'], category: '工具', stage: '2026 夏季防护',
    summary: '一次性治疗并提供 4 分钟过热防护和火焰免疫的药膏。',
    materials: [['ash', '灰烬', 2], ['flint', '燧石', 1], ['heat-gland', '热腺体', 1]], station: '炼金引擎', filter: '治疗',
    obtain: ['燃烧物品取得灰烬，击杀地热螨取得未烹饪热腺体。', '在炼金引擎旁投入灰烬 ×2、燧石 ×1、热腺体 ×1。', '高温或火焰战前使用，效果持续 4 分钟。'], facts: [['治疗', '20'], ['效果', '4 分钟过热防护与火焰免疫'], ['堆叠', '40']], related: ['heat-gland', 'ash', 'flint'], sources: currentSources
  }
])
