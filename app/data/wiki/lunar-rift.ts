import { buildRouteEntries, fight } from './advanced-shared'

export const lunarRiftEntries = buildRouteEntries('天体裂隙', 'celestial-lunar-rift', [
  {
    slug: 'celestial-altar', prefab: 'moon_altar', title: '天体祭坛', english: 'Celestial Altar', category: '建筑', stage: '月岛科技',
    summary: '由月岛三组沉重部件拼装的天体制作站，是玻璃刀、天体传送门与亮茄科技的前置。', obtain: ['在月岛找到三个被月岩包裹的祭坛底座。', '开采外壳，搬运对应沉重部件到各自裂缝处组装。', '三座祭坛都可解锁天体制作配方。'], facts: [['组成', '基座 / 宝球 / 神像'], ['位置', '月岛']], related: ['lunar-island', 'moon-rock', 'glass-cutter']
  },
  {
    slug: 'celestial-portal', prefab: 'multiplayer_portal_moonrock', title: '天体传送门', english: 'Celestial Portal', category: '建筑', stage: '天体主线',
    summary: '升级绚丽之门后形成的角色更换与天体路线建筑。', obtain: ['在天体祭坛旁制作传送门用具。', '把传送门用具交给绚丽之门，再持续投入月岩完成升级。', '升级前清理门周围空间，避免部件被遮挡。'], facts: [['前身', '绚丽之门'], ['主要材料', '传送门用具与月岩']], related: ['celestial-altar', 'moon-rock', 'celestial-orb']
  },
  {
    slug: 'moon-storm', prefab: 'moonstorm_static_item', title: '月亮风暴', english: 'Moon Storm', category: '季节与探索', stage: '天体任务',
    summary: '瓦格斯塔夫天体任务产生的局部风暴，遮挡视野并生成约束静电。', obtain: ['完成月岛祭坛和天体传送门相关前置。', '跟随瓦格斯塔夫在地图标记区域寻找风暴。', '佩戴天文护目镜进入，收集约束静电并保护实验。'], facts: [['装备要求', '天文护目镜'], ['资源', '约束静电']], related: ['restrained-static', 'celestial-portal']
  },
  {
    slug: 'restrained-static', prefab: 'moonstorm_static_item', title: '约束静电', english: 'Restrained Static', category: '资源', stage: '月亮风暴',
    summary: '月亮风暴中捕获的任务资源，用于瓦格斯塔夫实验与天体英雄前置。', obtainType: '采集', obtain: ['佩戴天文护目镜进入月亮风暴。', '接近风暴中的静电并使用约束静电装置捕获。', '按任务要求交给瓦格斯塔夫，不要在途中更换世界。'], facts: [['来源', '月亮风暴'], ['用途', '天体实验']], related: ['moon-storm', 'celestial-champion']
  },
  {
    slug: 'celestial-champion', prefab: 'alterguardian_phase3', title: '天体英雄', english: 'Celestial Champion', aliases: ['天体冠军', '月亮Boss'], category: '生物', stage: '天体主线Boss',
    summary: '天体路线终局的三阶段 Boss，激光、月刃和启蒙压力逐阶段增加。', obtainType: '掉落', obtain: ['完成月亮风暴实验并组装天体贡品。', '在指定区域启动装置召唤三阶段天体英雄。', '击败后取得启迪碎片并可开启裂隙循环。'], facts: [['阶段', '3'], ['阵营', '月亮']],
    combat: fight(['完成瓦格斯塔夫月亮风暴任务后召唤。'], ['大量护甲与恢复', '移速手段', '控制启蒙值的食物和装备'], ['一阶段绕开滚动和地刺。', '二阶段保持侧向移动躲月刃。', '三阶段看准激光预警，远离召唤区。'], ['启蒙值接近失控。', '队伍在阶段转换时补给断档。'], [{ name: '启迪碎片', amount: '1' }, { slug: 'pure-brilliance', name: '纯粹辉煌', amount: '多块' }]), related: ['pure-brilliance', 'enlightened-crown', 'lunar-rift']
  },
  {
    slug: 'enlightened-crown', prefab: 'alterguardianhat', title: '启迪之冠', english: 'Enlightened Crown', category: '装备', stage: '天体英雄后',
    summary: '天体英雄核心战利品制作的头部装备，高启蒙时可触发小虚影攻击。',
    materials: [['pure-brilliance', '纯粹辉煌', 4]], station: '天体祭坛', filter: '天体',
    requirements: ['另需启迪碎片 ×1；由天体英雄最终阶段掉落。'], obtain: ['击败天体英雄取得启迪碎片。', '在天体祭坛旁投入启迪碎片 ×1、纯粹辉煌 ×4。'], facts: [['耐久', '启蒙机制装备'], ['特效', '高启蒙时召唤小虚影']], related: ['celestial-champion', 'pure-brilliance']
  },
  {
    slug: 'lunar-rift', prefab: 'lunarrift_portal', title: '月亮裂隙', english: 'Lunar Rift', aliases: ['天体裂隙'], category: '季节与探索', stage: '天体英雄后',
    summary: '向天体传送门开启的后期世界状态，会周期生成裂隙晶体、啃食者与致命亮茄。', obtain: ['击败天体英雄并取得启迪碎片。', '按天体阵营流程把关键物交给对应装置，选择开启裂隙。', '开启会改变世界生态；确认装备、基地防线和回档方案后再操作。'], facts: [['世界影响', '持续生成月亮阵营裂隙内容'], ['可逆性', '按当前世界设置与裂隙循环处理']], related: ['celestial-champion', 'grazer', 'deadly-brightshade']
  },
  {
    slug: 'grazer', prefab: 'lunarthrall_plant_vine_end', title: '啃食者', english: 'Grazer', category: '生物', stage: '月亮裂隙',
    summary: '保护裂隙晶体的月亮实体，会在实体化时攻击并干扰开采。', obtainType: '掉落', obtain: ['月亮裂隙开启后在裂隙晶簇附近出现。', '让其显形后击杀或用亮茄炸弹快速处理，再开采晶体。'], facts: [['阵营', '月亮'], ['机制', '实体化/非实体化']],
    combat: fight(['月亮裂隙晶簇附近生成。'], ['位面伤害武器', '亮茄炸弹或快速爆发', '位面防御'], ['等待啃食者实体化。', '集中处理一只，避免边采边打。', '清场后再开采裂隙晶体。'], ['多只同时实体化。', '位面护甲耗尽。'], [{ slug: 'pure-brilliance', name: '纯粹辉煌', amount: '裂隙资源循环' }]), related: ['brightshade-bomb', 'pure-brilliance']
  },
  {
    slug: 'deadly-brightshade', prefab: 'lunarthrall_plant', title: '致命亮茄', english: 'Deadly Brightshade', category: '生物', stage: '月亮裂隙',
    summary: '会占据玩家种植区的敌对月亮植物，是亮茄外壳的唯一稳定来源。', obtainType: '掉落', obtain: ['开启月亮裂隙后，成熟作物和浆果丛等区域可能被侵占。', '击杀致命亮茄取得亮茄外壳。'], facts: [['阵营', '月亮'], ['掉落', '亮茄外壳']],
    combat: fight(['月亮裂隙开启后侵占种植植物。'], ['位面伤害武器', '护甲', '先清理周边幼体'], ['观察根刺攻击预警。', '攻击主体后移动躲刺。', '清理残余根系再拾取。'], ['多株亮茄攻击范围重叠。'], [{ slug: 'brightshade-husk', name: '亮茄外壳', amount: '1' }]), related: ['brightshade-husk', 'brightshade-sword']
  },
  {
    slug: 'brightshade-husk', prefab: 'lunarplant_husk', title: '亮茄外壳', english: 'Brightshade Husk', category: '资源', stage: '月亮裂隙',
    summary: '击杀致命亮茄获得的核心材料，与纯粹辉煌共同制作整套亮茄装备。', obtainType: '掉落', obtain: ['开启月亮裂隙，等待致命亮茄侵占可生长植物。', '处理根刺并击杀主体后拾取外壳。', '优先用于亮茄制作站和路线所需武器护甲。'], facts: [['来源', '致命亮茄'], ['用途', '亮茄制作站配方']], related: ['deadly-brightshade', 'pure-brilliance', 'brightshade-staff']
  },
  {
    slug: 'brightshade-staff', prefab: 'staff_lunarplant', title: '亮茄魔杖', english: 'Brightshade Staff', category: '装备', stage: '亮茄制作站',
    summary: '发射自动弹射的远程位面弹体，对暗影阵营造成双倍位面伤害。',
    materials: [['pure-brilliance', '纯粹辉煌', 3], ['brightshade-husk', '亮茄外壳', 6]], station: '亮茄制作站', filter: '亮茄制作',
    obtain: ['先在天体祭坛旁制作并放置亮茄制作站。', '在站旁投入纯粹辉煌 ×3、亮茄外壳 ×6。'], facts: [['位面伤害', '10；对暗影 20'], ['耐久', '50 次'], ['弹射', '最多 5 个目标']], related: ['brightshade-husk', 'pure-brilliance', 'brightshade-helm']
  },
  {
    slug: 'brightshade-sword', prefab: 'sword_lunarplant', title: '亮茄剑', english: 'Brightshade Sword', category: '装备', stage: '亮茄制作站',
    summary: '兼具普通伤害和位面伤害的近战武器，对暗影阵营有额外加成。',
    materials: [['brightshade-husk', '亮茄外壳', 4], ['pure-brilliance', '纯粹辉煌', 3]], station: '亮茄制作站', filter: '亮茄制作',
    obtain: ['收集亮茄外壳 ×4、纯粹辉煌 ×3。', '在亮茄制作站旁直接制作；损坏后用亮茄修理包恢复。'], facts: [['伤害', '38 普通 + 30 位面'], ['耐久', '200 次']], related: ['brightshade-husk', 'pure-brilliance', 'brightshade-helm']
  },
  {
    slug: 'brightshade-helm', prefab: 'lunarplanthat', title: '亮茄头盔', english: 'Brightshade Helm', category: '装备', stage: '亮茄制作站',
    summary: '提供物理与位面防护，并强化亮茄武器的位面效果。',
    materials: [['brightshade-husk', '亮茄外壳', 4], ['pure-brilliance', '纯粹辉煌', 2]], station: '亮茄制作站', filter: '亮茄制作',
    obtain: ['在亮茄制作站旁投入亮茄外壳 ×4、纯粹辉煌 ×2。', '耐久归零后使用亮茄修理包，不会直接消失。'], facts: [['减伤', '80%'], ['位面防御', '10'], ['耐久', '830']], related: ['brightshade-armour', 'brightshade-staff']
  },
  {
    slug: 'brightshade-armour', prefab: 'armor_lunarplant', title: '亮茄盔甲', english: 'Brightshade Armor', aliases: ['亮茄甲'], category: '装备', stage: '亮茄制作站',
    summary: '身体栏月亮位面护甲，与亮茄头盔组成套装后提高对暗影敌人的保护。',
    materials: [['brightshade-husk', '亮茄外壳', 4], ['pure-brilliance', '纯粹辉煌', 2]], station: '亮茄制作站', filter: '亮茄制作',
    obtain: ['在亮茄制作站旁投入亮茄外壳 ×4、纯粹辉煌 ×2。', '战斗前检查位面防御与修理包。'], facts: [['减伤', '80%'], ['位面防御', '10'], ['耐久', '830']], related: ['brightshade-helm', 'brightshade-husk']
  },
  {
    slug: 'brightshade-bomb', prefab: 'bomb_lunarplant', title: '亮茄炸弹', english: 'Brightshade Bomb', category: '装备', stage: '亮茄制作站',
    summary: '投掷后造成高额范围位面伤害，也会伤到投掷者并摧毁结构。',
    materials: [['pure-brilliance', '纯粹辉煌', 4], ['brightshade-husk', '亮茄外壳', 4], ['infused-moon-shard', '注能月亮碎片', 1]], station: '亮茄制作站', filter: '亮茄制作', yield: 6,
    requirements: ['第三项为注能月亮碎片 ×1，可在月亮裂隙开启后由裂隙晶体取得。'], obtain: ['在亮茄制作站旁投入纯粹辉煌 ×4、亮茄外壳 ×4、注能月亮碎片 ×1。', '每次制作得到 6 枚；投掷前确认自己和建筑都在爆炸范围外。'], facts: [['位面伤害', '200'], ['产量', '6'], ['警告', '会伤害投掷者并破坏建筑']], related: ['grazer', 'brightshade-husk', 'pure-brilliance']
  }
])
