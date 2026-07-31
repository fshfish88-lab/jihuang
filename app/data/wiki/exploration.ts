import type { WikiEntry } from '~/types/wiki'
import { acquire, noCraft, simpleEntry } from './shared'

export const explorationEntries: WikiEntry[] = [
  simpleEntry({
    slug: 'touch-stone', prefab: 'resurrectionstone', title: '试金石', english: 'Touch Stone', aliases: ['试金石', '复活台'], category: '季节与探索', stage: '探索期',
    summary: '地图生成的一次性复活点；发现后先激活并在地图标记。',
    crafting: noCraft('世界生成建筑，不可制作或搬运。'),
    acquisition: [acquire('世界生成', '探索并激活', '在地表探索时寻找四个猪头柱围绕的石台。', '靠近并点击激活。', '死亡成为鬼魂后在已激活试金石处作祟复活。')],
    facts: [{ label: '用途', value: '一次复活' }], uses: ['单人和团队复活保险。']
  }),
  simpleEntry({
    slug: 'glommer-flower', prefab: 'glommerflower', title: '格罗姆花', english: "Glommer's Flower", aliases: ['格罗姆花', '六眼飞鱼花'], category: '季节与探索', stage: '月圆',
    summary: '月圆夜在格罗姆雕像处采集，用于召来格罗姆。',
    crafting: noCraft('不可制作。'),
    acquisition: [acquire('世界生成', '月圆夜采花', '在猪王附近寻找格罗姆雕像。', '月圆夜前往雕像，采集开放的格罗姆花。', '持花时格罗姆会跟随。')],
    facts: [{ label: '刷新', value: '每次月圆' }], uses: ['召来格罗姆并获得格罗姆黏液。']
  }),
  simpleEntry({
    slug: 'deerclops-eyeball', prefab: 'deerclops_eyeball', title: '独眼巨鹿眼球', english: 'Deerclops Eyeball', aliases: ['巨鹿眼球', '眼球'], category: '季节与探索', stage: '冬季 Boss',
    summary: '独眼巨鹿的关键掉落，通常优先制作眼球伞。',
    crafting: noCraft('Boss 掉落，不可制作。'),
    acquisition: [acquire('掉落', '击败独眼巨鹿', '冬季听到巨鹿预警后把它引离基地。', '准备护甲、武器和恢复品后击败。', '每只独眼巨鹿固定掉落 1 个眼球。')],
    facts: [{ label: '掉落', value: '独眼巨鹿 ×1' }], uses: ['眼球伞、恒迪尤斯·舒提尤斯。']
  }),
  simpleEntry({
    slug: 'thick-fur', prefab: 'bearger_fur', title: '熊皮', english: 'Thick Fur', aliases: ['熊皮', '厚皮毛'], category: '季节与探索', stage: '秋季 Boss',
    summary: '熊獾的关键掉落，用于保鲜熊皮包和冬眠熊皮背心。',
    crafting: noCraft('Boss 掉落，不可制作。'),
    acquisition: [acquire('掉落', '击败熊獾', '把熊獾引离基地。', '可利用它砍树并引出树精消耗血量。', '击败后取得熊皮。')],
    facts: [{ label: '掉落', value: '熊獾 ×1' }], uses: ['保鲜熊皮包和冬眠熊皮背心。']
  }),
  simpleEntry({
    slug: 'scales', prefab: 'dragon_scales', title: '鳞片', english: 'Scales', aliases: ['龙鳞', '鳞片'], category: '季节与探索', stage: '龙蝇',
    summary: '龙蝇掉落的后期材料，用于鳞片箱和鳞片地板等。',
    crafting: noCraft('Boss 掉落，不可制作。'),
    acquisition: [acquire('掉落', '击败龙蝇', '在沙漠岩浆池区域找到龙蝇。', '准备墙体、护甲、灭火与群体控制方案。', '击败后收集鳞片。')],
    facts: [{ label: '来源', value: '龙蝇' }], uses: ['鳞片箱、鳞片地板和火炉。']
  }),
  simpleEntry({
    slug: 'guardian-horn', prefab: 'minotaurhorn', title: '守护者之角', english: "Guardian's Horn", aliases: ['守护者之角', '远古犀牛角'], category: '季节与探索', stage: '遗迹',
    summary: '远古守护者的独特掉落，是制作建造护符的重要材料。',
    crafting: noCraft('Boss 掉落，不可制作。'),
    acquisition: [acquire('掉落', '击败远古守护者', '在遗迹迷宫寻找远古守护者。', '清理场地并利用冲撞后的硬直攻击。', '击败后取得守护者之角。')],
    facts: [{ label: '来源', value: '远古守护者' }], uses: ['建造护符等远古科技。']
  }),
  simpleEntry({
    slug: 'celestial-orb', prefab: 'moonrockseed', title: '天体宝球', english: 'Celestial Orb', aliases: ['天体宝球', '月岩宝球'], category: '季节与探索', stage: '月岛前置',
    summary: '陨石区的关键世界物品，携带后可部署天体祭坛相关科技。',
    crafting: noCraft('世界掉落，不可制作。'),
    acquisition: [acquire('世界生成', '开采可疑月岩', '在陨石区寻找外观特殊的可疑月岩。', '用镐开采后获得天体宝球。', '把它带到安全地点部署天体科技。')],
    facts: [{ label: '来源', value: '可疑月岩' }], uses: ['解锁天体制作科技。']
  }),
  simpleEntry({
    slug: 'iridescent-gem', prefab: 'opalpreciousgem', title: '彩虹宝石', english: 'Iridescent Gem', aliases: ['彩虹宝石', '虹光宝石'], category: '季节与探索', stage: '月圆事件',
    summary: '完成月石事件后获得的关键宝石，用于天体路线和唤星者法杖升级。',
    crafting: noCraft('事件奖励，不可直接制作。'),
    acquisition: [acquire('世界生成', '完成月石事件', '找到月石基座并修复。', '月圆夜插入唤星者法杖，防守猎犬波次。', '事件完成后取得彩虹宝石。')],
    facts: [{ label: '来源', value: '月石事件' }], uses: ['天体路线和唤月者法杖。']
  }),
  simpleEntry({
    slug: 'pure-brilliance', prefab: 'purebrilliance', title: '纯粹辉煌', english: 'Pure Brilliance', aliases: ['纯粹辉煌', '辉煌'], category: '季节与探索', stage: '月亮裂隙',
    summary: '月亮阵营后期材料，用于亮茄装备和裂隙科技。',
    crafting: noCraft('裂隙资源，不可在普通制作栏直接制作。'),
    acquisition: [acquire('掉落', '月亮裂隙内容', '推进天体路线并开启月亮裂隙。', '处理亮茄相关生物和资源。', '收集其掉落的纯粹辉煌。')],
    facts: [{ label: '阵营', value: '月亮' }], uses: ['亮茄装备和裂隙科技。']
  }),
  simpleEntry({
    slug: 'dreadstone', title: '绝望石', english: 'Dreadstone', aliases: ['绝望石', '恐惧石'], category: '季节与探索', stage: '暗影裂隙',
    summary: '暗影阵营后期材料，用于绝望石装备与裂隙科技。',
    crafting: noCraft('裂隙资源，不可在普通制作栏直接制作。'),
    acquisition: [acquire('掉落', '暗影裂隙内容', '推进远古织影者路线并开启暗影裂隙。', '处理墨荒相关生物和资源。', '收集绝望石。')],
    facts: [{ label: '阵营', value: '暗影' }], uses: ['绝望石装备和裂隙科技。']
  })
]
