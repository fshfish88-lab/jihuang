import { buildRouteEntries, fight } from './advanced-shared'

export const seasonalEntries = buildRouteEntries('四季生存', 'seasonal-cycle', [
  {
    slug: 'winter-hat', prefab: 'winterhat', title: '冬帽', english: 'Winter Hat', category: '装备', stage: '入冬前',
    summary: '容易量产的头部保暖装备，适合第一个冬季和短途采集。',
    materials: [['beefalo-wool', '牛毛', 4], ['silk', '蜘蛛丝', 4]], station: '科学机器', filter: '服装',
    obtain: ['在科学机器旁解锁服装配方。', '投入 4 牛毛和 4 蜘蛛丝制作 1 顶。'],
    facts: [['保暖', '120'], ['耐久', '10 天佩戴时间']], uses: ['延缓冬季降温，为探索和采集争取时间。'], related: ['beefalo-wool', 'silk', 'thermal-stone']
  },
  {
    slug: 'puffy-vest', prefab: 'trunkvest_winter', title: '厚实背心', english: 'Puffy Vest', aliases: ['冬象背心'], category: '装备', stage: '冬季中期',
    summary: '高保暖身体装备，需要追踪并击杀冬象后制作。',
    materials: [['silk', '蜘蛛丝', 8], ['beefalo-wool', '牛毛', 2]], station: '炼金引擎', filter: '服装',
    requirements: ['另需冬象鼻 ×1；冬季调查可疑土堆并完成足迹追踪获得。'],
    obtain: ['冬季连续调查可疑土堆，找到并击杀冬象取得冬象鼻。', '在炼金引擎旁投入冬象鼻 ×1、蜘蛛丝 ×8、牛毛 ×2。'],
    facts: [['保暖', '240'], ['理智', '+3.3/分钟']], related: ['koalefant', 'silk', 'beefalo-wool']
  },
  {
    slug: 'rain-coat', prefab: 'raincoat', title: '雨衣', english: 'Rain Coat', category: '装备', stage: '春季前',
    summary: '身体栏防雨装备，和头部防雨装备搭配可稳定阻断潮湿。',
    materials: [['rope', '绳子', 2], ['bone-shards', '骨头碎片', 2]], station: '炼金引擎', filter: '服装',
    requirements: ['另需触手皮 ×2；击杀沼泽触手取得。'],
    obtain: ['在沼泽引诱触手攻击后走位击杀，收集 2 张触手皮。', '在炼金引擎旁投入触手皮 ×2、绳子 ×2、骨头碎片 ×2。'],
    facts: [['防水', '100%'], ['隔热', '60']], related: ['umbrella', 'rain-hat', 'bone-shards']
  },
  {
    slug: 'eyebrella', prefab: 'eyebrellahat', title: '眼球伞', english: 'Eyebrella', aliases: ['眼球帽'], category: '装备', stage: '首个冬季后',
    summary: '独眼巨鹿眼球制作的头部装备，兼顾完整防雨和夏季隔热。',
    materials: [['deerclops-eyeball', '独眼巨鹿眼球', 1], ['twigs', '树枝', 15], ['bone-shards', '骨头碎片', 4]], station: '炼金引擎', filter: '服装',
    obtain: ['击败独眼巨鹿并保留眼球。', '在炼金引擎旁投入眼球 ×1、树枝 ×15、骨头碎片 ×4。'],
    facts: [['防水', '100%'], ['隔热', '240'], ['耐久', '9 天佩戴时间']], related: ['deerclops', 'deerclops-eyeball', 'sewing-kit']
  },
  {
    slug: 'chilled-amulet', prefab: 'blueamulet', title: '寒冰护符', english: 'Chilled Amulet', category: '装备', stage: '夏季应急',
    summary: '佩戴后快速降温并恢复理智，过冷时也会造成风险。',
    materials: [['blue-gem', '蓝宝石', 1], ['gold-nugget', '金块', 3]], station: '灵子分解器', filter: '魔法',
    obtain: ['用高礼帽、木板与兔子制作灵子分解器。', '在站旁投入蓝宝石 ×1、金块 ×3。'],
    facts: [['耐久', '6 分钟'], ['理智', '+2/分钟']], related: ['blue-gem', 'top-hat', 'thermal-stone']
  },
  {
    slug: 'luxury-fan', prefab: 'featherfan', title: '羽毛扇', english: 'Luxury Fan', category: '工具', stage: '夏季降温',
    summary: '使用时大幅降低附近温度并扑灭火焰，是夏季基地的紧急降温工具。',
    materials: [['cut-reeds', '采下的芦苇', 2], ['rope', '绳子', 2]], station: '炼金引擎', filter: '服装',
    requirements: ['另需麋鹿鹅羽毛 ×5；击杀麋鹿鹅或小鸭后取得。'],
    obtain: ['春季击败麋鹿鹅或处理小鸭，收集 5 根羽毛。', '在炼金引擎旁投入羽毛 ×5、芦苇 ×2、绳子 ×2。'],
    facts: [['耐久', '15 次'], ['作用', '大范围降温并灭火']], related: ['moose-goose', 'cut-reeds', 'rope']
  },
  {
    slug: 'endothermic-fire', prefab: 'coldfire', title: '吸热营火', english: 'Endothermic Fire', category: '建筑', stage: '夏季',
    summary: '一次性冷源，可加燃料延长时间，适合离家探索时快速降温。',
    materials: [['cut-grass', '草', 3], ['nitre', '硝石', 2]], station: '科学机器原型后随身建造', filter: '照明',
    obtain: ['先在科学机器旁原型一次。', '携带草 ×3、硝石 ×2，在需要降温处放置。'],
    facts: [['燃料', '可添加硝石等燃料'], ['用途', '降温与照明']], related: ['cut-grass', 'nitre', 'endothermic-fire-pit']
  },
  {
    slug: 'endothermic-fire-pit', prefab: 'coldfirepit', title: '吸热火坑', english: 'Endothermic Fire Pit', category: '建筑', stage: '夏季基地',
    summary: '可重复点燃的固定冷源，比一次性吸热营火更适合基地。',
    materials: [['nitre', '硝石', 2], ['cut-stone', '石砖', 4], ['electrical-doodad', '电子元件', 2]], station: '炼金引擎', filter: '照明',
    obtain: ['在炼金引擎旁解锁配方。', '投入硝石 ×2、石砖 ×4、电子元件 ×2并选择安全位置放置。'],
    facts: [['结构', '可重复使用'], ['用途', '基地降温']], related: ['endothermic-fire', 'cut-stone', 'electrical-doodad']
  },
  {
    slug: 'thermal-measurer', prefab: 'winterometer', title: '温度测量仪', english: 'Thermal Measurer', aliases: ['寒冬温度计'], category: '建筑', stage: '四季基地',
    summary: '用表盘指示世界温度趋势，帮助判断过热和过冷风险。',
    materials: [['boards', '木板', 2], ['gold-nugget', '金块', 2]], station: '科学机器', filter: '科学',
    obtain: ['在科学机器旁投入木板 ×2、金块 ×2。', '放在基地常走动区域，观察指针趋势。'],
    facts: [['用途', '显示环境温度'], ['供能', '无需燃料']], related: ['boards', 'gold-nugget', 'thermal-stone']
  },
  {
    slug: 'desert-goggles', prefab: 'deserthat', title: '沙漠护目镜', english: 'Desert Goggles', category: '装备', stage: '夏季沙尘暴',
    summary: '装备后在蚁狮沙尘暴中保持正常视野和移动速度。',
    materials: [['pig-skin', '猪皮', 1]], station: '炼金引擎', filter: '服装',
    requirements: ['另需时髦护目镜 ×1、沙漠石 ×2；沙漠石通过向蚁狮进贡取得。'],
    obtain: ['在绿洲池塘钓取蓝图并向蚁狮进贡取得沙漠石。', '在炼金引擎旁投入时髦护目镜 ×1、沙漠石 ×2、猪皮 ×1。'],
    facts: [['沙尘暴', '免除减速与视野遮挡'], ['耐久', '无耐久']], related: ['antlion', 'pig-skin']
  },
  {
    slug: 'deerclops', prefab: 'deerclops', title: '独眼巨鹿', english: 'Deerclops', aliases: ['巨鹿', '冬季Boss', 'dl'], category: '生物', stage: '冬季后段',
    summary: '会主动拆毁建筑的冬季巨兽，应在吼声出现后立即引离基地。', obtainType: '掉落',
    obtain: ['默认世界中首个冬季后段可能到来，出现前会有角色警告与吼声。', '击败后固定获得独眼巨鹿眼球，并掉落肉。'],
    facts: [['生命', '4000'], ['攻击', '对玩家 75']],
    combat: fight(['冬季后段按世界计时生成，来临前有连续警告。'], ['木甲或头盔至少 2 套', '火腿棒或同级武器', '肉汤/饺子等恢复', '远离基地的空地'], ['听到警告后离开基地。', '诱导攻击，躲开冰冻范围后反击。', '保持火源并控制理智。'], ['护甲只剩一件。', '被冻住且附近有影怪。'], [{ slug: 'deerclops-eyeball', name: '独眼巨鹿眼球', amount: '1' }, { slug: 'meat', name: '肉', amount: '8' }]),
    related: ['deerclops-eyeball', 'eyebrella', 'football-helmet']
  },
  {
    slug: 'moose-goose', prefab: 'moose', title: '麋鹿鹅', english: 'Moose/Goose', aliases: ['鹿鹅', '春季Boss'], category: '生物', stage: '春季',
    summary: '春季在巢区活动的季节巨兽，会击落手持武器并保护幼崽。', obtainType: '掉落',
    obtain: ['春季在麋鹿鹅巢附近生成；部分世界也会在玩家附近生成。', '击败本体或后续小鸭可取得羽毛。'], facts: [['生命', '6000'], ['特点', '鸣叫震落手持物']],
    combat: fight(['春季麋鹿鹅巢附近生成。'], ['防雨装备', '2—3 套护甲', '备用武器放背包'], ['清空附近青蛙。', '攻击后躲开连续啄击。', '被震落武器后先拉开再拾取。'], ['雷雨造成持续潮湿。', '武器与护甲同时接近耗尽。'], [{ name: '麋鹿鹅羽毛', amount: '3—5' }, { slug: 'meat', name: '肉', amount: '6' }]), related: ['luxury-fan', 'rain-coat']
  },
  {
    slug: 'dragonfly', prefab: 'dragonfly', title: '龙蝇', english: 'Dragonfly', aliases: ['龙蜻蜓'], category: '生物', stage: '稳定基地后',
    summary: '沙漠岩浆池区域的常驻团队 Boss，暴怒和熔岩虫是主要压力。', obtainType: '掉落',
    obtain: ['在沙漠岩浆池区域找到龙蝇。', '击败后获得鳞片、宝石与龙蝇相关蓝图。'], facts: [['生命', '27500'], ['攻击', '75']],
    combat: fight(['常驻岩浆池区域，离开一定距离会脱战返回。'], ['石墙围堵熔岩虫', '排箫应对暴怒', '足量护甲与群体治疗'], ['先建墙分隔熔岩虫。', '躲地拍并稳定输出。', '暴怒时使用排箫或拉开。'], ['围墙破口无法控虫。', '多人护甲或治疗断档。'], [{ slug: 'scales', name: '鳞片', amount: '1—2' }, { name: '宝石', amount: '多种' }]), related: ['scales', 'pan-flute', 'wall-stone-item']
  },
  {
    slug: 'bearger', prefab: 'bearger', title: '熊獾', english: 'Bearger', aliases: ['熊大', '秋季Boss'], category: '生物', stage: '第二个秋季起',
    summary: '会寻找食物并大范围破坏树木与建筑的秋季巨兽，可利用其伐木。', obtainType: '掉落',
    obtain: ['默认世界从第二个秋季起可能按世界计时到来。', '击败后获得厚皮与大量肉。'], facts: [['生命', '6000'], ['特点', '地震与冲锋']],
    combat: fight(['秋季按世界计时生成，接近食物与建筑。'], ['把食物移出基地', '2—3 套护甲', '开阔树林或空地'], ['引离基地。', '可先利用冲锋砍树。', '躲地拍后反击。'], ['树精和熊獾同时仇恨。', '战场回到基地边缘。'], [{ slug: 'thick-fur', name: '厚皮', amount: '1' }, { slug: 'meat', name: '肉', amount: '8' }]), related: ['thick-fur', 'puffy-vest']
  },
  {
    slug: 'antlion', prefab: 'antlion', title: '蚁狮', english: 'Antlion', aliases: ['沙漠Boss'], category: '生物', stage: '夏季',
    summary: '绿洲沙漠的夏季生物；定期进贡可避免地表坑洞和洞穴落石。', obtainType: '交易',
    obtain: ['夏季在绿洲沙漠固定位置出现。', '先喂冰冻或加热的温度石激怒，击败后取得沙漠石和蓝图。'], facts: [['生命', '6000'], ['和平处理', '定期进贡延缓愤怒']],
    combat: fight(['仅夏季活跃，位于绿洲沙漠。'], ['沙漠护目镜', '加热或冰冻的温度石', '护甲与恢复'], ['用极端温度的温度石激怒。', '绕开沙刺圈并攻击。', '被困时打碎最薄弱沙刺。'], ['沙尘暴中没有护目镜。', '沙刺封路且生命过低。'], [{ name: '沙漠石', amount: '多块' }, { name: '懒人传送塔蓝图', amount: '1' }]), related: ['desert-goggles', 'thermal-stone']
  }
])
