import type { ProgressNode } from '~/types/content'

export const progressNodes: ProgressNode[] = [
  {
    id: 'gather-basics',
    route: 'basic-survival',
    title: '收集草、树枝与燧石',
    stage: '第 1 天',
    summary: '先保证工具和火源，不要在出生点原地停留。',
    requires: ['空背包也可开始'],
    completion: '能制作斧头、鹤嘴锄和至少一支火把',
    related: ['first-day', 'torch']
  },
  {
    id: 'map-key-biomes',
    route: 'basic-survival',
    title: '探索关键资源区',
    stage: '第 2—5 天',
    summary: '沿道路和海岸推进，标记矿区、牛群、猪王与沼泽。',
    requires: ['火把', '基础食物'],
    completion: '地图上至少确认三类长期资源点',
    related: ['first-week', 'pig-king', 'beefalo']
  },
  {
    id: 'science-machine',
    route: 'basic-survival',
    title: '完成第一层科技原型',
    stage: '第 1—5 天',
    summary: '制作科学机器并原型背包、长矛等关键物品。',
    requires: ['金块', '木材', '石头'],
    completion: '成功建造科学机器并解锁基础原型',
    related: ['science-machine', 'first-week']
  },
  {
    id: 'choose-base',
    route: 'basic-survival',
    title: '选择基地位置',
    stage: '第 5—10 天',
    summary: '以交通和资源半径判断位置，避开季节 Boss 的直接落点。',
    requires: ['完成主要区域探索'],
    completion: '基地可在短程内取得食物、燃料和常用材料',
    related: ['base-location', 'alchemy-engine']
  },
  {
    id: 'food-loop',
    route: 'basic-survival',
    title: '建立食物循环',
    stage: '第一周',
    summary: '用烹饪锅、冰箱和可重复食材来源稳定饱食与恢复。',
    requires: ['炼金引擎', '齿轮或稳定食材'],
    completion: '能够连续数天维持主食和战斗恢复',
    related: ['crock-pot', 'ice-box', 'meatballs', 'pierogi']
  },
  {
    id: 'winter-ready',
    route: 'basic-survival',
    title: '完成冬季准备',
    stage: '第 11—20 天',
    summary: '备齐保暖、燃料、食物和巨鹿应对预案。',
    requires: ['稳定基地', '基础护甲'],
    completion: '暖石、保暖装备、燃料与恢复食物齐备',
    related: ['first-winter', 'thermal-stone', 'beefalo-hat', 'deerclops']
  },
  {
    id: 'cave-entry',
    route: 'caves-ruins',
    title: '准备洞穴装备',
    stage: '稳定基地后',
    summary: '带照明、护甲、恢复、食物和返程资源进入洞穴。',
    requires: ['提灯或矿工帽', '护甲', '恢复食物'],
    completion: '能在地下独立维持至少一次完整探索',
    related: ['lantern', 'miner-hat', 'caves-ruins']
  },
  {
    id: 'underground-outpost',
    route: 'caves-ruins',
    title: '建立地下补给点',
    stage: '洞穴初探',
    summary: '在入口附近留下食物、燃料和备用照明，降低往返风险。',
    requires: ['确认安全入口', '基础建材'],
    completion: '入口附近有可补给和整理物资的安全点',
    related: ['caves-ruins', 'lantern']
  },
  {
    id: 'find-ruins',
    route: 'caves-ruins',
    title: '定位远古遗迹',
    stage: '洞穴进阶',
    summary: '沿洞穴生态变化寻找遗迹区域，避免在低理智时盲目推进。',
    requires: ['稳定照明', '理智恢复', '战斗装备'],
    completion: '找到遗迹科技区或迷宫入口并标记路线',
    related: ['caves-ruins', 'ancient-guardian']
  },
  {
    id: 'defeat-guardian',
    route: 'caves-ruins',
    title: '挑战远古守护者',
    stage: '遗迹探索',
    summary: '清理场地、准备照明和护甲，再处理冲撞节奏。',
    requires: ['可靠武器', '多套护甲', '恢复食物'],
    completion: '击败远古守护者并取得迷宫战利品',
    related: ['ancient-guardian', 'hambat', 'football-helmet']
  },
  {
    id: 'boat-ready',
    route: 'lunar-island',
    title: '完成航海准备',
    stage: '稳定基地后',
    summary: '船体、船桨、锚、照明、修船材料和返航食物缺一不可。',
    requires: ['航海科技', '木材与绳索'],
    completion: '可以安全出航、停船并返航',
    related: ['boat-kit', 'lunar-island']
  },
  {
    id: 'find-lunar-island',
    route: 'lunar-island',
    title: '寻找月岛',
    stage: '航海探索',
    summary: '结合世界边缘与地图形状缩小搜索范围，不要无方向远航。',
    requires: ['完整航海装备', '足够食物'],
    completion: '登陆月岛并建立地图标记',
    related: ['lunar-island', 'boat-kit']
  },
  {
    id: 'lunar-tech',
    route: 'lunar-island',
    title: '取得月亮科技资源',
    stage: '月岛阶段',
    summary: '优先了解月岛理智反转和当地资源，再推进后续天体内容。',
    requires: ['月岛安全补给', '采集工具'],
    completion: '收集并带回关键月岛材料',
    related: ['lunar-island', 'boat-kit']
  }
]

// Keep the original 13 node IDs: existing browser saves continue to work.
progressNodes.push(
  { id: 'season-rain', route: 'seasonal-cycle', title: '备齐春季防雨', stage: '冬末春初', summary: '把防雨装备和季节战场提前准备好。', requires: ['稳定食物循环', '防雨材料'], completion: '能在雨天维持探索与补给', related: ['rain-coat', 'eyebrella', 'seasonal-cycle'] },
  { id: 'season-cooling', route: 'seasonal-cycle', title: '建立夏季冷源与预案', stage: '入夏前', summary: '选择地下避暑或带冷源短途行动，保留基地应急物资。', requires: ['防暑装备', '安全补给点'], completion: '降温、灭火与蚁狮预案均已准备', related: ['endothermic-fire-pit', 'thermal-stone', 'antlion'] },
  { id: 'season-loop', route: 'seasonal-cycle', title: '形成可重复的四季循环', stage: '完整年度', summary: '在换季前补齐下一季材料，不临时寻找核心装备。', requires: ['完成一年生存准备'], completion: '保暖、防雨、降温均可重复补给', related: ['seasonal-cycle', 'winter-hat', 'luxury-fan'] },
  { id: 'ruins-supply', route: 'ruins-expedition', title: '确认遗迹补给与撤退线', stage: '遗迹远征前', summary: '携带照明、护甲、理智恢复并标记返程道路。', requires: ['已定位遗迹', '地下补给点'], completion: '能安全往返遗迹与补给点', related: ['ruins-expedition', 'moggles', 'lantern'] },
  { id: 'ruins-tech', route: 'ruins-expedition', title: '取得远古科技与装备', stage: '遗迹探索', summary: '确认远古科技站，按本次远征目标制作铥矿装备。', requires: ['铥矿材料', '安全制作窗口'], completion: '已取得需要的远古装备并留有返程物资', related: ['ancient-pseudoscience-station', 'thulecite-crown', 'thulecite-suit'] },
  { id: 'ruins-return', route: 'ruins-expedition', title: '带回战利品并补足损耗', stage: '远征返程', summary: '结束战斗后优先撤出，再为下一次探索补齐装备。', requires: ['确认出口', '返程照明'], completion: '战利品安全入库且下一次补给可用', related: ['ruins-expedition', 'ancient-guardian'] },
  { id: 'ocean-repair', route: 'ocean-lunar-expedition', title: '备好修船与停泊工具', stage: '远航前', summary: '检查船体、船桨、锚和修船材料，明确返航方向。', requires: ['完成基础航海准备'], completion: '船上可以处理漏水并安全停泊', related: ['boat-patch', 'anchor', 'ocean-lunar-expedition'] },
  { id: 'ocean-resources', route: 'ocean-lunar-expedition', title: '建立海上资源补给', stage: '航海中期', summary: '按需要获取海盐、海带与月岛资源，保留补给位置。', requires: ['可靠船体', '返航食物'], completion: '需要的海洋资源可稳定取得并运回', related: ['salt-crystals', 'kelp-stalk', 'stone-fruit'] },
  { id: 'ocean-boss', route: 'ocean-lunar-expedition', title: '评估海上 Boss 挑战', stage: '航海进阶', summary: '查阅目标机制，先明确修船与战斗分工再决定开战。', requires: ['备用修船材料', '了解目标机制'], completion: '已完成目标挑战或明确记录暂缓原因', related: ['crab-king', 'malbatross', 'boss-logistics'] },
  { id: 'boss-field', route: 'boss-logistics', title: '选择目标与安全战场', stage: '开战前', summary: '把基地、补给和撤退线分开，阅读目标出现条件。', requires: ['目标攻略', '安全撤退方向'], completion: '场地与分工已确认', related: ['boss-logistics', 'deerclops', 'bee-queen'] },
  { id: 'boss-supplies', route: 'boss-logistics', title: '检查武器、护甲与恢复', stage: '战备核对', summary: '将即时治疗与主食分开，留有装备损坏后的替换方案。', requires: ['主武器', '备用护甲', '恢复料理'], completion: '主战与撤退物资均可随时取用', related: ['hambat', 'football-helmet', 'pierogi'] },
  { id: 'boss-retreat', route: 'boss-logistics', title: '约定撤退信号并复盘', stage: '战斗与收尾', summary: '关键机制无人处理或恢复不足时撤退，战后补齐损耗。', requires: ['团队分工或单人撤退路线'], completion: '战利品归档，失败原因与物资缺口已记录', related: ['boss-logistics', 'pan-flute', 'weather-pain'] },
  { id: 'celestial-preparation', route: 'celestial-lunar-rift', title: '完成天体与风暴准备', stage: '天体后期', summary: '查阅天体祭坛与月亮风暴流程，准备任务工具和战斗补给。', requires: ['月岛勘测', '稳定遗迹与航海补给'], completion: '天体任务材料与战场准备就绪', related: ['celestial-altar', 'moon-storm', 'restrained-static'] },
  { id: 'celestial-champion', route: 'celestial-lunar-rift', title: '挑战天体英雄', stage: '天体战斗', summary: '分别了解阶段变化，控制启蒙压力并保留撤退物资。', requires: ['完成天体前置', '多套护甲与恢复'], completion: '击败天体英雄并安全收取战利品', related: ['celestial-champion', 'enlightened-crown', 'celestial-lunar-rift'] },
  { id: 'lunar-rift-loop', route: 'celestial-lunar-rift', title: '确认裂隙选择与亮茄循环', stage: '天体英雄后', summary: '了解世界变化后决定是否开启裂隙；开启后处理敌人与材料循环。', requires: ['位面战备', '基地入侵预案'], completion: '已作出裂隙选择；开启时能补充亮茄装备与材料', related: ['lunar-rift', 'brightshade-husk', 'pure-brilliance'] },
  { id: 'shadow-fuelweaver', route: 'shadow-sanctum', title: '完成织影者与暗影裂隙前置', stage: '暗影后期', summary: '完成遗迹战备，阅读织影者机制与裂隙开启流程。', requires: ['遗迹补给', '恢复与控场'], completion: '织影者前置完成，位面装备与补给已准备', related: ['ancient-fuelweaver', 'shadow-rift', 'void-cowl'] },
  { id: 'sanctum-navigation', route: 'shadow-sanctum', title: '进入圣所并掌握路标导航', stage: '圣所探索', summary: '寻找路标罗盘，团队同步切换房间并安排安全脉冲。', requires: ['圣所入口前置', '团队同步', '返程物资'], completion: '能沿路标抵达钥石房', related: ['sanctum', 'waymark-compass', 'shadow-sanctum'] },
  { id: 'sanctum-keystone', route: 'shadow-sanctum', title: '完成守卫塔战并携钥石撤离', stage: '圣所收尾', summary: '处理守卫塔机制，取得钥石后优先确认撤离；了解重置后果。', requires: ['足够位面防护', '即时治疗', '返程绳索'], completion: '钥石取得且队伍安全撤离', related: ['ancient-guard-tower', 'keystone', 'shadow-sanctum'] }
)

export const routeOrder = ['basic-survival', 'seasonal-cycle', 'caves-ruins', 'ruins-expedition', 'lunar-island', 'ocean-lunar-expedition', 'boss-logistics', 'celestial-lunar-rift', 'shadow-sanctum']

export const routeLabels: Record<string, string> = {
  'basic-survival': '基础生存线',
  'caves-ruins': '洞穴与遗迹线',
  'lunar-island': '月岛基础线',
  'seasonal-cycle': '四季循环',
  'ruins-expedition': '遗迹远征',
  'ocean-lunar-expedition': '航海进阶',
  'boss-logistics': 'Boss 战备与后勤',
  'celestial-lunar-rift': '天体与月亮裂隙',
  'shadow-sanctum': '暗影裂隙与远古圣所'
}

