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

export const routeOrder = ['basic-survival', 'caves-ruins', 'lunar-island']

export const routeLabels: Record<string, string> = {
  'basic-survival': '基础生存线',
  'caves-ruins': '洞穴与遗迹线',
  'lunar-island': '月岛与天体线'
}

