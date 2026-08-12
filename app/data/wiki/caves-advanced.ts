import { buildRouteEntries, fight } from './advanced-shared'

export const advancedCaveEntries = buildRouteEntries('洞穴遗迹', 'ruins-expedition', [
  {
    slug: 'cave-entrance', prefab: 'cave_entrance', title: '洞穴入口', english: 'Plugged Sinkhole', aliases: ['落水洞'], category: '季节与探索', stage: '地表探索',
    summary: '用镐开采堵住的落水洞后进入洞穴；入口位置决定补给线长度。', obtain: ['在地表寻找被岩石封住的落水洞。', '用镐开采后从绳索进入，第一次下洞前在入口旁放备用照明和食物。'], facts: [['工具', '镐'], ['风险', '开启后黄昏与夜间可能出现蝙蝠']], related: ['pickaxe', 'lantern']
  },
  {
    slug: 'moggles', prefab: 'molehat', title: '鼹鼠帽', english: 'Moggles', category: '装备', stage: '洞穴探索',
    summary: '提供夜视效果的头部装备，适合遗迹定位，但会占用护甲头栏。',
    materials: [['moleworm', '鼹鼠', 2], ['electrical-doodad', '电子元件', 2], ['glow-berry', '发光浆果', 1]], station: '炼金引擎', filter: '照明',
    requirements: ['配方需要活鼹鼠 ×2；发光浆果由深渊蠕虫死亡后掉落。'],
    obtain: ['用锤击昏并拾取活鼹鼠，不要直接击杀。', '在炼金引擎旁投入活鼹鼠 ×2、电子元件 ×2、发光浆果 ×1。'], facts: [['耐久', '12 分钟'], ['效果', '全屏夜视']], related: ['moleworm', 'electrical-doodad', 'lantern']
  },
  {
    slug: 'mushroom-planter', prefab: 'mushroom_farm', title: '蘑菇农场', english: 'Mushroom Planter', category: '建筑', stage: '地下基地',
    summary: '种入蘑菇帽或孢子后周期产出蘑菇，需要活木维护。',
    materials: [['living-log', '活木', 1], ['manure', '粪肥', 8], ['rot', '腐烂物', 5]], station: '暗影操控器', filter: '食物与园艺',
    obtain: ['在暗影操控器旁投入活木 ×1、粪肥 ×8、腐烂物 ×5。', '种入蘑菇或孢子；耗尽后加入活木恢复产量。'], facts: [['每轮产量', '4 个蘑菇'], ['维护', '活木']], related: ['living-log', 'manure', 'rot']
  },
  {
    slug: 'batilisk', prefab: 'bat', title: '蝙蝠', english: 'Batilisk', aliases: ['洞穴蝙蝠'], category: '生物', stage: '洞穴入口',
    summary: '黄昏从开启的洞穴入口飞出，数量多时会干扰地表基地。', obtainType: '掉落', obtain: ['黄昏和夜间在已开启的洞穴入口附近等待。', '击杀后可能获得蝙蝠翅膀和鸟粪。'], facts: [['生命', '50'], ['攻击', '20']],
    combat: fight(['黄昏/夜间从落水洞飞出，洞穴内也可遇到。'], ['长矛或更好武器', '避免在入口密集区建家'], ['让第一只靠近后单次击杀。', '多只时边退边打，避免围攻。'], ['同时被三只以上包围。'], [{ name: '蝙蝠翅膀', amount: '概率掉落' }, { name: '鸟粪', amount: '概率掉落' }]), related: ['cave-entrance', 'spear']
  },
  {
    slug: 'bunnyman', prefab: 'bunnyman', title: '兔人', english: 'Bunnyman', category: '生物', stage: '洞穴中层',
    summary: '携带肉类时会主动敌对；胡萝卜可雇佣，低生命目标会遭围攻。', obtainType: '掉落', obtain: ['在洞穴兔屋群附近找到；白天多在屋内，黄昏活动。', '击杀可获得胡萝卜、肉或兔绒。'], facts: [['生命', '200'], ['仇恨', '检查玩家物品栏中的肉']],
    combat: fight(['黄昏从兔屋出现；玩家携带肉会触发敌意。'], ['把肉放下或存箱', '胡萝卜用于雇佣'], ['先清空物品栏肉类。', '用胡萝卜雇佣并让阵营互斗。', '需要击杀时逐只拉开。'], ['多只兔人追击且生命低于一半。'], [{ slug: 'carrot', name: '胡萝卜', amount: '概率' }, { slug: 'meat', name: '肉', amount: '概率' }, { name: '兔绒', amount: '概率' }]), related: ['carrot', 'meat']
  },
  {
    slug: 'depth-worm', prefab: 'worm', title: '洞穴蠕虫', english: 'Depths Worm', aliases: ['深渊蠕虫', '发光果虫'], category: '生物', stage: '洞穴中后期',
    summary: '伪装成发光浆果的洞穴猎食者，也会按洞穴袭击周期成群出现。', obtainType: '掉落', obtain: ['靠近会移动的发光浆果可引出个体。', '洞穴蠕虫袭击周期也会主动追踪玩家。'], facts: [['生命', '900'], ['攻击', '75']],
    combat: fight(['伪装发光浆果或随洞穴袭击出现。'], ['高伤武器', '2 套护甲', '开阔照明区'], ['攻击前先辨认伪装。', '躲开钻地突袭后连续反击。', '多只时保持同一攻击节奏。'], ['照明即将耗尽。', '多只攻击节奏错开无法走位。'], [{ name: '发光浆果', amount: '1' }, { slug: 'monster-meat', name: '怪物肉', amount: '4' }]), related: ['moggles', 'monster-meat']
  },
  {
    slug: 'slurper', prefab: 'slurper', title: '啜食者', english: 'Slurper', category: '生物', stage: '遗迹边缘',
    summary: '会跳到玩家头上吸取饥饿，也能作为持续照明帽使用。', obtainType: '掉落', obtain: ['在遗迹和梦魇区域寻找。', '击杀可获得灯泡与啜食者皮；也可让活体附着头部。'], facts: [['生命', '200'], ['特殊', '附着后持续消耗饥饿']],
    combat: fight(['遗迹与梦魇区域自然生成。'], ['头栏留空便于识别附着', '基础武器'], ['躲开跳扑。', '短硬直后攻击。', '被附着时右键取下或让同伴协助。'], ['低饥饿时被附着。'], [{ slug: 'light-bulb', name: '荧光果', amount: '2' }, { name: '啜食者皮', amount: '概率' }]), related: ['light-bulb', 'lantern']
  },
  {
    slug: 'splumonkey', prefab: 'monkey', title: '穴居猴', english: 'Splumonkey', aliases: ['洞穴猴'], category: '生物', stage: '遗迹边缘',
    summary: '会偷取地面和容器附近物品；梦魇阶段转化为更危险的暗影猴。', obtainType: '掉落', obtain: ['在洞穴猴桶区域找到。', '击杀可能获得香蕉、胡须和噩梦燃料。'], facts: [['生命', '125'], ['梦魇阶段', '转为暗影穴居猴']],
    combat: fight(['猴桶附近生成，梦魇阶段转化。'], ['不把贵重物品放地面', '范围伤害或逐只拉怪'], ['先清地面物资。', '非梦魇阶段可避战通过。', '需要清理时先拆猴桶再处理残余。'], ['梦魇阶段同时出现影怪。'], [{ name: '香蕉', amount: '概率' }, { slug: 'nightmare-fuel', name: '噩梦燃料', amount: '暗影形态概率' }]), related: ['nightmare-fuel', 'hammer']
  },
  {
    slug: 'ruins', prefab: 'ruins_statue_head', title: '远古遗迹', english: 'Ruins', category: '季节与探索', stage: '洞穴后期',
    summary: '洞穴深处的远古科技区域，包含梦魇周期、发条生物、科技区与迷宫。', obtain: ['携带持续照明、理智恢复和护甲深入洞穴。', '通过泥泞区和野生地形寻找遗迹地皮、远古雕像与发条生物。', '先定位科技区和出口，再进入迷宫。'], facts: [['核心风险', '梦魇周期'], ['主要收益', '铥矿与远古科技']], related: ['thulecite', 'ancient-pseudoscience-station', 'ancient-guardian']
  },
  {
    slug: 'ancient-pseudoscience-station', prefab: 'ancient_altar', title: '远古伪科学站', english: 'Ancient Pseudoscience Station', aliases: ['远古科技塔'], category: '建筑', stage: '遗迹科技区',
    summary: '遗迹中的远古制作站；完整状态解锁全部远古配方，损坏状态只解锁部分。', obtain: ['在遗迹科技区寻找损坏或完整的远古伪科学站。', '用铥矿修复损坏站后再制作高级远古装备。', '锤毁会掉落材料但也失去该制作点。'], facts: [['修复材料', '铥矿'], ['状态', '损坏 / 完整']], related: ['thulecite', 'thulecite-crown', 'deconstruction-staff']
  },
  {
    slug: 'thulecite-crown', prefab: 'ruinshat', title: '铥矿皇冠', english: 'Thulecite Crown', category: '装备', stage: '遗迹科技',
    summary: '高耐久头部护甲，受击时可能生成远古力场吸收后续伤害。',
    materials: [['thulecite', '铥矿', 4], ['nightmare-fuel', '噩梦燃料', 4]], station: '完整远古伪科学站', filter: '远古',
    obtain: ['收集铥矿和噩梦燃料并修复完整远古伪科学站。', '在站旁投入铥矿 ×4、噩梦燃料 ×4。'], facts: [['减伤', '90%'], ['耐久', '840']], related: ['thulecite', 'nightmare-fuel', 'ancient-pseudoscience-station']
  },
  {
    slug: 'thulecite-suit', prefab: 'armorruins', title: '铥矿甲', english: 'Thulecite Suit', category: '装备', stage: '遗迹科技',
    summary: '高耐久身体护甲，适合遗迹清场和高压 Boss 战。',
    materials: [['thulecite', '铥矿', 4], ['nightmare-fuel', '噩梦燃料', 4]], station: '完整远古伪科学站', filter: '远古',
    obtain: ['在遗迹收集铥矿并准备噩梦燃料。', '在完整远古伪科学站旁投入铥矿 ×4、噩梦燃料 ×4。'], facts: [['减伤', '90%'], ['耐久', '1260']], related: ['thulecite', 'nightmare-fuel', 'ancient-pseudoscience-station']
  },
  {
    slug: 'star-callers-staff', prefab: 'yellowstaff', title: '唤星者魔杖', english: "Star Caller's Staff", category: '装备', stage: '遗迹科技',
    summary: '召唤矮星提供强光、热量和烹饪，后续可用于月亮祭坛升级。',
    materials: [['nightmare-fuel', '噩梦燃料', 4], ['living-log', '活木', 2]], station: '完整远古伪科学站', filter: '远古',
    requirements: ['另需黄宝石 ×2。'], obtain: ['在遗迹雕像或远古宝箱取得黄宝石。', '在完整远古伪科学站旁投入噩梦燃料 ×4、活木 ×2、黄宝石 ×2。'], facts: [['耐久', '20 次'], ['效果', '召唤矮星']], related: ['nightmare-fuel', 'living-log', 'iridescent-gem']
  },
  {
    slug: 'deconstruction-staff', prefab: 'greenstaff', title: '解构魔杖', english: 'Deconstruction Staff', category: '装备', stage: '遗迹科技',
    summary: '拆解可制作物并返还部分原料，用于回收稀有材料和路线转化。',
    materials: [['nightmare-fuel', '噩梦燃料', 4], ['living-log', '活木', 2]], station: '完整远古伪科学站', filter: '远古',
    requirements: ['另需绿宝石 ×2。'], obtain: ['在遗迹迷宫宝箱或远古区域取得绿宝石。', '在完整远古伪科学站旁投入噩梦燃料 ×4、活木 ×2、绿宝石 ×2。'], facts: [['耐久', '5 次'], ['返还', '通常返还制作材料']], related: ['nightmare-fuel', 'living-log', 'ancient-pseudoscience-station']
  },
  {
    slug: 'ancient-guardian', prefab: 'minotaur', title: '远古守护者', english: 'Ancient Guardian', aliases: ['犀牛', 'ag'], category: '生物', stage: '遗迹迷宫',
    summary: '遗迹迷宫尽头的冲撞 Boss，击败后可开启大型华丽箱。', obtainType: '掉落', obtain: ['穿过遗迹迷宫找到远古守护者。', '击败后获得守护者之角、肉和通往大型华丽箱的战利品。'], facts: [['生命', '10000'], ['主要攻击', '冲撞']],
    combat: fight(['位于遗迹迷宫区域。'], ['持续照明', '多套 90% 护甲', '清理战场柱体与梦魇生物'], ['先照亮并清场。', '横向避开冲撞，让其撞墙硬直。', '硬直期间输出，避免站在正前方。'], ['梦魇阶段开启且照明不足。', '冲撞路线连回未清理区域。'], [{ slug: 'guardian-horn', name: '守护者之角', amount: '1' }, { slug: 'meat', name: '肉', amount: '8' }]), related: ['guardian-horn', 'thulecite-crown', 'ruins']
  }
])
