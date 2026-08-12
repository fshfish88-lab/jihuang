import { buildRouteEntries, fight } from './advanced-shared'

export const bossCombatEntries = buildRouteEntries('Boss战备', 'boss-logistics', [
  {
    slug: 'tentacle-spike', prefab: 'tentaclespike', title: '触手尖刺', english: 'Tentacle Spike', category: '装备', stage: '前期武器',
    summary: '沼泽触手概率掉落的高伤武器，无需制作站即可获得。', obtainType: '掉落', obtain: ['在沼泽找到触手，利用鱼人、蜘蛛或走位让其死亡。', '触手尖刺不是必掉；拾取前确认附近没有第二只触手。'], facts: [['伤害', '51'], ['耐久', '100 次']], uses: ['作为前中期 Boss 战的低成本高伤武器。'], related: ['spear', 'hambat']
  },
  {
    slug: 'night-armour', prefab: 'armor_sanity', title: '暗夜甲', english: 'Night Armour', category: '装备', stage: '魔法战备',
    summary: '高减伤身体护甲，受击会额外损失理智，适合短时高压战斗。',
    materials: [['nightmare-fuel', '噩梦燃料', 5], ['papyrus', '莎草纸', 3]], station: '暗影操控器', filter: '魔法',
    obtain: ['用噩梦燃料和活木建立暗影操控器。', '在站旁投入噩梦燃料 ×5、莎草纸 ×3。', '另备理智恢复，避免受击后同时处理影怪。'], facts: [['减伤', '95%'], ['耐久', '525']], related: ['nightmare-fuel', 'papyrus', 'dark-sword']
  },
  {
    slug: 'marble-suit', prefab: 'armormarble', title: '大理石甲', english: 'Marble Suit', category: '装备', stage: '定点战斗',
    summary: '高减伤但严重降低移速，适合能站撸或有队友控场的战斗。',
    materials: [['marble', '大理石', 12], ['rope', '绳子', 4]], station: '炼金引擎', filter: '战斗',
    obtain: ['开采大理石树或棋盘区雕像取得大理石。', '在炼金引擎旁投入大理石 ×12、绳子 ×4。'], facts: [['减伤', '95%'], ['耐久', '735'], ['移速', '-30%']], related: ['marble', 'rope', 'football-helmet']
  },
  {
    slug: 'bee-mine', prefab: 'beemine', title: '蜜蜂地雷', english: 'Bee Mine', category: '工具', stage: '陷阱准备',
    summary: '目标踩中后释放蜜蜂攻击附近生物，适合预设场地而非临场投掷。',
    materials: [['boards', '木板', 1], ['bee', '蜜蜂', 4], ['flint', '燧石', 1]], station: '科学机器', filter: '战斗',
    obtain: ['用捕虫网捕捉 4 只活蜜蜂。', '在科学机器旁投入木板 ×1、蜜蜂 ×4、燧石 ×1。', '提前布置在不会误触的战场路径。'], facts: [['触发', '释放 4 只蜜蜂'], ['用途', '区域干扰']], related: ['bee', 'bug-net', 'boards']
  },
  {
    slug: 'tooth-trap', prefab: 'trap_teeth', title: '犬牙陷阱', english: 'Tooth Trap', category: '工具', stage: '猎犬与Boss场地',
    summary: '可重置的地面伤害陷阱，密集铺设后能承担猎犬潮和部分 Boss 输出。',
    materials: [['log', '木头', 1], ['rope', '绳子', 1], ['hound-tooth', '犬牙', 1]], station: '炼金引擎', filter: '战斗',
    obtain: ['击杀猎犬积累犬牙。', '在炼金引擎旁每份投入木头 ×1、绳子 ×1、犬牙 ×1。', '按棋盘间距铺设并在触发后右键重置。'], facts: [['伤害', '60'], ['耐久', '10 次']], related: ['hound-tooth', 'hound', 'rope']
  },
  {
    slug: 'pan-flute', prefab: 'panflute', title: '排箫', english: 'Pan Flute', category: '工具', stage: 'Boss控场',
    summary: '吹奏后让附近多数生物睡眠，是打断龙蝇暴怒和团队重整的关键工具。',
    materials: [['cut-reeds', '采下的芦苇', 5], ['mandrake', '曼德拉草', 1], ['rope', '绳子', 1]], station: '灵子分解器', filter: '魔法',
    obtain: ['在地表寻找曼德拉草，白天采集以避免其跟随。', '在灵子分解器旁投入芦苇 ×5、曼德拉草 ×1、绳子 ×1。', '世界也可能自然生成一支排箫。'], facts: [['耐久', '10 次'], ['效果', '范围催眠']], related: ['mandrake', 'cut-reeds', 'dragonfly']
  },
  {
    slug: 'weather-pain', prefab: 'staff_tornado', title: '天气风向标', english: 'Weather Pain', category: '装备', stage: '高阶范围输出',
    summary: '发射移动龙卷风造成多段范围伤害，适合大型目标和密集障碍。',
    materials: [['gears', '齿轮', 1], ['cut-reeds', '采下的芦苇', 10]], station: '暗影操控器', filter: '魔法',
    requirements: ['另需麋鹿鹅羽毛 ×10。'], obtain: ['春季击败麋鹿鹅及小鸭收集 10 根羽毛。', '在暗影操控器旁投入羽毛 ×10、齿轮 ×1、芦苇 ×10。'], facts: [['耐久', '15 次'], ['伤害', '每个龙卷风多段']], related: ['moose-goose', 'gears', 'cut-reeds']
  },
  {
    slug: 'bee-queen', prefab: 'beequeen', title: '蜂后', english: 'Bee Queen', aliases: ['bq'], category: '生物', stage: '稳定基地后',
    summary: '巨型蜂巢 Boss，以大量嗡嗡蜜蜂和后期恐慌技能压迫队伍。', obtainType: '掉落', obtain: ['用锤连续敲击巨型蜂巢，使蜂后出现。', '击败后取得蜂王冠、捆绑包装蓝图和蜂王浆。'], facts: [['生命', '22500'], ['阶段', '4']],
    combat: fight(['锤击巨型蜂巢后主动召唤。'], ['减速或围栏场地', '大量护甲与治疗', '多人分工清杂'], ['拉开蜂群后输出蜂后。', '及时清理或控制嗡嗡蜜蜂。', '后期恐慌时保持队形和退路。'], ['治疗不足以覆盖下一轮冲锋。', '蜂群完全切断退路。'], [{ slug: 'royal-jelly', name: '蜂王浆', amount: '6—7' }, { name: '蜂王冠', amount: '1' }, { name: '捆绑包装蓝图', amount: '1' }]), related: ['royal-jelly', 'jellybeans', 'bee-mine']
  },
  {
    slug: 'klaus', prefab: 'klaus', title: '克劳斯', english: 'Klaus', aliases: ['袋子Boss'], category: '生物', stage: '冬季中后期',
    summary: '用鹿角钥匙开启赃物袋召唤；不能击杀两只宝石鹿，否则会强化。', obtainType: '掉落', obtain: ['冬季寻找无眼鹿群和赃物袋。', '让无眼鹿撞树掉落鹿角钥匙，用钥匙开启赃物袋。', '击败后开启赃物袋领取多组战利品。'], facts: [['生命', '10000 × 2 阶段'], ['关键', '保留两只宝石鹿']],
    combat: fight(['冬季用鹿角钥匙开启赃物袋。'], ['保暖装备', '多套护甲', '处理火/冰鹿法阵的走位空间'], ['把克劳斯与宝石鹿拉开但不击杀鹿。', '躲咬击后输出。', '第二阶段优先躲跃击与连续攻击。'], ['误杀宝石鹿导致狂暴。', '第二阶段护甲不足。'], [{ name: '鹿茸', amount: '1' }, { name: '赃物袋战利品', amount: '4 组' }]), related: ['walking-cane', 'pan-flute']
  },
  {
    slug: 'toadstool', prefab: 'toadstool', title: '蟾蜍王', english: 'Toadstool', aliases: ['蛤蟆', '蘑菇Boss'], category: '生物', stage: '洞穴后期',
    summary: '洞穴蘑菇林的高生命 Boss，必须快速砍掉孢子帽以限制防御成长。', obtainType: '掉落', obtain: ['在洞穴三色蘑菇林寻找带洞池塘。', '用斧头砍动可疑蘑菇帽召唤。'], facts: [['生命', '52500'], ['核心机制', '孢子帽增防与爆炸']],
    combat: fight(['洞穴蘑菇林的特殊池塘召唤。'], ['多把高效斧', '持续照明', '大量武器护甲与食物'], ['出现孢子帽立即分工砍除。', '避开震地和爆炸区域。', '利用僵直窗口集中输出。'], ['孢子帽累积过多。', '照明和斧头同时断档。'], [{ name: '蘑菇皮', amount: '1—3' }, { slug: 'meat', name: '肉', amount: '多块' }]), related: ['weather-pain', 'lantern']
  },
  {
    slug: 'crab-king', prefab: 'crabking', title: '帝王蟹', english: 'Crab King', category: '生物', stage: '航海后期',
    summary: '海上礁石 Boss，嵌入不同宝石会改变技能和强度；战斗重心是修船与清爪。', obtainType: '掉落', obtain: ['在外海找到沉睡的帝王蟹礁石。', '向插槽放入 9 颗宝石后唤醒；宝石组合影响战斗。'], facts: [['生命', '受宝石配置影响'], ['场地', '必须乘船']],
    combat: fight(['在帝王蟹结构嵌入 9 颗宝石后激活。'], ['多组船补丁', '降温/破冰手段', '远程或快速清爪工具'], ['把船停在可攻击又能转向的位置。', '优先清理蟹爪并修补漏点。', '出现冰墙时打通撤离方向。'], ['船体多处漏水。', '冰墙与蟹爪同时封锁。'], [{ name: '帝王蟹相关蓝图与材料', amount: '按宝石配置' }]), related: ['boat-patch', 'anchor', 'weather-pain']
  },
  {
    slug: 'malbatross', prefab: 'malbatross', title: '邪天翁', english: 'Malbatross', category: '生物', stage: '海洋探索',
    summary: '鱼群海域出现的海洋 Boss，会制造海浪并啄击船体。', obtainType: '掉落', obtain: ['在深海寻找大型鱼群并持续捕鱼，提高邪天翁出现机会。', '击败后获得羽毛和喙，用于高级航海物品。'], facts: [['生命', '5000'], ['威胁', '海浪与船体伤害']],
    combat: fight(['大型鱼群区域捕鱼时可能生成。'], ['船补丁', '锚和船桨', '近战武器与防水'], ['抛锚稳定战场。', '避开扇形海浪。', '靠近船缘攻击降落的邪天翁。'], ['连续海浪把船推离鱼群。', '船体出现多个漏点。'], [{ name: '邪天翁羽毛', amount: '多根' }, { name: '邪天翁喙', amount: '1' }]), related: ['boat-patch', 'anchor', 'oar']
  },
  {
    slug: 'eye-of-terror', prefab: 'eyeofterror', title: '恐怖之眼', english: 'Eye of Terror', category: '生物', stage: '联动Boss',
    summary: '通过泰拉瑞亚联动物品召唤的夜间 Boss，会生成眼球草并切换冲撞阶段。', obtainType: '掉落', obtain: ['夜间使用装有泰拉瑞亚物品的可疑窥视者召唤。', '击败后获得乳白物和眼面具相关材料。'], facts: [['生命', '5000'], ['时间限制', '天亮会离开']],
    combat: fight(['夜间激活泰拉瑞亚联动物品召唤。'], ['提前清场', '高伤武器', '护甲和移速'], ['优先清理眼球草。', '横向躲避冲撞。', '在天亮前保持输出。'], ['剩余夜晚不足。', '眼球草大量占据走位区。'], [{ name: '乳白物', amount: '1' }, { name: '眼面具', amount: '1' }]), related: ['football-helmet', 'hambat']
  },
  {
    slug: 'twins-of-terror', prefab: 'twinofterror1', title: '双子魔眼', english: 'Twins of Terror', aliases: ['双子眼'], category: '生物', stage: '联动高阶Boss',
    summary: '两只拥有独立阶段的夜间 Boss；控制转阶段顺序比同时压血更安全。', obtainType: '掉落', obtain: ['先击败恐怖之眼并取得相关召唤材料。', '夜间使用恐怖装置召唤双子魔眼。'], facts: [['生命', '两只独立生命'], ['时间限制', '天亮离开']],
    combat: fight(['夜间激活恐怖装置召唤。'], ['长夜季节', '高移速', '充足护甲与恢复'], ['集中攻击一只，避免两只同时进入第二阶段。', '保持大圆走位避开冲锋和弹幕。', '击杀第一只后处理第二只。'], ['两只同时二阶段。', '天亮临近且输出不足。'], [{ name: '盾牌与武器蓝图材料', amount: '固定战利品' }]), related: ['eye-of-terror', 'walking-cane']
  },
  {
    slug: 'ancient-fuelweaver', prefab: 'stalker_atrium', title: '远古织影者', english: 'Ancient Fuelweaver', aliases: ['织影者', 'afw'], category: '生物', stage: '暗影主线终点',
    summary: '远古大门后的暗影主线 Boss，需要化石骨架、暗影心房和完整控制流程。', obtainType: '掉落', obtain: ['在远古大门区域拼出正确化石骨架。', '对骨架使用暗影心房召唤。', '击败后解锁暗影裂隙路线。'], facts: [['生命', '16000'], ['限制', '战斗区域有骨笼与治疗机制']],
    combat: fight(['远古大门旁完整化石骨架使用暗影心房。'], ['懒人护符或快速拾取', '控制骨笼手段', '高伤武器与理智恢复'], ['躲骨笼并破坏召唤手。', '快速清理编织暗影，阻止 Boss 治疗。', '输出阶段集中攻击，循环处理机制。'], ['编织暗影开始大量回血。', '骨笼与影怪同时失控。'], [{ name: '暗影中庭相关战利品', amount: '固定' }]), related: ['nightmare-fuel', 'shadow-rift', 'sanctum']
  }
])
